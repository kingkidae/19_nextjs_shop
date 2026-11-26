import type { Metadata } from "next";
import { ContactForm } from "@/components/shop/ContactForm";
import { Header } from "@/components/shop/Header";

export const metadata: Metadata = { title: "문의하기" };

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactForm />
    </>
  );
}
