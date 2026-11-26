"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ArtBox } from "@/components/ui/ProductArt";
import { formatKRW, getProduct, orders, type Order, type OrderStatus } from "@/lib/data";
import { PageHeader } from "./AdminShell";

const tabs: ("전체" | OrderStatus)[] = ["전체", "결제완료", "상품준비중", "배송중", "배송완료", "취소/반품"];
const flow: OrderStatus[] = ["결제완료", "상품준비중", "배송중", "배송완료"];

export function OrderTable() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("전체");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Order | null>(orders[0]);

  const rows = useMemo(
    () => orders.filter((o) => (tab === "전체" || o.status === tab) && (q === "" || o.no.includes(q.toUpperCase()) || o.customer.includes(q))),
    [tab, q],
  );

  return (
    <>
      <PageHeader
        title="주문 관리"
        desc="주문 상태를 확인하고 처리 단계를 변경하세요."
        actions={<button className={buttonClass("secondary", "h-10 px-4 bg-canvas")}><Icon name="download" size={16} />주문서 다운로드</button>}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {flow.concat("취소/반품").map((s) => (
          <button key={s} onClick={() => setTab(s)} className={`flex flex-col gap-2 rounded border bg-canvas p-4 text-left lg:p-5 ${tab === s ? "border-ink" : "border-line"}`}>
            <Badge label={s} className="self-start" />
            <span className="num text-[22px] font-semibold">{orders.filter((o) => o.status === s).length}건</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded border border-line bg-canvas">
          <div className="scrollbar-none flex gap-6 overflow-x-auto border-b border-line px-5 lg:px-6">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`-mb-px shrink-0 border-b-2 py-3.5 text-[13px] font-medium ${tab === t ? "border-ink text-ink" : "border-transparent text-ink-2"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 border-b border-line px-5 py-4 md:flex-row lg:px-6">
            <label className="flex h-10 flex-1 items-center gap-2.5 rounded border border-line px-3.5">
              <Icon name="search" size={18} className="text-ink-2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="주문번호 또는 고객명 검색" className="w-full bg-transparent text-[13px] outline-none placeholder:text-ink-3" />
            </label>
            <div className="flex h-10 items-center gap-2 rounded border border-line px-3.5 text-[13px]">
              <Icon name="calendar" size={16} className="text-ink-2" />
              <span className="num">2026.11.20 ~ 2026.11.26</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead className="text-[11px] text-ink-2">
                <tr className="border-b border-line">
                  <th className="px-5 py-3 font-medium lg:px-6">주문번호 / 일시</th>
                  <th className="py-3 font-medium">고객</th>
                  <th className="py-3 font-medium">상품</th>
                  <th className="py-3 font-medium">결제 금액</th>
                  <th className="py-3 font-medium">수령</th>
                  <th className="px-5 py-3 font-medium lg:px-6">상태</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => {
                  const p = getProduct(o.productId)!;
                  return (
                    <tr key={o.no} onClick={() => setActive(o)} className={`cursor-pointer border-b border-line last:border-0 ${active?.no === o.no ? "bg-admin-bg" : "hover:bg-admin-bg/60"}`}>
                      <td className="px-5 py-3.5 lg:px-6">
                        <div className="num font-medium">{o.no}</div>
                        <div className="num text-[11px] text-ink-2">{o.date}</div>
                      </td>
                      <td className="py-3.5">{o.customer}</td>
                      <td className="py-3.5">
                        {p.name}
                        {o.qty > 1 && <span className="text-ink-2"> x{o.qty}</span>}
                      </td>
                      <td className="num py-3.5">{formatKRW(o.amount)}</td>
                      <td className="py-3.5 text-ink-2">{o.channel}</td>
                      <td className="px-5 py-3.5 lg:px-6"><Badge label={o.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length === 0 && <p className="py-16 text-center text-[13px] text-ink-2">해당하는 주문이 없습니다.</p>}
          </div>
        </div>

        {active && <OrderDetail order={active} />}
      </div>
    </>
  );
}

function OrderDetail({ order }: { order: Order }) {
  const p = getProduct(order.productId)!;
  const step = flow.indexOf(order.status);
  return (
    <aside className="flex flex-col rounded border border-line bg-canvas xl:sticky xl:top-24 xl:self-start" aria-label="주문 상세">
      <div className="flex items-center justify-between border-b border-line px-5 py-4 lg:px-6">
        <div>
          <p className="text-[11px] text-ink-2">주문 상세</p>
          <p className="num text-[14px] font-bold">{order.no}</p>
        </div>
        <Badge label={order.status} />
      </div>
      {/* 진행 단계 */}
      {order.status !== "취소/반품" && (
        <ol className="flex border-b border-line px-5 py-5 lg:px-6">
          {flow.map((s, i) => (
            <li key={s} className="flex flex-1 flex-col items-center gap-2 text-center">
              <div className="flex w-full items-center">
                <span className={`h-px flex-1 ${i === 0 ? "bg-transparent" : i <= step ? "bg-ink" : "bg-line"}`} />
                <span className={`grid size-6 place-items-center rounded-full text-[10px] font-bold ${i <= step ? "bg-ink text-canvas" : "border border-line text-ink-3"}`}>
                  {i < step ? <Icon name="check" size={12} strokeWidth={2.5} /> : i + 1}
                </span>
                <span className={`h-px flex-1 ${i === flow.length - 1 ? "bg-transparent" : i < step ? "bg-ink" : "bg-line"}`} />
              </div>
              <span className={`text-[10px] ${i <= step ? "font-bold" : "text-ink-2"}`}>{s}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="flex gap-3 border-b border-line px-5 py-4 lg:px-6">
        <ArtBox name={p.art} className="h-20 w-16 shrink-0" scale={0.9} />
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-medium">{p.name}</span>
          <span className="text-[11px] text-ink-2">{p.styleNo} · 수량 {order.qty}</span>
          <span className="num text-[13px]">{formatKRW(order.amount)}</span>
        </div>
      </div>
      <dl className="grid grid-cols-[88px_1fr] gap-y-2.5 px-5 py-4 text-[13px] lg:px-6">
        <dt className="text-ink-2">주문자</dt><dd>{order.customer}</dd>
        <dt className="text-ink-2">결제 수단</dt><dd>{order.payment}</dd>
        <dt className="text-ink-2">수령 방법</dt><dd>{order.channel === "매장 픽업" ? "매장 픽업 · 청담 플래그십" : "택배 배송"}</dd>
        <dt className="text-ink-2">배송지</dt><dd>서울특별시 강남구 ○○로 00, 0층</dd>
        <dt className="text-ink-2">요청 사항</dt><dd>선물 포장 · 메시지 카드 포함</dd>
      </dl>
      <div className="mt-auto flex gap-2 border-t border-line p-4 lg:px-6">
        {step >= 0 && step < flow.length - 1 ? (
          <button className={buttonClass("primary", "h-11 flex-1 px-4")}>{flow[step + 1]}(으)로 변경</button>
        ) : (
          <button className={buttonClass("secondary", "h-11 flex-1 px-4")} disabled>처리 완료</button>
        )}
        <button className={buttonClass("secondary", "h-11 px-4")}>송장 출력</button>
      </div>
    </aside>
  );
}
