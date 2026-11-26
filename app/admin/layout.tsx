import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { WrongPath } from "@/components/admin/WrongPath";
import { getAdmin } from "@/lib/queries";

export const metadata: Metadata = { title: { default: "관리자", template: "%s | VELLANTI 관리자" }, robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-admin-bg" />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

// 관리자가 아니면(비로그인 포함) 관리자 메뉴·화면을 아예 그리지 않음. 실제 데이터 보호는 RLS(is_admin) 가 담당
async function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, admin } = await getAdmin();
  if (!admin) return <WrongPath />;
  const name = admin.name || user?.email || "관리자";
  return (
    <AdminShell
      profile={
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-brand-green text-[12px] font-bold text-canvas">{name[0]}</span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-[13px] font-medium">{name}</span>
            <span className="text-[11px] text-ink-2">관리자</span>
          </span>
        </div>
      }
    >
      {children}
    </AdminShell>
  );
}
