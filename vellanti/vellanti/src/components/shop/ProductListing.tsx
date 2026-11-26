"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { categories, products, type CategoryKey } from "@/lib/data";
import { ProductCard } from "./ProductCard";

const sorts = {
  추천순: () => 0,
  신상품순: (a: { createdAt: string }, b: { createdAt: string }) => b.createdAt.localeCompare(a.createdAt),
  "낮은 가격순": (a: { price: number }, b: { price: number }) => a.price - b.price,
  "높은 가격순": (a: { price: number }, b: { price: number }) => b.price - a.price,
} as const;
type SortKey = keyof typeof sorts;

const PAGE = 12;

export function ProductListing({ initialCategory }: { initialCategory?: CategoryKey }) {
  const [category, setCategory] = useState<CategoryKey | "all">(initialCategory ?? "women-bags");
  const [sub, setSub] = useState("전체");
  const [sort, setSort] = useState<SortKey>("추천순");
  const [visible, setVisible] = useState(PAGE);

  const inCategory = useMemo(() => products.filter((p) => p.status !== "숨김" && (category === "all" || p.category === category)), [category]);
  const subs = useMemo(() => ["전체", ...Array.from(new Set(inCategory.map((p) => p.subcategory)))], [inCategory]);
  const list = useMemo(() => {
    const filtered = sub === "전체" ? inCategory : inCategory.filter((p) => p.subcategory === sub);
    return [...filtered].sort(sorts[sort] as (a: (typeof filtered)[number], b: (typeof filtered)[number]) => number);
  }, [inCategory, sub, sort]);

  const title = category === "all" ? "전체 상품" : categories.find((c) => c.key === category)!.label;
  const shown = list.slice(0, visible);

  return (
    <main>
      <div className="flex flex-col gap-3 px-5 pt-5 pb-6 lg:px-10 lg:pt-7 lg:pb-8">
        <p className="text-[12px] text-ink-2">
          <Link href="/" className="hover:text-ink">홈</Link> / 여성 / {title}
        </p>
        <div className="flex items-end gap-3">
          <h1 className="text-[22px] font-bold tracking-[-0.01em] lg:text-[28px]">{title}</h1>
          <span className="pb-1 text-[13px] text-ink-2">{list.length}개 상품</span>
        </div>
        {/* 카테고리 전환 */}
        <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pt-1 lg:mx-0 lg:px-0">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => { setCategory(c.key); setSub("전체"); setVisible(PAGE); }}
              className={`shrink-0 border px-3.5 py-1.5 text-[12px] ${category === c.key ? "border-ink bg-ink text-canvas" : "border-line text-ink-2 hover:border-ink hover:text-ink"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {/* 하위 카테고리 */}
        <div className="scrollbar-none -mx-5 flex gap-6 overflow-x-auto px-5 pt-3 lg:mx-0 lg:gap-7 lg:px-0">
          {subs.map((s) => (
            <button key={s} onClick={() => setSub(s)} className={`cta shrink-0 ${sub === s ? "text-ink underline underline-offset-4" : "text-ink-2 hover:text-ink"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 필터 바 */}
      <div className="sticky top-0 z-20 flex h-12 items-center justify-between border-y border-line bg-canvas px-5 lg:h-14 lg:px-10">
        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2">
            <Icon name="filter" size={20} />
            <span className="cta">필터</span>
          </button>
          <div className="hidden items-center gap-8 md:flex">
            {["색상", "소재", "가격", "사이즈"].map((f) => (
              <button key={f} className="flex items-center gap-1 text-[13px] font-medium">
                {f} <Icon name="chevronDown" size={16} />
              </button>
            ))}
          </div>
        </div>
        <label className="relative flex items-center gap-1 text-[13px] font-medium">
          <span className="sr-only">정렬</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="cursor-pointer appearance-none bg-transparent pr-5 outline-none">
            {(Object.keys(sorts) as SortKey[]).map((k) => (
              <option key={k} value={k}>정렬: {k}</option>
            ))}
          </select>
          <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-0" />
        </label>
      </div>

      {/* 그리드: 모바일 2열 / 태블릿 3열 / PC 4열 */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 px-5 pt-6 pb-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-12 lg:px-10 lg:pt-8">
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {shown.length === 0 && <p className="col-span-full py-20 text-center text-ink-2">조건에 맞는 상품이 없습니다.</p>}
      </div>

      <div className="flex flex-col items-center gap-4 pb-24 lg:pb-[120px]">
        <p className="text-[12px] text-ink-2">{list.length}개 중 {shown.length}개 상품 표시</p>
        <div className="h-0.5 w-60 bg-muted">
          <div className="h-full bg-ink" style={{ width: `${list.length ? (shown.length / list.length) * 100 : 0}%` }} />
        </div>
        {shown.length < list.length && (
          <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE)}>더 보기</Button>
        )}
      </div>
    </main>
  );
}
