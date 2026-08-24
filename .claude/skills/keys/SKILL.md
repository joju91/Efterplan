---
name: keys
description: Hämta eller rotera Efterplans API-nycklar (Stripe, Supabase, Anthropic, Google) utan att behöva logga in på flera dashboards manuellt. Använd när Jonas skriver /keys, ber om att synka nycklar, rotera en API-nyckel, eller uppdatera secrets i Vercel/GitHub.
---

Efterplan har ett litet verktyg för nyckelhantering under `scripts/keys/`
(se [SECRETS.md](../../../SECRETS.md) för full dokumentation). Kör det åt
Jonas istället för att be honom öppna en terminal själv.

## Hämta (sync) — standardläget om inget annat sägs

```
npm run keys:sync
```

Hämtar allt som går att hämta automatiskt till `.env.local`. Observera:
Stripe- och Anthropic-nycklarna samt `SUPABASE_SECRET_KEY` är sparade som
"Sensitive" i Vercel, vilket gör att Vercel aldrig kan lämna ut värdet igen
— de går bara att sätta lokalt via `keys:rotate`. `SUPABASE_URL`/
`SUPABASE_SECRET_KEY` dubbelkollas ändå direkt mot Supabase CLI:t. Skriver
aldrig ut hemliga värden — rapportera bara status-raderna tillbaka till
Jonas.

Om det misslyckas för att `vercel` inte är inloggad eller Supabase-CLI:t
saknar session: säg det rakt av och peka på kommandot scriptet föreslår
(`vercel login` respektive `npx supabase login`) — logga inte in åt honom,
det är en OAuth-inloggning i hans egen webbläsare.

## Rotera — om Jonas nämner en specifik tjänst

```
npm run keys:rotate -- stripe      # eller: supabase | anthropic | google
```

Scriptet skriver ut en direktlänk till rätt dashboard-sida och väntar sen
på interaktiv inmatning av den nya nyckeln. Eftersom det kräver att Jonas
själv klickar "skapa ny nyckel" i leverantörens dashboard och klistrar in
värdet, kör detta i förgrunden (inte i bakgrunden) och tala om för honom
vilken sida att öppna och vad han ska klistra in när scriptet väntar.

## Viktigt

- Skriv aldrig ut faktiska nyckelvärden i chatten, varken från `.env.local`
  eller från kommandoutput.
- Detta är inte en genväg för att kringgå någon tjänsts inloggning —
  Stripe/Anthropic kräver alltid ett manuellt dashboard-klick för att skapa
  en ny nyckel, det är en säkerhetsspärr hos dem, inte en begränsning i det
  här scriptet.
