-- 토스페이먼츠 결제: 주문서(checkouts) → 결제 승인 → 주문(orders) 생성
-- 1) create_checkout  : 로그인 회원이 호출. 상품·재고 확인 후 금액을 DB 에서 계산해 주문서 생성 (재고 차감 없음)
-- 2) 토스 결제 승인    : 서버(Next.js)가 시크릿 키로 승인 API 호출
-- 3) complete_checkout: 서버 전용 키(service_role)로만 호출. 재고 차감 + 주문 생성

create table public.checkouts (
  id text primary key check (id ~ '^[A-Za-z0-9_=-]{6,64}$'),
  user_id uuid not null,
  items jsonb not null,
  amount integer not null check (amount > 0),
  order_name text not null,
  status text not null default 'pending' check (status in ('pending', 'paid')),
  payment_key text,
  method text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index checkouts_user_id_idx on public.checkouts(user_id);

alter table public.checkouts enable row level security;
create policy "주문서 조회(본인/관리자)" on public.checkouts for select using (user_id = auth.uid() or public.is_admin());
grant select on public.checkouts to authenticated;

alter table public.orders add column checkout_id text references public.checkouts(id);
create index orders_checkout_id_idx on public.orders(checkout_id);

-- 결제 없이 '결제완료' 주문을 만들던 기존 함수 제거
drop function public.place_order(jsonb, text);

create function public.create_checkout(items jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid();
  it jsonb;
  q integer;
  p public.products;
  total integer := 0;
  first_name text;
  n integer := 0;
  clean jsonb := '[]'::jsonb;
  cid text;
  oname text;
begin
  if uid is null then raise exception '로그인이 필요합니다'; end if;
  if jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 then raise exception '주문할 상품이 없습니다'; end if;
  if jsonb_array_length(items) > 20 then raise exception '한 번에 주문할 수 있는 상품 수를 넘었습니다'; end if;

  for it in select * from jsonb_array_elements(items) loop
    q := (it->>'qty')::integer;
    if q is null or q < 1 or q > 9 then raise exception '수량이 올바르지 않습니다'; end if;
    select * into p from public.products where id = it->>'productId' and status = '판매중';
    if not found then raise exception '판매 중이 아닌 상품이 포함되어 있습니다'; end if;
    if not exists (select 1 from jsonb_array_elements(p.colors) c where c->>'name' = it->>'color') then
      raise exception '선택할 수 없는 색상입니다: %', p.name;
    end if;
    if p.stock < q then raise exception '재고가 부족합니다: %', p.name; end if;
    total := total + p.price * q;
    n := n + 1;
    first_name := coalesce(first_name, p.name);
    clean := clean || jsonb_build_object('productId', p.id, 'color', it->>'color', 'qty', q);
  end loop;

  oname := case when n > 1 then first_name || ' 외 ' || (n - 1) || '건' else first_name end;
  cid := 'VL' || to_char(now() at time zone 'Asia/Seoul', 'YYYYMMDDHH24MISS') || '-' || substr(md5(random()::text || clock_timestamp()::text), 1, 12);
  insert into public.checkouts (id, user_id, items, amount, order_name) values (cid, uid, clean, total, left(oname, 100));
  return jsonb_build_object('id', cid, 'amount', total, 'orderName', left(oname, 100));
end $$;

revoke execute on function public.create_checkout(jsonb) from public, anon;
grant execute on function public.create_checkout(jsonb) to authenticated;

create function public.complete_checkout(p_id text, p_payment_key text, p_method text) returns setof text
language plpgsql security definer set search_path = '' as $$
declare
  c public.checkouts;
  it jsonb;
  q integer;
  p public.products;
  who text;
  order_no text;
begin
  select * into c from public.checkouts where id = p_id for update;
  if not found then raise exception '주문서를 찾을 수 없습니다'; end if;
  -- 같은 결제로 두 번 호출돼도 주문이 중복 생성되지 않음
  if c.status = 'paid' then
    return query select o.no from public.orders o where o.checkout_id = c.id order by o.no;
    return;
  end if;

  select coalesce(nullif(name, ''), email) into who from public.profiles where id = c.user_id;

  for it in select * from jsonb_array_elements(c.items) loop
    q := (it->>'qty')::integer;
    select * into p from public.products where id = it->>'productId' for update;
    if not found or p.status <> '판매중' then raise exception '판매가 종료된 상품이 포함되어 있습니다'; end if;
    if p.stock < q then raise exception '재고가 부족합니다: %', p.name; end if;

    update public.products
       set stock = stock - q,
           status = case when stock - q = 0 then '품절' else status end
     where id = p.id;

    order_no := 'VL-' || to_char(now() at time zone 'Asia/Seoul', 'YYYYMMDD') || '-' || lpad(nextval('public.order_seq')::text, 4, '0');
    insert into public.orders (no, user_id, customer, product_id, product_name, product_art, style_no, color, qty, amount, payment, checkout_id)
    values (order_no, c.user_id, coalesce(who, '회원'), p.id, p.name, p.art, p.style_no, it->>'color', q, p.price * q, coalesce(p_method, '토스페이먼츠'), c.id);
    return next order_no;
  end loop;

  update public.checkouts set status = 'paid', payment_key = p_payment_key, method = p_method, paid_at = now() where id = c.id;
end $$;

revoke execute on function public.complete_checkout(text, text, text) from public, anon, authenticated;
grant execute on function public.complete_checkout(text, text, text) to service_role;
