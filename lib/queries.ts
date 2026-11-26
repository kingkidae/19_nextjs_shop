import { cacheLife, cacheTag } from "next/cache";
import { PRODUCT_COLS, type Product } from "./data";
import { createAnonClient, createClient } from "./supabase/server";

/** 스토어에 노출되는 상품 목록(숨김 제외, RLS). 관리자 변경 시 updateTag("products") 로 갱신 */
export async function getCatalog(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  const { data, error } = await createAnonClient().from("products").select(PRODUCT_COLS).order("id");
  if (error) throw new Error(`상품 조회 실패: ${error.message}`);
  return data as unknown as Product[];
}

/** 관리자 확인. 관리자가 아니면 admin 은 null */
export async function getAdmin() {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { sb, user: null, admin: null };
  const { data } = await sb.from("profiles").select("name, role").eq("id", user.id).single();
  return { sb, user, admin: data?.role === "admin" ? data : null };
}
