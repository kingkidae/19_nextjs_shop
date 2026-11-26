"use client";

import Link from "next/link";
import { getProduct } from "@/lib/data";
import { useCart } from "./CartProvider";
import { ProductCard } from "./ProductCard";

export function WishlistPreview() {
  const { wishlist } = useCart();
  const items = wishlist.map(getProduct).filter(Boolean).slice(0, 3);
  return (
    <section id="wishlist" aria-labelledby="wishlist-title" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 id="wishlist-title" className="h2">위시리스트</h2>
        <Link href="/products" className="cta underline underline-offset-4">전체 보기</Link>
      </div>
      {items.length ? (
        <div className="grid grid-cols-3 gap-3">
          {items.map((p) => (
            <ProductCard key={p!.id} product={p!} showTag={false} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-[13px] text-ink-2">위시리스트에 담은 상품이 없습니다.</p>
      )}
    </section>
  );
}
