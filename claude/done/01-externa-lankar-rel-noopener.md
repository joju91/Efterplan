---
priority: 1
area: security
payment: false
legal: false
---

# Lägg till rel="noopener noreferrer" på externa länkar

## Vad ska göras

Alla `<a>`-taggar i HTML-filerna som pekar på externa domäner (href börjar med
`http://` eller `https://` och är inte efterplan.se) ska ha attributet
`rel="noopener noreferrer"` för säkerhet och Lighthouse-kompatibilitet.

Sök igenom alla `.html`-filer i repots rot efter externa `<a>`-taggar och
lägg till `rel="noopener noreferrer"` där det saknas. Om en tagg redan har ett
`rel`-attribut utan dessa värden, komplettera det befintliga attributet
(t.ex. `rel="nofollow"` → `rel="nofollow noopener noreferrer"`).

## Klart när
- [ ] Alla externa `<a>`-taggar i .html-filer har `rel` som innehåller `noopener` och `noreferrer`
- [ ] Interna länkar (relativa, eller efterplan.se-absoluta) är orörda
- [ ] Inga andra attribut eller text har ändrats i filerna
