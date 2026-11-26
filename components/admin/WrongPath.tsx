"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DELAY = 1500;

/** 관리자가 아닌 사람이 /admin 에 들어왔을 때: 안내 후 이전 페이지로 이동 */
export function WrongPath() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      // 우리 사이트에서 넘어온 경우만 뒤로가기, 주소를 직접 입력했거나 외부에서 왔으면 홈으로
      const fromHere = document.referrer && new URL(document.referrer).origin === location.origin;
      if (fromHere && history.length > 1) router.back();
      else router.replace("/");
    }, DELAY);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-5 text-center">
      <p className="logo text-[28px]">VELLANTI</p>
      <h1 className="text-[22px] font-bold">잘못된 경로입니다</h1>
      <p className="text-[13px] text-ink-2" role="status">
        잠시 후 이전 페이지로 이동합니다.
      </p>
    </main>
  );
}
