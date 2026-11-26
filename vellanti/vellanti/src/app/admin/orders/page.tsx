import type { Metadata } from "next";
import { OrderTable } from "@/components/admin/OrderTable";

export const metadata: Metadata = { title: "주문 관리" };

export default function AdminOrdersPage() {
  return <OrderTable />;
}
