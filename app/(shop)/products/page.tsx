import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/shop/Header";
import { ProductListing } from "@/components/shop/ProductListing";
import { categories, type CategoryKey } from "@/lib/data";

export const metadata: Metadata = { title: "상품 목록" };

export default function ProductsPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  return (
    <>
      <Header />
      <Suspense fallback={<main className="min-h-dvh" />}>
        <Listing searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Listing({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const category = categories.find((x) => x.key === c)?.key as CategoryKey | undefined;
  // key: 헤더 메뉴로 카테고리를 바꿔 이동하면 상태를 새로 시작
  return <ProductListing key={category ?? "default"} initialCategory={category} />;
}
