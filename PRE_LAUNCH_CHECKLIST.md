# Efterplan — Pre-Launch Checklist (T020)

## 1. Mobiltest iOS (Safari)
- [ ] Öppna https://joju91.github.io/Closure/ i Safari på iPhone
- [ ] Klicka "Kom igång" — onboarding ska starta smidigt
- [ ] Testa alla 6 steg (välj "vi är flera" för att få steg 4)
- [ ] Kontrollera att progress-baren rör sig
- [ ] Kontrollera att "Visa min plan →" genererar plan korrekt
- [ ] Testa att expandera/kollapsa en uppgift
- [ ] Testa att markera en uppgift som klar
- [ ] Öppna Dokument-fliken — generera ett brev (t.ex. bank)
- [ ] Kontrollera att texten kopieras korrekt
- [ ] Testa "Lägg till i hemskärmen" (PWA install) — ikonen ska visas
- [ ] Stäng Safari, öppna appen från hemskärmen — planen ska finnas kvar

## 2. Mobiltest Android (Chrome)
- [ ] Samma flöde som iOS ovan
- [ ] Chrome ska erbjuda "Installera app"-banner — acceptera den
- [ ] Verifiera att offline-bannern visas vid flygplansläge

## 3. Tillgänglighet (snabbtest)
- [ ] Tab-navigering fungerar igenom hela onboardingen
- [ ] Enter/mellanslag öppnar uppgiftskort
- [ ] Modal (Vilka hjälps ni åt?) stängs med Escape
- [ ] Skärmläsare (VoiceOver iOS / TalkBack Android) läser rubriker korrekt

## 4. Innehållskontroll
- [ ] Alla FAQ-svar stämmer juridiskt (kontrollera bouppteckningstider etc.)
- [ ] Kontaktuppgifter i uppgifterna är korrekta (Skatteverket 0771-567 567)
- [ ] Ingen gammal "Dela plan"-text finns kvar någonstans

## 5. Teknisk kontroll
- [ ] Öppna DevTools → Console: inga JavaScript-fel
- [ ] Öppna DevTools → Network: inga 404-fel
- [ ] Lighthouse-rapport: Performance > 90, A11y > 80
- [ ] localStorage sparar och återläser korrekt (ladda om sidan)

## 6. Inför domänbyte (när efterplan.se är registrerad)
- [ ] Uppdatera `canonical` i index.html → `https://efterplan.se/`
- [ ] Uppdatera `og:url` → `https://efterplan.se/`
- [ ] Uppdatera `og:image` → `https://efterplan.se/og-image.png` (skapa 1200×630 PNG)
- [ ] Uppdatera `data-domain` i Plausible-scriptet → `efterplan.se`
- [ ] Uppdatera schema.org `"url"` → `https://efterplan.se/`
- [ ] Byt `start_url` i manifest.json → `https://efterplan.se/`
- [ ] Aktivera Plausible-kontot och verifiera att events registreras

## 7. Soft launch
- [ ] Publicera på efterplan.se (GitHub Pages custom domain)
- [ ] Dela med 5 personer i målgruppen (T026)
- [ ] Skicka URL till Flashback / Facebook-grupper för dödsbo (T043–T044)
- [ ] Bevaka Plausible: Onboarding Start → Plan Generated (conversion %)
