import type { Metadata } from "next";
import { Suspense } from "react";
import { ClearCart } from "@/components/shop/CartProvider";
import { Header } from "@/components/shop/Header";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatKRW } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "결제 완료" };

export default function CompletePage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  return (
    <>
      <Header />
      <Suspense fallback={<main className="min-h-dvh" />}>
        <Result searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Result({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId = "" } = await searchParams;
  const sb = await createClient();
  // RLS: 본인 주문서·주문만 조회됨
  const [{ data: checkout }, { data: orders }] = await Promise.all([
    sb.from("checkouts").select("amount, order_name, method, status").eq("id", orderId).maybeSingle(),
    sb.from("orders").select("no").eq("checkout_id", orderId).order("no"),
  ]);

  if (checkout?.status !== "paid")
    return (
      <main className="flex flex-col items-center gap-5 px-5 py-32 text-center">
        <h1 className="text-[22px] font-bold">결제 내역을 찾을 수 없습니다</h1>
        <ButtonLink href="/mypage">마이페이지로</ButtonLink>
      </main>
    );

  return (
    <main className="mx-auto flex max-w-[560px] flex-col items-center gap-5 px-5 py-24 text-center lg:py-32">
      <ClearCart />
      <Icon name="check" size={44} />
      <h1 className="text-[24px] font-bold">결제가 완료되었습니다</h1>
      <dl className="grid w-full grid-cols-[96px_1fr] gap-y-3 border-y border-line py-6 text-left text-[13px]">
        <dt className="text-ink-2">주문 상품</dt>
        <dd>{checkout.order_name}</dd>
        <dt className="text-ink-2">결제 금액</dt>
        <dd className="num font-semibold">{formatKRW(checkout.amount)}</dd>
        <dt className="text-ink-2">결제 수단</dt>
        <dd>{checkout.method}</dd>
        <dt className="text-ink-2">주문번호</dt>
        <dd className="num flex flex-col">{orders?.map((o) => <span key={o.no}>{o.no}</span>)}</dd>
      </dl>
      <div className="flex gap-3">
        <ButtonLink href="/mypage">주문 내역 보기</ButtonLink>
        <ButtonLink href="/products" variant="secondary">쇼핑 계속하기</ButtonLink>
      </div>
    </main>
  );
}
