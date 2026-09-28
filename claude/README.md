# claude/ — autonoma tickets för roadmap-workflow

Filer i `open/` plockas upp av `.github/workflows/roadmap.yml` varje natt.
Claude Code väljer ticketen med lägst `priority`-nummer som inte är markerad
`payment: true` eller `legal: true`, implementerar den och öppnar en PR.

## Ticket-format

Skapa en fil i `open/` med valfritt namn (t.ex. `02-min-feature.md`):

```markdown
---
priority: 3
area: frontend
payment: false
legal: false
---

# Titel på ticketen

## Vad ska göras
Beskriv uppgiften tydligt. Ange berörda filer om du vet dem.

## Klart när
- [ ] Konkret acceptanskriterium 1
- [ ] Konkret acceptanskriterium 2
```

## Fält

| Fält | Typ | Betydelse |
|------|-----|-----------|
| `priority` | heltal 1–9 | 1 = högst prioritet |
| `area` | sträng | `frontend`, `api`, `seo`, `perf`, `content`, `tooling` |
| `payment` | bool | `true` = hoppas över (Stripe/checkout-relaterat) |
| `legal` | bool | `true` = hoppas över (GDPR, villkor, juridik) |

## Mappar

- `open/` — öppna tickets, plockas upp av roadmap-workflow
- `done/` — avklarade tickets (flyttas dit av Claude efter implementation)
- `autofix-notes/` — analysanteckningar från autofix-workflow när felet inte gick att fixa automatiskt
