# Roadmap â€” Full Backlog (Exact Execution Order)

Start at **T001**. Do not proceed until the current ticket is fully completed.

Each step improves the product or the company in a meaningful way.

---

## Legend
- â˜ Not started
- â§– In progress / Parkerad
- âœ” Completed
- x Skipped / Not needed
- Priority: ðŸ”´ Critical Â· ðŸŸ  Important Â· ðŸŸ¡ Medium Â· ðŸŸ¢ Low
- Type: Dev Â· Design Â· Content Â· Research Â· Infra Â· Bolag Â· QA Â· Legal Â· Iteration Â· SEO Â· Distribution Â· Partnership Â· Analytics Â· PR Â· Growth

---

## âš ï¸ STRATEGISKA NOTER (uppdaterad 2026-04-24)
- **Partnerskap med begravningsbyrÃ¥er och jurister Ã¤r inte aktuellt.** T045, T046, T077, T078 struktna. Efterplan anvÃ¤nds INNAN begravningsbyrÃ¥ kontaktas â€” flÃ¶det gÃ¥r efterplan â†’ byrÃ¥, inte tvÃ¤rtom.
- **T079** â€” omdefinierad: betald byrÃ¥listing i appen. AffÃ¤rsmodell (pris, avtal, sÃ¤ljprocess) beslutas av Owner innan exekvering.
- **T044** â€” struken. Facebook-grupper bannar reklamlÃ¤nkar.
- **T087 lÃ¤nkbyggnad** â€” hallakonsument.se kontaktad âœ”. Ã–vriga 5 struktna (felaktig mÃ¥lgrupp).
- **T032 (Stripe)** â€” parkerad tills Code-sessioner klara. Pris: 49 kr engÃ¥ng.
- **T033** â€” pricing uppdaterad till 49 kr (testnivÃ¥, tidigare 149 kr).
- **T051/T052/T053** â€” kod klar men blockerad: krÃ¤ver (1) skapa Supabase-projekt, (2) kÃ¶r supabase/schema.sql, (3) stÃ¤ng av lÃ¶senords-auth, (4) fyll i URL + anon key i supabase-client.js. Owner-Ã¥tgÃ¤rd.
- **Stack:** repot Ã¤r statiskt HTML + vanilla JS, inte Next.js. Alla Code-Ã¤ndringar gjorda i rÃ¤tt stack.
- **T082 + T098 (meta)** â€” kÃ¶rs i Claude Code.
- **T093** CTA/funnel â€” kÃ¶rs i Claude Code.

---

# âš™ï¸ FAS 1 â€” FOUNDATION
ðŸ’¡ Everything else is blocked until this is done.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T001 | Read the entire Manifest sheet and confirm scope | Fas 1 | ðŸ“‹ Manifest | ðŸ”´ | Principle | â˜ |
| T003 | Register company / sole proprietorship + apply for Fâ€‘tax | Fas 1 | ðŸ¢ Company Plan | ðŸ”´ | Bolag | â˜ |
| T004 | Open business bank account (Lunar / Swedbank / Revolut Business) | Fas 1 | ðŸ¢ Company Plan | ðŸ”´ | Bolag | â˜ |
| T005 | Create GitHub repo + base project setup (Next.js recommended) | Fas 1 | ðŸ“± App Plan | ðŸ”´ | Infra | âœ” |

---

# ðŸ“± FAS 2 â€” BUILD THE CORE
ðŸ’¡ The core *is* the product.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T006 | Sketch the entire checklist flow (all steps, correct order) | Fas 2 | ðŸ“± App Plan | ðŸ”´ | Design | âœ” |
| T007 | Build view: show 1 active task | Fas 2 | ðŸ“± App Plan | ðŸ”´ | Dev | âœ” |
| T008 | Add "Done â†’" button | Fas 2 | ðŸ“± App Plan | ðŸ”´ | Dev | âœ” |
| T009 | Show "Next step is X" | Fas 2 | ðŸ“± App Plan | ðŸ”´ | Dev | âœ” |
| T010 | Progress counter | Fas 2 | ðŸ“± App Plan | ðŸ”´ | Dev | âœ” |
| T011 | Save progress in localStorage | Fas 2 | ðŸ“± App Plan | ðŸ”´ | Dev | âœ” |

---

# âœï¸ FAS 3 â€” CONTENT
ðŸ’¡ Content *is* the product.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T012 | Write all 20â€“30 steps | Fas 3 | ðŸ“± App Plan | ðŸ”´ | Content | âœ” |
| T013 | Add priority per step | Fas 3 | ðŸ“± App Plan | ðŸ”´ | Content | âœ” |
| T014 | Deterministic order â€” system chooses | Fas 3 | ðŸ“‹ Manifest | ðŸ”´ | Logic | âœ” |
| T015 | Validate step order with 2â€“3 real relatives | Fas 3 | ðŸ“‹ Manifest | ðŸ”´ | Research | â§– |
| T016 | Adjust order and text based on interviews | Fas 3 | ðŸ“‹ Manifest | ðŸ”´ | Content | â§– |

---

# ðŸ“ FAS 4 â€” MOBILEâ€‘FIRST UX
ðŸ’¡ Mobile first. Desktop is a bonus.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T017 | Mobile layout: large type, spacing, big buttons | Fas 4 | ðŸ“‹ Manifest | ðŸ”´ | Design | âœ” |
| T018 | Remove distractions â€” no menus, sidebars, images | Fas 4 | ðŸ“‹ Manifest | ðŸ”´ | Design | âœ” |
| T019 | Build expand view ("See all steps") | Fas 4 | ðŸ“± App Plan | ðŸŸ  | Dev | âœ” |
| T020 | Test on real mobile (iOS + Android) | Fas 4 | ðŸ“± App Plan | ðŸ”´ | QA | âœ” |
| T021 | Ensure loading < 1s on 4G | Fas 4 | ðŸ“± App Plan | ðŸŸ  | QA | âœ” |

---

# ðŸ›¡ï¸ FAS 4.5 â€” UX POLISH & ACCESSIBILITY
ðŸ’¡ Must be done before soft launch.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T055 | Split plan into urgency sections | Fas 4.5 | UX Audit | ðŸ”´ | Dev | âœ” |
| T056 | Add visual progress bar in onboarding | Fas 4.5 | UX Audit | ðŸ”´ | Dev | âœ” |
| T057 | Add offline banner | Fas 4.5 | UX Audit | ðŸ”´ | Dev | âœ” |
| T058 | Loading indicator with calming text | Fas 4.5 | UX Audit | ðŸŸ  | Dev | âœ” |
| T059 | A11y pass: aria, focus, contrast | Fas 4.5 | UX Audit | ðŸŸ  | A11y | âœ” |

---

# ðŸš€ FAS 5 â€” TRUST & SOFT LAUNCH
ðŸ’¡ Launch open and free. Real users give real data.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T022 | Add disclaimer: "Not legal advice" | Fas 5 | ðŸ“± App Plan | ðŸ”´ | Legal | âœ” |
| T024 | Endâ€‘toâ€‘end test | Fas 5 | ðŸ“± App Plan | ðŸ”´ | QA | âœ” |
| T025 | Publish MVP on domain â€” all free | Fas 5 | ðŸ¢ Company Plan | ðŸ”´ | Launch | âœ” |
| T026 | ~~Share with 5 target users, collect feedback~~ | Fas 5 | ðŸ“‹ Manifest | ðŸ”´ | Research | x |
| T027 | Iterate on top 3 confusion points | Fas 5 | ðŸ“‹ Manifest | ðŸ”´ | Iteration | â˜ |

---

# ðŸ’° FAS 6 â€” MONETIZATION
ðŸ’¡ Don't add paywall until usage is proven.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T028 | Set up Stripe account | Fas 6 | ðŸ¢ Company Plan | ðŸ”´ | Bolag | x |
| T029 | Decide paywall point | Fas 6 | ðŸ“± App Plan | ðŸ”´ | Decision | x |
| T030 | Build free preview (steps 1â€“5 open) | Fas 6 | ðŸ“± App Plan | ðŸ”´ | Dev | âœ” |
| T031 | Build payment flow: Stripe Checkout â†’ unlock | Fas 6 | ðŸ“± App Plan | ðŸ”´ | Dev | x |
| T032 | Test full purchase flow | Fas 6 | ðŸ“± App Plan | ðŸ”´ | QA | â§– |
| T033 | Final pricing model decided â€” 49 kr engÃ¥ng (testnivÃ¥) | Fas 6 | ðŸ¢ Company Plan | ðŸ”´ | Decision | âœ” |

---

# ðŸ¢ FAS 7 â€” COMPANY & OPS
ðŸ’¡ Infrastructure that scales.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T034 | Set up Bokio or Fortnox | Fas 7 | ðŸ¢ Company Plan | ðŸŸ  | Bolag | â§– |
| T035 | Install Plausible Analytics | Fas 7 | ðŸ¢ Company Plan | ðŸŸ  | Infra | âœ” |
| T036 | Configure analytics events | Fas 7 | ðŸ¢ Company Plan | ðŸŸ  | Infra | âœ” |
| T037 | KPI dashboard | Fas 7 | ðŸ¢ Company Plan | ðŸŸ  | Analytics | âœ” |

---

# ðŸ” FAS 8 â€” SEO
ðŸ’¡ SEO takes 3â€“6 months.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T038 | Canonical landing page | Fas 8 | ðŸ¢ Company Plan | ðŸ”´ | SEO | âœ” |
| T039 | 5 longâ€‘tail FAQ pages | Fas 8 | ðŸ¢ Company Plan | ðŸŸ  | SEO | âœ” |
| T040 | LLMâ€‘friendly answers | Fas 8 | ðŸ¢ Company Plan | ðŸŸ  | SEO | âœ” |
| T041 | FAQ structured data | Fas 8 | ðŸ¢ Company Plan | ðŸŸ¡ | Dev | âœ” |
| T042 | Core Web Vitals | Fas 8 | ðŸ“± App Plan | ðŸŸ¡ | Dev | âœ” |
| T084 | Fix mobile PageSpeed: eliminera redirect chain + reduce unused JS (mÃ¥l LCP <2.5s) | Fas 8 | SEO Audit | ðŸŸ  | Dev | âœ” |
| T085 | LÃ¤gg till Organization schema (Identity Schema) pÃ¥ index-sidan | Fas 8 | SEO Audit | ðŸŸ¡ | Dev | âœ” |
| T086 | Ta bort plain text email â€” ersÃ¤tt med kontaktformulÃ¤r eller obfuskerad mailto | Fas 8 | SEO Audit | ðŸŸ¡ | Dev | âœ” |

---

# ðŸ“£ FAS 9 â€” DISTRIBUTION
ðŸ’¡ Start with free channels.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T043 | Flashback post | Fas 9 | ðŸ¢ Company Plan | ðŸŸ  | Distribution | âœ” |
| T044 | Facebook groups | Fas 9 | ðŸ¢ Company Plan | ðŸŸ  | Distribution | x |
| T045 | Contact 3 lawyers | Fas 9 | ðŸ¢ Company Plan | ðŸŸ¡ | Partnership | x |
| T046 | Contact 3 funeral homes | Fas 9 | ðŸ¢ Company Plan | ðŸŸ¡ | Partnership | x |

---

# ðŸ“ˆ FAS 10 â€” OPTIMIZE & GROW
ðŸ’¡ Only optimize what works.

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T047 | Analyze dropâ€‘off | Fas 10 | ðŸ¢ Company Plan | ðŸ”´ | Analytics | â§– VÃ¤ntar pÃ¥ ~100 organiska sessioner |
| T048 | A/B test price | Fas 10 | ðŸ¢ Company Plan | ðŸŸ  | Growth | â˜ |
| T049 | Improve weakest content | Fas 10 | ðŸ“± App Plan | ðŸŸ  | Content | âœ” |
| T050 | PDF export | Fas 10 | ðŸ“± App Plan | ðŸŸ¡ | Dev | âœ” |
| T051 | Supabase: DB + auth | Fas 10 | ðŸ“± App Plan | ðŸŸ¡ | Infra | âœ” |
| T052 | Sharing feature | Fas 10 | ðŸ“± App Plan | ðŸŸ¡ | Dev | âœ” |
| T053 | Account system | Fas 10 | ðŸ“± App Plan | ðŸŸ¢ | Dev | âœ” |
| T054 | Automation: letters, authorities | Fas 10 | ðŸ“± App Plan | ðŸŸ¢ | Dev | âœ” |

---

# ðŸ”§ FAS 4.5 â€” HOTFIXES & CONTENT

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T064 | Bug: skipâ€‘link wrong target | Fas 4.5 | ðŸ“± App Plan | ðŸ”´ | Dev | âœ” |
| T065 | Bug: ALL CAPS headings | Fas 4.5 | ðŸ“± App Plan | ðŸ”´ | Design | âœ” |
| T066 | Bug: tagline truncation on narrow mobile | Fas 4.5 | ðŸ“± App Plan | ðŸ”´ | Design | âœ” |
| T063 | Content: LantmÃ¤teriet 3â€‘month rule | Fas 4.5 | ðŸ“± App Plan | ðŸŸ  | Content | âœ” |

---

# ðŸ›¡ï¸ FAS 5 â€” GROWTH & MOAT

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T060 | Push notifications (7/30/90 days) â€” rÃ¤ttad 2026-08-11: koden finns bara pÃ¥ oihopslagen branch `origin/codex/t060-checkpoints` (commit c4039e5), inte pÃ¥ `main`. MÃ¤tt frÃ¥n plan-skapande, inte dÃ¶dsdatum â€” ej samma datumlogik som T135. Merga eller bygg om innan T136 antar att den finns. | Fas 5 | ðŸ“± App Plan | ðŸŸ  | Dev | â§– |
| T061 | 3â€“4 static SEO landing pages | Fas 5 | ðŸ“± App Plan | ðŸŸ  | Growth | âœ” |
| T062 | Extended telemetry | Fas 5 | ðŸ“± App Plan | ðŸŸ¡ | Analytics | âœ” |

---

# ðŸ†• FAS 10 â€” NEW FEATURES

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T067 | Bills overview (manual or OCR) | Fas 10 | ðŸ“± App Plan | ðŸŸ¡ | Dev | âœ” |
| T068 | Notes field per task | Fas 10 | ðŸ“± App Plan | ðŸŸ¡ | UX | âœ” |
| T069 | Accessibility: voice input (speechâ€‘toâ€‘text) | Fas 10 | ðŸ“± App Plan | ðŸŸ¢ | UX | âœ” |

---

# ðŸš€ FAS 11 â€” TRAFFIC SPRINT (30 DAYS)

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|---------|--------|
| T070 | Verify Search Console + sitemap | 2026â€‘04â€‘13 | Fas 11 | SEO Sprint | ðŸŸ¡ | SEO | âœ” |
| T071 | Publish landing page "dodsboâ€‘checklistaâ€‘7â€‘dagar" | 2026â€‘04â€‘14 | Fas 11 | SEO Sprint | ðŸŸ¡ | SEO | âœ” |
| T072 | Publish "bouppteckningâ€‘tidslinje" + FAQ schema | 2026â€‘04â€‘15 | Fas 11 | SEO Sprint | ðŸŸ¡ | SEO | âœ” |
| T073 | Set up dashboard: traffic â†’ onboarding â†’ plan generated | 2026â€‘04â€‘16 | Fas 11 | Analytics Sprint | ðŸŸ¡ | Analytics | âœ” |
| T074 | Flashback post + log responses | 2026â€‘04â€‘20 | Fas 11 | Distribution | ðŸŸ¡ | Distribution | âœ” |
| T075 | Post in 3 Facebook groups | 2026â€‘04â€‘21 | Fas 11 | Distribution | ðŸŸ¡ | Distribution | âœ” |
| T076 | Reddit resource post + CTA | 2026â€‘04â€‘22 | Fas 11 | Distribution | ðŸŸ¡ | Distribution | âœ” |
| T077 | Outreach: 10 funeral homes + 10 lawyers | 2026â€‘04â€‘23 | Fas 11 | Partnership | ðŸŸ¡ | Partnership | x |
| T078 | Contact 3 lawyers (pilot) | 2026â€‘04â€‘27 | Fas 11 | Partnership | ðŸŸ¡ | Partnership | x |
| T079 | Betald byrÃ¥listing: lÃ¤gg till sponsrade begravningsbyrÃ¥er i appen vid relevanta steg. AffÃ¤rsmodell beslutas av Owner. | 2026â€‘04â€‘28 | Fas 11 | Partnership | ðŸŸ¡ | Partnership | â§– |
| T080 | Media pitch to 5 outlets | 2026â€‘04â€‘29 | Fas 11 | PR | ðŸŸ¡ | PR | âœ” |
| T081 | Analyze dropâ€‘off + prioritize top 3 issues | 2026â€‘05â€‘04 | Fas 11 | Analytics | ðŸŸ¡ | Analytics | â§– VÃ¤ntar pÃ¥ ~100 organiska sessioner |
| T082 | Optimize top 3 landing pages | 2026â€‘05â€‘05 | Fas 11 | SEO | ðŸŸ¡ | SEO | âœ” |
| T083 | Weekly KPI review + new 14â€‘day plan | 2026â€‘05â€‘06 | Fas 11 | Growth | ðŸŸ¡ | Growth | âœ” |
| T087 | LÃ¤nkbyggnad: hallakonsument.se kontaktad. Ã–vriga struktna (felaktig mÃ¥lgrupp). | 2026â€‘05â€‘10 | Fas 11 | SEO Audit | ðŸŸ  | SEO | âœ” |
| T089 | SEO-sida: dodsfallsintyg | â€” | Fas 11 | SEO Sprint | ðŸŸ¡ | SEO | âœ” |
| T090 | SEO-sida: laglott | â€” | Fas 11 | SEO Sprint | ðŸŸ¡ | SEO | âœ” |
| T091 | SEO-sida: saga-upp-hyresratt-dodsbo | â€” | Fas 11 | SEO Sprint | ðŸŸ¡ | SEO | âœ” |

---

# ðŸš€ FAS 12 â€” SPRINT 3: GROWTH & QUALITY

| ID | Task | Phase | Source | Priority | Type | Status |
|----|------|--------|---------|----------|--------|-------|
| T092 | SEO: tomma-dodsbo.html | Fas 12 | Sprint 3 | ðŸŸ¡ | SEO | âœ” |
| T093 | Konvertering: CTA/funnel-optimering | Fas 12 | Sprint 3 | ðŸŸ¡ | Growth | âœ” |
| T094 | Outreach-uppfÃ¶ljning | Fas 12 | Sprint 3 | ðŸŸ¡ | Partnership | x |
| T095 | KvalitetsstÃ¤mplar & certifikat | Fas 12 | Sprint 3 | ðŸŸ¡ | Dev | âœ” |
| T096 | Mobilwebb & app-funktionalitet | Fas 12 | Sprint 3 | ðŸ”´ | Dev | âœ” |
| T097 | Centrera layout i browser | Fas 12 | Sprint 3 | ðŸ”´ | Dev | âœ” |
| T098 | Meta title/description: /checklista-dodsbo (174 visningar, 0 klick) | Fas 12 | SEO Sprint | ðŸ”´ | SEO | âœ” |
| T099 | Delning till anhÃ¶riga: tvÃ¥ lÃ¤nktyper (lÃ¤s + redigerbar). Redigerbar lÃ¤nk lÃ¥ter anhÃ¶riga bocka av uppgifter utan inloggning, via security-definer RPC som bara rÃ¶r efterplan_tasks. Ã„garspecifik UI dÃ¶ljs fÃ¶r delade besÃ¶kare. | Fas 12 | Sprint 3 | ðŸŸ  | Dev | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-04-29

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T100 | Meta description saknas i share-modal.html + auth-modal.html â€” false positive: filerna Ã¤r body-fragment som inlines i index.html, meta-tagg ogiltig dÃ¤r | 2026-04-29 | Fas 12 | Veckorapport | ðŸŸ  | SEO | x |
| T101 | Standardisera GA4 event-namn till snake_case i app.js â€” `'Onboarding Start'` â†’ `'onboarding_start'`, `'Plan Generated'` â†’ `'plan_generated'`, `'Task Complete'` â†’ `'task_completed'` (app.js rad 73, 170, 285, 1267). Dashboard server.js dual-querar gamla + nya namn sÃ¥ historisk data bevaras. | 2026-04-29 | Fas 12 | Veckorapport | ðŸŸ  | Analytics | âœ” |
| T102 | Uppgradera express 4â†’5 i ga4-dashboard/package.json + verifiera att inga breaking changes pÃ¥verkar server.js. Express 5.2.1 installerat, smoke-test /api/health â†’ 200 OK. | 2026-04-29 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |
| T103 | Uppgradera googleapis 144â†’171 i ga4-dashboard/package.json. Verifierad 2026-05-29: package.json + lockfile bÃ¥da pÃ¥ 171.4.0. | 2026-04-29 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |
| T104 | Verifiera 4 moderate npm audit-sÃ¥rbarheter i ga4-dashboard. Status 2026-05-29: 0 sÃ¥rbarheter i root, 1 moderate kvar i ga4-dashboard (qs DoS, lÃ¥g reell risk). qs 6.14.2â†’6.15.2 i lockfile. | 2026-04-29 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-05-04

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T105 | ga4-dashboard/public/index.html saknar `<meta name="robots" content="noindex, nofollow">` â€” intern admin-dashboard Ã¤r exponerad utan noindex-direktiv och riskerar att crawlas/indexeras av sÃ¶kmotorer. LÃ¤gg till i `<head>` pÃ¥ rad 8. Fil: ga4-dashboard/public/index.html | 2026-05-04 | Fas 12 | Veckorapport | ðŸŸ  | SEO | âœ” |
| T106 | Extern uptime-monitor saknas â€” sandbox-hÃ¤lsocheck blockeras av Cloudflare (HTTP 403), dvs riktiga driftstopp syns inte proaktivt. SÃ¤tt upp UptimeRobot (gratis) fÃ¶r https://efterplan.se med e-postvarning till jonas.soderstrom43@gmail.com (kontrollintervall 5 min). | 2026-05-04 | Fas 12 | Veckorapport | ðŸŸ  | Dev | âœ” |
| T107 | sitemap.xml lastmod-datum Ã¤r inaktuella â€” flertalet URLs har `2026-04-15` men nyare SEO-sidor (tomma-dodsbo, checklista-dodsbo m.fl.) har lagts till sedan dess. Uppdatera `<lastmod>` fÃ¶r berÃ¶rda sidor i sitemap.xml. Fil: sitemap.xml | 2026-05-04 | Fas 12 | Veckorapport | ðŸŸ¡ | SEO | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-05-11

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T108 | Stripe 17.5â†’22.1.1 â€” uppgraderad i package.json. apiVersion '2024-11-20.acacia' i api/_lib.js ofÃ¶rÃ¤ndrad. Smoke-test passerat (checkout.sessions.create + webhooks.constructEvent + syntax-check pÃ¥ alla api/*.js). Ã…terstÃ¥r: Stripe testmiljÃ¶-betalning end-to-end. Fil: package.json. | 2026-05-11 | Fas 12 | Veckorapport | ðŸŸ  | Dev | âœ” |
| T109 | @supabase/supabase-js 2.45â†’2.105.4 â€” uppgraderad i package.json. Smoke-test passerat (from/auth/upsert exponerade). Ã…terstÃ¥r: full smoke-test av premium-entitlement + delad plan i produktion. Fil: package.json. | 2026-05-11 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |
| T110 | Roadmap-status synkad: T105 (ga4 noindex) + T107 (sitemap lastmod) markerade âœ” enligt faktiska commits. | 2026-05-11 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |
| T111 | UptimeRobot uppsatt fÃ¶r https://efterplan.se (monitor-ID 803022627). HTTP/S, 5 min intervall, e-postvarning till jonas.soderstrom43@gmail.com. 100% uptime senaste 3 dagar. | 2026-05-11 | Fas 12 | Veckorapport | ðŸŸ  | Infra | âœ” |
| T112 | GA4 intern-trafik-filter verifierat: regel "Jag sjÃ¤lv" (IP 83.233.139.162, traffic_type=internal) + datafilter "Internal Traffic" status=Aktiv, Ã¥tgÃ¤rd=Uteslut. Jonas egna sessioner exkluderas redan frÃ¥n rapporter. | 2026-05-11 | Fas 12 | Veckorapport | ðŸŸ  | Analytics | âœ” |
| T113 | Konfigurera GA4 service-account-credentials i Cowork-sandlÃ¥dan sÃ¥ veckorapport kan dra GA4-data direkt. Klart nÃ¤r: ga4-service-account.json finns pÃ¥ fÃ¶rvÃ¤ntad sÃ¶kvÃ¤g. | 2026-05-11 | Fas 12 | Veckorapport | ðŸŸ¡ | Infra | â˜ |
| T114 | GSC-indexeringsproblem efter canonical-byte (wwwâ†’apex): lÃ¤gg till 308-redirect www.efterplan.seâ†’efterplan.se i vercel.json `redirects`-block. Punkt 4b (byt www-canonicals i *.html) och 4c (rensa sitemap.xml) redan klara (commit 265659f + grep `www.efterplan.se` = 0 trÃ¤ffar). Efter deploy: begÃ¤r omindexering i GSC fÃ¶r 3 drabbade URL:er. | 2026-05-11 | Fas 12 | Veckorapport | ðŸŸ  | SEO | âœ” |

---

## âœ… KLART â€” SÃ¤kerhet 2026-05-12

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T115 | Stripe webhook signing secret roterad efter GitGuardian-lÃ¤cka. Gammalt `whsec_*` frÃ¥n Kaascha-sandlÃ¥dan exponerades i `.claude/handoff.md` (PR #21, merge 5e2ba3f, 2026-05-11). Roterad i Stripe Dashboard, nytt vÃ¤rde satt i Vercel env (production + preview), redeployat. `.claude/handoff.md`, `weekly-report.log`, `scheduled_tasks.lock`, `settings.local.json` tillagda i `.gitignore` och untrackade frÃ¥n index. Historik lÃ¤mnad orÃ¶rd (test-mode secret, ingen pengarisk efter rotation). | 2026-05-12 | SÃ¤kerhet | GitGuardian | ðŸ”´ | Infra | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-05-18

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T116 | UTF-8 BOM borttagen frÃ¥n ga4-dashboard/package.json (EF BB BF). InnehÃ¥llet ofÃ¶rÃ¤ndrat. Ã…tgÃ¤rdat 2026-05-29. | 2026-05-18 | Fas 12 | Veckorapport | ðŸŸ  | Dev | âœ” |
| T117 | 13 GA4-events i app.js bytta frÃ¥n Title Case till snake_case (premium_activated, checkbox_toggle, note_saved, preview_cta_clicked, bill_added, bill_scanned_qr, bill_scanned_photo_only, doc_generated x2, plan_completed, plan_printed, paywall_cta_clicked, shared_plan_opened). Dashboard server.js dual-querar gamla + nya namn (T101) sÃ¥ historisk data bevaras. Ã…tgÃ¤rdat 2026-05-29. | 2026-05-18 | Fas 12 | Veckorapport | ðŸŸ¡ | Analytics | âœ” |
| T118 | Roadmap-status synkad: T106 (UptimeRobot) markerad âœ” â€” T111 âœ” bekrÃ¤ftar att UptimeRobot sattes upp 2026-05-11 men T106 stod kvar som â˜. Uppdaterat i detta commit. | 2026-05-18 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-05-25

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T119 | om.html tillagd i sitemap.xml (priority 0.5, monthly). Sajten hade sidan men sitemap missade den. Ã…tgÃ¤rdat 2026-05-29. | 2026-05-25 | Fas 12 | Veckorapport | ðŸŸ  | SEO | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-05-29

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T120 | Cache-busting fÃ¶renat pÃ¥ 33 HTML-sidor: `style.css` â†’ `style.css?v=3` (fÃ¶rut bara index.html versionerad). Eliminerar stale-CSS-risk efter deploy. | 2026-05-29 | Fas 12 | Dagsrapport | ðŸ”´ | Dev | âœ” |
| T121 | h1-hierarki: index.html har nu exakt en h1 (landing-headline). plan-title och co-title demoteras till h2; landing-eyebrow till p. TvÃ¥ trasiga slut-taggar i WIP rÃ¤ttade samtidigt. | 2026-05-29 | Fas 12 | Dagsrapport | ðŸŸ  | A11y | âœ” |
| T122 | Tokenisera 135 hÃ¥rdkodade hex-fÃ¤rger i inline `style=`. Inte pÃ¥bÃ¶rjat â€” krÃ¤ver designpass mot `style-tokens.css`. | 2026-05-29 | Fas 12 | Dagsrapport | ðŸŸ¡ | Design | â˜ |
| T123 | De-inlining: utility-klasser (.u-*) tillagda i style.css och applicerade pÃ¥ auth-modal.html + vad-gora-nar-nagon-dor.html. ~50 nya utility-klasser. Ã…terstÃ¥r: rulla ut pÃ¥ Ã¶vriga sidor med inline style=. | 2026-05-29 | Fas 12 | Dagsrapport | ðŸŸ¢ | Dev | â§– |
| T124 | Skrota delningsfunktionen: ta bort SHARED-objekt, isOwnerMode/isReadOnly/isSharedEdit, assignee/participants-system, share-modal, supabase share-API. Onboarding 6â†’4 steg. Rensa ~1 090 rader kod (app.js, index.html, style.css, supabase-client.js). â€” 2026-05-30 | 2026-05-30 | Fas 12 | Session | ðŸ”´ | Dev | âœ” |
| T125 | 7 nya tasks: viktiga_dokument (today, alltid), aktemanskapsforord (week, make), livforsakring_ansokan (week, alltid), vardepapper_hantering (week, vardepapper), barnpension_ansokan (week, barn), omstallningspension (week, make), autogiron_avsluta (later, alltid). 2 nya onboarding-checkboxar: vardepapper + barn. â€” 2026-05-30 | 2026-05-30 | Fas 12 | Session | ðŸŸ  | Content | âœ” |
| T126 | Bouppteckning-formulÃ¤r: ny tab i plan-skÃ¤rmen med tre sektioner (dÃ¶dsbodelÃ¤gare, tillgÃ¥ngar, skulder). Sammanfattningsrad med nettovÃ¤rde. localStorage-persistens via `efterplan_bouppteckning`. â€” 2026-05-30 | 2026-05-30 | Fas 12 | Session | ðŸŸ  | Dev | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-06-01

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T127 | Engelska "deceased" i barnpension_ansokan-beskrivning. Ã…tgÃ¤rdat 2026-08-13 (hittat i samband med T192-arbetet): bytt till "den avlidne hade". `app.js`. | 2026-06-01 | Fas 12 | Veckorapport | ðŸŸ  | Content | âœ” |
| T128 | Sitemap lastmod stale â€” sitemap.xml visar `lastmod>2026-05-04` fÃ¶r flertalet sidor (bouppteckning-guide.html, vad-gora-nar-nagon-dor.html, arvskifte-guide.html m.fl.) men dessa sidor har uppdaterats i commits sedan dess. Uppdatera lastmod-datum per `git log --format="%ai" -- <fil>` fÃ¶r respektive URL. Fil: sitemap.xml. Ã…tgÃ¤rdat: samtliga 33 lastmod-datum omrÃ¤knade frÃ¥n faktiskt `git log`-datum per fil. | 2026-06-01 | Fas 12 | Veckorapport | ðŸŸ  | SEO | âœ” |
| T129 | share-modal.html Ã¶verblivet spÃ¶ke â€” T124 dokumenterade att share-modal skrotades (commit 59ddcde) men filen share-modal.html (183 rader) finns kvar i repot. Inga referenser i index.html eller app.js. Ta bort filen. Fil: share-modal.html. Ã…tgÃ¤rdat: filen borttagen (bekrÃ¤ftat inga inbÃ¤ddningar, bara omnÃ¤mnanden i historiska rapporter/roadmap). | 2026-06-01 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-06-08

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T130 | package-lock.json saknas i repo-root: `npm outdated` visar @supabase/supabase-js och stripe som MISSING. KÃ¶r `npm install` i repo-root och committa package-lock.json. ga4-dashboard/ har sin egen package-lock.json och pÃ¥verkas inte. Fil: package.json (root). Ã…tgÃ¤rdat: `npm install --package-lock-only`, committad, 0 sÃ¥rbarheter. | 2026-06-08 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |
| T131 | HTTP 403 vid automatisk live-check: efterplan.se svarar 403 Forbidden fÃ¶r alla automatiserade requests (WebFetch + Python urllib). Trolig orsak: Vercel Bot Protection. Verifiera att UptimeRobot (T111) fortfarande nÃ¥r sajten och justera Bot Protection-nivÃ¥ i Vercel Dashboard om nÃ¶dvÃ¤ndigt. Fil: Vercel Dashboard â†’ Security. | 2026-06-08 | Fas 12 | Veckorapport | ðŸŸ  | Infra | â˜ |
| T132 | weekly-report.yml committar inte roadmap.md. **Ã…tgÃ¤rdat 2026-09-27:** `git add roadmap.md` tillagt i commit-steget i `.github/workflows/weekly-report.yml`. | 2026-06-08 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-06-15

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T133 | bouppteckning_saved analytics saknas â€” `boppSave()` (app.js:2286) kallar inte `track()`. Bouppteckning-formulÃ¤ret (T126, shipad 2026-05-30) genererar inga GA4-events, dvs. vi kan inte mÃ¤ta hur mÃ¥nga anvÃ¤ndare aktiverar funktionen. LÃ¤gg till `track('bouppteckning_saved', { delbagare: boppData.delbagare.length, tillgangar: boppData.tillgangar.length, skulder: boppData.skulder.length })` i `boppSave()`. Fil: app.js:2286. Ã…tgÃ¤rdat, med justering: `boppSave()` triggas per tangenttryck (oninput), sÃ¥ eventet skickas en gÃ¥ng per session (guard-flagga) istÃ¤llet fÃ¶r pÃ¥ varje anrop â€” annars hade det spammat GA4. | 2026-06-15 | Fas 12 | Veckorapport | ðŸŸ  | Analytics | âœ” |
| T134 | ga4-dashboard/public/index.html saknar meta description â€” `grep -rL 'meta name="description"'` flaggar dashboardens index-sida. LÃ¤gg till `<meta name="description" content="Efterplan GA4-dashboard â€” intern analys">` i `<head>`. Fil: ga4-dashboard/public/index.html. | 2026-06-15 | Fas 12 | Veckorapport | ðŸŸ¡ | SEO | âœ” |

---

# ðŸ§­ STRATEGISESSION â€” 2026-07-18

ðŸ’¡ Prioriterat: en sak i taget. Bygg T135 (deadline-motor) klart innan T136 pÃ¥bÃ¶rjas.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T135 | Deadline-motor: rÃ¤kna ut lagstadgade frister automatiskt frÃ¥n dÃ¶dsdatum och visa som konkreta kalenderdatum. Byggd 2026-08-11: **dÃ¶dsdatum fanns inte i onboarding trots vad tickettexten antog** â€” nytt frivilligt datumfÃ¤lt tillagt i steg 3 (`index.html`, `state.deathDate`). Ny motor `addMonths()`/`addDays()`/`applyDeadlines()` i `app.js` berÃ¤knar bouppteckningsfrist (+3 mÃ¥n) och Skatteverket-inlÃ¤mning (+4 mÃ¥n) som datum pÃ¥ `bouppteckning`-kortet, samt hyresuppsÃ¤gning (+30 dagar) pÃ¥ `hyresratt_uppsagning`-kortet. DÃ¶dsboanmÃ¤lan (+2 mÃ¥n) hÃ¥lls medvetet mjuk ("runt â€¦ eller tidigare") eftersom exakt kommunregel fortfarande Ã¤r overifierad â€” en falskt exakt deadline hade skapat onÃ¶dig stress. Sidofix: `OB_TOTAL` var felaktigt satt till 3 trots 4 onboarding-steg (fel antal progress-dots) â€” rÃ¤ttat till 4. | 2026-07-18 | Fas 12 | Session | ðŸ”´ | Dev | âœ” |
| T136 | PÃ¥minnelsemejl om deadlines â€” Ã¥teranvÃ¤nder T135:s datumberÃ¤kningar + befintlig e-postinfra (Supabase-inloggning/synk finns redan, se T051-T053). Skicka mejl X veckor innan bouppteckningsfrist och innan inlÃ¤mningsfrist. MÃ¥ste kunna stÃ¤ngas av frivilligt, ej tvingande. Bygg efter T135. | 2026-07-18 | Fas 12 | Session | ðŸŸ¡ | Dev | âœ” | Se T228 â€” byggt 2026-09-27. |

---

## ðŸ’¡ MÃ–JLIGA EXPANSIONER (ej prioriterade, ej pÃ¥bÃ¶rjade â€” en sak i taget, bygg T135/T136 fÃ¤rdigt fÃ¶rst)

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T137 | ArvsfÃ¶rdelningslogik i bouppteckningsmodulen (utÃ¶kar T126): lÃ¤gg till sÃ¤rkullbarns rÃ¤tt till direkt arvslott (med mÃ¶jlighet till arvsavstÃ¥ende enligt 3 kap 9 Â§ Ã„B), laglottsberÃ¤kning vid testamente (halva legala arvslotten), sambo-bodelning (endast samboegendom, inte hela boet). **Byggd 2026-10-04:** civilstÃ¥nd vÃ¤ljs i bouppteckningsfliken; gift â†’ gemensamma barn efterarv, sÃ¤rkullbarn direkt (kan avstÃ¥); sambo â†’ bodelning av samboegendom, barn Ã¤rver direkt; ensam â†’ barn Ã¤rver direkt; laglott visas vid testamente. UtanfÃ¶r: giftorÃ¤ttsbodelning, basbeloppsregler, arvsklass 2â€“3, istadarÃ¤tt. | 2026-07-18 | Fas 12 | Session | ðŸŸ¢ | Dev | âœ” |
| T138 | Arvskiftesavtal som dokumentgenerator â€” idag finns bara arvskifte-guide.html (informationstext), inget genererbart avtal. Bygg i samma stil som befintliga brev (fullmakt, F-skatt etc): tillgÃ¥ngar, fÃ¶rdelning mellan delÃ¤gare, signaturfÃ¤lt. Bygg efter T137 Ã¤r klar. | 2026-07-18 | Fas 12 | Session | ðŸŸ¢ | Dev | â˜ |
| T139 | Brev till hyresvÃ¤rd (uppsÃ¤gning hyresrÃ¤tt vid dÃ¶dsfall) â€” guide finns (tomma-dodsbo.html), inget brev. **Byggd 2026-09-27:** ny brevmall "Till hyresvÃ¤rden" i dokumentgeneratorn â€” visas villkorligt nÃ¤r hyresratt=true, prefylls med relation, har telefonmanus. `app.js`, `index.html`. | 2026-07-18 | Fas 12 | Session | ðŸŸ¢ | Content | âœ” |
| T140 | Brev till Pensionsmyndigheten fÃ¶r efterlevandepension â€” guide finns (efterlevandepension.html), inget brev. **Byggd 2026-09-27:** ny brevmall "Pensionsmyndigheten" â€” omstÃ¤llningspension eller barnpension, vÃ¤ljs automatiskt baserat pÃ¥ state (barn=true â†’ barnpension, giftSambo â†’ omstÃ¤llning), telefonmanus med retroaktivitetsvarning. `app.js`, `index.html`. | 2026-07-18 | Fas 12 | Session | ðŸŸ¢ | Content | âœ” |
| T141 | âš ï¸ Delad lÃ¤nk mellan dÃ¶dsbodelÃ¤gare â€” KONFLIKT MED T124: delningsfunktionen skrotades medvetet 2026-05-30 ("Onboarding 6â†’4 steg", ~1090 rader kod borttagna). Bygg INTE utan ett nytt uttryckligt beslut som river upp T124. Om det Ã¤ndÃ¥ prioriteras: lÃ¶s utan central serverlagring av kÃ¤nslig data (kryptera state i URL eller motsvarande), inte samma modell som skrotades. | 2026-07-18 | Fas 12 | Session | ðŸŸ¢ | Dev | â˜ |
| T142 | Digitalt arv-modul (sociala medier, Google, Apple) â€” FAQ finns redan pÃ¥ startsidan, ingen guidad sektion eller brevmallar per plattform. | 2026-07-18 | Fas 12 | Session | ðŸŸ¢ | Content | â˜ |

---

# ðŸ§­ STRATEGISESSION â€” 2026-08-11

ðŸ’¡ Extern research (Gemini-marknadsanalys, digitalisering av dÃ¶dsbohantering SE/UK/US) destillerad och mappad mot befintlig arkitektur. FullstÃ¤ndigt underlag: `research/dodsbo-marknadsanalys-2026-08.md`.

- Tre arkitektoniska byggstenar Efterplan saknar mot de vassaste internationella aktÃ¶rerna (Settld, Empathy): (1) BankID-flerpartssignering av dÃ¶dsbofullmakt kopplad till dÃ¶dsfallsintyg, (2) PSD2 Open Banking-skanning som auto-upptÃ¤cker avtal ur transaktionshistorik, (3) orkestrering i tre kanaler (API / sÃ¤ker e-post / print-on-demand) mot leverantÃ¶rer.
- **Beslut:** Gemini-visionen tas in som **research-tickets (T149â€“T153)** i Fas 14, inte byggtickets. Inget byggs fÃ¶rrÃ¤n underlag finns OCH bolaget Ã¤r registrerat (T003/T004 fortfarande â˜ â€” blockerande fÃ¶rutsÃ¤ttning fÃ¶r seriÃ¶sa bank-/fÃ¶rsÃ¤kringssamtal).
- **Beslut:** T135 (deadline-motor) kvarstÃ¥r som nÃ¤st-pÃ¥-tur, ofÃ¶rÃ¤ndrat. Matchar delvis Gemini Fas 2:s "regelmotor" (uppsÃ¤gningstid rÃ¤knas frÃ¥n dÃ¶dsdatum, ej aviseringsdatum) â€” bekrÃ¤ftar att prioriteringen redan var rÃ¤tt, inget dubbelarbete.
- **Beslut:** Ny funktion **Dokumentcentral** (T143â€“T148, Fas 13) lÃ¤ggs in mellan T135 och T136 â€” "en sak i taget" gÃ¤ller fortsatt: T135 â†’ Dokumentcentral â†’ T136.
- **Beslut (2026-08-11, efter avvÃ¤gning):** T145 byggs som LLM-baserad kategorisering, inte som en deterministisk OCR+regelmotor. Ã–vervÃ¤gdes: en fast regelmotor (textavlÃ¤sning + nyckelordslista mot kÃ¤nda avsÃ¤ndare, samma mÃ¶nster som deadline-motorn) hÃ¶ll principen 100% intakt men missar allt den inte har i listan â€” och dÃ¶dsbon fÃ¥r dokument frÃ¥n ett brett spann av banker/myndigheter/fÃ¶rsÃ¤kringsbolag/hyresvÃ¤rdar/fÃ¶reningar, sÃ¥ fallback till manuell hantering hade blivit vanlig. Ã–verordnad princip: **minsta mÃ¶jliga tid- och energiÃ¥tgÃ¥ng fÃ¶r anvÃ¤ndaren** vÃ¤ger tyngre Ã¤n principiell renhet hÃ¤r â€” LLM-varianten klarar fler dokumenttyper direkt med mindre manuellt jobb fÃ¶r en redan pressad anhÃ¶rig. `readme.md` uppdaterad: principen omformulerad till att gÃ¤lla kÃ¤rnflÃ¶det (checklista/prioritering/deadlines fÃ¶rblir deterministiska), assisterande AI tillÃ¥ten dÃ¤r den mÃ¤tbart minskar anvÃ¤ndarens tidsÃ¥tgÃ¥ng.

---

# ðŸ“„ FAS 13 â€” DOKUMENTCENTRAL
ðŸ’¡ Fota dokument frÃ¥n myndigheter/banker, AI kategoriserar och namnger, flagga som viktig/onÃ¶dig/mellan. Byggs efter T135, fÃ¶re T136.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T143 | Datamodell + ny UI-yta fÃ¶r dokument (flik/sektion i plan-skÃ¤rmen) â€” fÃ¤lt: kategori, namn, flagga, datum, kÃ¤lla. Byggd: ny flik "ðŸ—‚ Arkiv" (`index.html`, `tabcontent-arkiv`), `state.documents` i app.js. Kategori visas som tydlig dekal (`.arkiv-category-badge`) ovanfÃ¶r namnet â€” syns utan att klicka in pÃ¥ dokumentet. Flikens introtext fÃ¶rklarar Ã¤ven *varfÃ¶r* (slippa leta upp papper igen lÃ¤ngre fram), inte bara vad/hur. | 2026-08-11 | Fas 13 | Session | ðŸ”´ | Design | âœ” |
| T144 | Fotografera/ladda upp dokument â€” Ã¥teranvÃ¤nd kamera/QR-scan-mÃ¶nstret frÃ¥n T067 (rÃ¤kningar, app.js). Byggd: `handleDocumentScan()` Ã¥teranvÃ¤nder `compressBillImage()` rakt av, samma `capture="environment"`-input-mÃ¶nster. | 2026-08-11 | Fas 13 | Session | ðŸŸ  | Dev | âœ” |
| T145 | AI-kategorisering: ny serverless-funktion `api/categorize-document.js` som skickar bilden till en vision-kapabel LLM och fÃ¶reslÃ¥r kategori + namn Ã¥t anvÃ¤ndaren. Byggd (Claude Haiku vision via `fetch`, ingen ny dependency). **KrÃ¤ver `ANTHROPIC_API_KEY` i Vercel env â€” inte satt Ã¤n, Owner-Ã¥tgÃ¤rd** (se `.env.example`). Testat lokalt utan nyckeln: fallback till manuell kategori "Ã–vrigt" fungerar felfritt, ingen spÃ¤rr. | 2026-08-11 | Fas 13 | Session | ðŸŸ  | Dev | â§– |
| T146 | 3-lÃ¤gesflagga (viktig / onÃ¶dig / mellan) + filter/sortering pÃ¥ flagga. Byggd och testad (filter, flagg-toggle, avmarkering vid dubbelklick). | 2026-08-11 | Fas 13 | Session | ðŸŸ¡ | Dev | âœ” |
| T146b | Dubblettdetektering: enkel deterministisk hash av bildinnehÃ¥llet (`hashImageData()`) upptÃ¤cker om exakt samma foto laddas upp igen. Vid trÃ¤ff: `confirm()`-dialog innan tillÃ¤gg ("LÃ¤gga till Ã¤ndÃ¥?"). Oavsett svar flaggas alla dokument som delar samma hash med en gul "âš  MÃ¶jlig dubblett"-dekal i listan, omrÃ¤knat vid varje render (sÃ¥ det stÃ¤mmer Ã¤ven efter radering). Testat: skip-vÃ¤gen, lÃ¤gg-till-Ã¤ndÃ¥-vÃ¤gen, och att dekalen fÃ¶rsvinner nÃ¤r ena dubbletten raderas. | 2026-08-11 | Fas 13 | Session | ðŸŸ¡ | Dev | âœ” |
| T147 | Lagring: localStorage fÃ¶r alla, Supabase Storage-synk fÃ¶r inloggade/premium (Ã¥teranvÃ¤nder auth frÃ¥n T051â€“T053). **Ej byggd denna omgÃ¥ng** â€” localStorage-delen klar (`efterplan_documents`, testad Ã¶ver reload), Supabase Storage-synken Ã¤r en egen, stÃ¶rre integration (ny bucket + policies) som medvetet sparades till en egen kÃ¶rning. Byggd 2026-08-27: ny `public.documents`-tabell (metadata: namn/kategori/datum/flagga/hash/storage_path, unik pÃ¥ `(user_id, client_id)`) + privat Storage-bucket `documents` (5MB-grÃ¤ns, image/jpeg|png|webp), RLS pÃ¥ bÃ¥de tabell och `storage.objects` (folder-baserad Ã¤garkontroll `(storage.foldername(name))[1] = auth.uid()::text`, samma mÃ¶nster som Supabase egen dokumentation rekommenderar). Applicerat direkt mot produktions-Supabase via MCP (`apply_migration`), verifierat med `list_tables`/`get_advisors` â€” inga nya sÃ¤kerhetsvarningar utÃ¶ver en mutable-search-path-lint som fixades direkt. Base64-fotot gÃ¥r ALDRIG genom `plans.state_json` (skulle bli extremt ineffektivt) â€” egen vÃ¤g: `dataUrlToBlob()` â†’ `client.storage.from('documents').upload()`, bara metadata + `storage_path` i Postgres-raden. Nytt event-baserat kopplingsmÃ¶nster i `app.js`â†”`supabase-client.js` (samma stil som befintlig `efterplan:state-changed`): `saveDocuments()` sÃ¤nder `efterplan:documents-changed` (debounce 2s, samma mÃ¶nster som `syncToSupabase`), `deleteDocument()` sÃ¤nder ett separat explicit `efterplan:document-deleted` (medvetet INTE en diff mot hela listan â€” en diff hade kunnat radera dokument som bara Ã¤nnu inte hunnit hydreras ner pÃ¥ en ny enhet om en synk triggas innan hydreringen Ã¤r klar; explicit borttagning Ã¤r race-fri). Hydrering vid inloggning (`hydrateDocumentsFromRemote()`, kopplad i bÃ¥de `initSupabase()` och `handleAuthChange('SIGNED_IN')`): hÃ¤mtar anvÃ¤ndarens rader, genererar 24h signerade URL:er fÃ¶r foton, skriver bara in dokument som saknas lokalt (matchat pÃ¥ `client_id`), och `app.js` lyssnar pÃ¥ ett nytt `efterplan:documents-hydrated`-event fÃ¶r att slÃ¥ in dem i `state.documents`/rendera om utan sidladdning. localStorage fÃ¶rblir source-of-truth fÃ¶r icke-inloggade/offline â€” helt ofÃ¶rÃ¤ndrat beteende dÃ¤r. KÃ¤nd begrÃ¤nsning (dokumenterad, inte byggd): signerade URL:er fÃ¶r hydrerade foton fÃ¶rnyas inte automatiskt om de gÃ¥r ut mitt i en lÃ¥ng session (24h bÃ¶r rÃ¤cka i praktiken); lokalt skapade dokument bÃ¤r ingen `_storagePath`-flagga sÃ¥ deras foto laddas upp pÃ¥ nytt (harmlÃ¶st, `upsert:true`) en gÃ¥ng per sidladdning istÃ¤llet fÃ¶r bara en gÃ¥ng per dokuments livstid â€” en bandbreddsoptimering, inte en korrekthetsbugg, medvetet lÃ¤mnad utanfÃ¶r scope. Verifierat: `node --check` pÃ¥ bÃ¥da filerna, en fristÃ¥ende Node-test av `dataUrlToBlob()`-roundtripen (base64 â†’ Blob â†’ tillbaka, byte-fÃ¶r-byte identiskt), samt `mcp__Supabase__get_advisors` efter migrationen. Filer: `supabase-client.js`, `app.js`, `supabase/schema.sql` (dokumentation av samma migration som applicerades mot produktion). | 2026-08-11 | Fas 13 | Session | ðŸŸ¡ | Dev | âœ” |
| T148 | Radering/retention-policy + GDPR-notis fÃ¶r kÃ¤nsliga dokument. Byggd som info + manuell radering (samma mÃ¶nster som integritetssektionen pÃ¥ landningssidan) â€” **inte** automatisk utgÃ¥ngsdatum-radering, det riskerar att ta bort dokument anvÃ¤ndaren fortfarande behÃ¶ver. | 2026-08-11 | Fas 13 | Session | ðŸŸ  | Legal | âœ” |

---

# ðŸ”­ FAS 14 â€” RESEARCH: NÃ„STA GENERATIONS DÃ–DSBOTJÃ„NST
ðŸ’¡ Rena research-tickets ur Gemini-analysen. Inget byggÃ¥tagande â€” underlag mÃ¥ste finnas OCH bolaget vara registrerat (T003/T004) innan en eventuell Fas 15+ kan planeras.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T149 | BankID-anslutning: jÃ¤mfÃ¶r Ã¥terfÃ¶rsÃ¤ljare (Scrive, Signicat, Freja eID) vs. direktavtal med Finansiell ID-Teknik BID AB â€” krav, kostnad, ledtid fÃ¶r flerpartssignering av dÃ¶dsbofullmakt. **Slutsats:** vid dagens trafik (16 sessioner/vecka, lÃ¥ngt under 50 000 autentiseringar/mÃ¥n) Ã¤r Ã¥terfÃ¶rsÃ¤ljare rÃ¤tt vÃ¤g, inte direktavtal â€” Finansiell ID-Teknik krÃ¤ver eget godkÃ¤nnande (2â€“6 veckors handlÃ¤ggning + tekniska/sÃ¤kerhetskrav) och lÃ¶nar sig bara vid hÃ¶ga volymer (ingen mellanhandsavgift men hÃ¶gre implementeringskostnad + eget certifikatansvar). Scrive/Signicat/Freja eID Ã¤r alla abonnemangsprissatta efter volym/anvÃ¤ndare, individuellt fÃ¶rhandlade â€” inget listpris fÃ¶r flerpartssignering specifikt, krÃ¤ver offertfÃ¶rfrÃ¥gan. Referens: BankID-integration generellt 20 000â€“100 000 kr engÃ¥ngskostnad + 300â€“2 500 kr/mÃ¥n + 0,50â€“2,50 kr/autentisering hos en BankID-as-a-Service-leverantÃ¶r. NÃ¤sta steg om detta blir aktuellt: offertfÃ¶rfrÃ¥gan hos Scrive + Freja eID specifikt fÃ¶r flerpartssignering av fullmakt. | 2026-08-11 | Fas 14 | Gemini-analys | ðŸŸ¡ | Research | âœ” |
| T150 | Finns ett API fÃ¶r Skatteverkets dÃ¶dsfallsintyg med slÃ¤ktutredning, eller krÃ¤ver det manuell blankett/Mina sidor idag? **Slutsats:** inget offentligt/allmÃ¤nt API. Skatteverket har en begrÃ¤nsad e-tjÃ¤nst fÃ¶r direktbestÃ¤llning, men den Ã¤r fÃ¶rbehÃ¥llen namngivna aktÃ¶rskategorier â€” begravningsbyrÃ¥er, banker, fÃ¶rsÃ¤kringsbolag, pensionsbolag och krematorier â€” och krÃ¤ver att fÃ¶retagets firmatecknare gÃ¶r en anmÃ¤lan till Skatteverket fÃ¶r Ã¥tkomst. Efterplan (konsumentriktad, ingen av dessa kategorier) skulle alltsÃ¥ inte kvalificera fÃ¶r e-tjÃ¤nsten Ã¤ven om den ville; privatpersoner/dÃ¶dsbodelÃ¤gare bestÃ¤ller Ã¤ven fortsatt via blankett eller Mina sidor. Ingen kodbar integration mÃ¶jlig utan att bli en registrerad aktÃ¶r i en av de tillÃ¥tna kategorierna. | 2026-08-11 | Fas 14 | Gemini-analys | ðŸŸ¡ | Research | âœ” |
| T151 | PSD2/Open Banking-leverantÃ¶rer i Sverige (Tink/Visa, Enable Banking, Neonomics) â€” pris, licenskrav (AISP via TPP vs. eget FI-tillstÃ¥nd), GDPR-implikationer av att lÃ¤sa 12 mÃ¥naders transaktionshistorik fÃ¶r en avliden persons konto. **Slutsats:** eget AISP-tillstÃ¥nd hos Finansinspektionen kostar ~138 000 kr i ansÃ¶kningsavgift plus lÃ¶pande regulatoriska krav (kapitalkrav, ansvarsfÃ¶rsÃ¤kring) â€” inte rimligt fÃ¶r Efterplans skala. RÃ¤tt vÃ¤g Ã¤r att gÃ¥ via en redan licensierad TPP-aggregator (Neonomics: AISP/PISP-licens passporterad frÃ¥n Norge, 98+ bankkopplingar via en API; Tink, numera del av Visa, motsvarande men frÃ¤mst riktat mot stÃ¶rre fintech-kunder) â€” prissÃ¤ttning fÃ¶r bÃ¥da Ã¤r offert-baserad, inget listpris hittat. **StÃ¶rsta hindret Ã¤r dock inte pris utan juridiskt**: PSD2/AISP-samtycke fÃ¶rutsÃ¤tter att kontohavaren sjÃ¤lv (den levande) godkÃ¤nner delning â€” det finns inget etablerat flÃ¶de fÃ¶r att en dÃ¶dsbodelÃ¤gare ska kunna bevilja AISP-samtycke Ã¥ en avliden persons vÃ¤gnar, det Ã¤r en separat, oprÃ¶vad GDPR/dÃ¶dsbo-juridisk frÃ¥ga som bÃ¶r juridikgranskas innan nÃ¥gon teknisk integration pÃ¥bÃ¶rjas. | 2026-08-11 | Fas 14 | Gemini-analys | ðŸŸ¡ | Research | âœ” |
| T152 | Standardiserad dÃ¶dsbofullmakt â€” kartlÃ¤gg krav hos Nordea/SEB/Swedbank/Handelsbanken/LÃ¤nsfÃ¶rsÃ¤kringar Bank, bedÃ¶m om ett gemensamt digitalt format Ã¤r realistiskt. **Slutsats:** alla fem storbanker tillhandahÃ¥ller egna fullmaktsblanketter fÃ¶r dÃ¶dsbon (Swedbank och Nordea har publika PDF:er, Ã¶vriga liknande via kontor/webb), innehÃ¥llsmÃ¤ssigt ofta lika (kryssrutor fÃ¶r vilka Ã¥tgÃ¤rder fullmakten ska tÃ¤cka) men **formatmÃ¤ssigt separata och icke-utbytbara** â€” ingen bank tycks acceptera en annan banks blankett. Inget tecken pÃ¥ en pÃ¥gÃ¥ende branschgemensam standardiseringsinitiativ. Ett gemensamt digitalt format Ã¤r alltsÃ¥ inte realistiskt att bygga ensidigt (Efterplan kan inte tvinga fram bankaccept) â€” mest realistiska vÃ¤gen Ã¤r att generera respektive banks EGEN blankett ifylld med samma grunddata (namn, personnr, delÃ¤gare), inte en universell ersÃ¤ttare. Matchar T138 (arvskiftesavtal-generator) bÃ¤ttre Ã¤n ett nytt gemensamt format. | 2026-08-11 | Fas 14 | Gemini-analys | ðŸŸ¢ | Research | âœ” |
| T153 | B2B2C-distribution â€” sondera intresse hos 2â€“3 svenska livfÃ¶rsÃ¤kringsbolag (Folksam, Skandia, LÃ¤nsfÃ¶rsÃ¤kringar) eller fackfÃ¶rbund fÃ¶r en gratis mervÃ¤rdestjÃ¤nst vid utbetalning. KrÃ¤ver registrerat bolag (T003/T004) innan seriÃ¶sa samtal | 2026-08-11 | Fas 14 | Gemini-analys | ðŸŸ¢ | Partnership | â˜ |

---

# ðŸŽ¨ STRATEGISESSION â€” 2026-08-11 (design)

ðŸ’¡ Design-direktiv delat av Owner ("jag vill bort frÃ¥n generic ai") + tre inspirationsbilder: en lavendelfÃ¤rgad AI-agent-sajt (mjuk gradient-hero), en grÃ¶n vÃ¤xtsajt (uttryckligen ett exempel att **undvika** â€” fÃ¶r lekfullt/consumer fÃ¶r dÃ¶dsbohantering), och "Aurem"-wellnessappen (mjuka gradient-kort, stat-block "120K+ mindful sessions completed").

- **Inte ett blankt blad:** ett tidigare pass (`style-tokens.css`, "Redesign 2026", live via `index.html:119-120`) har redan flyttat sajten mot varma oklch-toner (sand/sage/terrakotta), Fraunces-serif + IBM Plex Sans, mjuka radier (6â€“18px) och varma radial-gradients pÃ¥ body. Heron (`index.html:151-164`) har redan empatisk, konkret copy.
- **KvarstÃ¥r generiskt:** tvÃ¥ kalla blÃ¥ gradient-kort (`paywall-card`/`preview-cta-card`, `style.css:1937-1940` & `1997-2000`), svarta modal-skuggor (`style.css:1288,1500`), missmatchad bas-`--accent` (navy, `style.css:37`, bara override:ad av tokens-filen), och **ingen dedikerad feature/trust-sektion** â€” landningssidan hoppar idag direkt frÃ¥n hero till FAQ.
- **Ã„rlighetsspÃ¤rr:** direktivets punkt om "riktiga siffror som trust-signaler" (Ã  la Aurems "120K+") kan inte uppfyllas Ã¤rligt â€” senaste veckorapporten visar 16 sessioner/15 users den senaste veckan, `plan_generated` i enstaka siffror totalt. En pÃ¥hittad stat vore vilseledande. Se T156.

---

# ðŸŽ¨ FAS 15 â€” DESIGN: BORT FRÃ…N GENERIC AI-LOOK
ðŸ’¡ Ordning: T154 (snabb konsekvensstÃ¤dning) â†’ T155+T156 tillsammans (ny sektion, Ã¤rlig) â†’ T157 (polering).

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T154 | Konsekvenspass: vÃ¤rmde upp `paywall-card`/`preview-cta-card` (var kalla blÃ¥grÃ¥ #C8D6E5/#EDF2F7, nu `--rule-strong`-kant + varm gradient mot `--accent-light`/`--ember-tn`) + svarta modal-skuggor (`rgba(0,0,0,â€¦)` â†’ varm `rgba(60,50,30,â€¦)`, style.css moderna radnr efter tidigare edits). Bas-`--accent` var redan `--ink-teal` (inte navy) sedan T159 (Fas 17) â€” ingen Ã¤ndring behÃ¶vdes dÃ¤r. | 2026-08-11 | Fas 15 | Design-direktiv | ðŸŸ  | Dev | âœ” |
| T155 | Ny "SÃ¥ hÃ¤r gÃ¥r det till"-sektion pÃ¥ index.html mellan hero och FAQ, 4 kort med Ã¤kta steg (svara pÃ¥ frÃ¥gor â†’ personlig checklista â†’ fÃ¤rdigskrivna brev â†’ bocka av i din takt), samma mjuka gradient-kort-sprÃ¥k (alternerande `--accent-light`/`--ember-tn` mot `--paper-card`) som paywall-card. Verifierat i browser: 4 kort renderar i grid med rÃ¤tt gradienter. | 2026-08-11 | Fas 15 | Design-direktiv | ðŸŸ  | Design/Dev | âœ” |
| T156 | Inga fabricerade siffror: verifierat att inga fejkade volym-tal ("120K+"-typ) finns nÃ¥gonstans pÃ¥ sajten (grep, inga trÃ¤ffar). Befintliga kvalitativa trust-badges + den nya Ã¤rliga gratis/49-kr-raden (T169) tÃ¤cker behovet â€” ingen ny siffra tillagd. | 2026-08-11 | Fas 15 | Design-direktiv | ðŸŸ¡ | Content/Legal | âœ” |
| T157 | Hero-polerpass: gav hero-CTA:ns pris-rad (`landing-note--pricing`, tillagd i T169) samma mjuka gradient-kort-behandling som T155:s kort â€” visuell enhetlighet mellan hero och den nya sektionen utan att rÃ¶ra hero-headline/copy. | 2026-08-11 | Fas 15 | Design-direktiv | ðŸŸ¢ | Design | âœ” |

---

# ðŸ’³ FAS 16 â€” QA: BETALNINGSFLÃ–DET
ðŸ’¡ ErsÃ¤tter/konkretiserar T032 ("Test full purchase flow", â§– sedan tidigare) â€” pengar ska aldrig vara det som gÃ¶r att fÃ¶rtroendet brister.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T158 | Verifiera att betalningsfunktionen Ã¤r 100 % fungerande och korrekt â€” hela flÃ¶det end-to-end, inte bara enskilda smoke-tester: (1) **Checkout** â€” `api/create-checkout.js`, riktig Stripe Checkout-session i test-lÃ¤ge, rÃ¤tt pris/valuta/locale; (2) **Webhook** â€” `api/stripe-webhook.js`, signaturverifiering med aktuell `STRIPE_WEBHOOK_SECRET` (roterad efter T115-lÃ¤ckan â€” bekrÃ¤fta att nuvarande secret i Vercel faktiskt matchar Stripe Dashboard), att `purchases`-raden skapas korrekt i Supabase; (3) **Felfall** â€” avbruten betalning (`cancel_url`), nekat kort, dubbel-webhook (idempotens â€” samma event levereras tvÃ¥ gÃ¥nger ska inte ge dubbelt premium eller dubbel rad), webhook som kommer innan `verify-checkout.js` hinner kÃ¶ras klientsidan; (4) **Kvitton** â€” Stripes automatiska kvitto gÃ¥r ut, rÃ¤tt belopp/moms/avsÃ¤ndare; (5) **`check-premium.js`** â€” premium lÃ¥ses upp korrekt bÃ¥de via session-redirect och vid inloggning pÃ¥ ny enhet (Supabase-synk). KÃ¶r i Stripe test-lÃ¤ge med testkort (4242â€¦, samt ett kort som nekas) innan ev. skarpt test. | 2026-08-11 | Fas 16 | Owner | ðŸ”´ | QA | â˜ |

---

# ðŸ”Ž FAS 17 â€” AUDIT-FYND (2026-08-11)
ðŸ’¡ FrÃ¥n `/audit`-kÃ¶rning mot https://efterplan.se (canvas-upplÃ¶st kontrastmÃ¤tning, verifierad live â€” inga false positives). FullstÃ¤ndig rapport i sessionen, sammanfattad hÃ¤r. T154 (kalla gradient-kort/svarta skuggor) redan trackad sen tidigare, dupliceras inte.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T159 | `--accent` (sage) klarar inte WCAG AA (4.5:1) som textfÃ¤rg i nÃ¥got vanligt lÃ¤ge: pÃ¥ `--paper` 3.60:1, pÃ¥ `--paper-card` 3.82:1, pÃ¥ `--accent-light` (badges/pills) 3.21:1, `--ember`/`--ember-tn` 3.19:1, vit text pÃ¥ `--accent`-knapp (t.ex. "BÃ¶rja hÃ¤r") 4.16:1. 56 trÃ¤ffar pÃ¥ `color: var(--accent)` i style.css. Token-nivÃ¥-fix (mÃ¶rka `--accent` nÃ¥got, eller infÃ¶r separat `--accent-text`) lÃ¶ser troligen alla stÃ¤llen pÃ¥ en gÃ¥ng istÃ¤llet fÃ¶r 56 enskilda regler. Redan lÃ¶st av Fas 15â€“18-omfÃ¤rgningen: `--accent` Ã¤r numera djup ink-teal `#1F3A4E` (inte lÃ¤ngre sage) â€” omrÃ¤knat, `--accent` pÃ¥ `--paper` ger 10.6:1, vit text pÃ¥ `--accent`-knapp 11.9:1, ruvigt Ã¶ver AAA. Ingen ytterligare Ã¤ndring behÃ¶vs. | 2026-08-11 | Fas 17 | Audit | ðŸŸ  | A11y | âœ” |
| T160 | Nav-lÃ¤nkar under tumstorlek pÃ¥ mobil (375px): "Om" 22Ã—22px, "Integritet" 62Ã—22px, "Mitt konto" 65Ã—22px â€” fristÃ¥ende nav-element, kvalificerar inte fÃ¶r WCAG 2.5.8:s undantag fÃ¶r lÃ¤nkar i lÃ¶ptext. Ã–ka klickyta (padding) till minst 24Ã—24px, helst 44Ã—44. Ã…tgÃ¤rdat: `.nav-text-link` fick padding 13px 8px + motsvarande negativ margin (hÃ¥ller kvar visuell position/spacing), ~44px klickyta. | 2026-08-11 | Fas 17 | Audit | ðŸŸ¡ | A11y | âœ” |
| T161 | Svagare fokusindikator pÃ¥ tre textfÃ¤lt (`.ob-text-input`, `.text-input`, `.arkiv-name`) â€” `outline: none` ersatt bara med `border-color`-Ã¤ndring, ingen outline/skugga. Avviker frÃ¥n den annars starka globala `:focus-visible`-regeln (3px outline, style.css:106) som resten av sajten fÃ¥r gratis. GÃ¶r konsekvent. Ã…tgÃ¤rdat: `outline: none` borttaget frÃ¥n alla tre â€” globala `:focus-visible`-regeln (3px outline) syns nu igen, utÃ¶ver deras egna border/box-shadow-highlights. | 2026-08-11 | Fas 17 | Audit | ðŸŸ¢ | A11y | âœ” |
| T162 | Rate-limit pÃ¥ `api/categorize-document.js` â€” endpointen Ã¤r Ã¶ppen fÃ¶r alla besÃ¶kare utan inloggning och drar riktiga Anthropic-tokens (Haiku 4.5, ~$0,003â€“0,004/anrop) frÃ¥n Owners konto per fotograferat dokument. Vid dagens trafik (16 sessioner/vecka) inte akut, men spam/missbruk kan dra kostnad obegrÃ¤nsat eftersom nyckeln Ã¤r delad server-side mellan alla anvÃ¤ndare. LÃ¤gg till enkel rate-limit (t.ex. per IP via Vercel KV/Upstash, eller ett dagligt tak) innan trafiken vÃ¤xer. LÃ¶st utan ny infra: dagligt tak (30/IP/dygn) backat av en ny `rate_limits`-tabell + `rate_limit_increment()`-funktion i befintliga Supabase-projektet (samma secret som T163), fail-open om kontrollen sjÃ¤lv failar. | 2026-08-11 | Fas 13 | Session | ðŸŸ¡ | Infra | âœ” |

---

# ðŸ› ï¸ FAS 18 â€” SKARP VERIFIERING AV BETALNINGSFLÃ–DET (2026-08-12)
ðŸ’¡ Kopplat till T158. Under en session kopplades Vercel-, Stripe- och Supabase-CLI direkt (device-/token-auth) fÃ¶r att slippa gissa sig fram i webbgrÃ¤nssnitt â€” rekommenderas fÃ¶r liknande felsÃ¶kning framÃ¶ver. Tre separata, tidigare okÃ¤nda produktionsfel hittades och Ã¥tgÃ¤rdades i skarp drift:
1. **Pris-inkonsekvens** â€” UI visade 149 kr trots att T033 redan bytt till 49 kr. Fixat i `app.js`/`index.html`/GA4-dashboard.
2. **Stripe helt ouppsatt fÃ¶r Efterplan** â€” `STRIPE_PRICE_ID` innehÃ¶ll av misstag en gammal secret key, ingen Efterplan-produkt fanns i Stripe, `STRIPE_SECRET_KEY` var en utgÃ¥ngen lokal Stripe CLI-sandlÃ¥denyckel (`sk_test_...FcAIuM`, utgick 2026-07-18), och ingen webhook-destination fanns fÃ¶r `efterplan.se` Ã¶verhuvudtaget. Ny produkt/pris (49 kr engÃ¥ng), ny begrÃ¤nsad live-nyckel (endast Checkout Sessions-skriv) och ny webhook-destination skapades. `/api/create-checkout` â†’ `/api/stripe-webhook` verifierat end-to-end med en signerad testhÃ¤ndelse (200, `purchases`-rad skapad).
3. **Supabase-projektet pausat** â€” se T163.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T163 | Supabase-projektet (`vjupkemzpnrahdsljenl`) hade auto-pausats av inaktivitet (gratisnivÃ¥) och slutade svara pÃ¥ DNS (NXDOMAIN) â€” slog tyst ut ALLT som gÃ¥r via databasen (inloggning, sparade planer, kÃ¶phistorik), inte bara webhooken. Manuellt Ã¥terstÃ¤llt 2026-08-12, ingen datafÃ¶rlust upptÃ¤ckt. Ã–vervÃ¤g (a) uppgradera till betald Supabase-nivÃ¥ (ingen auto-pause), eller (b) ett schemalagt keep-alive-anrop (t.ex. GitHub Actions cron mot ett lÃ¤tt API-anrop var 6:e dag) som hÃ¥ller projektet aktivt, sÃ¥ detta inte hÃ¤nder tyst igen. LÃ¶st: `.github/workflows/supabase-keepalive.yml` â€” pingar `users`-tabellen (mÃ¥ndag+torsdag, 3â€“4 dagars marginal under 7-dagarsgrÃ¤nsen) via `SUPABASE_SECRET_KEY`, failar synligt i Actions-fliken om nyckeln saknas eller anropet misslyckas. | 2026-08-12 | Fas 18 | Session | ðŸ”´ | Infra | âœ” |
| T164 | T158 kvarstÃ¥r delvis â€” checkout, webhook-mottagning och statuskontroll Ã¤r verifierat i skarp drift, men felfallen Ã¤r inte testade: avbruten betalning, nekat kort, dubbel-webhook (idempotens), webhook som kommer innan `verify-checkout.js` hunnit kÃ¶ras klientsidan, Stripes automatiska kvitto, samt `check-premium.js`-synk vid inloggning pÃ¥ ny enhet. **Kodgranskning 2026-09-27:** (1) Annullerad/nekat kort â†’ `payment_status !== 'paid'`-check i bÃ¥de webhook och verify-checkout, app visar toast âœ“; (2) Dubbel-webhook â†’ upsert med `onConflict: stripe_session_id` Ã¤r idempotent âœ“; (3) Race condition webhook/verify-checkout â†’ bÃ¥da gÃ¶r samma upsert, ingen fÃ¶rlorad data âœ“; (4) check-premium ny enhet â†’ fungerar via email eller user_id âœ“; (5) Stripes automatiska kvitto â†’ hanteras av Stripe, ingen kod krÃ¤vs âœ“. Bugg fixad: `verify-checkout` gav 500 pÃ¥ `cs_`-prefixat ogiltigt session-ID â€” ger nu 400 (`session_not_found`) fÃ¶r `StripeInvalidRequestError`. Live-test: `check-premium` âœ“, `create-checkout` âœ“ (STRIPE_PRICE_ID fixad i T265). Ã…terstÃ¥r: manuellt browsertest av declined-card-flÃ¶det (nekat kort pÃ¥ Stripes checkout-sida), krÃ¤ver Owner. | 2026-08-12 | Fas 18 | Session | ðŸŸ¡ | QA | âœ” |

---

# ðŸ”Ž FAS 19 â€” CHATGPT-AUDIT AV EFTERPLAN.SE (2026-08-12)
ðŸ’¡ Extern audit av efterplan.se frÃ¥n ChatGPT (juridisk/faktamÃ¤ssig precision, UX-copy, SEO, fÃ¶rtroendesignaler). Konkreta sakpÃ¥stÃ¥enden verifierade mot faktisk kod/innehÃ¥ll i repot innan de loggades â€” ChatGPT kunde bara granska sajten utifrÃ¥n och flaggade sjÃ¤lv flera saker som overifierbara. T165 visade sig vara allvarligare Ã¤n ChatGPT kunde bekrÃ¤fta: verifierat direkt mot `api/categorize-document.js` (testad live tidigare i denna session), inte bara antaget.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T165 | `index.html:924` â€” "Dokumenten lÃ¤mnar aldrig din enhet â€” ingen AI-tjÃ¤nst sparar bilden" var konkret felaktigt. Ã…tgÃ¤rdat: arkiv-privacy-note skriver nu korrekt att bilden skickas till Anthropics API vid AI-kategorisering/fÃ¶rklaring (utan permanent lagring dÃ¤r), medan dokumenten sjÃ¤lva bara lagras lokalt. | 2026-08-12 | Fas 19 | ChatGPT-audit | ðŸ”´ | Content | âœ” |
| T166 | `index.html:173`, `:178` + samma formulering i `checklista-dodsbo.html`, `dodsbo-checklista-7-dagar.html`, `vad-gora-nar-nagon-dor.html` â€” "begravningsbyrÃ¥n ... skÃ¶ter registreringen hos Skatteverket" var missvisande. Ã…tgÃ¤rdat i alla 5 stÃ¤llen: bytt till "hjÃ¤lper till med det praktiska kring begravningen och guidar dig vidare". | 2026-08-12 | Fas 19 | ChatGPT-audit | ðŸ”´ | Content | âœ” |
| T167 | `index.html:209` â€” "Efterlevandepension kan utbetalas till make, maka, sambo och barn under 20 Ã¥r" var fÃ¶r brett. Ã…tgÃ¤rdat: omskrivet till "Efterlevande make, maka eller i vissa fall sambo kan ha rÃ¤tt till omstÃ¤llningspension... Barn kan ha rÃ¤tt till barnpension och efterlevandestÃ¶d." `efterlevandepension.html` rÃ¤ttad separat i T180. | 2026-08-12 | Fas 19 | ChatGPT-audit | ðŸ”´ | Content | âœ” |
| T168 | `index.html:157` â€” "Inga formulÃ¤r, ingen registrering" Ã¶verdrev. Ã…tgÃ¤rdat: bytt till "Ingen registrering krÃ¤vs fÃ¶r att komma igÃ¥ng". | 2026-08-12 | Fas 19 | ChatGPT-audit | ðŸŸ  | Content | âœ” |
| T169 | FÃ¶rtydliga grÃ¤ns mellan gratis och betalt (49 kr) tidigare i flÃ¶det. Ã…tgÃ¤rdat: ny rad under hero-CTA pÃ¥ index.html â€” "Gratis: checklista, plan, PDF, bouppteckningsÃ¶versikt / 49 kr engÃ¥ngsbetalning: obegrÃ¤nsat med brev â€” fullmakt, dÃ¶dsannons och mer" â€” synlig innan onboarding startas. | 2026-08-12 | Fas 19 | ChatGPT-audit | ðŸŸ  | Conversion | âœ” |
| T170 | Positionera Efterplan tydligare mot Efterlevandeguiden/myndigheterna. Ã…tgÃ¤rdat: ny mening i "Om Efterplan"-sektionen pÃ¥ index.html som Ã¤ger "myndigheterna sÃ¤ger vad som gÃ¤ller, Efterplan hjÃ¤lper dig gÃ¶ra det". | 2026-08-12 | Fas 19 | ChatGPT-audit | ðŸŸ¡ | Content | âœ” |
| T171 | SEO-guidesidorna saknade pÃ¥stods en enhetlig CTA tillbaka till produkten. Verifierat: alla 31 guide-/SEO-sidor har redan en `seo-cta`-ruta med lÃ¤nk till produkten i slutet av artikeln (om Ã¤n inte identisk ordalydelse pÃ¥ alla) â€” ingen Ã¤ndring behÃ¶vdes. | 2026-08-12 | Fas 19 | ChatGPT-audit | ðŸŸ¡ | SEO | âœ” |
| T172 | Audit-item om cache/gamla versioner (149 kr, 6 onboarding-steg i Ã¤ldre crawl). Verifierat lÃ¶st: T128 (sitemap lastmod) och prisfixarna (T032/T033, Fas 18) tÃ¤cker detta â€” priset visar 49 kr konsekvent i nuvarande kod. | 2026-08-12 | Fas 19 | ChatGPT-audit | ðŸŸ¢ | Infra | âœ” |
| T173 | `index.html:232-243` (`#section-integritet`) var inaktuell fÃ¶r inloggade anvÃ¤ndare. Ã…tgÃ¤rdat: texten skiljer nu tydligt mellan lokal-only (ej inloggad â€” ingenting skickas till server) och synkat till Supabase (inloggad, inklusive personnummer), plus att AI-kategorisering/fÃ¶rklaring skickar bilden till Anthropics API. | 2026-08-12 | Fas 19 | Session (delnings-research) | ðŸ”´ | Content | âœ” |

---

# ðŸ§© FAS 20 â€” TRE NYA ANVÃ„NDARFUNKTIONER (2026-08-12)
ðŸ’¡ Brainstorm av vad de nykopplade API:erna (Anthropic, Supabase) kunde anvÃ¤ndas till fÃ¶r att fÃ¶rbÃ¤ttra saker fÃ¶r anvÃ¤ndarna, inte bara utvecklingsflÃ¶det. Sex idÃ©er fÃ¶reslogs, Ã¤garen gallrade bort tvÃ¥ (fel motiverade), godkÃ¤nde fyra. Tre av de fyra byggdes och verifierades live denna session; delning + deadline-mejl designades klart (tre bakgrundsagenter) men sparas till en egen session pga omfattning (ny krypto, tvÃ¥ nya databastabeller, ~15 stÃ¤llen i app.js).

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T174 | RÃ¤kningar: dubblettkontroll vid tillÃ¤gg (OCR-referensnummer + bildhash, samma mÃ¶nster som redan fanns i Arkiv). Flaggar bland annat om den matchande rÃ¤kningen redan Ã¤r markerad betald â€” det faktiska syftet ("undvika dubbelbetalning"). `app.js` (`findDuplicateBill`, `submitBill`). | 2026-08-12 | Fas 20 | Session | ðŸŸ¢ | Feature | âœ” |
| T175 | Arkiv: "âœ¨ FÃ¶rklara detta dokument" â€” AI-fÃ¶rklaring pÃ¥ vanlig svenska av skannade myndighets-/bank-/fÃ¶rsÃ¤kringsbrev. Ny `api/explain-document.js` (samma mÃ¶nster som `categorize-document.js`, 20/dag/IP rate-limit), `explainDocumentAI`/`toggleDocumentExplanation` i `app.js`, cachas per dokument. | 2026-08-12 | Fas 20 | Session | ðŸŸ¢ | Feature | âœ” |
| T176 | Dokument: avsÃ¤ndaradress + postnummerâ†’ort-uppslag i alla 5 relevanta brevmallar (ej Fullmakt). Nytt bundlat dataset `data/postnummer-se.json` (GeoNames CC BY 4.0, 18 870 poster, helt klientsidan â€” inget postnummer skickas till nÃ¥gon extern tjÃ¤nst). Frivilligt, blockerar aldrig brevgenerering. | 2026-08-12 | Fas 20 | Session | ðŸŸ¢ | Feature | âœ” |
| T177 | Delning (lÃ¤sbar lÃ¤nk, krypterad klientsidan â€” ny modell enligt T141, inte den skrotade `share_tokens`-modellen). Byggd och verifierat LIVE 2026-08-13: AES-GCM/Web Crypto i `supabase-client.js` (`createSharedLink`/`resolveSharedLink`), nyckeln lÃ¤mnar aldrig URL-fragmentet (`#k=...`). `shared_plans`-tabell + `create_shared_plan`/`get_shared_plan_v2`-RPC:er i produktions-Supabase (Owner kÃ¶rde migrationen). FullstÃ¤ndig databas-runda testad mot skarp databas: skapa â†’ hÃ¤mta â†’ dekryptera â†’ matchar exakt. "ðŸ”— Dela lÃ¤sbar lÃ¤nk"-knapp + modal i `index.html`, lÃ¤sbar icke-interaktiv vy vid `?shared=`. Delar bara namn+uppgiftslista, aldrig personnummer. | 2026-08-12 | Fas 20 | Session | ðŸŸ¡ | Feature | âœ” |
| T178 | Deadline-mejl, insamlingsdelen. Byggd 2026-08-13: samtyckes-checkbox + e-postfÃ¤lt i onboarding steg 3, `api/subscribe-reminder.js` (rate-limitad, samma mÃ¶nster som categorize-document), `reminder_optins`-tabell skapad i produktions-Supabase (samma migration som T177). Typ (bouppteckning/inlÃ¤mning vs dÃ¶dsboanmÃ¤lan) sÃ¤tts automatiskt. Insamlingsdelen klar och tabellen finns â€” **kvarstÃ¥r:** inget faktiskt mejlutskick byggt, krÃ¤ver separat val av e-postleverantÃ¶r + cron, se roadmap T136. | 2026-08-12 | Fas 20 | Session | ðŸŸ¡ | Feature | â§– Insamling klar, utskick kvarstÃ¥r (T136) |

---

# ðŸ§­ STRATEGISESSION â€” 2026-08-13

ðŸ’¡ Fyra dokument i `research/` (Bankid.md, dodsbo-audit-2026.md, LagÃ¤ndringsaudit.md, "Vad Efterplan bÃ¶r tÃ¤cka.md") gicks igenom och destillerades. GenomgÃ¥ende princip som styrde varje beslut: **om ett tillÃ¤gg gÃ¶r appen mer Ã¶vervÃ¤ldigande eller naggande blir den redundant â€” Efterplan ska vara ett hjÃ¤lpmedel och en lÃ¤ttnad, inte en bÃ¶rda.** Beslut togs frÃ¥ga fÃ¶r frÃ¥ga med Owner:

- **SakfelsrÃ¤ttningar gÃ¥r fÃ¶re allt annat** (ny Fas 21) â€” vÃ¤ger tyngre Ã¤n pÃ¥gÃ¥ende design-/QA-spÃ¥r eftersom de kan kosta anvÃ¤ndare pengar (fel skatteberÃ¤kning) eller skicka dem in i fel process (fel myndighet).
- **Digital/fysisk-indikator (ðŸŸ¢ðŸŸ¡ðŸ”´) byggs** (T192) â€” men med ett viktigt korrektiv frÃ¥n Owner: kopy:n mÃ¥ste alltid utgÃ¥ frÃ¥n att det Ã¤r **den efterlevande/dÃ¶dsbodelÃ¤garens eget BankID** som anvÃ¤nds, aldrig den avlidnes â€” BankID spÃ¤rras automatiskt nÃ¤r Skatteverket registrerar dÃ¶dsfallet.
- **BankID-flerpartssignering av fullmakter byggs INTE** â€” matchar redan T149/Fas 14:s slutsats. Ingen ny ticket, beslutet stÃ¥r kvar: vÃ¤nta tills bolaget Ã¤r registrerat (T003/T004) och trafiken Ã¤r stÃ¶rre.
- **Tre villkorade mini-tillÃ¤gg byggs** (T189â€“T191): dÃ¶dsboanmÃ¤lan-frÃ¥ga, bodelning-pÃ¥minnelse (triggas av civilstÃ¥nd gift/sambo â€” **inte** antal barn, bekrÃ¤ftat med Owner), digital post/Kivra-mening i en befintlig uppgift. Alla tre syns bara nÃ¤r relevanta och landar som enstaka rader, inte nya sektioner.
- **Ingen avslutningskontroll byggs** â€” varken obligatorisk eller valbar. Owners princip: momentan lÃ¤ttnad Ã¤r giltig Ã¤ven om nÃ¥got (t.ex. nÃ¤sta Ã¥rs deklaration) ligger kvar lÃ¥ngt fram â€” appen ska inte riva upp "du Ã¤r klar, andas ut"-kÃ¤nslan fÃ¶r att pÃ¥minna om det.
- **Bostad byggs ut till ett strukturerat delflÃ¶de, fordon hÃ¥lls enkelt** (T193) â€” med en Owner-tillagd twist: en "Anlitar ni mÃ¤klare?"-toggle som filtrerar bort mÃ¤klarhanterade uppgifter frÃ¥n checklistan. Minskar bÃ¶rda snarare Ã¤n Ã¶kar den.
- **Resten av "Vad Efterplan bÃ¶r tÃ¤cka.md" lÃ¤ggs i en bevakningslista** (T194, samma mÃ¶nster som T137â€“T142) â€” fÃ¶rsÃ¤kringar/pension som egna sektioner, deklaration/skatt som avslutande fas, uppdelning av vÃ¤rdepapper/skulder/barn/fordon i undertyper, arbetsgivare-sektion m.fl. Inget av det lÃ¶ser ett lika akut, konkret problem som dÃ¶dsboanmÃ¤lan/bodelning gjorde â€” risk att bara lÃ¤gga pÃ¥ mer att lÃ¤sa utan att bygga nu.

FullstÃ¤ndigt underlag: `research/dodsbo-audit-2026.md`, `research/LagÃ¤ndringsaudit.md`, `research/Bankid.md`, `research/Vad Efterplan bÃ¶r tÃ¤cka.md`.

---

# ðŸ©¹ FAS 21 â€” INNEHÃ…LLSAUDIT: SAKFEL I GUIDE-SIDORNA
ðŸ’¡ KÃ¶rs FÃ–RE Fas 15 (design), Fas 16/18 (betalnings-QA) och Fas 20:s obyggda delar (T177/T178) â€” sakfel som kan kosta anvÃ¤ndare pengar eller skicka dem i fel process vÃ¤ger tyngre Ã¤n det som redan Ã¤r i rÃ¶relse.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T179 | `dodsbo-fastighet.html` pÃ¥stod en fabricerad "uppstegsprincip" fÃ¶r kapitalvinstskatt pÃ¥ Ã¤rvd fastighet. Ã…tgÃ¤rdat: ersatt med korrekt kontinuitetsprincip-text + rÃ¤kneexemplet omrÃ¤knat med ett historiskt anskaffningsvÃ¤rde (800 000 kr + 300 000 kr fÃ¶rbÃ¤ttring) istÃ¤llet fÃ¶r dÃ¶dsdagsvÃ¤rdet. Se `research/dodsbo-audit-2026.md` punkt 1. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | ðŸ”´ | Content | âœ” |
| T180 | `efterlevandepension.html` sa kategoriskt att sambo inte fÃ¥r omstÃ¤llningspension. Ã…tgÃ¤rdat: omskrivet till villkorat "ja, om gemensamt barn (nuvarande/tidigare/vÃ¤ntat) eller tidigare Ã¤ktenskap/partnerskap" + tillÃ¤gg om fÃ¶rlÃ¤ngd omstÃ¤llningspension till 18-Ã¥rsmÃ¥naden. (T167, samma sakfel pÃ¥ index.html, kvarstÃ¥r separat i backlogen.) Se `research/dodsbo-audit-2026.md` punkt 2. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | ðŸ”´ | Content | âœ” |
| T181 | `dodsbo-skulder.html` pÃ¥stod att Skatteverket gÃ¶r dÃ¶dsboanmÃ¤lan. Ã…tgÃ¤rdat i brÃ¶dtext + FAQ-schema: rÃ¤ttat till kommunens socialtjÃ¤nst (20 kap. 8 a Â§ Ã¤rvdabalken), och "dÃ¶dsboet avskrivs" ersatt med att det Ã¤r bouppteckningsplikten som faller bort, inte skulderna. Se `research/dodsbo-audit-2026.md` punkt 3. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | ðŸ”´ | Content | âœ” |
| T182 | `arvskifte-guide.html` och `dodsbo-fastighet.html` angav 1,5 % stÃ¤mpelskatt pÃ¥ lagfart som standard vid arv. Ã…tgÃ¤rdat i bÃ¥da: 825 kr expeditionsavgift som normalfall, 1,5 % bara vid utlÃ¶sen â‰¥85 % av taxeringsvÃ¤rdet (LantmÃ¤teriet). Se `research/dodsbo-audit-2026.md` punkt 4. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | ðŸ”´ | Content | âœ” |
| T183 | LagÃ¤ndring 1 juli 2026 (prop. 2025/26:46) saknades i `bouppteckning-guide.html` och `bouppteckning-tidslinje.html`. Ã…tgÃ¤rdat: personnummer/samordningsnummer-krav fÃ¶r alla kallade tillagt, bestyrkt kopia-kravet borttaget/fÃ¶rtydligat, ny FAQ-post om att digital inlÃ¤mning Ã¤r lagreglerad men Skatteverkets e-tjÃ¤nst INTE lanserad Ã¤n. 3-/4-mÃ¥nadersfristerna orÃ¶rda. Se `research/dodsbo-audit-2026.md` punkt 6 + `research/LagÃ¤ndringsaudit.md` avsnitt 1â€“2. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md + LagÃ¤ndringsaudit.md | ðŸŸ  | Content | âœ” |
| T184 | Terminologibyte "fÃ¶rrÃ¤ttningsmÃ¤n"â†’"fÃ¶rrÃ¤ttningspersoner", "bouppgivarens fÃ¶rsÃ¤kran"â†’"bouppgivarens bekrÃ¤ftelse". Verifierat via repo-vid grep: termerna fÃ¶rekom inte i produktkoden (bara i research-dokumenten sjÃ¤lva) â€” ingen Ã¤ndring behÃ¶vdes. Se `research/LagÃ¤ndringsaudit.md` avsnitt 3. | 2026-08-13 | Fas 21 | LagÃ¤ndringsaudit.md | ðŸŸ¢ | Content | âœ” |
| T185 | `dodsbo-deklaration.html` presenterade 20 %-skattesatsen pÃ¥ nÃ¤ringsinkomst som gÃ¤llande direkt. Ã…tgÃ¤rdat: fÃ¶rklarat att den gÃ¤ller fÃ¶rst frÃ¥n fjÃ¤rde kalenderÃ¥ret efter dÃ¶dsfallsÃ¥ret, progressiv beskattning innan dess. Se `research/dodsbo-audit-2026.md` punkt 7. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | ðŸŸ¡ | Content | âœ” |
| T186 | `fullmakt-dodsbo.html` saknade jÃ¤vssituationen nÃ¤r fÃ¶rÃ¤ldern till ett minderÃ¥rigt dÃ¶dsbodelÃ¤gande barn sjÃ¤lv ocksÃ¥ Ã¤r dÃ¶dsbodelÃ¤gare. Ã…tgÃ¤rdat: tillÃ¤gg om att kontakta Ã¶verfÃ¶rmyndaren fÃ¶r sÃ¤rskild fÃ¶rmyndare/god man i det fallet. FÃ¶rÃ¤ldrabalken 12 kap. 3 Â§. Se `research/dodsbo-audit-2026.md` punkt 8. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | ðŸŸ¡ | Content | âœ” |
| T187 | Deklarationsdatum "senast 2 maj" i `dodsbo-deklaration.html` (2 stÃ¤llen) och `checklista-dodsbo.html` presenterades som fast. Ã…tgÃ¤rdat: fÃ¶rklarar nu helgregeln, med 2026-exemplet (4 maj) explicit. Se `research/dodsbo-audit-2026.md` punkt 9. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | ðŸŸ¡ | Content | âœ” |
| T188 | Begravningsavgiftens intervall "0,065â€“0,28 %" (begravningsbyra.html) / "0,0â€“0,28 %" (vad-kostar-en-begravning.html) gick inte att fÃ¶rena med Kammarkollegiets riksgenomsnitt 0,292 % fÃ¶r 2026 utan en fÃ¤rsk per-kommun-primÃ¤rkÃ¤lla. Ã…tgÃ¤rdat: begravningsbyra.html skriver nu "varierar per kommun, se din skattsedel"; vad-kostar-en-begravning.html anger riksgenomsnittet 0,292 % + samma hÃ¤nvisning till skattsedeln istÃ¤llet fÃ¶r ett osÃ¤kert intervall. index.html nÃ¤mnde inget exakt intervall â€” ingen Ã¤ndring behÃ¶vdes dÃ¤r. Se `research/dodsbo-audit-2026.md` punkt 10. | 2026-08-13 | Fas 21 | dodsbo-audit-2026.md | ðŸŸ¢ | Content/Research | âœ” |

---

# ðŸ§© FAS 22 â€” VILLKORADE MINI-TILLÃ„GG + DIGITAL-INDIKATOR
ðŸ’¡ Tre nya villkorade tillÃ¤gg (syns bara nÃ¤r relevanta, landar som enstaka rader/uppgifter â€” inte nya sektioner) plus en digital/fysisk-etikett pÃ¥ befintliga uppgifter. KÃ¤lla: `research/Vad Efterplan bÃ¶r tÃ¤cka.md` + `research/Bankid.md`, filtrerat genom principen "hjÃ¤lpmedel, inte bÃ¶rda".

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T189 | DÃ¶dsboanmÃ¤lan-frÃ¥ga i onboarding. Ã…tgÃ¤rdat: ny checkbox "DÃ¶dsboets tillgÃ¥ngar Ã¤r mycket smÃ¥" i steg 2. Om ikryssad OCH ingen fastighet: `bouppteckning`-uppgiften byts mot ny `dodsboanmalan`-uppgift (kommunens socialtjÃ¤nst, ~2 mÃ¥n frist, kontoutdrag 3 mÃ¥n, hembesÃ¶k). Fastighet vinner alltid Ã¶ver (verifierat: `litetDodsbo`+`fastighet` behÃ¥ller bouppteckning). `app.js`, `index.html`. | 2026-08-13 | Fas 22 | Vad Efterplan bÃ¶r tÃ¤cka.md | ðŸŸ  | Dev/Content | âœ” |
| T190 | Bodelning-pÃ¥minnelse. Ã…tgÃ¤rdat: ny checkbox "Var gift eller sambo" (civilstÃ¥nd, inte antal barn) triggar ny `bodelning_paminnelse`-uppgift som fÃ¶rklarar skillnaden gift (giftorÃ¤ttsgods) vs sambo (bara samboegendom). `app.js`, `index.html`. | 2026-08-13 | Fas 22 | Vad Efterplan bÃ¶r tÃ¤cka.md | ðŸŸ  | Dev/Content | âœ” |
| T191 | Digital post-mening. Ã…tgÃ¤rdat: mening om Kivra/Min myndighetspost tillagd i `nycklar_post`-uppgiften. `app.js`. | 2026-08-13 | Fas 22 | Vad Efterplan bÃ¶r tÃ¤cka.md | ðŸŸ¢ | Content | âœ” |
| T192 | ðŸŸ¢/ðŸŸ¡/ðŸ”´-etikett per uppgift. Ã…tgÃ¤rdat: `task.digital`-fÃ¤lt + badge-rendering (lÃ¥st och upplÃ¥st kortvy) med tooltip. Kopy utgÃ¥r uttryckligen frÃ¥n den efterlevandes EGET BankID (Owner-krav). Taggat 14 representativa uppgifter (bank, Skatteverket, Pensionsmyndigheten, lagfart = ðŸŸ¢/ðŸŸ¡, bouppteckning/dÃ¶dsboanmÃ¤lan/fullmakt/testamente = ðŸ”´ â€” krÃ¤ver fysiskt original). Ã–vriga otaggade uppgifter visar ingen badge (medvetet â€” ingen ogrundad digital-klassning). Bonus: rÃ¤ttade samma T182-stÃ¤mpelskattefel i `lagfart`-uppgiften (fanns bara fixat i guide-sidorna sen tidigare) + T127 (engelska "deceased"). `app.js`, `style.css`. | 2026-08-13 | Fas 22 | Bankid.md | ðŸŸ¡ | Dev/Content | âœ” |

---

# ðŸ  FAS 23 â€” BOSTAD: STRUKTURERAT DELFLÃ–DE
ðŸ’¡ Bostad Ã¤r ofta dÃ¶dsboets mest vÃ¤rdefulla och mest komplicerade tillgÃ¥ng â€” vÃ¤rt ett riktigt delflÃ¶de. Fordon hÃ¥lls medvetet enkelt (Owner-beslut 2026-08-13) â€” sÃ¤llan lika komplicerat, en generisk uppgift rÃ¤cker.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T193 | Strukturerat bostadsflÃ¶de. Ã…tgÃ¤rdat: nÃ¤r "Ã„gde sin bostad" kryssas i visas en undersektion â€” bostadstyp (villa/fritidshus, bostadsrÃ¤tt, lantbruks-/skogsfastighet; hyresrÃ¤tt var redan en egen gren) + "Anlitar ni mÃ¤klare?"-toggle (Owner-tillÃ¤gg). Lantbruk/skog triggar ny `lantbruk_fastighet`-uppgift. Ny uppgift `fastighet_forsaljningsadmin` ("Visning, budgivning och kÃ¶pekontrakt") filtreras bort nÃ¤r mÃ¤klare=true â€” den enda uppgiften som verkligen Ã¤r mÃ¤klarhanterad; beslutsuppgiften `fastighet_boende` behÃ¥lls alltid (familjen mÃ¥ste besluta oavsett mÃ¤klare). Verifierat med tre scenarion (lantbruk utan mÃ¤klare, villa med mÃ¤klare, ingen fastighet). `app.js`, `index.html`, `style.css`. | 2026-08-13 | Fas 23 | Vad Efterplan bÃ¶r tÃ¤cka.md | ðŸŸ  | Dev/Design | âœ” |

---

# ðŸ“ž FAS 24 â€” TELEFONMANUS BREDVID BREVGENERATORN
ðŸ’¡ Persona-simulering (2026-08-13) av en nybliven Ã¤nka pekade pÃ¥ en lucka: dokumentgeneratorn producerar bara skrivna brev, men fler ringer banken/FÃ¶rsÃ¤kringskassan/fÃ¶rsÃ¤kringsbolaget Ã¤n mejlar dem â€” sÃ¤rskilt fÃ¶rst, innan dÃ¶dsfallsintyget ens finns. Ã…ngesten "vad ska jag sÃ¤ga" gÃ¤ller ett samtal, inte ett brev.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T195 | Telefonmanus i dokumentgeneratorn. UpptÃ¤ckt att PR #58 (Fas 28, "telefonmanus" i mergemeddelandet) i sjÃ¤lva verket bara rÃ¶rde SEO-metadata (twitter:card) â€” `app.js`/`index.html` Ã¤ndrades aldrig, funktionen fanns bara pÃ¥ pappret. Byggd pÃ¥ riktigt nu: ny flik ("âœ‰ Brev" / "ðŸ“ž Vad du kan sÃ¤ga i telefon") i `doc-result`-vyn, bara synlig fÃ¶r brevtyper dÃ¤r folk oftare ringer Ã¤n skriver (bank, fÃ¶rsÃ¤kringsbolag â€” FÃ¶rsÃ¤kringskassan/begravningsbyrÃ¥ har ingen egen brevgenerator att haka pÃ¥). `showDocResult()` tar nu en valfri 4:e parameter `{text, checklist}`; `switchDocMode()` togglar mellan brev/telefon och visar en checklista (personnummer, ev. kund-/fÃ¶rsÃ¤kringsnummer, egna uppgifter). RelationsfÃ¤ltet Ã¤r fritext (inte en begrÃ¤nsad lista) â€” manuset anvÃ¤nder "Jag Ã¤r [relation] till [avliden]" (inte "Min [relation] [avliden]", som skulle bli bakvÃ¤nt oavsett vilket ord som skrivs in) sÃ¥ det fungerar korrekt fÃ¶r dotter/son/mamma/pappa/sambo/syskon/vad som helst. Testat end-to-end i browser preview (bank + fÃ¶rsÃ¤kring, bÃ¥da med olika relationsvÃ¤rden, plus regressionstest att brevtyper utan telefonmanus inte visar fliken). Cache-busting `app.js`/`style.css`-versionsnummer och service worker-cachenamnet (`sw.js`) hÃ¶jda i samma veva â€” annars hade fÃ¶rÃ¤ndringen aldrig synts fÃ¶r Ã¥terkommande besÃ¶kare. | 2026-08-13 | Fas 24 | Persona-simulering session | ðŸŸ¡ | Dev/Content | âœ” |

---

# ðŸ” FAS 25 â€” NYA SEO-LANDNINGSSIDOR (SÃ–KORDSGAP)
ðŸ’¡ Manuell gap-analys mot befintliga 32 innehÃ¥llssidor 2026-08-13 â€” **ingen levande GA4/Search Console-data fanns tillgÃ¤nglig i sessionen** (bara `.env.example`, ingen riktig nyckel), sÃ¥ detta Ã¤r kvalitativ prioritering, inte volymdata. Verifiera mot faktisk Search Console-sÃ¶kordsdata innan skrivarbete pÃ¥bÃ¶rjas. Tre kandidater identifierade dÃ¤r sÃ¶kintentionen skiljer sig tydligt frÃ¥n befintliga sidor (ingen kannibalisering) â€” Ã¶vriga nÃ¤rliggande termer (Ã¤nkepension, arvsavstÃ¥ende, bolÃ¥n vid dÃ¶dsfall) finns redan omnÃ¤mnda inline i befintliga sidor och behÃ¶ver ingen egen URL. Samma sakfels-rigÃ¶r som Fas 21 gÃ¤ller â€” juridiskt innehÃ¥ll ska kÃ¤llbelÃ¤ggas innan publicering, inte genereras fritt.

**Owner-beslut 2026-08-13: pausad, vÃ¤ntar pÃ¥ riktig sÃ¶kdata.** T196â€“T198 skrivs inte fÃ¶rrÃ¤n Search Console-datan finns. VÃ¤gen dit Ã¤r redan dokumenterad i `NEXT_STEPS_FOR_JONAS.md` avsnitt 2 (Verifiera Search Console) â€” Owner exporterar Performance-CSV:n (28 dagar, per sida) och skickar den, sen kÃ¶r vi om denna gap-analys mot riktiga siffror innan nÃ¥got av T196â€“T198 pÃ¥bÃ¶rjas.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T196 | Ny sida: **framtidsfullmakt**. OmnÃ¤mns idag bara i en bisats i `fullmakt-dodsbo.html` (som handlar om fullmakt EFTER dÃ¶dsfall â€” annan juridisk konstruktion). Framtidsfullmakt Ã¤r ett proaktivt dokument en efterlevande ofta bÃ¶rjar fundera pÃ¥ Ã¥t sig sjÃ¤lv strax efter att ha upplevt hur krÃ¥ngligt det blev utan fullmakter fÃ¶r den avlidne â€” naturlig "nu ordnar jag mitt eget" -vinkel fÃ¶r Efterplans mÃ¥lgrupp. Egen sÃ¶kterm, egen intention. KrÃ¤ver kÃ¤llbelagt juridiskt innehÃ¥ll (lag om framtidsfullmakter 2017:310) innan publicering. **Byggd som T219 (Fas 26) 2026-08-14.** | 2026-08-13 | Fas 25 | Manuell gap-analys | ðŸŸ¡ | Content/SEO | âœ” |
| T197 | Ny sida: **dÃ¶dsbo eget fÃ¶retag / enskild firma**. Regelmotorn har redan en `foretag`-trigger och en fÃ¤rdig Skatteverket-avregistreringsuppgift med brevgenerator (`app.js`) â€” men ingen toppen-av-tratten-sida fÃ¥ngar upp sÃ¶kintentionen fÃ¶rrÃ¤n man redan Ã¤r i appen. En landningssida skulle koppla en verklig sÃ¶kterm direkt till en redan byggd funktion (bra konverteringsvÃ¤g). **Byggd 2026-09-27:** `dodsbo-eget-foretag.html` â€” enskild firma vs. aktiebolag, avregistrering Bolagsverket/Skatteverket, pÃ¥gÃ¥ende kontrakt, bokfÃ¶ring, anstÃ¤llda. InterlÃ¤nkad frÃ¥n index.html, checklista-dodsbo.html, vad-gora-nar-nagon-dor.html. | 2026-08-13 | Fas 25 | Manuell gap-analys | ðŸŸ¡ | Content/SEO | âœ” |
| T198 | Ny sida: **vad hÃ¤nder med den avlidnes tjÃ¤nstepension**. Skiljer sig frÃ¥n `efterlevandepension.html`, som handlar om utbetalningar TILL efterlevande â€” den hÃ¤r sidan tÃ¤cker den avlidnes egen intjÃ¤nade pension och hur/om den betalas ut till dÃ¶dsboet. Distinkt sÃ¶kintention, ingen befintlig sida tÃ¤cker den. **Byggd 2026-09-27:** `tjanstepension-dodsfall.html` â€” Ã¥terbetalningsskydd, fÃ¶rmÃ¥nstagare, pensionsbolag, minpension.se, skatt pÃ¥ utbetalning. InterlÃ¤nkad frÃ¥n index.html, efterlevandepension.html, vad-gora-nar-nagon-dor.html. | 2026-08-13 | Fas 25 | Manuell gap-analys | ðŸŸ¢ | Content/SEO | âœ” |

---

## ðŸ’¡ MÃ–JLIGA EXPANSIONER â€” 2026-08-13 (ej prioriterade, ej pÃ¥bÃ¶rjade)

ðŸ’¡ Resten av `research/Vad Efterplan bÃ¶r tÃ¤cka.md` som Owner valde att varken bygga eller kasta, utan bevaka â€” samma mÃ¶nster som T137â€“T142. Inget av det lÃ¶ser ett lika akut, konkret problem som dÃ¶dsboanmÃ¤lan/bodelning gjorde.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T194 | Bevakningslista: (1) fÃ¶rsÃ¤kringar/efterlevandeskydd som egen trigger-sektion (TGL, lÃ¥neskydd, kapitalfÃ¶rsÃ¤kring), (2) pension som egen tydlig trigger utÃ¶ver dagens "barn under 20 Ã¥r"-frÃ¥ga, (3) deklaration/skatt som avslutande fas â€” **obs: Owner avvisade uttryckligen en obligatorisk/valbar avslutningskontroll 2026-08-13** ("momentan lÃ¤ttnad Ã¤r giltig Ã¤ven om nÃ¥got ligger kvar lÃ¥ngt fram") â€” omvÃ¤rdera bara om ny information tillkommer, (4) vÃ¤rdepapper uppdelat i undertyper (aktiedepÃ¥/ISK/kapitalfÃ¶rsÃ¤kring/krypto), (5) skulder uppdelat i undertyper (bolÃ¥n/privatlÃ¥n/CSN/borgen), (6) minderÃ¥riga barn uppdelat i "barn som Ã¤rver" vs "efterlevande barn med rÃ¤tt till barnpension", (7) eget fÃ¶retag utbyggt (AB/delÃ¤garskap/firmateckning, utÃ¶ver dagens F-skatt-flÃ¶de), (8) utlandstillgÃ¥ngar-trigger utÃ¶kad med "arvinge/dÃ¶dsbodelÃ¤gare bosatt utomlands" som separat frÃ¥ga, (9) arbetsgivare/anstÃ¤llning som egen sektion (sista lÃ¶n, semesterersÃ¤ttning, tjÃ¤nstepension). KÃ¤lla: `research/Vad Efterplan bÃ¶r tÃ¤cka.md`. | 2026-08-13 | Backlog | Vad Efterplan bÃ¶r tÃ¤cka.md | ðŸŸ¢ | Research/Backlog | â˜ |

---

## ðŸš« AVVISAT â€” 2026-08-13

| Beslut | Motivering |
|---|---|
| BankID-flerpartssignering av fullmakter | KrÃ¤ver tredjepartsleverantÃ¶r + server-relation, krockar med "ingen server, sparas bara lokalt"-lÃ¶ftet. Matchar redan T149/Fas 14:s slutsats â€” vÃ¤nta tills bolaget Ã¤r registrerat och trafiken stÃ¶rre. Ingen ny ticket. |
| Obligatorisk eller valbar avslutningskontroll ("Ã¤r allt verkligen klart?") | Skulle riva upp den befintliga "du Ã¤r klar, andas ut"-kÃ¤nslan fÃ¶r att pÃ¥minna om saker som kan ligga mÃ¥nader/Ã¥r fram (deklaration, skattekonto). Momentan lÃ¤ttnad Ã¤r giltig Ã¤ven om nÃ¥got administrativt hÃ¤nger kvar. |
| Fordon uppdelat i undertyper (bil/mc/slÃ¤p/husbil/bÃ¥t) som strukturerat delflÃ¶de | SÃ¤llan lika komplicerat som bostad â€” en generisk "fordon"-uppgift rÃ¤cker, upprepa vid behov. |

---

# ðŸ§¹ FAS 24 â€” OWNER-AUDIT (UI-genomgÃ¥ng 2026-08-13) + GROK-UTVÃ„RDERING

ðŸ’¡ Owner gick igenom appen skÃ¤rm fÃ¶r skÃ¤rm och listade ~20 konkreta observationer (copy, lista-istÃ¤llet-fÃ¶r-fritext, villkorad synlighet, en scroll-bugg m.m.), och klistrade in en separat Grok-analys (UI/UX-audit + sorgpsykologisk backlogg) fÃ¶r utvÃ¤rdering. GenomgÃ¥ngen bekrÃ¤ftade att flera Grok-punkter redan var byggda i tidigare sessioner (T177/T178/T189â€“T193) â€” de listas inte hÃ¤r igen.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T195 | Textfixar: prisrad "med mera" tillagd, FÃ¶rsÃ¤kringskassan-uppgiften fÃ¶rtydligad (automatiskt dÃ¶dsbesked via folkbokfÃ¶ringen men stoppar inte utbetalningar automatiskt), skattedeklarations-lÃ¤nk bytt till Skatteverkets specifika dÃ¶dsbo-sida, jurist-disclaimer tillagd pÃ¥ bouppteckningsuppgiften, ny alltid synlig rÃ¶d-gul-grÃ¶n-fÃ¶rklaring i plan-headern. `index.html`, `app.js`, `style.css`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¢ | Content | âœ” |
| T196 | "Meddela nÃ¤rstÃ¥ende" hade bÃ¥de en fÃ¤rdigbyggd bock-av-lista (`renderNotifyList`) OCH ett dubblerande fritextfÃ¤lt kvar â€” fritextfÃ¤ltet borttaget. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¡ | Dev | âœ” |
| T197 | "Hitta viktiga dokument" fick en ny lista (dokument + var det finns), samma mÃ¶nster som underrÃ¤tta-listan, som komplement till foto-genvÃ¤gen till Arkiv. Ny `renderDocumentLocationList()` i `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¡ | Dev | âœ” |
| T198 | "Inventera skulder noggrant" kopplad till Bouppteckningens redan befintliga skuldlista istÃ¤llet fÃ¶r ett fristÃ¥ende fritextfÃ¤lt; placeholder bytt till "BorgenÃ¤r (skuld till)". `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¡ | Dev | âœ” |
| T199 | "Avsluta autogiron och e-fakturor" + "Avsluta abonnemang och prenumerationer" gjorda om till interaktiva bock-av-listor, samma mÃ¶nster som "Avsluta digitala konton" redan hade. `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¢ | Dev | âœ” |
| T200 | Buggfix: Ã¤ktenskapsfÃ¶rord/samboavtal-uppgiften triggade bara pÃ¥ `relation==='make'` (att DU Ã¤r maken) istÃ¤llet fÃ¶r `giftSambo` (att den avlidne var gift/sambo). Trigger utÃ¶kad till bÃ¥da. `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ  | Dev | âœ” |
| T201 | "Besluta om bostadens framtid" och "Kontrollera bostadsrÃ¤ttens framtid" slagits ihop till en uppgift och flyttad i `TASK_LIBRARY` till att ligga bredvid bouppteckningen, istÃ¤llet fÃ¶r lÃ¤ngre ner bland de administrativa fastighetsstegen. `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¡ | Dev | âœ” |
| T202 | Lagfart-uppgiften fick ett datumfÃ¤lt fÃ¶r "bouppteckningen registrerad hos Skatteverket" som rÃ¤knar ut 3-mÃ¥nadersfristen, samma mÃ¶nster som `applyDeadlines()` redan gÃ¶r fÃ¶r dÃ¶dsdatumet. Ny `applyLagfartDeadline()`. `app.js`, `style.css`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¡ | Dev | âœ” |
| T203 | DÃ¶lj/visa klara uppgifter â€” global knapp + en knapp per sektion (Idag/Denna vecka/Senare), lagras i `localStorage` (`efterplan_hide_done`). `app.js`, `index.html`, `style.css`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¡ | Dev | âœ” |
| T204 | Buggfix: att markera en uppgift som klar skrollade till den FÃ–RSTA oavklarade uppgiften totalt (kunde hoppa hela vÃ¤gen upp om en tidig uppgift lÃ¤mnats Ã¶ppen). Ã„ndrat till nÃ¤sta oavklarade uppgift efter den man just klarade av. `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ  | Dev | âœ” |
| T205 | RÃ¤kningssektionen flyttad frÃ¥n botten av "Min plan" till Arkiv-fliken, med en rad som fÃ¶rklarar varfÃ¶r den ligger dÃ¤r. `index.html`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¢ | Dev | âœ” |
| T206 | "Ta hand om dig sjÃ¤lv" flyttad frÃ¥n "Senare" till "GÃ¶r idag" â€” krÃ¤ver ingen deadline, bara nÃ¤rvaro, och ska synas tidigt. `app.js`. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¢ | Content | âœ” |
| T207 | Framtida (nÃ¤r traction finns): utvÃ¤rdera om jurister/byrÃ¥er som listas i appen (t.ex. Familjens Jurist) kan ge provision/kickback fÃ¶r fÃ¶rmedlade dÃ¶dsbo-Ã¤renden â€” inklusive vad det gÃ¶r med trovÃ¤rdigheten i "det hÃ¤r Ã¤r bara fÃ¶rslag"-formuleringen (T195). Ren framtidsnotering, ingen kod. | 2026-08-13 | Fas 24 | Owner UI-audit | ðŸŸ¢ | Research/Backlog | â˜ |
| T208 | Grok-bevakningslista (granskad och avgrÃ¤nsad frÃ¥n denna omgÃ¥ng â€” se AVVISAT nedan fÃ¶r resonemang): (1) "Jag orkar inte just nu"-pauslÃ¤ge, (2) fÃ¶rifyllda standardposter i Bouppteckningens tillgÃ¥ngar/skulder (Bankkonto, Bostad, Bil, Bohag m.fl.), (3) AI-kategorisering av rÃ¤kningsfoton (samma mÃ¶nster som redan finns fÃ¶r Arkiv-dokument), (4) diskret konto-synk-prompt efter fÃ¶rsta sessionen. KÃ¤lla: Grok UI/UX-audit, inklistrad av Owner 2026-08-13. | 2026-08-13 | Backlog | Grok-analys | ðŸŸ¢ | Research/Backlog | â˜ |

---

## ðŸš« AVVISAT â€” 2026-08-13 (session 2, Grok-utvÃ¤rdering)

| Beslut | Motivering |
|---|---|
| "Visa 1â€“2 brev gratis" (Grok-fÃ¶rslag) | Ren pris-/affÃ¤rsmodellsfrÃ¥ga, inte UX â€” mÃ¥ste beslutas av Owner separat, kodas inte in pÃ¥ egen hand. |
| Duplicera "Ta hand om dig sjÃ¤lv" som flera task-instanser i olika sektioner | Skulle bryta klar-markering/state per kopia (samma uppgift, flera `done`-flaggor att hÃ¥lla reda pÃ¥). LÃ¶st istÃ¤llet genom att flytta den enda instansen tidigare i flÃ¶det (T206). |

---

# ðŸ“Š FAS 25 â€” GA4/GSC-verifiering, outreach-status, SEO-titlar (2026-08-14)

ðŸ’¡ Session initierad av Owner ("hur gÃ¥r det med trafiken") som eskalerade genom flera runda av "kolla, gissa inte" â€” GA4-hÃ¤mtning krÃ¤vde ny service-account-nyckel (gammal var 48 byte, ogiltig), egen-testtrafik i datan kunde varken bekrÃ¤ftas eller uteslutas (IP-geolokalisering opÃ¥litlig i Sverige). Slutade i faktisk kodverifiering + skarpa SEO-fixar.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T209 | GA4 service-account-nyckel var ogiltig (48 byte). Ny nyckel skapad (`ga4-reader@intricate-tempo-496015-a0.iam.gserviceaccount.com`), Viewer-access i GA4, sparad pÃ¥ `~/.config/efterplan/ga4-service-account.json`. 30-dagars funnel hÃ¤mtad: 75 sessioner, onboarding_start 12%, plan_generated > onboarding_start i unika anvÃ¤ndare â€” verifierat i koden (`app.js:148`, `app.js:300`) att detta INTE kan bero pÃ¥ en trasig funnel (generatePlan krÃ¤ver alltid startOnboarding fÃ¶rst), sannolikt GA4-attributionskvirk vid fÃ¶nsterkant. Egen testtrafik i datan varken bekrÃ¤ftad eller utesluten (IP visade Stockholm, Owner sitter i Visby â€” opÃ¥litlig signal). | 2026-08-14 | Fas 25 | Session | ðŸŸ¡ | Analytics | âœ” |
| T210 | Outreach-status verifierad mot Gmail-etiketten Arbete/Efterplan (ej gissad): sorg.se, SPES, Svenska kyrkan, RÃ¥d & RÃ¶n â€” skickade 12 apr. 1177 â€” skickat, avbÃ¶jt. Aftonbladet â€” status okÃ¤nd, lÃ¤mnad sÃ¥ pÃ¥ Owners begÃ¤ran. Statustabell tillagd i `outreach.md`. | 2026-08-14 | Fas 25 | Session | ðŸŸ¢ | Content | âœ” |
| T211 | Ã…terkommande molnrutin skapad: "Community-scan efterplan.se" (`trig_01RSTqpLnTb2UapAYiYvkrFw`), varje mÃ¥ndag 06:00 UTC. SÃ¶ker Reddit/Flashback/Familjeliv efter trÃ¥dar dÃ¤r ett genuint icke-sÃ¤ljande svar Ã¤r rimligt â€” postar aldrig sjÃ¤lv, loggar till `community-watch.md` + Ã¶ppnar PR fÃ¶r granskning. Explicit instruerad att INTE gÃ¶ra reklam (de flesta forum fÃ¶rbjuder sjÃ¤lvmarknadsfÃ¶ring i sina regler). | 2026-08-14 | Fas 25 | Session | ðŸŸ¢ | Growth | âœ” |
| T212 | SEO: 29 av 33 sidors `<title>` var Ã¶ver 60 tecken (klipps i Google-SERP). Kortade alla till â‰¤60 tecken, behÃ¶ll nyckelord + "\| Efterplan"-suffix. `index.html` (65, varumÃ¤rkesledd) och `auth-modal.html` (ingen egen sida, ej i sitemap) undantagna med avsikt. PR #59. | 2026-08-14 | Fas 25 | Session | ðŸŸ¡ | SEO | âœ” |
| T213 | Google Search Console API kopplad (samma projekt/service-account som GA4, krÃ¤ver Owner-godkÃ¤nnande av API + SÃ¶k-konsol-Ã¥tkomst). Sitemap omskickad. Indexeringsstatus verifierad per URL (ej gissad frÃ¥n sitemap-rapportens missvisande "0 indexerade"): **18/33 sidor indexerade**, 8 crawlade-ej-indexerade, 4 upptÃ¤ckta-ej-crawlade, 3 helt okÃ¤nda fÃ¶r Google (boutredningsman, digital-dodsbo, dodsbo-deklaration). | 2026-08-14 | Fas 25 | Session | ðŸŸ  | SEO | âœ” |
| T214 | Grundorsak till T213:s tre "okÃ¤nda" sidor: fanns bara 2â€“4 svaga interna lÃ¤nkar var, och saknades helt i startsidans footer (som bara lÃ¤nkade till 3 av 32 guider trots att `om.html` har 33 inlÃ¤nkar och Ã¤r sajtens starkaste sida). Startsidans footer utÃ¶kad till alla 32 guide-lÃ¤nkar. PR #60. VÃ¤ntar pÃ¥ ny Google-crawl (dagarâ€“veckor) fÃ¶r att verifiera effekt. | 2026-08-14 | Fas 25 | Session | ðŸŸ  | SEO | âœ” |
| T215 | Request Indexing (enskild URL, GSC-knappen) har ingen publik API â€” verifierat, inte antaget. Skalbar ersÃ¤ttning (sitemap-omskickning, T213) anvÃ¤ndes istÃ¤llet. Manuell process i [NEXT_STEPS_FOR_JONAS.md](NEXT_STEPS_FOR_JONAS.md:36) kan strykas/nedprioriteras nu nÃ¤r sitemap-vÃ¤gen finns. | 2026-08-14 | Fas 25 | Session | ðŸŸ¢ | Research | âœ” |
| T216 | UppfÃ¶ljning om ~2â€“4 veckor: kÃ¶r `/ga4` + ny GSC-indexeringskoll fÃ¶r att se om T212 (kortare titlar) och T214 (interlÃ¤nkning) faktiskt flyttat CTR/indexeringssiffrorna. | â€” | Fas 25 | Session | ðŸŸ¡ | Analytics | â˜ |
| T217 | Automatisk sitemap/indexerings-pipeline byggd: [`.github/workflows/update-sitemap.yml`](.github/workflows/update-sitemap.yml) triggas pÃ¥ varje push till `main` som rÃ¶r en `.html`-sida, kÃ¶r [`scripts/indexing/update-sitemap.mjs`](scripts/indexing/update-sitemap.mjs) (skannar repo-roten, sÃ¤tter `lastmod` frÃ¥n git-historik, validerar canonical + oavsiktlig noindex, failar builden vid fel) och committar `sitemap.xml` om den Ã¤ndrats, fÃ¶ljt av [`scripts/indexing/submit-sitemap.mjs`](scripts/indexing/submit-sitemap.mjs) som resubmittar sitemapen via Search Console API (`sitemaps.submit` â€” Google Indexing API stÃ¶djer inte vanliga HTML-sidor, verifierat i T215). Testat lokalt end-to-end: ny sida upptÃ¤cks/lÃ¤ggs till, Ã¤ndrad sida ger nytt `lastmod`, borttagen sida fÃ¶rsvinner ur sitemapen automatiskt. KrÃ¤ver ingen ny konfig: `submit-sitemap.mjs` Ã¥teranvÃ¤nder den befintliga GitHub-secreten `GA4_SERVICE_ACCOUNT_JSON` (samma service-account som redan har Owner-Ã¥tkomst i Search Console, se T213) om `GSC_SERVICE_ACCOUNT_JSON` inte finns â€” fungerar alltsÃ¥ direkt utan manuellt steg. | 2026-08-14 | Fas 25 | Session | ðŸŸ¢ | SEO | âœ” |

---

# ðŸŒ± FAS 26 â€” SEO-utbyggnad + produktfÃ¶renkling (2026-08-14)

ðŸ’¡ Fas 25 fixade akuta SEO-problem och byggde den automatiska sitemap/indexerings-pipelinen (T217). Denna fas fortsÃ¤tter i tvÃ¥ spÃ¥r enligt samma princip â€” **gÃ¶r det Ã¥t anvÃ¤ndaren istÃ¤llet fÃ¶r att be dem gÃ¶ra det** â€” gÃ¤ller bÃ¥de Google (indexering) och den sÃ¶rjande anvÃ¤ndaren i appen (fÃ¤rre klick, fÃ¤rre tomma listor, fÃ¤rre saker att komma ihÃ¥g). Omfattningen var fÃ¶r stor fÃ¶r en session: `bygg-ett-helt-automatiskt-iridescent-peach.md` delade upp i Del A (byggt nu, nedan) och Del B (loggas som B1â€“B10 hÃ¤r, fÃ¶r kommande sessioner).

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T218 | SEO-snabbvinster: `om.html` fick `Organization`+`WebPage`+`BreadcrumbList` JSON-LD (var enda sidan helt utan strukturerad data) och utÃ¶kat innehÃ¥ll (var 90 ord tunt innehÃ¥ll). `dodsbo-checklista-7-dagar.html` omdÃ¶pt/omfokuserad (titel, H1, meta) fÃ¶r att tydligare Ã¤ga "dag fÃ¶r dag fÃ¶rsta veckan"-sÃ¶kintentionen och inte krocka med `checklista-dodsbo.html`s "steg fÃ¶r steg"-vinkel, plus en explicit hÃ¤nvisning i ingressen. `HowTo`/`HowToStep`-schema tillagt pÃ¥ `bouppteckning-guide.html`, `arvskifte-guide.html` och `checklista-dodsbo.html` (mÃ¶nster fanns redan pÃ¥ `dodsfallsintyg.html`/`saga-upp-hyresratt-dodsbo.html`). | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¡ | SEO | âœ” |
| T219 | TvÃ¥ nya guide-sidor byggda med samma mall som de befintliga 32 (canonical, meta, Article+HowTo+FAQPage+BreadcrumbList JSON-LD, interlÃ¤nkar): `dodsboanmalan.html` (lÃ¶ser cannibalization pÃ¥ riktigt â€” egen landningssida fÃ¶r det fÃ¶renklade alternativet till bouppteckning, redan en kÃ¤nd term i appens `litetDodsbo`-trigger som saknade sin egen sida) och `framtidsfullmakt.html` (hÃ¶g sÃ¶kvolym-term, naturlig granne till `fullmakt-dodsbo.html`). InterlÃ¤nkade frÃ¥n `bouppteckning-guide.html`, `checklista-dodsbo.html`, `fullmakt-dodsbo.html`, `testamente-guide.html` och startsidans footer. Plockas automatiskt upp av T217:s sitemap-pipeline. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¡ | SEO | âœ” |
| T220 | Produkt (del 1 av Grok-bevakningslistan T208, punkt 2+3): Bouppteckningens tillgÃ¥ngslista startar nu med fyra fÃ¶rifyllda, redigerbara/borttagbara default-rader (Bankkonto, Bostad, Bil, Bohag) fÃ¶rsta gÃ¥ngen fliken Ã¶ppnas (`app.js`, `BOPP_DEFAULT_TILLGANGAR`) â€” istÃ¤llet fÃ¶r en tom lista anvÃ¤ndaren sjÃ¤lv mÃ¥ste komma pÃ¥ vad som ska fyllas i. Blockerande `alert()` vid betalningsfel/-status (`handlePremiumReturn`, `handlePaywallCTA`) ersatt med en ny icke-blockerande `showToast()`, samma mÃ¶nster som `showFormError` men utan fast plats i DOM:en â€” konsekvent med resten av appen. `app.js`, `index.html`, `style.css`. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¡ | Dev | âœ” |
| T221 | Produkt (del 2 av T208, punkt 2+3): de tre nÃ¤stan identiska localStorage-list-implementationerna (underrÃ¤tta-listan, dokumentplats-listan, den generiska `_getLSList`) konsoliderade till en delad `createLSList()`-fabrik i `app.js` â€” samma externa funktionsnamn och beteende bevarat, men add/remove/setField/toggleField skrivs bara en gÃ¥ng nu. RÃ¤kningssektionen (Arkiv â†’ RÃ¤kningar) fick samma AI-assist som Arkiv-dokument redan hade: nÃ¤r QR-koden inte hittar fakturadata anropas `/api/categorize-document` (samma "misslyckas tyst"-mÃ¶nster, aldrig en spÃ¤rr) fÃ¶r att fÃ¶reslÃ¥ avsÃ¤ndare/namn utifrÃ¥n fotot. `app.js`. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¢ | Dev | âœ” |
| T222 (B1) | Fler content-luckor: `internationellt-arv.html`, `arvsavstaende.html`, `gavobrev.html`, `aktenskapsforord.html` som egna sidor (idag bara nÃ¤mnda i app-logik/tickets, ingen SEO-landningssida). Fyra sidor skapade 2026-09-27 med FAQPage+Article+BreadcrumbList-schema, lokal fonts.css, fullstÃ¤ndig juridisk content (EU-arvsfÃ¶rordning, istadarÃ¤tt, gÃ¥vobrevs-formkrav, Ã¤ktenskapsfÃ¶rordets inverkan pÃ¥ dÃ¶dsboet), interlÃ¤nkning de fyra emellan + befintliga guider, CTA till appen. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¢ | SEO | âœ” |
| T223 (B2) | Self-hosta Google Fonts (Fraunces/IBM Plex Sans) istÃ¤llet fÃ¶r `fonts.googleapis.com` â€” tar bort en extern render-blocking request, ren perf/Core-Web-Vitals-vinst. 23 woff2-filer nedladdade till `fonts/`, lokal `fonts/fonts.css` genererad, alla 13 HTML-filer uppdaterade. CSP i `vercel.json` rensad (`fonts.googleapis.com`/`fonts.gstatic.com` borttagna), cache-headers `immutable 1 Ã¥r` lagda pÃ¥ `/fonts/*`. 2026-09-27. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¢ | Dev | âœ” |
| T224 (B3) | Minifiera `style.css` (84KB)/`app.js` (150KB) â€” inget build-verktyg finns idag (T122/T123 Ã¤r release om samma design-skuld); krÃ¤ver att vÃ¤lja ett verktyg (esbuild/terser) och ett CI-steg, stÃ¶rre beslut Ã¤n en enkel patch. Medvetet nedprioriterad 2026-08-27: Vercel gzip/brotli-komprimerar redan text-assets vid leverans och fÃ¥ngar det mesta av perf-vinsten; ett nytt byggsteg (esbuild-pipeline + GitHub Action, likt sitemap-automationen) hade blivit permanent extra komplexitet att underhÃ¥lla fÃ¶r en marginell tillÃ¤ggsvinst. VÃ¤gs om vid ett framtida perf-lÃ¤ge om det faktiskt visar sig vara en flaskhals (t.ex. via Lighthouse CI i `weekly-health.yml`). | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¢ | Infra | â˜ |
| T225 (B4) | BekrÃ¤ftat: `weekly-health.yml` fanns bara beskriven i `MAINTENANCE.md`, aldrig skapad som faktisk workflow â€” sajten hade alltsÃ¥ inget automatiskt skydd mot trasiga lÃ¤nkar eller perf/SEO-regressioner. Skapad `.github/workflows/weekly-health.yml` (broken-link-check via lychee + Lighthouse CI mot startsidan/checklista-dodsbo/bouppteckning-guide + auto-issue vid fel, samma mÃ¶nster som `weekly-report.yml`) och `.lighthouserc.json` (budget: perf â‰¥0.8, a11y/SEO â‰¥0.9 error, LCP â‰¤2500ms/CLS â‰¤0.1/TBT â‰¤300ms warn). TestkÃ¶rd upprepade gÃ¥nger pÃ¥ riktigt via `workflow_dispatch` (inte bara lÃ¤st/gissat) tills grÃ¶n â€” tre faktiska buggar hittades och fixades under vÃ¤gen: (1) `./**.html` ogiltigt glob fÃ¶r lychee, rÃ¤tt Ã¤r `./**/*.html` (samma fel fanns i MAINTENANCE.md:s eget exempel); (2) `<link rel=preconnect>` mot fonts.gstatic.com/fonts.googleapis.com utan path gav falska 404-positiv, exkluderade; (3) `budgetPath` pekar pÃ¥ ett annat inkompatibelt schema (Lighthouse "budgets.json") Ã¤n `.lighthouserc.json`s `ci.assert.assertions` â€” krockade tyst utan att fÃ¤lla bygget, rÃ¤tt input Ã¤r `configPath`. Sista kÃ¶rningen visade assert-steget faktiskt aktivt och mÃ¤tte riktiga tal (perf 0.76, LCP 3565ms, TBT 305ms â€” alla Ã¶ver budget som `warn`, fÃ¤ller inte bygget men syns i loggen; vÃ¤rt att titta pÃ¥ i en framtida perf-session). | 2026-08-16 | Fas 26 | Session | ðŸŸ¡ | Infra | âœ” |
| T226 (B5) | Samma uppfÃ¶ljning som T216: kÃ¶r `/ga4` + GSC-koll om 2â€“4 veckor fÃ¶r att mÃ¤ta effekten av Fas 25 + Fas 26 tillsammans. | â€” | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¡ | Analytics | â˜ |
| T227 (B6) | "Jag orkar inte just nu"-pauslÃ¤ge fÃ¶r checklistan (T208.1) â€” krÃ¤ver UX-design av hur pausat state visas, stÃ¶rre grepp Ã¤n en enkel patch. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¢ | Design/Dev | â˜ |
| T228 (B7) | Deadline-pÃ¥minnelse-mejl (T136) â€” opt-in-checkbox finns redan, men sjÃ¤lva utskicksinfrastrukturen (Resend/SendGrid + cron) Ã¤r obyggd; krÃ¤ver ny extern tjÃ¤nst-integration, egen session. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¡ | Infra | âœ” | Byggt 2026-09-27: `api/unsubscribe-reminder.js` (avregistrering via UUID-token), `scripts/reminders/send-reminders.mjs` (Resend-utskick 14d+3d fÃ¶re deadline), `.github/workflows/send-reminders.yml` (daglig cron 07:00 UTC). DB-migration kÃ¶rd (reminders_sent text[], unsubscribe_token uuid). âš ï¸ AvstÃ¤ngningskod tillagd 2026-10-07 enligt T279; produktionsstopp vÃ¤ntar pÃ¥ T277. Resend-Ã¥tgÃ¤rderna nedan Ã¤r inte lÃ¤ngre aktuella: skapa Resend-konto, verifiera pÃ¥minnelse@efterplan.se, lÃ¤gg RESEND_API_KEY i GitHub Actions secrets. |
| T229 (B8) | Onboarding steg 2 (12 kryssrutor): utreda om nÃ¥got kan fÃ¶rifyllas/gissas automatiskt (t.ex. baserat pÃ¥ postnummer om personen Ã¤ger fastighet) istÃ¤llet fÃ¶r att alltid frÃ¥gas â€” krÃ¤ver research i vilka fÃ¤lt som faktiskt gÃ¥r att hÃ¤rleda, inte en sÃ¤ker snabbfix. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¢ | Research/Dev | â˜ |
| T230 (B9) | Fler brevmallar: hyresvÃ¤rd (T139), Pensionsmyndigheten (T140), arvskiftesavtal-generator (T138) â€” var och en Ã¤r en egen liten funktion, gÃ¶rs bÃ¤st separat. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¢ | Dev | â˜ |
| T231 (B10) | Diskret inloggnings-nudge efter fÃ¶rsta sessionen (T208.4) fÃ¶r cross-device-sync. | 2026-08-14 | Fas 26 | `bygg-ett-helt-automatiskt-iridescent-peach.md` | ðŸŸ¢ | Dev | â˜ |

**Explicit avgrÃ¤nsat bort** (redan avvisat/krÃ¤ver Ã¤garbeslut, byggs inte): visa fler brev gratis (prissÃ¤ttningsfrÃ¥ga, se AVVISAT 2026-08-14 session 2), dela-lÃ¤nk mellan arvingar (medvetet borttaget T124, byggs ej om utan nytt beslut), lawyer-referral kickbacks (T207, affÃ¤rsbeslut).

---

# ðŸŒ± FAS 27 â€” CHATGPT-SEO-RESEARCH 2026-08-14 (VERIFIERAD MOT KOD)

ðŸ’¡ Owner delade en ny ChatGPT-researchrapport om Efterplans SEO. Rapportens huvudpoÃ¤ng ("sajten Ã¤r i huvudsak en SPA, guiderna Ã¤r bara lÃ¤nkar utan riktiga URL:er") stÃ¤mde **inte** vid verifiering â€” Fas 19/25/26 hade redan lÃ¶st det (34 statiska HTML-sidor, canonical, JSON-LD, autositemap, interlÃ¤nkar frÃ¥n footer). Rapporten Ã¥terupprepade dÃ¤rfÃ¶r i stort redan gjort arbete. Fem fynd var dock faktiska luckor, verifierade i koden (grep Ã¶ver samtliga `*.html`, inte gissade) innan de loggades hÃ¤r.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T232 | Ny landningssida `saga-upp-abonnemang-vid-dodsfall.html` â€” "abonnemang" nÃ¤mns idag i 10 andra guider men Ã¤ger ingen egen sida/sÃ¶kintention. Rapporten pekar ut det som kommersiell long-tail nÃ¤ra produkten (uppsÃ¤gningsbrev finns redan i appen). Samma mall som befintliga sidor (canonical, meta, Article+HowTo+FAQPage+BreadcrumbList JSON-LD), interlÃ¤nkad frÃ¥n `checklista-dodsbo.html`, `vad-gora-nar-nagon-dor.html`, `dodsbo-checklista-7-dagar.html`, `digital-dodsbo.html`, `bankkonto-dodsfall.html` och startsidans footer. | 2026-08-14 | Fas 27 | ChatGPT-research (Owner) | ðŸŸ¡ | SEO | âœ” |
| T233 | Tre nya landningssidor fÃ¶r Ã¤mnen som idag bara nÃ¤mns i fÃ¶rbigÃ¥ende pÃ¥ `index.html`, ingen egen sida: `forsakring-vid-dodsfall.html` (livfÃ¶rsÃ¤kring/TGL/hemfÃ¶rsÃ¤kring/bilfÃ¶rsÃ¤kring â€” Ã¥teranvÃ¤nder redan etablerade fakta som "6â€“8 prisbasbelopp" frÃ¥n `efterlevandepension.html`), `husdjur-efter-dodsfall.html` (juridisk status som lÃ¶s egendom, Jordbruksverkets hundregister, kan inte testamenteras direkt till djuret), `eftersandning-post-dodsbo.html` (adressÃ¤ndring.se fÃ¶r dÃ¶dsbo + varfÃ¶r digital myndighetspost/Kivra inte tÃ¤cks). Samma mall/interlÃ¤nkning som T232, med korslÃ¤nkar mellan alla nya sidor. | 2026-08-14 | Fas 27 | ChatGPT-research (Owner) | ðŸŸ¢ | SEO | âœ” |
| T234 | "Senast uppdaterad: [datum]"-rad tillagd pÃ¥ alla 38 guide-sidor, satt per fil frÃ¥n `git log`-datumet innan denna sessions Ã¤ndringar (samma kÃ¤lla som `update-sitemap.mjs` anvÃ¤nder fÃ¶r `lastmod`) â€” inte ett fast dagens-datum. Sidor som inte innehÃ¥llsmÃ¤ssigt Ã¤ndrades denna session (t.ex. `gravsten.html`, `sambo-arv.html`) behÃ¶ll sitt faktiska tidigare datum (29 maj) snarare Ã¤n att skrivas Ã¶ver med dagens. Ny CSS-klass `.seo-updated` i `style.css`, placerad efter ingressstycket (`h1 + p`) fÃ¶r att inte stÃ¶ra dess befintliga stilregel. EngÃ¥ngsscript, ej del av CI-pipelinen. | 2026-08-14 | Fas 27 | ChatGPT-research (Owner) | ðŸŸ¡ | SEO | âœ” |
| T235 | Ursprungsscope (generisk delbar landningssida) omprÃ¶vad genom en `/debate`-analys av fem gratis/betal-varianter (mÃ¥l: maximal konvertering) â€” se `veckorapport`/sessionslogg fÃ¶r hela debatten, kort sagt: en ren statisk kopia av bouppteckningsÃ¶versikten skulle konkurrera med Efterlevandeguiden pÃ¥ deras planhalva utan att visa Efterplans faktiska fÃ¶rdel (personalisering + "vi gÃ¶r jobbet Ã¥t dig"). Landade istÃ¤llet pÃ¥ Owners eget fÃ¶rslag: **`gratis-checklista-abonnemang.html`** â€” fristÃ¥ende sida, inget konto, kryssa i abonnemang â†’ personlig checklista direkt â†’ ett komplett gratis uppsÃ¤gningsbrev. Byggd helt utan `app.js`-beroende (egen inline-JS), Ã¥teranvÃ¤nder exakt samma checklista-nycklar och brevmall som `abonnemang`-uppgiften/`generateLetter()` fÃ¶r konsekvens. InterlÃ¤nkad frÃ¥n 6 befintliga sidor + startsidans footer. Pilot â€” bara abonnemang, inte de andra fÃ¶reslagna omrÃ¥dena (bank/bostad/pension). | 2026-08-14 | Fas 27 | ChatGPT-research (Owner) + Owner-beslut | ðŸŸ¢ | SEO/Product | âœ” |
| T236 | SlÃ¥ ihop med T216/T226 (redan Ã¶ppna uppfÃ¶ljningstickets, fÃ¶rfaller ~slutet aug/mitten sep 2026): nÃ¤r `/ga4` + GSC-koll kÃ¶rs dÃ¥, mÃ¤t Ã¤ven effekt av T232â€“T235 om de hunnit byggas och crawlas â€” sÃ¤rskilt konvertering frÃ¥n `gratis-checklista-abonnemang.html` till fullstÃ¤ndig plan (`free_tool_letter_generated` â†’ `free_tool_to_app_click`-events). Ingen ny separat uppfÃ¶ljning behÃ¶vs. | â€” | Fas 27 | ChatGPT-research (Owner) | ðŸŸ¢ | Analytics | â˜ |
| T237 | **Fynd under T235-arbetet, ej Ã¥tgÃ¤rdat pÃ¥ Owners begÃ¤ran ("lÃ¤mna som de Ã¤r just nu")**: prisraden pÃ¥ startsidan (`index.html:163`, "49 kr: alla fÃ¤rdigskrivna brev â€” bank, fÃ¶rsÃ¤kring, Skatteverket, abonnemang, fullmakt, dÃ¶dsannons") stÃ¤mmer inte med koden. Verifierat i `app.js`: bara Skatteverket-brevet och fullmakten Ã¤r faktiskt bakom `isPremium()`. Bank-, fÃ¶rsÃ¤krings-, dÃ¶dsannons- och abonnemangsbreven har ingen betalspÃ¤rr alls och Ã¤r fria fÃ¶r alla redan idag. Antingen Ã¤r texten fel (rÃ¤tta den) eller saknas kod (lÃ¤gg till spÃ¤rr sÃ¥ det stÃ¤mmer med vad som marknadsfÃ¶rs) â€” krÃ¤ver ett Owner-beslut, inte en gissning. **LÃ¶st 2026-09-10 (PR #93 â†’ main):** Owner-beslut = ett brev gratis fÃ¶r att visa vÃ¤rdet. FÃ¶rsÃ¤kringsbrevet (TGL/livfÃ¶rsÃ¤kring) Ã¤r gratis, Ã¶vriga fem brev (bank, Skatteverket, fullmakt, dÃ¶dsannons, uppsÃ¤gning abonnemang) bakom 49 kr. Task-preview-lÃ¥set ("5 steg innan betalning") borttaget samtidigt (PR #92) â€” hela checklistan gratis. | 2026-08-14 | Fas 27 | Session (kodverifiering) | ðŸŸ  | Product/Pricing | âœ” |

**Redan gjort, bekrÃ¤ftat vid verifiering (ingen ny ticket)**: separata crawlbara sidor per sÃ¶kintention, title/H1/first-paragraph-matchning, interlÃ¤nkning frÃ¥n footer, beskrivande ankartexter, strukturerad data (Article/HowTo/FAQPage/BreadcrumbList), automatisk sitemap + Search Console-submission (ej Indexing API â€” verifierat fel anvÃ¤ndningsomrÃ¥de i T215), korta titlar (T212). Se Fas 19/25/26.

---

# ðŸš€ FAS 28 â€” TRAFIK FÃ–RE ALLT (Owner-beslut 2026-08-15)

ðŸ’¡ `handoff.md` (2026-08-13) lÃ¤mnade aktiveringsfrÃ¥gan Ã¶ppen: 16 sessioner â†’ 0 `onboarding_start` behÃ¶vde verifieras i GA4 Realtime innan mer trafik drevs in. **Owner bekrÃ¤ftade 2026-08-15 att GA4-kollen Ã¤r gjord och att aktivering fungerar** â€” 0/16 var alltsÃ¥ inte ett spÃ¥rningsfel. Marketing-planens paus ("aktivering fÃ¶re trafik", `marketing-plan-2026-08.md`) Ã¤r dÃ¤rmed upphÃ¤vd. Nytt explicit Owner-direktiv: **"det enda som rÃ¤knas nu Ã¤r trafik"** â€” allt arbete denna fas prioriterar besÃ¶ksvolym, inte konvertering/paywall-stÃ¤dning (T237 kvarstÃ¥r avsiktligt olÃ¶st).

Samma session mergeade in tvÃ¥ efterhÃ¤ngande grenar (`claude/analysera-aauv10`: Fas 27-sidorna T232â€“T235 ovan; `claude/efterplan-user-experience-zhqz2t`/PR #58: telefonmanus + twitter:card + arvskifte-utÃ¶kning) och fixade en tyst trasig automation:

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T238 | `scripts/indexing/` saknade `package-lock.json` sen introduktionen (T217, 2026-08-14) â€” `npm ci` i `update-sitemap.yml` har failat pÃ¥ **alla** kÃ¶rningar sen dess (`gh run list` verifierat, ej gissat), sÃ¥ varken sitemap-uppdatering eller GSC-submission gÃ¥tt igenom trots att koden var korrekt designad. Lockfil genererad + committad (`dec2dca`), workflow gÃ¥r nu grÃ¶nt fÃ¶rbi npm-steget. | 2026-08-15 | Fas 28 | Session (CI-loggverifiering) | ðŸ”´ | Infra/SEO | âœ” |
| T239 | GSC-submission failade initialt: `User does not have sufficient permission for site 'https://efterplan.se/'` fÃ¶r service-accounten `ga4-reader@intricate-tempo-496015-a0.iam.gserviceaccount.com`. Owner lade till kontot som Full-anvÃ¤ndare i Search Console. Verifierat lÃ¶st genom direkt testkÃ¶rning mot `sitemaps.submit` API:t (`OK: sitemap resubmitted successfully`) â€” hela kedjan (ny/Ã¤ndrad/borttagen HTML-sida â†’ sitemap uppdateras automatiskt â†’ Google notifieras automatiskt) fungerar nu end-to-end utan manuellt steg per sida. | 2026-08-15 | Fas 28 | Session (API-verifiering) | ðŸŸ¢ | Infra/SEO | âœ” |
| T240 | Ny sida `arvskifte-mall.html` â€” SEO-auditens stÃ¶rsta konkreta gap: sÃ¶kordet "arvskifte mall"/"arvskifteshandling mall" domineras av 10+ mallsajter (Blankettbanken, MySign, Ekonomifokus m.fl.) som bara sÃ¤ljer statiska Word/PDF-mallar. Byggd som interaktiv generator istÃ¤llet fÃ¶r textguide: fyll i avliden, arvingar (dynamisk lista) och tillgÃ¥ngar/fÃ¶rdelning (dynamisk lista) â†’ komplett arvskiftesavtal med signaturrader genereras direkt pÃ¥ sidan, kopiera eller skriv ut/spara som PDF via webblÃ¤saren. Ingen fil att ladda ner, inget konto, inget skickas till servern â€” samma mÃ¶nster som `gratis-checklista-abonnemang.html` (T235). InterlÃ¤nkad frÃ¥n `index.html` (tvÃ¥ stÃ¤llen), `arvskifte-guide.html`, `checklista-dodsbo.html`, `bouppteckning-guide.html`, `dodsbo-fastighet.html`. Testat end-to-end i browser preview: formulÃ¤r, dynamisk "tilldelas"-dropdown (buggfixad â€” uppdaterade inte vid namnÃ¤ndring efter tillÃ¤gg), avtalsgenerering. | 2026-08-15 | Fas 28 | Session (SEO-audit) | ðŸŸ¢ | SEO/Product | âœ” |
| T241 | **T239 var bara verifierat lokalt, inte i CI** â€” upptÃ¤ckt nÃ¤r de tre formella demotesterna (skapa/Ã¤ndra/ta bort en sida, enligt Owners ursprungliga prompt) kÃ¶rdes pÃ¥ riktigt. GitHub-secreten `GA4_SERVICE_ACCOUNT_JSON` var ofÃ¶rÃ¤ndrad sen 4 maj, medan en ny giltig nyckel skapats lokalt 14 augusti (T209) men aldrig synkats till GitHub â€” CI kÃ¶rde alltsÃ¥ hela tiden pÃ¥ en fÃ¶rÃ¥ldrad nyckel utan Search Console-behÃ¶righet. Secreten uppdaterad (`gh secret set`) och hela kedjan omtestad pÃ¥ riktigt i CI: ny sida â†’ sitemap uppdaterad + `Sitemap resubmitted till Google Search Console` i loggen; borttagen sida â†’ URL fÃ¶rsvinner ur sitemap + ny notifiering till Google. Ã„ndrad-sida-testet gav ingen synlig diff samma dag (fÃ¶rvÃ¤ntat â€” `lastmod` har dagsprecision). Test-artefakter borttagna efterÃ¥t, inget kvar i produktion. | 2026-08-15 | Fas 28 | Session (formella demotester) | ðŸ”´ | Infra/SEO | âœ” |

---

## ðŸš« AVVISAT / EJ GJORT â€” 2026-08-14

| Beslut | Motivering |
|---|---|
| LinkedIn-profil stÃ¤das till bara Efterplan | Ingen tillgÃ¤nglig verktygsvÃ¤g kunde faktiskt redigera profilen (Gmail-sÃ¶k saknades, computer-use ger bara lÃ¤slÃ¤ge i webblÃ¤sare, ny inloggning i webblÃ¤sarpanelen krÃ¤vdes aldrig). Owner avbrÃ¶t ("skit i det") innan en vÃ¤g hittades. Ohanterat â€” kan tas upp igen om Owner vill logga in i webblÃ¤sarpanelen direkt. |
| Bygga automatiserat LinkedIn-kontohanteringsverktyg | AvbÃ¶jt â€” LinkedIn fÃ¶rbjuder skriptad kontoÃ¥tkomst i sina villkor, risk fÃ¶r avstÃ¤ngning. ErbjÃ¶d manuella alternativ istÃ¤llet. |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-08-16

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T242 | body-parser DoS-sÃ¥rbarhet (low) i ga4-dashboard â€” `body-parser 2.0.0â€“2.2.2` sÃ¥rbar fÃ¶r DoS nÃ¤r ogiltigt `limit`-vÃ¤rde stÃ¤nger av storleksbegrÃ¤nsning (GHSA-v422-hmwv-36x6). Ã…tgÃ¤rda med `cd ga4-dashboard && npm audit fix`. Fil: ga4-dashboard/package.json. | 2026-08-16 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-08-17

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T243 | Performance: Lighthouse CI mÃ¤tte perf 0.76 (budget â‰¥0.80), LCP 3565ms (budget â‰¤2500ms), TBT 305ms (budget â‰¤300ms) â€” alla warn-nivÃ¥, Ã¶ver budget men fÃ¤ller inte bygget. Observerades under T225-testkÃ¶rning 2026-08-16. Utred och Ã¥tgÃ¤rda: identifiera vilka resurser som orsakar LCP och TBT via Lighthouse-artefakt i Actions, optimera render-blockerande JS/CSS i `app.js`/`style.css`. Filer: `app.js`, `style.css`, `.lighthouserc.json`. **Re-mÃ¤tt 2026-09-27 (T253):** homepage perf 0.62 / LCP 4487ms / TBT 422ms; checklista-dodsbo + bouppteckning-guide perf 0.77 / LCP ~4130ms; best-practices 0.74 pÃ¥ homepage + gratis-checklista-abonnemang. Siffrorna Ã¤r sÃ¤mre Ã¤n baseline â€” sannolikt CI-variabilitet (Vercel Edge-cache + nÃ¤tverksjitter pÃ¥ runner), men LCP >4s krÃ¤ver Ã¥tgÃ¤rd. PrimÃ¤r kandidat: Google Fonts-request (render-blockerande, T223), fÃ¶ljt av app.js (150 kB ominifierat, T224). **Ã…tgÃ¤rdat 2026-09-27:** preload-hints fÃ¶r Fraunces normal latin + IBM Plex Sans 400 latin tillagda i alla 17 HTML-sidor (laddas nu parallellt med CSS). `fetchpriority="high"` pÃ¥ style.css i alla sidor. Ã…terstÃ¥r: T224 (minifiera app.js/style.css) fÃ¶r ytterligare LCP-fÃ¶rbÃ¤ttring. | 2026-08-17 | Fas 12 | Veckorapport | ðŸŸ  | Dev/Perf | âœ” |
| T244 | Security headers saknas i `vercel.json`: X-Frame-Options, X-Content-Type-Options, Referrer-Policy och HSTS (`Strict-Transport-Security`) Ã¤r inte satta fÃ¶r `efterplan.se`. **Ã…tgÃ¤rdat 2026-09-12:** nytt globalt `headers`-block i `vercel.json` (`/(.*)`, placerat Ã¶verst i arrayen) sÃ¤tter `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. Krockar inte med de befintliga specifika cache-control-reglerna (Vercel slÃ¥r ihop headers frÃ¥n alla matchande regler). HSTS sÃ¤tts automatiskt av Vercel fÃ¶r SSL-domÃ¤ner â€” verifiera live efter deploy med `curl -sI https://efterplan.se/`. Fil: `vercel.json`. | 2026-08-17 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev/Sec | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-08-24

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T245 | `gsc-positions.yml` saknar schema â€” workflowen som hÃ¤mtar sÃ¶kpositioner frÃ¥n Google Search Console kÃ¶rs bara manuellt (`workflow_dispatch`). Utan schemalagd kÃ¶rning saknas veckovis positionshistorik fÃ¶r att mÃ¤ta SEO-effekten av Fas 28-innehÃ¥ll (arvskifte-mall, guidesidor m.fl.). Ã…tgÃ¤rd: lÃ¤gg till `schedule: - cron: '0 6 * * 1'` i `.github/workflows/gsc-positions.yml` (mÃ¥ndagar 06:00 UTC, fÃ¶re veckorapporten). Fil: `.github/workflows/gsc-positions.yml`. | 2026-08-24 | Fas 28 | Veckorapport | ðŸŸ¡ | Analytics/SEO | âœ” |

---

# ðŸ” SESSION â€” 2026-08-24: veckorapport-uppfÃ¶ljning (trafiktapp + GSC-fel)

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T246 | **GSC 403 Ã¥terkommit â€” samma orsak som T239, ny utlÃ¶sare identifierad.** 2026-08-24-rapporten fick `User does not have sufficient permission for site` frÃ¥n Search Console-anropet. `gh secret list` visar att `GA4_SERVICE_ACCOUNT_JSON` + `GSC_SERVICE_ACCOUNT_JSON` roterades 2026-08-23T13:59 UTC â€” en dag innan felet dÃ¶k upp, och ingen kodÃ¤ndring skedde i mellantiden (verifierat med `git log`). GA4-lÃ¤sning fungerar fortfarande (KPI:erna i rapporten Ã¤r korrekta), sÃ¥ det Ã¤r specifikt Search Console-behÃ¶righeten fÃ¶r det (nya) service-accountet som saknas â€” precis som nÃ¤r `ga4-reader@intricate-tempo-496015-a0.iam.gserviceaccount.com` behÃ¶vde lÃ¤ggas till manuellt i T239. **KrÃ¤ver Owner:** logga in pÃ¥ https://search.google.com/search-console/users?resource_id=sc-domain:efterplan.se, lÃ¤gg till service-accountets `client_email` (finns i den JSON som klistrades in i `keys:rotate -- google` 2026-08-23, eller i Google Cloud Console â†’ IAM â†’ Service Accounts) som Full-anvÃ¤ndare. Kan inte gÃ¶ras av Claude â€” external Google-kontobehÃ¶righet, inget API fÃ¶r det. | 2026-08-24 | Fas 28 | Veckorapport-uppfÃ¶ljning | ðŸ”´ | Infra/SEO | â˜ |
| T247 | **Trafiktapp 82â†’23 sessions (17/8 vs 24/8-rapporten), Paid Search-kanalen fÃ¶rsvann helt (8â†’0).** Uteslutit trasig mÃ¤tning: engagement rate liknande (50%â†’39%), events registreras normalt, ingen kod Ã¤ndrad i mellanveckan (`git log` tomt fÃ¶r index.html/robots.txt/vercel.json). NedgÃ¥ngen Ã¤r alltsÃ¥ verklig trafik, inte ett mÃ¤tfel. Troligast: (a) en Google Ads-kampanj pausades eller slut pÃ¥ budget â€” Paid Search gick till exakt 0, eller (b) fÃ¶regÃ¥ende veckas 82 sessions var en tillfÃ¤llig topp frÃ¥n aktiv outreach (Flashback/Reddit/marketing-outreach-commits samma vecka) som klingat av. **KrÃ¤ver Owner:** kolla Google Ads-kontot (kampanjstatus/budget) och jÃ¤mfÃ¶r med `research/`-loggarna fÃ¶r outreach-timing. Kan inte verifieras vidare av Claude â€” inget Google Ads-API-credential i miljÃ¶n, och sandlÃ¥dan blockerar utgÃ¥ende HTTPS mot externa dashboards. | 2026-08-24 | Fas 28 | Veckorapport-uppfÃ¶ljning | ðŸŸ  | Analytics/Growth | â˜ |

---

# ðŸŽ¨ SESSION â€” 2026-09-02: designgenomgÃ¥ng (11 skills, branch `design-pass`, PR #85)

Strukturerad design-/kvalitetsgenomgÃ¥ng av hela sajten â€” `teach-impeccable â†’ audit â†’ critique â†’ normalize â†’ harden â†’ clarify â†’ typeset â†’ arrange â†’ optimize â†’ onboard â†’ polish`. Alla Ã¥tgÃ¤rder verifierade i browser, en commit per steg. Rapporter i `design-pass/*.md`. **PR #85 Ã¶ppen mot `main`, ej mergad.**

**Ã…tgÃ¤rdat i PR:n:** genomskinlig sticky-nav (Critical) Â· accentpaletten upp till WCAG 2.2 AA (sage 58â†’46 %, ember 60â†’48 %; lÃ¤nktext 3,6â†’5,9:1, primÃ¤rknapp 4,16â†’5,9:1; nytt `--rule-strong` 3,2:1 pÃ¥ fÃ¤ltramar) Â· footer-trÃ¤ffytor 17â†’39 px Â· skiplÃ¤nk pÃ¥ 40 innehÃ¥llssidor Â· aria-labels pÃ¥ JS-genererade bouppteckningsfÃ¤lt Â· ett token-lager (`style-tokens.css` = sanningskÃ¤lla) Â· **Google Analytics bort frÃ¥n alla 41 sidor, Plausible in pÃ¥ alla** Â· `role="main"` pÃ¥ alla SPA-skÃ¤rmar Â· progress-bars `width`â†’`transform` Â· "FortsÃ¤tt din plan"-CTA fÃ¶r Ã¥tervÃ¤ndande Â· "Fylls pÃ¥ efterhand" (var "Fler steg visas hÃ¤r", visades Ã¤ven pÃ¥ fulla sektioner) Â· stegetiketter konsekventa Â· onboarding-/plan-rubriker in i Fraunces-systemet Â· "SÃ¥ hÃ¤r gÃ¥r det till" avkortad frÃ¥n kort-strip till stegsekvens.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T248 | **Emoji som ikonografi â€” systemiskt.** Efterplan anvÃ¤nder emoji som funktionella ikoner pÃ¥ 25+ stÃ¤llen: dokumentikoner (ðŸ¦ ðŸ“° ðŸ›¡ ðŸ› ðŸ“‹ âœ‰ ðŸ“ž), integritetsbadges (ðŸ”’ ðŸ–¥ ðŸ“¤ ðŸ‘¤), trafikljus (ðŸŸ¢ ðŸŸ¡ ðŸ”´), lÃ¥s (ðŸ”’), kamera (ðŸ“·), gnista (âœ¨), bockar (âœ“), stÃ¤ng (âœ•). Krockar med den redaktionella "inte lekfullt"-briefen (`.impeccable.md` anti-ref 3). KrÃ¤ver ett ikon-beslut av Owner: (a) litet custom inline-SVG-set i Fraunces/IBM Plex-vikt, (b) Lucide/Feather via inline SVG (ingen JS-dep â€” repot har ingen byggkedja), eller (c) behÃ¥ll bara de meningsbÃ¤rande (trafikljus som CSS-prickar, `.section-dot`-mÃ¶nstret finns) och ta bort resten. Sedan utbyte pÃ¥ alla stÃ¤llen inkl. `app.js`-mallstrÃ¤ngar + browserverifiering. AnropsstÃ¤llen listade i `design-pass/11-polish.md`. Arkiv-fliken (ðŸ—‚) redan Ã¥tgÃ¤rdad. | 2026-09-02 | Fas 12 | DesigngenomgÃ¥ng (`/polish`) | ðŸŸ¡ | Design | â˜ |
| T249 | **Inline-stilar + `.u-*`-utility-klasser â†’ `style.css`/tokens.** `index.html` har ~43 inline `style=`-attribut; `arvskifte-mall.html` och `bouppteckning-tidslinje.html` har egna `<style>`-block; `.u-*`-klasserna i `style.css` (~rad 2862+, `.u-border-1px-solid-ddd`/`#ddd`, `.u-border-bottom-1px-solid-eee`/`#eee` m.fl.) anvÃ¤nds i 9 innehÃ¥llsfiler (auth-modal, begravning-utomlands, begravningsbyra, boutredningsman, dodsannons, dodsbo-auktion, gravsten, tomma-dodsbo, vad-gora-nar-nagon-dor). Flytta till riktiga klasser, byt `#ddd`/`#eee` mot `var(--rule)`/`var(--rule-strong)`. Mekaniskt stort Ã¶ver mÃ¥nga filer â€” eget stÃ¤duppdrag. Verifiera visuellt ofÃ¶rÃ¤ndrat i browser. **Klart 2026-09-27:** Alla 43 inline `style=`-attribut i `index.html` borttagna. `.u-*`-sektionen i `style.css` deduplikerad (14 dubbletter borttagna) och tokeniserad (`#ddd`â†’`var(--rule-strong)`, `#eee`â†’`var(--rule)`); tillagda saknade/nya klasser (`u-margin-bottom-12/16/24px`, `u-max-width-200/240px`, `u-text-center`, `.modal-input`, `.modal-btn-full`, `.auth-panel`); kontextuella CSS-regler `.doc-form .plan-title/sub`, `.result-actions .btn-*`, `#shared-view`. Ã…terstÃ¥r av T249: `arvskifte-mall.html` och `bouppteckning-tidslinje.html` har egna `<style>`-block som inte Ã¤r de-inlinade. | 2026-09-02 | Fas 12 | DesigngenomgÃ¥ng (`/audit` M10) | ðŸŸ¢ | Dev | âœ” |
| T250 | **Brytpunktssystem.** `style.css` har `@media` pÃ¥ 420, 480, 601, 720 och 1024 px, blandat `min-`/`max-width`, inga tokens â€” "601px" Ã¤r godtyckligt. Etablera 3â€“4 namngivna mobile-first-brytpunkter och rÃ¤tta alla queries mot dem. Fil: `style.css`. | 2026-09-02 | Fas 12 | DesigngenomgÃ¥ng (`/audit` M8) | ðŸŸ¢ | Design/Dev | â˜ |
| T251 | **`security-review` pÃ¥ `design-pass`.** Branchen grenades frÃ¥n `main` och innehÃ¶ll inte T244-koden, sÃ¥ ingen sÃ¤kerhetsgranskning kÃ¶rdes i genomgÃ¥ngen. **KÃ¶rt 2026-09-14** mot mergad PR #85, fokus `app.js`, `scripts/swap-analytics.mjs`, `scripts/add-skip-link.mjs`, bopp-rader + `dodsannons.html`-generatorn. Inga fynd: `resumePlan()`/`track()` rÃ¶r bara egen `localStorage`, bopp-inputs fick `_esc()` tillagt, dÃ¶dsannons-generatorn skriver med `textContent`. | 2026-09-02 | Fas 12 | DesigngenomgÃ¥ng | ðŸŸ¡ | Dev/Sec | âœ” |
| T252 | **Aktivera Plausible custom events.** `optimize`-steget bytte Google Analytics mot Plausible pÃ¥ alla 41 sidor. `track()` i `app.js` och de tvÃ¥ verktygssidorna skickar nu `window.plausible('<event>', {props})` â€” men custom goals mÃ¥ste lÃ¤ggas till i Plausible-dashboarden (Settings â†’ Goals) fÃ¶r att synas: `onboarding_start`, `plan_completed`, `doc_generated`, `bouppteckning_saved`, `free_tool_to_app_click`, `free_tool_letter_generated`, `free_tool_letter_copied`, `free_tool_checklist_updated`. **KrÃ¤ver Owner** â€” dashboard-Ã¥tgÃ¤rd, inget API. **2026-09-10:** ingÃ¥r nu som steg 1 i `ADS-LAUNCH-A.md` (fem viktigaste mÃ¥len listade dÃ¤r, klistra-in-klara). **Klart 2026-09-23:** `free_tool_letter_generated` och `premium_activated` (+ `free_tool_to_app_click`, `plan_generated`, `onboarding_start` m.fl.) finns som Custom Event-mÃ¥l i Plausible, verifierat i dashboarden. | 2026-09-02 | Fas 12 | DesigngenomgÃ¥ng (`/optimize` M3) | ðŸŸ¡ | Analytics | âœ” |
| T253 | **Re-mÃ¤t Lighthouse efter merge av PR #85.** `optimize`-steget tog bort render-blockerande Google Analytics-scriptet frÃ¥n alla sidor och flyttade progress-bar-animationerna till GPU (`transform`) â€” bÃ¶r fÃ¶rbÃ¤ttra T243:s siffror (perf 0.76, LCP 3565 ms, TBT 305 ms). KÃ¶rt 2026-09-27 (Actions run 36299117410). Resultat uppdaterade i T243. | 2026-09-02 | Fas 12 | DesigngenomgÃ¥ng (`/optimize`) | ðŸŸ¢ | Dev/Perf | âœ” |
| T254 | **MÃ¤tuppstÃ¤llning fÃ¶r Google Ads â€” beslut + implementation. BLOCKERAR launch.** Kampanjen enligt `google-ads-underlag-2026-08.md` (4 annonsgrupper, sÃ¶kord, budget 75 kr/dag) Ã¤r **byggd i Google Ads men aldrig aktiverad** (Owner 2026-09-02). Underlagets konverteringsspÃ¥rnings-avsnitt blev **felaktigt av PR #85**: det sÃ¤ger "importera events frÃ¥n GA4" men gtag/GA4 Ã¤r borttaget â€” bara Plausible kvar. Aktiverar man kampanjen nu startar den helt utan konverteringssignal. MÃ¤tuppstÃ¤llningen mÃ¥ste alltsÃ¥ pÃ¥ plats **innan** kampanjen sÃ¤tts live. **Beslut som krÃ¤vs (Owner):** (A) Plausible-only â€” UTM-tagga annonser (`utm_term={keyword}`), aktivera Plausible-goals (**beror pÃ¥ T252**), utvÃ¤rdera per landningssida + SÃ¶ktermsrapporten; ingen Smart Bidding. Eller (B, rek. om budget > ~1â€“2 tkr/mÃ¥n) lÃ¤gg tillbaka **enbart** Google Ads konverteringstagg (`gtag.js` med `AW-`-ID, inte `G-`), fyr konvertering pÃ¥ `plan_completed` + Stripe-tacksidan (49 kr, med vÃ¤rde) â†’ konverteringar/kostnad **per sÃ¶kord** i Ads + Smart Bidding. **Implementation (Alternativ B) BYGGD 2026-09-02 â€” PR #86, avstÃ¤ngd:** `app.js` har `ADS_CONVERSION_ID` + tvÃ¥ etikett-konstanter (tomma = ingen kod laddas), `captureAdClick()` (gclid + utm_* â†’ `localStorage` vid landning, alltid), mjuk konvertering i `generatePlan()`, hÃ¥rd i `handlePremiumReturn()` (vÃ¤rde frÃ¥n Stripe `amount_total`, `transaction_id` = session). `api/verify-checkout.js` returnerar `amount_total`. **Ã…terstÃ¥r (Owner):** skapa tvÃ¥ konverteringsÃ¥tgÃ¤rder i Google Ads â†’ klistra in `AW-`-ID + tvÃ¥ etiketter i `app.js`, bumpa `?v=`, deploya. Steg-fÃ¶r-steg: `ADS-SETUP.md`. Aktivering sÃ¤tter `_gcl_*`-cookies â€” nÃ¤mn ev. i Â§"Din integritet". Alternativ A (Plausible-only) krÃ¤ver ingen kodÃ¤ndring, bara UTM + T252. UtvÃ¤rdera transaktionsnÃ¤ra sÃ¶kord (kostnad/49 kr-kÃ¶p) separat frÃ¥n informationssÃ¶kord (kostnad/`plan_generated`; konkurrerar med egen organisk ranking). **Beslut 2026-09-10: Alternativ A** (Plausible + UTM, ingen Google-kod/cookie). Alt B (PR #86, AW-tagg) mergad till `main` men **avstÃ¤ngd** â€” sparas till om testet visar att annonser Ã¤r vÃ¤rt att skala. Full launch-checklista klistra-in-klar: **`ADS-LAUNCH-A.md`** (bara annonsgrupp 1+3, 75 kr/dag, 2 v). Landningssidorna `arvskifte-mall.html` + `gratis-checklista-abonnemang.html` trycktestade i browser 2026-09-10 (formulÃ¤râ†’brevâ†’`free_tool_letter_generated`, mobil+desktop, inga fel). Ã…terstÃ¥r: Owner kÃ¶r dashboard-stegen 1â€“4 i checklistan, sen skickas siffrorna hit fÃ¶r beslut skala/stoppa. **Klart 2026-09-23 â€” kampanjen LIVE:** kontot hade ingen fÃ¤rdig kampanj (bara ett utkast i fÃ¶rstagÃ¥ngsguiden), sÃ¥ "Campaign #1" byggdes frÃ¥n grunden: SÃ¶k-nÃ¤tverk, Sverige/svenska, 30 kr/dag, Maximera klick (utan max-CPC-tak â€” Owner valde att skippa 8 kr-taket), bred matchning av. Annonsgrupp 1 Arvskifte (6 fras/exakt-sÃ¶kord â†’ `arvskifte-mall.html?utm_source=googleâ€¦`) + annonsgrupp 3 SÃ¤ga upp abonnemang (5 fras-sÃ¶kord â†’ `gratis-checklista-abonnemang.html?utm_source=googleâ€¦`), 7 rubriker/2 beskrivningar vardera. 9 negativa sÃ¶kord pÃ¥ kampanjnivÃ¥. Grupp 2/4 (DÃ¶dsboanmÃ¤lan/Bouppteckning) skapades aldrig. **Alternativ B aktiverat:** Google-tagg `AW-18391491446` statiskt i `index.html` + bÃ¥da annonslandningssidorna, CSP Ã¶ppnad fÃ¶r Googles domÃ¤ner, konverteringsÃ¥tgÃ¤rder *Personlig plan skapad* (`07qVCNedmoIdEPbG38FE`) och *KÃ¶p 49 kr* (`_6NoCNqdmoIdEPbG38FE`, vÃ¤rde + `transaction_id`) ifyllda i `app.js`. UppfÃ¶ljning: T264. | 2026-09-02 | Fas 12 | Session (Owner-frÃ¥ga) | ðŸŸ  | Analytics/Growth | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-09-07

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T255 | `qs` DoS-sÃ¥rbarhet regression i `ga4-dashboard` â€” T104 markerades âœ” men `npm audit` 2026-09-07 visar att GHSA-x5fp-wj9c-mxmx (array-limit bypass via bracket-key comma parsing) + GHSA-4mjr-xmp4-gh2g (DoS via Attacker Controlled isBuffer) tÃ¤cker `qs 2.2.5â€“6.15.3`, dvs. versionen i `ga4-dashboard` Ã¤r fortfarande sÃ¥rbar (1 moderate). **Ã…tgÃ¤rdat 2026-09-12:** `npm audit fix` kÃ¶rd i `ga4-dashboard/` â€” `npm audit` visar nu 0 sÃ¥rbarheter. Bara lockfilen Ã¤ndrades (`package.json` orÃ¶rd). Fil: `ga4-dashboard/package-lock.json`. Issue: https://github.com/joju91/Efterplan/issues/87 | 2026-09-07 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev/Sec | âœ” |
| T256 | Content-Security-Policy (CSP) header saknas i `vercel.json` â€” T244 lÃ¤gger till X-Frame-Options m.fl. men CSP Ã¤r inte med. **Ã…tgÃ¤rdat 2026-09-12:** CSP tillagd i samma `headers`-block som T244. Verifierad mot faktisk resursanvÃ¤ndning (grep Ã¶ver alla 41 HTML-filer + `app.js`, inga iframes/workers/websockets): `script-src 'self' 'unsafe-inline' https://plausible.io https://cdn.jsdelivr.net` (jsdelivr = `jsQR`-biblioteket fÃ¶r rÃ¤kningsskanning, `app.js:1755`), `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`, `font-src 'self' https://fonts.gstatic.com`, `img-src 'self' data:` (bildfÃ¶rhandsvisningar Ã¤r `FileReader.readAsDataURL`, inte blob), `connect-src 'self' https://plausible.io` + Supabase-projektets URL, `frame-ancestors/base-uri/form-action 'self'`. **BegrÃ¤nsning:** `'unsafe-inline'` pÃ¥ script-src krÃ¤vs â€” sajten har hundratals inline `onclick=`-attribut och `<script>`-block utan nonce-infrastruktur; CSP:n stoppar alltsÃ¥ inte inline-XSS, men stoppar exfiltrering till andra domÃ¤ner, clickjacking (frame-ancestors) och base-tag-kapning. Fil: `vercel.json`. Issue: https://github.com/joju91/Efterplan/issues/88 | 2026-09-07 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev/Sec | âœ” |
| T257 | `dodsannons.html` saknas i Lighthouse CI URL-lista â€” `.github/workflows/weekly-health.yml` mÃ¤ter bara `efterplan.se`, `checklista-dodsbo.html` och `bouppteckning-guide.html`. `dodsannons.html` Ã¤r en SEO-prioritetssida (ny generator + prisguide) men faller utanfÃ¶r automatisk prestanda- och tillgÃ¤nglighetsbevakning. **Ã…tgÃ¤rdat 2026-09-12:** `https://efterplan.se/dodsannons.html` tillagd i Lighthouse-URL-listan. Fil: `.github/workflows/weekly-health.yml`. Issue: https://github.com/joju91/Efterplan/issues/89 | 2026-09-07 | Fas 12 | Veckorapport | ðŸŸ¡ | Analytics/SEO | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-09-14

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T258 | `vad-gora-nar-nagon-dor.html` saknas i Lighthouse CI URL-lista. **Ã…tgÃ¤rdat 2026-09-27:** tillagd i `urls`-listan i `.github/workflows/weekly-health.yml`. Issue: https://github.com/joju91/Efterplan/issues/97 | 2026-09-14 | Fas 12 | Veckorapport | ðŸŸ  | Dev/SEO | âœ” |
| T259 | `gratis-checklista-abonnemang.html` saknas i Lighthouse CI â€” Google Ads-landningssida (betald trafik planeras dit, trycktestade 2026-09-10), men tÃ¤cks ej av automatisk prestandakoll. En prestandaregression kostar direkt i Quality Score/CPC. LÃ¤gg till `https://efterplan.se/gratis-checklista-abonnemang.html` i `urls`-listan i `.github/workflows/weekly-health.yml`. Fil: `.github/workflows/weekly-health.yml`. Issue: https://github.com/joju91/Efterplan/issues/98 | 2026-09-14 | Fas 12 | Veckorapport | ðŸŸ  | Dev/SEO | âœ” |
| T260 | 101 inline `onclick=`-attribut i HTML-filer blockerar CSP-fÃ¶rstÃ¤rkning â€” T256 accepterade `'unsafe-inline'` i `script-src` som nÃ¶dvÃ¤ndig kompromiss. Inventering: 101 inline handlers + 6 `<script>`-block i ~20 filer. Flytta handlers till `addEventListener` i `app.js`; bÃ¶rja med `index.html` som pilot. MÃ¶jliggÃ¶r dÃ¤refter nonce-baserad CSP som stoppar inline XSS, inte bara exfiltrering. Filer: alla `.html`-filer + `app.js` + `vercel.json`. Issue: https://github.com/joju91/Efterplan/issues/99 **Klart 2026-09-27:** alla 101 onclick-attribut konverterade till `data-action`/`data-arg` i 6 HTML-filer. Event delegation-dispatcher tillagd i `app.js`. Ã…terstÃ¥r fÃ¶r full nonce-CSP: de 6 inline `<script>`-blocken (per-sida funktioner) â€” eget separat uppdrag. | 2026-09-14 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev/Sec | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-09-21

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T261 | `package.json` engine-field felaktig â€” deklarerar `"node": ">=18"` men `@supabase/*` krÃ¤ver `"node": ">=22.0.0"`. **Ã…tgÃ¤rdat 2026-09-27:** uppdaterad till `"node": ">=22.0.0"`. Fil: `package.json`. Issue: https://github.com/joju91/Efterplan/issues/103 | 2026-09-21 | Fas 12 | Veckorapport | ðŸŸ  | Dev | âœ” |
| T262 | `package-lock.json` inaktuell â€” lÃ¥ser `@supabase/supabase-js` till 2.112.3 och `stripe` till 22.5.0. **Ã…tgÃ¤rdat 2026-09-27:** `npm update` kÃ¶rdes, supabase 2.117.2 och stripe 22.6.2, 0 sÃ¥rbarheter. Fil: `package-lock.json`. Issue: https://github.com/joju91/Efterplan/issues/104 | 2026-09-21 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | âœ” |
| T264 | **Google Ads dag 5-utvÃ¤rdering (2026-09-28).** Kampanjen gick live 2026-09-23 (T254). HÃ¤mta klick + kostnad (Ads) och `free_tool_letter_generated` / `premium_activated` filtrerat pÃ¥ `utm_source=google` (Plausible) + *KÃ¶p 49 kr*-konverteringar (Ads). Beslut enligt `ADS-LAUNCH-A.md`: kostnad per 49 kr-kÃ¶p < 50 kr â†’ skala; mÃ¥nga klick men inga brev â†’ landningssidan; > 50 kr â†’ stoppa, lÃ¤gg pengarna pÃ¥ SEO. StÃ¤da samtidigt: gamla konverteringsÃ¥tgÃ¤rden "KÃ¶p" (felkonfigurerad, primÃ¤r) kan tas bort; en testkonvertering (`transaction_id=cs_test`, 49 kr) + en plan-konvertering frÃ¥n lokal verifiering 2026-09-23 kan synas och ska rÃ¤knas bort. **Klart 2026-09-27:** 17 klick, 123 kr, 2 konverteringar i Google Ads = bÃ¥da testkonverteringar (bekrÃ¤ftat via Supabase purchases: 0 riktig betalning). Gamla "KÃ¶p"-konverteringsÃ¥tgÃ¤rden arkiverad manuellt av Jonas. Beslut: fortsÃ¤tt kampanjen 2 veckor till (~100 klick) fÃ¶r tillrÃ¤ckligt underlag. Kritiskt bifynd: STRIPE_PRICE_ID var satt till strÃ¤ngen 'npm run keys' i Vercel â†’ checkout trasig. Fixat (T265). | 2026-09-23 | Fas 12 | Session (Ads-launch) | ðŸŸ  | Analytics/Growth | âœ” |
| T265 | **STRIPE_PRICE_ID korrupt i Vercel â€” checkout trasig sedan 2026-08-23.** Env var var satt till strÃ¤ngen `'npm run keys'` istÃ¤llet fÃ¶r ett giltigt price_id. Alla `create-checkout`-anrop returnerade 500 ("No such price: 'npm run keys'"). Inga riktiga kÃ¶p hade skett (bekrÃ¤ftat: purchases-tabellen innehÃ¥ller bara 2 testrader, livemode=false). **Fixat 2026-09-27:** rÃ¤tt pris hittades via Stripe CLI (`price_1U3XGNKF2aIglTGKeat4L5WB`, 4900 Ã¶re = 49 kr, one-time, SEK, live, active), STRIPE_PRICE_ID uppdaterat i Vercel production. Verifierat fungerande efter deploy. | 2026-09-27 | Fas 16 | Session | ðŸ”´ | QA/Infra | âœ” |

---

# ðŸ“¡ FAS 27 â€” COMMUNITY-SCAN-RUTINEN Ã„R BLOCKERAD (2026-09-22)

ðŸ’¡ T211 (2026-08-14) skapade den Ã¥terkommande molnrutinen "Community-scan efterplan.se" (`trig_01RSTqpLnTb2UapAYiYvkrFw`). Den kÃ¶rdes fÃ¶r fÃ¶rsta gÃ¥ngen 2026-09-21 06:13 UTC och gav noll resultat â€” inte fÃ¶r att inga trÃ¥dar hittades, utan fÃ¶r att sessionens nÃ¤tverkspolicy (agent-proxy) helt nekar utgÃ¥ende uppkoppling till mÃ¥lforumen. Testat igen manuellt 2026-09-22, samma resultat.

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T263 | Community-scan-rutinen (T211) kan inte kÃ¶ra i den hÃ¤r sandboxen â€” agent-proxyn svarar `403 connect_rejected` pÃ¥ TCP-nivÃ¥ (CONNECT-tunnel) fÃ¶r `reddit.com`, `flashback.org` **och** `familjeliv.se`, bÃ¥de via WebFetch och rÃ¥ `curl`. Det Ã¤r alltsÃ¥ inte en enskild sidas blockering utan hela domÃ¤ner nekade av org-policy. Verifierat tvÃ¥ gÃ¥nger (2026-09-21 automatiskt, 2026-09-22 manuellt) med samma utfall. WebSearch (som gÃ¥r via ett annat backend) ger fortfarande trÃ¤fflistor/snippets, men utan sidÃ¥tkomst gÃ¥r det inte att lÃ¤sa hela trÃ¥den, bekrÃ¤fta att den fortfarande Ã¤r aktiv, kolla community-reglerna pÃ¥ plats eller se om nÃ¥gon redan lÃ¤nkat en konkurrent â€” att skriva svarsfÃ¶rslag Ã¤ndÃ¥ vore att gissa, vilket rutinens egna instruktion ("LÃ¤s trÃ¥den och fÃ¶rstÃ¥ vad personen faktiskt frÃ¥gar") uttryckligen krÃ¤ver att man inte gÃ¶r. Rutinen fÃ¶ll tillbaka korrekt pÃ¥ sin "inga nya fynd"-regel (ingen commit, ingen PR) och skickade istÃ¤llet en notis om blockeringen. **KrÃ¤ver Owner-beslut:** (a) vitlista `reddit.com`/`flashback.org`/`familjeliv.se` i miljÃ¶ns nÃ¤tverkspolicy sÃ¥ rutinen kan lÃ¤sa trÃ¥dar pÃ¥ riktigt, (b) skriv om rutinen till att basera fynd enbart pÃ¥ WebSearch-snippets (snabbare men hÃ¶gre risk fÃ¶r felaktiga sammanfattningar/svarsfÃ¶rslag â€” bÃ¶r i sÃ¥ fall flaggas tydligt i `community-watch.md`), eller (c) pausa/ta bort triggern (`trig_01RSTqpLnTb2UapAYiYvkrFw`) tills (a) Ã¤r lÃ¶st, sÃ¥ den inte fortsÃ¤tter kÃ¶ra veckovis utan att kunna producera nÃ¥got. | 2026-09-22 | Fas 27 | Session | ðŸŸ  | Infra | â˜ |

---

# ðŸ’° SESSION â€” 2026-09-25: UI/UX-granskning, pristext, distribution-sprint (PR #108)

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T269 | Hero-pristexten kortad (var tÃ¤t paragraf med tvÃ¥ fetstilsblock, nu en rad) + paywall-kortets rubrik bytt frÃ¥n vag ("LÃ¥s upp de Ã¶vriga breven") till konkret ("LÃ¥s upp banken, Skatteverket och fullmakten â€” 49 kr"). `index.html`. Mergat frÃ¥n PR #108 2026-09-27. | 2026-09-25 | Fas 12 | Session (UI/UX) | ðŸŸ¡ | Design/Growth | âœ” |
| T270 | GA4-mÃ¥nadsanalys blockerad â€” `GA4_SERVICE_ACCOUNT_JSON` finns bara som GitHub Actions-secret, inte i Vercel; CLI-inloggning (OAuth) krÃ¤ver Owners webblÃ¤sarsession. **KrÃ¤ver Owner:** logga in `vercel`/`npx supabase login` om Vercel-synk ska funka, eller hÃ¤mta GA4-nyckeln via console.cloud.google.com. | 2026-09-25 | Fas 28 | Session | ðŸŸ  | Analytics | â˜ |
| T271 | Traffic-sprint, budget 0 kr: 3 klistra-in-klara distributionsinlÃ¤gg (Reddit r/sweden, LinkedIn, Flashback) + 2 uppfÃ¶ljningsmejl till kontakter utan svar sedan aug (RÃ¥d & RÃ¶n, Svenska kyrkan) + 2 ny outreach (AnhÃ¶rigas RiksfÃ¶rbund, Rika Tillsammans). Sparat i `att-posta-2026-09-25.md`, loggat i `distribution-log.md`. Postning krÃ¤ver Owner. | 2026-09-25 | Fas 28 | Session | ðŸŸ  | Distribution | â§– VÃ¤ntar pÃ¥ Owner: posta/skicka |
| T272 | SÃ¶ktrÃ¥dsforskning (Flashback/Reddit) fortfarande opÃ¥litlig via WebSearch â€” bekrÃ¤ftat igen 2026-09-25. Om tillfÃ¶rlitlig sÃ¶kvÃ¤g blir tillgÃ¤nglig (inloggad session, Reddit API), bygg om trÃ¥dbevakningen kring den. | 2026-09-25 | Fas 28 | Session | ðŸŸ¢ | Research | â˜ |
| T273 | `scripts/google-ads/optimize.mjs`: `analyzeWithClaude()` kraschade okontrollerat nÃ¤r `ANTHROPIC_API_KEY` var ogiltig â€” inget rapportfil skrevs. Lagt in try/catch runt Claude-blocket (steg 7â€“8); vid API-fel sÃ¤tts `summary` till felmeddelande och skriptet fortsÃ¤tter skriva en datarÃ¥drapport utan AI-analys. **KrÃ¤ver Owner:** uppdatera `ANTHROPIC_API_KEY` i GitHub Actions-secrets fÃ¶r att Claude-analysen ska fungera (`gh secret set ANTHROPIC_API_KEY`). | 2026-09-27 | Fas 12 | Session | ðŸŸ  | Infra/Dev | âœ” |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-09-28

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T274 | `auth-modal.html` saknar `<meta name="description">` â€” auth-modalen Ã¤r en indexerbar HTML-sida men har ingen meta-description. Ger tomt snippet-text i SERP och kan sÃ¤nka CTR fÃ¶r sidan. LÃ¤gg till en beskrivande `<meta name="description" content="...">` i `<head>`. Fil: `auth-modal.html`. Issue: https://github.com/joju91/Efterplan/issues/115 | 2026-09-28 | Fas 12 | Veckorapport | ðŸŸ¡ | SEO | â˜ |

---

# ðŸ” VECKORAPPORT-TICKETS â€” 2026-10-05

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T275 | **stripe 23.0 major version** â€” `npm outdated` visar `stripe Latest: 23.0.0` mot package.json `^22.1.1` (lock vid 22.6.2). Stripe 23 Ã¤r en major bump; granska changelog fÃ¶r breaking changes (apiVersion-krav, borttagna metoder, Node.js miniversion). Uppdatera package.json `^22.1.1 â†’ ^23.x`, kÃ¶r `npm update stripe`, verifiera att `api/_lib.js` (`stripe(key, { apiVersion })`) och `api/verify-checkout.js` fortfarande fungerar. Fil: `package.json`, `api/_lib.js`. Issue: https://github.com/joju91/Efterplan/issues/136 | 2026-10-05 | Fas 12 | Veckorapport | ðŸŸ¡ | Dev | â˜ |
| T276 | Flytta betalda brevgeneratorer frÃ¥n den publika klienten (`app.js`) till `api/generate-premium-document.js`. Servern verifierar ett betalt Stripe-kÃ¶p av Efterplans pris eller en inloggad anvÃ¤ndares kÃ¶p innan den returnerar genererat innehÃ¥ll; kontoentitlements filtreras efter Stripe test/live-lÃ¤ge sÃ¥ testrader inte lÃ¥ser upp livekÃ¶p. Omfattar uppsÃ¤gningsbrev, massbrev, bankbrev, hyresvÃ¤rdsbrev, pensionsbrev, dÃ¶dsannons, Skatteverksbrev och fullmakt. Klienten behÃ¥ller formulÃ¤r och visning; malltexterna exponeras inte fÃ¶re Ã¥tkomstkontroll. Personnummer och Ã¶vriga nÃ¶dvÃ¤ndiga fÃ¤lt skickas tillfÃ¤lligt fÃ¶r att skapa brevet och sparas inte av generatorn; integritetstexten uppdaterad. Syntaxkontroller passerade. | 2026-10-07 | SÃ¤kerhet | Granskning Efterplan | ðŸ”´ | Dev/Sec | âœ” |
| T277 | SÃ¤tt sÃ¤kerhetsÃ¤ndringarna i produktion: tillÃ¤mpa den granskade SQL-Ã¤ndringen fÃ¶r delningsrÃ¤ttigheter och unsubscribe_token, deploya API och frontend frÃ¥n den uppdaterade main-grenen. Vercel-inloggning och Supabase-lÃ¤nkning bekrÃ¤ftade i Ã¤garens terminal; sÃ¤kerhetsgrenen skapas frÃ¥n senaste GitHub-main. AgentmiljÃ¶n kan inte ansluta till Supabase/Vercel (EACCES), sÃ¥ SQL-Ã¤ndring och produktion deploy Ã¥terstÃ¥r. | 2026-10-07 | SÃ¤kerhet | Granskning Efterplan | ðŸ”´ | Infra/Dev | â³ VÃ¤ntar pÃ¥ SQL och deploy |
| T278 | Verifiera efter T277 i testmiljÃ¶: Stripe-kÃ¶p/avbrutet kÃ¶p och premiumÃ¥terstÃ¤llning; signerad webhook skapar bara kÃ¶p fÃ¶r rÃ¤tt Premium-pris och replay Ã¤r idempotent; frÃ¤mmande betald Checkout-session ger inget kÃ¶p; nekad premiumÃ¥tkomst utan giltig session; delad lÃ¤nk kan skapas men delningstoken kan inte listas av anon; personnummer synkas inte och Ã¤ldre fjÃ¤rrvÃ¤rden tas bort; AI-endpointar avvisar fel filtyp/storlek och stÃ¤nger sÃ¤kert vid rate-limit-fel. Mobilgranskningens fokus- och avsluta-knappsfynd Ã¤r Ã¥tgÃ¤rdade; smÃ¥ tryckmÃ¥l hÃ¶jda till minst 44 px och brevknappar lÃ¥ses under generering. Integritetstexter korrigerade fÃ¶r synkade dokument och kontoradering. Lokala syntaxkontroller (`node --check` pÃ¥ Ã¤ndrade JS-filer) och `git diff --check` passerade; cacheversioner hÃ¶jda (`efterplan-v19`, `style.css?v=14`, `supabase-client.js?v=4`, `app.js?v=41`) sÃ¥ Ã¤ndringarna kan hÃ¤mtas efter deploy. Betalnings-/databasfallen vÃ¤ntar pÃ¥ T277. | 2026-10-07 | SÃ¤kerhet | Granskning Efterplan | ðŸ”´ | QA/Sec | â˜ VÃ¤ntar pÃ¥ T277 |
| T279 | PÃ¥minnelsemejl avstÃ¤ngda i kod: tog bort dagliga GitHub Actions-utskicket och dess sÃ¤ndarskript, tog bort anmÃ¤lan i appen och stÃ¤ngde anmÃ¤lnings-API:t (410). BehÃ¶ll avregistrerings-endpoint och databastabell sÃ¥ tidigare mottagare kan avregistrera sig och data inte raderas oavsiktligt. **Produktionsstopp krÃ¤ver T277:** gamla workflowet kan fortsÃ¤tta kÃ¶ras tills Ã¤ndringarna nÃ¥tt `main` och ny deploy har skett. | 2026-10-07 | Produkt/SÃ¤kerhet | Granskning Efterplan | ðŸŸ  | Product/Dev | â§– VÃ¤ntar pÃ¥ T277 |
| T280 | BestÃ¤m och verkstÃ¤ll gallring av Ã¤ldre rader i `reminder_optins` (e-post, dÃ¶dsdatum och samtyckesval) nu nÃ¤r nya anmÃ¤lningar och utskick Ã¤r avstÃ¤ngda. Integritetstexten upplyser nu att Ã¤ldre uppgifter kan finnas kvar och hur man begÃ¤r radering. Radera inte befintliga rader utan beslut om hantering/backup; behÃ¥ll avregistreringsflÃ¶det tills Ã¤ldre lÃ¤nkar inte lÃ¤ngre behÃ¶vs. | 2026-10-07 | Integritet | Granskning Efterplan | ðŸŸ  | Data/Privacy | â˜ |
| T281 | GÃ¶r radering av konto/synkad data verifierbar. Vid en raderingsbegÃ¤ran ska planen och dokumentrader tas bort, tillhÃ¶rande foton Ã¤ven raderas ur Supabase Storage och Auth-kontot hanteras sist; dokumentera en manuell rutin eller bygg ett sÃ¤kert sjÃ¤lvbetjÃ¤ningsflÃ¶de. Nuvarande integritetstext hÃ¤nvisar till Kontakt och lovar inte automatisk kontoradering. | 2026-10-07 | Integritet | Granskning Efterplan | ðŸŸ  | Data/Dev | â˜ |
