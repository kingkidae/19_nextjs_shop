import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/shop/Header";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductPurchase } from "@/components/shop/ProductPurchase";
import { ArtBox } from "@/components/ui/ProductArt";
import { categories, getProduct, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getProduct(id)?.name ?? "상품" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  const cat = categories.find((c) => c.key === product.category)!;
  const related = products.filter((p) => p.id !== product.id && p.status !== "숨김").sort((a, b) => (a.category === product.category ? -1 : 0) - (b.category === product.category ? -1 : 0)).slice(0, 4);

  return (
    <>
      <Header />
      <main>
        <p className="px-5 py-4 text-[12px] text-ink-2 lg:px-10 lg:py-5">
          <Link href="/" className="hover:text-ink">홈</Link> / <Link href={`/products?c=${cat.key}`} className="hover:text-ink">{cat.label}</Link> / {product.subcategory}
        </p>
        <div className="flex flex-col gap-8 pb-16 lg:flex-row lg:gap-14 lg:px-10 lg:pb-24">
          {/* 갤러리: 모바일은 가로 스와이프, PC는 2x2 그리드 */}
          <div className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto lg:grid lg:w-[61%] lg:shrink-0 lg:grid-cols-2 lg:gap-2 lg:overflow-visible">
            <ArtBox name={product.art} scale={0.72} className="aspect-[4/5] w-full shrink-0 snap-center" />
            <ArtBox name={product.art} scale={1.1} className="aspect-[4/5] w-full shrink-0 snap-center" />
            <ArtBox name={product.art} scale={0.5} className="aspect-[4/5] w-full shrink-0 snap-center" />
            <ArtBox name="belt" scale={0.7} className="aspect-[4/5] w-full shrink-0 snap-center" />
          </div>
          <div className="px-5 lg:sticky lg:top-6 lg:self-start lg:px-0 lg:flex-1">
            <ProductPurchase product={product} />
          </div>
        </div>
        <section className="bg-subtle px-5 py-14 lg:px-10 lg:pt-20 lg:pb-[120px]">
          <h2 className="h2 mb-8">함께 보면 좋은 상품</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} tone="canvas" showTag={false} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
