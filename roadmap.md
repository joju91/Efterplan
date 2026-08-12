# Roadmap — Full Backlog (Exact Execution Order)

Start at **T001**. Do not proceed until the current ticket is fully completed.

Each step improves the product or the company in a meaningful way.

---

## Legend
- ☐ Not started
- ⧖ In progress / Parkerad
- ✔ Completed
- x Skipped / Not needed
- Priority: 🔴 Critical · 🟠 Important · 🟡 Medium · 🟢 Low
- Type: Dev · Design · Content · Research · Infra · Bolag · QA · Legal · Iteration · SEO · Distribution · Partnership · Analytics · PR · Growth

---

## ⚠️ STRATEGISKA NOTER (uppdaterad 2026-04-24)
- **Partnerskap med begravningsbyråer och jurister är inte aktuellt.** T045, T046, T077, T078 struktna. Efterplan används INNAN begravningsbyrå kontaktas — flödet går efterplan → byrå, inte tvärtom.
- **T079** — omdefinierad: betald byrålisting i appen. Affärsmodell (pris, avtal, säljprocess) beslutas av Owner innan exekvering.
- **T044** — struken. Facebook-grupper bannar reklamlänkar.
- **T087 länkbyggnad** — hallakonsument.se kontaktad ✔. Övriga 5 struktna (felaktig målgrupp).
- **T032 (Stripe)** — parkerad tills Code-sessioner klara. Pris: 49 kr engång.
- **T033** — pricing uppdaterad till 49 kr (testnivå, tidigare 149 kr).
- **T051/T052/T053** — kod klar men blockerad: kräver (1) skapa Supabase-projekt, (2) kör supabase/schema.sql, (3) stäng av lösenords-auth, (4) fyll i URL + anon key i supabase-client.js. Owner-åtgärd.
- **Stack:** repot är statiskt HTML + vanilla JS, inte Next.js. Alla Code-ändringar gjorda i rätt stack.
- **T082 + T098 (meta)** — körs i Claude Code.
- **T093** CTA/funnel — körs i Claude Code.

---

# ⚙️ FAS 1 — FOUNDATION
💡 Everything else is blocked until this is done.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T001 | Read the entire Manifest sheet and confirm scope | Fas 1 | 📋 Manifest | 🔴 | Principle | ☐ |
| T003 | Register company / sole proprietorship + apply for F‑tax | Fas 1 | 🏢 Company Plan | 🔴 | Bolag | ☐ |
| T004 | Open business bank account (Lunar / Swedbank / Revolut Business) | Fas 1 | 🏢 Company Plan | 🔴 | Bolag | ☐ |
| T005 | Create GitHub repo + base project setup (Next.js recommended) | Fas 1 | 📱 App Plan | 🔴 | Infra | ✔ |

---

# 📱 FAS 2 — BUILD THE CORE
💡 The core *is* the product.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T006 | Sketch the entire checklist flow (all steps, correct order) | Fas 2 | 📱 App Plan | 🔴 | Design | ✔ |
| T007 | Build view: show 1 active task | Fas 2 | 📱 App Plan | 🔴 | Dev | ✔ |
| T008 | Add "Done →" button | Fas 2 | 📱 App Plan | 🔴 | Dev | ✔ |
| T009 | Show "Next step is X" | Fas 2 | 📱 App Plan | 🔴 | Dev | ✔ |
| T010 | Progress counter | Fas 2 | 📱 App Plan | 🔴 | Dev | ✔ |
| T011 | Save progress in localStorage | Fas 2 | 📱 App Plan | 🔴 | Dev | ✔ |

---

# ✍️ FAS 3 — CONTENT
💡 Content *is* the product.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T012 | Write all 20–30 steps | Fas 3 | 📱 App Plan | 🔴 | Content | ✔ |
| T013 | Add priority per step | Fas 3 | 📱 App Plan | 🔴 | Content | ✔ |
| T014 | Deterministic order — system chooses | Fas 3 | 📋 Manifest | 🔴 | Logic | ✔ |
| T015 | Validate step order with 2–3 real relatives | Fas 3 | 📋 Manifest | 🔴 | Research | ⧖ |
| T016 | Adjust order and text based on interviews | Fas 3 | 📋 Manifest | 🔴 | Content | ⧖ |

---

# 📐 FAS 4 — MOBILE‑FIRST UX
💡 Mobile first. Desktop is a bonus.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T017 | Mobile layout: large type, spacing, big buttons | Fas 4 | 📋 Manifest | 🔴 | Design | ✔ |
| T018 | Remove distractions — no menus, sidebars, images | Fas 4 | 📋 Manifest | 🔴 | Design | ✔ |
| T019 | Build expand view ("See all steps") | Fas 4 | 📱 App Plan | 🟠 | Dev | ✔ |
| T020 | Test on real mobile (iOS + Android) | Fas 4 | 📱 App Plan | 🔴 | QA | ✔ |
| T021 | Ensure loading < 1s on 4G | Fas 4 | 📱 App Plan | 🟠 | QA | ✔ |

---

# 🛡️ FAS 4.5 — UX POLISH & ACCESSIBILITY
💡 Must be done before soft launch.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T055 | Split plan into urgency sections | Fas 4.5 | UX Audit | 🔴 | Dev | ✔ |
| T056 | Add visual progress bar in onboarding | Fas 4.5 | UX Audit | 🔴 | Dev | ✔ |
| T057 | Add offline banner | Fas 4.5 | UX Audit | 🔴 | Dev | ✔ |
| T058 | Loading indicator with calming text | Fas 4.5 | UX Audit | 🟠 | Dev | ✔ |
| T059 | A11y pass: aria, focus, contrast | Fas 4.5 | UX Audit | 🟠 | A11y | ✔ |

---

# 🚀 FAS 5 — TRUST & SOFT LAUNCH
💡 Launch open and free. Real users give real data.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T022 | Add disclaimer: "Not legal advice" | Fas 5 | 📱 App Plan | 🔴 | Legal | ✔ |
| T024 | End‑to‑end test | Fas 5 | 📱 App Plan | 🔴 | QA | ✔ |
| T025 | Publish MVP on domain — all free | Fas 5 | 🏢 Company Plan | 🔴 | Launch | ✔ |
| T026 | ~~Share with 5 target users, collect feedback~~ | Fas 5 | 📋 Manifest | 🔴 | Research | x |
| T027 | Iterate on top 3 confusion points | Fas 5 | 📋 Manifest | 🔴 | Iteration | ☐ |

---

# 💰 FAS 6 — MONETIZATION
💡 Don't add paywall until usage is proven.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T028 | Set up Stripe account | Fas 6 | 🏢 Company Plan | 🔴 | Bolag | x |
| T029 | Decide paywall point | Fas 6 | 📱 App Plan | 🔴 | Decision | x |
| T030 | Build free preview (steps 1–5 open) | Fas 6 | 📱 App Plan | 🔴 | Dev | ✔ |
| T031 | Build payment flow: Stripe Checkout → unlock | Fas 6 | 📱 App Plan | 🔴 | Dev | x |
| T032 | Test full purchase flow | Fas 6 | 📱 App Plan | 🔴 | QA | ⧖ |
| T033 | Final pricing model decided — 49 kr engång (testnivå) | Fas 6 | 🏢 Company Plan | 🔴 | Decision | ✔ |

---

# 🏢 FAS 7 — COMPANY & OPS
💡 Infrastructure that scales.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T034 | Set up Bokio or Fortnox | Fas 7 | 🏢 Company Plan | 🟠 | Bolag | ⧖ |
| T035 | Install Plausible Analytics | Fas 7 | 🏢 Company Plan | 🟠 | Infra | ✔ |
| T036 | Configure analytics events | Fas 7 | 🏢 Company Plan | 🟠 | Infra | ✔ |
| T037 | KPI dashboard | Fas 7 | 🏢 Company Plan | 🟠 | Analytics | ✔ |

---

# 🔍 FAS 8 — SEO
💡 SEO takes 3–6 months.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T038 | Canonical landing page | Fas 8 | 🏢 Company Plan | 🔴 | SEO | ✔ |
| T039 | 5 long‑tail FAQ pages | Fas 8 | 🏢 Company Plan | 🟠 | SEO | ✔ |
| T040 | LLM‑friendly answers | Fas 8 | 🏢 Company Plan | 🟠 | SEO | ✔ |
| T041 | FAQ structured data | Fas 8 | 🏢 Company Plan | 🟡 | Dev | ✔ |
| T042 | Core Web Vitals | Fas 8 | 📱 App Plan | 🟡 | Dev | ✔ |
| T084 | Fix mobile PageSpeed: eliminera redirect chain + reduce unused JS (mål LCP <2.5s) | Fas 8 | SEO Audit | 🟠 | Dev | ✔ |
| T085 | Lägg till Organization schema (Identity Schema) på index-sidan | Fas 8 | SEO Audit | 🟡 | Dev | ✔ |
| T086 | Ta bort plain text email — ersätt med kontaktformulär eller obfuskerad mailto | Fas 8 | SEO Audit | 🟡 | Dev | ✔ |

---

# 📣 FAS 9 — DISTRIBUTION
💡 Start with free channels.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T043 | Flashback post | Fas 9 | 🏢 Company Plan | 🟠 | Distribution | ✔ |
| T044 | Facebook groups | Fas 9 | 🏢 Company Plan | 🟠 | Distribution | x |
| T045 | Contact 3 lawyers | Fas 9 | 🏢 Company Plan | 🟡 | Partnership | x |
| T046 | Contact 3 funeral homes | Fas 9 | 🏢 Company Plan | 🟡 | Partnership | x |

---

# 📈 FAS 10 — OPTIMIZE & GROW
💡 Only optimize what works.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T047 | Analyze drop‑off | Fas 10 | 🏢 Company Plan | 🔴 | Analytics | ⧖ Väntar på ~100 organiska sessioner |
| T048 | A/B test price | Fas 10 | 🏢 Company Plan | 🟠 | Growth | ☐ |
| T049 | Improve weakest content | Fas 10 | 📱 App Plan | 🟠 | Content | ✔ |
| T050 | PDF export | Fas 10 | 📱 App Plan | 🟡 | Dev | ✔ |
| T051 | Supabase: DB + auth | Fas 10 | 📱 App Plan | 🟡 | Infra | ✔ |
| T052 | Sharing feature | Fas 10 | 📱 App Plan | 🟡 | Dev | ✔ |
| T053 | Account system | Fas 10 | 📱 App Plan | 🟢 | Dev | ✔ |
| T054 | Automation: letters, authorities | Fas 10 | 📱 App Plan | 🟢 | Dev | ✔ |

---

# 🔧 FAS 4.5 — HOTFIXES & CONTENT

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T064 | Bug: skip‑link wrong target | Fas 4.5 | 📱 App Plan | 🔴 | Dev | ✔ |
| T065 | Bug: ALL CAPS headings | Fas 4.5 | 📱 App Plan | 🔴 | Design | ✔ |
| T066 | Bug: tagline truncation on narrow mobile | Fas 4.5 | 📱 App Plan | 🔴 | Design | ✔ |
| T063 | Content: Lantmäteriet 3‑month rule | Fas 4.5 | 📱 App Plan | 🟠 | Content | ✔ |

---

# 🛡️ FAS 5 — GROWTH & MOAT

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T060 | Push notifications (7/30/90 days) — rättad 2026-08-11: koden finns bara på oihopslagen branch `origin/codex/t060-checkpoints` (commit c4039e5), inte på `main`. Mätt från plan-skapande, inte dödsdatum — ej samma datumlogik som T135. Merga eller bygg om innan T136 antar att den finns. | Fas 5 | 📱 App Plan | 🟠 | Dev | ⧖ |
| T061 | 3–4 static SEO landing pages | Fas 5 | 📱 App Plan | 🟠 | Growth | ✔ |
| T062 | Extended telemetry | Fas 5 | 📱 App Plan | 🟡 | Analytics | ✔ |

---

# 🆕 FAS 10 — NEW FEATURES

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T067 | Bills overview (manual or OCR) | Fas 10 | 📱 App Plan | 🟡 | Dev | ✔ |
| T068 | Notes field per task | Fas 10 | 📱 App Plan | 🟡 | UX | ✔ |
| T069 | Accessibility: voice input (speech‑to‑text) | Fas 10 | 📱 App Plan | 🟢 | UX | ✔ |

---

# 🚀 FAS 11 — TRAFFIC SPRINT (30 DAYS)

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|---------|--------|
| T070 | Verify Search Console + sitemap | 2026‑04‑13 | Fas 11 | SEO Sprint | 🟡 | SEO | ✔ |
| T071 | Publish landing page "dodsbo‑checklista‑7‑dagar" | 2026‑04‑14 | Fas 11 | SEO Sprint | 🟡 | SEO | ✔ |
| T072 | Publish "bouppteckning‑tidslinje" + FAQ schema | 2026‑04‑15 | Fas 11 | SEO Sprint | 🟡 | SEO | ✔ |
| T073 | Set up dashboard: traffic → onboarding → plan generated | 2026‑04‑16 | Fas 11 | Analytics Sprint | 🟡 | Analytics | ✔ |
| T074 | Flashback post + log responses | 2026‑04‑20 | Fas 11 | Distribution | 🟡 | Distribution | ✔ |
| T075 | Post in 3 Facebook groups | 2026‑04‑21 | Fas 11 | Distribution | 🟡 | Distribution | ✔ |
| T076 | Reddit resource post + CTA | 2026‑04‑22 | Fas 11 | Distribution | 🟡 | Distribution | ✔ |
| T077 | Outreach: 10 funeral homes + 10 lawyers | 2026‑04‑23 | Fas 11 | Partnership | 🟡 | Partnership | x |
| T078 | Contact 3 lawyers (pilot) | 2026‑04‑27 | Fas 11 | Partnership | 🟡 | Partnership | x |
| T079 | Betald byrålisting: lägg till sponsrade begravningsbyråer i appen vid relevanta steg. Affärsmodell beslutas av Owner. | 2026‑04‑28 | Fas 11 | Partnership | 🟡 | Partnership | ⧖ |
| T080 | Media pitch to 5 outlets | 2026‑04‑29 | Fas 11 | PR | 🟡 | PR | ✔ |
| T081 | Analyze drop‑off + prioritize top 3 issues | 2026‑05‑04 | Fas 11 | Analytics | 🟡 | Analytics | ⧖ Väntar på ~100 organiska sessioner |
| T082 | Optimize top 3 landing pages | 2026‑05‑05 | Fas 11 | SEO | 🟡 | SEO | ✔ |
| T083 | Weekly KPI review + new 14‑day plan | 2026‑05‑06 | Fas 11 | Growth | 🟡 | Growth | ✔ |
| T087 | Länkbyggnad: hallakonsument.se kontaktad. Övriga struktna (felaktig målgrupp). | 2026‑05‑10 | Fas 11 | SEO Audit | 🟠 | SEO | ✔ |
| T089 | SEO-sida: dodsfallsintyg | — | Fas 11 | SEO Sprint | 🟡 | SEO | ✔ |
| T090 | SEO-sida: laglott | — | Fas 11 | SEO Sprint | 🟡 | SEO | ✔ |
| T091 | SEO-sida: saga-upp-hyresratt-dodsbo | — | Fas 11 | SEO Sprint | 🟡 | SEO | ✔ |

---

# 🚀 FAS 12 — SPRINT 3: GROWTH & QUALITY

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T092 | SEO: tomma-dodsbo.html | Fas 12 | Sprint 3 | 🟡 | SEO | ✔ |
| T093 | Konvertering: CTA/funnel-optimering | Fas 12 | Sprint 3 | 🟡 | Growth | ✔ |
| T094 | Outreach-uppföljning | Fas 12 | Sprint 3 | 🟡 | Partnership | x |
| T095 | Kvalitetsstämplar & certifikat | Fas 12 | Sprint 3 | 🟡 | Dev | ✔ |
| T096 | Mobilwebb & app-funktionalitet | Fas 12 | Sprint 3 | 🔴 | Dev | ✔ |
| T097 | Centrera layout i browser | Fas 12 | Sprint 3 | 🔴 | Dev | ✔ |
| T098 | Meta title/description: /checklista-dodsbo (174 visningar, 0 klick) | Fas 12 | SEO Sprint | 🔴 | SEO | ✔ |
| T099 | Delning till anhöriga: två länktyper (läs + redigerbar). Redigerbar länk låter anhöriga bocka av uppgifter utan inloggning, via security-definer RPC som bara rör efterplan_tasks. Ägarspecifik UI döljs för delade besökare. | Fas 12 | Sprint 3 | 🟠 | Dev | ✔ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-04-29

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T100 | Meta description saknas i share-modal.html + auth-modal.html — false positive: filerna är body-fragment som inlines i index.html, meta-tagg ogiltig där | 2026-04-29 | Fas 12 | Veckorapport | 🟠 | SEO | x |
| T101 | Standardisera GA4 event-namn till snake_case i app.js — `'Onboarding Start'` → `'onboarding_start'`, `'Plan Generated'` → `'plan_generated'`, `'Task Complete'` → `'task_completed'` (app.js rad 73, 170, 285, 1267). Dashboard server.js dual-querar gamla + nya namn så historisk data bevaras. | 2026-04-29 | Fas 12 | Veckorapport | 🟠 | Analytics | ✔ |
| T102 | Uppgradera express 4→5 i ga4-dashboard/package.json + verifiera att inga breaking changes påverkar server.js. Express 5.2.1 installerat, smoke-test /api/health → 200 OK. | 2026-04-29 | Fas 12 | Veckorapport | 🟡 | Dev | ✔ |
| T103 | Uppgradera googleapis 144→171 i ga4-dashboard/package.json. Verifierad 2026-05-29: package.json + lockfile båda på 171.4.0. | 2026-04-29 | Fas 12 | Veckorapport | 🟡 | Dev | ✔ |
| T104 | Verifiera 4 moderate npm audit-sårbarheter i ga4-dashboard. Status 2026-05-29: 0 sårbarheter i root, 1 moderate kvar i ga4-dashboard (qs DoS, låg reell risk). qs 6.14.2→6.15.2 i lockfile. | 2026-04-29 | Fas 12 | Veckorapport | 🟡 | Dev | ✔ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-05-04

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T105 | ga4-dashboard/public/index.html saknar `<meta name="robots" content="noindex, nofollow">` — intern admin-dashboard är exponerad utan noindex-direktiv och riskerar att crawlas/indexeras av sökmotorer. Lägg till i `<head>` på rad 8. Fil: ga4-dashboard/public/index.html | 2026-05-04 | Fas 12 | Veckorapport | 🟠 | SEO | ✔ |
| T106 | Extern uptime-monitor saknas — sandbox-hälsocheck blockeras av Cloudflare (HTTP 403), dvs riktiga driftstopp syns inte proaktivt. Sätt upp UptimeRobot (gratis) för https://efterplan.se med e-postvarning till jonas.soderstrom43@gmail.com (kontrollintervall 5 min). | 2026-05-04 | Fas 12 | Veckorapport | 🟠 | Dev | ✔ |
| T107 | sitemap.xml lastmod-datum är inaktuella — flertalet URLs har `2026-04-15` men nyare SEO-sidor (tomma-dodsbo, checklista-dodsbo m.fl.) har lagts till sedan dess. Uppdatera `<lastmod>` för berörda sidor i sitemap.xml. Fil: sitemap.xml | 2026-05-04 | Fas 12 | Veckorapport | 🟡 | SEO | ✔ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-05-11

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T108 | Stripe 17.5→22.1.1 — uppgraderad i package.json. apiVersion '2024-11-20.acacia' i api/_lib.js oförändrad. Smoke-test passerat (checkout.sessions.create + webhooks.constructEvent + syntax-check på alla api/*.js). Återstår: Stripe testmiljö-betalning end-to-end. Fil: package.json. | 2026-05-11 | Fas 12 | Veckorapport | 🟠 | Dev | ✔ |
| T109 | @supabase/supabase-js 2.45→2.105.4 — uppgraderad i package.json. Smoke-test passerat (from/auth/upsert exponerade). Återstår: full smoke-test av premium-entitlement + delad plan i produktion. Fil: package.json. | 2026-05-11 | Fas 12 | Veckorapport | 🟡 | Dev | ✔ |
| T110 | Roadmap-status synkad: T105 (ga4 noindex) + T107 (sitemap lastmod) markerade ✔ enligt faktiska commits. | 2026-05-11 | Fas 12 | Veckorapport | 🟡 | Dev | ✔ |
| T111 | UptimeRobot uppsatt för https://efterplan.se (monitor-ID 803022627). HTTP/S, 5 min intervall, e-postvarning till jonas.soderstrom43@gmail.com. 100% uptime senaste 3 dagar. | 2026-05-11 | Fas 12 | Veckorapport | 🟠 | Infra | ✔ |
| T112 | GA4 intern-trafik-filter verifierat: regel "Jag själv" (IP 83.233.139.162, traffic_type=internal) + datafilter "Internal Traffic" status=Aktiv, åtgärd=Uteslut. Jonas egna sessioner exkluderas redan från rapporter. | 2026-05-11 | Fas 12 | Veckorapport | 🟠 | Analytics | ✔ |
| T113 | Konfigurera GA4 service-account-credentials i Cowork-sandlådan så veckorapport kan dra GA4-data direkt. Klart när: ga4-service-account.json finns på förväntad sökväg. | 2026-05-11 | Fas 12 | Veckorapport | 🟡 | Infra | ☐ |
| T114 | GSC-indexeringsproblem efter canonical-byte (www→apex): lägg till 308-redirect www.efterplan.se→efterplan.se i vercel.json `redirects`-block. Punkt 4b (byt www-canonicals i *.html) och 4c (rensa sitemap.xml) redan klara (commit 265659f + grep `www.efterplan.se` = 0 träffar). Efter deploy: begär omindexering i GSC för 3 drabbade URL:er. | 2026-05-11 | Fas 12 | Veckorapport | 🟠 | SEO | ✔ |

---

## ✅ KLART — Säkerhet 2026-05-12

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T115 | Stripe webhook signing secret roterad efter GitGuardian-läcka. Gammalt `whsec_*` från Kaascha-sandlådan exponerades i `.claude/handoff.md` (PR #21, merge 5e2ba3f, 2026-05-11). Roterad i Stripe Dashboard, nytt värde satt i Vercel env (production + preview), redeployat. `.claude/handoff.md`, `weekly-report.log`, `scheduled_tasks.lock`, `settings.local.json` tillagda i `.gitignore` och untrackade från index. Historik lämnad orörd (test-mode secret, ingen pengarisk efter rotation). | 2026-05-12 | Säkerhet | GitGuardian | 🔴 | Infra | ✔ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-05-18

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T116 | UTF-8 BOM borttagen från ga4-dashboard/package.json (EF BB BF). Innehållet oförändrat. Åtgärdat 2026-05-29. | 2026-05-18 | Fas 12 | Veckorapport | 🟠 | Dev | ✔ |
| T117 | 13 GA4-events i app.js bytta från Title Case till snake_case (premium_activated, checkbox_toggle, note_saved, preview_cta_clicked, bill_added, bill_scanned_qr, bill_scanned_photo_only, doc_generated x2, plan_completed, plan_printed, paywall_cta_clicked, shared_plan_opened). Dashboard server.js dual-querar gamla + nya namn (T101) så historisk data bevaras. Åtgärdat 2026-05-29. | 2026-05-18 | Fas 12 | Veckorapport | 🟡 | Analytics | ✔ |
| T118 | Roadmap-status synkad: T106 (UptimeRobot) markerad ✔ — T111 ✔ bekräftar att UptimeRobot sattes upp 2026-05-11 men T106 stod kvar som ☐. Uppdaterat i detta commit. | 2026-05-18 | Fas 12 | Veckorapport | 🟡 | Dev | ✔ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-05-25

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T119 | om.html tillagd i sitemap.xml (priority 0.5, monthly). Sajten hade sidan men sitemap missade den. Åtgärdat 2026-05-29. | 2026-05-25 | Fas 12 | Veckorapport | 🟠 | SEO | ✔ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-05-29

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T120 | Cache-busting förenat på 33 HTML-sidor: `style.css` → `style.css?v=3` (förut bara index.html versionerad). Eliminerar stale-CSS-risk efter deploy. | 2026-05-29 | Fas 12 | Dagsrapport | 🔴 | Dev | ✔ |
| T121 | h1-hierarki: index.html har nu exakt en h1 (landing-headline). plan-title och co-title demoteras till h2; landing-eyebrow till p. Två trasiga slut-taggar i WIP rättade samtidigt. | 2026-05-29 | Fas 12 | Dagsrapport | 🟠 | A11y | ✔ |
| T122 | Tokenisera 135 hårdkodade hex-färger i inline `style=`. Inte påbörjat — kräver designpass mot `style-tokens.css`. | 2026-05-29 | Fas 12 | Dagsrapport | 🟡 | Design | ☐ |
| T123 | De-inlining: utility-klasser (.u-*) tillagda i style.css och applicerade på auth-modal.html + vad-gora-nar-nagon-dor.html. ~50 nya utility-klasser. Återstår: rulla ut på övriga sidor med inline style=. | 2026-05-29 | Fas 12 | Dagsrapport | 🟢 | Dev | ⧖ |
| T124 | Skrota delningsfunktionen: ta bort SHARED-objekt, isOwnerMode/isReadOnly/isSharedEdit, assignee/participants-system, share-modal, supabase share-API. Onboarding 6→4 steg. Rensa ~1 090 rader kod (app.js, index.html, style.css, supabase-client.js). — 2026-05-30 | 2026-05-30 | Fas 12 | Session | 🔴 | Dev | ✔ |
| T125 | 7 nya tasks: viktiga_dokument (today, alltid), aktemanskapsforord (week, make), livforsakring_ansokan (week, alltid), vardepapper_hantering (week, vardepapper), barnpension_ansokan (week, barn), omstallningspension (week, make), autogiron_avsluta (later, alltid). 2 nya onboarding-checkboxar: vardepapper + barn. — 2026-05-30 | 2026-05-30 | Fas 12 | Session | 🟠 | Content | ✔ |
| T126 | Bouppteckning-formulär: ny tab i plan-skärmen med tre sektioner (dödsbodelägare, tillgångar, skulder). Sammanfattningsrad med nettovärde. localStorage-persistens via `efterplan_bouppteckning`. — 2026-05-30 | 2026-05-30 | Fas 12 | Session | 🟠 | Dev | ✔ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-06-01

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T127 | Engelska "deceased" i barnpension_ansokan-beskrivning — app.js rad 698 innehåller `"den deceased hade ett efterlevandeskydd"`. Byt till `"den avlidne hade"`. Tillagd i T125-commit 59ddcde. | 2026-06-01 | Fas 12 | Veckorapport | 🟠 | Content | ☐ |
| T128 | Sitemap lastmod stale — sitemap.xml visar `lastmod>2026-05-04` för flertalet sidor (bouppteckning-guide.html, vad-gora-nar-nagon-dor.html, arvskifte-guide.html m.fl.) men dessa sidor har uppdaterats i commits sedan dess. Uppdatera lastmod-datum per `git log --format="%ai" -- <fil>` för respektive URL. Fil: sitemap.xml. | 2026-06-01 | Fas 12 | Veckorapport | 🟠 | SEO | ☐ |
| T129 | share-modal.html överblivet spöke — T124 dokumenterade att share-modal skrotades (commit 59ddcde) men filen share-modal.html (183 rader) finns kvar i repot. Inga referenser i index.html eller app.js. Ta bort filen. Fil: share-modal.html. | 2026-06-01 | Fas 12 | Veckorapport | 🟡 | Dev | ☐ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-06-08

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T130 | package-lock.json saknas i repo-root: `npm outdated` visar @supabase/supabase-js och stripe som MISSING. Kör `npm install` i repo-root och committa package-lock.json. ga4-dashboard/ har sin egen package-lock.json och påverkas inte. Fil: package.json (root). | 2026-06-08 | Fas 12 | Veckorapport | 🟡 | Dev | ☐ |
| T131 | HTTP 403 vid automatisk live-check: efterplan.se svarar 403 Forbidden för alla automatiserade requests (WebFetch + Python urllib). Trolig orsak: Vercel Bot Protection. Verifiera att UptimeRobot (T111) fortfarande når sajten och justera Bot Protection-nivå i Vercel Dashboard om nödvändigt. Fil: Vercel Dashboard → Security. | 2026-06-08 | Fas 12 | Veckorapport | 🟠 | Infra | ☐ |
| T132 | weekly-report.yml committar inte roadmap.md: Actions-workflow (`.github/workflows/weekly-report.yml`) gör `git add "$FILE"` för enbart veckorapporten — roadmap-uppdateringar och GitHub Issues-skapande saknas i det automatiserade flödet. Utöka weekly-report.mjs eller lägg till steg i yml för att inkludera roadmap.md vid ändringar. Fil: .github/workflows/weekly-report.yml. | 2026-06-08 | Fas 12 | Veckorapport | 🟡 | Dev | ☐ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-06-15

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T133 | bouppteckning_saved analytics saknas — `boppSave()` (app.js:2286) kallar inte `track()`. Bouppteckning-formuläret (T126, shipad 2026-05-30) genererar inga GA4-events, dvs. vi kan inte mäta hur många användare aktiverar funktionen. Lägg till `track('bouppteckning_saved', { delbagare: boppData.delbagare.length, tillgangar: boppData.tillgangar.length, skulder: boppData.skulder.length })` i `boppSave()`. Fil: app.js:2286. | 2026-06-15 | Fas 12 | Veckorapport | 🟠 | Analytics | ☐ |
| T134 | ga4-dashboard/public/index.html saknar meta description — `grep -rL 'meta name="description"'` flaggar dashboardens index-sida. Lägg till `<meta name="description" content="Efterplan GA4-dashboard — intern analys">` i `<head>`. Fil: ga4-dashboard/public/index.html. | 2026-06-15 | Fas 12 | Veckorapport | 🟡 | SEO | ☐ |

---

# 🧭 STRATEGISESSION — 2026-07-18

💡 Prioriterat: en sak i taget. Bygg T135 (deadline-motor) klart innan T136 påbörjas.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T135 | Deadline-motor: räkna ut lagstadgade frister automatiskt från dödsdatum och visa som konkreta kalenderdatum. Byggd 2026-08-11: **dödsdatum fanns inte i onboarding trots vad tickettexten antog** — nytt frivilligt datumfält tillagt i steg 3 (`index.html`, `state.deathDate`). Ny motor `addMonths()`/`addDays()`/`applyDeadlines()` i `app.js` beräknar bouppteckningsfrist (+3 mån) och Skatteverket-inlämning (+4 mån) som datum på `bouppteckning`-kortet, samt hyresuppsägning (+30 dagar) på `hyresratt_uppsagning`-kortet. Dödsboanmälan (+2 mån) hålls medvetet mjuk ("runt … eller tidigare") eftersom exakt kommunregel fortfarande är overifierad — en falskt exakt deadline hade skapat onödig stress. Sidofix: `OB_TOTAL` var felaktigt satt till 3 trots 4 onboarding-steg (fel antal progress-dots) — rättat till 4. | 2026-07-18 | Fas 12 | Session | 🔴 | Dev | ✔ |
| T136 | Påminnelsemejl om deadlines — återanvänder T135:s datumberäkningar + befintlig e-postinfra (Supabase-inloggning/synk finns redan, se T051-T053). Skicka mejl X veckor innan bouppteckningsfrist och innan inlämningsfrist. Måste kunna stängas av frivilligt, ej tvingande. Bygg efter T135. | 2026-07-18 | Fas 12 | Session | 🟡 | Dev | ☐ |

---

## 💡 MÖJLIGA EXPANSIONER (ej prioriterade, ej påbörjade — en sak i taget, bygg T135/T136 färdigt först)

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T137 | Arvsfördelningslogik i bouppteckningsmodulen (utökar T126): lägg till särkullbarns rätt till direkt arvslott (med möjlighet till arvsavstående enligt 3 kap 9 § ÄB), laglottsberäkning vid testamente (halva legala arvslotten), sambo-bodelning (endast samboegendom, inte hela boet). | 2026-07-18 | Fas 12 | Session | 🟢 | Dev | ☐ |
| T138 | Arvskiftesavtal som dokumentgenerator — idag finns bara arvskifte-guide.html (informationstext), inget genererbart avtal. Bygg i samma stil som befintliga brev (fullmakt, F-skatt etc): tillgångar, fördelning mellan delägare, signaturfält. Bygg efter T137 är klar. | 2026-07-18 | Fas 12 | Session | 🟢 | Dev | ☐ |
| T139 | Brev till hyresvärd (uppsägning hyresrätt vid dödsfall) — guide finns (tomma-dodsbo.html), inget brev. | 2026-07-18 | Fas 12 | Session | 🟢 | Content | ☐ |
| T140 | Brev till Pensionsmyndigheten för efterlevandepension — guide finns (efterlevandepension.html), inget brev. | 2026-07-18 | Fas 12 | Session | 🟢 | Content | ☐ |
| T141 | ⚠️ Delad länk mellan dödsbodelägare — KONFLIKT MED T124: delningsfunktionen skrotades medvetet 2026-05-30 ("Onboarding 6→4 steg", ~1090 rader kod borttagna). Bygg INTE utan ett nytt uttryckligt beslut som river upp T124. Om det ändå prioriteras: lös utan central serverlagring av känslig data (kryptera state i URL eller motsvarande), inte samma modell som skrotades. | 2026-07-18 | Fas 12 | Session | 🟢 | Dev | ☐ |
| T142 | Digitalt arv-modul (sociala medier, Google, Apple) — FAQ finns redan på startsidan, ingen guidad sektion eller brevmallar per plattform. | 2026-07-18 | Fas 12 | Session | 🟢 | Content | ☐ |

---

# 🧭 STRATEGISESSION — 2026-08-11

💡 Extern research (Gemini-marknadsanalys, digitalisering av dödsbohantering SE/UK/US) destillerad och mappad mot befintlig arkitektur. Fullständigt underlag: `research/dodsbo-marknadsanalys-2026-08.md`.

- Tre arkitektoniska byggstenar Efterplan saknar mot de vassaste internationella aktörerna (Settld, Empathy): (1) BankID-flerpartssignering av dödsbofullmakt kopplad till dödsfallsintyg, (2) PSD2 Open Banking-skanning som auto-upptäcker avtal ur transaktionshistorik, (3) orkestrering i tre kanaler (API / säker e-post / print-on-demand) mot leverantörer.
- **Beslut:** Gemini-visionen tas in som **research-tickets (T149–T153)** i Fas 14, inte byggtickets. Inget byggs förrän underlag finns OCH bolaget är registrerat (T003/T004 fortfarande ☐ — blockerande förutsättning för seriösa bank-/försäkringssamtal).
- **Beslut:** T135 (deadline-motor) kvarstår som näst-på-tur, oförändrat. Matchar delvis Gemini Fas 2:s "regelmotor" (uppsägningstid räknas från dödsdatum, ej aviseringsdatum) — bekräftar att prioriteringen redan var rätt, inget dubbelarbete.
- **Beslut:** Ny funktion **Dokumentcentral** (T143–T148, Fas 13) läggs in mellan T135 och T136 — "en sak i taget" gäller fortsatt: T135 → Dokumentcentral → T136.
- **Beslut (2026-08-11, efter avvägning):** T145 byggs som LLM-baserad kategorisering, inte som en deterministisk OCR+regelmotor. Övervägdes: en fast regelmotor (textavläsning + nyckelordslista mot kända avsändare, samma mönster som deadline-motorn) höll principen 100% intakt men missar allt den inte har i listan — och dödsbon får dokument från ett brett spann av banker/myndigheter/försäkringsbolag/hyresvärdar/föreningar, så fallback till manuell hantering hade blivit vanlig. Överordnad princip: **minsta möjliga tid- och energiåtgång för användaren** väger tyngre än principiell renhet här — LLM-varianten klarar fler dokumenttyper direkt med mindre manuellt jobb för en redan pressad anhörig. `readme.md` uppdaterad: principen omformulerad till att gälla kärnflödet (checklista/prioritering/deadlines förblir deterministiska), assisterande AI tillåten där den mätbart minskar användarens tidsåtgång.

---

# 📄 FAS 13 — DOKUMENTCENTRAL
💡 Fota dokument från myndigheter/banker, AI kategoriserar och namnger, flagga som viktig/onödig/mellan. Byggs efter T135, före T136.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T143 | Datamodell + ny UI-yta för dokument (flik/sektion i plan-skärmen) — fält: kategori, namn, flagga, datum, källa. Byggd: ny flik "🗂 Arkiv" (`index.html`, `tabcontent-arkiv`), `state.documents` i app.js. Kategori visas som tydlig dekal (`.arkiv-category-badge`) ovanför namnet — syns utan att klicka in på dokumentet. Flikens introtext förklarar även *varför* (slippa leta upp papper igen längre fram), inte bara vad/hur. | 2026-08-11 | Fas 13 | Session | 🔴 | Design | ✔ |
| T144 | Fotografera/ladda upp dokument — återanvänd kamera/QR-scan-mönstret från T067 (räkningar, app.js). Byggd: `handleDocumentScan()` återanvänder `compressBillImage()` rakt av, samma `capture="environment"`-input-mönster. | 2026-08-11 | Fas 13 | Session | 🟠 | Dev | ✔ |
| T145 | AI-kategorisering: ny serverless-funktion `api/categorize-document.js` som skickar bilden till en vision-kapabel LLM och föreslår kategori + namn åt användaren. Byggd (Claude Haiku vision via `fetch`, ingen ny dependency). **Kräver `ANTHROPIC_API_KEY` i Vercel env — inte satt än, Owner-åtgärd** (se `.env.example`). Testat lokalt utan nyckeln: fallback till manuell kategori "Övrigt" fungerar felfritt, ingen spärr. | 2026-08-11 | Fas 13 | Session | 🟠 | Dev | ⧖ |
| T146 | 3-lägesflagga (viktig / onödig / mellan) + filter/sortering på flagga. Byggd och testad (filter, flagg-toggle, avmarkering vid dubbelklick). | 2026-08-11 | Fas 13 | Session | 🟡 | Dev | ✔ |
| T146b | Dubblettdetektering: enkel deterministisk hash av bildinnehållet (`hashImageData()`) upptäcker om exakt samma foto laddas upp igen. Vid träff: `confirm()`-dialog innan tillägg ("Lägga till ändå?"). Oavsett svar flaggas alla dokument som delar samma hash med en gul "⚠ Möjlig dubblett"-dekal i listan, omräknat vid varje render (så det stämmer även efter radering). Testat: skip-vägen, lägg-till-ändå-vägen, och att dekalen försvinner när ena dubbletten raderas. | 2026-08-11 | Fas 13 | Session | 🟡 | Dev | ✔ |
| T147 | Lagring: localStorage för alla, Supabase Storage-synk för inloggade/premium (återanvänder auth från T051–T053). **Ej byggd denna omgång** — localStorage-delen klar (`efterplan_documents`, testad över reload), Supabase Storage-synken är en egen, större integration (ny bucket + policies) som medvetet sparades till en egen körning. | 2026-08-11 | Fas 13 | Session | 🟡 | Dev | ☐ |
| T148 | Radering/retention-policy + GDPR-notis för känsliga dokument. Byggd som info + manuell radering (samma mönster som integritetssektionen på landningssidan) — **inte** automatisk utgångsdatum-radering, det riskerar att ta bort dokument användaren fortfarande behöver. | 2026-08-11 | Fas 13 | Session | 🟠 | Legal | ✔ |

---

# 🔭 FAS 14 — RESEARCH: NÄSTA GENERATIONS DÖDSBOTJÄNST
💡 Rena research-tickets ur Gemini-analysen. Inget byggåtagande — underlag måste finnas OCH bolaget vara registrerat (T003/T004) innan en eventuell Fas 15+ kan planeras.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T149 | BankID-anslutning: jämför återförsäljare (Scrive, Signicat, Freja eID) vs. direktavtal med Finansiell ID-Teknik BID AB — krav, kostnad, ledtid för flerpartssignering av dödsbofullmakt | 2026-08-11 | Fas 14 | Gemini-analys | 🟡 | Research | ☐ |
| T150 | Finns ett API för Skatteverkets dödsfallsintyg med släktutredning, eller kräver det manuell blankett/Mina sidor idag? | 2026-08-11 | Fas 14 | Gemini-analys | 🟡 | Research | ☐ |
| T151 | PSD2/Open Banking-leverantörer i Sverige (Tink/Visa, Enable Banking, Neonomics) — pris, licenskrav (AISP via TPP vs. eget FI-tillstånd), GDPR-implikationer av att läsa 12 månaders transaktionshistorik för en avliden persons konto | 2026-08-11 | Fas 14 | Gemini-analys | 🟡 | Research | ☐ |
| T152 | Standardiserad dödsbofullmakt — kartlägg krav hos Nordea/SEB/Swedbank/Handelsbanken/Länsförsäkringar Bank, bedöm om ett gemensamt digitalt format är realistiskt | 2026-08-11 | Fas 14 | Gemini-analys | 🟢 | Research | ☐ |
| T153 | B2B2C-distribution — sondera intresse hos 2–3 svenska livförsäkringsbolag (Folksam, Skandia, Länsförsäkringar) eller fackförbund för en gratis mervärdestjänst vid utbetalning. Kräver registrerat bolag (T003/T004) innan seriösa samtal | 2026-08-11 | Fas 14 | Gemini-analys | 🟢 | Partnership | ☐ |

---

# 🎨 STRATEGISESSION — 2026-08-11 (design)

💡 Design-direktiv delat av Owner ("jag vill bort från generic ai") + tre inspirationsbilder: en lavendelfärgad AI-agent-sajt (mjuk gradient-hero), en grön växtsajt (uttryckligen ett exempel att **undvika** — för lekfullt/consumer för dödsbohantering), och "Aurem"-wellnessappen (mjuka gradient-kort, stat-block "120K+ mindful sessions completed").

- **Inte ett blankt blad:** ett tidigare pass (`style-tokens.css`, "Redesign 2026", live via `index.html:119-120`) har redan flyttat sajten mot varma oklch-toner (sand/sage/terrakotta), Fraunces-serif + IBM Plex Sans, mjuka radier (6–18px) och varma radial-gradients på body. Heron (`index.html:151-164`) har redan empatisk, konkret copy.
- **Kvarstår generiskt:** två kalla blå gradient-kort (`paywall-card`/`preview-cta-card`, `style.css:1937-1940` & `1997-2000`), svarta modal-skuggor (`style.css:1288,1500`), missmatchad bas-`--accent` (navy, `style.css:37`, bara override:ad av tokens-filen), och **ingen dedikerad feature/trust-sektion** — landningssidan hoppar idag direkt från hero till FAQ.
- **Ärlighetsspärr:** direktivets punkt om "riktiga siffror som trust-signaler" (à la Aurems "120K+") kan inte uppfyllas ärligt — senaste veckorapporten visar 16 sessioner/15 users den senaste veckan, `plan_generated` i enstaka siffror totalt. En påhittad stat vore vilseledande. Se T156.

---

# 🎨 FAS 15 — DESIGN: BORT FRÅN GENERIC AI-LOOK
💡 Ordning: T154 (snabb konsekvensstädning) → T155+T156 tillsammans (ny sektion, ärlig) → T157 (polering).

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T154 | Konsekvenspass: värm upp de två kvarvarande kalla blå gradient-korten (`paywall-card`/`preview-cta-card`, `style.css:1937-1940`, `1997-2000`) + svarta modal-skuggor (`style.css:1288,1500`) + rätta bas-`--accent` (`style.css:37`, navy) så den matchar `style-tokens.css`s sage-värde istället för att bara override:as | 2026-08-11 | Fas 15 | Design-direktiv | 🟠 | Dev | ☐ |
| T155 | Ny feature-/"hur det fungerar"-sektion på landningssidan mellan hero och FAQ — finns inte idag. Bygg med samma mjuka gradient-kort-språk som redan finns på body (`style.css:118-120`, `style-tokens.css:56-58`), inspirerat av Aurem-referensens kortbehandling, men med äkta steg ur bouppteckningsflödet — inte lorem ipsum | 2026-08-11 | Fas 15 | Design-direktiv | 🟠 | Design/Dev | ☐ |
| T156 | Inga fabricerade siffror: nuvarande trafik ger inget ärligt "120K+"-liknande tal. Använd kvalitativa trust-signaler (integritetsbadges finns redan, `index.html:237-242`) tills riktiga volymer finns, eller en annan ärlig siffra (gratis/0 kr, en tydligt märkt tidsuppskattning — inte ett påstått mätvärde) | 2026-08-11 | Fas 15 | Design-direktiv | 🟡 | Content/Legal | ☐ |
| T157 | Hero-polerpass: hero är redan i linje med riktningen (Fraunces, varm palett, mjuk radie, empatisk copy) — undersök om samma gradient-kort-behandling som T155 kan ge visuell enhetlighet mellan hero och den nya sektionen | 2026-08-11 | Fas 15 | Design-direktiv | 🟢 | Design | ☐ |

---

# 💳 FAS 16 — QA: BETALNINGSFLÖDET
💡 Ersätter/konkretiserar T032 ("Test full purchase flow", ⧖ sedan tidigare) — pengar ska aldrig vara det som gör att förtroendet brister.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T158 | Verifiera att betalningsfunktionen är 100 % fungerande och korrekt — hela flödet end-to-end, inte bara enskilda smoke-tester: (1) **Checkout** — `api/create-checkout.js`, riktig Stripe Checkout-session i test-läge, rätt pris/valuta/locale; (2) **Webhook** — `api/stripe-webhook.js`, signaturverifiering med aktuell `STRIPE_WEBHOOK_SECRET` (roterad efter T115-läckan — bekräfta att nuvarande secret i Vercel faktiskt matchar Stripe Dashboard), att `purchases`-raden skapas korrekt i Supabase; (3) **Felfall** — avbruten betalning (`cancel_url`), nekat kort, dubbel-webhook (idempotens — samma event levereras två gånger ska inte ge dubbelt premium eller dubbel rad), webhook som kommer innan `verify-checkout.js` hinner köras klientsidan; (4) **Kvitton** — Stripes automatiska kvitto går ut, rätt belopp/moms/avsändare; (5) **`check-premium.js`** — premium låses upp korrekt både via session-redirect och vid inloggning på ny enhet (Supabase-synk). Kör i Stripe test-läge med testkort (4242…, samt ett kort som nekas) innan ev. skarpt test. | 2026-08-11 | Fas 16 | Owner | 🔴 | QA | ☐ |

---

# 🔎 FAS 17 — AUDIT-FYND (2026-08-11)
💡 Från `/audit`-körning mot https://efterplan.se (canvas-upplöst kontrastmätning, verifierad live — inga false positives). Fullständig rapport i sessionen, sammanfattad här. T154 (kalla gradient-kort/svarta skuggor) redan trackad sen tidigare, dupliceras inte.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T159 | `--accent` (sage) klarar inte WCAG AA (4.5:1) som textfärg i något vanligt läge: på `--paper` 3.60:1, på `--paper-card` 3.82:1, på `--accent-light` (badges/pills) 3.21:1, `--ember`/`--ember-tn` 3.19:1, vit text på `--accent`-knapp (t.ex. "Börja här") 4.16:1. 56 träffar på `color: var(--accent)` i style.css. Token-nivå-fix (mörka `--accent` något, eller inför separat `--accent-text`) löser troligen alla ställen på en gång istället för 56 enskilda regler. | 2026-08-11 | Fas 17 | Audit | 🟠 | A11y | ☐ |
| T160 | Nav-länkar under tumstorlek på mobil (375px): "Om" 22×22px, "Integritet" 62×22px, "Mitt konto" 65×22px — fristående nav-element, kvalificerar inte för WCAG 2.5.8:s undantag för länkar i löptext. Öka klickyta (padding) till minst 24×24px, helst 44×44. | 2026-08-11 | Fas 17 | Audit | 🟡 | A11y | ☐ |
| T161 | Svagare fokusindikator på tre textfält (`.ob-text-input`, `.text-input`, `.arkiv-name`) — `outline: none` ersatt bara med `border-color`-ändring, ingen outline/skugga. Avviker från den annars starka globala `:focus-visible`-regeln (3px outline, style.css:106) som resten av sajten får gratis. Gör konsekvent. | 2026-08-11 | Fas 17 | Audit | 🟢 | A11y | ☐ |
| T162 | Rate-limit på `api/categorize-document.js` — endpointen är öppen för alla besökare utan inloggning och drar riktiga Anthropic-tokens (Haiku 4.5, ~$0,003–0,004/anrop) från Owners konto per fotograferat dokument. Vid dagens trafik (16 sessioner/vecka) inte akut, men spam/missbruk kan dra kostnad obegränsat eftersom nyckeln är delad server-side mellan alla användare. Lägg till enkel rate-limit (t.ex. per IP via Vercel KV/Upstash, eller ett dagligt tak) innan trafiken växer. | 2026-08-11 | Fas 13 | Session | 🟡 | Infra | ☐ |

---

# 🛠️ FAS 18 — SKARP VERIFIERING AV BETALNINGSFLÖDET (2026-08-12)
💡 Kopplat till T158. Under en session kopplades Vercel-, Stripe- och Supabase-CLI direkt (device-/token-auth) för att slippa gissa sig fram i webbgränssnitt — rekommenderas för liknande felsökning framöver. Tre separata, tidigare okända produktionsfel hittades och åtgärdades i skarp drift:
1. **Pris-inkonsekvens** — UI visade 149 kr trots att T033 redan bytt till 49 kr. Fixat i `app.js`/`index.html`/GA4-dashboard.
2. **Stripe helt ouppsatt för Efterplan** — `STRIPE_PRICE_ID` innehöll av misstag en gammal secret key, ingen Efterplan-produkt fanns i Stripe, `STRIPE_SECRET_KEY` var en utgången lokal Stripe CLI-sandlådenyckel (`sk_test_...FcAIuM`, utgick 2026-07-18), och ingen webhook-destination fanns för `efterplan.se` överhuvudtaget. Ny produkt/pris (49 kr engång), ny begränsad live-nyckel (endast Checkout Sessions-skriv) och ny webhook-destination skapades. `/api/create-checkout` → `/api/stripe-webhook` verifierat end-to-end med en signerad testhändelse (200, `purchases`-rad skapad).
3. **Supabase-projektet pausat** — se T163.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T163 | Supabase-projektet (`vjupkemzpnrahdsljenl`) hade auto-pausats av inaktivitet (gratisnivå) och slutade svara på DNS (NXDOMAIN) — slog tyst ut ALLT som går via databasen (inloggning, sparade planer, köphistorik), inte bara webhooken. Manuellt återställt 2026-08-12, ingen dataförlust upptäckt. Överväg (a) uppgradera till betald Supabase-nivå (ingen auto-pause), eller (b) ett schemalagt keep-alive-anrop (t.ex. GitHub Actions cron mot ett lätt API-anrop var 6:e dag) som håller projektet aktivt, så detta inte händer tyst igen. Löst: `.github/workflows/supabase-keepalive.yml` — pingar `users`-tabellen (måndag+torsdag, 3–4 dagars marginal under 7-dagarsgränsen) via `SUPABASE_SECRET_KEY`, failar synligt i Actions-fliken om nyckeln saknas eller anropet misslyckas. | 2026-08-12 | Fas 18 | Session | 🔴 | Infra | ✔ |
| T164 | T158 kvarstår delvis — checkout, webhook-mottagning och statuskontroll är verifierat i skarp drift, men felfallen är inte testade: avbruten betalning, nekat kort, dubbel-webhook (idempotens), webhook som kommer innan `verify-checkout.js` hunnit köras klientsidan, Stripes automatiska kvitto, samt `check-premium.js`-synk vid inloggning på ny enhet. | 2026-08-12 | Fas 18 | Session | 🟡 | QA | ☐ |
