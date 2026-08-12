# data/

## postnummer-se.json

Postnummer (5 siffror, utan mellanslag) → postort, för Sverige. 18 870 poster.

Källa: [GeoNames.org](https://www.geonames.org) postal code-export (`SE.zip`), hämtad 2026-08-12.
Licens: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/) — kräver attribution (länk till geonames.org), som ges här.

Används av `lookupPostort()` i `app.js` för att auto-fylla stad när användaren
fyller i sin adress inför brevgenerering (Dokument-fliken). Laddas lazy (bara
när fältet faktiskt används), helt klientsidan — postnumret skickas aldrig
till någon extern tjänst.

Uppdatera genom att ladda ner en ny export från
`https://download.geonames.org/export/zip/SE.zip`, packa upp `SE.txt` och
bygga om JSON:en (postnummer utan mellanslag → `cols[2]`, kolumn 2 i
tab-separerade filen).
