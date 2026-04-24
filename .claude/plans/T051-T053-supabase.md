# Plan: T051 (Supabase DB+auth) · T052 (Sharing) · T053 (Account)

## Pre-flight findings (verified against repo, nothing assumed)

- `supabase-client.js` and `supabase/` do **not** exist yet — everything built from scratch.
- `app.js:2015` defines `getShareableState()` (already privacy-safe: excludes `personnr`).
- `app.js:2072` `saveState()` writes `efterplan_state` to localStorage. **No `efterplan:state-changed` event is currently dispatched anywhere** — I will add one line inside `saveState()` to dispatch it.
- localStorage keys in use: `efterplan_state`, `efterplan_tasks`, `efterplan_notes`, `efterplan_bills`, `efterplan_notify_list`, `efterplan_sender_*`.
- `index.html` has two navs: landing (`.nav`, line 136) and plan (`.nav-plan`, line 434). Auth + share triggers will live in `.nav-plan-actions` (line 439) — shown only once the user is in their plan.
- `index.html:886` already loads `app.js?v=16` with `defer`. `supabase-client.js` will load immediately before it (also `defer`) so the client is ready by the time app.js runs.
- Service worker is registered (`sw.js`). Not touching it.

## Architecture decisions

1. **Source of truth for sharing:** `plans.state_json` holds one combined JSON snapshot (onboarding answers + tasks map + notes + bills + notify_list). Simple, one row per user, easy to share read-only.
2. **`task_completions`** is a thin side table for per-task timestamps. Toggling a task inserts/deletes a row. Not required for basic sharing view; kept because ticket asked for it.
3. **Anonymous shared-plan reads** cannot rely on RLS alone (anon shouldn't see `plans` directly). I'll ship a `SECURITY DEFINER` SQL function `get_shared_plan(token)` that returns the plan JSON iff the token is `active=true`. Client calls it via `supabase.rpc('get_shared_plan', { token_in: … })`.
4. **Row in `public.users`** is created automatically by a trigger on `auth.users` (`handle_new_user()`) — standard Supabase pattern so the app never has to `INSERT` into users manually.
5. **Tokens** use `encode(gen_random_bytes(16), 'hex')` (128-bit) as column `DEFAULT`. Requires `pgcrypto` extension (enabled in the schema file).
6. **Magic-link-only auth.** No password UI. Owner disables password auth in Supabase dashboard per ticket.
7. **Snippets live both as standalone files AND inlined in `index.html`.** The files (`auth-modal.html`, `share-modal.html`) are the canonical source; I'll paste their contents into index.html so no runtime fetch is needed. If the owner edits a snippet, they re-paste.
8. **Conflict policy on `loadPlan()`:** compare a `updated_at` timestamp on the remote row vs. a `localStorage.getItem('efterplan_updated_at')` timestamp set on every local save. Remote wins only if strictly newer. Keeps it simple, no merge logic.

## Files to create

### 1. `supabase/schema.sql`
- `create extension if not exists pgcrypto;`
- `public.users (id uuid pk references auth.users(id) on delete cascade, email text, created_at timestamptz default now())`
- `public.plans (id uuid pk default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade, state_json text not null default '{}', updated_at timestamptz default now())` + `unique(user_id)`
- `public.task_completions (id uuid pk default gen_random_uuid(), plan_id uuid not null references public.plans(id) on delete cascade, task_id text not null, completed_at timestamptz default now())` + `unique(plan_id, task_id)`
- `public.share_tokens (id uuid pk default gen_random_uuid(), plan_id uuid not null references public.plans(id) on delete cascade, token text unique not null default encode(gen_random_bytes(16), 'hex'), created_at timestamptz default now(), active boolean default true)`
- `enable row level security` on all four tables
- Policies:
  - `users`: `SELECT`/`UPDATE` where `id = auth.uid()`
  - `plans`: `SELECT`/`INSERT`/`UPDATE` where `user_id = auth.uid()`
  - `task_completions`: `SELECT`/`INSERT`/`DELETE` where the row's `plan_id` belongs to a plan where `user_id = auth.uid()`
  - `share_tokens`: owner (`auth.uid()` owns the `plan_id`) can `INSERT`/`UPDATE`/`DELETE`/`SELECT`; `anon` gets `SELECT` where `active = true`
- Trigger `handle_new_user()` on `auth.users AFTER INSERT` → inserts `public.users` row
- Trigger `bump_plan_updated_at()` on `plans BEFORE UPDATE` → `updated_at = now()`
- Function `get_shared_plan(token_in text) RETURNS jsonb LANGUAGE sql SECURITY DEFINER` → returns `state_json::jsonb` joined through active token, or `NULL`. Grant EXECUTE to `anon, authenticated`.

### 2. `supabase-client.js` (repo root)
Top of file:
```js
const SUPABASE_CONFIG = { url: "", anonKey: "" };
```
Loads `@supabase/supabase-js@2` UMD bundle from `cdn.jsdelivr.net` via a dynamically-inserted `<script>` tag; init is a Promise so call sites can `await` it. No-ops silently if `SUPABASE_CONFIG.url` is empty (so the static site still works offline for non-logged-in users).

Exports on `window.efterplanAuth`:
- `initSupabase()` — idempotent, resolves once the CDN bundle is loaded and client created.
- `signInWithMagicLink(email)` — `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + '/' } })`.
- `signOut()` — `auth.signOut()`, then dispatch `efterplan:auth-changed`.
- `getCurrentUser()` — reads cached session; falls back to `auth.getUser()`.
- `savePlan(stateJson)` — upserts `plans` row `{ user_id, state_json }` on conflict `user_id`. Also calls `syncTaskCompletions(planId, tasksMap)` to mirror task toggles into `task_completions` (diff: insert new completions, delete removed).
- `loadPlan()` — selects plan by `user_id`; returns `{ state_json, updated_at }` or null.
- `createShareToken(planId)` — insert `{ plan_id: planId }` (token auto-generated by DB default); returns `.token`.
- `revokeShareToken(token)` — update `active=false where token=…`.
- `getSharedPlan(token)` — `supabase.rpc('get_shared_plan', { token_in: token })`.
- `syncToSupabase()` — debounced 2000 ms. Bound to `window.addEventListener('efterplan:state-changed', …)`. Reads `localStorage.efterplan_state/_tasks/_notes/_bills/_notify_list`, packs into one object, calls `savePlan()`, stamps `localStorage.efterplan_updated_at`.
- Auth state listener (`auth.onAuthStateChange`):
  - `SIGNED_IN`: `loadPlan()`; if `remote.updated_at > localStorage.efterplan_updated_at` (or the local stamp is missing), hydrate localStorage from `remote.state_json` and dispatch a `efterplan:remote-hydrated` event so `app.js` can re-render on next init. For already-loaded pages, trigger `location.reload()` **only** if hydration actually changed data — otherwise just update the UI via `efterplan:auth-changed`.
  - `SIGNED_OUT`: dispatch `efterplan:auth-changed`; **do not** touch localStorage (keep offline data intact, per ticket).
- Auto-detects `?share=TOKEN` in URL on load → calls `getSharedPlan`, hydrates a read-only snapshot into `window.__efterplanSharedState` so `app.js`/share UI can render a locked view. (Minimal wiring only — full read-only mode in app.js is out of scope for this ticket.)

### 3. `auth-modal.html` (snippet file + inlined into index.html)
Self-contained `<div id="auth-modal" class="modal hidden" …>` with:
- Logged-out view: email `<input type="email">`, submit button **"Skicka inloggningslänk"**, status line for "länk skickad" / errors.
- Logged-in view: user email, **"Mitt konto"** heading, progress summary `<span id="auth-progress">X av Y steg klara</span>`, last-sync timestamp `<span id="auth-last-sync">`, manual **"Synka nu"** button, **"Logga ut"** button.
- Small JS block at end of snippet wires button handlers to `window.efterplanAuth.*` and listens for `efterplan:auth-changed` to switch between views.
- Hidden by default (`.hidden`). Opens via a nav button (`id="open-auth"` → "Mitt konto" in plan nav).

### 4. `share-modal.html` (snippet file + inlined into index.html)
Self-contained `<div id="share-modal" class="modal hidden" …>` with:
- **"Dela min plan"** trigger is a nav button (`id="open-share"` in plan nav).
- Modal body: current state shows either
  - no active token → **"Skapa delningslänk"** button → calls `createShareToken`, displays `https://efterplan.se/?share=TOKEN` (readonly input + **"Kopiera"** button), plus **"Sluta dela"** (revoke) button.
  - active token exists → show the URL and the revoke button.
- Read-only banner block `<div id="shared-banner" class="hidden">Du ser en delad plan (skrivskyddad).</div>` inlined near top of `<body>` — shown when `window.__efterplanSharedState` is set.

## Edits to existing files

### `app.js`
- **One-line change** in `saveState()` (currently `app.js:2072`): after the `localStorage.setItem` call, add
  ```js
  window.dispatchEvent(new Event('efterplan:state-changed'));
  ```
  That's the only app.js edit — nothing else rewritten or refactored.

### `index.html`
- **After line 123** (inside `<head>`), no edits needed.
- **Before line 886** (before `<script src="app.js…">`), add:
  ```html
  <script src="supabase-client.js?v=1" defer></script>
  ```
- **Inside `.nav-plan-actions` (line 439–442)**, add two buttons before the existing "Ändra svar":
  ```html
  <button class="btn-ghost btn-sm" id="open-share" onclick="document.getElementById('share-modal').classList.remove('hidden')">Dela min plan</button>
  <button class="btn-ghost btn-sm" id="open-auth"  onclick="document.getElementById('auth-modal').classList.remove('hidden')">Mitt konto</button>
  ```
- **Immediately after `<body>` (line 124)**, add the shared-plan banner:
  ```html
  <div id="shared-banner" class="hidden" role="status">Du ser en delad plan (skrivskyddad).</div>
  ```
- **Before `</body>` (line 894)**, paste the full contents of `auth-modal.html` and `share-modal.html` (in that order).

No CSS changes required — both modals piggyback on existing `.modal`, `.btn-primary`, `.btn-ghost`, `.hidden` classes already in `style.css`. (Verified pattern-wise during exploration; if a `.modal` class is absent I'll add ~15 lines of scoped CSS inline within each snippet.)

## Out of scope (explicitly not doing)

- No Stripe wiring (separate ticket T054+).
- No read-only lockdown of form inputs for shared-view mode beyond setting the banner + a `window.__efterplanSharedState` flag. Fully greying out the UI is a follow-up.
- No migration of existing localStorage data for users who later sign in on a different device — the SIGNED_IN hydration path handles first-time device sync, but two-way merge across devices is not implemented (last-write-wins at the plan level).
- Not touching `sw.js`. No build step. No npm.

## Final report the implementer will produce

After writing the files, the final response will list:
1. Every file created (with paths).
2. Exact line numbers of every edit in `index.html` and `app.js`.
3. **Owner actions** (in order):
   a. Paste Supabase project URL + anon key into the `SUPABASE_CONFIG` block at the top of `supabase-client.js`.
   b. In Supabase SQL editor, run `supabase/schema.sql` top-to-bottom.
   c. In Supabase Auth settings, disable email+password sign-in (magic link only).
   d. In Supabase Auth settings, add `https://efterplan.se` and `http://localhost:*` to the redirect allow-list.
4. **How to test**:
   - Local: serve repo with `python3 -m http.server`, visit `/`, complete onboarding, click "Mitt konto", request magic link, click link in email, verify plan appears after refresh on a different browser.
   - Sharing: on browser A click "Dela min plan", copy URL, open in incognito browser B, verify the banner shows and the plan renders read-only.
   - Revoke: click "Sluta dela" in browser A, reload browser B, verify the shared URL now fails gracefully.
