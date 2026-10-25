---
name: run
description: >
  Daglig driftrunda för Efterplan: kör Efterplans routines, går igenom
  Gmail-mappen Arbete/Efterplan, planerar åtgärder, lägger in dem i
  roadmap.md, utför dem och rapporterar bara det Jonas måste göra själv.
  Använd när Jonas skriver /run, "kör run", "driftrunda", "kör routines och
  kolla mejl". Ersätter den inbyggda /run (att starta appen: run-efterplan).
---

# /run — driftrunda Efterplan

Sex steg i ordning. Kort output, inga mellanrapporter utöver task-listan.

Körs automatiskt mån + tor 08:30 som molnrutin ("Efterplan /run") och kan
köras manuellt. I molnet: routine-verktyget heter Claude_Code_Remote-connectorn
(lokalt `RemoteTrigger`), webbläsarpanel saknas, och ingen kan svara på frågor —
fatta beslutet enligt reglerna här eller gör det till en Owner-punkt.

**Token-regler (gäller hela körningen):**
- Hämta minsta möjliga först (metadata, snippets), läs fullt bara det som
  faktiskt kan kräva åtgärd.
- Läs routine-loggar en gång, efter avslut, och använd bara slutraden
  (`result:`). Fråga aldrig samma sak två gånger.
- Inga subagenter, ingen webbsökning om inte en åtgärd kräver det.
- Upprepa inte rådata i svaret — bara slutsatser.

## 0. Förberedelse

`git checkout main && git pull` (routines pushar till main). Finns
ocommittat arbete: rör det inte — hoppa över kodändringar i steg 5 och
nämn det i rapporten.

## 1. Routines

Lista routines → välj triggers som är `enabled`, saknar
`run_once_at` (inte engångspåminnelser) och där repo är
`joju91/Efterplan` **eller** namnet innehåller "efterplan" (skiftlägesokänsligt).
**Hoppa alltid över "Efterplan /run" själv.**
Idag: nattrapport, AI-synlighet, community-scan, monday-weekly-update.
Lokala `scheduled-tasks` ingår inte (inga Efterplan-uppgifter där).

Per trigger:
1. `list_runs` (limit 1). Startad < 20 h sedan → återanvänd den, kör inte om.
2. Annars `run`.
3. När alla är startade: gör steg 2 medan de kör, vänta sedan in dem
   (max 20 min totalt). Ensam `sleep` blockeras — vänta med Monitor/
   `until`-loop eller kolla igen efter annat arbete. Läs resultatet en gång:
   `get_run_log` → `result:`-raden lokalt; i molnet ger sessionsposten inget
   resultat, läs då det routinen lämnat (veckorapport-fil, commits/PR:er,
   mejl "Efterplan – åtgärd krävs" i inkorgen). Ej klar → notera "pågår".

Spara per routine: status + fynd som kräver åtgärd (tom om inget).

## 2. Mejl — Arbete/Efterplan

`search_threads` query `label:arbete-efterplan is:unread`,
view `THREAD_VIEW_MINIMAL`, pageSize 50 (bläddra om `nextPageToken`).
Klassa på avsändare/ämne/snippet:

| Typ | Exempel | Hantering |
|---|---|---|
| Brus | Vercel/GitHub-PR-notiser, nyhetsbrev, kampanjer, "site is live" | bara läsmarkera |
| Info | uptime-rapport, GSC-milstolpar, Ads-optimering utan åtgärd | läsmarkera, 1 rad i rapport |
| Åtgärd | nyckel/token upphör, faktura/budget, GitGuardian, CI-fel, GSC-indexeringsfel, Supabase-ändringar, "Efterplan – åtgärd krävs" | `get_thread` `PLAIN_TEXT` → planera |
| Svar krävs | människa som frågar något | `get_thread` → `create_draft` (svenska, 2–5 meningar, skicka aldrig) |

Efter genomgång: `unlabel_thread` med `UNREAD` för varje tråd.
Radera, arkivera eller skicka aldrig.

## 3. Plan

Slå ihop fynd från steg 1–2 till åtgärder. Kolla dubbletter först:
`grep` i `roadmap.md` efter nyckelord — finns en öppen ticket (☐/⧖), uppdatera
den i stället för att skapa ny. Varje åtgärd får:
- prio enligt legend: 🔴 något slutar fungera / säkerhet / deadline ≤ 7 dagar ·
  🟠 påverkar användare eller intäkt · 🟡 förbättring · 🟢 städning
- ägare: **Claude** (kan lösas här) eller **Owner** (se steg 6)

## 4. Roadmap

Lägg nya tickets sist i `roadmap.md`, under en sektion per körning:

```
---

# 🛠 DRIFT — YYYY-MM-DD

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T<n> | <vad + fil/URL + hur> | YYYY-MM-DD | Drift | Routine <namn> / Gmail | 🔴 | Infra | ☐ |
```

Nästa ID: högsta `T<nummer>` i filen + 1. Owner-tickets börjar med
`**Owner, senast <datum>:**` om det finns en deadline.

## 5. Utför

Ta Claude-tickets i prioordning. Kodändringar: gren `drift/YYYY-MM-DD`, en
commit per ticket, PR mot main.
- Vänta på CI med `subscribe_pr_activity` (moln) eller en `until`-loop på
  `gh pr checks`, inte `sleep`.
- **Merga själv** när CI är grön och ändringen inte rör betalning (Stripe),
  auth, `supabase/`-schema, hemligheter eller radering av data.
- Annars: lämna PR:en öppen och gör den till en Owner-punkt.
- Verifiera innan ✔: preview (`run-efterplan`, lokalt) eller
  `python -m http.server` + curl (moln) för det som syns i UI,
  `node --check`/torrkörning för skript, curl mot efterplan.se för API/live.
  UI-ändring som inte kan verifieras visuellt i molnet → lämna PR öppen.
- Uppdatera ticketens status (✔ eller ⧖ + varför) i samma PR.

Aldrig: force-push, `--no-verify`, radera data, skicka mejl (utom
slutrapporten i molnet), posta publikt,
betala/ändra plan, köra hela `supabase/schema.sql`.

## 6. Owner-punkter — sista utvägen

Innan något blir en Owner-punkt, pröva i tur och ordning:
1. CLI/verktyg som redan finns: `gh`, `npm run keys:sync`, Supabase MCP,
   Vercel-token (`SELECT value FROM agent_config WHERE key='VERCEL_TOKEN'`),
   GA4/GSC-skripten i `scripts/` och `ga4-dashboard/`.
2. Webbläsarpanelen (bara lokalt) för att läsa status i dashboards där Jonas
   redan är inloggad.
3. En alternativ väg som når samma mål (t.ex. annan endpoint, återställ
   tidigare deploy, konfig-ändring i repo).

Bara det som fortfarande kräver Jonas blir Owner-punkt — typiskt:
inloggning/skapa nyckel i en konsol, betalning, juridiska/kommunikativa
beslut, något oåterkalleligt.

## Slutrapport

```
## /run — YYYY-MM-DD

**Du behöver göra (N)**
1. 🔴 <vad> — <exakt steg/länk/kommando>, senast <datum>

**Gjort (N)** — <ticket: en rad var, PR-länk>
**Routines** — <namn: ok / fynd / pågår>
**Mejl** — <x genomgångna, y utkast, z åtgärder>
```

Tom "Du behöver göra" → skriv "Inget — allt löst." Ingen annan text.

**I molnet:** skicka rapporten som mejl till jonas.soderstrom43@gmail.com,
ämne `Efterplan /run YYYY-MM-DD — N att göra`, **bara om** "Du behöver göra"
inte är tom. Det är det enda mejl skillen får skicka.
