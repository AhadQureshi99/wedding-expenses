-- =====================================================================
-- Wedding Expenses — Supabase schema
-- Run this once in the Supabase SQL Editor.
-- =====================================================================

-- Enums --------------------------------------------------------------
do $$ begin
  create type share_type as enum ('shared_50', 'non_shared');
exception when duplicate_object then null; end $$;

do $$ begin
  create type expense_status as enum ('confirmed', 'tbc', 'pending');
exception when duplicate_object then null; end $$;

-- Table --------------------------------------------------------------
create table if not exists public.expenses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  event           text not null,
  category        text not null,
  supplier        text not null,
  total_actual    numeric(12,2),
  share_type      share_type not null default 'shared_50',
  my_share        numeric(12,2),
  paid_amount     numeric(12,2) not null default 0,
  is_fully_paid   boolean not null default false,
  status          expense_status not null default 'confirmed',
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists expenses_user_id_idx  on public.expenses(user_id);
create index if not exists expenses_event_idx    on public.expenses(event);
create index if not exists expenses_category_idx on public.expenses(category);

-- updated_at trigger -------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at
  before update on public.expenses
  for each row execute function public.set_updated_at();

-- Row-Level Security -------------------------------------------------
alter table public.expenses enable row level security;

drop policy if exists "expenses_select_own" on public.expenses;
create policy "expenses_select_own"
  on public.expenses for select
  using (auth.uid() = user_id);

drop policy if exists "expenses_insert_own" on public.expenses;
create policy "expenses_insert_own"
  on public.expenses for insert
  with check (auth.uid() = user_id);

drop policy if exists "expenses_update_own" on public.expenses;
create policy "expenses_update_own"
  on public.expenses for update
  using (auth.uid() = user_id);

drop policy if exists "expenses_delete_own" on public.expenses;
create policy "expenses_delete_own"
  on public.expenses for delete
  using (auth.uid() = user_id);
