-- VELLANTI 쇼핑몰 스키마: 상품 · 회원(profiles) · 주문 + RLS

create sequence public.product_seq start 100;
create sequence public.member_seq start 13800;
create sequence public.order_seq start 1000;

create table public.products (
  id text primary key default 'p' || lpad(nextval('public.product_seq')::text, 3, '0'),
  name text not null check (length(trim(name)) > 0),
  category text not null check (category in ('women-bags','men-shoes','leather-goods','jewelry','scarves','eyewear','belts')),
  subcategory text not null default '',
  price integer not null check (price >= 0),
  art text not null check (art in ('bag','loafer','wallet','jewelry','scarf','sunglasses','belt')),
  tag text check (tag in ('NEW','온라인 단독','한정 수량')),
  style_no text not null default '',
  colors jsonb not null default '[]'::jsonb,
  description text not null default '',
  details text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  status text not null default '판매중' check (status in ('판매중','품절','숨김')),
  created_at date not null default (now() at time zone 'Asia/Seoul')::date
);

-- shortcut: auth.users FK 없음(데모 회원 시드용). 탈퇴 회원 정리가 필요해지면 FK + on delete cascade 로 전환
create table public.profiles (
  id uuid primary key,
  member_no text unique not null default 'M' || nextval('public.member_seq'),
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  grade text not null default 'MEMBER' check (grade in ('VIP','GOLD','MEMBER')),
  role text not null default 'member' check (role in ('member','admin')),
  marketing boolean not null default false,
  advisor text,
  created_at timestamptz not null default now(),
  last_visit timestamptz not null default now()
);

-- 주문 시점의 상품 정보를 함께 저장해 상품이 삭제되어도 주문 내역이 유지됩니다.
create table public.orders (
  no text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  customer text not null,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  product_art text not null,
  style_no text not null default '',
  color text not null default '',
  qty integer not null check (qty between 1 and 9),
  amount integer not null check (amount >= 0),
  payment text not null,
  status text not null default '결제완료' check (status in ('결제완료','상품준비중','배송중','배송완료','취소/반품')),
  channel text not null default '온라인' check (channel in ('온라인','매장 픽업')),
  created_at timestamptz not null default now()
);
create index orders_user_id_idx on public.orders(user_id);
create index orders_created_at_idx on public.orders(created_at desc);

-- 관리자 여부 (RLS 정책 안에서 profiles 를 재귀 조회하지 않도록 security definer)
create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false)
$$;

-- 회원가입 시 profiles 자동 생성
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, name, phone, marketing)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce((new.raw_user_meta_data->>'marketing')::boolean, false)
  );
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- 주문 생성: 가격·재고는 DB 에서 확정 (클라이언트가 보낸 금액은 신뢰하지 않음)
create function public.place_order(items jsonb, pay text) returns setof text
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  it jsonb;
  q integer;
  p public.products;
  who text;
  order_no text;
begin
  if uid is null then raise exception '로그인이 필요합니다'; end if;
  if pay not in ('신용카드', '간편결제') then raise exception '지원하지 않는 결제 수단입니다'; end if;
  if jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 then raise exception '주문할 상품이 없습니다'; end if;

  select coalesce(nullif(name, ''), email) into who from public.profiles where id = uid;

  for it in select * from jsonb_array_elements(items) loop
    q := (it->>'qty')::integer;
    if q is null or q < 1 or q > 9 then raise exception '수량이 올바르지 않습니다'; end if;

    select * into p from public.products where id = it->>'productId' and status = '판매중' for update;
    if not found then raise exception '판매 중이 아닌 상품이 포함되어 있습니다'; end if;
    if not exists (select 1 from jsonb_array_elements(p.colors) c where c->>'name' = it->>'color') then
      raise exception '선택할 수 없는 색상입니다: %', p.name;
    end if;
    if p.stock < q then raise exception '재고가 부족합니다: %', p.name; end if;

    update public.products
       set stock = stock - q,
           status = case when stock - q = 0 then '품절' else status end
     where id = p.id;

    order_no := 'VL-' || to_char(now() at time zone 'Asia/Seoul', 'YYYYMMDD') || '-' || lpad(nextval('public.order_seq')::text, 4, '0');
    insert into public.orders (no, user_id, customer, product_id, product_name, product_art, style_no, color, qty, amount, payment)
    values (order_no, uid, coalesce(who, '회원'), p.id, p.name, p.art, p.style_no, it->>'color', q, p.price * q, pay);
    return next order_no;
  end loop;
end $$;

revoke execute on function public.place_order(jsonb, text) from public, anon;
grant execute on function public.place_order(jsonb, text) to authenticated;

alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;

create policy "상품 조회" on public.products for select using (status <> '숨김' or public.is_admin());
create policy "상품 등록(관리자)" on public.products for insert with check (public.is_admin());
create policy "상품 수정(관리자)" on public.products for update using (public.is_admin()) with check (public.is_admin());
create policy "상품 삭제(관리자)" on public.products for delete using (public.is_admin());

create policy "회원 조회(본인/관리자)" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "회원 수정(관리자)" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

create policy "주문 조회(본인/관리자)" on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "주문 수정(관리자)" on public.orders for update using (public.is_admin()) with check (public.is_admin());
