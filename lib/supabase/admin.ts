import "server-only";
import { createClient } from "@supabase/supabase-js";

/** RLS 를 우회하는 서버 전용 클라이언트. 결제 승인 후 주문 확정(complete_checkout)에만 사용 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
