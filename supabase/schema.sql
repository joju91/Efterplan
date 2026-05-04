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
  active     boolean not null default true,
  kind       text not null default 'read' check (kind in ('read','edit'))
);

-- Backfill for pre-existing rows if kind was added later.
alter table public.share_tokens
  add column if not exists kind text not null default 'read'
  check (kind in ('read','edit'));

create index if not exists share_tokens_plan_id_idx on public.share_tokens(plan_id);

-- Purchases (Stripe checkout completions). Source of truth for premium access.
create table if not exists public.purchases (
  id                    uuid primary key default gen_random_uuid(),
  stripe_session_id     text unique not null,
  stripe_customer_id    text,
  stripe_payment_intent text,
  email                 text,
  user_id               text,
  amount_total          integer,
  currency              text,
  livemode              boolean,
  raw                   jsonb,
  created_at            timestamptz not null default now()
);

create index if not exists purchases_email_idx on public.purchases(lower(email));
create index if not exists purchases_user_id_idx on public.purchases(user_id);

-- One active token per (plan, kind). Inactive tokens may linger for history.
create unique index if not exists share_tokens_plan_kind_active_key
  on public.share_tokens(plan_id, kind) where active = true;

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
alter table public.purchases        enable row level security;
-- No anon/authenticated policies on purchases — only the service role
-- (used by /api/* serverless functions) reads/writes this table.

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
-- Returns the plan's state_json and the token kind when active.
-- ───────────────────────────────────────────────

create or replace function public.get_shared_plan(token_in text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'state_json', p.state_json::jsonb,
    'kind',       st.kind,
    'plan_id',    p.id
  )
  from public.share_tokens st
  join public.plans p on p.id = st.plan_id
  where st.token = token_in
    and st.active = true
  limit 1;
$$;

grant execute on function public.get_shared_plan(text) to anon, authenticated;

-- ───────────────────────────────────────────────
-- Anonymous task-toggle for edit-kind tokens.
-- Only touches the `efterplan_tasks` key of plans.state_json
-- and the matching row in task_completions. No other fields change.
-- ───────────────────────────────────────────────

create or replace function public.toggle_shared_task(
  token_in text,
  task_id_in text,
  done_in boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan_id uuid;
  v_state   jsonb;
  v_tasks   jsonb;
  v_entry   jsonb;
begin
  -- Resolve an active edit token to its plan.
  select st.plan_id into v_plan_id
  from public.share_tokens st
  where st.token = token_in
    and st.active = true
    and st.kind   = 'edit'
  limit 1;

  if v_plan_id is null then
    raise exception 'invalid_or_readonly_token';
  end if;

  if task_id_in is null or length(task_id_in) = 0 or length(task_id_in) > 128 then
    raise exception 'invalid_task_id';
  end if;

  select p.state_json::jsonb into v_state
  from public.plans p
  where p.id = v_plan_id
  for update;

  -- efterplan_tasks is stored as a JSON string inside the outer state_json.
  v_tasks := coalesce((v_state->>'efterplan_tasks')::jsonb, '{}'::jsonb);
  v_entry := coalesce(v_tasks->task_id_in, '{}'::jsonb);

  if jsonb_typeof(v_entry) <> 'object' then
    v_entry := '{}'::jsonb;
  end if;

  v_entry := v_entry || jsonb_build_object('done', done_in);
  if done_in then
    v_entry := v_entry || jsonb_build_object('started', true);
  end if;

  v_tasks := v_tasks || jsonb_build_object(task_id_in, v_entry);
  v_state := v_state || jsonb_build_object('efterplan_tasks', v_tasks::text);

  update public.plans
     set state_json = v_state::text
   where id = v_plan_id;

  if done_in then
    insert into public.task_completions (plan_id, task_id)
    values (v_plan_id, task_id_in)
    on conflict (plan_id, task_id) do nothing;
  else
    delete from public.task_completions
     where plan_id = v_plan_id
       and task_id = task_id_in;
  end if;

  return jsonb_build_object('ok', true, 'task_id', task_id_in, 'done', done_in);
end;
$$;

grant execute on function public.toggle_shared_task(text, text, boolean)
  to anon, authenticated;
