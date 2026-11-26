-- 관리자 / 일반 회원 구분
-- admin_emails 에 있는 이메일이 "인증된 상태"가 되면 관리자(role = 'admin'), 그 외 가입자는 일반 회원(role = 'member')

create table public.admin_emails (
  email text primary key check (email = lower(email))
);
-- 정책 없음 = Data API 로는 읽기·쓰기 불가 (DB 함수와 SQL 에서만 사용)
alter table public.admin_emails enable row level security;

insert into public.admin_emails (email) values ('kidae1113@gmail.com');

create function public.is_admin_email(addr text, confirmed_at timestamptz) returns boolean
language sql stable security definer set search_path = '' as $$
  -- 이메일 인증 전에는 관리자로 올리지 않음 (남이 같은 이메일로 먼저 가입하는 경우 방지)
  select confirmed_at is not null and exists (select 1 from public.admin_emails where email = lower(addr))
$$;

-- 가입 시: 회원 정보 생성 + 권한 결정 (Google 로그인은 가입 시점에 이미 인증됨)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, name, phone, marketing, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce((new.raw_user_meta_data->>'marketing')::boolean, false),
    case when public.is_admin_email(new.email, new.email_confirmed_at) then 'admin' else 'member' end
  );
  return new;
end $$;

-- 이메일 가입자는 메일 인증을 마치는 순간 관리자로 승격
create function public.handle_user_confirmed() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if public.is_admin_email(new.email, new.email_confirmed_at) then
    update public.profiles set role = 'admin' where id = new.id and role <> 'admin';
  end if;
  return new;
end $$;

create trigger on_auth_user_confirmed after update of email_confirmed_at, email on auth.users
for each row execute function public.handle_user_confirmed();

-- 이미 가입·인증된 계정이 있으면 바로 반영
update public.profiles p set role = 'admin'
  from auth.users u
 where u.id = p.id and public.is_admin_email(u.email, u.email_confirmed_at) and p.role <> 'admin';

revoke execute on function public.is_admin_email(text, timestamptz) from public, anon, authenticated;
