import Link from "next/link";
import { PageHeader, Panel, StatCard } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ArtBox } from "@/components/ui/ProductArt";
import { adminOrders, adminProducts, adminProfiles, kstDay } from "@/lib/admin-data";
import { formatKRW, orderStatuses } from "@/lib/data";

export default async function AdminDashboard() {
  const [orders, products, profiles] = await Promise.all([adminOrders(), adminProducts(), adminProfiles()]);
  const now = new Date();
  const today = kstDay(now);
  const days = Array.from({ length: 7 }, (_, i) => kstDay(new Date(now.getTime() - (6 - i) * 86400_000)));
  const valid = orders.filter((o) => o.status !== "취소/반품");
  const sumOn = (day: string) => valid.filter((o) => kstDay(o.createdAt) === day).reduce((s, o) => s + o.amount, 0);
  const salesByDay = days.map((d) => ({ label: d.slice(5).replace("-", "."), value: Math.round(sumOn(d) / 100_000) / 10 }));
  const max = Math.max(1, ...salesByDay.map((d) => d.value));
  const todayOrders = orders.filter((o) => kstDay(o.createdAt) === today);
  const newMembers = profiles.filter((p) => days.includes(kstDay(p.createdAt))).length;
  const avg = valid.length ? Math.round(valid.reduce((s, o) => s + o.amount, 0) / valid.length) : 0;
  const weekday = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric", weekday: "short" }).format(now);
  const statusCount = orderStatuses.map((s) => [s, orders.filter((o) => o.status === s).length] as const);
  const lowStock = products.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock).slice(0, 5);
  // 최근 7일 판매 수량 기준
  const soldMap = new Map<string, { name: string; art: (typeof orders)[number]["art"]; sold: number }>();
  for (const o of valid.filter((o) => days.includes(kstDay(o.createdAt)))) {
    const cur = soldMap.get(o.productName) ?? { name: o.productName, art: o.art, sold: 0 };
    cur.sold += o.qty;
    soldMap.set(o.productName, cur);
  }
  const best = [...soldMap.values()].sort((a, b) => b.sold - a.sold).slice(0, 4);

  return (
    <>
      <PageHeader
        title="대시보드"
        desc={`${weekday} 기준 · 실시간 업데이트`}
        actions={
          <>
            <button className={buttonClass("secondary", "h-10 px-4 bg-canvas")}><Icon name="calendar" size={16} />최근 7일</button>
            <button className={buttonClass("primary", "h-10 px-4")}><Icon name="download" size={16} />리포트 다운로드</button>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard label="오늘 매출" value={formatKRW(sumOn(today))} />
        <StatCard label="오늘 주문" value={`${todayOrders.length}건`} />
        <StatCard label="신규 회원 (7일)" value={`${newMembers}명`} />
        <StatCard label="평균 객단가" value={formatKRW(avg)} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="일별 매출 (백만 원)" action={<span className="text-[11px] text-ink-2">최근 7일</span>}>
          <div className="flex h-[260px] items-end gap-3 px-5 pt-8 pb-5 lg:gap-6 lg:px-8">
            {salesByDay.map((d, i) => (
              <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="num text-[11px] text-ink-2">{d.value}</span>
                <div className={`w-full max-w-12 ${i === salesByDay.length - 1 ? "bg-ink" : "bg-muted"}`} style={{ height: `${(d.value / max) * 75}%` }} />
                <span className="num text-[11px] text-ink-2">{d.label}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="주문 현황">
          <ul className="flex flex-col px-5 py-2 lg:px-6">
            {statusCount.map(([s, n]) => (
              <li key={s} className="flex items-center justify-between border-b border-line py-3.5 last:border-0">
                <Badge label={s} />
                <span className="num text-[15px] font-semibold">{n}건</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="최근 주문" action={<Link href="/admin/orders" className="text-[12px] font-medium underline underline-offset-4">전체 보기</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead className="text-[11px] text-ink-2">
                <tr className="border-b border-line">
                  <th className="px-5 py-3 font-medium lg:px-6">주문번호</th>
                  <th className="py-3 font-medium">고객</th>
                  <th className="py-3 font-medium">상품</th>
                  <th className="py-3 font-medium">금액</th>
                  <th className="px-5 py-3 font-medium lg:px-6">상태</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.no} className="border-b border-line last:border-0">
                    <td className="num px-5 py-3.5 lg:px-6">{o.no}</td>
                    <td className="py-3.5">{o.customer}</td>
                    <td className="py-3.5">{o.productName}</td>
                    <td className="num py-3.5">{formatKRW(o.amount)}</td>
                    <td className="px-5 py-3.5 lg:px-6"><Badge label={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <div className="flex flex-col gap-4">
          <Panel title="베스트셀러 (이번 주)">
            <ul className="flex flex-col gap-3 px-5 py-4 lg:px-6">
              {best.map((b, i) => (
                <li key={b.name} className="flex items-center gap-3">
                  <span className="num w-4 text-[13px] font-bold">{i + 1}</span>
                  <ArtBox name={b.art} className="size-11" scale={0.9} />
                  <span className="flex-1 truncate text-[13px]">{b.name}</span>
                  <span className="num text-[12px] text-ink-2">{b.sold}개</span>
                </li>
              ))}
              {best.length === 0 && <li className="py-4 text-[13px] text-ink-2">최근 7일 판매 내역이 없습니다.</li>}
            </ul>
          </Panel>
          <Panel title="재고 부족 알림" action={<Link href="/admin/products" className="text-[12px] font-medium underline underline-offset-4">관리</Link>}>
            <ul className="flex flex-col px-5 py-2 lg:px-6">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between border-b border-line py-3 last:border-0">
                  <span className="truncate pr-3 text-[13px]">{p.name}</span>
                  <span className={`num shrink-0 text-[12px] font-bold ${p.stock === 0 ? "text-danger" : "text-warning"}`}>{p.stock === 0 ? "품절" : `${p.stock}개 남음`}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
