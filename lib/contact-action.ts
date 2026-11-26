"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { formatDate } from "./data";
import { buildInquiryMail, validateInquiry } from "./inquiry";

// shortcut: 서버 메모리 기반 발송 제한(IP당 10분 3회). 서버가 여러 대면 Redis/DB 기반으로 전환
const recent = new Map<string, number[]>();
const WINDOW = 10 * 60_000;
const MAX = 3;

export async function sendInquiry(form: FormData): Promise<{ ok?: boolean; error?: string }> {
  // 사람 눈에 안 보이는 칸이 채워져 있으면 자동 스팸 → 조용히 성공 처리
  if (form.get("website")) return { ok: true };

  const result = validateInquiry(Object.fromEntries(form));
  if ("error" in result) return { error: result.error };

  const { SMTP_HOST = "smtp.gmail.com", SMTP_PORT = "465", SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("[문의] SMTP_USER / SMTP_PASS 환경변수가 없습니다");
    return { error: "메일 발송 설정이 되어 있지 않습니다. 잠시 후 다시 시도해 주세요." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW);
  if (hits.length >= MAX) return { error: "문의가 너무 많습니다. 10분 후 다시 시도해 주세요." };
  recent.set(ip, [...hits, now]);

  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      // Gmail 앱 비밀번호는 "abcd efgh ..." 처럼 띄어 써서 보여 주므로 공백 제거
      auth: { user: SMTP_USER, pass: SMTP_PASS.replace(/\s/g, "") },
    });
    await transport.sendMail(buildInquiryMail(result.data, SMTP_USER, CONTACT_TO || SMTP_USER, formatDate(new Date().toISOString())));
    return { ok: true };
  } catch (e) {
    console.error("[문의] 메일 발송 실패", e);
    return { error: "메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }
}
