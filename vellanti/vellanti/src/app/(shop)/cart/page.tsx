import type { Metadata } from "next";
import { CartView } from "@/components/shop/CartView";
import { Header } from "@/components/shop/Header";

export const metadata: Metadata = { title: "쇼핑백" };

export default function CartPage() {
  return (
    <>
      <Header />
      <CartView />
    </>
  );
}
