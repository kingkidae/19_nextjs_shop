import { CartProvider } from "@/components/shop/CartProvider";
import { Footer } from "@/components/shop/Footer";
import { MobileTabBar } from "@/components/shop/MobileTabBar";

// 회원용(쇼핑) 영역 공통 레이아웃. 헤더는 페이지마다 테마(light/overlay)가 달라 각 페이지에서 렌더링합니다.
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-dvh">
        {children}
        <Footer />
      </div>
      <MobileTabBar />
    </CartProvider>
  );
}
