-- =====================================================================
-- Viewer Mode — PIN-gated read-only access to the admin's expenses.
-- Run AFTER you've signed up the admin account in Supabase Auth.
-- Edit the two REPLACE_WITH_ placeholders below before running.
-- =====================================================================

create extension if not exists pgcrypto;

-- ------ admin_config (single-row, RLS-locked) ---------------------------
create table if not exists public.admin_config (
  id            int primary key default 1,
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  pin_hash      text not null,
  updated_at    timestamptz not null default now(),
  constraint admin_config_singleton check (id = 1)
);

alter table public.admin_config enable row level security;
-- No SELECT/INSERT/UPDATE/DELETE policies = only SECURITY DEFINER functions
-- (running as table owner) can read or modify this table. Clients cannot.

-- ------ Seed / update the admin row -------------------------------------
-- Replace BOTH placeholders, then run this whole file in the SQL Editor.
insert into public.admin_config (id, admin_user_id, pin_hash, updated_at)
select
  1,
  (select id from auth.users where email = 'REPLACE_WITH_ADMIN_EMAIL@example.com' limit 1),
  crypt('REPLACE_WITH_4_DIGIT_PIN', gen_salt('bf')),
  now()
on conflict (id) do update
  set admin_user_id = excluded.admin_user_id,
      pin_hash      = excluded.pin_hash,
      updated_at    = now();

-- Sanity check: if the email was wrong this will be null and the next
-- statement raises so you don't silently end up with a half-configured row.
do $$
begin
  if (select admin_user_id from public.admin_config where id = 1) is null then
    raise exception 'admin_user_id is null — fix the email above and re-run.';
  end if;
end $$;

-- ------ RPC: returns admin's expenses if PIN matches --------------------
create or replace function public.view_admin_expenses(p_pin text)
returns setof public.expenses
language plpgsql
security definer
set search_path = public, pg_temp
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

  if crypt(p_pin, cfg.pin_hash) <> cfg.pin_hash then
    raise exception 'invalid pin' using errcode = '28000';
  end if;

  return query
    select * from public.expenses
    where user_id = cfg.admin_user_id
    order by event, created_at;
end;
$$;

-- Only authenticated users can call it (PIN is still required).
revoke execute on function public.view_admin_expenses(text) from public, anon;
grant   execute on function public.view_admin_expenses(text) to authenticated;
