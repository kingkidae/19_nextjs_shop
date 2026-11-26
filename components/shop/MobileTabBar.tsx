"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";

const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/products", label: "카테고리", icon: "grid" },
  { href: "/cart", label: "쇼핑백", icon: "bag" },
  { href: "/mypage#wishlist", label: "위시리스트", icon: "heart" },
  { href: "/mypage", label: "MY", icon: "user" },
];

export function MobileTabBar() {
  const path = usePathname();
  return (
    <nav aria-label="하단 메뉴" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-canvas pt-2.5 pb-[max(env(safe-area-inset-bottom),16px)] lg:hidden">
      {tabs.map((t) => {
        const active = t.href === "/" ? path === "/" : path.startsWith(t.href.split("#")[0]) && !t.href.includes("#");
        return (
          <Link key={t.label} href={t.href} className={`flex flex-col items-center gap-1 ${active ? "text-ink" : "text-ink-2"}`}>
            <Icon name={t.icon} size={22} strokeWidth={active ? 1.8 : 1.4} />
            <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
