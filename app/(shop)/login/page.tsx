import type { Metadata } from "next";
import { AuthForms } from "@/components/shop/AuthForms";
import { Header } from "@/components/shop/Header";

export const metadata: Metadata = { title: "로그인 · 회원가입" };

export default function LoginPage() {
  return (
    <>
      <Header />
      <AuthForms />
    </>
  );
}
