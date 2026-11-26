"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatKRW, getProduct, members, orders, type Grade, type Member } from "@/lib/data";
import { PageHeader, StatCard } from "./AdminShell";

const grades: ("전체" | Grade)[] = ["전체", "VIP", "GOLD", "MEMBER"];

export function MemberTable() {
  const [grade, setGrade] = useState<(typeof grades)[number]>("전체");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Member>(members[0]);

  const rows = useMemo(
    () => members.filter((m) => (grade === "전체" || m.grade === grade) && (q === "" || m.name.includes(q) || m.email.includes(q) || m.id.includes(q.toUpperCase()))),
    [grade, q],
  );

  return (
    <>
      <PageHeader
        title="회원 관리"
        desc="회원 등급과 구매 이력을 확인하고 맞춤 응대를 준비하세요."
        actions={
          <>
            <button className={buttonClass("secondary", "h-10 px-4 bg-canvas")}><Icon name="download" size={16} />회원 목록 다운로드</button>
            <button className={buttonClass("primary", "h-10 px-4")}><Icon name="chat" size={16} />메시지 발송</button>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="전체 회원" value="12,840명" delta="1.8% 전월 대비" />
        <StatCard label="VIP 회원" value="312명" delta="4명 이번 달" />
        <StatCard label="이번 달 신규" value="486명" delta="2.3% 전월 대비" down />
        <StatCard label="재구매율" value="38.6%" delta="1.2%p 전월 대비" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded border border-line bg-canvas">
          <div className="flex flex-col gap-3 border-b border-line px-5 py-4 md:flex-row md:items-center lg:px-6">
            <div className="flex gap-1.5">
              {grades.map((g) => (
                <button key={g} onClick={() => setGrade(g)} className={`h-9 rounded border px-3.5 text-[12px] font-medium ${grade === g ? "border-ink bg-ink text-canvas" : "border-line text-ink-2"}`}>
                  {g}
                </button>
              ))}
            </div>
            <label className="flex h-10 flex-1 items-center gap-2.5 rounded border border-line px-3.5">
              <Icon name="search" size={18} className="text-ink-2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름, 이메일, 회원번호 검색" className="w-full bg-transparent text-[13px] outline-none placeholder:text-ink-3" />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[13px]">
              <thead className="text-[11px] text-ink-2">
                <tr className="border-b border-line">
                  <th className="px-5 py-3 font-medium lg:px-6">회원</th>
                  <th className="py-3 font-medium">등급</th>
                  <th className="py-3 font-medium">주문</th>
                  <th className="py-3 font-medium">누적 구매액</th>
                  <th className="py-3 font-medium">가입일</th>
                  <th className="px-5 py-3 font-medium lg:px-6">최근 방문</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.id} onClick={() => setActive(m)} className={`cursor-pointer border-b border-line last:border-0 ${active.id === m.id ? "bg-admin-bg" : "hover:bg-admin-bg/60"}`}>
                    <td className="px-5 py-3 lg:px-6">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-[12px] font-bold">{m.name[0]}</span>
                        <div className="flex flex-col">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-[11px] text-ink-2">{m.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3"><Badge label={m.grade} /></td>
                    <td className="num py-3">{m.orders}건</td>
                    <td className="num py-3">{formatKRW(m.totalSpent)}</td>
                    <td className="num py-3 text-ink-2">{m.joined}</td>
                    <td className="num px-5 py-3 text-ink-2 lg:px-6">{m.lastVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <p className="py-16 text-center text-[13px] text-ink-2">검색 결과가 없습니다.</p>}
          </div>
        </div>
        <MemberDetail member={active} />
      </div>
    </>
  );
}

function MemberDetail({ member }: { member: Member }) {
  const recent = orders.filter((o) => o.customer === member.name).slice(0, 3);
  return (
    <aside className="rounded border border-line bg-canvas xl:sticky xl:top-24 xl:self-start" aria-label="회원 상세">
      <div className="flex flex-col items-center gap-2 border-b border-line px-6 py-7 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-brand-green text-[22px] font-bold text-canvas">{member.name[0]}</span>
        <p className="mt-1 text-[16px] font-bold">{member.name}</p>
        <p className="num text-[12px] text-ink-2">{member.id} · {member.email}</p>
        <Badge label={member.grade} />
      </div>
      <div className="grid grid-cols-2 border-b border-line">
        <div className="flex flex-col gap-1 border-r border-line px-5 py-4">
          <span className="text-[11px] text-ink-2">누적 구매액</span>
          <span className="num text-[15px] font-semibold">{formatKRW(member.totalSpent)}</span>
        </div>
        <div className="flex flex-col gap-1 px-5 py-4">
          <span className="text-[11px] text-ink-2">주문 수</span>
          <span className="num text-[15px] font-semibold">{member.orders}건</span>
        </div>
      </div>
      <dl className="grid grid-cols-[96px_1fr] gap-y-2.5 border-b border-line px-6 py-4 text-[13px]">
        <dt className="text-ink-2">연락처</dt><dd className="num">{member.phone}</dd>
        <dt className="text-ink-2">가입일</dt><dd className="num">{member.joined}</dd>
        <dt className="text-ink-2">담당 어드바이저</dt><dd>{member.advisor ?? "미지정"}</dd>
        <dt className="text-ink-2">마케팅 수신</dt><dd>{member.marketing ? "동의" : "미동의"}</dd>
      </dl>
      <div className="px-6 py-4">
        <p className="mb-3 text-[12px] font-bold">최근 주문</p>
        {recent.length ? (
          <ul className="flex flex-col gap-2.5">
            {recent.map((o) => (
              <li key={o.no} className="flex items-center justify-between gap-3 text-[12px]">
                <span className="truncate">{getProduct(o.productId)?.name}</span>
                <Badge label={o.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-ink-2">최근 주문 내역이 없습니다.</p>
        )}
      </div>
      <div className="flex gap-2 border-t border-line p-4">
        <button className={buttonClass("secondary", "h-10 flex-1 px-3")}>등급 변경</button>
        <button className={buttonClass("primary", "h-10 flex-1 px-3")}>상담 예약</button>
      </div>
    </aside>
  );
}
