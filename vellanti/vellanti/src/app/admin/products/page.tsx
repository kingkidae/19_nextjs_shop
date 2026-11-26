import type { Metadata } from "next";
import { ProductTable } from "@/components/admin/ProductTable";

export const metadata: Metadata = { title: "상품 관리" };

export default function AdminProductsPage() {
  return <ProductTable />;
}
