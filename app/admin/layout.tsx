import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ButtonLink } from "@/components/ui/Button";
import { getAdmin } from "@/lib/queries";

export const metadata: Metadata = { title: { default: "관리자", template: "%s | VELLANTI 관리자" }, robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      profile={
        <Suspense fallback={<span className="size-8 rounded-full bg-muted" />}>
          <AdminProfile />
        </Suspense>
      }
    >
      <Suspense fallback={<p className="py-20 text-center text-[13px] text-ink-2">불러오는 중…</p>}>
        <AdminGate>{children}</AdminGate>
      </Suspense>
    </AdminShell>
  );
}

async function AdminProfile() {
  const { user, admin } = await getAdmin();
  if (!admin) return null;
  const name = admin.name || user?.email || "관리자";
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-8 place-items-center rounded-full bg-brand-green text-[12px] font-bold text-canvas">{name[0]}</span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-[13px] font-medium">{name}</span>
        <span className="text-[11px] text-ink-2">관리자</span>
      </span>
    </div>
  );
}

// 화면 차단용. 실제 데이터 보호는 RLS(is_admin) 가 담당
async function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, admin } = await getAdmin();
  if (!user) redirect("/login?next=/admin");
  if (!admin)
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-[22px] font-bold">관리자 권한이 없습니다</h1>
        <p className="text-[13px] text-ink-2">관리자 계정으로 로그인해 주세요.</p>
        <ButtonLink href="/">스토어로 돌아가기</ButtonLink>
      </div>
    );
  return children;
}
