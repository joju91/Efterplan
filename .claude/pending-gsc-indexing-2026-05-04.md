# Pending: GSC-indexering 2026-05-04

3 URL:er blockades av daglig quota 2026-05-03. Begär dem nästa gång du är inloggad i Chrome efter 09:00 lokal tid.

## URL:er

1. https://www.efterplan.se/sambo-arv.html
2. https://www.efterplan.se/efterlevandepension.html
3. https://www.efterplan.se/dodsbo-bostadsratt.html

## Workflow per URL

GSC-property: `sc-domain:efterplan.se`. Ingen klick-vid-koordinat i GSC admin (blockerat).

1. Öppna https://search.google.com/search-console?resource_id=sc-domain%3Aefterplan.se
2. Rensa sökfältet via JS:
   ```js
   document.querySelectorAll('input').forEach(i=>{
     const a=i.getAttribute('aria-label')||'';
     if(a.includes('webbadress')||a.includes('Granska')){
       const proto=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
       proto.call(i,'');
       i.dispatchEvent(new Event('input',{bubbles:true}));
       i.focus();
     }
   })
   ```
3. Skriv in URL:en, tryck Enter
4. Vänta 9 sekunder
5. `find` "BEGÄR INDEXERING button" → klicka senaste ref
6. Vänta ~40 sekunder
7. `find` "Indexering begärd success dialog OR Kvoten har överskridits"
8. Stäng dialog, nästa URL

Quota slår i vid ~10-12 begäranden per dag.

## När alla 3 är klara

Ta bort denna fil.
