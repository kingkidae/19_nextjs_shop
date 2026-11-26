-- Data API 역할 권한 (행 단위 접근은 RLS 정책이 제한)
grant usage on schema public to anon, authenticated;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant usage on sequence public.product_seq to authenticated;

grant select, update on public.profiles to authenticated;
grant select, update on public.orders to authenticated;
