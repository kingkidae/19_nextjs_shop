"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

export interface CartLine {
  productId: string;
  color: string;
  qty: number;
}

interface CartCtx {
  /** 메뉴 표시용. 실제 권한 검사는 서버(RLS)에서 */
  isAdmin: boolean;
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  clear: () => void;
  lines: (CartLine & { product: Product })[];
  count: number;
  subtotal: number;
  add: (productId: string, color: string) => void;
  setQty: (productId: string, color: string, qty: number) => void;
  remove: (productId: string, color: string) => void;
  wishlist: string[];
  toggleWish: (productId: string) => void;
}

const Ctx = createContext<CartCtx | null>(null);

// 데모를 위해 첫 방문 시 쇼핑백에 3개 상품을 담아 둡니다.
const SEED: CartLine[] = [
  { productId: "p001", color: "블랙", qty: 1 },
  { productId: "p013", color: "블랙", qty: 1 },
  { productId: "p017", color: "아이보리", qty: 1 },
];

// shortcut: 노출 상품 전체를 레이아웃에서 한 번에 받음. 상품이 수백 개 이상이면 페이지 단위 조회로 전환
export function CartProvider({ products, children }: { products: Product[]; children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(SEED);
  const [wishlist, setWishlist] = useState<string[]>(["p016", "p014", "p018"]);
  const [isAdmin, setIsAdmin] = useState(false);

  // 로그인·로그아웃 때마다 권한 다시 확인 (구독 시 현재 세션으로 한 번 호출됨)
  useEffect(() => {
    const sb = createClient();
    const {
      data: { subscription },
    } = sb.auth.onAuthStateChange((_event, session) => {
      if (!session) return setIsAdmin(false);
      // 이 콜백 안에서 Supabase 를 바로 호출하면 교착될 수 있어 다음 틱에 조회
      setTimeout(async () => {
        const { data } = await sb.from("profiles").select("role").eq("id", session.user.id).single();
        setIsAdmin(data?.role === "admin");
      });
    });
    return () => subscription.unsubscribe();
  }, []);

  // localStorage 는 마운트 후에만 읽을 수 있음 (서버 렌더와 hydration 불일치 방지)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vellanti-cart");
      if (saved) setLines(JSON.parse(saved));
      const wish = localStorage.getItem("vellanti-wish");
      if (wish) setWishlist(JSON.parse(wish));
    } catch {}
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const persist = useCallback((next: CartLine[]) => {
    setLines(next);
    try {
      localStorage.setItem("vellanti-cart", JSON.stringify(next));
    } catch {}
  }, []);

  const value = useMemo<CartCtx>(() => {
    const getProduct = (id: string) => products.find((p) => p.id === id);
    const full = lines
      .map((l) => ({ ...l, product: getProduct(l.productId)! }))
      .filter((l) => l.product);
    return {
      isAdmin,
      products,
      getProduct,
      clear: () => persist([]),
      lines: full,
      count: full.reduce((s, l) => s + l.qty, 0),
      subtotal: full.reduce((s, l) => s + l.qty * l.product.price, 0),
      add: (productId, color) => {
        const hit = lines.find((l) => l.productId === productId && l.color === color);
        persist(hit ? lines.map((l) => (l === hit ? { ...l, qty: l.qty + 1 } : l)) : [...lines, { productId, color, qty: 1 }]);
      },
      setQty: (productId, color, qty) =>
        persist(lines.map((l) => (l.productId === productId && l.color === color ? { ...l, qty: Math.max(1, Math.min(9, qty)) } : l))),
      remove: (productId, color) => persist(lines.filter((l) => !(l.productId === productId && l.color === color))),
      wishlist,
      toggleWish: (productId) => {
        const next = wishlist.includes(productId) ? wishlist.filter((id) => id !== productId) : [...wishlist, productId];
        setWishlist(next);
        try {
          localStorage.setItem("vellanti-wish", JSON.stringify(next));
        } catch {}
      },
    };
  }, [isAdmin, products, lines, wishlist, persist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function WishCount() {
  return <>{useCart().wishlist.length}</>;
}
