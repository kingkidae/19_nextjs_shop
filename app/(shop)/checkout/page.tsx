import type { Metadata } from "next";
import { CheckoutView } from "@/components/shop/CheckoutView";
import { Header } from "@/components/shop/Header";

export const metadata: Metadata = { title: "주문 · 결제" };

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <CheckoutView />
    </>
  );
}
