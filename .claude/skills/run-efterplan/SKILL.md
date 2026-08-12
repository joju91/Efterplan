---
name: run-efterplan
description: Build, run, and drive the Efterplan frontend (static site) and test its Vercel API endpoints. Use when asked to start Efterplan, screenshot its UI, click through the onboarding/plan/Arkiv flow, or test /api/* against the deployed site.
---

Efterplan is a static HTML/CSS/vanilla-JS site (no build step, no bundler)
plus a handful of Vercel serverless functions under `api/`. There are two
separate things to drive here, and they don't run the same way:

- **Frontend UI** — served locally via `.claude/launch.json`'s "Efterplan
  static" config (`python -m http.server 3001`), driven with the
  `mcp__Claude_Browser__*` tools (this environment's off-the-shelf
  browser harness — no `chromium-cli` binary here, use these instead).
- **`/api/*` endpoints** — Vercel serverless functions. The static
  server does **not** serve these. Drive them with `curl` against the
  deployed site (`https://efterplan.se`) directly.

All paths below are relative to the repo root.

## Prerequisites

Nothing to install — Python 3 (for `http.server`) and Node/npx are
already present in this environment. No `npm install` needed for the
frontend; it's plain HTML/CSS/JS with no build step.

## Run (agent path) — Frontend UI

1. Launch the static server + open a tab (uses the config already in
   `.claude/launch.json`):

   ```
   mcp__Claude_Browser__preview_start { "name": "Efterplan static" }
   ```

   Returns a `tabId` (e.g. `tab-2`) — use it in every call below.

2. Check for load errors:

   ```
   mcp__Claude_Browser__read_console_messages { "tabId": "tab-2", "onlyErrors": true }
   ```

3. Read the page and click through. **Use `filter: "all"`, not
   `"interactive"`** — see Gotchas. A generous `max_chars` (6000–12000)
   is worth it: this app keeps every onboarding step in the DOM at
   once (toggling `display:none`/`flex` via JS, not a `.hidden`
   class), so one `all`-filter read surfaces refs for several steps
   ahead in a single call.

   ```
   mcp__Claude_Browser__read_page { "tabId": "tab-2", "filter": "all", "max_chars": 12000 }
   ```

4. Drive the flow with `computer` (click) against the refs you found.
   The real user path from a cold load:

   `"Börja här"` (landing gate) → Step 1/4 pick a relation button
   (e.g. `"Förälder"`) → `"Nästa →"` → Step 2/4 (checkboxes, optional
   — just click `"Nästa →"`) → Step 3/4 (name/date fields, optional)
   → `"Nästa →"` → Step 4/4 (personnummer, optional) →
   `"Visa min plan →"` → lands on the plan screen with nav tabs
   `Min plan / Dokument / Bouppteckning / 🗂 Arkiv`.

   ```
   mcp__Claude_Browser__computer { "action": "left_click", "ref": "ref_15", "tabId": "tab-2" }
   ```

5. Re-check console for errors after driving:

   ```
   mcp__Claude_Browser__read_console_messages { "tabId": "tab-2", "onlyErrors": true }
   ```

6. For quick DOM/state assertions (e.g. "is the Arkiv panel actually
   visible") that don't need a full `read_page`, use `javascript_tool`
   — read-only inspection, not for driving UI:

   ```
   mcp__Claude_Browser__javascript_tool { "action": "javascript_exec", "text": "document.querySelector('.plan-tab.active')?.textContent" }
   ```

7. Stop the server when done:

   ```
   mcp__Claude_Browser__preview_stop { "serverId": "<from step 1>" }
   ```

### Screenshots

`computer { action: "screenshot" }` only works if the Browser pane is
actually displayed in the UI — if it errors with "Browser pane is not
displayed," fall back to `get_page_text` (`mcp__Claude_Browser__get_page_text`)
or `read_page` to verify content/state instead of a visual capture.

## Run (agent path) — `/api/*` endpoints

These only exist on Vercel (production or preview deploys) — there is
no local dev server config for them in this repo. Test directly
against the live site with `curl`:

```bash
curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST https://efterplan.se/api/create-checkout \
  -H "Content-Type: application/json" --data '{}'
```

Expect `{"url":"https://checkout.stripe.com/...","id":"cs_live_..."}` on
success. Other endpoints follow the same shape — see `api/*.js` for the
expected request body per route (e.g. `categorize-document` wants
`{"image":"data:image/png;base64,..."}`).

`api/stripe-webhook.js` additionally requires a valid `stripe-signature`
header (HMAC-SHA256 of `${timestamp}.${body}` using the endpoint's
`whsec_...` secret) — construct it with Node's `crypto.createHmac`
before `curl`-ing if you need to exercise that route.

## Run (human path)

```bash
python -m http.server 3001    # serves the repo root at http://localhost:3001
```

Open in a real browser. Ctrl-C to stop. `/api/*` still won't work —
same limitation as above.

## Test

No automated test suite in this repo as of this writing (no
`npm test` script). Verification is manual/agent-driven per above.

---

## Gotchas

- **`read_page { filter: "interactive" }` returns `(empty page)` on
  this app**, even right after a successful click that changed
  visible state. The interactive-element heuristic doesn't pick up
  this app's buttons reliably. Always use `filter: "all"` instead and
  read the button/link text yourself.
- **Refs can go stale between calls** — `left_click` on a ref from an
  earlier read can fail with `"entirely outside the viewport"` if the
  page re-rendered since. Re-run `read_page` after any click that
  changes what's on screen before clicking again, unless you already
  captured the ref you need from a single wide `all`-filter read (see
  above — this app keeps future steps in the DOM, so one read often
  covers several steps at once).
- **Onboarding gate on every cold load.** There's no way to skip
  straight to the plan screen — every fresh tab starts at the
  landing page and needs the "Börja här" → 4-step wizard → "Visa min
  plan →" sequence before the real app (with the Arkiv tab etc.) is
  reachable.
- **`/api/*` calls made through the local static server 404/fail** —
  it's `python -m http.server`, a pure static file server. Vercel
  functions only run on an actual Vercel deployment.
