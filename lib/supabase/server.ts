import { createServerClient } from "@supabase/ssr";
import { createClient as createPlainClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { connection } from "next/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/** 로그인 세션(쿠키) 기반 클라이언트. 권한은 DB RLS 가 강제합니다. */
export async function createClient() {
  // 세션 검증은 현재 시각(토큰 만료)을 쓰므로 미리 렌더링(prefetch)하지 않고 실제 요청 때만 실행
  await connection();
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Component 에서는 쿠키를 쓸 수 없음 — 세션 갱신은 proxy.ts 가 담당
        }
      },
    },
  });
}

/** 쿠키 없는 익명 클라이언트. "use cache" 안에서 공개 데이터 조회용 */
export const createAnonClient = () => createPlainClient(url, key, { auth: { persistSession: false } });
