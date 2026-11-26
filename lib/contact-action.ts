"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { formatDate } from "./data";
import { buildInquiryMail, validateInquiry, type Inquiry } from "./inquiry";
import { createClient } from "./supabase/server";

// shortcut: 서버 메모리 기반 발송 제한(IP당 10분 3회). 서버가 여러 대면 Redis/DB 기반으로 전환
const recent = new Map<string, number[]>();
const WINDOW = 10 * 60_000;
const MAX = 3;

/** 문의 접수: 관리자 게시판(DB) 저장 + 관리자 메일 발송. 둘 중 하나만 성공해도 접수로 처리 */
export async function sendInquiry(form: FormData): Promise<{ ok?: boolean; error?: string }> {
  // 사람 눈에 안 보이는 칸이 채워져 있으면 자동 스팸 → 조용히 성공 처리
  if (form.get("website")) return { ok: true };

  const result = validateInquiry(Object.fromEntries(form));
  if ("error" in result) return { error: result.error };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (hits.length >= MAX) return { error: "문의가 너무 많습니다. 10분 후 다시 시도해 주세요." };
  recent.set(ip, [...hits, now]);

  const [saved, mailed] = await Promise.all([saveInquiry(result.data), mailInquiry(result.data)]);
  if (!saved && !mailed) return { error: "문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  return { ok: true };
}

async function saveInquiry(d: Inquiry) {
  const { error } = await (await createClient()).from("inquiries").insert(d);
  if (error) console.error("[문의] DB 저장 실패", error.message);
  return !error;
}

async function mailInquiry(d: Inquiry) {
  const { SMTP_HOST = "smtp.gmail.com", SMTP_PORT = "465", SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("[문의] SMTP_USER / SMTP_PASS 환경변수가 없어 메일을 보내지 않았습니다");
    return false;
  }
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      // Gmail 앱 비밀번호는 "abcd efgh ..." 처럼 띄어 써서 보여 주므로 공백 제거
      auth: { user: SMTP_USER, pass: SMTP_PASS.replace(/\s/g, "") },
    });
    await transport.sendMail(buildInquiryMail(d, SMTP_USER, CONTACT_TO || SMTP_USER, formatDate(new Date().toISOString())));
    return true;
  } catch (e) {
    console.error("[문의] 메일 발송 실패", e);
    return false;
  }
}
