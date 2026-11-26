import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/shop/Header";
import { WishlistPreview } from "@/components/shop/WishlistPreview";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ArtBox } from "@/components/ui/ProductArt";
import { formatKRW, getProduct, orders } from "@/lib/data";

export const metadata: Metadata = { title: "마이페이지" };

const nav: [IconName, string][] = [
  ["user", "계정 개요"],
  ["receipt", "주문 내역"],
  ["heart", "위시리스트"],
  ["calendar", "예약 내역"],
  ["location", "배송지 관리"],
  ["tag", "이니셜 서비스 내역"],
  ["edit", "회원 정보 수정"],
  ["logout", "로그아웃"],
];

export default function MyPage() {
  const myOrders = orders.filter((o) => o.customer === "김민서").slice(0, 3);

  return (
    <>
      <Header />
      <main className="pb-24 lg:pb-[120px]">
        <section className="flex flex-col gap-5 bg-subtle px-5 py-10 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-14">
          <div className="flex flex-col gap-2.5">
            <p className="cta text-ink-2">My Account</p>
            <h1 className="text-[22px] font-bold tracking-[-0.01em] lg:text-[28px]">김민서 님, 안녕하세요</h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge label="VIP" />
              <span className="text-[13px] text-ink-2">전담 어드바이저: 이서윤 · 청담 플래그십</span>
            </div>
          </div>
          <ButtonLink href="#" variant="secondary" className="self-start lg:self-auto">등급 혜택 보기</ButtonLink>
        </section>

        <div className="flex flex-col gap-10 px-5 pt-8 lg:flex-row lg:gap-14 lg:px-10 lg:pt-12">
          {/* 사이드 메뉴: 모바일은 가로 스크롤 칩 */}
          <nav aria-label="마이페이지 메뉴" className="scrollbar-none -mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:w-[220px] lg:shrink-0 lg:flex-col lg:overflow-visible lg:px-0">
            {nav.map(([icon, label], i) => (
              <Link
                key={label}
                href="#"
                className={`flex shrink-0 items-center gap-3 px-3 py-2.5 text-[13px] lg:py-3 ${i === 0 ? "bg-subtle font-bold" : "font-medium text-ink-2 hover:text-ink"}`}
              >
                <Icon name={icon} size={18} />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 flex-1 flex-col gap-12">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {[["진행 중인 주문", "1"], ["위시리스트", "3"], ["다가오는 예약", "1"], ["보유 쿠폰", "2"]].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-2 border border-line px-5 py-5 lg:px-6">
                  <span className="text-[11px] font-medium text-ink-2">{k}</span>
                  <span className="num text-[28px] font-semibold leading-none">{v}</span>
                </div>
              ))}
            </div>

            <section aria-labelledby="recent-orders">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="recent-orders" className="h2">최근 주문</h2>
                <Link href="#" className="cta underline underline-offset-4">전체 보기</Link>
              </div>
              <div className="border-t border-ink">
                <div className="hidden grid-cols-[180px_120px_1fr_140px_100px_80px] gap-4 border-b border-line py-3.5 text-[11px] font-medium text-ink-2 lg:grid">
                  <span>주문번호</span><span>주문일</span><span>상품</span><span>결제 금액</span><span>상태</span><span />
                </div>
                {myOrders.map((o) => {
                  const p = getProduct(o.productId)!;
                  return (
                    <div key={o.no} className="grid grid-cols-[64px_1fr] gap-x-4 gap-y-1 border-b border-line py-5 lg:grid-cols-[180px_120px_1fr_140px_100px_80px] lg:items-center lg:gap-4">
                      <span className="num hidden text-[13px] lg:block">{o.no}</span>
                      <span className="num hidden text-[13px] lg:block">{o.date.slice(0, 10)}</span>
                      <div className="row-span-3 flex items-center gap-3 lg:row-span-1">
                        <ArtBox name={p.art} className="h-20 w-16 lg:h-[60px] lg:w-12" scale={0.9} />
                        <span className="hidden text-[13px] lg:inline">{p.name}</span>
                      </div>
                      <span className="text-[13px] font-medium lg:hidden">{p.name}</span>
                      <span className="num text-[13px]">{formatKRW(o.amount)}</span>
                      <span className="flex items-center gap-3"><Badge label={o.status} /><span className="num text-[11px] text-ink-2 lg:hidden">{o.date.slice(0, 10)}</span></span>
                      <Link href="#" className="cta hidden underline underline-offset-4 lg:inline">상세보기</Link>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-10 lg:grid-cols-2 lg:gap-6">
              <section className="flex flex-col gap-3.5 self-start bg-ink p-7 text-canvas">
                <p className="cta">다가오는 예약</p>
                <p className="flex items-center gap-3 text-[16px] font-medium"><Icon name="calendar" size={22} />12월 14일 (토) 오후 3:00</p>
                <p className="text-[13px] text-ink-3">청담 플래그십 부티크 · 홀리데이 기프트 프라이빗 상담</p>
                <div className="flex gap-5 pt-2">
                  <button className="cta underline underline-offset-4">일정 변경</button>
                  <button className="cta underline underline-offset-4">예약 취소</button>
                </div>
              </section>
              <WishlistPreview />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
