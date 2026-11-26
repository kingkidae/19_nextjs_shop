// 데모용 가상 데이터 (실제 브랜드·상품과 무관)

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
  tag?: string;
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

const black = { name: "블랙", hex: "#000000" };
const green = { name: "포레스트 그린", hex: "#1F3A2E" };
const burgundy = { name: "버건디", hex: "#731A1F" };
const ivory = { name: "아이보리", hex: "#DCD1BF" };
const gold = { name: "옐로 골드", hex: "#C9A961" };
const tortoise = { name: "하바나", hex: "#6B4A2E" };

const bagDesc =
  "매끄러운 카프스킨 레더로 제작한 구조적인 실루엣의 핸드백입니다. 골드 톤 하드웨어와 탈착 가능한 숄더 스트랩으로 다양하게 연출할 수 있습니다.";

export const products: Product[] = [
  { id: "p001", name: "아르코 미니 탑 핸들 백", category: "women-bags", subcategory: "탑 핸들 백", price: 4250000, art: "bag", tag: "NEW", styleNo: "782104 AA0T1 1000", colors: [black, green, burgundy, ivory], description: bagDesc, details: ["블랙 카프스킨 레더", "골드 톤 하드웨어", "탈착식 레더 숄더 스트랩", "가로 24 x 세로 18 x 폭 9cm", "이탈리아 제작"], stock: 14, status: "판매중", createdAt: "2026-11-20" },
  { id: "p002", name: "루나 레더 숄더백", category: "women-bags", subcategory: "숄더백", price: 3480000, art: "bag", styleNo: "781120 1B0LU 1000", colors: [black, ivory], description: bagDesc, details: ["카프스킨 레더", "체인 & 레더 스트랩", "가로 26 x 세로 16 x 폭 7cm", "이탈리아 제작"], stock: 8, status: "판매중", createdAt: "2026-10-02" },
  { id: "p003", name: "베로나 미디엄 토트백", category: "women-bags", subcategory: "토트백", price: 3960000, art: "bag", styleNo: "779034 0V0RA 2120", colors: [black, burgundy], description: bagDesc, details: ["그레인 레더", "내부 지퍼 포켓", "가로 34 x 세로 27 x 폭 14cm", "이탈리아 제작"], stock: 5, status: "판매중", createdAt: "2026-09-18" },
  { id: "p004", name: "시에나 크로스바디 백", category: "women-bags", subcategory: "크로스바디", price: 2780000, art: "bag", tag: "온라인 단독", styleNo: "780561 SI0NA 1000", colors: [black, green], description: bagDesc, details: ["카프스킨 레더", "조절 가능한 스트랩", "가로 22 x 세로 15 x 폭 6cm", "이탈리아 제작"], stock: 22, status: "판매중", createdAt: "2026-11-01" },
  { id: "p005", name: "팔라초 이브닝 클러치", category: "women-bags", subcategory: "클러치", price: 2150000, art: "bag", styleNo: "777802 PZ0CL 1000", colors: [black], description: bagDesc, details: ["새틴 & 레더", "탈착식 체인", "가로 25 x 세로 13 x 폭 4cm"], stock: 0, status: "품절", createdAt: "2026-08-11" },
  { id: "p006", name: "아르코 미디엄 숄더백", category: "women-bags", subcategory: "숄더백", price: 4890000, art: "bag", tag: "NEW", styleNo: "782110 AA0M2 1000", colors: [black, green, ivory], description: bagDesc, details: ["카프스킨 레더", "골드 톤 하드웨어", "가로 30 x 세로 21 x 폭 10cm"], stock: 6, status: "판매중", createdAt: "2026-11-22" },
  { id: "p007", name: "루나 체인 미니백", category: "women-bags", subcategory: "미니백", price: 2640000, art: "bag", styleNo: "781155 LU0MN 1000", colors: [black, burgundy], description: bagDesc, details: ["카프스킨 레더", "체인 스트랩", "가로 18 x 세로 12 x 폭 6cm"], stock: 11, status: "판매중", createdAt: "2026-10-15" },
  { id: "p008", name: "카사 버킷백", category: "women-bags", subcategory: "숄더백", price: 3120000, art: "bag", styleNo: "776411 CA0BK 2130", colors: [ivory, black], description: bagDesc, details: ["스웨이드 & 레더", "드로스트링 클로저", "가로 22 x 세로 25 x 폭 16cm"], stock: 3, status: "판매중", createdAt: "2026-09-05" },
  { id: "p009", name: "베로나 라지 토트백", category: "women-bags", subcategory: "토트백", price: 4420000, art: "bag", styleNo: "779040 0V0LG 1000", colors: [black], description: bagDesc, details: ["그레인 레더", "탈착식 파우치", "가로 40 x 세로 30 x 폭 16cm"], stock: 4, status: "판매중", createdAt: "2026-07-21" },
  { id: "p010", name: "시에나 카메라 백", category: "women-bags", subcategory: "크로스바디", price: 2390000, art: "bag", tag: "NEW", styleNo: "780590 SI0CM 1000", colors: [black, green], description: bagDesc, details: ["카프스킨 레더", "더블 지퍼", "가로 21 x 세로 14 x 폭 7cm"], stock: 17, status: "판매중", createdAt: "2026-11-18" },
  { id: "p011", name: "몬테 호보백", category: "women-bags", subcategory: "숄더백", price: 3750000, art: "bag", styleNo: "775302 MO0HB 1000", colors: [black, ivory], description: bagDesc, details: ["소프트 레더", "가로 35 x 세로 28 x 폭 10cm"], stock: 9, status: "숨김", createdAt: "2026-06-30" },
  { id: "p012", name: "팔라초 탑 핸들 백", category: "women-bags", subcategory: "탑 핸들 백", price: 5900000, art: "bag", tag: "한정 수량", styleNo: "777850 PZ0TH 1000", colors: [black, burgundy], description: bagDesc, details: ["크로커다일 엠보스 레더", "가로 28 x 세로 20 x 폭 11cm"], stock: 2, status: "판매중", createdAt: "2026-11-10" },
  { id: "p013", name: "몬테 레더 로퍼", category: "men-shoes", subcategory: "로퍼", price: 1380000, art: "loafer", tag: "NEW", styleNo: "790113 BKO10 1000", colors: [black, tortoise], description: "부드러운 카프스킨 레더로 제작한 클래식 로퍼. 메탈 디테일이 포인트입니다.", details: ["카프스킨 레더", "레더 솔", "이탈리아 제작"], stock: 19, status: "판매중", createdAt: "2026-11-12" },
  { id: "p014", name: "시그니처 지퍼 장지갑", category: "leather-goods", subcategory: "지갑", price: 980000, art: "wallet", styleNo: "773201 SG0ZW 1000", colors: [black, green], description: "카드 슬롯 12개와 지퍼 동전 포켓을 갖춘 장지갑.", details: ["카프스킨 레더", "카드 슬롯 12개", "가로 19 x 세로 10cm"], stock: 31, status: "판매중", createdAt: "2026-08-02" },
  { id: "p015", name: "시그니처 카드 케이스", category: "leather-goods", subcategory: "카드 케이스", price: 620000, art: "wallet", styleNo: "773240 SG0CC 1000", colors: [black, burgundy, green], description: "슬림한 실루엣의 카드 케이스.", details: ["카프스킨 레더", "카드 슬롯 4개"], stock: 40, status: "판매중", createdAt: "2026-07-14" },
  { id: "p016", name: "링크 골드 링", category: "jewelry", subcategory: "반지", price: 2640000, art: "jewelry", tag: "온라인 단독", styleNo: "764001 J8400 8000", colors: [gold], description: "18K 옐로 골드 체인 링크 모티프 반지.", details: ["18K 옐로 골드", "이탈리아 제작"], stock: 7, status: "판매중", createdAt: "2026-10-28" },
  { id: "p017", name: "실크 트윌 스카프 90", category: "scarves", subcategory: "스카프", price: 640000, art: "scarf", styleNo: "771256 3G001 9078", colors: [ivory, green], description: "아카이브 프린트를 재해석한 실크 트윌 스카프.", details: ["실크 100%", "90 x 90cm", "이탈리아 제작"], stock: 25, status: "판매중", createdAt: "2026-09-27" },
  { id: "p018", name: "오벌 선글라스", category: "eyewear", subcategory: "선글라스", price: 590000, art: "sunglasses", styleNo: "768812 I3330 1012", colors: [black, tortoise], description: "빈티지 무드의 오벌 프레임 선글라스.", details: ["아세테이트 프레임", "UV 400 렌즈"], stock: 0, status: "품절", createdAt: "2026-05-19" },
  { id: "p019", name: "레더 벨트 30mm", category: "belts", subcategory: "벨트", price: 890000, art: "belt", styleNo: "766540 0YA0G 1000", colors: [black], description: "골드 톤 버클의 30mm 레더 벨트.", details: ["카프스킨 레더", "골드 톤 버클", "폭 3cm"], stock: 12, status: "판매중", createdAt: "2026-08-23" },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export type OrderStatus = "결제완료" | "상품준비중" | "배송중" | "배송완료" | "취소/반품";

export interface Order {
  no: string;
  date: string;
  customer: string;
  productId: string;
  qty: number;
  amount: number;
  payment: string;
  status: OrderStatus;
  channel: "온라인" | "매장 픽업";
}

export const orders: Order[] = [
  { no: "VL-20261126-0214", date: "2026.11.26 09:41", customer: "김민서", productId: "p001", qty: 1, amount: 4250000, payment: "신용카드", status: "결제완료", channel: "온라인" },
  { no: "VL-20261126-0209", date: "2026.11.26 08:12", customer: "박도윤", productId: "p013", qty: 1, amount: 1380000, payment: "간편결제", status: "결제완료", channel: "매장 픽업" },
  { no: "VL-20261125-0198", date: "2026.11.25 21:30", customer: "이하은", productId: "p016", qty: 1, amount: 2640000, payment: "신용카드", status: "상품준비중", channel: "온라인" },
  { no: "VL-20261125-0187", date: "2026.11.25 17:05", customer: "최서준", productId: "p014", qty: 2, amount: 1960000, payment: "신용카드", status: "상품준비중", channel: "온라인" },
  { no: "VL-20261124-0192", date: "2026.11.24 14:22", customer: "김민서", productId: "p001", qty: 1, amount: 4250000, payment: "신용카드", status: "배송중", channel: "온라인" },
  { no: "VL-20261124-0176", date: "2026.11.24 11:48", customer: "정지우", productId: "p006", qty: 1, amount: 4890000, payment: "무이자 할부", status: "배송중", channel: "온라인" },
  { no: "VL-20261123-0154", date: "2026.11.23 19:02", customer: "윤서아", productId: "p017", qty: 3, amount: 1920000, payment: "간편결제", status: "배송완료", channel: "온라인" },
  { no: "VL-20261122-0133", date: "2026.11.22 10:15", customer: "강예준", productId: "p019", qty: 1, amount: 890000, payment: "신용카드", status: "배송완료", channel: "매장 픽업" },
  { no: "VL-20261121-0120", date: "2026.11.21 16:40", customer: "한지민", productId: "p005", qty: 1, amount: 2150000, payment: "신용카드", status: "취소/반품", channel: "온라인" },
  { no: "VL-20261102-0871", date: "2026.11.02 13:09", customer: "김민서", productId: "p017", qty: 1, amount: 640000, payment: "간편결제", status: "배송완료", channel: "온라인" },
  { no: "VL-20261015-0433", date: "2026.10.15 18:27", customer: "김민서", productId: "p013", qty: 1, amount: 1380000, payment: "신용카드", status: "배송완료", channel: "온라인" },
];

export type Grade = "VIP" | "GOLD" | "MEMBER";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: Grade;
  joined: string;
  orders: number;
  totalSpent: number;
  lastVisit: string;
  marketing: boolean;
  advisor?: string;
}

export const members: Member[] = [
  { id: "M10231", name: "김민서", email: "minseo.k@example.com", phone: "010-****-2841", grade: "VIP", joined: "2021.03.14", orders: 27, totalSpent: 48250000, lastVisit: "2026.11.26", marketing: true, advisor: "이서윤" },
  { id: "M10877", name: "정지우", email: "jiwoo.j@example.com", phone: "010-****-5120", grade: "VIP", joined: "2022.07.02", orders: 19, totalSpent: 36890000, lastVisit: "2026.11.24", marketing: true, advisor: "이서윤" },
  { id: "M11402", name: "이하은", email: "haeun.lee@example.com", phone: "010-****-7733", grade: "GOLD", joined: "2023.01.19", orders: 11, totalSpent: 14720000, lastVisit: "2026.11.25", marketing: false, advisor: "박준호" },
  { id: "M11958", name: "박도윤", email: "doyun.p@example.com", phone: "010-****-0094", grade: "GOLD", joined: "2023.05.28", orders: 8, totalSpent: 9860000, lastVisit: "2026.11.26", marketing: true },
  { id: "M12340", name: "최서준", email: "seojun.c@example.com", phone: "010-****-6612", grade: "MEMBER", joined: "2024.02.11", orders: 4, totalSpent: 3920000, lastVisit: "2026.11.25", marketing: true },
  { id: "M12871", name: "윤서아", email: "seoa.yoon@example.com", phone: "010-****-3348", grade: "MEMBER", joined: "2024.09.03", orders: 3, totalSpent: 2560000, lastVisit: "2026.11.23", marketing: false },
  { id: "M13025", name: "강예준", email: "yejun.k@example.com", phone: "010-****-9015", grade: "MEMBER", joined: "2025.04.22", orders: 2, totalSpent: 1520000, lastVisit: "2026.11.22", marketing: true },
  { id: "M13390", name: "한지민", email: "jimin.han@example.com", phone: "010-****-4470", grade: "MEMBER", joined: "2025.11.30", orders: 1, totalSpent: 0, lastVisit: "2026.11.21", marketing: false },
  { id: "M13712", name: "오시우", email: "siwoo.oh@example.com", phone: "010-****-8259", grade: "MEMBER", joined: "2026.11.25", orders: 0, totalSpent: 0, lastVisit: "2026.11.25", marketing: true },
];

export const salesByDay = [
  { label: "11.20", value: 86 },
  { label: "11.21", value: 72 },
  { label: "11.22", value: 104 },
  { label: "11.23", value: 131 },
  { label: "11.24", value: 98 },
  { label: "11.25", value: 115 },
  { label: "11.26", value: 128 },
];

export const formatKRW = (n: number) => `₩ ${n.toLocaleString("ko-KR")}`;
