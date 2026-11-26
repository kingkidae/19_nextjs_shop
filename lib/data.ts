// 공용 타입 · 상수 · 포맷터 (데이터는 Supabase 에 저장)

export type ArtKey = "bag" | "loafer" | "wallet" | "jewelry" | "scarf" | "sunglasses" | "belt";

export type CategoryKey = "women-bags" | "men-shoes" | "leather-goods" | "jewelry" | "scarves" | "eyewear" | "belts";

export type ProductStatus = "판매중" | "품절" | "숨김";

export interface Product {
  id: string;
  name: string;
  category: CategoryKey;
  subcategory: string;
  price: number;
  art: ArtKey;
  tag: string | null;
  styleNo: string;
  colors: { name: string; hex: string }[];
  description: string;
  details: string[];
  stock: number;
  status: ProductStatus;
  createdAt: string;
}

export const categories: { key: CategoryKey; label: string; art: ArtKey }[] = [
  { key: "women-bags", label: "여성 핸드백", art: "bag" },
  { key: "men-shoes", label: "남성 슈즈", art: "loafer" },
  { key: "leather-goods", label: "지갑 & 레더 소품", art: "wallet" },
  { key: "jewelry", label: "파인 주얼리", art: "jewelry" },
  { key: "scarves", label: "실크 스카프", art: "scarf" },
  { key: "eyewear", label: "아이웨어", art: "sunglasses" },
  { key: "belts", label: "벨트", art: "belt" },
];

export type OrderStatus = "결제완료" | "상품준비중" | "배송중" | "배송완료" | "취소/반품";

export interface Order {
  no: string;
  userId: string | null;
  customer: string;
  productId: string | null;
  productName: string;
  art: ArtKey;
  styleNo: string;
  color: string;
  qty: number;
  amount: number;
  payment: string;
  status: OrderStatus;
  channel: "온라인" | "매장 픽업";
  createdAt: string;
}

export type Grade = "VIP" | "GOLD" | "MEMBER";

/** 권한: 관리자 / 일반 회원 (로그인하지 않은 사람은 방문자) */
export type Role = "admin" | "member";
export const roleLabel: Record<Role, string> = { admin: "관리자", member: "일반 회원" };

export interface Member {
  uid: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: Grade;
  role: Role;
  joined: string;
  orders: number;
  totalSpent: number;
  lastVisit: string;
  marketing: boolean;
  advisor: string | null;
}

export const formatKRW = (n: number) => `₩ ${n.toLocaleString("ko-KR")}`;

// PostgREST 별칭으로 DB(snake_case) 컬럼을 TS 필드명에 맞춰 조회
export const PRODUCT_COLS = "id,name,category,subcategory,price,art,tag,styleNo:style_no,colors,description,details,stock,status,createdAt:created_at";
export const ORDER_COLS = "no,userId:user_id,customer,productId:product_id,productName:product_name,art:product_art,styleNo:style_no,color,qty,amount,payment,status,channel,createdAt:created_at";

export const orderStatuses: OrderStatus[] = ["결제완료", "상품준비중", "배송중", "배송완료", "취소/반품"];
export const grades: Grade[] = ["VIP", "GOLD", "MEMBER"];
export const productTags = ["NEW", "온라인 단독", "한정 수량"];
export const swatches = [
  { name: "블랙", hex: "#000000" },
  { name: "포레스트 그린", hex: "#1F3A2E" },
  { name: "버건디", hex: "#731A1F" },
  { name: "아이보리", hex: "#DCD1BF" },
  { name: "옐로 골드", hex: "#C9A961" },
  { name: "하바나", hex: "#6B4A2E" },
];

const kst = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

/** ISO 시각 → "2026.11.26 09:41" (한국 시간). time=false 면 날짜만 */
export function formatDate(iso: string, time = true) {
  const p = Object.fromEntries(kst.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.year}.${p.month}.${p.day}` + (time ? ` ${p.hour}:${p.minute}` : "");
}

/** 로그인 후 이동할 경로. 같은 사이트 경로만 허용 (오픈 리다이렉트 방지) */
export function safeNext(raw: string | null, origin: string) {
  const u = new URL(raw ?? "/mypage", origin);
  if (u.origin !== origin) return "/mypage";
  // 앞 슬래시를 하나로 합침: "/.//evil.com" 은 정규화 후 "//evil.com"(외부 주소)이 되기 때문
  return "/" + (u.pathname + u.search + u.hash).replace(/^[/\\]+/, "");
}

export interface InquiryRow {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  message: string;
  done: boolean;
  doneAt: string | null;
  createdAt: string;
}
export const INQUIRY_COLS = "id,name,phone,email,address,message,done,doneAt:done_at,createdAt:created_at";
