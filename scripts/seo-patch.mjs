// Patches all guide HTML files:
// 1. Inserts visible "Senast uppdaterad" date after H1
// 2. Adds "Vad är X?" intro section to guides missing one
//
// Run from repo root: node scripts/seo-patch.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

// Guides to skip (not article pages)
const SKIP = new Set(['auth-modal.html', 'om.html', 'index.html', 'ga4-dashboard']);

const MONTH_SV = ['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];

function formatDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return { iso, sv: `${d} ${MONTH_SV[m - 1]} ${y}` };
}

// "Vad är X" content for each guide missing it
const VAD_AR = {
  'bankkonto-dodsfall.html': {
    h2: 'Vad händer med bankkontot vid dödsfall?',
    p: 'När en person dör fryser banken samtliga konton som är kopplade till den döde. Det innebär att ingen enskild arvinge kan ta ut pengar — dödsboet måste agera gemensamt. Pengarna frigörs när bouppteckningen är registrerad hos Skatteverket och arvskiftet genomförts.',
  },
  'begravning-utomlands.html': {
    h2: 'Vad innebär begravning utomlands?',
    p: 'Med begravning utomlands menas att dödsfallet inträffar utanför Sverige, och att kroppen antingen begravs där eller transporteras hem. Hemtransport av stoftet kräver koordinering med ambassad, begravningsbyrå och flygbolag och kan kosta 30 000–80 000 kr beroende på land och avstånd.',
  },
  'bouppteckning-tidslinje.html': {
    h2: 'Vad är bouppteckningens deadlines?',
    p: 'En bouppteckning ska hållas senast tre månader efter dödsdatum och lämnas in till Skatteverket senast en månad därefter — alltså fyra månader totalt. Missar man tidsgränserna riskerar dödsboet vite och försenat arvskifte.',
  },
  'digital-dodsbo.html': {
    h2: 'Vad är ett digitalt dödsbo?',
    p: 'Ett digitalt dödsbo är summan av en persons digitala konton och data efter döden — e-post, sociala medier, bankapplikationer, molntjänster och prenumerationer. Till skillnad från fysiska tillgångar kan digitala konton inte överlåtas direkt; varje plattform har egna regler för vad anhöriga får göra.',
  },
  'dodsbo-auktion.html': {
    h2: 'Vad är en dödsboauktion?',
    p: 'En dödsboauktion är en försäljning av lösöre från ett dödsbo via ett auktionshus. Auktionshuset hämtar, värderar och säljer föremålen på uppdrag av dödsboet och tar en provision — vanligen 20–40 % av slutpriset. Det är ett effektivt alternativ när arvingarna inte vill ta hand om saker individuellt.',
  },
  'dodsbo-bil.html': {
    h2: 'Vad händer med bilen i ett dödsbo?',
    p: 'Bilen ingår i dödsboet som en tillgång och kan inte säljas eller skrivas om utan att alla dödsbodelägare är överens. Försäkringen löper vidare men fordonsskatten debiteras dödsboet. Bilen kan överlåtas till en arvinge i arvskiftet eller säljas och likviden fördelas.',
  },
  'dodsbo-bostadsratt.html': {
    h2: 'Vad händer med bostadsrätten när ägaren dör?',
    p: 'En bostadsrätt ingår i dödsboet och förvaltas gemensamt av dödsbodelägarna tills arvskiftet är klart. Månadsavgiften till bostadsrättsföreningen ska betalas löpande av dödsboet. Bostadsrätten kan sedan antingen överlåtas till en arvinge eller säljas — bostadsrättsföreningens godkännande krävs vid överlåtelse.',
  },
  'dodsbo-fastighet.html': {
    h2: 'Vad gäller för en fastighet i dödsboet?',
    p: 'En fastighet (villa, fritidshus, jordbruksfastighet) i ett dödsbo ägs gemensamt av dödsbodelägarna och kan inte säljas utan alla delägares underskrift. Försäljningen utlöser kapitalvinstskatt om 22 % på vinsten. Nytt ägarbyte måste anmälas till Lantmäteriet via en lagfartsansökan.',
  },
  'fullmakt-dodsbo.html': {
    h2: 'Vad är en fullmakt för dödsbo?',
    p: 'En fullmakt för dödsbo ger en dödsbodelägare rätt att agera på de övriga delägarnas vägnar — till exempel att teckna avtal, sälja egendom eller kommunicera med myndigheter. Alla dödsbodelägare behöver inte vara med vid varje tillfälle om en giltig, skriftlig fullmakt finns.',
  },
  'gravsten.html': {
    h2: 'Vad är en gravsten?',
    p: 'En gravsten är en minnesmärkning som placeras vid graven och anger den begravdes namn, levnadsår och ibland ett citat eller symbol. Kyrkogårdsförvaltningen godkänner utformning och material — vanligast är granit, men kalksten och trä förekommer. Priset ligger ofta mellan 8 000 och 25 000 kr.',
  },
  'saga-upp-hyresratt-dodsbo.html': {
    h2: 'Vad gäller när dödsboet säger upp en hyresrätt?',
    p: 'När en hyresgäst dör har dödsboet rätt att säga upp hyreskontraktet med en månads uppsägningstid, oavsett vad avtalet annars anger — detta regleras i Jordabalken 12 kap. 5 §. Uppsägningen ska vara skriftlig och undertecknad av dödsboets samtliga delägare eller av en befullmäktigad representant.',
  },
  'salja-dodsbo.html': {
    h2: 'Vad innebär att sälja ett dödsbo?',
    p: 'Att sälja ett dödsbo innebär att dödsboets tillgångar — fastighet, bostadsrätt, bil eller lösöre — avyttras och likviden fördelas bland arvingarna. Grundregeln är att alla dödsbodelägare måste vara överens om varje försäljning. Utan enighet kan ingen enskild arvinge sälja på egen hand.',
  },
  'tomma-dodsbo.html': {
    h2: 'Vad innebär att tömma ett dödsbo?',
    p: 'Att tömma ett dödsbo innebär att den dödes bostad töms på möbler, kläder och personliga tillhörigheter inför överlåtelse, försäljning eller avflyttning. Arbetet kan göras av arvingarna själva, eller av ett dödsboföretag som tar hand om sortering, bortforsling och städning mot ett fast pris.',
  },
  'vad-kostar-en-begravning.html': {
    h2: 'Vad kostar en begravning i Sverige?',
    p: 'En begravning i Sverige kostar i genomsnitt 30 000–50 000 kr, men priserna varierar kraftigt beroende på val av begravningsbyrå, kisttyp, blomsterarrangemang och om det är en jordbegravning eller kremation. Begravningsavgiften — som alla betalar via skattsedeln — täcker kyrkans grundläggande tjänster.',
  },
};

function extractDateModified(html) {
  const m = html.match(/"dateModified":\s*"(\d{4}-\d{2}-\d{2})"/);
  return m ? m[1] : null;
}

function insertAfterH1(html, insertion) {
  // Find </h1> and insert right after it (before any whitespace/newline)
  return html.replace(/(<\/h1>)/, `$1\n      ${insertion}`);
}

function insertBeforeFirstH2(html, h2, p) {
  const block = `\n\n      <h2>${h2}</h2>\n      <p>${p}</p>`;
  return html.replace(/(\s*<h2)/, `${block}$1`);
}

const files = readdirSync(ROOT).filter(f => f.endsWith('.html') && !SKIP.has(f));

let patched = 0;
for (const file of files) {
  const filePath = path.join(ROOT, file);
  let html = readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add date stamp if missing
  if (!html.includes('class="article-meta"')) {
    const iso = extractDateModified(html);
    if (iso) {
      const d = formatDate(iso);
      const stamp = `<p class="article-meta">Senast uppdaterad: <time datetime="${d.iso}">${d.sv}</time></p>`;
      html = insertAfterH1(html, stamp);
      changed = true;
    }
  }

  // 2. Add "Vad är X" section if defined and missing
  const entry = VAD_AR[file];
  if (entry && !html.includes('Vad är') && !html.includes('Vad händer') && !html.includes('Vad innebär') && !html.includes('Vad gäller') && !html.includes('Vad kostar en begravning')) {
    html = insertBeforeFirstH2(html, entry.h2, entry.p);
    changed = true;
  }

  if (changed) {
    writeFileSync(filePath, html, 'utf8');
    console.log(`✓ ${file}`);
    patched++;
  }
}

console.log(`\nFärdigt: ${patched} filer uppdaterade.`);
