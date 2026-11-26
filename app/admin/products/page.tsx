import type { Metadata } from "next";
import { ProductTable } from "@/components/admin/ProductTable";
import { adminProducts } from "@/lib/admin-data";

export const metadata: Metadata = { title: "상품 관리" };

export default async function AdminProductsPage() {
  return <ProductTable products={await adminProducts()} />;
}
