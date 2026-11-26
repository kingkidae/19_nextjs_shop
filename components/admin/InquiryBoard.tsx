"use client";

import { Fragment, useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { setInquiryDone } from "@/lib/actions";
import { formatDate, type InquiryRow } from "@/lib/data";
import { PageHeader } from "./AdminShell";

const tabs = ["전체", "상담 대기", "상담 완료"] as const;
const statusOf = (r: InquiryRow) => (r.done ? "상담 완료" : "상담 대기");

/** 상담 완료 체크박스 (게시판 행·모바일 카드 공용) */
export function DoneCheck({ row }: { row: InquiryRow }) {
  const [pending, start] = useTransition();
  return (
    <label className="flex items-center gap-2 text-[12px]" onClick={(e) => e.stopPropagation()}>
      <input
        type="checkbox"
        className="size-4 accent-ink"
        checked={row.done}
        disabled={pending}
        aria-label={`${row.name} 님 문의 상담 완료`}
        onChange={(e) => {
          const done = e.target.checked;
          start(async () => {
            const res = await setInquiryDone(row.id, done);
            if (res.error) alert(res.error);
          });
        }}
      />
      <span className="lg:sr-only">상담 완료</span>
    </label>
  );
}

function Detail({ row }: { row: InquiryRow }) {
  return (
    <div className="flex flex-col gap-4 bg-admin-bg px-5 py-5 lg:px-6">
      <dl className="grid grid-cols-[72px_1fr] gap-y-2 text-[13px] sm:grid-cols-[72px_1fr_72px_1fr]">
        <dt className="text-ink-2">이메일</dt>
        <dd className="break-all">{row.email}</dd>
        <dt className="text-ink-2">연락처</dt>
        <dd className="num">{row.phone}</dd>
        <dt className="text-ink-2">주소</dt>
        <dd className="sm:col-span-3">{row.address}</dd>
        {row.doneAt && (
          <>
            <dt className="text-ink-2">완료 시각</dt>
            <dd className="num sm:col-span-3">{formatDate(row.doneAt)}</dd>
          </>
        )}
      </dl>
      <p className="whitespace-pre-wrap border-t border-line pt-4 text-[13px] leading-relaxed">{row.message}</p>
      <a href={`mailto:${row.email}?subject=${encodeURIComponent("[VELLANTI] 문의하신 내용에 대한 답변입니다")}`} className="flex w-fit items-center gap-2 text-[12px] font-medium underline underline-offset-4">
        <Icon name="chat" size={16} />
        이메일로 답변하기
      </a>
    </div>
  );
}

export function InquiryBoard({ rows: all }: { rows: InquiryRow[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("전체");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const rows = useMemo(
    () => all.filter((r) => (tab === "전체" || statusOf(r) === tab) && (q === "" || [r.name, r.email, r.phone, r.message].some((v) => v.includes(q)))),
    [all, tab, q],
  );
  const count = (t: (typeof tabs)[number]) => (t === "전체" ? all.length : all.filter((r) => statusOf(r) === t).length);
  const toggle = (id: number) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <>
      <PageHeader title="문의 관리" desc="고객 문의를 확인하고 상담이 끝나면 완료로 체크하세요." />
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex flex-col gap-2 rounded border bg-canvas p-4 text-left lg:p-5 ${tab === t ? "border-ink" : "border-line"}`}>
            <span className="text-[11px] font-medium text-ink-2">{t}</span>
            <span className="num text-[22px] font-semibold">{count(t)}건</span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded border border-line bg-canvas">
        <div className="scrollbar-none flex gap-6 overflow-x-auto border-b border-line px-5 lg:px-6">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`-mb-px shrink-0 border-b-2 py-3.5 text-[13px] font-medium ${tab === t ? "border-ink text-ink" : "border-transparent text-ink-2"}`}>
              {t} <span className="num text-ink-3">{count(t)}</span>
            </button>
          ))}
        </div>
        <div className="border-b border-line px-5 py-4 lg:px-6">
          <label className="flex h-10 items-center gap-2.5 rounded border border-line px-3.5">
            <Icon name="search" size={18} className="text-ink-2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름, 이메일, 연락처, 내용 검색" className="w-full bg-transparent text-[13px] outline-none placeholder:text-ink-3" />
          </label>
        </div>

        {/* PC 게시판 */}
        <table className="hidden w-full table-fixed text-left text-[13px] lg:table">
          <thead className="text-[11px] text-ink-2">
            <tr className="border-b border-line">
              <th className="w-[88px] px-6 py-3 font-medium">상담 완료</th>
              <th className="w-[72px] py-3 font-medium">번호</th>
              <th className="py-3 font-medium">내용</th>
              <th className="w-[120px] py-3 font-medium">이름</th>
              <th className="w-[140px] py-3 font-medium">연락처</th>
              <th className="w-[140px] py-3 font-medium">접수일</th>
              <th className="w-[110px] px-6 py-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <Fragment key={r.id}>
                <tr onClick={() => toggle(r.id)} aria-expanded={openId === r.id} className={`cursor-pointer border-b border-line ${openId === r.id ? "bg-admin-bg" : "hover:bg-admin-bg/60"}`}>
                  <td className="px-6 py-3.5"><DoneCheck row={r} /></td>
                  <td className="num py-3.5 text-ink-2">{r.id}</td>
                  <td className={`truncate py-3.5 pr-4 ${r.done ? "text-ink-2" : "font-medium"}`}>{r.message}</td>
                  <td className="truncate py-3.5">{r.name}</td>
                  <td className="num py-3.5">{r.phone}</td>
                  <td className="num py-3.5 text-ink-2">{formatDate(r.createdAt)}</td>
                  <td className="px-6 py-3.5"><Badge label={statusOf(r)} /></td>
                </tr>
                {openId === r.id && (
                  <tr className="border-b border-line">
                    <td colSpan={7} className="p-0"><Detail row={r} /></td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>

        {/* 모바일 카드 */}
        <ul className="lg:hidden">
          {rows.map((r) => (
            <li key={r.id} className="border-b border-line last:border-0">
              <button className="flex w-full flex-col gap-1.5 px-5 py-4 text-left" onClick={() => toggle(r.id)} aria-expanded={openId === r.id}>
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium">{r.name} <span className="num text-[11px] font-normal text-ink-2">#{r.id}</span></span>
                  <Badge label={statusOf(r)} />
                </span>
                <span className={`line-clamp-2 text-[13px] ${r.done ? "text-ink-2" : ""}`}>{r.message}</span>
                <span className="num text-[11px] text-ink-2">{formatDate(r.createdAt)}</span>
              </button>
              <div className="px-5 pb-4"><DoneCheck row={r} /></div>
              {openId === r.id && <Detail row={r} />}
            </li>
          ))}
        </ul>
        {rows.length === 0 && <p className="py-16 text-center text-[13px] text-ink-2">{all.length ? "검색 결과가 없습니다." : "접수된 문의가 없습니다."}</p>}
      </div>
    </>
  );
}
