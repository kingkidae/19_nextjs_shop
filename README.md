# VELLANTI — 럭셔리 커머스 (Next.js 16 + Tailwind CSS v4 + Supabase)

`vellanti/` 시안을 그대로 옮기고 데이터를 Supabase(DB · Auth)에 연결한 쇼핑몰입니다.
회원용 페이지, 관리자 페이지, 모바일 레이아웃(`lg` 미만: 하단 탭바·드로어)을 포함합니다.

## 실행

1. `.env` 에 Supabase 값 입력 (Dashboard → Project Settings → API Keys)
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://voizmxhhkzuxzccayvwj.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
2. `npm install && npm run dev` → http://localhost:3000

## DB (supabase/migrations)

| 파일 | 내용 |
| --- | --- |
| `..._init.sql` | products · profiles · orders 테이블, RLS, 가입 트리거, 주문 함수 `place_order` |
| `..._seed.sql` | 데모 상품 19 · 회원 9 · 주문 11 |
| `..._grants.sql` | Data API 역할 권한 |

스키마 변경은 새 마이그레이션 파일을 만든 뒤 `supabase db push --linked` 로 반영합니다.

## 관리자 계정

`/login` 에서 회원가입한 뒤 Supabase SQL Editor 에서 한 번 실행합니다.

```sql
update public.profiles set role = 'admin' where email = '가입한 이메일';
```

## 구조

```
app/(shop)     회원용: 홈, 상품 목록/상세, 쇼핑백(주문 생성), 로그인/가입, 마이페이지
app/admin      관리자: 대시보드, 상품 관리/등록·수정, 주문 상태 변경, 회원 등급 변경
lib/queries.ts 공개 상품 카탈로그 ("use cache" + updateTag("products"))
lib/actions.ts 서버 액션 (입력 검증, 권한은 RLS)
proxy.ts       Supabase 세션 갱신
```

쇼핑백·위시리스트는 시안과 동일하게 브라우저 localStorage 에 저장되며, 결제(PG) 연동 없이 주문만 생성됩니다.
