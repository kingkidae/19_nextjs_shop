import Link from "next/link";
import { Header } from "@/components/shop/Header";
import { ProductCard } from "@/components/shop/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { ArtBox } from "@/components/ui/ProductArt";
import { categories } from "@/lib/data";
import { getCatalog } from "@/lib/queries";

const services = [
  { img: "/images/boutique.png", title: "방문 예약하기", body: "원하는 날짜와 시간에 부티크 방문을 예약하세요. 전담 클라이언트 어드바이저가 맞춤 셀렉션을 준비해 드립니다.", cta: "매장 방문 예약", tone: "from-[#3a2f26] to-[#7a6650]" },
  { img: "/images/craft.png", title: "이니셜 서비스", body: "핸드백, 벨트, 레더 소품에 이니셜을 새겨 세상에 하나뿐인 선물로 완성하세요.", cta: "컬렉션 만나보기", tone: "from-[#1d1a17] to-[#5b4a3a]" },
  { img: "/images/gift.png", title: "기프트 가이드", body: "받는 분의 취향에 맞춘 홀리데이 기프트를 만나보세요. 시그니처 기프트 박스로 포장해 드립니다.", cta: "기프트 둘러보기", tone: "from-[#4a0f14] to-[#1f3a2e]" },
];

export default async function HomePage() {
  // 최신 등록 상품 4개
  const newArrivals = [...(await getCatalog())].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  return (
    <main>
      {/* HERO: 이미지(public/images/hero.png)가 없으면 그라데이션 배경으로 표시 */}
      <section className="relative h-[100svh] max-h-[960px] min-h-[600px] overflow-hidden bg-gradient-to-br from-[#1f3a2e] via-[#2a2622] to-[#5a4634] lg:h-[860px]">
        <div className="absolute inset-0 bg-cover bg-[center_30%]" style={{ backgroundImage: "url(/images/hero.png)" }} role="img" aria-label="팔라초 복도에 서 있는 그린 코트와 블랙 탑 핸들 백 캠페인 이미지" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/60" />
        <Header theme="overlay" />
        <div className="absolute inset-x-0 bottom-20 flex flex-col items-center gap-4 px-6 text-center text-canvas lg:bottom-[88px]">
          <p className="cta">Holiday 2026</p>
          <h1 className="text-[32px] font-bold leading-tight tracking-[-0.01em] lg:text-[44px]">홀리데이 기프트</h1>
          <p className="max-w-[440px] text-[14px] lg:text-[15px]">정교한 장인 정신으로 완성한 선물로 특별한 순간을 기념하세요.</p>
          <div className="mt-4 flex gap-3">
            <ButtonLink href="/products?c=women-bags" variant="outline-inverse">For 여성</ButtonLink>
            <ButtonLink href="/products?c=men-shoes" variant="outline-inverse">For 남성</ButtonLink>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
          <span className="h-0.5 w-8 bg-canvas" />
          <span className="h-0.5 w-4 bg-canvas/50" />
          <span className="h-0.5 w-4 bg-canvas/50" />
        </div>
      </section>

      {/* 카테고리 */}
      <section className="py-16 lg:py-24">
        <div className="mb-6 flex items-center justify-between px-5 lg:mb-8 lg:px-10">
          <h2 className="h2">카테고리 둘러보기</h2>
          <Link href="/products" className="cta underline underline-offset-4">전체 보기</Link>
        </div>
        <ul className="scrollbar-none flex snap-x gap-3 overflow-x-auto px-5 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-10">
          {categories.slice(0, 6).map((c) => (
            <li key={c.key} className="w-[44vw] shrink-0 snap-start sm:w-[30vw] lg:w-auto">
              <Link href={`/products?c=${c.key}`} className="group flex flex-col items-center gap-3.5">
                <ArtBox name={c.art} className="aspect-[4/5] w-full" scale={0.78} />
                <span className="text-[13px] font-medium group-hover:underline group-hover:underline-offset-4">{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 서비스 */}
      <section className="pb-20 lg:pb-[120px]">
        <div className="mx-auto mb-10 flex max-w-[600px] flex-col items-center gap-4 px-6 text-center lg:mb-12">
          <h2 className="h2">특별한 온라인 서비스</h2>
          <p className="text-[14px] text-ink-2 lg:text-[15px]">첫 선택의 순간부터 마지막 디테일까지, 자신 있게 선물을 고르고 세상에 단 하나뿐인 선물을 완성해 보세요.</p>
        </div>
        <div className="grid gap-12 px-5 md:grid-cols-3 md:gap-5 lg:px-10">
          {services.map((s) => (
            <article key={s.title} className="flex flex-col gap-3">
              <div className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${s.tone}`}>
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.03]" style={{ backgroundImage: `url(${s.img})` }} />
              </div>
              <h3 className="h2 mt-2">{s.title}</h3>
              <p className="text-[13px] text-ink-2">{s.body}</p>
              <Link href="/mypage" className="cta self-start underline underline-offset-4">{s.cta}</Link>
            </article>
          ))}
        </div>
      </section>

      {/* 신상품 */}
      <section className="bg-subtle px-5 py-16 lg:px-10 lg:pt-24 lg:pb-[120px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="h2">새로운 컬렉션</h2>
            <p className="text-[13px] text-ink-2">이번 시즌 새롭게 선보이는 아이템</p>
          </div>
          <ButtonLink href="/products" variant="secondary" className="hidden sm:inline-flex">전체 보기</ButtonLink>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} tone="canvas" />
          ))}
        </div>
      </section>
    </main>
  );
}
