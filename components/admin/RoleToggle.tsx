"use client";

import { useTransition } from "react";
import { setMemberRole } from "@/lib/actions";
import { roleLabel, type Role } from "@/lib/data";

/** 관리자로 지정 / 관리자 해제 버튼. 본인 권한은 바꿀 수 없음(서버에서도 차단) */
export function RoleToggle({ uid, name, role, isMe, className = "" }: { uid: string; name: string; role: Role; isMe?: boolean; className?: string }) {
  const [pending, start] = useTransition();
  if (isMe) return <span className={`text-[11px] text-ink-3 ${className}`}>본인</span>;
  const next: Role = role === "admin" ? "member" : "admin";
  return (
    <button
      type="button"
      disabled={pending}
      className={`text-[12px] font-medium underline underline-offset-4 disabled:opacity-40 ${className}`}
      onClick={() => {
        if (!confirm(`${name} 님을 ${roleLabel[next]}(으)로 변경할까요?`)) return;
        start(async () => {
          const res = await setMemberRole(uid, next);
          if (res.error) alert(res.error);
        });
      }}
    >
      {pending ? "변경 중…" : role === "admin" ? "관리자 해제" : "관리자로 지정"}
    </button>
  );
}
