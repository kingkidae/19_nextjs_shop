import { ORDER_COLS, PRODUCT_COLS, type Order, type Product } from "./data";
import { createClient } from "./supabase/server";

// 관리자 화면용 조회 (세션 쿠키 + RLS: 관리자만 전체 행이 보임)
// shortcut: 주문·회원 전체를 한 번에 불러와 JS 로 집계. 수천 건 이상이면 SQL 집계/페이지네이션으로 전환

export async function adminProducts() {
  const { data, error } = await (await createClient()).from("products").select(PRODUCT_COLS).order("id");
  if (error) throw new Error(error.message);
  return data as unknown as Product[];
}

export async function adminOrders() {
  const { data, error } = await (await createClient()).from("orders").select(ORDER_COLS).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as unknown as Order[];
}

export async function adminProfiles() {
  const { data, error } = await (await createClient())
    .from("profiles")
    .select("uid:id, id:member_no, name, email, phone, grade, role, marketing, advisor, createdAt:created_at, lastVisit:last_visit")
    .order("created_at");
  if (error) throw new Error(error.message);
  return data as unknown as { uid: string; id: string; name: string; email: string; phone: string; grade: "VIP" | "GOLD" | "MEMBER"; role: "admin" | "member"; marketing: boolean; advisor: string | null; createdAt: string; lastVisit: string }[];
}

/** 한국 시간 기준 YYYY-MM-DD */
export const kstDay = (d: Date | string) => new Date(new Date(d).getTime() + 9 * 3600_000).toISOString().slice(0, 10);
