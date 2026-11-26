"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Checkbox, Field, SelectField, TextareaField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { ArtBox } from "@/components/ui/ProductArt";
import { categories, formatKRW, type ArtKey, type CategoryKey } from "@/lib/data";
import { PageHeader } from "./AdminShell";

const swatches = [
  { name: "블랙", hex: "#000000" },
  { name: "포레스트 그린", hex: "#1F3A2E" },
  { name: "버건디", hex: "#731A1F" },
  { name: "아이보리", hex: "#DCD1BF" },
  { name: "하바나", hex: "#6B4A2E" },
];

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded border border-line bg-canvas">
      <div className="border-b border-line px-5 py-4 lg:px-6">
        <h2 className="text-[14px] font-bold">{title}</h2>
        {desc && <p className="mt-0.5 text-[12px] text-ink-2">{desc}</p>}
      </div>
      <div className="flex flex-col gap-5 p-5 lg:p-6">{children}</div>
    </section>
  );
}

export function ProductForm() {
  const [name, setName] = useState("아르코 미니 탑 핸들 백");
  const [category, setCategory] = useState<CategoryKey>("women-bags");
  const [price, setPrice] = useState(4250000);
  const [colors, setColors] = useState<string[]>(["블랙", "포레스트 그린"]);
  const [status, setStatus] = useState<"판매중" | "숨김">("판매중");
  const art: ArtKey = categories.find((c) => c.key === category)?.art ?? "bag";

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <PageHeader
        title="상품 등록"
        desc="새 상품 정보를 입력하고 스토어에 노출하세요."
        actions={
          <>
            <Link href="/admin/products" className={buttonClass("secondary", "h-10 px-4 bg-canvas")}>취소</Link>
            <button type="button" className={buttonClass("secondary", "h-10 px-4 bg-canvas")}>임시 저장</button>
            <button type="submit" className={buttonClass("primary", "h-10 px-5")}><Icon name="check" size={16} />등록하기</button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-4">
          <Section title="기본 정보">
            <Field label="상품명 *" value={name} onChange={(e) => setName(e.target.value)} required />
            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="카테고리 *" value={category} onChange={(e) => setCategory(e.target.value as CategoryKey)}>
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </SelectField>
              <Field label="스타일 번호" defaultValue="782104 AA0T1 1000" />
            </div>
            <TextareaField label="상품 설명" defaultValue="매끄러운 카프스킨 레더로 제작한 구조적인 실루엣의 미니 탑 핸들 백입니다. 골드 톤 하드웨어와 탈착 가능한 숄더 스트랩으로 다양하게 연출할 수 있습니다." />
          </Section>

          <Section title="상품 이미지" desc="권장 크기 1600 x 2000px (4:5), JPG 또는 PNG · 최대 8장">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[0.72, 1.1, 0.5].map((s, i) => (
                <div key={i} className="relative">
                  <ArtBox name={art} scale={s} className="aspect-[4/5] w-full" />
                  {i === 0 && <span className="absolute left-2 top-2 rounded-[2px] bg-ink px-1.5 py-0.5 text-[10px] font-bold text-canvas">대표</span>}
                  <button type="button" aria-label="이미지 삭제" className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-canvas"><Icon name="close" size={14} /></button>
                </div>
              ))}
              <label className="flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-ink-3 text-ink-2 hover:border-ink hover:text-ink">
                <Icon name="upload" size={22} />
                <span className="text-[12px] font-medium">이미지 추가</span>
                <input type="file" accept="image/*" multiple className="sr-only" />
              </label>
            </div>
          </Section>

          <Section title="가격 및 재고">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="판매가 (원) *" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              <Field label="재고 수량 *" type="number" defaultValue={14} />
              <Field label="재고 알림 기준" type="number" defaultValue={5} hint="이 수량 이하가 되면 알림" />
            </div>
          </Section>

          <Section title="옵션" desc="고객이 선택할 수 있는 색상을 지정하세요.">
            <div className="flex flex-wrap gap-2">
              {swatches.map((s) => {
                const on = colors.includes(s.name);
                return (
                  <button
                    type="button"
                    key={s.name}
                    aria-pressed={on}
                    onClick={() => setColors((c) => (on ? c.filter((x) => x !== s.name) : [...c, s.name]))}
                    className={`flex items-center gap-2 border px-3 py-2 text-[12px] ${on ? "border-ink" : "border-line text-ink-2"}`}
                  >
                    <span className="size-4 rounded-full ring-1 ring-black/10" style={{ background: s.hex }} />
                    {s.name}
                    {on && <Icon name="check" size={14} />}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-2.5">
              <Checkbox label="이니셜 서비스 제공" defaultChecked />
              <Checkbox label="매장 픽업 가능" defaultChecked />
              <Checkbox label="선물 포장 가능" defaultChecked />
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
          <Section title="노출 설정">
            <div className="grid grid-cols-2 gap-2">
              {(["판매중", "숨김"] as const).map((s) => (
                <button type="button" key={s} onClick={() => setStatus(s)} className={`h-10 border text-[13px] font-medium ${status === s ? "border-ink bg-ink text-canvas" : "border-line text-ink-2"}`}>
                  {s === "판매중" ? "판매중 (노출)" : "숨김"}
                </button>
              ))}
            </div>
            <SelectField label="상품 태그" defaultValue="NEW">
              <option>없음</option>
              <option>NEW</option>
              <option>온라인 단독</option>
              <option>한정 수량</option>
            </SelectField>
            <Field label="판매 시작일" type="date" defaultValue="2026-11-27" />
          </Section>
          <Section title="스토어 미리보기">
            <div className="relative">
              <ArtBox name={art} scale={0.72} className="aspect-[4/5] w-full" />
              <span className="absolute left-3 top-3 text-[11px] font-medium">NEW</span>
              <Icon name="heart" size={22} className="absolute right-3 top-3" />
            </div>
            <div className="-mt-2 flex flex-col gap-1">
              <span className="text-[13px]">{name || "상품명"}</span>
              <span className="num text-[13px] text-ink-2">{formatKRW(price || 0)}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-ink-2">
              상태 <Badge label={status} />
            </div>
          </Section>
        </div>
      </div>
    </form>
  );
}
