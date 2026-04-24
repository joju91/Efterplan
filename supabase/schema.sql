-- Efterplan — Supabase schema (T051/T052/T053)
-- Run top-to-bottom in the Supabase SQL editor.
-- Safe to re-run: every statement uses IF NOT EXISTS / CREATE OR REPLACE where possible.

create extension if not exists pgcrypto;

-- ───────────────────────────────────────────────
-- Tables
-- ───────────────────────────────────────────────

create table if not exists public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  state_json text not null default '{}',
  updated_at timestamptz not null default now()
);

create unique index if not exists plans_user_id_key on public.plans(user_id);

create table if not exists public.task_completions (
  id           uuid primary key default gen_random_uuid(),
  plan_id      uuid not null references public.plans(id) on delete cascade,
  task_id      text not null,
  completed_at timestamptz not null default now()
);

create unique index if not exists task_completions_plan_task_key
  on public.task_completions(plan_id, task_id);

create table if not exists public.share_tokens (
  id         uuid primary key default gen_random_uuid(),
  plan_id    uuid not null references public.plans(id) on delete cascade,
  token      text unique not null default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now(),
  active     boolean not null default true
);

create index if not exists share_tokens_plan_id_idx on public.share_tokens(plan_id);

-- ───────────────────────────────────────────────
-- Triggers
-- ───────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.bump_plan_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists plans_bump_updated_at on public.plans;
create trigger plans_bump_updated_at
  before update on public.plans
  for each row execute function public.bump_plan_updated_at();

-- ───────────────────────────────────────────────
-- Row Level Security
-- ───────────────────────────────────────────────

alter table public.users            enable row level security;
alter table public.plans            enable row level security;
alter table public.task_completions enable row level security;
alter table public.share_tokens     enable row level security;

-- users: select/update own row only
drop policy if exists users_select_own on public.users;
create policy users_select_own on public.users
  for select to authenticated
  using (id = auth.uid());

drop policy if exists users_update_own on public.users;
create policy users_update_own on public.users
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- plans: select/insert/update own row only
drop policy if exists plans_select_own on public.plans;
create policy plans_select_own on public.plans
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists plans_insert_own on public.plans;
create policy plans_insert_own on public.plans
  for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists plans_update_own on public.plans;
create policy plans_update_own on public.plans
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- task_completions: select/insert/delete own rows only
drop policy if exists task_completions_select_own on public.task_completions;
create policy task_completions_select_own on public.task_completions
  for select to authenticated
  using (exists (
    select 1 from public.plans p
    where p.id = task_completions.plan_id
      and p.user_id = auth.uid()
  ));

drop policy if exists task_completions_insert_own on public.task_completions;
create policy task_completions_insert_own on public.task_completions
  for insert to authenticated
  with check (exists (
    select 1 from public.plans p
    where p.id = task_completions.plan_id
      and p.user_id = auth.uid()
  ));

drop policy if exists task_completions_delete_own on public.task_completions;
create policy task_completions_delete_own on public.task_completions
  for delete to authenticated
  using (exists (
    select 1 from public.plans p
    where p.id = task_completions.plan_id
      and p.user_id = auth.uid()
  ));

-- share_tokens: owner full control; anon can SELECT active tokens only
drop policy if exists share_tokens_select_own on public.share_tokens;
create policy share_tokens_select_own on public.share_tokens
  for select to authenticated
  using (exists (
    select 1 from public.plans p
    where p.id = share_tokens.plan_id
      and p.user_id = auth.uid()
  ));

drop policy if exists share_tokens_select_active_anon on public.share_tokens;
create policy share_tokens_select_active_anon on public.share_tokens
  for select to anon
  using (active = true);

drop policy if exists share_tokens_insert_own on public.share_tokens;
create policy share_tokens_insert_own on public.share_tokens
  for insert to authenticated
  with check (exists (
    select 1 from public.plans p
    where p.id = share_tokens.plan_id
      and p.user_id = auth.uid()
  ));

drop policy if exists share_tokens_update_own on public.share_tokens;
create policy share_tokens_update_own on public.share_tokens
  for update to authenticated
  using (exists (
    select 1 from public.plans p
    where p.id = share_tokens.plan_id
      and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.plans p
    where p.id = share_tokens.plan_id
      and p.user_id = auth.uid()
  ));

drop policy if exists share_tokens_delete_own on public.share_tokens;
create policy share_tokens_delete_own on public.share_tokens
  for delete to authenticated
  using (exists (
    select 1 from public.plans p
    where p.id = share_tokens.plan_id
      and p.user_id = auth.uid()
  ));

-- ───────────────────────────────────────────────
-- Anonymous shared-plan read (bypasses RLS on plans)
-- Returns the plan's state_json only when the token is active.
-- ───────────────────────────────────────────────

create or replace function public.get_shared_plan(token_in text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select p.state_json::jsonb
  from public.share_tokens st
  join public.plans p on p.id = st.plan_id
  where st.token = token_in
    and st.active = true
  limit 1;
$$;

grant execute on function public.get_shared_plan(text) to anon, authenticated;
