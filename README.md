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

## 문의하기 메일 (nodemailer)

`/contact` 에서 받은 문의(이름·전화번호·이메일·주소·내용)를 관리자 메일로 보냅니다. `.env` 에 추가:

```
SMTP_USER=보내는 Gmail 주소
SMTP_PASS=Gmail 앱 비밀번호 16자리   # Google 계정 → 보안 → 2단계 인증 → 앱 비밀번호
CONTACT_TO=문의를 받을 관리자 이메일   # 생략하면 SMTP_USER 로 받음
# SMTP_HOST=smtp.gmail.com  SMTP_PORT=465  (기본값, 다른 메일 서비스일 때만 변경)
```

## 결제 (토스페이먼츠 결제위젯, 테스트)

쇼핑백 "주문하기" → `/checkout`(결제위젯) → 토스 인증 → `/checkout/success`(서버 승인) → `/checkout/complete`.
금액은 DB 함수 `create_checkout` 이 계산하고, 승인 후 `complete_checkout`(서버 키 전용)이 재고 차감·주문 생성을 합니다.
주문 확정이 실패하면(예: 재고 소진) 결제를 자동 취소합니다. `.env`:

```
TOSS_PAYMENTS_CLIENT_KEY=test_gck_...     # 결제위젯 클라이언트 키 (브라우저 노출 가능)
TOSS_PAYMENTS_SECRET=test_gsk_...         # 결제위젯 시크릿 키 (서버 전용)
SUPABASE_SECRET_KEY=sb_secret_...         # Supabase → Project Settings → API Keys → Secret key (서버 전용)
```

## DB (supabase/migrations)

| 파일 | 내용 |
| --- | --- |
| `..._init.sql` | products · profiles · orders 테이블, RLS, 가입 트리거, 주문 함수 `place_order` |
| `..._seed.sql` | 데모 상품 19 · 회원 9 · 주문 11 |
| `..._grants.sql` | Data API 역할 권한 |

스키마 변경은 새 마이그레이션 파일을 만든 뒤 `supabase db push --linked` 로 반영합니다.

## 관리자 계정

권한은 **관리자 / 일반 회원** 두 가지이고, 로그인하지 않은 사람은 방문자입니다.

- `public.admin_emails` 에 등록된 이메일로 가입(또는 Google 로그인)하고 이메일 인증까지 마치면 자동으로 관리자가 됩니다.
- 그 외 가입자는 일반 회원입니다. 관리자는 `/admin/members` 에서 다른 회원을 관리자로 지정하거나 해제할 수 있습니다(본인 권한은 변경 불가).
- 관리자 이메일 추가는 새 마이그레이션으로: `insert into public.admin_emails (email) values ('소문자 이메일');`

## 구조

```
app/(shop)     회원용: 홈, 상품 목록/상세, 쇼핑백(주문 생성), 로그인/가입, 마이페이지
app/admin      관리자: 대시보드, 상품 관리/등록·수정, 주문 상태 변경, 회원 등급 변경
lib/queries.ts 공개 상품 카탈로그 ("use cache" + updateTag("products"))
lib/actions.ts 서버 액션 (입력 검증, 권한은 RLS)
proxy.ts       Supabase 세션 갱신
```

쇼핑백·위시리스트는 시안과 동일하게 브라우저 localStorage 에 저장되며, 결제(PG) 연동 없이 주문만 생성됩니다.
