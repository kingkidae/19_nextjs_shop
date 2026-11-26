import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/ProductForm";
import { PRODUCT_COLS, type Product } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "상품 등록" };

// ?id=p001 이면 수정 모드
export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const { data } = id ? await (await createClient()).from("products").select(PRODUCT_COLS).eq("id", id).maybeSingle() : { data: null };
  return <ProductForm key={id ?? "new"} product={(data as unknown as Product) ?? undefined} />;
}
