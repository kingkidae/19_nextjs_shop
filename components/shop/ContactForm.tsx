"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, TextareaField } from "@/components/ui/Field";
import { Icon, type IconName } from "@/components/ui/Icon";
import { sendInquiry } from "@/lib/contact-action";

const info: [IconName, string, string][] = [
  ["chat", "클라이언트 서비스센터", "02-0000-0000"],
  ["calendar", "운영 시간", "월–토 10:00 – 19:00 (공휴일 제외)"],
  ["truck", "주문·배송 문의", "주문번호를 함께 적어 주시면 더 빠르게 안내해 드립니다."],
];

/** 문의 입력 폼 (/contact 페이지와 우측 하단 문의 모달 공용) */
export function InquiryForm({ className = "" }: { className?: string }) {
  const [state, setState] = useState<{ ok?: boolean; error?: string }>({});
  const [pending, start] = useTransition();

  if (state.ok)
    return (
      <div className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${className}`} role="status">
        <Icon name="check" size={40} />
        <p className="text-[20px] font-bold">문의가 접수되었습니다</p>
        <p className="text-[13px] text-ink-2">남겨 주신 이메일로 영업일 기준 1–2일 이내에 답변드리겠습니다.</p>
      </div>
    );

  return (
    <form
      className={`flex flex-col gap-5 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        start(async () => setState(await sendInquiry(form)));
      }}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="이름 *" name="name" autoComplete="name" maxLength={50} placeholder="홍길동" required />
        <Field label="전화번호 *" name="phone" type="tel" autoComplete="tel" maxLength={20} placeholder="010-0000-0000" required />
      </div>
      <Field label="이메일 *" name="email" type="email" autoComplete="email" maxLength={254} placeholder="example@email.com" required />
      <Field label="주소 *" name="address" autoComplete="street-address" maxLength={200} placeholder="서울특별시 강남구 ○○로 00" required />
      <TextareaField label="문의 내용 *" name="message" minLength={10} maxLength={2000} placeholder="문의하실 내용을 10자 이상 입력해 주세요." required />
      {/* 자동 스팸 차단용: 사람에게는 보이지 않는 칸 */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <Checkbox name="privacy" required label="[필수] 문의 답변을 위한 개인정보(이름, 연락처, 이메일, 주소) 수집·이용에 동의합니다" />
      {state.error && <p role="alert" className="text-[12px] text-danger">{state.error}</p>}
      <Button type="submit" disabled={pending} className="h-[52px] w-full">{pending ? "보내는 중…" : "문의 보내기"}</Button>
    </form>
  );
}

export function ContactForm() {
  return (
    <main className="pb-24 lg:py-24 lg:pb-[140px]">
      <div className="mx-auto flex max-w-[1120px] flex-col lg:flex-row">
        <section className="flex flex-col gap-5 bg-subtle px-5 py-10 lg:w-[400px] lg:shrink-0 lg:bg-transparent lg:px-16 lg:py-14">
          <p className="cta text-ink-2">Client Service</p>
          <h1 className="text-[22px] font-bold lg:text-[28px]">문의하기</h1>
          <p className="text-[13px] text-ink-2">상품, 주문, 매장 방문 등 궁금한 점을 남겨 주세요. 담당 어드바이저가 확인 후 연락드립니다.</p>
          <ul className="flex flex-col gap-4 pt-2">
            {info.map(([icon, title, body]) => (
              <li key={title} className="flex gap-3">
                <Icon name={icon} size={20} className="mt-0.5 shrink-0" />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-medium">{title}</span>
                  <span className="text-[12px] text-ink-2">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-1 flex-col gap-5 px-5 py-10 lg:border-l lg:border-line lg:px-16 lg:py-14">
          <h2 className="h2">문의 내용 작성</h2>
          <InquiryForm />
        </div>
      </div>
    </main>
  );
}
