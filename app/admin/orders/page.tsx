import type { Metadata } from "next";
import { OrderTable } from "@/components/admin/OrderTable";
import { adminOrders } from "@/lib/admin-data";

export const metadata: Metadata = { title: "주문 관리" };

export default async function AdminOrdersPage() {
  return <OrderTable orders={await adminOrders()} />;
}
