-- 고객 문의 게시판: 누구나 등록, 조회·상담 완료 처리는 관리자만

create table public.inquiries (
  id bigint generated always as identity primary key,
  user_id uuid default auth.uid(),
  name text not null check (length(trim(name)) between 1 and 50),
  phone text not null check (length(phone) between 9 and 20),
  email text not null check (length(email) between 3 and 254 and email like '%_@_%._%'),
  address text not null check (length(trim(address)) between 1 and 200),
  message text not null check (length(message) between 10 and 2000),
  done boolean not null default false,
  done_at timestamptz,
  created_at timestamptz not null default now()
);
create index inquiries_created_at_idx on public.inquiries(created_at desc);

alter table public.inquiries enable row level security;

-- 등록 시 완료 상태·작성자를 조작할 수 없도록 고정
create policy "문의 등록" on public.inquiries for insert
  with check (done = false and done_at is null and user_id is not distinct from auth.uid());
create policy "문의 조회(관리자)" on public.inquiries for select using (public.is_admin());
create policy "문의 처리(관리자)" on public.inquiries for update using (public.is_admin()) with check (public.is_admin());

grant insert (name, phone, email, address, message) on public.inquiries to anon, authenticated;
grant select, update (done, done_at) on public.inquiries to authenticated;
