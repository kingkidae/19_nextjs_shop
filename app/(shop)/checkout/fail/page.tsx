import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/shop/Header";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "결제 실패" };

// 토스 결제 실패(failUrl) 또는 승인 단계 실패 시 이동. 쇼핑백은 그대로 유지
export default function FailPage({ searchParams }: { searchParams: Promise<{ code?: string; message?: string }> }) {
  return (
    <>
      <Header />
      <Suspense fallback={<main className="min-h-dvh" />}>
        <Reason searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Reason({ searchParams }: { searchParams: Promise<{ code?: string; message?: string }> }) {
  const { code, message } = await searchParams;
  return (
    <main className="mx-auto flex max-w-[560px] flex-col items-center gap-5 px-5 py-32 text-center">
      <h1 className="text-[24px] font-bold">{code === "PAY_PROCESS_CANCELED" ? "결제가 취소되었습니다" : "결제에 실패했습니다"}</h1>
      <p className="text-[13px] text-ink-2">{message?.slice(0, 300) || "잠시 후 다시 시도해 주세요."}</p>
      {code && <p className="num text-[11px] text-ink-3">오류 코드: {code.slice(0, 60)}</p>}
      <div className="flex gap-3">
        <ButtonLink href="/cart">쇼핑백으로</ButtonLink>
        <ButtonLink href="/checkout" variant="secondary">다시 결제하기</ButtonLink>
      </div>
    </main>
  );
}
