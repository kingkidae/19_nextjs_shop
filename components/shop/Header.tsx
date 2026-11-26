"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "./CartProvider";

const messages = ["전 매장에서 매장 픽업 서비스를 만나보세요", "한정 기간 만나보는 장기 무이자 할부 서비스", "홀리데이 기프트: 시그니처 기프트 박스 무료 포장"];

const nav = [
  { label: "여성", href: "/products?c=women-bags" },
  { label: "남성", href: "/products?c=men-shoes" },
  { label: "핸드백", href: "/products?c=women-bags" },
  { label: "주얼리 & 시계", href: "/products?c=jewelry" },
  { label: "기프트", href: "/products" },
  { label: "문의하기", href: "/contact" },
];

const drawerLinks = [
  ["여성", ["핸드백", "지갑 & 레더 소품", "실크 스카프", "파인 주얼리"]],
  ["남성", ["슈즈", "벨트", "지갑 & 레더 소품", "아이웨어"]],
  ["기프트", ["그녀를 위한 기프트", "그를 위한 기프트", "스몰 럭셔리"]],
] as const;

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex h-8 items-center justify-center gap-4 bg-ink text-canvas lg:h-9 lg:gap-6">
      <button aria-label="이전 공지" className="hidden sm:block" onClick={() => setI((i + messages.length - 1) % messages.length)}>
        <Icon name="chevronLeft" size={18} />
      </button>
      <p className="truncate px-4 text-[11px] font-medium sm:px-0" aria-live="polite">
        {messages[i]}
      </p>
      <button aria-label="다음 공지" className="hidden sm:block" onClick={() => setI((i + 1) % messages.length)}>
        <Icon name="chevronRight" size={18} />
      </button>
    </div>
  );
}

export function Header({ theme = "light" }: { theme?: "light" | "overlay" }) {
  const [open, setOpen] = useState(false);
  const { count, isAdmin } = useCart();
  const overlay = theme === "overlay";
  const fg = overlay ? "text-canvas" : "text-ink";

  return (
    <header className={overlay ? "absolute inset-x-0 top-0 z-30" : "relative z-30 border-b border-line bg-canvas"}>
      <AnnouncementBar />
      <div className={`relative flex h-14 items-center px-4 lg:h-20 lg:px-10 ${fg}`}>
        {/* 왼쪽 */}
        <div className="flex flex-1 items-center gap-4 lg:gap-7">
          <button aria-label="메뉴 열기" onClick={() => setOpen(true)}>
            <Icon name="menu" />
          </button>
          <Link href="/products" aria-label="검색" className="lg:hidden">
            <Icon name="search" />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="주 메뉴">
            {nav.map((n) => (
              <Link key={n.label} href={n.href} className="cta hover:underline hover:underline-offset-4">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* 로고 */}
        <Link href="/" className="logo text-[22px] lg:text-[30px]" aria-label="VELLANTI 홈">
          VELLANTI
        </Link>
        {/* 오른쪽 */}
        <div className="flex flex-1 items-center justify-end gap-4 lg:gap-6">
          <Link href="/mypage" className="hidden text-[11px] font-medium xl:block">
            클라이언트 서비스
          </Link>
          <Link href="/products" aria-label="검색" className="hidden lg:block">
            <Icon name="search" />
          </Link>
          <Link href="/mypage" aria-label="위시리스트">
            <Icon name="heart" />
          </Link>
          <Link href="/mypage" aria-label="마이페이지" className="hidden lg:block">
            <Icon name="user" />
          </Link>
          <Link href="/cart" aria-label={`쇼핑백, ${count}개 상품`} className="relative">
            <Icon name="bag" />
            {count > 0 && (
              <span className={`num absolute -right-1.5 -top-1 grid size-4 place-items-center rounded-full text-[9px] font-bold ${overlay ? "bg-canvas text-ink" : "bg-ink text-canvas"}`}>
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 드로어 메뉴 */}
      <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={() => setOpen(false)} />
        <aside className={`absolute inset-y-0 left-0 flex w-full max-w-[420px] flex-col bg-canvas text-ink transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-14 items-center justify-between border-b border-line px-5 lg:h-20 lg:px-8">
            <span className="logo text-[22px]">VELLANTI</span>
            <button aria-label="메뉴 닫기" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-8">
            {drawerLinks.map(([title, items]) => (
              <div key={title} className="border-b border-line py-5">
                <p className="h2 mb-3">{title}</p>
                <ul className="flex flex-col gap-2.5">
                  {items.map((it) => (
                    <li key={it}>
                      <Link href="/products" onClick={() => setOpen(false)} className="text-[14px] text-ink-2 hover:text-ink">
                        {it}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 border-t border-line px-5 py-6 lg:px-8">
            <Link href="/login" className="flex items-center gap-3 text-[13px]"><Icon name="user" size={20} />로그인 / 회원가입</Link>
            <Link href="/mypage" className="flex items-center gap-3 text-[13px]"><Icon name="calendar" size={20} />매장 방문 예약</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="flex items-center gap-3 text-[13px]"><Icon name="chat" size={20} />문의하기</Link>
            {isAdmin && <Link href="/admin" className="flex items-center gap-3 text-[13px] text-ink-2"><Icon name="settings" size={20} />관리자 페이지</Link>}
          </div>
        </aside>
      </div>
    </header>
  );
}
