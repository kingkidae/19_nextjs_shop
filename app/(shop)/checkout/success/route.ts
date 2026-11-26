import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { cancelPayment, confirmPayment } from "@/lib/toss";

// 토스 결제 인증 성공 후 돌아오는 곳(successUrl): 금액 검증 → 결제 승인 → 주문 확정
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const paymentKey = searchParams.get("paymentKey") ?? "";
  const orderId = searchParams.get("orderId") ?? "";
  const amount = Number(searchParams.get("amount"));
  const fail = (message: string) => NextResponse.redirect(`${origin}/checkout/fail?message=${encodeURIComponent(message)}`);
  const done = () => NextResponse.redirect(`${origin}/checkout/complete?orderId=${encodeURIComponent(orderId)}`);

  if (!paymentKey || !/^[A-Za-z0-9_=-]{6,64}$/.test(orderId) || !Number.isInteger(amount)) return fail("결제 정보가 올바르지 않습니다");

  // 승인 전에 확인: 주문 확정용 서버 키가 없으면 결제만 되고 주문이 안 생기므로 승인하지 않음
  const admin = createAdminClient();
  if (!admin) {
    console.error("[결제] SUPABASE_SECRET_KEY 환경변수가 없습니다");
    return fail("결제 설정이 완료되지 않았습니다. 관리자에게 문의해 주세요.");
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return fail("로그인이 필요합니다");

  // RLS: 본인 주문서만 조회됨
  const { data: checkout } = await sb.from("checkouts").select("amount, status").eq("id", orderId).maybeSingle();
  if (!checkout) return fail("주문서를 찾을 수 없습니다");
  if (checkout.status === "paid") return done();
  // 금액이 다르면 승인하지 않음 (승인하지 않은 결제는 자동 만료)
  if (checkout.amount !== amount) return fail("결제 금액이 주문 금액과 다릅니다");

  const confirmed = await confirmPayment(paymentKey, orderId, checkout.amount);
  if (!confirmed.ok) return fail(confirmed.message);

  const { error } = await admin.rpc("complete_checkout", { p_id: orderId, p_payment_key: paymentKey, p_method: confirmed.method });
  if (error) {
    // 결제는 됐는데 주문 확정 실패(예: 그 사이 재고 소진) → 전액 취소
    const refund = await cancelPayment(paymentKey, `주문 처리 실패: ${error.message}`);
    if (!refund.ok) console.error("[결제] 자동 취소 실패 — 수동 환불 필요", { orderId, paymentKey, refund });
    return fail(refund.ok ? `${error.message} — 결제가 자동으로 취소되었습니다` : `${error.message} — 고객센터로 문의해 주세요`);
  }

  revalidateTag("products", { expire: 0 }); // 재고 즉시 반영
  return done();
}
