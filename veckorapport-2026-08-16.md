# Efterplan — 2026-08-16

> Genererad automatiskt av Claude Code (schemalagd veckorapport).

---

## 🔢 Nyckeltal (GA4)

GA4 SAKNAS — ingen credentials-fil i molnsandlådan. Se föregående rapport (2026-08-03) för senaste nyckeltal: 12 sessions, 75% organisk, 1 onboarding_start, 1 plan_generated.

---

## 🔧 Teknisk audit

**Uptime:** Ej verifierbar från molnsandlåda (proxy blockerar utgående HTTPS). Senast känd: 200 på 0.21s (2026-08-03).

**npm audit (ga4-dashboard):** 0 critical · 0 high · 0 moderate · **1 low** (body-parser DoS — GHSA-v422-hmwv-36x6, fixas med `npm audit fix`)
**npm audit (root):** Ej tillämpbar (package-lock.json saknas — se T130)

**Paket med status MISSING (npm outdated):** @supabase/supabase-js, stripe — beror på att package-lock.json saknas i repo-roten (T130, ☐)

**Kodfynd:**
- `ga4-dashboard/package.json`: body-parser 2.0.0–2.2.2 sårbar för DoS (GHSA-v422-hmwv-36x6) — fix: `cd ga4-dashboard && npm audit fix` → **T242 #66**

---

## 🗺️ Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 181 |
| ⧖ Pågår | 8 |
| ☐ Ej startade | 41 |
| x Avskrivna | 11 |

**Pågår (urval):**
- T145 AI-kategorisering (kräver `ANTHROPIC_API_KEY` i Vercel — Owner-åtgärd)
- T123 De-inlining av utility-klasser (återstår: rulla ut på övriga sidor)
- T060 Push notifications (branch ej mergad till main)
- T032 Testa hela köpflödet

**Nästa öppna (högt värde):**
- T135 🔴 Deadline-motor — räkna ut lagstadgade frister automatiskt
- T136 🟡 Påminnelsemejl om deadlines
- T237 🟠 Prisrad på startsidan stämmer inte med koden — Owner-beslut krävs

---

## 📣 Marknadsinsikt

**Fas 28 är aktiv: trafik är allt.** Sitemap-automatiken fungerar nu end-to-end (T241 ✔), och tre nya SEO-sidor (T232–T235) är ute sedan 2026-08-14. **Konkret åtgärd denna vecka:** merga T060 (push notifications-branch `origin/codex/t060-checkpoints`) till main — blockar T136, och T136 blockar hela påminnelseflödet.

---

## 🎫 Nya tickets

| ID | Titel | Issue | Prioritet |
|----|-------|-------|-----------|
| T242 | body-parser DoS-sårbarhet (low) i ga4-dashboard | [#66](https://github.com/joju91/Efterplan/issues/66) | 🟡 |

---

## ✅ Åtgärder att godkänna

| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | `npm audit fix` för body-parser (T242) | ga4-dashboard/package.json | 🟡 |
| 2 | Sätt `ANTHROPIC_API_KEY` i Vercel env för AI-kategorisering (T145) | Vercel dashboard | 🔴 |
| 3 | Merga branch `origin/codex/t060-checkpoints` till main (T060) | — | 🟠 |

---

## 📊 Git-aktivitet (sedan 2026-08-03)

- **73** commits sedan förra rapporten (Fas 27–28: SEO-sidor, sitemap-automation, Dokumentcentral, arvskifte-mall, marketing-outreach)
- Senaste: `Marketing: Google Ads-kampanjunderlag (snabbstart, steg 3 av trafikplanen)`
