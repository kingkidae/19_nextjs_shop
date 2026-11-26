const tones: Record<string, string> = {
  결제완료: "bg-info-bg text-info",
  상품준비중: "bg-warning-bg text-warning",
  배송중: "bg-info-bg text-info",
  배송완료: "bg-success-bg text-success",
  "취소/반품": "bg-danger-bg text-danger",
  판매중: "bg-success-bg text-success",
  품절: "bg-danger-bg text-danger",
  숨김: "bg-muted text-ink-2",
  VIP: "bg-ink text-canvas",
  GOLD: "bg-warning-bg text-warning",
  MEMBER: "bg-muted text-ink-2",
  관리자: "bg-brand-green text-canvas",
  "상담 대기": "bg-warning-bg text-warning",
  "상담 완료": "bg-success-bg text-success",
  "일반 회원": "bg-muted text-ink-2",
};

export function Badge({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-[2px] px-2.5 py-1 text-[11px] font-medium leading-none ${tones[label] ?? "bg-muted text-ink-2"} ${className}`}>
      {label}
    </span>
  );
}
