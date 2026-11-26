"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { InquiryForm } from "./ContactForm";

/** 우측 하단 고정 문의 버튼 + 문의 모달 (<dialog>: Esc 닫기·포커스 가두기 기본 제공) */
export function InquiryFab() {
  const ref = useRef<HTMLDialogElement>(null);
  // 열 때마다 폼을 새로 그려 이전 입력·접수 완료 상태를 비움
  const [session, setSession] = useState(0);
  const path = usePathname();
  if (path === "/contact") return null; // 문의 페이지에는 같은 폼이 이미 있음

  const open = () => {
    setSession((n) => n + 1);
    ref.current?.showModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="문의하기"
        aria-haspopup="dialog"
        className="fixed right-4 bottom-[calc(max(env(safe-area-inset-bottom),16px)+76px)] z-40 grid size-14 place-items-center rounded-full bg-ink text-canvas shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:right-8 lg:bottom-8"
      >
        <Icon name="chat" size={24} />
      </button>

      <dialog
        ref={ref}
        aria-labelledby="inquiry-title"
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
        className="m-auto max-h-[100dvh] w-full max-w-none bg-canvas p-0 text-ink backdrop:bg-ink/50 max-sm:h-[100dvh] sm:max-h-[90dvh] sm:max-w-[560px]"
      >
        <div className="flex max-h-[inherit] flex-col sm:max-h-[90dvh] max-sm:h-full">
          <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-8">
            <div className="flex flex-col">
              <p className="cta text-ink-2">Client Service</p>
              <h2 id="inquiry-title" className="text-[18px] font-bold">문의하기</h2>
            </div>
            <button type="button" aria-label="문의창 닫기" onClick={() => ref.current?.close()}>
              <Icon name="close" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
            <p className="mb-5 text-[13px] text-ink-2">궁금한 점을 남겨 주시면 담당 어드바이저가 확인 후 연락드립니다.</p>
            <InquiryForm key={session} />
          </div>
        </div>
      </dialog>
    </>
  );
}
