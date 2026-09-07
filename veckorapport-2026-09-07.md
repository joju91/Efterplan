# Efterplan — 2026-09-07

🔢 Sessions: GA4 SAKNAS (Plausible aktiv sedan PR #85) | Uptime: ej verifierbar (proxy 403)

🔧 Uptime: ej mätbar (sandbox-proxy blockerar utgående HTTPS) | Sårbarheter: 1 moderate (ga4-dashboard/qs) | Brutna länkar: ej mätt
   - T255: `qs 2.2.5–6.15.3` sårbar (GHSA-x5fp-wj9c-mxmx) i `ga4-dashboard/` — T104 var ✔ men ny advisory täcker samma version
   - T244 (3 v gammal): security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) saknas fortfarande i `vercel.json`

📣 PR #85 (design-pass) mergad: Google Analytics ersatt av Plausible på alla 41 sidor. Aktivera Plausible custom goals (T252) innan nästa kampanj — annars syns inga events i dashboarden.

🎫 Nya tickets: T255 – qs DoS-regression ga4-dashboard (#87) | T256 – CSP header saknas (#88) | T257 – dodsannons.html saknas i Lighthouse CI (#89)

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | T244: Lägg till X-Frame-Options, X-Content-Type-Options, Referrer-Policy i vercel.json | `vercel.json` | 🟠 |
| 2 | T255: `cd ga4-dashboard && npm audit fix` (fixar qs-regression) | `ga4-dashboard/package-lock.json` | 🟡 |
| 3 | T252: Aktivera Plausible custom goals i dashboard (Owner-åtgärd) | Plausible UI | 🟡 |

---

## DEL 1 — GA4

GA4 SAKNAS — ingen `GOOGLE_APPLICATION_CREDENTIALS` i sandlådan. **OBS:** PR #85 (mergad 2026-09-02) bytte Google Analytics mot Plausible på alla 41 sidor — `track()` i `app.js` anropar nu `window.plausible()`. Föreg. GA4-rapport (2026-08-24): 23 sessions, engagement rate 39 %.

---

## DEL 2 — Kodaudit

| Kontroll | Resultat |
|----------|---------|
| HTML utan meta description | `auth-modal.html` (känd false positive T100 × — fragmentfil, ej egen sida) |
| TODOs/FIXMEs | Inga hittade |
| Analytics events | `track()` → `window.plausible()` sedan PR #85. Events: `onboarding_start`, `plan_generated`, `task_completed`, `checkbox_toggle`, `reminder_optin`, `deadline_dates_computed`, `note_saved`, `premium_activated`, `preview_cta_clicked`, `bill_added` m.fl. |
| Sårbarheter ga4-dashboard | 1 moderate: `qs 2.2.5–6.15.3` (GHSA-x5fp-wj9c-mxmx + GHSA-4mjr-xmp4-gh2g) — T104 var ✔ men ny advisory täcker versionen |
| Security headers vercel.json | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, CSP saknas (T244 ☐ sedan 3 v) |
| Sitemap täckning | Komplett — root URL + alla HTML-sidor i sitemap.xml |
| Uptime efterplan.se | Ej mätbar — sandbox-proxy returnerar 403 mot externa HTTPS |

### Viktig veckoändring
- **PR #85 mergad** (2026-09-02): Plausible ersätter GA4, Fraunces-typografi, WCAG-kontrast, skip-links, sticky-nav, progress-bar GPU-animationer — se roadmap T248–T254 för uppföljningstickets.
- **T245 klar**: `gsc-positions.yml` schemalades (måndag 06:00 UTC).

---

## DEL 3 — Roadmap-status

| | Antal |
|-|-------|
| ✔ Klara | 185 |
| ⧖ Pågår | 11 |
| ☐ Ej startade | 52 |

**Pågår (urval):**
- T015/T016: User research (relatives interviews)
- T032: Purchase flow test
- T060: Push notifications — branch `codex/t060-checkpoints`, ej mergad
- T079: Betald byrålisting (Owner-beslut krävs)
- T081: Drop-off analys

**Öppna Owner-blockers:**
- T246 🔴: GSC 403 — lägg till service-account i Search Console
- T254 🟠: Google Ads mätuppställning — beslut (Plausible-only A eller Ads-tagg B) krävs före kampanjaktivering
- T252 🟡: Aktivera Plausible custom goals i dashboard
- T244 🟠: Security headers (3 v gammal, 5-raders ändring i vercel.json)

---

## DEL 4 — Nya tickets

| ID | Titel | Issue | Prio |
|----|-------|-------|------|
| T255 | `qs` DoS-regression i `ga4-dashboard` (GHSA-x5fp-wj9c-mxmx) | #87 | 🟡 |
| T256 | Content-Security-Policy (CSP) header saknas i `vercel.json` | #88 | 🟡 |
| T257 | `dodsannons.html` saknas i Lighthouse CI URL-lista | #89 | 🟡 |

---

*Genererad automatiskt 2026-09-07 av Claude Code veckorapport-rutin.*
