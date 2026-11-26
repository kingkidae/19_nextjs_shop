"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { deleteProducts, setProductStatus } from "@/lib/actions";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ArtBox } from "@/components/ui/ProductArt";
import { categories, formatKRW, type Product, type ProductStatus } from "@/lib/data";
import { PageHeader } from "./AdminShell";

const statusTabs: ("전체" | ProductStatus)[] = ["전체", "판매중", "품절", "숨김"];

export function ProductTable({ products }: { products: Product[] }) {
  const [pending, start] = useTransition();
  const bulk = (fn: () => Promise<{ error?: string }>) =>
    start(async () => {
      const res = await fn();
      if (res.error) alert(res.error);
      else setSelected([]);
    });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState<(typeof statusTabs)[number]>("전체");
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(
    () =>
      products.filter(
        (p) =>
          (status === "전체" || p.status === status) &&
          (cat === "all" || p.category === cat) &&
          (q === "" || p.name.includes(q) || p.styleNo.toLowerCase().includes(q.toLowerCase())),
      ),
    [products, q, cat, status],
  );
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  return (
    <>
      <PageHeader
        title="상품 관리"
        desc={`전체 ${products.length}개 상품 · 판매중 ${products.filter((p) => p.status === "판매중").length}개`}
        actions={
          <>
            <button className={buttonClass("secondary", "h-10 px-4 bg-canvas")}><Icon name="download" size={16} />엑셀 다운로드</button>
            <Link href="/admin/products/new" className={buttonClass("primary", "h-10 px-4")}><Icon name="plus" size={16} />상품 등록</Link>
          </>
        }
      />

      <div className="rounded border border-line bg-canvas">
        {/* 상태 탭 */}
        <div className="scrollbar-none flex gap-6 overflow-x-auto border-b border-line px-5 lg:px-6">
          {statusTabs.map((t) => {
            const n = t === "전체" ? products.length : products.filter((p) => p.status === t).length;
            return (
              <button key={t} onClick={() => setStatus(t)} className={`-mb-px shrink-0 border-b-2 py-3.5 text-[13px] font-medium ${status === t ? "border-ink text-ink" : "border-transparent text-ink-2"}`}>
                {t} <span className="num text-ink-3">{n}</span>
              </button>
            );
          })}
        </div>
        {/* 필터 */}
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4 md:flex-row md:items-center lg:px-6">
          <label className="flex h-10 flex-1 items-center gap-2.5 rounded border border-line px-3.5">
            <Icon name="search" size={18} className="text-ink-2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="상품명 또는 스타일 번호 검색" className="w-full bg-transparent text-[13px] outline-none placeholder:text-ink-3" />
          </label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded border border-line bg-canvas px-3 text-[13px]" aria-label="카테고리">
            <option value="all">전체 카테고리</option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          {selected.length > 0 && (
            <div className="flex items-center gap-2 text-[12px]">
              <span className="font-medium">{selected.length}개 선택</span>
              <button disabled={pending} onClick={() => bulk(() => setProductStatus(selected, "숨김"))} className="rounded border border-line px-3 py-2">숨김 처리</button>
              <button disabled={pending} onClick={() => confirm(`${selected.length}개 상품을 삭제할까요? 되돌릴 수 없습니다.`) && bulk(() => deleteProducts(selected))} className="rounded border border-line px-3 py-2 text-danger">삭제</button>
            </div>
          )}
        </div>

        {/* PC 테이블 */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] text-left text-[13px]">
            <thead className="text-[11px] text-ink-2">
              <tr className="border-b border-line">
                <th className="w-12 px-5 py-3 lg:px-6">
                  <input type="checkbox" aria-label="전체 선택" checked={allChecked} onChange={() => setSelected(allChecked ? [] : rows.map((r) => r.id))} className="accent-ink" />
                </th>
                <th className="py-3 font-medium">상품</th>
                <th className="py-3 font-medium">카테고리</th>
                <th className="py-3 font-medium">판매가</th>
                <th className="py-3 font-medium">재고</th>
                <th className="py-3 font-medium">상태</th>
                <th className="py-3 font-medium">등록일</th>
                <th className="px-5 py-3 text-right font-medium lg:px-6">관리</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-admin-bg/60">
                  <td className="px-5 py-3 lg:px-6">
                    <input
                      type="checkbox"
                      aria-label={`${p.name} 선택`}
                      checked={selected.includes(p.id)}
                      onChange={() => setSelected((s) => (s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id]))}
                      className="accent-ink"
                    />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <ArtBox name={p.art} className="h-[60px] w-12 shrink-0" scale={0.9} />
                      <div className="flex flex-col">
                        <span className="font-medium">{p.name}</span>
                        <span className="num text-[11px] text-ink-2">{p.styleNo}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-ink-2">{categories.find((c) => c.key === p.category)?.label}</td>
                  <td className="num py-3">{formatKRW(p.price)}</td>
                  <td className={`num py-3 ${p.stock === 0 ? "font-bold text-danger" : p.stock <= 5 ? "font-bold text-warning" : ""}`}>{p.stock}</td>
                  <td className="py-3"><Badge label={p.status} /></td>
                  <td className="num py-3 text-ink-2">{p.createdAt.replaceAll("-", ".")}</td>
                  <td className="px-5 py-3 lg:px-6">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/products/new?id=${p.id}`} className="grid size-8 place-items-center rounded hover:bg-muted" aria-label="수정"><Icon name="edit" size={18} /></Link>
                      <button className="grid size-8 place-items-center rounded hover:bg-muted" aria-label="더보기"><Icon name="more" size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드 리스트 */}
        <ul className="md:hidden">
          {rows.map((p) => (
            <li key={p.id} className="relative flex gap-3 border-b border-line px-5 py-4 last:border-0">
              <Link href={`/admin/products/new?id=${p.id}`} className="absolute inset-0" aria-label={`${p.name} 수정`} />
              <ArtBox name={p.art} className="h-20 w-16 shrink-0" scale={0.9} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="truncate text-[13px] font-medium">{p.name}</span>
                  <Badge label={p.status} />
                </div>
                <span className="num text-[11px] text-ink-2">{p.styleNo}</span>
                <div className="mt-auto flex items-center justify-between">
                  <span className="num text-[13px]">{formatKRW(p.price)}</span>
                  <span className={`num text-[12px] ${p.stock <= 5 ? "font-bold text-warning" : "text-ink-2"}`}>재고 {p.stock}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {rows.length === 0 && <p className="py-16 text-center text-[13px] text-ink-2">검색 결과가 없습니다.</p>}

        <div className="flex items-center justify-between border-t border-line px-5 py-3.5 text-[12px] text-ink-2 lg:px-6">
          <span>{rows.length}개 표시</span>
          <div className="flex items-center gap-1">
            <button className="grid size-8 place-items-center rounded hover:bg-muted" aria-label="이전 페이지"><Icon name="chevronLeft" size={16} /></button>
            <span className="num grid size-8 place-items-center rounded bg-ink text-canvas">1</span>
            <button className="grid size-8 place-items-center rounded hover:bg-muted" aria-label="다음 페이지"><Icon name="chevronRight" size={16} /></button>
          </div>
        </div>
      </div>
    </>
  );
}
