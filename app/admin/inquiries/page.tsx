import type { Metadata } from "next";
import { InquiryBoard } from "@/components/admin/InquiryBoard";
import { adminInquiries } from "@/lib/admin-data";

export const metadata: Metadata = { title: "문의 관리" };

export default async function AdminInquiriesPage() {
  return <InquiryBoard rows={await adminInquiries()} />;
}
