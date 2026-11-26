"use client";

import { ANONYMOUS, loadTossPayments, type TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ArtBox } from "@/components/ui/ProductArt";
import { createCheckout, type Checkout } from "@/lib/actions";
import { formatKRW } from "@/lib/data";
import { useCart } from "./CartProvider";

export function CheckoutView() {
  const { ready, lines, subtotal } = useCart();
  const router = useRouter();
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const started = useRef(false); // 개발 모드에서 effect 가 두 번 실행돼도 주문서·위젯은 한 번만 생성
  const [checkout, setCheckout] = useState<Checkout | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!ready || started.current || lines.length === 0) return;
    started.current = true;
    (async () => {
      const res = await createCheckout(lines.map(({ productId, color, qty }) => ({ productId, color, qty })));
      if (res.login) return router.replace("/login?next=/checkout");
      if (res.error || !res.checkout) return setError(res.error ?? "주문서를 만들지 못했습니다");
      setCheckout(res.checkout);
      try {
        const toss = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);
        const widgets = toss.widgets({ customerKey: ANONYMOUS });
        // 금액은 서버(DB)가 계산한 주문서 금액만 사용
        await widgets.setAmount({ currency: "KRW", value: res.checkout.amount });
        await Promise.all([widgets.renderPaymentMethods({ selector: "#payment-method" }), widgets.renderAgreement({ selector: "#agreement" })]);
        widgetsRef.current = widgets;
        setWidgetReady(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "결제 화면을 불러오지 못했습니다");
      }
    })();
  }, [ready, lines, router]);

  const pay = async () => {
    if (!widgetsRef.current || !checkout) return;
    setPaying(true);
    try {
      await widgetsRef.current.requestPayment({
        orderId: checkout.id,
        orderName: checkout.orderName,
        successUrl: `${location.origin}/checkout/success`,
        failUrl: `${location.origin}/checkout/fail`,
      });
    } catch (e) {
      // 구매자가 결제창을 닫은 경우 등: 같은 주문서로 다시 시도 가능
      setError(e instanceof Error ? e.message : "결제를 진행하지 못했습니다");
      setPaying(false);
    }
  };

  if (ready && lines.length === 0 && !checkout)
    return (
      <main className="flex flex-col items-center gap-5 px-5 py-32 text-center">
        <h1 className="text-[22px] font-bold">결제할 상품이 없습니다</h1>
        <ButtonLink href="/products">쇼핑 계속하기</ButtonLink>
      </main>
    );

  return (
    <main className="px-5 pb-24 lg:px-10 lg:pb-[120px]">
      <div className="flex items-end gap-3 pt-8 pb-6 lg:pt-12 lg:pb-8">
        <h1 className="text-[22px] font-bold tracking-[-0.01em] lg:text-[28px]">주문 · 결제</h1>
      </div>
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <section className="flex-1 border-t border-ink" aria-label="주문 상품">
          {lines.map((l) => (
            <article key={l.productId + l.color} className="flex gap-4 border-b border-line py-5">
              <ArtBox name={l.product.art} className="aspect-[4/5] w-[72px] shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-[14px] font-medium">{l.product.name}</p>
                <p className="text-[12px] text-ink-2">색상: {l.color} · 수량 {l.qty}</p>
                <p className="num mt-auto text-[13px]">{formatKRW(l.product.price * l.qty)}</p>
              </div>
            </article>
          ))}
          <div className="flex items-center justify-between py-5">
            <span className="cta">결제 금액</span>
            <span className="num text-[24px] font-semibold">{formatKRW(checkout?.amount ?? subtotal)}</span>
          </div>
        </section>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:w-[480px]" aria-label="결제 수단">
          <h2 className="h2">결제 수단</h2>
          {!widgetReady && !error && <p className="py-10 text-center text-[13px] text-ink-2">결제 화면을 불러오는 중…</p>}
          {/* 토스페이먼츠 결제위젯이 그려지는 자리 */}
          <div id="payment-method" />
          <div id="agreement" />
          {error && (
            <p role="alert" className="text-[12px] text-danger">
              {error}
            </p>
          )}
          <Button className="h-[52px] w-full" disabled={!widgetReady || paying} onClick={pay}>
            {paying ? "결제 진행 중…" : `${formatKRW(checkout?.amount ?? 0)} 결제하기`}
          </Button>
          <p className="text-[12px] text-ink-2">테스트 결제 환경입니다. 실제 금액이 청구되지 않습니다.</p>
        </aside>
      </div>
    </main>
  );
}
