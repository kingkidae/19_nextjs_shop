// 고객 문의: 입력 검증 + 관리자에게 보낼 메일 내용 (서버·테스트 공용, 외부 의존 없음)

export interface Inquiry {
  name: string;
  phone: string;
  email: string;
  address: string;
  message: string;
}

const limits = { name: 50, phone: 20, email: 254, address: 200, message: 2000 };

/** 검증 통과 시 정리된 값, 실패 시 사용자에게 보여 줄 오류 메시지 */
export function validateInquiry(raw: Record<string, unknown>): { data: Inquiry } | { error: string } {
  const get = (k: keyof Inquiry) => String(raw[k] ?? "").trim();
  const data: Inquiry = { name: get("name"), phone: get("phone"), email: get("email"), address: get("address"), message: get("message") };

  for (const [k, max] of Object.entries(limits) as [keyof Inquiry, number][]) {
    if (data[k].length > max) return { error: `입력이 너무 깁니다 (${max}자 이하)` };
  }
  // 한 줄 항목에 줄바꿈·제어문자 금지 (메일 제목·헤더 조작 방지)
  if ([data.name, data.phone, data.email, data.address].some((v) => /[\u0000-\u001f\u007f]/.test(v))) return { error: "허용되지 않는 문자가 포함되어 있습니다" };
  if (!data.name) return { error: "이름을 입력하세요" };
  const digits = data.phone.replace(/\D/g, "");
  if (!/^[0-9+\-\s()]+$/.test(data.phone) || digits.length < 9 || digits.length > 12) return { error: "전화번호를 정확히 입력하세요" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { error: "이메일 주소를 정확히 입력하세요" };
  if (!data.address) return { error: "주소를 입력하세요" };
  if (data.message.length < 10) return { error: "문의 내용을 10자 이상 입력하세요" };
  if (raw.privacy !== "on") return { error: "개인정보 수집·이용에 동의해 주세요" };
  return { data };
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** 관리자 수신 메일. 답장하면 고객에게 바로 가도록 replyTo 지정 */
export function buildInquiryMail(d: Inquiry, from: string, to: string, receivedAt: string) {
  const rows: [string, string][] = [
    ["이름", d.name],
    ["전화번호", d.phone],
    ["이메일", d.email],
    ["주소", d.address],
    ["접수 시각", receivedAt],
  ];
  return {
    from: `VELLANTI 문의 <${from}>`,
    to,
    replyTo: { name: d.name, address: d.email },
    subject: `[VELLANTI 문의] ${d.name} 님의 문의`,
    text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n[문의 내용]\n${d.message}`,
    html: `<h2 style="font-size:16px">VELLANTI 고객 문의</h2>
<table style="border-collapse:collapse;font-size:14px">${rows
      .map(([k, v]) => `<tr><th style="text-align:left;padding:6px 16px 6px 0;color:#767676">${k}</th><td style="padding:6px 0">${escapeHtml(v)}</td></tr>`)
      .join("")}</table>
<p style="font-size:14px;color:#767676;margin-top:20px">문의 내용</p>
<div style="font-size:14px;white-space:pre-wrap;border-top:1px solid #e0e0e0;padding-top:12px">${escapeHtml(d.message)}</div>`,
  };
}
