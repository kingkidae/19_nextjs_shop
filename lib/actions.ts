"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { categories, grades, orderStatuses, productTags, swatches, type CategoryKey, type Grade, type OrderStatus, type ProductStatus } from "./data";
import { createClient } from "./supabase/server";

// 서버 액션은 공개 엔드포인트입니다. 입력은 여기서 검증하고, 권한(관리자/본인)은 DB RLS 가 강제합니다.

type Result = { error?: string };

export async function placeOrder(lines: { productId: string; color: string; qty: number }[], pay: string): Promise<Result & { orders?: string[]; login?: boolean }> {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { login: true };
  // 금액·재고 확인은 DB 함수 place_order 가 처리
  const items = lines.map((l) => ({ productId: String(l.productId), color: String(l.color), qty: Number(l.qty) }));
  const { data, error } = await sb.rpc("place_order", { items, pay });
  if (error) return { error: error.message };
  updateTag("products");
  return { orders: data as string[] };
}

const productStatuses: ProductStatus[] = ["판매중", "품절", "숨김"];

export async function setProductStatus(ids: string[], status: ProductStatus): Promise<Result> {
  if (!productStatuses.includes(status)) return { error: "잘못된 상태입니다" };
  const sb = await createClient();
  const { error } = await sb.from("products").update({ status }).in("id", ids);
  if (error) return { error: error.message };
  updateTag("products");
  refresh();
  return {};
}

export async function deleteProducts(ids: string[]): Promise<Result> {
  const sb = await createClient();
  const { error } = await sb.from("products").delete().in("id", ids);
  if (error) return { error: error.message };
  updateTag("products");
  refresh();
  return {};
}

export interface ProductInput {
  id?: string;
  name: string;
  category: string;
  subcategory: string;
  styleNo: string;
  description: string;
  price: number;
  stock: number;
  tag: string;
  status: string;
  colors: string[];
}

export async function saveProduct(input: ProductInput): Promise<Result> {
  const cat = categories.find((c) => c.key === input.category);
  const name = String(input.name ?? "").trim();
  const price = Number(input.price);
  const stock = Number(input.stock);
  if (!name) return { error: "상품명을 입력하세요" };
  if (!cat) return { error: "카테고리를 선택하세요" };
  if (!Number.isInteger(price) || price < 0) return { error: "판매가는 0 이상의 정수여야 합니다" };
  if (!Number.isInteger(stock) || stock < 0) return { error: "재고는 0 이상의 정수여야 합니다" };
  if (input.status !== "판매중" && input.status !== "숨김") return { error: "잘못된 노출 상태입니다" };
  const colors = swatches.filter((s) => input.colors?.includes(s.name));
  if (colors.length === 0) return { error: "색상을 1개 이상 선택하세요" };

  const row = {
    name,
    category: cat.key as CategoryKey,
    art: cat.art,
    subcategory: String(input.subcategory ?? "").trim() || cat.label,
    style_no: String(input.styleNo ?? "").trim(),
    description: String(input.description ?? "").trim(),
    price,
    stock,
    tag: productTags.includes(input.tag) ? input.tag : null,
    // 재고 0 으로 노출하면 품절로 표시
    status: input.status === "판매중" && stock === 0 ? "품절" : input.status,
    colors,
  };

  const sb = await createClient();
  const { data, error } = input.id ? await sb.from("products").update(row).eq("id", input.id).select("id") : await sb.from("products").insert(row).select("id");
  if (error) return { error: error.message };
  if (!data?.length) return { error: "저장 권한이 없습니다" };
  updateTag("products");
  redirect("/admin/products");
}

export async function setOrderStatus(no: string, status: OrderStatus): Promise<Result> {
  if (!orderStatuses.includes(status)) return { error: "잘못된 주문 상태입니다" };
  const sb = await createClient();
  const { error } = await sb.from("orders").update({ status }).eq("no", no);
  if (error) return { error: error.message };
  refresh();
  return {};
}

export async function setMemberGrade(uid: string, grade: Grade): Promise<Result> {
  if (!grades.includes(grade)) return { error: "잘못된 등급입니다" };
  const sb = await createClient();
  const { error } = await sb.from("profiles").update({ grade }).eq("id", uid);
  if (error) return { error: error.message };
  refresh();
  return {};
}
