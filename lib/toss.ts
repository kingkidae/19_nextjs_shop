import "server-only";

// 토스페이먼츠 코어 API (결제위젯 시크릿 키 test_gsk_/live_gsk_ 사용). 시크릿 키는 서버에서만 사용
const API = "https://api.tosspayments.com/v1/payments";

function headers(idempotencyKey?: string) {
  const secret = process.env.TOSS_PAYMENTS_SECRET;
  if (!secret) throw new Error("TOSS_PAYMENTS_SECRET 환경변수가 없습니다");
  return {
    // 시크릿 키 뒤에 콜론(:)을 붙여 base64 인코딩
    Authorization: `Basic ${Buffer.from(`${secret}:`).toString("base64")}`,
    "Content-Type": "application/json",
    ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
  };
}

type TossError = { code?: string; message?: string; error?: { code?: string; message?: string } };
const errorOf = (b: TossError) => ({ code: b.code ?? b.error?.code ?? "UNKNOWN", message: b.message ?? b.error?.message ?? "결제 처리 중 오류가 발생했습니다" });

/** 결제 승인. 구매자 인증 후 10분 안에 호출해야 함 */
export async function confirmPayment(paymentKey: string, orderId: string, amount: number) {
  const res = await fetch(`${API}/confirm`, { method: "POST", headers: headers(), body: JSON.stringify({ paymentKey, orderId, amount }), cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false as const, ...errorOf(body) };
  return { ok: true as const, method: String(body.method ?? "토스페이먼츠"), status: String(body.status) };
}

/** 승인된 결제 전액 취소(환불) */
export async function cancelPayment(paymentKey: string, reason: string) {
  const res = await fetch(`${API}/${encodeURIComponent(paymentKey)}/cancel`, {
    method: "POST",
    headers: headers(`cancel-${paymentKey}`),
    body: JSON.stringify({ cancelReason: reason.slice(0, 200) }),
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  return res.ok ? { ok: true as const } : { ok: false as const, ...errorOf(body) };
}
