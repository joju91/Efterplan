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
| T127 | Engelska "deceased" i barnpension_ansokan-beskrivning. Åtgärdat 2026-08-13 (hittat i samband med T192-arbetet): bytt till "den avlidne hade". `app.js`. | 2026-06-01 | Fas 12 | Veckorapport | 🟠 | Content | ✔ |
| T128 | Sitemap lastmod stale — sitemap.xml visar `lastmod>2026-05-04` för flertalet sidor (bouppteckning-guide.html, vad-gora-nar-nagon-dor.html, arvskifte-guide.html m.fl.) men dessa sidor har uppdaterats i commits sedan dess. Uppdatera lastmod-datum per `git log --format="%ai" -- <fil>` för respektive URL. Fil: sitemap.xml. Åtgärdat: samtliga 33 lastmod-datum omräknade från faktiskt `git log`-datum per fil. | 2026-06-01 | Fas 12 | Veckorapport | 🟠 | SEO | ✔ |
| T129 | share-modal.html överblivet spöke — T124 dokumenterade att share-modal skrotades (commit 59ddcde) men filen share-modal.html (183 rader) finns kvar i repot. Inga referenser i index.html eller app.js. Ta bort filen. Fil: share-modal.html. Åtgärdat: filen borttagen (bekräftat inga inbäddningar, bara omnämnanden i historiska rapporter/roadmap). | 2026-06-01 | Fas 12 | Veckorapport | 🟡 | Dev | ✔ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-06-08

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T130 | package-lock.json saknas i repo-root: `npm outdated` visar @supabase/supabase-js och stripe som MISSING. Kör `npm install` i repo-root och committa package-lock.json. ga4-dashboard/ har sin egen package-lock.json och påverkas inte. Fil: package.json (root). Åtgärdat: `npm install --package-lock-only`, committad, 0 sårbarheter. | 2026-06-08 | Fas 12 | Veckorapport | 🟡 | Dev | ✔ |
| T131 | HTTP 403 vid automatisk live-check: efterplan.se svarar 403 Forbidden för alla automatiserade requests (WebFetch + Python urllib). Trolig orsak: Vercel Bot Protection. Verifiera att UptimeRobot (T111) fortfarande når sajten och justera Bot Protection-nivå i Vercel Dashboard om nödvändigt. Fil: Vercel Dashboard → Security. | 2026-06-08 | Fas 12 | Veckorapport | 🟠 | Infra | ☐ |
| T132 | weekly-report.yml committar inte roadmap.md: Actions-workflow (`.github/workflows/weekly-report.yml`) gör `git add "$FILE"` för enbart veckorapporten — roadmap-uppdateringar och GitHub Issues-skapande saknas i det automatiserade flödet. Utöka weekly-report.mjs eller lägg till steg i yml för att inkludera roadmap.md vid ändringar. Fil: .github/workflows/weekly-report.yml. | 2026-06-08 | Fas 12 | Veckorapport | 🟡 | Dev | ☐ |

---

# 🔍 VECKORAPPORT-TICKETS — 2026-06-15

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T133 | bouppteckning_saved analytics saknas — `boppSave()` (app.js:2286) kallar inte `track()`. Bouppteckning-formuläret (T126, shipad 2026-05-30) genererar inga GA4-events, dvs. vi kan inte mäta hur många användare aktiverar funktionen. Lägg till `track('bouppteckning_saved', { delbagare: boppData.delbagare.length, tillgangar: boppData.tillgangar.length, skulder: boppData.skulder.length })` i `boppSave()`. Fil: app.js:2286. Åtgärdat, med justering: `boppSave()` triggas per tangenttryck (oninput), så eventet skickas en gång per session (guard-flagga) istället för på varje anrop — annars hade det spammat GA4. | 2026-06-15 | Fas 12 | Veckorapport | 🟠 | Analytics | ✔ |
| T134 | ga4-dashboard/public/index.html saknar meta description — `grep -rL 'meta name="description"'` flaggar dashboardens index-sida. Lägg till `<meta name="description" content="Efterplan GA4-dashboard — intern analys">` i `<head>`. Fil: ga4-dashboard/public/index.html. | 2026-06-15 | Fas 12 | Veckorapport | 🟡 | SEO | ✔ |

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
| T149 | BankID-anslutning: jämför återförsäljare (Scrive, Signicat, Freja eID) vs. direktavtal med Finansiell ID-Teknik BID AB — krav, kostnad, ledtid för flerpartssignering av dödsbofullmakt. **Slutsats:** vid dagens trafik (16 sessioner/vecka, långt under 50 000 autentiseringar/mån) är återförsäljare rätt väg, inte direktavtal — Finansiell ID-Teknik kräver eget godkännande (2–6 veckors handläggning + tekniska/säkerhetskrav) och lönar sig bara vid höga volymer (ingen mellanhandsavgift men högre implementeringskostnad + eget certifikatansvar). Scrive/Signicat/Freja eID är alla abonnemangsprissatta efter volym/användare, individuellt förhandlade — inget listpris för flerpartssignering specifikt, kräver offertförfrågan. Referens: BankID-integration generellt 20 000–100 000 kr engångskostnad + 300–2 500 kr/mån + 0,50–2,50 kr/autentisering hos en BankID-as-a-Service-leverantör. Nästa steg om detta blir aktuellt: offertförfrågan hos Scrive + Freja eID specifikt för flerpartssignering av fullmakt. | 2026-08-11 | Fas 14 | Gemini-analys | 🟡 | Research | ✔ |
| T150 | Finns ett API för Skatteverkets dödsfallsintyg med släktutredning, eller kräver det manuell blankett/Mina sidor idag? **Slutsats:** inget offentligt/allmänt API. Skatteverket har en begränsad e-tjänst för direktbeställning, men den är förbehållen namngivna aktörskategorier — begravningsbyråer, banker, försäkringsbolag, pensionsbolag och krematorier — och kräver att företagets firmatecknare gör en anmälan till Skatteverket för åtkomst. Efterplan (konsumentriktad, ingen av dessa kategorier) skulle alltså inte kvalificera för e-tjänsten även om den ville; privatpersoner/dödsbodelägare beställer även fortsatt via blankett eller Mina sidor. Ingen kodbar integration möjlig utan att bli en registrerad aktör i en av de tillåtna kategorierna. | 2026-08-11 | Fas 14 | Gemini-analys | 🟡 | Research | ✔ |
| T151 | PSD2/Open Banking-leverantörer i Sverige (Tink/Visa, Enable Banking, Neonomics) — pris, licenskrav (AISP via TPP vs. eget FI-tillstånd), GDPR-implikationer av att läsa 12 månaders transaktionshistorik för en avliden persons konto. **Slutsats:** eget AISP-tillstånd hos Finansinspektionen kostar ~138 000 kr i ansökningsavgift plus löpande regulatoriska krav (kapitalkrav, ansvarsförsäkring) — inte rimligt för Efterplans skala. Rätt väg är att gå via en redan licensierad TPP-aggregator (Neonomics: AISP/PISP-licens passporterad från Norge, 98+ bankkopplingar via en API; Tink, numera del av Visa, motsvarande men främst riktat mot större fintech-kunder) — prissättning för båda är offert-baserad, inget listpris hittat. **Största hindret är dock inte pris utan juridiskt**: PSD2/AISP-samtycke förutsätter att kontohavaren själv (den levande) godkänner delning — det finns inget etablerat flöde för att en dödsbodelägare ska kunna bevilja AISP-samtycke å en avliden persons vägnar, det är en separat, oprövad GDPR/dödsbo-juridisk fråga som bör juridikgranskas innan någon teknisk integration påbörjas. | 2026-08-11 | Fas 14 | Gemini-analys | 🟡 | Research | ✔ |
| T152 | Standardiserad dödsbofullmakt — kartlägg krav hos Nordea/SEB/Swedbank/Handelsbanken/Länsförsäkringar Bank, bedöm om ett gemensamt digitalt format är realistiskt. **Slutsats:** alla fem storbanker tillhandahåller egna fullmaktsblanketter för dödsbon (Swedbank och Nordea har publika PDF:er, övriga liknande via kontor/webb), innehållsmässigt ofta lika (kryssrutor för vilka åtgärder fullmakten ska täcka) men **formatmässigt separata och icke-utbytbara** — ingen bank tycks acceptera en annan banks blankett. Inget tecken på en pågående branschgemensam standardiseringsinitiativ. Ett gemensamt digitalt format är alltså inte realistiskt att bygga ensidigt (Efterplan kan inte tvinga fram bankaccept) — mest realistiska vägen är att generera respektive banks EGEN blankett ifylld med samma grunddata (namn, personnr, delägare), inte en universell ersättare. Matchar T138 (arvskiftesavtal-generator) bättre än ett nytt gemensamt format. | 2026-08-11 | Fas 14 | Gemini-analys | 🟢 | Research | ✔ |
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
| T154 | Konsekvenspass: värmde upp `paywall-card`/`preview-cta-card` (var kalla blågrå #C8D6E5/#EDF2F7, nu `--rule-strong`-kant + varm gradient mot `--accent-light`/`--ember-tn`) + svarta modal-skuggor (`rgba(0,0,0,…)` → varm `rgba(60,50,30,…)`, style.css moderna radnr efter tidigare edits). Bas-`--accent` var redan `--ink-teal` (inte navy) sedan T159 (Fas 17) — ingen ändring behövdes där. | 2026-08-11 | Fas 15 | Design-direktiv | 🟠 | Dev | ✔ |
| T155 | Ny "Så här går det till"-sektion på index.html mellan hero och FAQ, 4 kort med äkta steg (svara på frågor → personlig checklista → färdigskrivna brev → bocka av i din takt), samma mjuka gradient-kort-språk (alternerande `--accent-light`/`--ember-tn` mot `--paper-card`) som paywall-card. Verifierat i browser: 4 kort renderar i grid med rätt gradienter. | 2026-08-11 | Fas 15 | Design-direktiv | 🟠 | Design/Dev | ✔ |
| T156 | Inga fabricerade siffror: verifierat att inga fejkade volym-tal ("120K+"-typ) finns någonstans på sajten (grep, inga träffar). Befintliga kvalitativa trust-badges + den nya ärliga gratis/49-kr-raden (T169) täcker behovet — ingen ny siffra tillagd. | 2026-08-11 | Fas 15 | Design-direktiv | 🟡 | Content/Legal | ✔ |
| T157 | Hero-polerpass: gav hero-CTA:ns pris-rad (`landing-note--pricing`, tillagd i T169) samma mjuka gradient-kort-behandling som T155:s kort — visuell enhetlighet mellan hero och den nya sektionen utan att röra hero-headline/copy. | 2026-08-11 | Fas 15 | Design-direktiv | 🟢 | Design | ✔ |

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
| T159 | `--accent` (sage) klarar inte WCAG AA (4.5:1) som textfärg i något vanligt läge: på `--paper` 3.60:1, på `--paper-card` 3.82:1, på `--accent-light` (badges/pills) 3.21:1, `--ember`/`--ember-tn` 3.19:1, vit text på `--accent`-knapp (t.ex. "Börja här") 4.16:1. 56 träffar på `color: var(--accent)` i style.css. Token-nivå-fix (mörka `--accent` något, eller inför separat `--accent-text`) löser troligen alla ställen på en gång istället för 56 enskilda regler. Redan löst av Fas 15–18-omfärgningen: `--accent` är numera djup ink-teal `#1F3A4E` (inte längre sage) — omräknat, `--accent` på `--paper` ger 10.6:1, vit text på `--accent`-knapp 11.9:1, ruvigt över AAA. Ingen ytterligare ändring behövs. | 2026-08-11 | Fas 17 | Audit | 🟠 | A11y | ✔ |
| T160 | Nav-länkar under tumstorlek på mobil (375px): "Om" 22×22px, "Integritet" 62×22px, "Mitt konto" 65×22px — fristående nav-element, kvalificerar inte för WCAG 2.5.8:s undantag för länkar i löptext. Öka klickyta (padding) till minst 24×24px, helst 44×44. Åtgärdat: `.nav-text-link` fick padding 13px 8px + motsvarande negativ margin (håller kvar visuell position/spacing), ~44px klickyta. | 2026-08-11 | Fas 17 | Audit | 🟡 | A11y | ✔ |
| T161 | Svagare fokusindikator på tre textfält (`.ob-text-input`, `.text-input`, `.arkiv-name`) — `outline: none` ersatt bara med `border-color`-ändring, ingen outline/skugga. Avviker från den annars starka globala `:focus-visible`-regeln (3px outline, style.css:106) som resten av sajten får gratis. Gör konsekvent. Åtgärdat: `outline: none` borttaget från alla tre — globala `:focus-visible`-regeln (3px outline) syns nu igen, utöver deras egna border/box-shadow-highlights. | 2026-08-11 | Fas 17 | Audit | 🟢 | A11y | ✔ |
| T162 | Rate-limit på `api/categorize-document.js` — endpointen är öppen för alla besökare utan inloggning och drar riktiga Anthropic-tokens (Haiku 4.5, ~$0,003–0,004/anrop) från Owners konto per fotograferat dokument. Vid dagens trafik (16 sessioner/vecka) inte akut, men spam/missbruk kan dra kostnad obegränsat eftersom nyckeln är delad server-side mellan alla användare. Lägg till enkel rate-limit (t.ex. per IP via Vercel KV/Upstash, eller ett dagligt tak) innan trafiken växer. Löst utan ny infra: dagligt tak (30/IP/dygn) backat av en ny `rate_limits`-tabell + `rate_limit_increment()`-funktion i befintliga Supabase-projektet (samma secret som T163), fail-open om kontrollen själv failar. | 2026-08-11 | Fas 13 | Session | 🟡 | Infra | ✔ |

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

---

# 🔎 FAS 19 — CHATGPT-AUDIT AV EFTERPLAN.SE (2026-08-12)
💡 Extern audit av efterplan.se från ChatGPT (juridisk/faktamässig precision, UX-copy, SEO, förtroendesignaler). Konkreta sakpåståenden verifierade mot faktisk kod/innehåll i repot innan de loggades — ChatGPT kunde bara granska sajten utifrån och flaggade själv flera saker som overifierbara. T165 visade sig vara allvarligare än ChatGPT kunde bekräfta: verifierat direkt mot `api/categorize-document.js` (testad live tidigare i denna session), inte bara antaget.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T165 | `index.html:924` — "Dokumenten lämnar aldrig din enhet — ingen AI-tjänst sparar bilden" var konkret felaktigt. Åtgärdat: arkiv-privacy-note skriver nu korrekt att bilden skickas till Anthropics API vid AI-kategorisering/förklaring (utan permanent lagring där), medan dokumenten själva bara lagras lokalt. | 2026-08-12 | Fas 19 | ChatGPT-audit | 🔴 | Content | ✔ |
| T166 | `index.html:173`, `:178` + samma formulering i `checklista-dodsbo.html`, `dodsbo-checklista-7-dagar.html`, `vad-gora-nar-nagon-dor.html` — "begravningsbyrån ... sköter registreringen hos Skatteverket" var missvisande. Åtgärdat i alla 5 ställen: bytt till "hjälper till med det praktiska kring begravningen och guidar dig vidare". | 2026-08-12 | Fas 19 | ChatGPT-audit | 🔴 | Content | ✔ |
| T167 | `index.html:209` — "Efterlevandepension kan utbetalas till make, maka, sambo och barn under 20 år" var för brett. Åtgärdat: omskrivet till "Efterlevande make, maka eller i vissa fall sambo kan ha rätt till omställningspension... Barn kan ha rätt till barnpension och efterlevandestöd." `efterlevandepension.html` rättad separat i T180. | 2026-08-12 | Fas 19 | ChatGPT-audit | 🔴 | Content | ✔ |
| T168 | `index.html:157` — "Inga formulär, ingen registrering" överdrev. Åtgärdat: bytt till "Ingen registrering krävs för att komma igång". | 2026-08-12 | Fas 19 | ChatGPT-audit | 🟠 | Content | ✔ |
| T169 | Förtydliga gräns mellan gratis och betalt (49 kr) tidigare i flödet. Åtgärdat: ny rad under hero-CTA på index.html — "Gratis: checklista, plan, PDF, bouppteckningsöversikt / 49 kr engångsbetalning: obegränsat med brev — fullmakt, dödsannons och mer" — synlig innan onboarding startas. | 2026-08-12 | Fas 19 | ChatGPT-audit | 🟠 | Conversion | ✔ |
| T170 | Positionera Efterplan tydligare mot Efterlevandeguiden/myndigheterna. Åtgärdat: ny mening i "Om Efterplan"-sektionen på index.html som äger "myndigheterna säger vad som gäller, Efterplan hjälper dig göra det". | 2026-08-12 | Fas 19 | ChatGPT-audit | 🟡 | Content | ✔ |
| T171 | SEO-guidesidorna saknade påstods en enhetlig CTA tillbaka till produkten. Verifierat: alla 31 guide-/SEO-sidor har redan en `seo-cta`-ruta med länk till produkten i slutet av artikeln (om än inte identisk ordalydelse på alla) — ingen ändring behövdes. | 2026-08-12 | Fas 19 | ChatGPT-audit | 🟡 | SEO | ✔ |
| T172 | Audit-item om cache/gamla versioner (149 kr, 6 onboarding-steg i äldre crawl). Verifierat löst: T128 (sitemap lastmod) och prisfixarna (T032/T033, Fas 18) täcker detta — priset visar 49 kr konsekvent i nuvarande kod. | 2026-08-12 | Fas 19 | ChatGPT-audit | 🟢 | Infra | ✔ |
| T173 | `index.html:232-243` (`#section-integritet`) var inaktuell för inloggade användare. Åtgärdat: texten skiljer nu tydligt mellan lokal-only (ej inloggad — ingenting skickas till server) och synkat till Supabase (inloggad, inklusive personnummer), plus att AI-kategorisering/förklaring skickar bilden till Anthropics API. | 2026-08-12 | Fas 19 | Session (delnings-research) | 🔴 | Content | ✔ |

---

# 🧩 FAS 20 — TRE NYA ANVÄNDARFUNKTIONER (2026-08-12)
💡 Brainstorm av vad de nykopplade API:erna (Anthropic, Supabase) kunde användas till för att förbättra saker för användarna, inte bara utvecklingsflödet. Sex idéer föreslogs, ägaren gallrade bort två (fel motiverade), godkände fyra. Tre av de fyra byggdes och verifierades live denna session; delning + deadline-mejl designades klart (tre bakgrundsagenter) men sparas till en egen session pga omfattning (ny krypto, två nya databastabeller, ~15 ställen i app.js).

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T174 | Räkningar: dubblettkontroll vid tillägg (OCR-referensnummer + bildhash, samma mönster som redan fanns i Arkiv). Flaggar bland annat om den matchande räkningen redan är markerad betald — det faktiska syftet ("undvika dubbelbetalning"). `app.js` (`findDuplicateBill`, `submitBill`). | 2026-08-12 | Fas 20 | Session | 🟢 | Feature | ✔ |
| T175 | Arkiv: "✨ Förklara detta dokument" — AI-förklaring på vanlig svenska av skannade myndighets-/bank-/försäkringsbrev. Ny `api/explain-document.js` (samma mönster som `categorize-document.js`, 20/dag/IP rate-limit), `explainDocumentAI`/`toggleDocumentExplanation` i `app.js`, cachas per dokument. | 2026-08-12 | Fas 20 | Session | 🟢 | Feature | ✔ |
| T176 | Dokument: avsändaradress + postnummer→ort-uppslag i alla 5 relevanta brevmallar (ej Fullmakt). Nytt bundlat dataset `data/postnummer-se.json` (GeoNames CC BY 4.0, 18 870 poster, helt klientsidan — inget postnummer skickas till någon extern tjänst). Frivilligt, blockerar aldrig brevgenerering. | 2026-08-12 | Fas 20 | Session | 🟢 | Feature | ✔ |
| T177 | Delning (läsbar länk, krypterad klientsidan — ny modell enligt T141, inte den skrotade `share_tokens`-modellen). Byggd och verifierat LIVE 2026-08-13: AES-GCM/Web Crypto i `supabase-client.js` (`createSharedLink`/`resolveSharedLink`), nyckeln lämnar aldrig URL-fragmentet (`#k=...`). `shared_plans`-tabell + `create_shared_plan`/`get_shared_plan_v2`-RPC:er i produktions-Supabase (Owner körde migrationen). Fullständig databas-runda testad mot skarp databas: skapa → hämta → dekryptera → matchar exakt. "🔗 Dela läsbar länk"-knapp + modal i `index.html`, läsbar icke-interaktiv vy vid `?shared=`. Delar bara namn+uppgiftslista, aldrig personnummer. | 2026-08-12 | Fas 20 | Session | 🟡 | Feature | ✔ |
| T178 | Deadline-mejl, insamlingsdelen. Byggd 2026-08-13: samtyckes-checkbox + e-postfält i onboarding steg 3, `api/subscribe-reminder.js` (rate-limitad, samma mönster som categorize-document), `reminder_optins`-tabell skapad i produktions-Supabase (samma migration som T177). Typ (bouppteckning/inlämning vs dödsboanmälan) sätts automatiskt. Insamlingsdelen klar och tabellen finns — **kvarstår:** inget faktiskt mejlutskick byggt, kräver separat val av e-postleverantör + cron, se roadmap T136. | 2026-08-12 | Fas 20 | Session | 🟡 | Feature | ⧖ Insamling klar, utskick kvarstår (T136) |

---

# 🧭 STRATEGISESSION — 2026-08-13

💡 Fyra dokument i `research/` (Bankid.md, dodsbo-audit-2026.md, Lagändringsaudit.md, "Vad Efterplan bör täcka.md") gicks igenom och destillerades. Genomgående princip som styrde varje beslut: **om ett tillägg gör appen mer överväldigande eller naggande blir den redundant — Efterplan ska vara ett hjälpmedel och en lättnad, inte en börda.** Beslut togs fråga för fråga med Owner:

- **Sakfelsrättningar går före allt annat** (ny Fas 21) — väger tyngre än pågående design-/QA-spår eftersom de kan kosta användare pengar (fel skatteberäkning) eller skicka dem in i fel process (fel myndighet).
- **Digital/fysisk-indikator (🟢🟡🔴) byggs** (T192) — men med ett viktigt korrektiv från Owner: kopy:n måste alltid utgå från att det är **den efterlevande/dödsbodelägarens eget BankID** som används, aldrig den avlidnes — BankID spärras automatiskt när Skatteverket registrerar dödsfallet.
- **BankID-flerpartssignering av fullmakter byggs INTE** — matchar redan T149/Fas 14:s slutsats. Ingen ny ticket, beslutet står kvar: vänta tills bolaget är registrerat (T003/T004) och trafiken är större.
- **Tre villkorade mini-tillägg byggs** (T189–T191): dödsboanmälan-fråga, bodelning-påminnelse (triggas av civilstånd gift/sambo — **inte** antal barn, bekräftat med Owner), digital post/Kivra-mening i en befintlig uppgift. Alla tre syns bara när relevanta och landar som enstaka rader, inte nya sektioner.
- **Ingen avslutningskontroll byggs** — varken obligatorisk eller valbar. Owners princip: momentan lättnad är giltig även om något (t.ex. nästa års deklaration) ligger kvar långt fram — appen ska inte riva upp "du är klar, andas ut"-känslan för att påminna om det.
- **Bostad byggs ut till ett strukturerat delflöde, fordon hålls enkelt** (T193) — med en Owner-tillagd twist: en "Anlitar ni mäklare?"-toggle som filtrerar bort mäklarhanterade uppgifter från checklistan. Minskar börda snarare än ökar den.
- **Resten av "Vad Efterplan bör täcka.md" läggs i en bevakningslista** (T194, samma mönster som T137–T142) — försäkringar/pension som egna sektioner, deklaration/skatt som avslutande fas, uppdelning av värdepapper/skulder/barn/fordon i undertyper, arbetsgivare-sektion m.fl. Inget av det löser ett lika akut, konkret problem som dödsboanmälan/bodelning gjorde — risk att bara lägga på mer att läsa utan att bygga nu.

Fullständigt underlag: `research/dodsbo-audit-2026.md`, `research/Lagändringsaudit.md`, `research/Bankid.md`, `research/Vad Efterplan bör täcka.md`.

---

# 🩹 FAS 21 — INNEHÅLLSAUDIT: SAKFEL I GUIDE-SIDORNA
💡 Körs FÖRE Fas 15 (design), Fas 16/18 (betalnings-QA) och Fas 20:s obyggda delar (T177/T178) — sakfel som kan kosta användare pengar eller skicka dem i fel process väger tyngre än det som redan är i rörelse.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T179 | `dodsbo-fastighet.html` påstod en fabricerad "uppstegsprincip" för kapitalvinstskatt på ärvd fastighet. Åtgärdat: ersatt med korrekt kontinuitetsprincip-text + räkneexemplet omräknat med ett historiskt anskaffningsvärde (800 000 kr + 300 000 kr förbättring) istället för dödsdagsvärdet. Se `research/dodsbo-audit-2026.md` punkt 1. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | 🔴 | Content | ✔ |
| T180 | `efterlevandepension.html` sa kategoriskt att sambo inte får omställningspension. Åtgärdat: omskrivet till villkorat "ja, om gemensamt barn (nuvarande/tidigare/väntat) eller tidigare äktenskap/partnerskap" + tillägg om förlängd omställningspension till 18-årsmånaden. (T167, samma sakfel på index.html, kvarstår separat i backlogen.) Se `research/dodsbo-audit-2026.md` punkt 2. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | 🔴 | Content | ✔ |
| T181 | `dodsbo-skulder.html` påstod att Skatteverket gör dödsboanmälan. Åtgärdat i brödtext + FAQ-schema: rättat till kommunens socialtjänst (20 kap. 8 a § ärvdabalken), och "dödsboet avskrivs" ersatt med att det är bouppteckningsplikten som faller bort, inte skulderna. Se `research/dodsbo-audit-2026.md` punkt 3. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | 🔴 | Content | ✔ |
| T182 | `arvskifte-guide.html` och `dodsbo-fastighet.html` angav 1,5 % stämpelskatt på lagfart som standard vid arv. Åtgärdat i båda: 825 kr expeditionsavgift som normalfall, 1,5 % bara vid utlösen ≥85 % av taxeringsvärdet (Lantmäteriet). Se `research/dodsbo-audit-2026.md` punkt 4. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | 🔴 | Content | ✔ |
| T183 | Lagändring 1 juli 2026 (prop. 2025/26:46) saknades i `bouppteckning-guide.html` och `bouppteckning-tidslinje.html`. Åtgärdat: personnummer/samordningsnummer-krav för alla kallade tillagt, bestyrkt kopia-kravet borttaget/förtydligat, ny FAQ-post om att digital inlämning är lagreglerad men Skatteverkets e-tjänst INTE lanserad än. 3-/4-månadersfristerna orörda. Se `research/dodsbo-audit-2026.md` punkt 6 + `research/Lagändringsaudit.md` avsnitt 1–2. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md + Lagändringsaudit.md | 🟠 | Content | ✔ |
| T184 | Terminologibyte "förrättningsmän"→"förrättningspersoner", "bouppgivarens försäkran"→"bouppgivarens bekräftelse". Verifierat via repo-vid grep: termerna förekom inte i produktkoden (bara i research-dokumenten själva) — ingen ändring behövdes. Se `research/Lagändringsaudit.md` avsnitt 3. | 2026-08-13 | Fas 21 | Lagändringsaudit.md | 🟢 | Content | ✔ |
| T185 | `dodsbo-deklaration.html` presenterade 20 %-skattesatsen på näringsinkomst som gällande direkt. Åtgärdat: förklarat att den gäller först från fjärde kalenderåret efter dödsfallsåret, progressiv beskattning innan dess. Se `research/dodsbo-audit-2026.md` punkt 7. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | 🟡 | Content | ✔ |
| T186 | `fullmakt-dodsbo.html` saknade jävssituationen när föräldern till ett minderårigt dödsbodelägande barn själv också är dödsbodelägare. Åtgärdat: tillägg om att kontakta överförmyndaren för särskild förmyndare/god man i det fallet. Föräldrabalken 12 kap. 3 §. Se `research/dodsbo-audit-2026.md` punkt 8. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | 🟡 | Content | ✔ |
| T187 | Deklarationsdatum "senast 2 maj" i `dodsbo-deklaration.html` (2 ställen) och `checklista-dodsbo.html` presenterades som fast. Åtgärdat: förklarar nu helgregeln, med 2026-exemplet (4 maj) explicit. Se `research/dodsbo-audit-2026.md` punkt 9. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | 🟡 | Content | ✔ |
| T188 | Begravningsavgiftens intervall "0,065–0,28 %" (begravningsbyra.html) / "0,0–0,28 %" (vad-kostar-en-begravning.html) gick inte att förena med Kammarkollegiets riksgenomsnitt 0,292 % för 2026 utan en färsk per-kommun-primärkälla. Åtgärdat: begravningsbyra.html skriver nu "varierar per kommun, se din skattsedel"; vad-kostar-en-begravning.html anger riksgenomsnittet 0,292 % + samma hänvisning till skattsedeln istället för ett osäkert intervall. index.html nämnde inget exakt intervall — ingen ändring behövdes där. Se `research/dodsbo-audit-2026.md` punkt 10. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | 🟢 | Content/Research | ✔ |

---

# 🧩 FAS 22 — VILLKORADE MINI-TILLÄGG + DIGITAL-INDIKATOR
💡 Tre nya villkorade tillägg (syns bara när relevanta, landar som enstaka rader/uppgifter — inte nya sektioner) plus en digital/fysisk-etikett på befintliga uppgifter. Källa: `research/Vad Efterplan bör täcka.md` + `research/Bankid.md`, filtrerat genom principen "hjälpmedel, inte börda".

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T189 | Dödsboanmälan-fråga i onboarding. Åtgärdat: ny checkbox "Dödsboets tillgångar är mycket små" i steg 2. Om ikryssad OCH ingen fastighet: `bouppteckning`-uppgiften byts mot ny `dodsboanmalan`-uppgift (kommunens socialtjänst, ~2 mån frist, kontoutdrag 3 mån, hembesök). Fastighet vinner alltid över (verifierat: `litetDodsbo`+`fastighet` behåller bouppteckning). `app.js`, `index.html`. | 2026-08-13 | Fas 22 | Vad Efterplan bör täcka.md | 🟠 | Dev/Content | ✔ |
| T190 | Bodelning-påminnelse. Åtgärdat: ny checkbox "Var gift eller sambo" (civilstånd, inte antal barn) triggar ny `bodelning_paminnelse`-uppgift som förklarar skillnaden gift (giftorättsgods) vs sambo (bara samboegendom). `app.js`, `index.html`. | 2026-08-13 | Fas 22 | Vad Efterplan bör täcka.md | 🟠 | Dev/Content | ✔ |
| T191 | Digital post-mening. Åtgärdat: mening om Kivra/Min myndighetspost tillagd i `nycklar_post`-uppgiften. `app.js`. | 2026-08-13 | Fas 22 | Vad Efterplan bör täcka.md | 🟢 | Content | ✔ |
| T192 | 🟢/🟡/🔴-etikett per uppgift. Åtgärdat: `task.digital`-fält + badge-rendering (låst och upplåst kortvy) med tooltip. Kopy utgår uttryckligen från den efterlevandes EGET BankID (Owner-krav). Taggat 14 representativa uppgifter (bank, Skatteverket, Pensionsmyndigheten, lagfart = 🟢/🟡, bouppteckning/dödsboanmälan/fullmakt/testamente = 🔴 — kräver fysiskt original). Övriga otaggade uppgifter visar ingen badge (medvetet — ingen ogrundad digital-klassning). Bonus: rättade samma T182-stämpelskattefel i `lagfart`-uppgiften (fanns bara fixat i guide-sidorna sen tidigare) + T127 (engelska "deceased"). `app.js`, `style.css`. | 2026-08-13 | Fas 22 | Bankid.md | 🟡 | Dev/Content | ✔ |

---

# 🏠 FAS 23 — BOSTAD: STRUKTURERAT DELFLÖDE
💡 Bostad är ofta dödsboets mest värdefulla och mest komplicerade tillgång — värt ett riktigt delflöde. Fordon hålls medvetet enkelt (Owner-beslut 2026-08-13) — sällan lika komplicerat, en generisk uppgift räcker.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T193 | Strukturerat bostadsflöde. Åtgärdat: när "Ägde sin bostad" kryssas i visas en undersektion — bostadstyp (villa/fritidshus, bostadsrätt, lantbruks-/skogsfastighet; hyresrätt var redan en egen gren) + "Anlitar ni mäklare?"-toggle (Owner-tillägg). Lantbruk/skog triggar ny `lantbruk_fastighet`-uppgift. Ny uppgift `fastighet_forsaljningsadmin` ("Visning, budgivning och köpekontrakt") filtreras bort när mäklare=true — den enda uppgiften som verkligen är mäklarhanterad; beslutsuppgiften `fastighet_boende` behålls alltid (familjen måste besluta oavsett mäklare). Verifierat med tre scenarion (lantbruk utan mäklare, villa med mäklare, ingen fastighet). `app.js`, `index.html`, `style.css`. | 2026-08-13 | Fas 23 | Vad Efterplan bör täcka.md | 🟠 | Dev/Design | ✔ |

---

# 📞 FAS 24 — TELEFONMANUS BREDVID BREVGENERATORN
💡 Persona-simulering (2026-08-13) av en nybliven änka pekade på en lucka: dokumentgeneratorn producerar bara skrivna brev, men fler ringer banken/Försäkringskassan/försäkringsbolaget än mejlar dem — särskilt först, innan dödsfallsintyget ens finns. Ångesten "vad ska jag säga" gäller ett samtal, inte ett brev.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T195 | Telefonmanus i dokumentgeneratorn. Lägg till en andra flik ("Brev" / "Vad du kan säga i telefon") på de dokument där folk oftare ringer än skriver — bank, Försäkringskassan, försäkringsbolag, begravningsbyrå. Manuset: kort talspråklig öppningsreplik ("Hej, jag heter [namn]. Min [relation] [avliden] har gått bort, jag vill anmäla dödsfallet och spärra kontona…") + en checklista över vad man bör ha framme under samtalet (personnummer, eget kontonummer, ev. ärendenummer). Samma UI-mönster som befintlig brevgenerator (`app.js` doc-generator-funktionerna, `index.html` doc-result-vyn). | 2026-08-13 | Fas 24 | Persona-simulering session | 🟡 | Dev/Content | ☐ |

---

# 🔍 FAS 25 — NYA SEO-LANDNINGSSIDOR (SÖKORDSGAP)
💡 Manuell gap-analys mot befintliga 32 innehållssidor 2026-08-13 — **ingen levande GA4/Search Console-data fanns tillgänglig i sessionen** (bara `.env.example`, ingen riktig nyckel), så detta är kvalitativ prioritering, inte volymdata. Verifiera mot faktisk Search Console-sökordsdata innan skrivarbete påbörjas. Tre kandidater identifierade där sökintentionen skiljer sig tydligt från befintliga sidor (ingen kannibalisering) — övriga närliggande termer (änkepension, arvsavstående, bolån vid dödsfall) finns redan omnämnda inline i befintliga sidor och behöver ingen egen URL. Samma sakfels-rigör som Fas 21 gäller — juridiskt innehåll ska källbeläggas innan publicering, inte genereras fritt.

**Owner-beslut 2026-08-13: pausad, väntar på riktig sökdata.** T196–T198 skrivs inte förrän Search Console-datan finns. Vägen dit är redan dokumenterad i `NEXT_STEPS_FOR_JONAS.md` avsnitt 2 (Verifiera Search Console) — Owner exporterar Performance-CSV:n (28 dagar, per sida) och skickar den, sen kör vi om denna gap-analys mot riktiga siffror innan något av T196–T198 påbörjas.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T196 | Ny sida: **framtidsfullmakt**. Omnämns idag bara i en bisats i `fullmakt-dodsbo.html` (som handlar om fullmakt EFTER dödsfall — annan juridisk konstruktion). Framtidsfullmakt är ett proaktivt dokument en efterlevande ofta börjar fundera på åt sig själv strax efter att ha upplevt hur krångligt det blev utan fullmakter för den avlidne — naturlig "nu ordnar jag mitt eget" -vinkel för Efterplans målgrupp. Egen sökterm, egen intention. Kräver källbelagt juridiskt innehåll (lag om framtidsfullmakter 2017:310) innan publicering. | 2026-08-13 | Fas 25 | Manuell gap-analys | 🟡 | Content/SEO | ☐ |
| T197 | Ny sida: **dödsbo eget företag / enskild firma**. Regelmotorn har redan en `foretag`-trigger och en färdig Skatteverket-avregistreringsuppgift med brevgenerator (`app.js`) — men ingen toppen-av-tratten-sida fångar upp sökintentionen förrän man redan är i appen. En landningssida skulle koppla en verklig sökterm direkt till en redan byggd funktion (bra konverteringsväg). | 2026-08-13 | Fas 25 | Manuell gap-analys | 🟡 | Content/SEO | ☐ |
| T198 | Ny sida: **vad händer med den avlidnes tjänstepension**. Skiljer sig från `efterlevandepension.html`, som handlar om utbetalningar TILL efterlevande — den här sidan täcker den avlidnes egen intjänade pension och hur/om den betalas ut till dödsboet. Distinkt sökintention, ingen befintlig sida täcker den. | 2026-08-13 | Fas 25 | Manuell gap-analys | 🟢 | Content/SEO | ☐ |

---

## 💡 MÖJLIGA EXPANSIONER — 2026-08-13 (ej prioriterade, ej påbörjade)

💡 Resten av `research/Vad Efterplan bör täcka.md` som Owner valde att varken bygga eller kasta, utan bevaka — samma mönster som T137–T142. Inget av det löser ett lika akut, konkret problem som dödsboanmälan/bodelning gjorde.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T194 | Bevakningslista: (1) försäkringar/efterlevandeskydd som egen trigger-sektion (TGL, låneskydd, kapitalförsäkring), (2) pension som egen tydlig trigger utöver dagens "barn under 20 år"-fråga, (3) deklaration/skatt som avslutande fas — **obs: Owner avvisade uttryckligen en obligatorisk/valbar avslutningskontroll 2026-08-13** ("momentan lättnad är giltig även om något ligger kvar långt fram") — omvärdera bara om ny information tillkommer, (4) värdepapper uppdelat i undertyper (aktiedepå/ISK/kapitalförsäkring/krypto), (5) skulder uppdelat i undertyper (bolån/privatlån/CSN/borgen), (6) minderåriga barn uppdelat i "barn som ärver" vs "efterlevande barn med rätt till barnpension", (7) eget företag utbyggt (AB/delägarskap/firmateckning, utöver dagens F-skatt-flöde), (8) utlandstillgångar-trigger utökad med "arvinge/dödsbodelägare bosatt utomlands" som separat fråga, (9) arbetsgivare/anställning som egen sektion (sista lön, semesterersättning, tjänstepension). Källa: `research/Vad Efterplan bör täcka.md`. | 2026-08-13 | Backlog | Vad Efterplan bör täcka.md | 🟢 | Research/Backlog | ☐ |

---

## 🚫 AVVISAT — 2026-08-13

| Beslut | Motivering |
|---|---|
| BankID-flerpartssignering av fullmakter | Kräver tredjepartsleverantör + server-relation, krockar med "ingen server, sparas bara lokalt"-löftet. Matchar redan T149/Fas 14:s slutsats — vänta tills bolaget är registrerat och trafiken större. Ingen ny ticket. |
| Obligatorisk eller valbar avslutningskontroll ("är allt verkligen klart?") | Skulle riva upp den befintliga "du är klar, andas ut"-känslan för att påminna om saker som kan ligga månader/år fram (deklaration, skattekonto). Momentan lättnad är giltig även om något administrativt hänger kvar. |
| Fordon uppdelat i undertyper (bil/mc/släp/husbil/båt) som strukturerat delflöde | Sällan lika komplicerat som bostad — en generisk "fordon"-uppgift räcker, upprepa vid behov. |

---

# 🧹 FAS 24 — OWNER-AUDIT (UI-genomgång 2026-08-13) + GROK-UTVÄRDERING

💡 Owner gick igenom appen skärm för skärm och listade ~20 konkreta observationer (copy, lista-istället-för-fritext, villkorad synlighet, en scroll-bugg m.m.), och klistrade in en separat Grok-analys (UI/UX-audit + sorgpsykologisk backlogg) för utvärdering. Genomgången bekräftade att flera Grok-punkter redan var byggda i tidigare sessioner (T177/T178/T189–T193) — de listas inte här igen.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T195 | Textfixar: prisrad "med mera" tillagd, Försäkringskassan-uppgiften förtydligad (automatiskt dödsbesked via folkbokföringen men stoppar inte utbetalningar automatiskt), skattedeklarations-länk bytt till Skatteverkets specifika dödsbo-sida, jurist-disclaimer tillagd på bouppteckningsuppgiften, ny alltid synlig röd-gul-grön-förklaring i plan-headern. `index.html`, `app.js`, `style.css`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟢 | Content | ✔ |
| T196 | "Meddela närstående" hade både en färdigbyggd bock-av-lista (`renderNotifyList`) OCH ett dubblerande fritextfält kvar — fritextfältet borttaget. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟡 | Dev | ✔ |
| T197 | "Hitta viktiga dokument" fick en ny lista (dokument + var det finns), samma mönster som underrätta-listan, som komplement till foto-genvägen till Arkiv. Ny `renderDocumentLocationList()` i `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟡 | Dev | ✔ |
| T198 | "Inventera skulder noggrant" kopplad till Bouppteckningens redan befintliga skuldlista istället för ett fristående fritextfält; placeholder bytt till "Borgenär (skuld till)". `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟡 | Dev | ✔ |
| T199 | "Avsluta autogiron och e-fakturor" + "Avsluta abonnemang och prenumerationer" gjorda om till interaktiva bock-av-listor, samma mönster som "Avsluta digitala konton" redan hade. `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟢 | Dev | ✔ |
| T200 | Buggfix: äktenskapsförord/samboavtal-uppgiften triggade bara på `relation==='make'` (att DU är maken) istället för `giftSambo` (att den avlidne var gift/sambo). Trigger utökad till båda. `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟠 | Dev | ✔ |
| T201 | "Besluta om bostadens framtid" och "Kontrollera bostadsrättens framtid" slagits ihop till en uppgift och flyttad i `TASK_LIBRARY` till att ligga bredvid bouppteckningen, istället för längre ner bland de administrativa fastighetsstegen. `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟡 | Dev | ✔ |
| T202 | Lagfart-uppgiften fick ett datumfält för "bouppteckningen registrerad hos Skatteverket" som räknar ut 3-månadersfristen, samma mönster som `applyDeadlines()` redan gör för dödsdatumet. Ny `applyLagfartDeadline()`. `app.js`, `style.css`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟡 | Dev | ✔ |
| T203 | Dölj/visa klara uppgifter — global knapp + en knapp per sektion (Idag/Denna vecka/Senare), lagras i `localStorage` (`efterplan_hide_done`). `app.js`, `index.html`, `style.css`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟡 | Dev | ✔ |
| T204 | Buggfix: att markera en uppgift som klar skrollade till den FÖRSTA oavklarade uppgiften totalt (kunde hoppa hela vägen upp om en tidig uppgift lämnats öppen). Ändrat till nästa oavklarade uppgift efter den man just klarade av. `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟠 | Dev | ✔ |
| T205 | Räkningssektionen flyttad från botten av "Min plan" till Arkiv-fliken, med en rad som förklarar varför den ligger där. `index.html`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟢 | Dev | ✔ |
| T206 | "Ta hand om dig själv" flyttad från "Senare" till "Gör idag" — kräver ingen deadline, bara närvaro, och ska synas tidigt. `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟢 | Content | ✔ |
| T207 | Framtida (när traction finns): utvärdera om jurister/byråer som listas i appen (t.ex. Familjens Jurist) kan ge provision/kickback för förmedlade dödsbo-ärenden — inklusive vad det gör med trovärdigheten i "det här är bara förslag"-formuleringen (T195). Ren framtidsnotering, ingen kod. | 2026-08-13 | Fas 24 | Owner UI-audit | 🟢 | Research/Backlog | ☐ |
| T208 | Grok-bevakningslista (granskad och avgränsad från denna omgång — se AVVISAT nedan för resonemang): (1) "Jag orkar inte just nu"-pausläge, (2) förifyllda standardposter i Bouppteckningens tillgångar/skulder (Bankkonto, Bostad, Bil, Bohag m.fl.), (3) AI-kategorisering av räkningsfoton (samma mönster som redan finns för Arkiv-dokument), (4) diskret konto-synk-prompt efter första sessionen. Källa: Grok UI/UX-audit, inklistrad av Owner 2026-08-13. | 2026-08-13 | Backlog | Grok-analys | 🟢 | Research/Backlog | ☐ |

---

## 🚫 AVVISAT — 2026-08-13 (session 2, Grok-utvärdering)

| Beslut | Motivering |
|---|---|
| "Visa 1–2 brev gratis" (Grok-förslag) | Ren pris-/affärsmodellsfråga, inte UX — måste beslutas av Owner separat, kodas inte in på egen hand. |
| Duplicera "Ta hand om dig själv" som flera task-instanser i olika sektioner | Skulle bryta klar-markering/state per kopia (samma uppgift, flera `done`-flaggor att hålla reda på). Löst istället genom att flytta den enda instansen tidigare i flödet (T206). |

---

# 📊 FAS 25 — GA4/GSC-verifiering, outreach-status, SEO-titlar (2026-08-14)

💡 Session initierad av Owner ("hur går det med trafiken") som eskalerade genom flera runda av "kolla, gissa inte" — GA4-hämtning krävde ny service-account-nyckel (gammal var 48 byte, ogiltig), egen-testtrafik i datan kunde varken bekräftas eller uteslutas (IP-geolokalisering opålitlig i Sverige). Slutade i faktisk kodverifiering + skarpa SEO-fixar.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T209 | GA4 service-account-nyckel var ogiltig (48 byte). Ny nyckel skapad (`ga4-reader@intricate-tempo-496015-a0.iam.gserviceaccount.com`), Viewer-access i GA4, sparad på `~/.config/efterplan/ga4-service-account.json`. 30-dagars funnel hämtad: 75 sessioner, onboarding_start 12%, plan_generated > onboarding_start i unika användare — verifierat i koden (`app.js:148`, `app.js:300`) att detta INTE kan bero på en trasig funnel (generatePlan kräver alltid startOnboarding först), sannolikt GA4-attributionskvirk vid fönsterkant. Egen testtrafik i datan varken bekräftad eller utesluten (IP visade Stockholm, Owner sitter i Visby — opålitlig signal). | 2026-08-14 | Fas 25 | Session | 🟡 | Analytics | ✔ |
| T210 | Outreach-status verifierad mot Gmail-etiketten Arbete/Efterplan (ej gissad): sorg.se, SPES, Svenska kyrkan, Råd & Rön — skickade 12 apr. 1177 — skickat, avböjt. Aftonbladet — status okänd, lämnad så på Owners begäran. Statustabell tillagd i `outreach.md`. | 2026-08-14 | Fas 25 | Session | 🟢 | Content | ✔ |
| T211 | Återkommande molnrutin skapad: "Community-scan efterplan.se" (`trig_01RSTqpLnTb2UapAYiYvkrFw`), varje måndag 06:00 UTC. Söker Reddit/Flashback/Familjeliv efter trådar där ett genuint icke-säljande svar är rimligt — postar aldrig själv, loggar till `community-watch.md` + öppnar PR för granskning. Explicit instruerad att INTE göra reklam (de flesta forum förbjuder självmarknadsföring i sina regler). | 2026-08-14 | Fas 25 | Session | 🟢 | Growth | ✔ |
| T212 | SEO: 29 av 33 sidors `<title>` var över 60 tecken (klipps i Google-SERP). Kortade alla till ≤60 tecken, behöll nyckelord + "\| Efterplan"-suffix. `index.html` (65, varumärkesledd) och `auth-modal.html` (ingen egen sida, ej i sitemap) undantagna med avsikt. PR #59. | 2026-08-14 | Fas 25 | Session | 🟡 | SEO | ✔ |
| T213 | Google Search Console API kopplad (samma projekt/service-account som GA4, kräver Owner-godkännande av API + Sök-konsol-åtkomst). Sitemap omskickad. Indexeringsstatus verifierad per URL (ej gissad från sitemap-rapportens missvisande "0 indexerade"): **18/33 sidor indexerade**, 8 crawlade-ej-indexerade, 4 upptäckta-ej-crawlade, 3 helt okända för Google (boutredningsman, digital-dodsbo, dodsbo-deklaration). | 2026-08-14 | Fas 25 | Session | 🟠 | SEO | ✔ |
| T214 | Grundorsak till T213:s tre "okända" sidor: fanns bara 2–4 svaga interna länkar var, och saknades helt i startsidans footer (som bara länkade till 3 av 32 guider trots att `om.html` har 33 inlänkar och är sajtens starkaste sida). Startsidans footer utökad till alla 32 guide-länkar. PR #60. Väntar på ny Google-crawl (dagar–veckor) för att verifiera effekt. | 2026-08-14 | Fas 25 | Session | 🟠 | SEO | ✔ |
| T215 | Request Indexing (enskild URL, GSC-knappen) har ingen publik API — verifierat, inte antaget. Skalbar ersättning (sitemap-omskickning, T213) användes istället. Manuell process i [NEXT_STEPS_FOR_JONAS.md](NEXT_STEPS_FOR_JONAS.md:36) kan strykas/nedprioriteras nu när sitemap-vägen finns. | 2026-08-14 | Fas 25 | Session | 🟢 | Research | ✔ |
| T216 | Uppföljning om ~2–4 veckor: kör `/ga4` + ny GSC-indexeringskoll för att se om T212 (kortare titlar) och T214 (interlänkning) faktiskt flyttat CTR/indexeringssiffrorna. | — | Fas 25 | Session | 🟡 | Analytics | ☐ |
| T217 | Automatisk sitemap/indexerings-pipeline byggd: [`.github/workflows/update-sitemap.yml`](.github/workflows/update-sitemap.yml) triggas på varje push till `main` som rör en `.html`-sida, kör [`scripts/indexing/update-sitemap.mjs`](scripts/indexing/update-sitemap.mjs) (skannar repo-roten, sätter `lastmod` från git-historik, validerar canonical + oavsiktlig noindex, failar builden vid fel) och committar `sitemap.xml` om den ändrats, följt av [`scripts/indexing/submit-sitemap.mjs`](scripts/indexing/submit-sitemap.mjs) som resubmittar sitemapen via Search Console API (`sitemaps.submit` — Google Indexing API stödjer inte vanliga HTML-sidor, verifierat i T215). Testat lokalt end-to-end: ny sida upptäcks/läggs till, ändrad sida ger nytt `lastmod`, borttagen sida försvinner ur sitemapen automatiskt. Kräver ingen ny konfig: `submit-sitemap.mjs` återanvänder den befintliga GitHub-secreten `GA4_SERVICE_ACCOUNT_JSON` (samma service-account som redan har Owner-åtkomst i Search Console, se T213) om `GSC_SERVICE_ACCOUNT_JSON` inte finns — fungerar alltså direkt utan manuellt steg. | 2026-08-14 | Fas 25 | Session | 🟢 | SEO | ✔ |

---

# 🌱 FAS 26 — SEO-utbyggnad + produktförenkling (2026-08-14)

💡 Fas 25 fixade akuta SEO-problem och byggde den automatiska sitemap/indexerings-pipelinen (T217). Denna fas fortsätter i två spår enligt samma princip — **gör det åt användaren istället för att be dem göra det** — gäller både Google (indexering) och den sörjande användaren i appen (färre klick, färre tomma listor, färre saker att komma ihåg). Omfattningen var för stor för en session: `bygg-ett-helt-automatiskt-iridescent-peach.md` delade upp i Del A (byggt nu, nedan) och Del B (loggas som B1–B10 här, för kommande sessioner).

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T218 | SEO-snabbvinster: `om.html` fick `Organization`+`WebPage`+`BreadcrumbList` JSON-LD (var enda sidan helt utan strukturerad data) och utökat innehåll (var 90 ord tunt innehåll). `dodsbo-checklista-7-dagar.html` omdöpt/omfokuserad (titel, H1, meta) för att tydligare äga "dag för dag första veckan"-sökintentionen och inte krocka med `checklista-dodsbo.html`s "steg för steg"-vinkel, plus en explicit hänvisning i ingressen. `HowTo`/`HowToStep`-schema tillagt på `bouppteckning-guide.html`, `arvskifte-guide.html` och `checklista-dodsbo.html` (mönster fanns redan på `dodsfallsintyg.html`/`saga-upp-hyresratt-dodsbo.html`). | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟡 | SEO | ✔ |
| T219 | Två nya guide-sidor byggda med samma mall som de befintliga 32 (canonical, meta, Article+HowTo+FAQPage+BreadcrumbList JSON-LD, interlänkar): `dodsboanmalan.html` (löser cannibalization på riktigt — egen landningssida för det förenklade alternativet till bouppteckning, redan en känd term i appens `litetDodsbo`-trigger som saknade sin egen sida) och `framtidsfullmakt.html` (hög sökvolym-term, naturlig granne till `fullmakt-dodsbo.html`). Interlänkade från `bouppteckning-guide.html`, `checklista-dodsbo.html`, `fullmakt-dodsbo.html`, `testamente-guide.html` och startsidans footer. Plockas automatiskt upp av T217:s sitemap-pipeline. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟡 | SEO | ✔ |
| T220 | Produkt (del 1 av Grok-bevakningslistan T208, punkt 2+3): Bouppteckningens tillgångslista startar nu med fyra förifyllda, redigerbara/borttagbara default-rader (Bankkonto, Bostad, Bil, Bohag) första gången fliken öppnas (`app.js`, `BOPP_DEFAULT_TILLGANGAR`) — istället för en tom lista användaren själv måste komma på vad som ska fyllas i. Blockerande `alert()` vid betalningsfel/-status (`handlePremiumReturn`, `handlePaywallCTA`) ersatt med en ny icke-blockerande `showToast()`, samma mönster som `showFormError` men utan fast plats i DOM:en — konsekvent med resten av appen. `app.js`, `index.html`, `style.css`. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟡 | Dev | ✔ |
| T221 | Produkt (del 2 av T208, punkt 2+3): de tre nästan identiska localStorage-list-implementationerna (underrätta-listan, dokumentplats-listan, den generiska `_getLSList`) konsoliderade till en delad `createLSList()`-fabrik i `app.js` — samma externa funktionsnamn och beteende bevarat, men add/remove/setField/toggleField skrivs bara en gång nu. Räkningssektionen (Arkiv → Räkningar) fick samma AI-assist som Arkiv-dokument redan hade: när QR-koden inte hittar fakturadata anropas `/api/categorize-document` (samma "misslyckas tyst"-mönster, aldrig en spärr) för att föreslå avsändare/namn utifrån fotot. `app.js`. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟢 | Dev | ✔ |
| T222 (B1) | Fler content-luckor: `internationellt-arv.html`, `arvsavstaende.html`, `gavobrev.html`, `aktenskapsforord.html` som egna sidor (idag bara nämnda i app-logik/tickets, ingen SEO-landningssida). | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟢 | SEO | ☐ |
| T223 (B2) | Self-hosta Google Fonts (Fraunces/IBM Plex Sans) istället för `fonts.googleapis.com` — tar bort en extern render-blocking request, ren perf/Core-Web-Vitals-vinst. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟢 | Dev | ☐ |
| T224 (B3) | Minifiera `style.css` (84KB)/`app.js` (150KB) — inget build-verktyg finns idag (T122/T123 är release om samma design-skuld); kräver att välja ett verktyg (esbuild/terser) och ett CI-steg, större beslut än en enkel patch. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟢 | Infra | ☐ |
| T225 (B4) | Bekräfta att `weekly-health.yml` (Lighthouse CI-budgets, beskrivet i `MAINTENANCE.md` men aldrig verifierat som en faktisk aktiv workflow) faktiskt finns/körs — annars saknas SEO/perf-regressionsskydd helt. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟡 | Infra | ☐ |
| T226 (B5) | Samma uppföljning som T216: kör `/ga4` + GSC-koll om 2–4 veckor för att mäta effekten av Fas 25 + Fas 26 tillsammans. | — | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟡 | Analytics | ☐ |
| T227 (B6) | "Jag orkar inte just nu"-pausläge för checklistan (T208.1) — kräver UX-design av hur pausat state visas, större grepp än en enkel patch. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟢 | Design/Dev | ☐ |
| T228 (B7) | Deadline-påminnelse-mejl (T136) — opt-in-checkbox finns redan, men själva utskicksinfrastrukturen (Resend/SendGrid + cron) är obyggd; kräver ny extern tjänst-integration, egen session. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟡 | Infra | ☐ |
| T229 (B8) | Onboarding steg 2 (12 kryssrutor): utreda om något kan förifyllas/gissas automatiskt (t.ex. baserat på postnummer om personen äger fastighet) istället för att alltid frågas — kräver research i vilka fält som faktiskt går att härleda, inte en säker snabbfix. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟢 | Research/Dev | ☐ |
| T230 (B9) | Fler brevmallar: hyresvärd (T139), Pensionsmyndigheten (T140), arvskiftesavtal-generator (T138) — var och en är en egen liten funktion, görs bäst separat. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟢 | Dev | ☐ |
| T231 (B10) | Diskret inloggnings-nudge efter första sessionen (T208.4) för cross-device-sync. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | 🟢 | Dev | ☐ |

**Explicit avgränsat bort** (redan avvisat/kräver ägarbeslut, byggs inte): visa fler brev gratis (prissättningsfråga, se AVVISAT 2026-08-14 session 2), dela-länk mellan arvingar (medvetet borttaget T124, byggs ej om utan nytt beslut), lawyer-referral kickbacks (T207, affärsbeslut).

---

# 🌱 FAS 27 — CHATGPT-SEO-RESEARCH 2026-08-14 (VERIFIERAD MOT KOD)

💡 Owner delade en ny ChatGPT-researchrapport om Efterplans SEO. Rapportens huvudpoäng ("sajten är i huvudsak en SPA, guiderna är bara länkar utan riktiga URL:er") stämde **inte** vid verifiering — Fas 19/25/26 hade redan löst det (34 statiska HTML-sidor, canonical, JSON-LD, autositemap, interlänkar från footer). Rapporten återupprepade därför i stort redan gjort arbete. Fem fynd var dock faktiska luckor, verifierade i koden (grep över samtliga `*.html`, inte gissade) innan de loggades här.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T232 | Ny landningssida `saga-upp-abonnemang-vid-dodsfall.html` — "abonnemang" nämns idag i 10 andra guider men äger ingen egen sida/sökintention. Rapporten pekar ut det som kommersiell long-tail nära produkten (uppsägningsbrev finns redan i appen). Samma mall som befintliga sidor (canonical, meta, Article+HowTo+FAQPage+BreadcrumbList JSON-LD), interlänkad från `checklista-dodsbo.html`, `vad-gora-nar-nagon-dor.html`, `dodsbo-checklista-7-dagar.html`, `digital-dodsbo.html`, `bankkonto-dodsfall.html` och startsidans footer. | 2026-08-14 | Fas 27 | ChatGPT-research (Owner) | 🟡 | SEO | ✔ |
| T233 | Tre nya landningssidor för ämnen som idag bara nämns i förbigående på `index.html`, ingen egen sida: `forsakring-vid-dodsfall.html` (livförsäkring/TGL/hemförsäkring/bilförsäkring — återanvänder redan etablerade fakta som "6–8 prisbasbelopp" från `efterlevandepension.html`), `husdjur-efter-dodsfall.html` (juridisk status som lös egendom, Jordbruksverkets hundregister, kan inte testamenteras direkt till djuret), `eftersandning-post-dodsbo.html` (adressändring.se för dödsbo + varför digital myndighetspost/Kivra inte täcks). Samma mall/interlänkning som T232, med korslänkar mellan alla nya sidor. | 2026-08-14 | Fas 27 | ChatGPT-research (Owner) | 🟢 | SEO | ✔ |
| T234 | "Senast uppdaterad: [datum]"-rad tillagd på alla 38 guide-sidor, satt per fil från `git log`-datumet innan denna sessions ändringar (samma källa som `update-sitemap.mjs` använder för `lastmod`) — inte ett fast dagens-datum. Sidor som inte innehållsmässigt ändrades denna session (t.ex. `gravsten.html`, `sambo-arv.html`) behöll sitt faktiska tidigare datum (29 maj) snarare än att skrivas över med dagens. Ny CSS-klass `.seo-updated` i `style.css`, placerad efter ingressstycket (`h1 + p`) för att inte störa dess befintliga stilregel. Engångsscript, ej del av CI-pipelinen. | 2026-08-14 | Fas 27 | ChatGPT-research (Owner) | 🟡 | SEO | ✔ |
| T235 | Ursprungsscope (generisk delbar landningssida) omprövad genom en `/debate`-analys av fem gratis/betal-varianter (mål: maximal konvertering) — se `veckorapport`/sessionslogg för hela debatten, kort sagt: en ren statisk kopia av bouppteckningsöversikten skulle konkurrera med Efterlevandeguiden på deras planhalva utan att visa Efterplans faktiska fördel (personalisering + "vi gör jobbet åt dig"). Landade istället på Owners eget förslag: **`gratis-checklista-abonnemang.html`** — fristående sida, inget konto, kryssa i abonnemang → personlig checklista direkt → ett komplett gratis uppsägningsbrev. Byggd helt utan `app.js`-beroende (egen inline-JS), återanvänder exakt samma checklista-nycklar och brevmall som `abonnemang`-uppgiften/`generateLetter()` för konsekvens. Interlänkad från 6 befintliga sidor + startsidans footer. Pilot — bara abonnemang, inte de andra föreslagna områdena (bank/bostad/pension). | 2026-08-14 | Fas 27 | ChatGPT-research (Owner) + Owner-beslut | 🟢 | SEO/Product | ✔ |
| T236 | Slå ihop med T216/T226 (redan öppna uppföljningstickets, förfaller ~slutet aug/mitten sep 2026): när `/ga4` + GSC-koll körs då, mät även effekt av T232–T235 om de hunnit byggas och crawlas — särskilt konvertering från `gratis-checklista-abonnemang.html` till fullständig plan (`free_tool_letter_generated` → `free_tool_to_app_click`-events). Ingen ny separat uppföljning behövs. | — | Fas 27 | ChatGPT-research (Owner) | 🟢 | Analytics | ☐ |
| T237 | **Fynd under T235-arbetet, ej åtgärdat på Owners begäran ("lämna som de är just nu")**: prisraden på startsidan (`index.html:163`, "49 kr: alla färdigskrivna brev — bank, försäkring, Skatteverket, abonnemang, fullmakt, dödsannons") stämmer inte med koden. Verifierat i `app.js`: bara Skatteverket-brevet och fullmakten är faktiskt bakom `isPremium()`. Bank-, försäkrings-, dödsannons- och abonnemangsbreven har ingen betalspärr alls och är fria för alla redan idag. Antingen är texten fel (rätta den) eller saknas kod (lägg till spärr så det stämmer med vad som marknadsförs) — kräver ett Owner-beslut, inte en gissning. | 2026-08-14 | Fas 27 | Session (kodverifiering) | 🟠 | Product/Pricing | ☐ |

**Redan gjort, bekräftat vid verifiering (ingen ny ticket)**: separata crawlbara sidor per sökintention, title/H1/first-paragraph-matchning, interlänkning från footer, beskrivande ankartexter, strukturerad data (Article/HowTo/FAQPage/BreadcrumbList), automatisk sitemap + Search Console-submission (ej Indexing API — verifierat fel användningsområde i T215), korta titlar (T212). Se Fas 19/25/26.

---

# 🚀 FAS 28 — TRAFIK FÖRE ALLT (Owner-beslut 2026-08-15)

💡 `handoff.md` (2026-08-13) lämnade aktiveringsfrågan öppen: 16 sessioner → 0 `onboarding_start` behövde verifieras i GA4 Realtime innan mer trafik drevs in. **Owner bekräftade 2026-08-15 att GA4-kollen är gjord och att aktivering fungerar** — 0/16 var alltså inte ett spårningsfel. Marketing-planens paus ("aktivering före trafik", `marketing-plan-2026-08.md`) är därmed upphävd. Nytt explicit Owner-direktiv: **"det enda som räknas nu är trafik"** — allt arbete denna fas prioriterar besöksvolym, inte konvertering/paywall-städning (T237 kvarstår avsiktligt olöst).

Samma session mergeade in två efterhängande grenar (`claude/analysera-aauv10`: Fas 27-sidorna T232–T235 ovan; `claude/efterplan-user-experience-zhqz2t`/PR #58: telefonmanus + twitter:card + arvskifte-utökning) och fixade en tyst trasig automation:

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T238 | `scripts/indexing/` saknade `package-lock.json` sen introduktionen (T217, 2026-08-14) — `npm ci` i `update-sitemap.yml` har failat på **alla** körningar sen dess (`gh run list` verifierat, ej gissat), så varken sitemap-uppdatering eller GSC-submission gått igenom trots att koden var korrekt designad. Lockfil genererad + committad (`dec2dca`), workflow går nu grönt förbi npm-steget. | 2026-08-15 | Fas 28 | Session (CI-loggverifiering) | 🔴 | Infra/SEO | ✔ |
| T239 | GSC-submission failade initialt: `User does not have sufficient permission for site 'https://efterplan.se/'` för service-accounten `ga4-reader@intricate-tempo-496015-a0.iam.gserviceaccount.com`. Owner lade till kontot som Full-användare i Search Console. Verifierat löst genom direkt testkörning mot `sitemaps.submit` API:t (`OK: sitemap resubmitted successfully`) — hela kedjan (ny/ändrad/borttagen HTML-sida → sitemap uppdateras automatiskt → Google notifieras automatiskt) fungerar nu end-to-end utan manuellt steg per sida. | 2026-08-15 | Fas 28 | Session (API-verifiering) | 🟢 | Infra/SEO | ✔ |
| T240 | Ny sida `arvskifte-mall.html` — SEO-auditens största konkreta gap: sökordet "arvskifte mall"/"arvskifteshandling mall" domineras av 10+ mallsajter (Blankettbanken, MySign, Ekonomifokus m.fl.) som bara säljer statiska Word/PDF-mallar. Byggd som interaktiv generator istället för textguide: fyll i avliden, arvingar (dynamisk lista) och tillgångar/fördelning (dynamisk lista) → komplett arvskiftesavtal med signaturrader genereras direkt på sidan, kopiera eller skriv ut/spara som PDF via webbläsaren. Ingen fil att ladda ner, inget konto, inget skickas till servern — samma mönster som `gratis-checklista-abonnemang.html` (T235). Interlänkad från `index.html` (två ställen), `arvskifte-guide.html`, `checklista-dodsbo.html`, `bouppteckning-guide.html`, `dodsbo-fastighet.html`. Testat end-to-end i browser preview: formulär, dynamisk "tilldelas"-dropdown (buggfixad — uppdaterade inte vid namnändring efter tillägg), avtalsgenerering. | 2026-08-15 | Fas 28 | Session (SEO-audit) | 🟢 | SEO/Product | ✔ |

---

## 🚫 AVVISAT / EJ GJORT — 2026-08-14

| Beslut | Motivering |
|---|---|
| LinkedIn-profil städas till bara Efterplan | Ingen tillgänglig verktygsväg kunde faktiskt redigera profilen (Gmail-sök saknades, computer-use ger bara läsläge i webbläsare, ny inloggning i webbläsarpanelen krävdes aldrig). Owner avbröt ("skit i det") innan en väg hittades. Ohanterat — kan tas upp igen om Owner vill logga in i webbläsarpanelen direkt. |
| Bygga automatiserat LinkedIn-kontohanteringsverktyg | Avböjt — LinkedIn förbjuder skriptad kontoåtkomst i sina villkor, risk för avstängning. Erbjöd manuella alternativ istället. |
