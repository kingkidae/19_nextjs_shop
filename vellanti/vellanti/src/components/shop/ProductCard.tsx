"use client";

import Link from "next/link";
import { formatKRW, type Product } from "@/lib/data";
import { Icon } from "@/components/ui/Icon";
import { ArtBox } from "@/components/ui/ProductArt";
import { useCart } from "./CartProvider";

export function ProductCard({ product, tone = "subtle", showTag = true }: { product: Product; tone?: "subtle" | "canvas"; showTag?: boolean }) {
  const { wishlist, toggleWish } = useCart();
  const wished = wishlist.includes(product.id);
  return (
    <div className="group relative flex flex-col">
      <Link href={`/products/${product.id}`} className="block">
        <ArtBox name={product.art} tone={tone} className="aspect-[4/5] transition-transform duration-500" scale={0.72} />
        <div className="flex flex-col gap-1 pt-3.5 pb-2">
          <span className="text-[13px] leading-snug group-hover:underline group-hover:underline-offset-4">{product.name}</span>
          <span className="num text-[13px] text-ink-2">{formatKRW(product.price)}</span>
        </div>
      </Link>
      {showTag && product.tag && <span className="pointer-events-none absolute left-3 top-3 text-[11px] font-medium sm:left-4 sm:top-4">{product.tag}</span>}
      <button
        type="button"
        onClick={() => toggleWish(product.id)}
        aria-label={wished ? "위시리스트에서 삭제" : "위시리스트에 추가"}
        aria-pressed={wished}
        className="absolute right-2 top-2 grid size-9 place-items-center sm:right-3 sm:top-3"
      >
        <Icon name="heart" size={22} className={wished ? "fill-ink" : ""} />
      </button>
    </div>
  );
}
