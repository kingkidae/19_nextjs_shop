import type { Metadata } from "next";
import { Header } from "@/components/shop/Header";
import { ProductListing } from "@/components/shop/ProductListing";
import { categories, type CategoryKey } from "@/lib/data";

export const metadata: Metadata = { title: "상품 목록" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  const category = categories.find((x) => x.key === c)?.key as CategoryKey | undefined;
  return (
    <>
      <Header />
      <ProductListing initialCategory={category} />
    </>
  );
}
