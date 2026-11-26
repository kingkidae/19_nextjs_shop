import type { Metadata } from "next";
import { MemberTable } from "@/components/admin/MemberTable";

export const metadata: Metadata = { title: "회원 관리" };

export default function AdminMembersPage() {
  return <MemberTable />;
}
