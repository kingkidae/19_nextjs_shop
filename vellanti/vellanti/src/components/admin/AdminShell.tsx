"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

const menu: { href: string; label: string; icon: IconName; badge?: number }[] = [
  { href: "/admin", label: "대시보드", icon: "chart" },
  { href: "/admin/products", label: "상품 관리", icon: "box" },
  { href: "/admin/orders", label: "주문 관리", icon: "receipt", badge: 4 },
  { href: "/admin/members", label: "회원 관리", icon: "users" },
  { href: "#", label: "예약 관리", icon: "calendar" },
  { href: "#", label: "프로모션", icon: "tag" },
  { href: "#", label: "설정", icon: "settings" },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <div className="flex h-full flex-col bg-admin-side text-canvas">
      <div className="flex h-[68px] items-center gap-2.5 px-6">
        <span className="logo text-[22px]">VELLANTI</span>
        <span className="rounded-[2px] bg-canvas/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wider">ADMIN</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4 py-4" aria-label="관리자 메뉴">
        {menu.map((m) => {
          const active = m.href === "/admin" ? path === "/admin" : m.href !== "#" && path.startsWith(m.href);
          return (
            <Link
              key={m.label}
              href={m.href}
              onClick={onNavigate}
              className={`flex h-11 items-center gap-3 rounded px-3.5 text-[13px] font-medium transition-colors ${active ? "bg-canvas/10 text-canvas" : "text-ink-3 hover:bg-canvas/5 hover:text-canvas"}`}
            >
              <Icon name={m.icon} size={20} />
              <span className="flex-1">{m.label}</span>
              {m.badge ? <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-brand-red px-1.5 text-[10px] font-bold">{m.badge}</span> : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-canvas/10 p-4">
        <Link href="/" className="flex h-11 items-center gap-3 rounded px-3.5 text-[13px] text-ink-3 hover:text-canvas">
          <Icon name="logout" size={20} />
          스토어로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh bg-admin-bg">
      <aside className="fixed inset-y-0 left-0 hidden w-60 lg:block">
        <Sidebar />
      </aside>
      {/* 모바일 드로어 */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-ink/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <div className={`absolute inset-y-0 left-0 w-64 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      </div>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between gap-4 border-b border-line bg-canvas px-4 lg:h-[68px] lg:px-8">
          <div className="flex flex-1 items-center gap-3">
            <button className="lg:hidden" aria-label="메뉴 열기" onClick={() => setOpen(true)}>
              <Icon name="menu" />
            </button>
            <span className="logo text-[18px] lg:hidden">VELLANTI</span>
            <label className="hidden h-10 w-full max-w-[380px] items-center gap-2.5 rounded bg-admin-bg px-3.5 md:flex">
              <Icon name="search" size={18} className="text-ink-2" />
              <input placeholder="주문번호, 상품명, 회원 검색" className="w-full bg-transparent text-[13px] outline-none placeholder:text-ink-3" />
            </label>
          </div>
          <div className="flex items-center gap-4 lg:gap-5">
            <button aria-label="알림" className="relative">
              <Icon name="bell" />
              <span className="absolute right-0.5 top-0 size-2 rounded-full bg-brand-red" />
            </button>
            <button aria-label="설정" className="hidden sm:block"><Icon name="settings" /></button>
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-brand-green text-[12px] font-bold text-canvas">김</span>
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-[13px] font-medium">김지원 매니저</span>
                <span className="text-[11px] text-ink-2">Super Admin</span>
              </span>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, desc, actions }: { title: string; desc?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-bold tracking-[-0.01em] lg:text-[26px]">{title}</h1>
        {desc && <p className="text-[13px] text-ink-2">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, delta, down }: { label: string; value: string; delta?: string; down?: boolean }) {
  return (
    <div className="flex flex-col gap-2.5 rounded border border-line bg-canvas p-5 lg:p-6">
      <span className="text-[11px] font-medium text-ink-2">{label}</span>
      <span className="num whitespace-nowrap text-[17px] font-semibold leading-tight tracking-[-0.02em] sm:text-[22px] lg:text-[26px]">{value}</span>
      {delta && <span className={`text-[11px] font-medium ${down ? "text-danger" : "text-success"}`}>{down ? "▼" : "▲"} {delta}</span>}
    </div>
  );
}

export function Panel({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded border border-line bg-canvas ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-5 py-4 lg:px-6">
        <h2 className="text-[14px] font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
