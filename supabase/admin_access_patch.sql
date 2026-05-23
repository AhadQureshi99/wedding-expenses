-- =====================================================================
-- PATCH for "function crypt(text, text) does not exist".
-- Run this in the Supabase SQL Editor on an existing setup. It only
-- replaces the RPC — your admin_config row + PIN are untouched.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

create or replace function public.view_admin_expenses(p_pin text)
returns setof public.expenses
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  cfg record;
begin
  if auth.uid() is null then
    raise exception 'must be authenticated';
  end if;

  select * into cfg from public.admin_config where id = 1;
  if cfg is null then
    raise exception 'admin not configured';
  end if;

  if extensions.crypt(p_pin, cfg.pin_hash) <> cfg.pin_hash then
    raise exception 'invalid pin' using errcode = '28000';
  end if;

  return query
    select * from public.expenses
    where user_id = cfg.admin_user_id
    order by event, created_at;
end;
$$;

revoke execute on function public.view_admin_expenses(text) from public, anon;
grant   execute on function public.view_admin_expenses(text) to authenticated;
