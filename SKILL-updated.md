---
name: monday-efterplan-weekly-update
description: Veckovis måndag-rapport för efterplan.se: GA4-trafik, teknisk audit och marknadsföringsinsikter med konkreta kodåtgärder
---

# Måndag-rapport: Efterplan.se

Kör alla delar, sammanställ rapport, presentera för Jonas. Inget körs utan godkännande.

---

## SETUP

```bash
cd /tmp && rm -rf ep && git clone --depth=1 https://github.com/joju91/Efterplan.git ep 2>&1 | tail -1
pip install google-analytics-data requests --break-system-packages -q
```

---

## DEL 1 — GA4 (om credentials finns)

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/efterplan/ga4-service-account.json"
[ -f "$GOOGLE_APPLICATION_CREDENTIALS" ] && echo "GA4 OK" || echo "GA4 SAKNAS – hoppa över DEL 1"
```

Om GA4 finns: hämta sessions, organisk andel, topp-3 sidor, events (onboarding_start, plan_generated, task_completed) för 7 dagar. Jämför mot förra veckan. Om GA4 saknas: notera det kort och gå vidare.

---

## DEL 2 — Kodaudit (5 kontroller, komprimerad output)

```bash
cd /tmp/ep

echo "=MISSING META="
grep -rL 'meta name="description"' --include="*.html" . | grep -v node_modules | head -5

echo "=TODOS="
grep -rn "TODO\|FIXME" --include="*.js" --include="*.html" . | grep -v node_modules | head -10

echo "=GA4 EVENTS="
grep -n "track(" app.js | head -10

echo "=VULNS="
cd /tmp/ep/ga4-dashboard && npm audit --json 2>/dev/null \
  | python3 -c "import sys,json; d=json.load(sys.stdin); v=d.get('metadata',{}).get('vulnerabilities',{}); print(v)" 2>/dev/null || echo "ej tillgänglig"

echo "=OUTDATED="
npm outdated 2>/dev/null | head -6 || echo "ej tillgänglig"
```

Live-sajt (om nätverket tillåter):
```python
import requests
try:
    r = requests.get("https://efterplan.se", timeout=8)
    print(f"Uptime: {r.status_code} {r.elapsed.total_seconds():.1f}s")
except Exception as e:
    print(f"Ej nåbar: {e}")
```

---

## DEL 3 — Roadmap-status (endast dessa rader)

```bash
ROADMAP="/tmp/ep/roadmap.md"
echo "Klara: $(grep -c '| ✔' $ROADMAP)"
echo "Pågår: $(grep -c '| ⧖' $ROADMAP)"
echo "Ej startade: $(grep -c '| ☐' $ROADMAP)"
echo "=PÅGÅR="
grep '| ⧖' $ROADMAP | awk -F'|' '{print $2, $3}' | head -8
echo "=NÄSTA ÖPPNA="
grep '| ☐' $ROADMAP | awk -F'|' '{print $2, $3}' | head -3
```

Marknadsinsikt: en mening om vad som driver mest värde just nu och en konkret åtgärd denna vecka. Inget mer.

---

## DEL 4 — Auto-tickets

Identifiera nya problem från DEL 2 som saknar ☐/⧖-ticket i roadmap. Max 3 tickets per körning.

```bash
ROADMAP="/sessions/dreamy-eager-feynman/mnt/Efterplan/roadmap.md"
LAST_T=$(grep -oP '\| T\K[0-9]+' "$ROADMAP" | sort -n | tail -1)
TODAY=$(date +%Y-%m-%d)
echo "Nästa: T$((LAST_T+1)), datum: $TODAY"
```

Lägg till i slutet av roadmap (workspace-fil):
```
---

# 🔍 VECKORAPPORT-TICKETS — [TODAY]

| ID | Task | Date | Phase | Source | Priority | Type | Status |
|----|------|------|-------|--------|----------|------|--------|
| T[N] | [beskrivning + fil + rad] | [TODAY] | Fas 12 | Veckorapport | [🔴/🟠/🟡] | [Dev/SEO/Analytics] | ☐ |
```

---

## DEL 5 — Skicka tickets till Claude Code

När nya tickets skapats i DEL 4, öppna claude.ai i Chrome och klistra in en Code-prompt. Använd mcp__Claude_in_Chrome__tabs_create_mcp + navigate + javascript_tool för att:

1. Öppna ny flik: `https://claude.ai/new`
2. Klistra in följande prompt (ersätt T[N] med faktiska ticket-nummer och beskrivningar):

```
Kör följande tickets från roadmap.md, en i taget. Stanna efter varje och vänta på bekräftelse.

Repo: https://github.com/joju91/Efterplan.git

**T[N] — [titel]**
[exakt beskrivning från roadmap, inkl. fil och rad]

**T[N+1] — [titel]**
[exakt beskrivning]

Starta med T[N].
```

3. Skicka via `document.execCommand('insertText', false, prompt)` + `key: Return`

Bekräfta i rapporten att Code-prompten skickats och vilka tickets den innehåller.

---

## RAPPORT (kort format)

```
# Efterplan — [datum]

🔢 Sessions: X (±%) | Organisk: X% | Onboarding: X% | Plan: X%

🔧 Uptime: X | Perf/A11y/SEO: X/X/X | Sårbarheter: X | Brutna länkar: X
   - [Max 2 kodfynd med fil+rad]

📣 [En mening: insikt + åtgärd]

🎫 Nya tickets: T[N] – [titel] | T[N+1] – [titel]

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | ...    | ... | 0 |
```

Spara som `/sessions/dreamy-eager-feynman/mnt/Efterplan/veckorapport-[datum].md`.
