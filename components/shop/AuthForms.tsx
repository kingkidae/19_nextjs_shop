"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { safeNext } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field } from "@/components/ui/Field";
import { Icon, type IconName } from "@/components/ui/Icon";

const benefits: [IconName, string][] = [
  ["truck", "주문 내역 및 배송 현황 조회"],
  ["heart", "위시리스트 저장 및 재입고 알림"],
  ["calendar", "부티크 방문 예약 및 1:1 맞춤 상담"],
  ["gift", "신제품 출시와 프라이빗 이벤트 우선 안내"],
];

export function AuthForms() {
  // 모바일에서는 탭으로 전환, PC(lg)에서는 두 폼을 나란히 표시
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [msg, setMsg] = useState<{ login?: string; signup?: string }>({});
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const nextPath = () => safeNext(new URLSearchParams(location.search).get("next"), location.origin);

  const done = () => {
    router.replace(nextPath());
    router.refresh();
  };

  // Google 인증 후 /auth/callback 에서 세션을 만들고 원래 가려던 곳으로 이동
  const google = async () => {
    setPending(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(nextPath())}` },
    });
    if (error) {
      setPending(false);
      setMsg({ login: error.message });
    }
  };

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setPending(true);
    const { error } = await createClient().auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    setPending(false);
    if (error) return setMsg({ login: error.message === "Invalid login credentials" ? "이메일 또는 비밀번호가 올바르지 않습니다." : error.message });
    done();
  };

  const signup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setPending(true);
    const { data, error } = await createClient().auth.signUp({
      email: String(f.get("email")),
      password: String(f.get("password")),
      options: { data: { name: `${f.get("lastName")}${f.get("firstName")}`, phone: String(f.get("phone") ?? ""), marketing: f.get("marketing") === "on" } },
    });
    setPending(false);
    if (error) return setMsg({ signup: error.message });
    if (data.session) return done();
    setMsg({ signup: "인증 메일을 보냈습니다. 메일의 링크를 누른 뒤 로그인해 주세요." });
  };

  return (
    <main className="pb-24 lg:py-24 lg:pb-[140px]">
      <div className="grid grid-cols-2 border-b border-line lg:hidden" role="tablist">
        {(["login", "signup"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`cta h-12 ${tab === t ? "border-b-2 border-ink text-ink" : "text-ink-2"}`}>
            {t === "login" ? "로그인" : "회원가입"}
          </button>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1120px] flex-col lg:flex-row">
        <form className={`${tab === "login" ? "flex" : "hidden"} flex-1 flex-col gap-5 px-5 py-10 lg:flex lg:border-r lg:border-line lg:px-16 lg:py-14`} onSubmit={login}>
          <h1 className="text-[22px] font-bold lg:text-[28px]">로그인</h1>
          <p className="text-[13px] text-ink-2">VELLANTI 계정으로 로그인하고 주문 내역, 위시리스트, 예약 정보를 확인하세요.</p>
          <Field label="이메일" name="email" type="email" placeholder="example@email.com" autoComplete="email" required />
          <Field label="비밀번호" name="password" type="password" placeholder="비밀번호를 입력하세요" autoComplete="current-password" required />
          <div className="flex items-center justify-between">
            <Checkbox label="로그인 상태 유지" defaultChecked />
            <Link href="#" className="cta underline underline-offset-4">비밀번호 찾기</Link>
          </div>
          {msg.login && <p role="alert" className="text-[12px] text-danger">{msg.login}</p>}
          <Button type="submit" disabled={pending} className="h-[52px] w-full">로그인</Button>
          <div className="flex items-center gap-4 text-[12px] text-ink-2">
            <span className="h-px flex-1 bg-line" />또는<span className="h-px flex-1 bg-line" />
          </div>
          <Button type="button" variant="secondary" className="w-full normal-case" disabled={pending} onClick={google}>Google로 계속하기</Button>
          {["카카오로 계속하기", "네이버로 계속하기", "Apple로 계속하기"].map((s) => (
            <Button key={s} type="button" variant="secondary" className="w-full normal-case">{s}</Button>
          ))}
        </form>

        <form className={`${tab === "signup" ? "flex" : "hidden"} flex-1 flex-col gap-5 px-5 py-10 lg:flex lg:px-16 lg:py-14`} onSubmit={signup}>
          <h2 className="text-[22px] font-bold lg:text-[28px]">회원가입</h2>
          <p className="text-[13px] text-ink-2">계정을 만들고 VELLANTI만의 특별한 서비스를 누리세요.</p>
          <ul className="flex flex-col gap-3 bg-subtle p-5">
            {benefits.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-2.5 text-[13px]"><Icon name={icon} size={18} />{label}</li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-3">
            <Field label="성" name="lastName" placeholder="홍" autoComplete="family-name" required />
            <Field label="이름" name="firstName" placeholder="길동" autoComplete="given-name" required />
          </div>
          <Field label="이메일" name="email" type="email" placeholder="example@email.com" autoComplete="email" required />
          <Field label="비밀번호" name="password" type="password" placeholder="영문, 숫자, 특수문자 포함 8자 이상" autoComplete="new-password" minLength={8} required />
          <Field label="휴대폰 번호" name="phone" type="tel" placeholder="010-0000-0000" autoComplete="tel" />
          <div className="flex flex-col gap-2.5 pt-1">
            <Checkbox name="terms" required label="[필수] 이용약관 및 개인정보 수집·이용에 동의합니다" defaultChecked />
            <Checkbox name="marketing" label="[선택] 이메일·문자로 컬렉션 소식을 받겠습니다" />
          </div>
          {msg.signup && <p role="alert" className="text-[12px] text-ink-2">{msg.signup}</p>}
          <Button type="submit" disabled={pending} className="h-[52px] w-full">회원가입</Button>
        </form>
      </div>
    </main>
  );
}

export function SignOutButton({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      {children}
    </button>
  );
}
