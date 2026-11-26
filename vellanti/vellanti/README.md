# VELLANTI — 럭셔리 커머스 데모 (Next.js + Tailwind CSS)

구찌 공식 사이트의 디자인 문법(모노톤, 각진 UI, 대문자 볼드 CTA, 풀블리드 히어로)을 분석해
가상 브랜드 **VELLANTI**로 재구성한 회원용 쇼핑몰 + 관리자 페이지입니다.
Figma 파일 "00 Foundations"의 색상 변수·텍스트 스타일을 `src/app/globals.css`의 `@theme` 토큰으로 옮겼습니다.

## 실행

```bash
npm install
npm run dev
# http://localhost:3000
```

Node.js 18.18 이상이 필요합니다.

## 화면 구성

| 구분 | 경로 | 내용 |
| --- | --- | --- |
| 회원 | `/` | 홈: 히어로, 카테고리, 온라인 서비스, 신상품 |
| 회원 | `/products` | 상품 목록: 카테고리·하위 카테고리·정렬, 더 보기 |
| 회원 | `/products/[id]` | 상품 상세: 갤러리, 색상 선택, 쇼핑백 담기, 아코디언 |
| 회원 | `/cart` | 쇼핑백: 수량 변경, 삭제, 주문 요약 |
| 회원 | `/login` | 로그인 · 회원가입 (모바일은 탭 전환) |
| 회원 | `/mypage` | 마이페이지: 주문, 예약, 위시리스트 |
| 관리자 | `/admin` | 대시보드: 매출 차트, 주문 현황, 베스트셀러, 재고 알림 |
| 관리자 | `/admin/products` | 상품 관리: 상태 탭, 검색, 카테고리 필터, 일괄 선택 |
| 관리자 | `/admin/products/new` | 상품 등록: 이미지, 가격·재고, 옵션, 미리보기 |
| 관리자 | `/admin/orders` | 주문 관리: 상태별 필터, 주문 상세·진행 단계 |
| 관리자 | `/admin/members` | 회원 관리: 등급 필터, 회원 상세 패널 |

모든 화면은 반응형입니다. `lg`(1024px) 미만에서는 모바일 레이아웃(하단 탭바, 2열 상품 그리드, 관리자 드로어 메뉴)으로 바뀝니다.

## 이미지 넣기

히어로와 서비스 영역은 아래 파일이 있으면 사진으로, 없으면 그라데이션 배경으로 표시됩니다.
Figma 파일의 "Image Assets (AI 생성)" 프레임에서 이미지를 PNG로 내보내 이름을 맞춰 넣어 주세요.

```
public/images/hero.png      # 홈 히어로 (가로형)
public/images/boutique.png  # 방문 예약하기
public/images/craft.png     # 이니셜 서비스
public/images/gift.png      # 기프트 가이드
```

## 구조

```
src/
  app/
    (shop)/          회원용 페이지 + 공통 레이아웃(푸터, 모바일 탭바, 쇼핑백 상태)
    admin/           관리자 페이지 + 사이드바 레이아웃
    globals.css      Tailwind v4 테마 토큰
  components/
    ui/              Icon, Button, Badge, Field, ProductArt
    shop/            Header, Footer, ProductCard, CartProvider 등
    admin/           AdminShell, ProductTable, OrderTable, MemberTable, ProductForm
  lib/data.ts        데모용 상품·주문·회원 데이터
```

데이터는 모두 가상이며 서버/DB 연동은 없습니다. 쇼핑백과 위시리스트는 브라우저 localStorage에 저장됩니다.
