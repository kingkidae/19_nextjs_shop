import type { Metadata } from "next";
import { MemberTable } from "@/components/admin/MemberTable";
import { adminOrders, adminProfiles } from "@/lib/admin-data";
import { getAdmin } from "@/lib/queries";
import { formatDate, type Member } from "@/lib/data";

export const metadata: Metadata = { title: "회원 관리" };

export default async function AdminMembersPage() {
  const [profiles, orders, { user }] = await Promise.all([adminProfiles(), adminOrders(), getAdmin()]);
  const members: Member[] = profiles.map((p) => {
    const mine = orders.filter((o) => o.userId === p.uid);
    return {
      ...p,
      joined: formatDate(p.createdAt, false),
      lastVisit: formatDate(p.lastVisit, false),
      orders: mine.length,
      totalSpent: mine.filter((o) => o.status !== "취소/반품").reduce((s, o) => s + o.amount, 0),
    };
  });
  return <MemberTable members={members} orders={orders} meId={user?.id} thisMonth={formatDate(new Date().toISOString(), false).slice(0, 7)} />;
}
