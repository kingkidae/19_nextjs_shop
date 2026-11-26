import { CartProvider } from "@/components/shop/CartProvider";
import { Footer } from "@/components/shop/Footer";
import { MobileTabBar } from "@/components/shop/MobileTabBar";
import { getCatalog } from "@/lib/queries";
import { Suspense } from "react";

// 회원용(쇼핑) 영역 공통 레이아웃. 헤더는 페이지마다 테마(light/overlay)가 달라 각 페이지에서 렌더링합니다.
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const products = await getCatalog();
  return (
    <CartProvider products={products}>
      <div className="min-h-dvh">
        {children}
        <Footer />
      </div>
      {/* usePathname 은 동적 경로(/products/[id])에서 런타임 값이라 Suspense 필요 */}
      <Suspense>
        <MobileTabBar />
      </Suspense>
    </CartProvider>
  );
}
