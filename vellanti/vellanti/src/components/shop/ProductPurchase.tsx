"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatKRW, type Product } from "@/lib/data";
import { useCart } from "./CartProvider";

export function ProductPurchase({ product }: { product: Product }) {
  const { add, wishlist, toggleWish } = useCart();
  const [color, setColor] = useState(product.colors[0].name);
  const [open, setOpen] = useState<string | null>("상품 상세 정보");
  const [added, setAdded] = useState(false);
  const soldOut = product.status === "품절" || product.stock === 0;
  const wished = wishlist.includes(product.id);

  const sections: { title: string; body: React.ReactNode }[] = [
    {
      title: "상품 상세 정보",
      body: (
        <>
          <p>{product.description}</p>
          <ul className="mt-4 flex flex-col gap-1">
            {product.details.map((d) => (
              <li key={d}>· {d}</li>
            ))}
          </ul>
        </>
      ),
    },
    { title: "소재 및 관리", body: <p>직사광선과 습기를 피해 보관하고, 부드러운 마른 천으로 가볍게 닦아 주세요. 함께 제공되는 더스트 백에 보관하는 것을 권장합니다.</p> },
    { title: "배송 및 반품", body: <p>전 상품 무료 배송되며 결제 후 2~4 영업일 이내 도착합니다. 수령 후 14일 이내 무료 반품이 가능합니다.</p> },
    { title: "이니셜 서비스", body: <p>최대 3자의 이니셜을 골드 또는 실버 엠보싱으로 새길 수 있습니다. 이니셜 상품은 교환·반품이 불가합니다.</p> },
    { title: "매장 재고 확인", body: <p>청담 플래그십 · 롯데 본점 · 신세계 강남 부티크에서 재고를 확인할 수 있습니다.</p> },
  ];

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2.5">
        {product.tag && <span className="text-[11px] font-medium text-ink-2">{product.tag}</span>}
        <h1 className="text-[22px] font-bold leading-snug tracking-[-0.01em] lg:text-[28px]">{product.name}</h1>
        <p className="num text-[16px] font-medium">{formatKRW(product.price)}</p>
        <p className="text-[12px] text-ink-2">스타일 번호 {product.styleNo}</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-medium">색상: {color}</p>
        <div className="flex gap-3" role="radiogroup" aria-label="색상 선택">
          {product.colors.map((c) => (
            <button
              key={c.name}
              role="radio"
              aria-checked={color === c.name}
              aria-label={c.name}
              onClick={() => setColor(c.name)}
              className={`grid size-9 place-items-center rounded-full border ${color === c.name ? "border-ink" : "border-transparent"}`}
            >
              <span className="size-7 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <Button
          className="h-[52px] w-full"
          disabled={soldOut}
          onClick={() => {
            add(product.id, color);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
        >
          {soldOut ? "품절" : added ? <><Icon name="check" size={18} />쇼핑백에 담았습니다</> : "쇼핑백에 추가"}
        </Button>
        <Button variant="secondary" className="h-[52px] w-full" onClick={() => toggleWish(product.id)}>
          <Icon name="heart" size={18} className={wished ? "fill-current" : ""} />
          {wished ? "위시리스트에 담김" : "위시리스트에 추가"}
        </Button>
      </div>

      <ul className="flex flex-col gap-3">
        {[
          ["truck", "무료 배송 및 무료 반품"],
          ["location", "매장 픽업 가능 · 서울 3개 부티크 재고 있음"],
          ["gift", "시그니처 기프트 박스 무료 포장"],
        ].map(([icon, label]) => (
          <li key={label} className="flex items-center gap-2.5 text-[13px]">
            <Icon name={icon as "truck"} size={20} />
            {label}
          </li>
        ))}
      </ul>

      <div className="border-b border-line">
        {sections.map((s) => {
          const isOpen = open === s.title;
          return (
            <div key={s.title} className="border-t border-line">
              <button className="flex w-full items-center justify-between py-5" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.title)}>
                <span className="cta">{s.title}</span>
                <Icon name={isOpen ? "minus" : "plus"} size={20} />
              </button>
              {isOpen && <div className="pb-6 text-[13px] leading-relaxed text-ink-2">{s.body}</div>}
            </div>
          );
        })}
      </div>

      <a href="#" className="flex items-center gap-2.5">
        <Icon name="chat" size={20} />
        <span className="cta underline underline-offset-4">클라이언트 어드바이저와 상담하기</span>
      </a>
    </div>
  );
}
