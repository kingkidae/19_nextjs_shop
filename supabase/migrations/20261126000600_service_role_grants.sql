-- 서버 전용 키(service_role) 권한: 이 프로젝트는 새 테이블에 자동 부여되지 않으므로 Supabase 기본 설정대로 명시
-- service_role 은 서버(SUPABASE_SECRET_KEY)에서만 쓰이며 RLS 를 우회함
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
