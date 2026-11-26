"use client";

import { useMemo, useState, useTransition } from "react";
import { setMemberGrade, setMemberRole } from "@/lib/actions";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatKRW, roleLabel, type Grade, type Member, type Order } from "@/lib/data";
import { PageHeader, StatCard } from "./AdminShell";

const grades: ("전체" | Grade)[] = ["전체", "VIP", "GOLD", "MEMBER"];

export function MemberTable({ members, orders, thisMonth, meId }: { members: Member[]; orders: Order[]; thisMonth: string; meId?: string }) {
  const [grade, setGrade] = useState<(typeof grades)[number]>("전체");
  const [q, setQ] = useState("");
  const [activeId, setActiveId] = useState(members[0]?.uid);
  const active = members.find((m) => m.uid === activeId);
  const buyers = members.filter((m) => m.orders > 0);

  const rows = useMemo(
    () => members.filter((m) => (grade === "전체" || m.grade === grade) && (q === "" || m.name.includes(q) || m.email.includes(q) || m.id.includes(q.toUpperCase()))),
    [members, grade, q],
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
        <StatCard label="전체 회원" value={`${members.length.toLocaleString("ko-KR")}명`} />
        <StatCard label="VIP 회원" value={`${members.filter((m) => m.grade === "VIP").length}명`} />
        <StatCard label="이번 달 신규" value={`${members.filter((m) => m.joined.startsWith(thisMonth)).length}명`} />
        <StatCard label="재구매율" value={`${buyers.length ? ((buyers.filter((m) => m.orders > 1).length / buyers.length) * 100).toFixed(1) : "0.0"}%`} />
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
                  <th className="py-3 font-medium">권한</th>
                  <th className="py-3 font-medium">등급</th>
                  <th className="py-3 font-medium">주문</th>
                  <th className="py-3 font-medium">누적 구매액</th>
                  <th className="py-3 font-medium">가입일</th>
                  <th className="px-5 py-3 font-medium lg:px-6">최근 방문</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr key={m.uid} onClick={() => setActiveId(m.uid)} className={`cursor-pointer border-b border-line last:border-0 ${active?.uid === m.uid ? "bg-admin-bg" : "hover:bg-admin-bg/60"}`}>
                    <td className="px-5 py-3 lg:px-6">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-[12px] font-bold">{(m.name || m.email)[0]}</span>
                        <div className="flex flex-col">
                          <span className="font-medium">{m.name || "-"}</span>
                          <span className="text-[11px] text-ink-2">{m.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3"><Badge label={roleLabel[m.role]} /></td>
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
        {active && <MemberDetail member={active} orders={orders} isMe={active.uid === meId} />}
      </div>
    </>
  );
}

function MemberDetail({ member, orders, isMe }: { member: Member; orders: Order[]; isMe: boolean }) {
  const recent = orders.filter((o) => o.userId === member.uid).slice(0, 3);
  const [pending, start] = useTransition();
  return (
    <aside className="rounded border border-line bg-canvas xl:sticky xl:top-24 xl:self-start" aria-label="회원 상세">
      <div className="flex flex-col items-center gap-2 border-b border-line px-6 py-7 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-brand-green text-[22px] font-bold text-canvas">{(member.name || member.email)[0]}</span>
        <p className="mt-1 text-[16px] font-bold">{member.name || "-"}</p>
        <p className="num text-[12px] text-ink-2">{member.id} · {member.email}</p>
        <div className="flex gap-1.5">
          <Badge label={roleLabel[member.role]} />
          <Badge label={member.grade} />
        </div>
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
        <dt className="text-ink-2">권한</dt>
        <dd className="flex items-center justify-between gap-2">
          {roleLabel[member.role]}
          {isMe ? (
            <span className="text-[11px] text-ink-3">본인</span>
          ) : (
            <button
              type="button"
              disabled={pending}
              className="text-[12px] font-medium underline underline-offset-4 disabled:opacity-40"
              onClick={() => {
                const next = member.role === "admin" ? "member" : "admin";
                if (!confirm(`${member.name || member.email} 님을 ${roleLabel[next]}(으)로 변경할까요?`)) return;
                start(async () => {
                  const res = await setMemberRole(member.uid, next);
                  if (res.error) alert(res.error);
                });
              }}
            >
              {member.role === "admin" ? "관리자 해제" : "관리자로 지정"}
            </button>
          )}
        </dd>
      </dl>
      <div className="px-6 py-4">
        <p className="mb-3 text-[12px] font-bold">최근 주문</p>
        {recent.length ? (
          <ul className="flex flex-col gap-2.5">
            {recent.map((o) => (
              <li key={o.no} className="flex items-center justify-between gap-3 text-[12px]">
                <span className="truncate">{o.productName}</span>
                <Badge label={o.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-ink-2">최근 주문 내역이 없습니다.</p>
        )}
      </div>
      <div className="flex gap-2 border-t border-line p-4">
        <label className={buttonClass("secondary", "relative h-10 flex-1 px-3")}>
          {pending ? "변경 중…" : "등급 변경"}
          <select
            aria-label="등급 변경"
            value={member.grade}
            disabled={pending}
            onChange={(e) => {
              const grade = e.target.value as Grade;
              start(async () => {
                const res = await setMemberGrade(member.uid, grade);
                if (res.error) alert(res.error);
              });
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            {grades.filter((g) => g !== "전체").map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <button className={buttonClass("primary", "h-10 flex-1 px-3")}>상담 예약</button>
      </div>
    </aside>
  );
}
