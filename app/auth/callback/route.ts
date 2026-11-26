import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

// Google 등 OAuth 로그인 후 돌아오는 곳: 인증 코드를 세션 쿠키로 교환
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  if (code) {
    const { error } = await (await createClient()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(origin + safeNext(searchParams.get("next"), origin));
  }
  return NextResponse.redirect(`${origin}/login`);
}
