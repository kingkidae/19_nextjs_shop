"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Checkbox, Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { ArtBox } from "@/components/ui/ProductArt";
import { formatKRW } from "@/lib/data";
import { useCart } from "./CartProvider";

export function CartView() {
  const { lines, count, subtotal, setQty, remove, toggleWish } = useCart();

  if (lines.length === 0) {
    return (
      <main className="flex flex-col items-center gap-5 px-5 py-32 text-center">
        <Icon name="bag" size={40} />
        <h1 className="text-[22px] font-bold">쇼핑백이 비어 있습니다</h1>
        <p className="text-[13px] text-ink-2">마음에 드는 상품을 쇼핑백에 담아 보세요.</p>
        <ButtonLink href="/products">쇼핑 계속하기</ButtonLink>
      </main>
    );
  }

  return (
    <main className="px-5 pb-24 lg:px-10 lg:pb-[120px]">
      <div className="flex items-end gap-3 pt-8 pb-6 lg:pt-12 lg:pb-8">
        <h1 className="text-[22px] font-bold tracking-[-0.01em] lg:text-[28px]">쇼핑백</h1>
        <span className="pb-1 text-[13px] text-ink-2">{count}개 상품</span>
      </div>
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <section className="flex-1 border-t border-ink" aria-label="담은 상품">
          {lines.map((l) => (
            <article key={l.productId + l.color} className="flex gap-4 border-b border-line py-6 lg:gap-7 lg:py-7">
              <Link href={`/products/${l.productId}`} className="w-[104px] shrink-0 lg:w-40">
                <ArtBox name={l.product.art} className="aspect-[4/5] w-full" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 lg:flex-row lg:gap-6">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Link href={`/products/${l.productId}`} className="text-[15px] font-medium leading-snug lg:text-[16px]">{l.product.name}</Link>
                  <p className="text-[12px] text-ink-2">스타일 번호 {l.product.styleNo}</p>
                  <p className="text-[12px] text-ink-2">색상: {l.color}</p>
                  <div className="mt-3 inline-flex w-fit items-center gap-5 border border-line px-3 py-2">
                    <button aria-label="수량 감소" onClick={() => setQty(l.productId, l.color, l.qty - 1)}><Icon name="minus" size={16} /></button>
                    <span className="num min-w-3 text-center text-[13px]" aria-live="polite">{l.qty}</span>
                    <button aria-label="수량 증가" onClick={() => setQty(l.productId, l.color, l.qty + 1)}><Icon name="plus" size={16} /></button>
                  </div>
                </div>
                <div className="mt-3 flex items-end justify-between lg:mt-0 lg:flex-col lg:items-end">
                  <p className="num text-[14px] font-medium">{formatKRW(l.product.price * l.qty)}</p>
                  <div className="flex gap-4">
                    <button className="cta underline underline-offset-4" onClick={() => { toggleWish(l.productId); remove(l.productId, l.color); }}>위시리스트로 이동</button>
                    <button className="cta underline underline-offset-4" onClick={() => remove(l.productId, l.color)}>삭제</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          <div className="mt-6 flex items-center gap-4 bg-subtle px-5 py-5 lg:px-6">
            <Checkbox defaultChecked label={<span className="flex flex-col"><span className="font-medium">선물 포장 및 메시지 카드 추가 (무료)</span><span className="text-[12px] text-ink-2">시그니처 기프트 박스와 리본으로 포장해 드립니다.</span></span>} />
          </div>
        </section>

        <aside className="flex flex-col gap-4 bg-subtle p-6 lg:sticky lg:top-6 lg:w-[440px] lg:p-8" aria-label="주문 요약">
          <h2 className="h2">주문 요약</h2>
          {[
            ["소계", formatKRW(subtotal)],
            ["배송비", "무료"],
            ["선물 포장", "무료"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-[13px]">
              <span className="text-ink-2">{k}</span>
              <span className="num">{v}</span>
            </div>
          ))}
          <hr className="border-line" />
          <div className="flex items-center justify-between">
            <span className="cta">합계</span>
            <span className="num text-[24px] font-semibold lg:text-[28px]">{formatKRW(subtotal)}</span>
          </div>
          <p className="text-[12px] text-ink-2">부가세 포함 · 최대 12개월 무이자 할부 가능</p>
          <Field label="프로모션 코드" placeholder="코드를 입력하세요" />
          {/* 토스페이먼츠 결제 페이지로 이동 (로그인 필요) */}
          <ButtonLink href="/checkout" className="h-[52px] w-full">주문하기</ButtonLink>
          <div className="flex flex-col gap-1 pt-2">
            <p className="text-[13px] font-medium">도움이 필요하신가요?</p>
            <p className="text-[12px] text-ink-2">클라이언트 서비스센터 02-0000-0000 · 실시간 채팅</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
