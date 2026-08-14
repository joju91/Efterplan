/* ═══════════════════════════════════════════
   EFTERPLAN — App Logic
   MVP v1.0
════════════════════════════════════════════ */

// ─── FEATURE FLAGS ───────────────────────────
const PAYWALL_ENABLED = true;  // Stripe is wired (api/create-checkout + webhook)
const PREVIEW_STEPS   = 5;     // T030: first N tasks free, rest locked when PAYWALL_ENABLED

// ─── PREMIUM ENTITLEMENT ─────────────────────
// localStorage is the fast path. Server-side source of truth is Supabase
// (table `purchases`, written by /api/stripe-webhook). Logged-in users and
// users returning to a known email get auto-restored via /api/check-premium.
const PREMIUM_KEY        = 'efterplan_premium';
const PREMIUM_EMAIL_KEY  = 'efterplan_premium_email';

function isPremium() {
  return localStorage.getItem(PREMIUM_KEY) === '1';
}

function setPremium(email) {
  localStorage.setItem(PREMIUM_KEY, '1');
  if (email) localStorage.setItem(PREMIUM_EMAIL_KEY, email);
  applyPremiumState();
}

function clearPremium() {
  localStorage.removeItem(PREMIUM_KEY);
  localStorage.removeItem(PREMIUM_EMAIL_KEY);
  applyPremiumState();
}

function applyPremiumState() {
  const premium = isPremium();
  document.body.classList.toggle('is-premium', premium);
  const card = document.getElementById('paywall-card');
  if (card) card.classList.toggle('hidden', !PAYWALL_ENABLED || premium);
  ['doc-btn-skatteverket', 'doc-btn-fullmakt'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', PAYWALL_ENABLED && !premium);
  });
  // Re-render the plan so locked-task cards reflect the new state.
  if (typeof renderPlan === 'function' && state && Array.isArray(state.tasks) && state.tasks.length) {
    try { renderPlan(); } catch (_) { /* renderPlan is fine to skip on landing */ }
  }
}

async function checkPremiumServerSide() {
  let email = localStorage.getItem(PREMIUM_EMAIL_KEY) || '';
  let userId = '';
  try {
    if (window.efterplanAuth && typeof window.efterplanAuth.getCurrentUser === 'function') {
      const u = await window.efterplanAuth.getCurrentUser();
      if (u) { userId = u.id || ''; email = email || u.email || ''; }
    }
  } catch (_) { /* ignore */ }
  if (!email && !userId) return;
  try {
    const params = new URLSearchParams();
    if (email)  params.set('email', email);
    if (userId) params.set('user_id', userId);
    const r = await fetch(`/api/check-premium?${params.toString()}`);
    if (!r.ok) return;
    const data = await r.json();
    if (data && data.ok && data.premium) setPremium(email);
  } catch (_) { /* offline ok */ }
}

async function handlePremiumReturn() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('premium') !== 'success') return;
  const sessionId = params.get('session_id');
  if (!sessionId) return;
  try {
    const r = await fetch(`/api/verify-checkout?session_id=${encodeURIComponent(sessionId)}`);
    const data = await r.json();
    if (data && data.ok) {
      setPremium(data.email || '');
      track('premium_activated');
      showToast('Tack! Premium är upplåst på den här enheten.', 'success');
    } else {
      showToast('Vi kunde inte bekräfta betalningen direkt. Försök ladda om sidan om en stund.', 'error');
    }
  } catch (_) {
    showToast('Kunde inte verifiera betalningen — kolla din inkorg för Stripe-kvittot.', 'error');
  } finally {
    // Strip query params so reloads don't re-trigger.
    const clean = window.location.pathname + window.location.hash;
    window.history.replaceState({}, '', clean);
  }
}


// ─── STATE ───────────────────────────────────
const state = {
  relation:       null,
  testamente:     false,
  fastighet:      false,
  foretag:        false,
  skulder:        false,
  utland:         false,
  minderarig:     false,
  fordon:         false,
  husdjur:        false,
  hyresratt:      false,
  vardepapper:    false,
  barn:           false,
  giftSambo:      false, // T190 — triggar bodelning-påminnelse
  litetDodsbo:    false, // T189 — triggar dödsboanmälan istället för bouppteckning
  bostadTyp:      null,  // T193 — 'villa' | 'brf' | 'lantbruk' | null
  maklare:        false, // T193 — filtrerar bort mäklarhanterade uppgifter
  name:           '',
  personnr:       '',
  deathDate:      '', // ÅÅÅÅ-MM-DD, frivilligt — driver T135-deadline-motorn
  bouppRegDatum:  '', // ÅÅÅÅ-MM-DD, frivilligt — datum då bouppteckningen registrerades hos Skatteverket, driver lagfartsfristen
  taskChecklists: {}, // taskId → {key: bool}
  tasks:               [],
  bills:               [],
  documents:           [], // Arkiv/Dokumentcentral (T143–T148)
};

// ─── SCREENS ─────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goToLanding() { showScreen('screen-landing'); }

// ─── ANALYTICS ───────────────────────────────
// Plausible custom events — safe noop if script hasn't loaded
function track(event, props) {
  if (typeof window.plausible === 'function') {
    window.plausible(event, props ? { props } : undefined);
  }

  if (typeof window.gtag === 'function') {
    const gaEvent = String(event || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40) || 'custom_event';
    window.gtag('event', gaEvent, props || {});
  }
}

function startOnboarding() {
  track('onboarding_start');
  obCurrentStep = 1;
  document.querySelectorAll('.ob-step').forEach(s => s.classList.remove('active', 'exit'));
  document.getElementById('ob-step-1').classList.add('active');
  document.getElementById('ob-back-btn').style.visibility = 'hidden';
  obInitDots();
  showScreen('screen-onboarding');
}

function editAnswers() {
  const confirmed = window.confirm('Vill du ändra dina svar? Planen uppdateras när du är klar — dina anteckningar och markeringar behålls.');
  if (!confirmed) return;
  startOnboarding();
  obPrefillAnswers();
}

function obPrefillAnswers() {
  // Step 1 — relation
  document.querySelectorAll('#ob-step-1 .ob-choice').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.val === state.relation);
  });
  if (state.relation) {
    const nb = document.querySelector('#ob-step-1 .ob-next-btn');
    if (nb) nb.disabled = false;
  }
  // Step 2 — checkboxes
  document.querySelectorAll('#ob-step-2 input[type="checkbox"]').forEach(cb => {
    cb.checked = !!state[cb.dataset.key];
  });
  // Step 3 — name + dödsdatum
  const nameEl = document.getElementById('deceased-name');
  if (nameEl) nameEl.value = state.name || '';
  const dateEl = document.getElementById('deceased-date');
  if (dateEl) dateEl.value = state.deathDate || '';
  // Step 4 — personnr
  const pnrEl = document.getElementById('deceased-personnr');
  if (pnrEl) pnrEl.value = state.personnr || '';
}

// ─── ONBOARDING (conversational) ─────────────
let OB_TOTAL = 4;
let obCurrentStep = 1;

function obInitDots() {
  const container = document.getElementById('ob-dots');
  container.innerHTML = '';
  for (let i = 1; i <= OB_TOTAL; i++) {
    const dot = document.createElement('div');
    dot.className = 'ob-dot' + (i === 1 ? ' active' : '');
    dot.id = `ob-dot-${i}`;
    container.appendChild(dot);
  }
}

function obUpdateDots(step) {
  const numStep = step;
  for (let i = 1; i <= OB_TOTAL; i++) {
    const dot = document.getElementById(`ob-dot-${i}`);
    if (!dot) continue;
    dot.className = 'ob-dot';
    if (i < numStep)   dot.classList.add('done');
    if (i === numStep) dot.classList.add('active');
  }
}

function obChoose(btn) {
  const key = btn.dataset.key;
  const val = btn.dataset.val;
  state[key] = val;

  btn.closest('.ob-choices').querySelectorAll('.ob-choice').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  // Enable the Nästa button for this step
  const step = btn.closest('.ob-step');
  const nextBtn = step?.querySelector('.ob-next-btn');
  if (nextBtn) nextBtn.disabled = false;
}

function obChooseSub(btn) {
  const key = btn.dataset.key;
  const val = btn.dataset.val;
  state[key] = val;
  btn.closest('.ob-choices').querySelectorAll('.ob-choice').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  track('checkbox_toggle', { key, val });
}

// T193 — visa bostadstyp + mäklare-fråga bara när "Ägde sin bostad" är ikryssad
function toggleFastighetDetails() {
  const checked = document.getElementById('ob-check-fastighet')?.checked;
  const details = document.getElementById('ob-fastighet-details');
  if (details) details.classList.toggle('hidden', !checked);
  if (!checked) {
    state.bostadTyp = null;
    state.maklare = false;
  }
}

function obGoTo(step) {
  track('onboarding_step', { step });
  const current = document.querySelector('.ob-step.active');
  if (current) {
    current.classList.add('exit');
    setTimeout(() => {
      current.classList.remove('active', 'exit');
      obShowStep(step);
    }, 200);
  } else {
    obShowStep(step);
  }
}

const OB_FOCUS_IDS = { 3: 'deceased-name' };  /* tangentbordet ska inte öppnas automatiskt på personnr-steget */

function obShowStep(step) {
  const el = document.getElementById(`ob-step-${step}`);
  if (!el) return;
  el.classList.add('active');
  obCurrentStep = step;
  obUpdateDots(step);
  document.getElementById('ob-back-btn').style.visibility = step === 1 ? 'hidden' : 'visible';
  // Update label dynamically
  const labelEl = el.querySelector('.ob-label');
  if (labelEl) {
    const suffix = step === 4 ? ' — helt frivilligt' : '';
    labelEl.textContent = `Steg ${Math.min(step, OB_TOTAL)} av ${OB_TOTAL}${suffix}`;
  }
  if (OB_FOCUS_IDS[step]) {
    setTimeout(() => document.getElementById(OB_FOCUS_IDS[step])?.focus(), 350);
  }
  // Update visual progress bar
  const fillEl = document.getElementById('ob-progress-bar-fill');
  if (fillEl) {
    fillEl.style.width = `${Math.round((Math.min(step, OB_TOTAL) / OB_TOTAL) * 100)}%`;
  }
}

function obBack() {
  if (obCurrentStep === 1) { goToLanding(); return; }
  obGoTo(obCurrentStep - 1);
}


function updateCheckboxState(key) {
  document.querySelectorAll('#ob-step-2 input[type="checkbox"]').forEach(cb => {
    state[cb.dataset.key] = cb.checked;
  });
  if (key) track('checkbox_toggle', { key });
}

function generatePlan() {
  state.name      = document.getElementById('deceased-name').value.trim();
  state.personnr  = document.getElementById('deceased-personnr').value.trim();
  state.deathDate = document.getElementById('deceased-date')?.value || '';
  buildTasks();
  applyDeadlines();
  applyLagfartDeadline();
  loadTaskState();
  loadBills();
  loadDocuments();
  renderPlan();
  saveState();
  saveTaskState();
  track('plan_generated', { relation: state.relation || 'okänd', has_death_date: !!state.deathDate });
  submitReminderOptinIfChecked();
  showScreen('screen-plan');
}

// T178 — skickar samtycket vidare om användaren kryssat i påminnelse-rutan.
// Bara insamling, inget faktiskt utskick byggt än (se roadmap.md T136/T178).
function submitReminderOptinIfChecked() {
  const checked = document.getElementById('ob-reminder-optin')?.checked;
  const email = document.getElementById('ob-reminder-email')?.value.trim();
  if (!checked || !email || !window.efterplanAuth) return;
  const hasDodsboanmalan = state.tasks.some(t => t.id === 'dodsboanmalan');
  const types = hasDodsboanmalan ? ['dodsboanmalan'] : ['bouppteckning', 'inlamning'];
  window.efterplanAuth.subscribeReminder(email, state.deathDate || null, types)
    .then(() => track('reminder_optin'))
    .catch(err => console.warn('[reminder-optin]', err));
}

function toggleReminderEmail() {
  const checked = document.getElementById('ob-reminder-optin').checked;
  document.getElementById('ob-reminder-email').classList.toggle('hidden', !checked);
}

// ─── RULE ENGINE ─────────────────────────────
// Each task: id, title, desc, urgency, time, link, phone?, triggers, hasDoc?, notesPlaceholder?
const TASK_LIBRARY = [

  // ── ALWAYS ─────────────────────────────────
  {
    id: 'viktiga_dokument',
    title: 'Hitta viktiga dokument',
    desc: 'Samla dessa på ett ställe — du behöver dem gång på gång de kommande veckorna:<br><br><strong>Prioritera:</strong><br>— Testamente (bankfack, hos notarie, bland papper)<br>— Dödsfallsintyg när det anländer<br>— Försäkringsbrev (livförsäkring, TGL via arbetsgivare)<br>— Äktenskapsförord eller samboavtal<br>— Bankuppgifter och kontoutdrag<br>— ID-handlingar (pass, körkort)<br>— Fullmakter, avtal och kvitton på lån',
    urgency: 'today',
    time: 'ca 1 tim',
    link: null,
    triggers: [],
    resources: [
      { label: 'Skatteverket — beställ dödsfallsintyg', url: 'https://www.skatteverket.se/privat/folkbokforing/dodsfall.html' },
    ],
  },
  {
    id: 'konstatera_dodsfall',
    title: 'Konstatera dödsfallet',
    desc: '<strong>Om dödsfallet var oväntat eller plötsligt — ring 112 omedelbart.</strong><br><br>Om personen avled hemma efter en längre tids sjukdom ringer du jourhavande läkare via 1177 — de skickar en läkare som utfärdar dödsbeviset. Utan ett utfärdat dödsbevis kan inget annat steg påbörjas.',
    urgency: 'today',
    time: 'Direkt',
    phone: '112',
    phone2: '1177',
    triggers: [],
    notesPlaceholder: 'Noterat klockslag, vem som kontaktades…',
  },
  {
    id: 'narmaste_anhörig',
    title: 'Meddela närstående',
    desc: 'Det här sker i etapper — du behöver inte nå alla på en gång. Börja med de allra närmaste: familj och nära vänner. Övriga kan meddelas under de kommande dagarna. Det är okej att be någon annan hjälpa till. Lägg till personer i listan nedan och bocka av vartefter du når dem.',
    urgency: 'today',
    time: 'Din tid',
    link: null,
    triggers: [],
  },
  {
    id: 'begravningsbyra',
    title: 'Kontakta en begravningsbyrå',
    desc: 'Begravningsbyrån tar hand om kroppen, sköter registreringen hos Skatteverket och hjälper dig planera ceremonin. Du behöver inte ha alla svar klara när du ringer — de guidar dig. Några alternativ:',
    urgency: 'today',
    time: 'ca 30 min',
    link: null,
    triggers: [],
    resources: [
      { label: 'Fonus — Sveriges största, hitta byrå nära dig', url: 'https://www.fonus.se' },
      { label: 'Memorial — rikstäckande kedja', url: 'https://www.memorial.se' },
      { label: 'SBF — branschförbundets byråsök', url: 'https://www.sbf.se' },
    ],
    notesPlaceholder: 'Byrå kontaktad, kontaktperson, datum och tid för möte…',
  },
  {
    id: 'dodsbevis',
    title: 'Beställ dödsfallsintyg',
    desc: 'Dödsbeviset utfärdas automatiskt av läkaren. Det du behöver beställa är <strong>dödsfallsintyg med släktutredning</strong> från Skatteverket — det är detta dokument som banker, försäkringsbolag och myndigheter kräver för att du ska få företräda dödsboet. Ha den <em>avlidnas</em> personnummer tillgängligt.',
    urgency: 'today',
    time: 'ca 15 min',
    link: 'https://www.skatteverket.se/privat/folkbokforing/dodsfall.html',
    phone: '0771-567 567',
    triggers: [],
    notesPlaceholder: 'Ärendenummer, vem som beställde, förväntat datum…',
  },
  {
    id: 'nycklar_post',
    title: 'Säkra nycklar och eftersänd post',
    desc: 'Ta hand om bostadsnycklar och gör en adressändring för den avlidnes post via adressändring.se. Viktiga brev kan annars gå förlorade. Hade den avlidna digital myndighetspost (Kivra eller Min myndighetspost) blir den normalt inte tillgänglig för dödsboet automatiskt — kontrollera separat om det finns brev där också.',
    urgency: 'today',
    time: 'ca 20 min',
    link: 'https://www.adressandring.se',
    triggers: [],
    notesPlaceholder: 'Var finns nycklarna? Adressändring gjord hos Postnord?',
  },
  // Placerad här (inte längst ner bland "later"-uppgifterna) eftersom urgency:'today'
  // förutsätter att positionen i TASK_LIBRARY matchar — markTaskDone()s "scrolla till
  // nästa uppgift" letar i array-ordning, inte i renderad sektionsordning.
  {
    id: 'sorgstod',
    title: 'Ta hand om dig själv',
    desc: `Det praktiska tar tid och energi — men sorgen kräver sin egen plats.<br><br>
Du behöver inte ha allt under kontroll. Det är normalt att känna sig utmattad, arg, lättad, tom eller allt på en gång.<br><br>
<strong>Prata med någon:</strong><br>
— <em>1177 Sorgelinjen</em>: Ring 1177 och be om att bli kopplad till sorgestöd.<br>
— <em>SPES</em> (Suicidprevention och efterlevandestöd): spes.se, för dig som förlorat någon till självmord.<br>
— <em>Kyrkans stöd</em>: Oavsett tro erbjuder Svenska kyrkan samtalsstöd — kontakta närmaste kyrka.<br><br>
Det finns ingen tidsgräns för sorg, och du behöver inte vara klar.`,
    urgency: 'today',
    time: 'Din tid',
    link: 'https://www.1177.se/liv-halsa/psykisk-halsa/sorg/',
    triggers: [],
    notesPlaceholder: 'Vad hjälper dig just nu? Är det någon du vill ringa?',
  },

  // ── WEEK ───────────────────────────────────
  {
    id: 'begravningsceremoni',
    title: 'Planera begravningsceremonin',
    desc: 'Bestäm vem i familjen som ansvarar för vad — och se till att någon förmedlar era önskemål till begravningsbyrån.<br><br>Vem ansvarar för musik? Vem håller tal? Vem ordnar minnesstunden? Vem samlar in den avlidnas eventuella önskemål?',
    urgency: 'week',
    time: 'ca 30 min med familjen',
    link: null,
    triggers: [],
    notesPlaceholder: 'Vem ansvarar för vad — musik, tal, minnesstund, önskemål…',
  },
  {
    id: 'fullmakt_dodsbo',
    title: 'Upprätta fullmakt för dödsboet',
    urgency: 'week',
    time: 'ca 30 min',
    desc: 'När ni är flera som ärver måste normalt alla godkänna varje åtgärd — vilket snabbt blir tungrott. Lösningen är att alla skriver en fullmakt till en person som får agera för er gemensamt: betala räkningar, kontakta banker och hantera löpande ärenden. Fullmakten måste visas upp i original vid bankbesök.',
    link: null,
    triggers: [],
    digital: 'fysisk',
    hasDoc: 'fullmakt',
  },
  {
    id: 'bouppteckning',
    title: 'Planera bouppteckningen',
    desc: 'En bouppteckning är en förteckning över den avlidnes tillgångar och skulder. Den ska vara klar inom 3 månader och skickas till Skatteverket inom 4 månader.<br><br><strong>Är boet litet?</strong> Om tillgångarna knappt täcker begravnings- och bouppteckningskostnaderna kan du istället göra en <em>dödsboanmälan</em> hos kommunens socialtjänst — det är gratis och enklare. Kontakta socialtjänsten för att se om det gäller dig.<br><br><strong>Göra själv:</strong> Möjligt om boet är enkelt (bara bankmedel och lösöre). Kräver två utomstående vittnen som inte är arvingar. Sparar 6 500–15 000 kr.<br><strong>Anlita jurist:</strong> Rekommenderas vid fastighet, företag, testamente eller om arvingarna inte är överens. Byråerna nedan är förslag för att komma igång — det finns många andra jurister och byråer att välja bland.',
    urgency: 'week',
    time: 'Kontakta jurist inom veckan',
    link: null,
    triggers: [],
    digital: 'fysisk',
    resources: [
      { label: 'Familjens Jurist — rikstäckande, specialiserade på dödsbon', url: 'https://www.familjens-jurist.se' },
      { label: 'Advokatsamfundet — hitta advokat nära dig', url: 'https://www.advokatsamfundet.se/hitta-advokat' },
    ],
    notesPlaceholder: 'Jurist kontaktad, offert, datum för förrättning…',
  },
  // ── CONDITIONAL: Dödsboanmälan (T189) — ersätter bouppteckning för mycket små dödsbon ──
  {
    id: 'dodsboanmalan',
    title: 'Gör dödsboanmälan hos kommunens socialtjänst',
    desc: 'Eftersom dödsboets tillgångar bara täcker begravningskostnaden (och det inte finns fastighet eller bostadsrätt) kan ni göra en <em>dödsboanmälan</em> istället för en full bouppteckning — det är gratis och enklare.<br><br><strong>Så går det till:</strong> Kontakta kommunens socialtjänst (inte Skatteverket — de tar bara emot den färdiga anmälan). Socialtjänsten begär vanligen kontoutdrag för de senaste 3 månaderna och gör ett hembesök i bostaden, som bör lämnas orörd fram till dess.<br><br>Anmälan bör vara kommunen tillhanda inom ungefär 2 månader efter dödsfallet — kortare tidsram än bouppteckningens 3–4 månader. Ingen bouppteckning behöver göras, men skulderna försvinner inte — det är bara den formella utredningsplikten som faller bort.',
    urgency: 'week',
    time: 'Kontakta kommunen inom veckan',
    link: null,
    triggers: ['litetDodsbo'],
    digital: 'fysisk',
    notesPlaceholder: 'Socialtjänsten kontaktad, hembesök bokat, kontoutdrag ordnat…',
  },
  // ── CONDITIONAL: Bodelning-påminnelse (T190) — triggas av civilstånd, inte antal barn ──
  {
    id: 'bodelning_paminnelse',
    title: 'Kontrollera om bodelning behöver göras',
    desc: 'Var den avlidna gift eller sambo kan bodelning behöva göras <strong>innan</strong> arvet fördelas.<br><br><strong>Gift:</strong> Bodelning omfattar hela giftorättsgodset (det som inte är enskild egendom) — den efterlevande maken/makan har normalt rätt till hälften innan resten går till arvskifte.<br><strong>Sambo:</strong> Bodelning omfattar bara samboegendom (gemensam bostad och bohag som skaffats för gemensamt bruk) — inte hela boet, och bara om den efterlevande sambon begär det inom ett år.',
    urgency: 'week',
    time: 'ca 20 min',
    link: null,
    triggers: ['giftSambo'],
    notesPlaceholder: 'Bodelning behövs? Vem hjälper till — jurist, egen överenskommelse…',
  },
  // Slår ihop den tidigare "Kontrollera bostadsrättens framtid" (make-triggad) i denna —
  // samma beslut, oavsett om det är du eller någon annan som fyller i formuläret.
  // Flyttad hit (bredvid bouppteckningen) eftersom bostadens framtid är ett beslut som
  // hör ihop med bouppteckningen, inte något som hör hemma bland de administrativa
  // säljstegen längre ner.
  // Trigger är bara 'fastighet' (inte 'make') — "Ägde sin bostad" fångar redan ägande
  // oavsett relation, och 'make' ensam skulle visa uppgiften även för en efterlevande
  // vars avlidna partner bara hyrde (inget att besluta om då).
  {
    id: 'fastighet_boende',
    title: 'Besluta om bostadens framtid',
    desc: 'Ska bostaden säljas, övertas av anhörig, eller hyras ut? Ta detta beslut med alla delägare i boet. Bestämmer ni er för att sälja via mäklare sköter de sedan visning, budgivning och köpekontrakt åt er — det behöver ni inte ha koll på själva.<br><br>Bor eller bodde ni i en bostadsrätt tillsammans — kontakta bostadsrättsföreningen om hur överlåtelse eller fortsatt boende hanteras. BRF:en behöver godkänna en ny ägare.',
    urgency: 'week',
    time: 'Diskussion med familjen',
    link: null,
    triggers: ['fastighet'],
    notesPlaceholder: 'Beslut om bostaden, kontaktad mäklare, arvinge eller BRF…',
  },
  {
    id: 'bank_kontakt',
    title: 'Kontakta banken',
    desc: 'Meddela banken om dödsfallet så att kontona hanteras korrekt. Ha dödsbevis och personnummer redo. Skriv ned vilka banker du känner till nedan — du kan fylla på efterhand.',
    urgency: 'week',
    time: 'ca 30 min',
    link: null,
    triggers: [],
    digital: 'hybrid',
    hasDoc: 'bank',
    notesPlaceholder: 'Vet du vilka banker? Skriv de du känner till — det är okej att börja med en. (t.ex. Swedbank, SEB, Nordea…)',
    resources: [
      { label: 'Swedbank — dödsbo & efterlevande', url: 'https://www.swedbank.se/privat/mer-fran-swedbank/dodsfall.html' },
      { label: 'SEB — när någon gått bort', url: 'https://seb.se/privat/dodsfall' },
      { label: 'Nordea — dödsfall och dödsbo', url: 'https://www.nordea.se/privat/livshändelser/dodsfall/' },
      { label: 'Handelsbanken — dödsfall', url: 'https://www.handelsbanken.se/sv/privat/livet/dodsfall' },
      { label: 'Länsförsäkringar Bank — dödsfall', url: 'https://www.lansforsakringar.se/privat/bank/dodsfall/' },
      { label: 'Skandiabanken — dödsfall', url: 'https://www.skandia.se/bank/dodsfall/' },
    ],
  },
  {
    id: 'forsakringar',
    title: 'Gå igenom försäkringar',
    desc: `Försäkringar kan ge stora belopp som riskerar att aldrig sökas — gör en systematisk genomgång.<br><br>
<strong>TGL (Tjänstegrupplivförsäkring)</strong> — De flesta anställda med kollektivavtal har detta. Begravningshjälp: ~29 400 kr till dödsboet. Grundbelopp till partner/barn: upp till ~350 000 kr. Måste sökas manuellt hos t.ex. Afa, Folksam eller KPA.<br><br>
<strong>Hitta dolda försäkringar:</strong> Gå igenom bankutdrag efter premiebetalningar. Kontakta arbetsgivare och fackförbund. Ring de fyra stora (Folksam, If, Länsförsäkringar, Trygg-Hansa) och fråga om den avlidne hade engagemang.`,
    urgency: 'week',
    time: 'ca 1–2 timmar',
    link: null,
    triggers: [],
    digital: 'hybrid',
    hasDoc: 'forsakring',
    notesPlaceholder: 'Vet du något försäkringsbolag? Skriv det du hittar — ett i taget är bra nog. (t.ex. Folksam, If, Skandia, Afa…)',
    resources: [
      { label: 'Afa Försäkring — TGL och dödsfall', url: 'https://www.afaforsakring.se/privatperson/dodsfall/' },
      { label: 'Folksam — anmälan vid dödsfall', url: 'https://www.folksam.se/liv-halsa/nar-nagon-dor' },
    ],
  },
  {
    id: 'arbetsgivare',
    title: 'Kontakta arbetsgivaren och fackförbundet',
    desc: 'Meddela arbetsgivaren om dödsfallet. Be dem bekräfta om den avlidne haft TGL (Tjänstegrupplivförsäkring) via kollektivavtal — detta är en livförsäkring som ger skattefritt engångsbelopp och måste sökas aktivt. Kontakta även fackförbundet, många har egna dödsfallsförsäkringar via t.ex. Bliwa eller Folksam.',
    urgency: 'week',
    time: 'ca 30 min',
    link: null,
    triggers: [],
    notesPlaceholder: 'Arbetsgivare meddelad, TGL bekräftat, fackförbund kontaktat…',
  },

  {
    id: 'forsakringskassan',
    title: 'Kontakta Försäkringskassan',
    desc: `Försäkringskassan får automatiskt besked om dödsfallet via folkbokföringen — samma uppgift som Skatteverket registrerar. Det stoppar dock <strong>inte</strong> alltid pågående utbetalningar automatiskt, och det startar <strong>aldrig</strong> nya förmåner du kan ha rätt till — därför behöver du ändå kontakta dem aktivt.<br><br>
<strong>Stoppa manuellt vid behov:</strong> Barnbidrag, bostadsbidrag, sjukpenning och andra bidrag avslutas inte alltid automatiskt — kontakta FK för att undvika återkrav.<br><br>
<strong>Ansök om:</strong><br>
— <em>Barnpension</em>: Barn under 20 år kan ha rätt till barnpension om en förälder dör.<br>
— <em>Efterlevandestöd</em>: Om barnpensionen inte räcker får barnet efterlevandestöd upp till 18 år.<br>
— <em>Omställningspension</em>: Efterlevande make/registrerad partner kan ansöka om omställningspension i upp till 12 månader.<br><br>
Kontakta FK på telefon eller logga in på Mina sidor på forsakringskassan.se.`,
    urgency: 'week',
    time: 'ca 30 min',
    phone: '0771-524 524',
    link: 'https://www.forsakringskassan.se/privatperson/nar-nagon-dor',
    triggers: [],
    digital: 'digital',
    notesPlaceholder: 'Ärenden öppnade, ärendenummer, beviljade förmåner…',
  },

  // ── LATER ──────────────────────────────────
  {
    id: 'autogiron_avsluta',
    title: 'Avsluta autogiron och e-fakturor',
    desc: 'Löpande betalningsuppdrag fortsätter dra pengar från dödsboets konton tills de aktivt avslutas. Bankerna kan ta fram en fullständig lista över aktiva autogiron kopplade till ett konto.<br><br>Be banken om listan via närmaste kontor eller digitalt. Avsluta abonnemangen hos respektive leverantör — banken kan spärra betalningarna men inte avsluta avtalen.',
    urgency: 'later',
    time: 'ca 1–2 timmar',
    link: null,
    triggers: [],
    checklist: [
      { key: 'hyra',        label: 'Hyra / månadsavgift' },
      { key: 'el',          label: 'El, vatten, fjärrvärme' },
      { key: 'internet',    label: 'Internet, TV, mobilabonnemang' },
      { key: 'streaming',   label: 'Streaming (Spotify, Netflix, HBO)' },
      { key: 'tidningar',   label: 'Tidningsprenumerationer' },
      { key: 'gym',         label: 'Gymmedlemskap' },
      { key: 'larm',        label: 'Larmtjänster' },
      { key: 'forsakring',  label: 'Försäkringspremier' },
    ],
    notesPlaceholder: 'Övriga autogiron eller e-fakturor…',
  },
  {
    id: 'abonnemang',
    title: 'Avsluta abonnemang och prenumerationer',
    desc: 'Säg upp tjänster en efter en. Använd dokumentgeneratorn för att skapa uppsägningsbrev.',
    urgency: 'later',
    time: 'ca 1–2 timmar',
    link: null,
    triggers: [],
    digital: 'hybrid',
    hasDoc: 'bulk',
    checklist: [
      { key: 'mobil',     label: 'Mobilabonnemang' },
      { key: 'streaming', label: 'Streaming (Spotify, Netflix m.fl.)' },
      { key: 'tidning',   label: 'Tidningsprenumerationer' },
      { key: 'el',        label: 'Elavtal' },
      { key: 'gym',       label: 'Gymmedlemskap' },
    ],
    notesPlaceholder: 'Övriga abonnemang eller tjänster…',
  },
  {
    id: 'arvskifte',
    title: 'Fördela arvet',
    desc: 'När bouppteckningen är klar och godkänd av Skatteverket delas tillgångarna upp mellan arvingarna — enligt testamente eller enligt lag om inget testamente finns. Görs ofta med hjälp av jurist och kan ta tid om ni är oense.',
    urgency: 'later',
    time: 'Månader efter dödsfallet',
    link: null,
    triggers: [],
    notesPlaceholder: 'Jurist anlitad, arvingar överens, datum för skifte…',
  },
  {
    id: 'avsluta_konton',
    title: 'Avsluta digitala konton',
    desc: `Spara viktiga foton och dokument innan du stänger konton. Varje plattform har egna rutiner:<br><br>
<strong>Facebook/Instagram:</strong> Kan minnesmärkas eller raderas. Kräver dödsfallsintyg till supporten.<br>
<strong>Google:</strong> Kontrollera "Hantering av inaktiva konton" — utan förinställningar kan anhöriga begära data via supporten.<br>
<strong>Apple/iCloud:</strong> Utan en förutbestämd "digital arvskontakt" krävs ofta domstolsbeslut för att få ut foton och filer.<br><br>
Säg även upp betaltjänster som Klarna, PayPal, spelkonton — logga aldrig in med den avlidnes lösenord, använd de officiella vägarna.`,
    urgency: 'later',
    time: 'ca 1–2 timmar',
    link: null,
    triggers: [],
    checklist: [
      { key: 'facebook',  label: 'Facebook / Instagram' },
      { key: 'google',    label: 'Google-konto (Gmail, Drive, Foton)' },
      { key: 'apple',     label: 'Apple / iCloud' },
      { key: 'email',     label: 'Övrig e-post' },
      { key: 'klarna',    label: 'Klarna' },
      { key: 'paypal',    label: 'PayPal' },
      { key: 'streaming', label: 'Streaming (Spotify, Netflix m.fl.)' },
      { key: 'gaming',    label: 'Spelkonton' },
    ],
    notesPlaceholder: 'Övriga konton att avsluta…',
  },
  {
    id: 'skattedeklaration',
    title: 'Dödsboets skattedeklaration',
    desc: 'Dödsboet är skattskyldigt och kan behöva lämna in en deklaration. Skatteverket har en egen guide för hur man deklarerar för ett dödsbo — annars går det bra att kontakta en revisor.',
    urgency: 'later',
    time: 'Senast 2 maj efter dödsåret',
    link: 'https://www.skatteverket.se/privat/folkbokforing/narenanhorigdor/deklareradodsbo.4.3528414214b3f87580566e.html',
    triggers: [],
    digital: 'digital',
    notesPlaceholder: 'Deklaration inlämnad, revisor anlitad, datum…',
  },

  // ── CONDITIONAL: Fastighet ─────────────────
  {
    id: 'fastighet_forsaljningsadmin',
    title: 'Visning, budgivning och köpekontrakt',
    desc: 'Om ni säljer bostaden själva (utan mäklare) behöver dödsboet sköta visning, ta emot bud och upprätta köpekontrakt. Ta gärna hjälp av en jurist för själva kontraktet — ett fel här kan bli kostsamt. Anlitar ni mäklare sköter de allt detta åt er.',
    urgency: 'week',
    time: 'Veckor',
    link: null,
    triggers: ['fastighet'],
    maklarhanterad: true,
    notesPlaceholder: 'Visningar bokade, bud mottagna, kontrakt upprättat…',
  },
  {
    id: 'bostadsratt_brf',
    title: 'Kontakta bostadsrättsföreningen',
    desc: 'Meddela föreningen om dödsfallet och fråga vad som gäller för överlåtelse av bostadsrätten till arvinge eller försäljning. BRF:en behöver godkänna en ny ägare och har egna rutiner för detta.',
    urgency: 'week',
    time: 'ca 20 min',
    link: null,
    triggers: ['fastighet'],
    notesPlaceholder: 'BRF kontaktad, kontaktperson, beslut om överlåtelse…',
  },
  {
    id: 'lagfart',
    title: 'Ansök om lagfart',
    desc: 'När en fastighet ärvs måste den nya ägaren ansöka om lagfart hos Lantmäteriet. Ansökan ska göras inom 3 månader från att bouppteckningen registrerats hos Skatteverket. Vid ett rent arvskifte (ingen arvinge betalar de andra) kostar det bara 825 kr i expeditionsavgift — ingen stämpelskatt. Löser en arvinge ut de andra med kontanter och ersättningen når 85 % eller mer av taxeringsvärdet, tillkommer 1,5 % stämpelskatt på den delen.',
    urgency: 'later',
    time: 'ca 30 min online',
    link: 'https://www.lantmateriet.se/sv/fastigheter/agande-och-rattigheter/lagfart/',
    triggers: ['fastighet'],
    digital: 'digital',
    notesPlaceholder: 'Ansökan skickad, datum, stämpelskatt beräknad…',
  },
  {
    id: 'lantbruk_fastighet',
    title: 'Lantbruks- eller skogsfastighet i dödsboet',
    desc: 'Lantbruks- och skogsfastigheter kan ha särskilda regler utöver det som gäller för vanliga bostäder — t.ex. kring virkesförråd, arrendeavtal och jordbruksstöd som ska överföras eller avslutas. Kontakta Skogsstyrelsen eller Jordbruksverket om fastigheten är aktiv, och en jurist som är van vid lantbruksfastigheter för arvskiftet. Läs mer i vår <a href="./dodsbo-fastighet.html" target="_blank" rel="noopener">guide om dödsbo och fastighet</a>.',
    urgency: 'week',
    time: 'ca 1 timme',
    link: null,
    triggers: ['lantbruk'],
    notesPlaceholder: 'Arrendeavtal, jordbruksstöd, skogsbruksplan…',
  },

  // ── CONDITIONAL: Hyresrätt ────────────────
  {
    id: 'hyresratt_uppsagning',
    title: 'Säg upp hyreskontrakt',
    urgency: 'today',
    time: 'Gör inom 1 månad — annars löper kontraktet vidare',
    desc: 'Hyreskontrakt upphör inte automatiskt vid dödsfall. Säg upp direkt till hyresvärden skriftligen — om det görs inom en månad från dödsfallet är uppsägningstiden normalt en månad. Väntar du längre löper vanlig uppsägningstid (ofta 3 månader). Ha dödsbevis redo.',
    link: null,
    triggers: ['hyresratt'],
    digital: 'hybrid',
    hasDoc: 'letter',
  },

  // ── CONDITIONAL: Företag ───────────────────
  {
    id: 'foretag_bolagsverket',
    title: 'Meddela Bolagsverket om dödsfall',
    desc: 'Om den avlidne hade ett aktiebolag eller enskild firma behöver styrelse/dödsbo meddela Bolagsverket.',
    urgency: 'week',
    time: 'ca 1 timme',
    link: 'https://www.bolagsverket.se',
    phone: '0771-670 670',
    triggers: ['foretag'],
    digital: 'digital',
    notesPlaceholder: 'Anmälan skickad, ärendenummer, datum…',
  },
  {
    id: 'foretag_avveckling',
    title: 'Planera avveckling eller överlåtelse av företaget',
    desc: 'Ska bolaget avvecklas, säljas, eller tas över av en arvinge? Detta är komplext och tidskänsligt — anlita revisor och jurist tidigt.<br><br><strong>Om det finns aktiva kunder eller uppdrag:</strong> Dödsboet tar automatiskt över ägarens rättigheter och skyldigheter. Kontakta kunderna och informera om dödsfallet — var transparent om vad som händer. Kan pågående avtal inte fullföljas, meddela motparten snarast och diskutera avslut i god anda.<br><br><strong>Praktiska steg nu:</strong><br>1. Kontakta företagets revisor och redovisningskonsult direkt.<br>2. Säkerställ att löpande räkningar, löner och moms hanteras — betalstopp sker inte automatiskt.<br>3. Meddela Bolagsverket om dödsfallet (se uppgiften ovan).<br>4. Använd <em>Dokument → Skatteverket</em> härifrån för att begära avregistrering av F-skatt.',
    urgency: 'week',
    time: 'Kontakta revisor',
    link: null,
    triggers: ['foretag'],
    notesPlaceholder: 'Revisor kontaktad, pågående avtal identifierade, åtgärder…',
  },

  // ── CONDITIONAL: Skulder ──────────────────
  {
    id: 'skulder_inventering',
    title: 'Inventera skulder noggrant',
    desc: 'Samla en komplett bild av lån, krediter och obetalda räkningar. Skulder betalas av dödsboet innan arv utbetalas.<br><br><strong>Viktigt:</strong> Begravnings- och bouppteckningskostnader prioriteras före alla andra skulder. Om boet inte räcker till kontaktar du borgenärerna och begär anstånd tills bouppteckningen är klar. Du som anhörig är <em>inte</em> personligt betalningsansvarig för den avlidnes skulder.<br><br>Lista varje skuld med borgenär och belopp under fliken Bouppteckning — samma lista används där boets nettovärde räknas ut.',
    urgency: 'week',
    time: 'ca 1–2 timmar',
    link: null,
    triggers: ['skulder'],
    notesPlaceholder: 'Övrigt att komma ihåg — t.ex. begärt anstånd, väntar svar från borgenär…',
  },
  {
    id: 'skulder_kronofogden',
    title: 'Kontrollera skulder hos Kronofogden',
    desc: 'Du kan begära ett skuldsaldo direkt hos Kronofogden för att se om det finns registrerade skulder.',
    urgency: 'week',
    time: 'ca 15 min',
    link: 'https://www.kronofogden.se',
    phone: '0771-73 73 00',
    triggers: ['skulder'],
    notesPlaceholder: 'Kontroll utförd, datum, eventuella skulder noterade…',
  },

  // ── CONDITIONAL: Utland ───────────────────
  {
    id: 'utland_juridik',
    title: 'Hämta juridisk rådgivning för utlandstillgångar',
    desc: 'Tillgångar i annat land — bankkonto, bostad, pension — lyder under det landets lagar och kräver separat utredning. EU:s arvsförordning (nr 650/2012) gäller om den hemmahörande i Sverige dog inom EU, men utanför EU gäller det ländets egna regler.<br><br><strong>Börja med dessa steg:</strong><br>1. Kontakta banken i det andra landet och meddela dödsfallet.<br>2. Anlita en jurist specialiserad på internationell arvsrätt — fråga begravningsbyrån eller Advokatsamfundet.<br>3. Hör med Utrikesdepartementet om konsulär hjälp vid bostad eller tillgångar utanför EU.<br>4. Se till att bouppteckningen täcker utlandstillgångarna — en svensk bouppteckning räcker ofta inom EU, men ibland krävs en lokal kopia.',
    urgency: 'week',
    time: 'Kontakta jurist',
    link: null,
    triggers: ['utland'],
    resources: [
      { label: 'Advokatsamfundet — hitta specialist i internationell arvsrätt', url: 'https://www.advokatsamfundet.se/hitta-advokat' },
      { label: 'UD — konsulär hjälp vid dödsfall utomlands', url: 'https://www.swedenabroad.se/sv/om-utlandet-for-svenska-medborgare/konsulart-bistand/' },
    ],
    notesPlaceholder: 'Land och tillgång, jurist kontaktad, datum…',
  },

  // ── CONDITIONAL: Minderårigt barn ─────────
  {
    id: 'minderarig_goman',
    title: 'Utred om god man behövs för minderårigt barn',
    desc: 'Om ett minderårigt barn är delägare i dödsboet kan en god man behöva utses för att representera barnet. En förälder kan inte ensam företräda sitt barn i ett dödsbo där de själva är delägare — det uppstår en intressekonflikt.<br><br>Kontakta <strong>överförmyndaren i din kommun</strong> — det är de som hanterar detta. Du hittar dem via din kommuns hemsida (sök "överförmyndare [kommunens namn]"). Be om en handläggningstid direkt — processen kan ta några veckor.',
    urgency: 'today',
    time: 'Kontakta överförmyndaren',
    link: null,
    triggers: ['minderarig'],
    resources: [
      { label: 'Sveriges Kommuner och Regioner — hitta din överförmyndare', url: 'https://skr.se/skr/demokratiledningstyrning/valmaktfordelning/overformyndare.html' },
    ],
    notesPlaceholder: 'Överförmyndare kontaktad, kommun, handläggare, datum…',
  },

  // ── CONDITIONAL: Äktenskapsförord / samboavtal ────────────
  {
    id: 'aktemanskapsforord',
    title: 'Kontrollera äktenskapsförord / samboavtal',
    desc: 'Äktenskapsförord och samboavtal avgör vad som är giftorättsgods (delas lika) respektive enskild egendom (tillfaller ägaren). Det påverkar direkt hur bouppteckningen ska upprättas och vad som ingår i arvet.<br><br><strong>Hitta dokumentet:</strong> Bland papperen hemma, i bankfack, hos den jurist som upprättade det, eller via Skatteverket (äktenskapsregistret).<br><br><strong>Om inget avtal finns:</strong> Hela giftorättsgodset ingår i bouppteckningen — det ska delas lika mellan makarna.',
    urgency: 'week',
    time: 'ca 30 min + jurist vid behov',
    link: null,
    // Trigger på giftSambo (var den avlidne gift/sambo?) — inte bara 'make' (är DU
    // maken/makan). En bouppteckning påverkas av äktenskapsförord oavsett vem som fyller i.
    triggers: ['giftSambo', 'make'],
    resources: [
      { label: 'Skatteverket — äktenskapsregistret', url: 'https://www.skatteverket.se/privat/folkbokforing/aktenskapochpartnerskap/aktenskapsregistret.html' },
    ],
    notesPlaceholder: 'Hittat äktenskapsförord? Var? Innehåll och konsekvenser…',
  },

  // ── ALWAYS: Livförsäkringsersättning ──────
  {
    id: 'livforsakring_ansokan',
    title: 'Ansök om livförsäkringsersättning',
    desc: 'En livförsäkring betalar ut ett skattefritt belopp vid dödsfall. Ansökan sker <em>inte</em> automatiskt — du måste aktivt kontakta varje försäkringsbolag.<br><br><strong>Tre ställen att leta:</strong><br>1. <em>Privat livförsäkring</em> — hos försäkringsbolaget (Folksam, If, Skandia, Länsförsäkringar m.fl.)<br>2. <em>TGL (Tjänstegrupplivförsäkring)</em> — via arbetsgivaren om den avlidne haft kollektivavtal. Kontakta Afa, Folksam eller KPA beroende på sektor.<br>3. <em>Fackförbundets livförsäkring</em> — många fackförbund har egna livförsäkringar via t.ex. Bliwa eller Folksam<br><br>Du behöver dödsfallsintyg och den förmånstaginges personnummer. Ansök så snart dödsfallsintyget finns.',
    urgency: 'week',
    time: 'ca 1 tim per försäkring',
    link: null,
    triggers: [],
    resources: [
      { label: 'Afa Försäkring — TGL och dödsfall', url: 'https://www.afaforsakring.se/privatperson/dodsfall/' },
      { label: 'Konsumenternas — jämför livförsäkringar', url: 'https://www.konsumenternas.se/forsakring/livforsakring/' },
    ],
    notesPlaceholder: 'Försäkringsbolag kontaktade, ärendenummer, belopp beviljade…',
  },

  // ── CONDITIONAL: Värdepapper ──────────────
  {
    id: 'vardepapper_hantering',
    title: 'Hantera aktier, fonder och värdepapper',
    desc: 'Värdepapper och depåkonton ingår i bouppteckningen och ska värderas per dödsdagen.<br><br><strong>Viktiga distinktioner:</strong><br>— <em>ISK och vanlig depå</em>: ingår i dödsboet och fördelas med arvet<br>— <em>Kapitalförsäkring med namngiven förmånstagare</em>: tillfaller förmånstagaren <em>utanför</em> dödsboet — ska ändå noteras i bouppteckningen men fördelas separat<br>— <em>Tjänstepension med förmånstagare</em>: samma princip som kapitalförsäkring<br><br><strong>Steg nu:</strong><br>1. Kontakta banken/mäklaren och meddela dödsfallet<br>2. Begär en innehavsförteckning med värde per dödsdagen<br>3. Kontakta Euroclear om aktier saknar känd depå',
    urgency: 'week',
    time: 'ca 1–2 timmar',
    link: null,
    triggers: ['vardepapper'],
    resources: [
      { label: 'Euroclear — aktieägarregistret', url: 'https://www.euroclear.com/sweden/sv/private-individuals/private-individuals-main.html' },
    ],
    notesPlaceholder: 'Depåer och konton identifierade, värden per dödsdagen…',
  },

  // ── CONDITIONAL: Barnpension ──────────────
  {
    id: 'barnpension_ansokan',
    title: 'Ansök om barnpension',
    desc: 'Barn under 20 år som förlorat en förälder kan ha rätt till <em>barnpension</em> och <em>efterlevandestöd</em> från Försäkringskassan. Ansökan är inte automatisk — du måste aktivt ansöka.<br><br><strong>Barnpension:</strong> Baseras på den avlidnes livsinkomst. Söks via Försäkringskassan.<br><strong>Efterlevandestöd:</strong> Kompletterande stöd om barnpensionen är låg. Upp till 18 år.<br><strong>Tjänstepension:</strong> Kontrollera om den avlidne hade ett efterlevandeskydd för barn i sin tjänstepension.<br><br>Ansök inom 1 år — du kan inte få retroaktiv utbetalning längre tillbaka.',
    urgency: 'week',
    time: 'ca 30 min',
    phone: '0771-524 524',
    link: 'https://www.forsakringskassan.se/privatperson/nar-nagon-dor/barnpension',
    triggers: ['barn'],
    digital: 'digital',
    notesPlaceholder: 'Ansökan inlämnad, ärendenummer, beviljade belopp…',
  },

  // ── CONDITIONAL: Omställningspension ──────
  {
    id: 'omstallningspension',
    title: 'Ansök om omställningspension',
    desc: 'Som efterlevande make kan du ha rätt till <em>omställningspension</em> i upp till 12 månader. Syftet är att ge ekonomiskt stöd medan du ställer om livet.<br><br><strong>Krav:</strong> Du och den avlidna måste ha bott ihop. Du ska inte vara i ålderspension.<br><strong>Retroaktiv utbetalning ges ej</strong> — ansök snarast efter dödsfallet.<br><br>Kontakta Pensionsmyndigheten för att kontrollera om du har rätt och för att ansöka.',
    urgency: 'week',
    time: 'ca 30 min',
    phone: '0771-776 776',
    link: 'https://www.pensionsmyndigheten.se/privatperson/nar-nagon-dor/omstallningspension',
    triggers: ['make'],
    digital: 'digital',
    notesPlaceholder: 'Ansökan inlämnad, ärendenummer, beviljad period…',
  },

  // ── CONDITIONAL: Make/maka ────────────────
  {
    id: 'make_pension',
    title: 'Kontrollera efterlevandepension',
    desc: 'Som make/maka kan du ha rätt till efterlevandepension. Kontakta Pensionsmyndigheten och eventuella tjänstepensionsbolag.',
    urgency: 'week',
    time: 'ca 30 min',
    link: 'https://www.pensionsmyndigheten.se',
    phone: '0771-776 776',
    triggers: ['make'],
    notesPlaceholder: 'Kontaktad Pensionsmyndigheten, ärendenummer, tjänstepensionsbolag…',
  },

  // ── CONDITIONAL: Testamente ───────────────
  {
    id: 'testamente_oppna',
    title: 'Öppna och bevittna testamentet',
    desc: 'Testamentet ska delges alla arvingar. Ta hjälp av en jurist om du är osäker på hur detta görs korrekt.',
    urgency: 'week',
    time: 'ca 1 timme',
    link: null,
    triggers: ['testamente'],
    digital: 'fysisk',
    notesPlaceholder: 'Testamente delgivet, datum, eventuell jurist anlitad…',
  },

  // ── CONDITIONAL: Inget testamente ─────────
  {
    id: 'inget_testamente_koll',
    title: 'Kontrollera om testamente kan finnas',
    desc: 'Kolla i den avlidnes papper, bankfack och hos jurister. Det är vanligare än man tror att testamenten hittas senare.',
    urgency: 'week',
    time: 'ca 1 timme',
    link: null,
    triggers: ['inget_testamente'],
    notesPlaceholder: 'Kontrollerat papper, bankfack, jurister — resultat…',
  },

  // ── CONDITIONAL: Fordon ───────────────────
  {
    id: 'fordon_transport',
    title: 'Byt ägare på fordon',
    urgency: 'later',
    time: 'ca 30 min + posthantering',
    desc: 'Fordon i ett dödsbo kräver en manuell process — de digitala tjänsterna hos Transportstyrelsen fungerar inte när säljaren är avliden. Använd registreringsbevisets gula del (Del 2) i original. En dödsboföreträdare skriver under i nuvarande ägares ställe. Den nye ägaren måste teckna trafikförsäkring från ägarbytesdagen.',
    link: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/agarbyte/',
    triggers: ['fordon'],
    notesPlaceholder: 'Fordon, ny ägare, registreringsbevis del 2 skickat…',
  },

  // ── CONDITIONAL: Husdjur ──────────────────
  {
    id: 'husdjur_omplacering',
    title: 'Ordna omsorg för husdjur',
    urgency: 'week',
    time: 'Din tid',
    desc: 'Husdjur är juridiskt lös egendom och hanteras i bouppteckning och testamente. Om den avlidne hade hund måste ägarbyte registreras i Jordbruksverkets hundregister av den nya ägaren. Behöver djuret omplaceras finns djurhem och uppfödare som kan hjälpa till.',
    link: 'https://www.jordbruksverket.se/djur/hundar-katter-och-harliga-djur/hundar/registrera-din-hund',
    triggers: ['husdjur'],
    notesPlaceholder: 'Djurets namn, ny ägare kontaktad, ägarbyte registrerat…',
  },

  // ── ALWAYS: Hjälpmedel och mediciner ──────
  {
    id: 'hjalpmedel_mediciner',
    title: 'Återlämna hjälpmedel och mediciner',
    urgency: 'week',
    time: 'ca 30 min',
    desc: 'Rullstol, säng, lyft och andra medicintekniska produkter är ofta lån från regionen och ska återlämnas rengjorda. Större hjälpmedel hämtas ofta kostnadsfritt — ring regionen eller kommunen. Överblivna mediciner (tabletter, sprutor, krämer) lämnas till närmaste apotek för säker destruktion.',
    triggers: [],
    notesPlaceholder: 'Hjälpmedel återlämnade, mediciner till apoteket, datum…',
  },

  // ── ALWAYS: Bostadsavveckling ──────────────
  {
    id: 'bostadsavveckling',
    title: 'Töm och städa bostaden',
    urgency: 'later',
    time: 'Dagar–veckor',
    desc: 'Samordna med övriga arvingar vad som sparas, säljas eller skänks bort. Gör det i god tid — en tom bostad säljs snabbare och minskar löpande hyra eller avgift som annars belastar dödsboet.<br><br><strong>Donera / sälja:</strong> Stadsmissionen, Myrorna och Erikshjälpen hämtar möbler och kläder kostnadsfritt. Blocket och Facebook Marketplace fungerar bra för lösa föremål. Begravningsbyrån kan rekommendera lokala aktörer.<br><br><strong>Anlita städhjälp:</strong> Specialiserade dödsboföretag hanterar hel tömning och städ. Typisk kostnad: 5 000–20 000 kr beroende på bostadens storlek. Betalas ur dödsboets tillgångar.<br><br><strong>RUT-avdraget gäller inte dödsbo</strong> — dödsboet är en juridisk person och Skatteverket medger inte skattereduktion.',
    triggers: [],
    notesPlaceholder: 'Vad ska sparas, säljas, skänkas? Kontakter till städfirma…',
  },
];

function buildTasks() {
  const triggers = new Set();
  if (state.fastighet)   triggers.add('fastighet');
  if (state.foretag)     triggers.add('foretag');
  if (state.skulder)     triggers.add('skulder');
  if (state.utland)      triggers.add('utland');
  if (state.minderarig)  triggers.add('minderarig');
  if (state.testamente)  triggers.add('testamente');
  if (!state.testamente) triggers.add('inget_testamente');
  if (state.relation === 'make') triggers.add('make');
  if (state.fordon)      triggers.add('fordon');
  if (state.husdjur)     triggers.add('husdjur');
  if (state.hyresratt)   triggers.add('hyresratt');
  if (state.vardepapper) triggers.add('vardepapper');
  if (state.barn)        triggers.add('barn');
  if (state.giftSambo)   triggers.add('giftSambo');
  // T189: dödsboanmälan ersätter bouppteckning bara om boet är litet OCH ingen fastighet finns
  const useDodsboanmalan = state.litetDodsbo && !state.fastighet;
  if (useDodsboanmalan) triggers.add('litetDodsbo');
  // T193: strukturerat bostadsflöde — lantbruk/skog får en egen uppgift
  if (state.fastighet && state.bostadTyp === 'lantbruk') triggers.add('lantbruk');
  // "Anlitar ni mäklare?" filtrerar bort mäklarhanterade uppgifter — minskar börda
  const useMaklare = state.fastighet && state.maklare;

  state.tasks = TASK_LIBRARY.filter(task => {
    if (task.id === 'bouppteckning' && useDodsboanmalan) return false;
    if (task.id === 'dodsboanmalan' && !useDodsboanmalan) return false;
    if (task.maklarhanterad && useMaklare) return false;
    return task.triggers.length === 0 || task.triggers.some(t => triggers.has(t));
  }).map(task => ({ ...task, done: false, started: false }));

  loadTaskState();
}

// ─── DEADLINE ENGINE (T135) ──────────────────
// Ren datumaritmetik utifrån dödsdatumet — inget gissas, bara adderad tid.
// Om inget dödsdatum är ifyllt lämnas TASK_LIBRARY:s statiska fristtext orörd (fallback).
function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function parseDeathDate() {
  if (!state.deathDate) return null;
  const d = new Date(state.deathDate + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function applyDeadlines() {
  const death = parseDeathDate();
  if (!death) return;

  // Bouppteckning (ÄB 20 kap 1 §): förrättas inom 3 mån, skickas till Skatteverket inom 4 mån.
  const boupp = state.tasks.find(t => t.id === 'bouppteckning');
  if (boupp) {
    const boFrist  = addMonths(death, 3);
    const skvFrist = addMonths(death, 4);
    boupp.time = `Bouppteckning senast ${formatDate(boFrist)}`;
    boupp.desc = boupp.desc.replace(
      'Den ska vara klar inom 3 månader och skickas till Skatteverket inom 4 månader.',
      `Den ska vara klar senast <strong>${formatDate(boFrist)}</strong> och skickas till Skatteverket senast <strong>${formatDate(skvFrist)}</strong>.`
    );
    // Dödsboanmälan (litet bo): hålls mjuk med "runt"/"cirka" — exakt kommunregel är overifierad,
    // och en falskt exakt deadline här skulle skapa onödig stress snarare än hjälpa.
    const smaBo = addMonths(death, 2);
    boupp.desc = boupp.desc.replace(
      'Kontakta socialtjänsten för att se om det gäller dig.',
      `Kontakta socialtjänsten för att se om det gäller dig — gör det gärna runt <strong>${formatDate(smaBo)}</strong> eller tidigare (exakt frist varierar per kommun).`
    );
  }

  // Hyresuppsägning: kortare uppsägningstid om det görs inom 1 månad från dödsfallet.
  const hyra = state.tasks.find(t => t.id === 'hyresratt_uppsagning');
  if (hyra) {
    const hyresFrist = addDays(death, 30);
    hyra.time = `Säg upp senast ${formatDate(hyresFrist)} för kortare uppsägningstid`;
  }

  track('deadline_dates_computed');
}

// Lagfart-fristen räknas separat, eftersom den utgår från datumet bouppteckningen
// registrerades hos Skatteverket — inte dödsdatumet. Fylls i av användaren själv
// på lagfart-uppgiften, när det datumet väl finns.
const LAGFART_DEFAULT_TIME = 'ca 30 min online';

function applyLagfartDeadline() {
  const lagfart = state.tasks?.find(t => t.id === 'lagfart');
  if (!lagfart) return;
  if (!state.bouppRegDatum) { lagfart.time = LAGFART_DEFAULT_TIME; return; }
  const reg = new Date(state.bouppRegDatum + 'T00:00:00');
  if (isNaN(reg.getTime())) { lagfart.time = LAGFART_DEFAULT_TIME; return; }
  const frist = addMonths(reg, 3);
  lagfart.time = `Ansök senast ${formatDate(frist)}`;
}

function setBouppRegDatum(value) {
  state.bouppRegDatum = value || '';
  applyLagfartDeadline();
  saveState();
  const timeEl = document.querySelector('#task-card-lagfart .task-time');
  const lagfart = state.tasks.find(t => t.id === 'lagfart');
  if (timeEl && lagfart) {
    const badge = timeEl.querySelector('.task-started-badge');
    timeEl.textContent = lagfart.time;
    if (badge) timeEl.appendChild(badge);
  }
}

// ─── NOTES (cached) ──────────────────────────
let _notesCache = null;

function _getNotes() {
  if (_notesCache) return _notesCache;
  try { _notesCache = JSON.parse(localStorage.getItem('efterplan_notes') || '{}'); }
  catch(e) { _notesCache = {}; }
  return _notesCache;
}

function _debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

const saveTaskNote = _debounce(function(taskId, value) {
  const notes = _getNotes();
  notes[taskId] = value;
  try { localStorage.setItem('efterplan_notes', JSON.stringify(notes)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
  if (value.length > 0) track('note_saved', { task: taskId });
}, 400);

function getTaskNote(taskId) {
  return _getNotes()[taskId] || '';
}

// ─── HIDE DONE TASKS (per sektion + global) ──
const HIDE_DONE_SECTIONS = ['today', 'week', 'later'];

function _getHideDone() {
  try { return JSON.parse(localStorage.getItem('efterplan_hide_done') || '{}'); } catch(e) { return {}; }
}
function _saveHideDone(obj) {
  try { localStorage.setItem('efterplan_hide_done', JSON.stringify(obj)); } catch(e) {}
}

function toggleHideDoneSection(section) {
  const hd = _getHideDone();
  hd[section] = !hd[section];
  _saveHideDone(hd);
  renderPlan();
}

function toggleHideDoneAll() {
  const hd = _getHideDone();
  // Om någon sektion just nu visar klara uppgifter, döljer vi allt. Annars visar vi allt igen.
  const anyVisible = HIDE_DONE_SECTIONS.some(s => !hd[s]);
  HIDE_DONE_SECTIONS.forEach(s => { hd[s] = anyVisible; });
  _saveHideDone(hd);
  renderPlan();
}

function updateHideDoneButtons() {
  const hd = _getHideDone();
  HIDE_DONE_SECTIONS.forEach(section => {
    const btn = document.getElementById(`hide-done-${section}`);
    if (btn) btn.textContent = hd[section] ? 'Visa klara igen' : 'Dölj klara';
  });
  const globalBtn = document.getElementById('hide-done-all');
  if (globalBtn) {
    const anyVisible = HIDE_DONE_SECTIONS.some(s => !hd[s]);
    globalBtn.textContent = anyVisible ? 'Dölj alla klara uppgifter' : 'Visa alla klara uppgifter igen';
  }
}

function saveTaskState() {
  const saved = {};
  state.tasks.forEach(t => { saved[t.id] = { done: t.done, started: t.started }; });
  try { localStorage.setItem('efterplan_tasks', JSON.stringify(saved)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
}

function loadTaskState() {
  try {
    const source = JSON.parse(localStorage.getItem('efterplan_tasks') || '{}');
    state.tasks = state.tasks.map(t => {
      const s = source[t.id];
      if (!s) return t;
      if (typeof s === 'boolean') return { ...t, done: s, started: false };
      return { ...t, done: s.done || false, started: s.started || false };
    });
  } catch(e) {}
}


// ─── RENDER PLAN ─────────────────────────────
function renderPlan() {
  const name = state.name;
  document.getElementById('plan-title').textContent =
    name ? `${name}s efterplan` : 'Din efterplan';
  document.getElementById('plan-sub').textContent =
    'Uppdateras allteftersom du går vidare. Det finns inget fel sätt att börja.';

  const defEl = document.getElementById('plan-dodsbo-def');
  if (defEl) {
    const n = state.name || 'den som gick bort';
    defEl.textContent = `Dödsboet är ett tillfälligt begrepp för allt ${n} lämnade efter sig — tillgångar och skulder. Det upphör när allt är fördelat.`;
  }

  const today  = state.tasks.filter(t => t.urgency === 'today');
  const week   = state.tasks.filter(t => t.urgency === 'week');
  const later  = state.tasks.filter(t => t.urgency === 'later');

  // ── Börja här-kort ──────────────────────────
  const firstTask = state.tasks.find(t => !t.done);
  const startEl   = document.getElementById('start-here');
  if (startEl) {
    if (firstTask) {
      startEl.innerHTML = `
        <div>
          <div class="start-here-label">Börja här</div>
          <div class="start-here-title">${firstTask.title}</div>
        </div>
        <div class="start-here-arrow">›</div>`;
      startEl.classList.remove('hidden');
      startEl.onclick = () => {
        // Make sure we're on plan tab, open the task
        switchTab('plan');
        toggleTask(firstTask.id);
        setTimeout(() => {
          document.getElementById(`task-card-${firstTask.id}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
      };
    } else {
      startEl.classList.add('hidden');
    }
  }

  const nextTaskId = firstTask?.id;
  renderTaskList('tasks-today', today, nextTaskId, 0, 'today');
  renderTaskList('tasks-week',  week,  nextTaskId, today.length, 'week');
  renderTaskList('tasks-later', later, nextTaskId, today.length + week.length, 'later');
  updateHideDoneButtons();

  // Show Skatteverket doc button only if deceased had a company (F-skatt relevant)
  const skvBtn = document.getElementById('doc-btn-skatteverket');
  if (skvBtn) skvBtn.classList.toggle('hidden', !state.foretag);
  const fullmaktBtn = document.getElementById('doc-btn-fullmakt');
  if (fullmaktBtn) fullmaktBtn.classList.toggle('hidden', state.ansvar !== 'flera');

  document.getElementById('count-today').textContent = `${today.length} uppgifter`;
  document.getElementById('count-week').textContent  = `${week.length} uppgifter`;
  document.getElementById('count-later').textContent = `${later.length} uppgifter`;

  updateProgress();
  renderBills();
  renderDocuments();
}

let expandedTaskId = null;

function buildPreviewCTACard() {
  const cta = document.createElement('div');
  cta.className = 'preview-cta-card';
  cta.innerHTML = `
    <div class="preview-cta-lock" aria-hidden="true">🔒</div>
    <h3 class="preview-cta-title">Lås upp hela planen</h3>
    <p class="preview-cta-desc">Du har sett de första ${PREVIEW_STEPS} stegen. Lås upp alla återstående uppgifter — engångsbetalning, ingen prenumeration.</p>
    <button class="btn-primary preview-cta-btn" onclick="handlePreviewCTA()">Lås upp — 49 kr</button>
  `;
  return cta;
}

function handlePreviewCTA() {
  track('preview_cta_clicked');
  handlePaywallCTA();
}

function renderTaskList(containerId, tasks, nextTaskId, globalOffset = 0, sectionKey = null) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const sectionHideDone = sectionKey ? _getHideDone()[sectionKey] : false;

  tasks.forEach((task, i) => {
    const globalIdx = globalOffset + i;
    const isLocked  = PAYWALL_ENABLED && !isPremium() && globalIdx >= PREVIEW_STEPS;

    // T030: insert preview CTA once, right before the first locked task
    if (PAYWALL_ENABLED && !isPremium() && globalIdx === PREVIEW_STEPS) {
      container.appendChild(buildPreviewCTACard());
    }

    const wrap = document.createElement('div');
    wrap.className = 'task-wrap';
    wrap.id = `task-wrap-${task.id}`;
    if (task.done && sectionHideDone) wrap.classList.add('task-wrap--hidden-done');

    // T192 — digital/fysisk-indikator. Kopy utgår alltid från att det är den
    // EFTERLEVANDES eget BankID som används, aldrig den avlidnes (spärras vid dödsfall).
    const DIGITAL_LEVELS = {
      digital:  { emoji: '🟢', title: 'Går att göra digitalt, med ditt eget BankID' },
      hybrid:   { emoji: '🟡', title: 'Delvis digitalt — vissa steg kan kräva telefon, möte eller post' },
      fysisk:   { emoji: '🔴', title: 'Kräver post eller original i fysisk form' },
    };
    const digitalInfo = DIGITAL_LEVELS[task.digital];
    const digitalBadge = digitalInfo
      ? `<span class="task-digital-badge" title="${digitalInfo.title}" aria-label="${digitalInfo.title}">${digitalInfo.emoji}</span>`
      : '';

    if (isLocked) {
      wrap.innerHTML = `
        <div class="task-card task-card--locked" id="task-card-${task.id}" aria-disabled="true">
          <div class="task-check" aria-hidden="true"></div>
          <div class="task-body">
            <div class="task-title">${task.title}${digitalBadge}</div>
            <div class="task-time">${task.time}</div>
          </div>
          <div class="task-lock" aria-hidden="true">🔒</div>
        </div>`;
      wrap.style.animationDelay = `${i * 35}ms`;
      wrap.classList.add('task-anim-in');
      container.appendChild(wrap);
      return;
    }

    const linkHtml = task.link
      ? `<a class="task-expand-link" href="${task.link}" target="_blank" rel="noopener">Öppna ${task.link.replace('https://www.', '')} ↗</a>`
      : '';

    const phoneHtml = task.phone
      ? `<a class="task-expand-phone" href="tel:${task.phone.replace(/\s|-/g,'')}">Ring ${task.phone}</a>`
      : '';

    const phone2Html = task.phone2
      ? `<a class="task-expand-phone task-expand-phone--secondary" href="tel:${task.phone2.replace(/\s|-/g,'')}">Ring ${task.phone2}</a>`
      : '';

    // Lagfart-fristen (3 mån) räknas från datumet bouppteckningen registrerades hos
    // Skatteverket — inte dödsdatumet. Frivilligt fält, syns bara på lagfart-uppgiften.
    const lagfartDateHtml = task.id === 'lagfart'
      ? `<label class="task-date-field">
           <span class="task-date-label">Datum då bouppteckningen registrerades hos Skatteverket</span>
           <input type="date" class="task-date-input" id="bopp-reg-datum-input" value="${state.bouppRegDatum || ''}"
             onclick="event.stopPropagation()" onchange="event.stopPropagation();setBouppRegDatum(this.value)">
         </label>`
      : '';

    const resourcesHtml = task.resources?.length
      ? `<div class="task-resources">${task.resources.map(r =>
          `<a class="task-resource-link" href="${r.url}" target="_blank" rel="noopener">${r.label} ↗</a>`
        ).join('')}</div>`
      : '';

    const notesHtml = task.notesPlaceholder && !task.done
      ? `<textarea class="task-notes" id="notes-${task.id}" placeholder="${task.notesPlaceholder}" rows="2"
           oninput="autoStartOnNote('${task.id}'); saveTaskNote('${task.id}', this.value)">${getTaskNote(task.id)}</textarea>`
      : '';

    const checklistHtml = task.checklist?.length ? renderTaskChecklist(task) : '';

    const notifyHtml = task.id === 'narmaste_anhörig' ? renderNotifyList() : '';

    const docLocationHtml = task.id === 'viktiga_dokument' ? renderDocumentLocationList() : '';

    const docHtml = task.hasDoc && !task.done
      ? `<button class="task-expand-doc" onclick="event.stopPropagation();switchTab('docs');showDocForm('${task.hasDoc}')">Generera dokument →</button>`
      : '';

    // "Hitta viktiga dokument" ber användaren samla ihop papper men saknade
    // en väg vidare till Arkiv-fliken (foto + AI-kategorisering, T143–T148)
    // där de faktiskt kan sparas. Kopplar ihop dem.
    const arkivLinkHtml = task.id === 'viktiga_dokument'
      ? `<button class="task-expand-doc" onclick="event.stopPropagation();switchTab('arkiv')">📷 Fota och spara dokumenten →</button>`
      : '';

    // "Inventera skulder noggrant" hade ett eget fritextfält som inte var kopplat
    // till Bouppteckningens skuldlista, där nettovärdet faktiskt räknas ut. Länkar dit istället.
    const boppLinkHtml = task.id === 'skulder_inventering'
      ? `<button class="task-expand-doc" onclick="event.stopPropagation();switchTab('bopp')">📋 Lista skulder i Bouppteckning →</button>`
      : '';

    const doneHtml = task.done
      ? `<span class="task-expand-done">Klar ✓</span>
         <button class="task-expand-undo-btn" onclick="event.stopPropagation();undoTaskDoneManual('${task.id}')">Markera som ej klar</button>`
      : task.started
      ? `<button class="task-expand-btn" onclick="event.stopPropagation();markTaskDone('${task.id}')">Markera som klar</button>`
      : `<button class="task-expand-start-btn" onclick="event.stopPropagation();markTaskStarted('${task.id}')">Påbörjad</button>
         <button class="task-expand-btn" onclick="event.stopPropagation();markTaskDone('${task.id}')">Markera som klar</button>`;

    const isNext = !task.done && task.id === nextTaskId;
    const cardClass = task.done ? ' done' : task.started ? ' started' : (isNext ? ' task-card--next' : '');
    const checkClass = task.done ? ' checked' : task.started ? ' started' : '';
    const nextBadge = isNext ? `<span class="task-next-badge">Nästa steg</span>` : '';
    const startedBadge = task.started && !task.done
      ? `<span class="task-started-badge">Påbörjad</span>`
      : '';

    wrap.innerHTML = `
      <div class="task-card${cardClass}" id="task-card-${task.id}">
        <div class="task-check${checkClass}" id="check-${task.id}"></div>
        <div class="task-body">
          <div class="task-title">${task.title}${digitalBadge}${nextBadge}</div>
          <div class="task-time">${task.time}${startedBadge}</div>
        </div>
        <div class="task-chevron" id="chevron-${task.id}" aria-hidden="true">›</div>
      </div>
      <div class="task-expand hidden" id="expand-${task.id}">
        <div class="task-expand-desc">${task.desc}</div>
        ${linkHtml}
        ${phoneHtml}
        ${phone2Html}
        ${lagfartDateHtml}
        ${resourcesHtml}
        ${notifyHtml}
        ${docLocationHtml}
        ${checklistHtml}
        ${notesHtml}
        <div class="task-expand-actions">
          ${doneHtml}
          ${docHtml}
          ${arkivLinkHtml}
          ${boppLinkHtml}
        </div>
      </div>
    `;

    const cardEl = wrap.querySelector('.task-card');
    cardEl.setAttribute('tabindex', '0');
    cardEl.setAttribute('role', 'button');
    cardEl.setAttribute('aria-expanded', 'false');
    cardEl.setAttribute('aria-controls', `expand-${task.id}`);
    cardEl.setAttribute('aria-label', task.title);
    cardEl.addEventListener('click', () => toggleTask(task.id));
    cardEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTask(task.id); }
    });

    const checkEl = wrap.querySelector('.task-check');
    checkEl.setAttribute('role', 'checkbox');
    checkEl.setAttribute('aria-checked', task.done ? 'true' : 'false');
    checkEl.setAttribute('aria-label', `Markera "${task.title}" som klar`);
    checkEl.style.cursor = 'pointer';
    checkEl.addEventListener('click', e => {
      e.stopPropagation();
      const t = state.tasks.find(x => x.id === task.id);
      if (!t) return;
      if (t.done) { undoTaskDoneManual(task.id); } else { markTaskDone(task.id); }
    });
    checkEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        const t = state.tasks.find(x => x.id === task.id);
        if (!t) return;
        if (t.done) { undoTaskDoneManual(task.id); } else { markTaskDone(task.id); }
      }
    });
    checkEl.setAttribute('tabindex', '0');

    if (task.notesPlaceholder && !task.done) {
      const notesEl = wrap.querySelector(`#notes-${task.id}`);
      if (notesEl) notesEl.setAttribute('aria-label', `Anteckningar för ${task.title}`);
    }

    // staggered entrance animation
    wrap.style.animationDelay = `${i * 35}ms`;
    wrap.classList.add('task-anim-in');

    container.appendChild(wrap);
  });
}

function toggleTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);

  const isOpen = expandedTaskId === taskId;

  if (expandedTaskId) {
    const prev     = document.getElementById(`expand-${expandedTaskId}`);
    const prevChev = document.getElementById(`chevron-${expandedTaskId}`);
    const prevCard = document.getElementById(`task-card-${expandedTaskId}`);
    if (prev)     prev.classList.add('hidden');
    if (prevChev) prevChev.classList.remove('open');
    if (prevCard) { prevCard.classList.remove('expanded'); prevCard.setAttribute('aria-expanded', 'false'); }
  }

  if (isOpen) { expandedTaskId = null; return; }

  expandedTaskId = taskId;
  const el   = document.getElementById(`expand-${taskId}`);
  const chev = document.getElementById(`chevron-${taskId}`);
  const card = document.getElementById(`task-card-${taskId}`);
  if (el)   el.classList.remove('hidden');
  if (chev) chev.classList.add('open');
  if (card) { card.classList.add('expanded'); card.setAttribute('aria-expanded', 'true'); }
}

function updateProgress() {
  const total = state.tasks.length;
  const done  = state.tasks.filter(t => t.done).length;
  if (total === 0) return;

  const pct       = Math.round((done / total) * 100);
  const summaryEl = document.getElementById('progress-summary');
  const fillEl    = document.getElementById('progress-bar-fill');
  const completionEl = document.getElementById('completion-message');

  if (fillEl) fillEl.style.width = pct + '%';

  if (done === total) {
    summaryEl.innerHTML = `<strong>${total} av ${total}</strong> uppgifter klara`;
    if (completionEl) completionEl.classList.add('visible');
    document.getElementById('plan-sub').textContent = 'Du har gått igenom allt. Ta ett djupt andetag.';
    setTimeout(showCompletionOverlay, 600);
  } else {
    summaryEl.innerHTML = `<strong>${done} av ${total}</strong> uppgifter klara`;
    if (completionEl) completionEl.classList.remove('visible');
  }

  // ── Plan-done footer ─────────────────────────
  const doneFooter = document.getElementById('plan-done-footer');
  if (doneFooter) doneFooter.classList.toggle('hidden', done !== total);

  // ── Section-done badges ───────────────────────
  ['today', 'week', 'later'].forEach(section => {
    const urgencyMap = { today: 'today', week: 'week', later: 'later' };
    const sectionTasks = state.tasks.filter(t => t.urgency === urgencyMap[section]);
    if (sectionTasks.length === 0) return;
    const allDone = sectionTasks.every(t => t.done);
    const badge = document.getElementById(`badge-${section}`);
    if (badge) badge.classList.toggle('hidden', !allDone);
  });
}

// ─── TASK CHECKLIST ────────────────────────────
function renderTaskChecklist(task) {
  const saved = (state.taskChecklists || {})[task.id] || {};
  const items = task.checklist.map(item => {
    const checked = !!saved[item.key];
    return `<label class="task-checklist-item${checked ? ' done' : ''}">
      <input type="checkbox" id="checklist-${task.id}-${item.key}" ${checked ? 'checked' : ''}
             onchange="toggleChecklistItem('${task.id}', '${item.key}')">
      <span>${item.label}</span>
    </label>`;
  }).join('');
  return `<div class="task-checklist">
    <div class="task-checklist-label">Bocka av vartefter:</div>
    ${items}
  </div>`;
}

function toggleChecklistItem(taskId, key) {
  if (!state.taskChecklists) state.taskChecklists = {};
  if (!state.taskChecklists[taskId]) state.taskChecklists[taskId] = {};
  state.taskChecklists[taskId][key] = !state.taskChecklists[taskId][key];
  saveState();
  const cb = document.getElementById(`checklist-${taskId}-${key}`);
  if (cb) {
    const item = cb.closest('.task-checklist-item');
    if (item) item.classList.toggle('done', state.taskChecklists[taskId][key]);
  }
}

function autoStartOnNote(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (task && !task.done && !task.started) markTaskStarted(taskId);
}

// ─── BILLS ───────────────────────────────────
function loadBills() {
  try { state.bills = JSON.parse(localStorage.getItem('efterplan_bills')) || []; } catch(e) { state.bills = []; }
}
function saveBills() {
  try { localStorage.setItem('efterplan_bills', JSON.stringify(state.bills)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
}
function renderBills() {
  const list = document.getElementById('bills-list');
  const empty = document.getElementById('bills-empty');
  if (!list) return;
  if (state.bills.length === 0) {
    list.innerHTML = '';
    empty && empty.classList.remove('hidden');
    return;
  }
  empty && empty.classList.add('hidden');
  list.innerHTML = state.bills.map(b => `
    <li class="bill-item${b.paid ? ' paid' : ''}" id="bill-${b.id}">
      <button class="bill-check" onclick="toggleBillPaid('${b.id}')" aria-label="${b.paid ? 'Markera som obetald' : 'Markera som betald'}"></button>
      ${b.photo ? `<img class="bill-photo" src="${b.photo}" alt="Foto av räkning" onclick="viewBillPhoto('${b.id}')">` : ''}
      <div class="bill-info">
        <span class="bill-desc">${escapeHtml(b.desc)}</span>
        ${b.amount ? `<span class="bill-amount">${escapeHtml(String(b.amount))} kr</span>` : ''}
        ${b.ocr ? `<span class="bill-ocr">OCR ${escapeHtml(b.ocr)}</span>` : ''}
      </div>
      <button class="bill-delete" onclick="deleteBill('${b.id}')" aria-label="Ta bort">×</button>
    </li>`).join('');
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function viewBillPhoto(id) {
  const b = state.bills.find(b => b.id === id);
  if (!b || !b.photo) return;
  const w = window.open('', '_blank');
  if (w) w.document.write(`<title>${escapeHtml(b.desc)}</title><body style="margin:0;background:#222;display:grid;place-items:center;min-height:100vh"><img src="${b.photo}" style="max-width:100%;max-height:100vh;object-fit:contain"></body>`);
}
function showBillForm() {
  document.getElementById('bill-form').classList.remove('hidden');
  document.getElementById('bill-desc-input').focus();
}
function hideBillForm() {
  document.getElementById('bill-form').classList.add('hidden');
  document.getElementById('bill-desc-input').value = '';
  document.getElementById('bill-amount-input').value = '';
  clearBillPhoto();
}
function clearBillPhoto() {
  const form = document.getElementById('bill-form');
  if (form) delete form.dataset.photo;
  if (form) delete form.dataset.ocr;
  const prev = document.getElementById('bill-photo-preview');
  if (prev) prev.classList.add('hidden');
  const img = document.getElementById('bill-photo-preview-img');
  if (img) img.src = '';
}
// Dubblettdetektering: OCR/fakturareferens är en starkare signal än bildhash
// (samma faktura kan fotograferas i annan vinkel/ljus och få annan hash).
// Kollas en gång, här — inte mitt i skanningen — eftersom manuellt inmatade
// räkningar (utan QR) bara går att jämföra när desc/belopp/foto är klara.
function findDuplicateBill(ocr, imageHash) {
  if (ocr) {
    const byOcr = state.bills.find(b => b.ocr && b.ocr === ocr);
    if (byOcr) return { bill: byOcr, matchType: 'ocr' };
  }
  if (imageHash) {
    const byHash = state.bills.find(b => b.imageHash && b.imageHash === imageHash);
    if (byHash) return { bill: byHash, matchType: 'hash' };
  }
  return null;
}
function submitBill() {
  const desc = document.getElementById('bill-desc-input').value.trim();
  const errEl = document.getElementById('err-bills');
  if (!desc) {
    if (errEl) { errEl.textContent = 'Ange en beskrivning.'; errEl.classList.remove('hidden'); }
    document.getElementById('bill-desc-input').focus();
    return;
  }
  if (errEl) { errEl.textContent = ''; errEl.classList.add('hidden'); }
  const amount = document.getElementById('bill-amount-input').value.trim();
  const form = document.getElementById('bill-form');
  const photo = (form && form.dataset.photo) || '';
  const ocr = (form && form.dataset.ocr) || '';
  const imageHash = photo ? hashImageData(photo) : '';

  const dup = findDuplicateBill(ocr, imageHash);
  if (dup) {
    const paidNote = dup.bill.paid ? ' Den är redan markerad som BETALD.' : '';
    const reason = dup.matchType === 'ocr'
      ? `samma OCR-/fakturanummer (${ocr}) som "${dup.bill.desc}"`
      : `samma foto som "${dup.bill.desc}"`;
    const proceed = window.confirm(
      `Det här ser ut som ${reason}, som redan finns bland dina räkningar.${paidNote} Lägga till den ändå?`
    );
    if (!proceed) return; // formuläret lämnas öppet — ingen spärr, bara en paus
  }

  state.bills.push({ id: Date.now().toString(), desc, amount: amount || '', paid: false, photo, ocr, imageHash });
  saveBills();
  renderBills();
  hideBillForm();
  track('bill_added');
}
function toggleBillPaid(id) {
  const b = state.bills.find(b => b.id === id);
  if (b) { b.paid = !b.paid; saveBills(); renderBills(); }
}
function deleteBill(id) {
  state.bills = state.bills.filter(b => b.id !== id);
  saveBills();
  renderBills();
}

// ─── BILL SCANNING ──────────────────────────
function setBillScanStatus(msg, isError) {
  const el = document.getElementById('bill-scan-status');
  if (!el) return;
  if (!msg) { el.classList.add('hidden'); el.textContent = ''; return; }
  el.classList.remove('hidden');
  el.textContent = msg;
  el.classList.toggle('bill-scan-status--error', !!isError);
}
function loadJsQR() {
  if (window.jsQR) return Promise.resolve(window.jsQR);
  if (window.__jsQRLoading) return window.__jsQRLoading;
  window.__jsQRLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
    s.async = true;
    s.onload = () => resolve(window.jsQR);
    s.onerror = () => reject(new Error('Kunde inte ladda QR-läsare'));
    document.head.appendChild(s);
  });
  return window.__jsQRLoading;
}
function compressBillImage(dataUrl, maxW, quality) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxW / img.width, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Kunde inte läsa bilden'));
    img.src = dataUrl;
  });
}
function decodeBillQR(dataUrl) {
  return new Promise(async (resolve) => {
    let jsQR;
    try { jsQR = await loadJsQR(); } catch(e) { return resolve(null); }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      let data;
      try { data = ctx.getImageData(0, 0, img.width, img.height); }
      catch(e) { return resolve(null); }
      const code = jsQR(data.data, data.width, data.height);
      if (!code || !code.data) return resolve(null);
      try {
        const obj = JSON.parse(code.data);
        if (obj && (obj.uqr || obj.iref || obj.due)) return resolve(obj);
      } catch(e) {}
      resolve({ raw: code.data });
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}
async function handleBillScan(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;
  setBillScanStatus('Läser räkning…');
  try {
    const reader = new FileReader();
    const rawDataUrl = await new Promise((resolve, reject) => {
      reader.onload = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Kunde inte läsa filen'));
      reader.readAsDataURL(file);
    });
    const compressed = await compressBillImage(rawDataUrl, 1280, 0.7);
    const qr = await decodeBillQR(rawDataUrl);
    showBillForm();
    const form = document.getElementById('bill-form');
    if (form) form.dataset.photo = compressed;
    const prev = document.getElementById('bill-photo-preview');
    const prevImg = document.getElementById('bill-photo-preview-img');
    if (prev && prevImg) { prevImg.src = compressed; prev.classList.remove('hidden'); }
    if (qr && (qr.iref || qr.nme || qr.due)) {
      const desc = qr.nme || 'Räkning';
      document.getElementById('bill-desc-input').value = desc;
      if (qr.due) document.getElementById('bill-amount-input').value = String(qr.due);
      if (qr.iref && form) form.dataset.ocr = String(qr.iref);
      setBillScanStatus('Hittade fakturadata — kontrollera och spara.');
      track('bill_scanned_qr');
      setTimeout(() => setBillScanStatus(''), 5000);
    } else {
      // Ingen QR — samma AI-assist som Arkiv redan använder (categorize-document)
      // föreslår avsändare/namn utifrån fotot. Ren assist: misslyckas anropet
      // (nätverk, saknad nyckel, rate-limit) faller vi bara tillbaka till manuell
      // ifyllning, precis som i Arkiv. Aldrig en spärr.
      setBillScanStatus('Föreslår avsändare…');
      const ai = await categorizeDocumentAI(compressed);
      if (ai?.name) {
        document.getElementById('bill-desc-input').value = ai.name;
        setBillScanStatus('Foto sparat — avsändare föreslagen. Kontrollera och spara.');
        track('bill_scanned_categorized_ai');
      } else {
        setBillScanStatus('Foto sparat. Skriv beskrivning manuellt.');
        track('bill_scanned_photo_only');
      }
      setTimeout(() => setBillScanStatus(''), 5000);
    }
  } catch (err) {
    console.error('Bill scan error', err);
    setBillScanStatus('Det gick inte att läsa bilden. Försök igen.', true);
    setTimeout(() => setBillScanStatus(''), 5000);
  }
}

// ─── ARKIV / DOKUMENTCENTRAL (T143–T148) ─────
let documentFilter = 'alla';
let expandedDocId = null; // id of the document whose "Förklara"-panel is open, if any
const FLAG_LABELS = { viktig: 'Viktig', mellan: 'Kanske', onodig: 'Onödig' };

function loadDocuments() {
  try { state.documents = JSON.parse(localStorage.getItem('efterplan_documents')) || []; } catch(e) { state.documents = []; }
}
function saveDocuments() {
  try { localStorage.setItem('efterplan_documents', JSON.stringify(state.documents)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
}

function setDocumentFilter(filter) {
  documentFilter = filter;
  document.querySelectorAll('.arkiv-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  renderDocuments();
}

function renderDocuments() {
  const list = document.getElementById('arkiv-list');
  const empty = document.getElementById('arkiv-empty');
  if (!list) return;
  const docs = documentFilter === 'alla'
    ? state.documents
    : state.documents.filter(d => d.flag === documentFilter);

  if (docs.length === 0) {
    list.innerHTML = '';
    if (empty) {
      empty.classList.remove('hidden');
      empty.textContent = state.documents.length === 0
        ? 'Inga dokument tillagda än — fota det första papperet som dyker upp.'
        : 'Inga dokument med den här flaggan.';
    }
    return;
  }
  empty && empty.classList.add('hidden');

  // Dubblettdetektering: dokument som delar samma bild-hash flaggas visuellt,
  // oavsett i vilken ordning de lades till eller togs bort (räknas om varje render).
  const hashCounts = {};
  state.documents.forEach(d => { if (d.imageHash) hashCounts[d.imageHash] = (hashCounts[d.imageHash] || 0) + 1; });

  list.innerHTML = docs.map(d => {
    const isDup = !!(d.imageHash && hashCounts[d.imageHash] > 1);
    const isExplainOpen = expandedDocId === d.id;
    return `
    <li class="arkiv-item${isDup ? ' arkiv-item--dup' : ''}" id="arkiv-${d.id}">
      ${d.photo ? `<img class="arkiv-thumb" src="${d.photo}" alt="Foto av dokument" onclick="viewDocumentPhoto('${d.id}')">` : ''}
      <div class="arkiv-info">
        <div class="arkiv-badge-row">
          <span class="arkiv-category-badge">${escapeHtml(d.category)}</span>
          ${isDup ? `<span class="arkiv-dup-badge" title="Ser ut som samma foto som ett annat dokument i arkivet">⚠ Möjlig dubblett</span>` : ''}
          <span class="arkiv-meta">${escapeHtml(d.date)}</span>
        </div>
        <input class="arkiv-name" value="${escapeHtml(d.name)}" aria-label="Dokumentnamn"
               onchange="renameDocument('${d.id}', this.value)">
        <div class="arkiv-flags">
          ${['viktig','mellan','onodig'].map(f => `
            <button class="arkiv-flag-btn${d.flag === f ? ' active' : ''}" data-flag="${f}"
                    onclick="setDocumentFlag('${d.id}', '${f}')">${FLAG_LABELS[f]}</button>
          `).join('')}
        </div>
        <div class="arkiv-explain-row">
          <button class="arkiv-explain-btn" type="button"
                  aria-expanded="${isExplainOpen ? 'true' : 'false'}" aria-controls="arkiv-explain-${d.id}"
                  onclick="toggleDocumentExplanation('${d.id}')">
            ${isExplainOpen ? 'Dölj förklaring' : '✨ Förklara detta dokument'}
          </button>
        </div>
        <div class="arkiv-explain${isExplainOpen ? '' : ' hidden'}" id="arkiv-explain-${d.id}">${
          isExplainOpen ? escapeHtml(d.explanation || 'Tar fram en förklaring…') : ''
        }</div>
      </div>
      <button class="arkiv-delete" onclick="deleteDocument('${d.id}')" aria-label="Ta bort dokument">×</button>
    </li>`;
  }).join('');
}

// Enkel, deterministisk hash av bildinnehållet — för att upptäcka att exakt
// samma foto laddas upp igen. Inte kryptografiskt säker, behöver inte vara det.
function hashImageData(dataUrl) {
  let hash = 0;
  for (let i = 0; i < dataUrl.length; i++) {
    hash = (hash * 31 + dataUrl.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}

function viewDocumentPhoto(id) {
  const d = state.documents.find(d => d.id === id);
  if (!d || !d.photo) return;
  const w = window.open('', '_blank');
  if (w) w.document.write(`<title>${escapeHtml(d.name)}</title><body style="margin:0;background:#222;display:grid;place-items:center;min-height:100vh"><img src="${d.photo}" style="max-width:100%;max-height:100vh;object-fit:contain"></body>`);
}

function renameDocument(id, value) {
  const d = state.documents.find(d => d.id === id);
  if (!d) return;
  d.name = value.trim() || d.name;
  saveDocuments();
}

function setDocumentFlag(id, flag) {
  const d = state.documents.find(d => d.id === id);
  if (!d) return;
  d.flag = d.flag === flag ? null : flag; // klicka igen på samma flagga för att avmarkera
  saveDocuments();
  renderDocuments();
  track('document_flag_set', { flag: d.flag || 'none' });
}

function deleteDocument(id) {
  state.documents = state.documents.filter(d => d.id !== id);
  saveDocuments();
  renderDocuments();
  track('document_deleted');
}

async function toggleDocumentExplanation(id) {
  const d = state.documents.find(x => x.id === id);
  if (!d) return;

  if (expandedDocId === id) {
    expandedDocId = null;
    renderDocuments();
    return;
  }

  expandedDocId = id;
  renderDocuments(); // öppnar panelen direkt — visar cachat svar eller en väntetext
  track('document_explain_opened');

  if (d.explanation) return; // redan hämtat — inget nytt anrop
  if (!d.photo) return; // säkerhet: inget foto att skicka (borde inte kunna hända)

  const explanation = await explainDocumentAI(d.photo);
  if (expandedDocId !== id) return; // användaren stängde/öppnade en annan panel innan svaret kom

  const panel = document.getElementById(`arkiv-explain-${id}`);
  if (!explanation) {
    if (panel) panel.textContent = '';
    setDocumentScanStatus('Kunde inte ta fram en förklaring just nu. Försök gärna igen om en stund.', true);
    setTimeout(() => setDocumentScanStatus(''), 5000);
    expandedDocId = null;
    renderDocuments();
    return;
  }

  d.explanation = explanation;
  saveDocuments();
  if (panel) panel.textContent = explanation; // textContent, aldrig innerHTML, för AI-text
  track('document_explained_ai');
}

function setDocumentScanStatus(msg, isError) {
  const el = document.getElementById('doc-scan-status');
  if (!el) return;
  if (!msg) { el.classList.add('hidden'); el.textContent = ''; return; }
  el.classList.remove('hidden');
  el.textContent = msg;
  el.classList.toggle('arkiv-scan-status--error', !!isError);
}

// Ren assist — misslyckas anropet (nätverk, saknad ANTHROPIC_API_KEY, m.m.)
// faller vi tillbaka till manuell kategorisering. Aldrig en spärr.
async function categorizeDocumentAI(dataUrl) {
  try {
    const r = await fetch('/api/categorize-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl }),
    });
    if (!r.ok) return null;
    const data = await r.json();
    if (!data || !data.ok) return null;
    return { category: data.category, name: data.name };
  } catch (e) {
    return null;
  }
}

// Ren assist — misslyckas anropet (nätverk, saknad ANTHROPIC_API_KEY, rate-limit,
// m.m.) visar vi bara ett kort felmeddelande. Aldrig en spärr för att se eller
// hantera dokumentet i övrigt.
async function explainDocumentAI(dataUrl) {
  try {
    const r = await fetch('/api/explain-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl }),
    });
    if (!r.ok) return null;
    const data = await r.json();
    if (!data || !data.ok || typeof data.explanation !== 'string') return null;
    return data.explanation;
  } catch (e) {
    return null;
  }
}

async function handleDocumentScan(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;
  setDocumentScanStatus('Läser dokument…');
  try {
    const reader = new FileReader();
    const rawDataUrl = await new Promise((resolve, reject) => {
      reader.onload = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Kunde inte läsa filen'));
      reader.readAsDataURL(file);
    });
    const compressed = await compressBillImage(rawDataUrl, 1280, 0.7);
    const imageHash = hashImageData(compressed);

    const existingDup = state.documents.find(d => d.imageHash === imageHash);
    if (existingDup) {
      const proceed = window.confirm(
        `Det här ser ut som samma foto som "${existingDup.name}" som redan finns i arkivet. Lägga till det ändå?`
      );
      if (!proceed) {
        setDocumentScanStatus('Hoppade över — fanns redan i arkivet.');
        setTimeout(() => setDocumentScanStatus(''), 3000);
        return;
      }
    }

    setDocumentScanStatus('Föreslår kategori…');
    const ai = await categorizeDocumentAI(compressed);

    const doc = {
      id: Date.now().toString(),
      name: ai?.name || `Dokument ${formatDate(new Date())}`,
      category: ai?.category || 'Övrigt',
      date: formatDate(new Date()),
      flag: null,
      photo: compressed,
      imageHash,
    };
    state.documents.push(doc);
    saveDocuments();
    renderDocuments();
    track(ai ? 'document_categorized_ai' : 'document_added_manual', { category: doc.category });
    setDocumentScanStatus(ai ? 'Dokument tillagt — kategori föreslagen.' : 'Dokument tillagt. Byt namn/kategori manuellt ovan om du vill.');
    setTimeout(() => setDocumentScanStatus(''), 4000);
  } catch (err) {
    console.error('Document scan error', err);
    setDocumentScanStatus('Det gick inte att läsa bilden. Försök igen.', true);
    setTimeout(() => setDocumentScanStatus(''), 5000);
  }
}

function markTaskStarted(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task || task.done || task.started) return;
  task.started = true;
  saveTaskState();

  const card  = document.getElementById(`task-card-${taskId}`);
  const check = document.getElementById(`check-${taskId}`);
  if (card)  card.classList.add('started');
  if (check) check.classList.add('started');

  // Update the time row badge without full re-render
  const timeEl = card?.querySelector('.task-time');
  if (timeEl && !timeEl.querySelector('.task-started-badge')) {
    const badge = document.createElement('span');
    badge.className = 'task-started-badge';
    badge.textContent = 'Påbörjad';
    timeEl.appendChild(badge);
  }

  // Swap start button → only "Markera som klar" remains
  const actionsEl = document.querySelector(`#expand-${taskId} .task-expand-actions`);
  if (actionsEl) {
    const docBtn = actionsEl.querySelector('.task-expand-doc');
    actionsEl.innerHTML = `<button class="task-expand-btn" onclick="event.stopPropagation();markTaskDone('${taskId}')">Markera som klar</button>`;
    if (docBtn) actionsEl.appendChild(docBtn);
  }
}

function markTaskDone(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.done = true;
  saveTaskState();
  track('task_completed', { task: taskId, urgency: task.urgency || 'unknown' });

  const card  = document.getElementById(`task-card-${taskId}`);
  const check = document.getElementById(`check-${taskId}`);
  const expnd = document.getElementById(`expand-${taskId}`);
  const chev  = document.getElementById(`chevron-${taskId}`);
  if (card)  card.classList.add('done');
  if (check) check.classList.add('checked');
  if (expnd) expnd.classList.add('hidden');
  if (chev)  chev.classList.remove('open');
  if (expandedTaskId === taskId) expandedTaskId = null;

  updateProgress();
  showUndoToast(taskId);

  // Scroll to the next uncompleted task AFTER the one just finished — not the first
  // uncompleted task overall. Annars kan man t.ex. klara av uppgift 15 och bli
  // skickad hela vägen upp till uppgift 2, vilket känns som att sidan hoppar till toppen.
  const idx  = state.tasks.findIndex(t => t.id === taskId);
  const next = state.tasks.slice(idx + 1).find(t => !t.done);
  if (next) {
    setTimeout(() => {
      const el = document.getElementById(`task-card-${next.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  }
}


// ─── DELAD LOCALSTORAGE-LIST-KOMPONENT ────────
// Tidigare fanns tre nästan identiska implementationer av "spara/hämta/lägg till/ta
// bort rader i en localStorage-lista" (underrätta-listan, dokumentplats-listan, och den
// generiska _getLSList den ena byggde på). Konsoliderat till en delad fabrik här —
// nya "hjälp mig komma ihåg X"-listor kan återanvända mönstret utan att skrivas om.
function _getLSList(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { return []; }
}
function _saveLSList(key, list) {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
}
function _genListId() {
  return Math.random().toString(36).slice(2, 10);
}

function createLSList(storageKey, makeItem) {
  const get = () => _getLSList(storageKey);
  const save = (list) => _saveLSList(storageKey, list);
  return {
    get,
    add(extra) {
      const list = get();
      list.push({ id: _genListId(), ...makeItem(extra) });
      save(list);
      return list;
    },
    remove(id) {
      const list = get().filter(item => item.id !== id);
      save(list);
      return list;
    },
    setField(id, field, value) {
      const list = get();
      const row = list.find(r => r.id === id);
      if (row) { row[field] = value; save(list); }
      return list;
    },
    toggleField(id, field) {
      const list = get();
      const row = list.find(r => r.id === id);
      if (row) { row[field] = !row[field]; save(list); }
      return list;
    },
  };
}

// ─── NOTIFY LIST ──────────────────────────────
const _notifyList = createLSList('efterplan_notify_list', (name) => ({ name, notified: false, notifier: '' }));

function addNotifyPerson() {
  const input = document.getElementById('notify-new-input');
  const name = input?.value.trim();
  if (!name) return;
  _notifyList.add(name);
  input.value = '';
  _refreshNotifyList();
}

function toggleNotified(personId) {
  _notifyList.toggleField(personId, 'notified');
  _refreshNotifyList();
}

function removeNotifyPerson(personId) {
  _notifyList.remove(personId);
  _refreshNotifyList();
}

function setNotifyNotifier(personId, notifier) {
  _notifyList.setField(personId, 'notifier', notifier);
}

function _refreshNotifyList() {
  const container = document.getElementById('notify-list-container');
  if (!container) return;
  container.innerHTML = _buildNotifyListInner();
  const list = _notifyList.get();
  const done = list.filter(p => p.notified).length;
  const el = document.getElementById('notify-counter');
  if (el) el.textContent = list.length ? `${done} av ${list.length} meddelade` : '';
}

function _buildNotifyListInner() {
  const list = _notifyList.get();
  if (!list.length) return '<p class="notify-empty">Inga tillagda än</p>';
  return list.map(p => {
    const safeId = p.id;
    return `
      <div class="notify-person${p.notified ? ' notified' : ''}">
        <button class="notify-check${p.notified ? ' checked' : ''}"
          onclick="event.stopPropagation();toggleNotified('${safeId}')"
          aria-label="Markera ${p.name} som meddelad">${p.notified ? '✓' : ''}</button>
        <span class="notify-name">${p.name}</span>
        <button class="notify-remove"
          onclick="event.stopPropagation();removeNotifyPerson('${safeId}')"
          aria-label="Ta bort ${p.name}">×</button>
      </div>`;
  }).join('');
}

function renderNotifyList() {
  const list = _notifyList.get();
  const done = list.filter(p => p.notified).length;
  const counterText = list.length ? `${done} av ${list.length} meddelade` : '';
  return `<div class="notify-list-section">
    <div class="notify-list-header">
      <span class="notify-list-label">Att underrätta</span>
      <span class="notify-counter" id="notify-counter">${counterText}</span>
    </div>
    <div class="notify-list-items" id="notify-list-container">
      ${_buildNotifyListInner()}
    </div>
    <div class="notify-add-row">
      <input class="notify-new-input" id="notify-new-input" type="text"
        placeholder="Lägg till person…"
        onclick="event.stopPropagation()"
        onkeydown="if(event.key==='Enter'){event.stopPropagation();addNotifyPerson();}" />
      <button class="notify-add-btn" onclick="event.stopPropagation();addNotifyPerson()">Lägg till</button>
    </div>
  </div>`;
}

// ─── DOCUMENT LOCATION LIST (viktiga dokument) ─
const _docLocationList = createLSList('efterplan_document_locations', () => ({ doc: '', plats: '' }));

function addDocLocation() {
  _docLocationList.add();
  _refreshDocLocationList();
  const inputs = document.querySelectorAll('#doc-location-list-container .doc-location-input-doc');
  if (inputs.length) inputs[inputs.length - 1].focus();
}

function setDocLocationField(id, field, value) {
  _docLocationList.setField(id, field, value);
}

function removeDocLocation(id) {
  _docLocationList.remove(id);
  _refreshDocLocationList();
}

function _refreshDocLocationList() {
  const container = document.getElementById('doc-location-list-container');
  if (!container) return;
  container.innerHTML = _buildDocLocationListInner();
}

function _buildDocLocationListInner() {
  const list = _docLocationList.get();
  if (!list.length) return '<p class="notify-empty">Inga tillagda än</p>';
  return list.map(r => `
    <div class="doc-location-row">
      <input class="bill-input doc-location-input-doc" type="text" placeholder="Dokument (t.ex. Testamente)" value="${_esc(r.doc)}"
        onclick="event.stopPropagation()" oninput="setDocLocationField('${r.id}','doc',this.value)">
      <input class="bill-input doc-location-input-plats" type="text" placeholder="Var det finns (t.ex. Bankfack Swedbank)" value="${_esc(r.plats)}"
        onclick="event.stopPropagation()" oninput="setDocLocationField('${r.id}','plats',this.value)">
      <button class="notify-remove" onclick="event.stopPropagation();removeDocLocation('${r.id}')" aria-label="Ta bort rad">×</button>
    </div>`).join('');
}

function renderDocumentLocationList() {
  return `<div class="notify-list-section">
    <div class="notify-list-header">
      <span class="notify-list-label">Dokument och var de finns</span>
    </div>
    <div class="doc-location-list-items" id="doc-location-list-container">
      ${_buildDocLocationListInner()}
    </div>
    <div class="notify-add-row">
      <button class="notify-add-btn" onclick="event.stopPropagation();addDocLocation()">+ Lägg till rad</button>
    </div>
  </div>`;
}

// ─── UNDO TOAST ───────────────────────────────
let _undoTaskId  = null;
let _undoTimer   = null;

function showUndoToast(taskId) {
  _undoTaskId = taskId;
  clearTimeout(_undoTimer);
  const toast = document.getElementById('undo-toast');
  toast.classList.remove('hidden');
  _undoTimer = setTimeout(() => {
    toast.classList.add('hidden');
    _undoTaskId = null;
  }, 4000);
}

function undoTaskDone() {
  if (!_undoTaskId) return;
  clearTimeout(_undoTimer);
  document.getElementById('undo-toast').classList.add('hidden');

  const taskId = _undoTaskId;
  _undoTaskId = null;

  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.done    = false;
  task.started = false;
  saveTaskState();
  renderPlan();
}

function undoTaskDoneManual(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.done    = false;
  task.started = false;
  saveTaskState();
  renderPlan();
}

// ─── MODALS ───────────────────────────────────
let _modalPrevFocus = null;
let _completionPrevFocus = null;
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openModal(id) {
  _modalPrevFocus = document.activeElement;
  const overlay = document.getElementById(id);
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  // Focus first focusable element inside
  const first = overlay.querySelector(FOCUSABLE);
  if (first) setTimeout(() => first.focus(), 50);
  // Focus trap
  overlay.addEventListener('keydown', _trapFocus);
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  overlay.classList.add('hidden');
  overlay.removeEventListener('keydown', _trapFocus);
  document.body.style.overflow = '';
  if (_modalPrevFocus) { _modalPrevFocus.focus(); _modalPrevFocus = null; }
}

function closeModalIfOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}

function _trapFocus(e) {
  if (e.key !== 'Tab') {
    if (e.key === 'Escape') closeModal(e.currentTarget.id);
    return;
  }
  const focusable = [...e.currentTarget.querySelectorAll(FOCUSABLE)].filter(el => !el.disabled);
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function _coEscHandler(e) {
  if (e.key === 'Escape') closeCompletionOverlay();
}

// ─── TABS ────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.plan-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.plan-tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  document.getElementById(`tabcontent-${name}`).classList.add('active');
  window.scrollTo(0, 0);
}

// ─── SENDER INFO PERSISTENCE ─────────────────
function saveSenderInfo(name, email) {
  try {
    if (name)  localStorage.setItem('efterplan_sender_name',  name);
    if (email) localStorage.setItem('efterplan_sender_email', email);
  } catch(e) {}
}
function getSenderInfo() {
  return {
    name:    localStorage.getItem('efterplan_sender_name')    || '',
    email:   localStorage.getItem('efterplan_sender_email')   || '',
    address: localStorage.getItem('efterplan_sender_address') || '',
    zip:     localStorage.getItem('efterplan_sender_zip')     || '',
    city:    localStorage.getItem('efterplan_sender_city')    || '',
  };
}
function saveSenderAddress(address, zip, city) {
  try {
    if (address) localStorage.setItem('efterplan_sender_address', address);
    if (zip)     localStorage.setItem('efterplan_sender_zip', zip);
    if (city)    localStorage.setItem('efterplan_sender_city', city);
  } catch(e) {}
}
function saveSenderAddressFields() {
  const a = document.getElementById('doc-sender-address');
  const z = document.getElementById('doc-sender-zip');
  const c = document.getElementById('doc-sender-city');
  saveSenderAddress((a && a.value.trim()) || '', (z && z.value.trim()) || '', (c && c.value.trim()) || '');
}
function initSenderAddressFields() {
  const s = getSenderInfo();
  const a = document.getElementById('doc-sender-address');
  const z = document.getElementById('doc-sender-zip');
  const c = document.getElementById('doc-sender-city');
  if (a && s.address) a.value = s.address;
  if (z && s.zip)     z.value = s.zip;
  if (c && s.city)    c.value = s.city;
}
// Postnummer → stad, helt klientsidan mot ett bundlat dataset (data/postnummer-se.json,
// källa GeoNames.org, CC BY 4.0) — inget postnummer skickas till någon extern tjänst.
// Ren assist: skriver aldrig över ett fält användaren redan fyllt i själv, och
// misslyckas tyst (offline, saknad fil, okänt postnummer) utan felmeddelande.
let _postortTable = null;
async function loadPostortTable() {
  if (_postortTable) return _postortTable;
  try {
    const r = await fetch('data/postnummer-se.json');
    _postortTable = r.ok ? await r.json() : {};
  } catch(e) { _postortTable = {}; }
  return _postortTable;
}
async function lookupPostort() {
  const zipEl = document.getElementById('doc-sender-zip');
  const cityEl = document.getElementById('doc-sender-city');
  if (!zipEl) return;
  const digits = zipEl.value.replace(/\D/g, '');
  if (digits.length !== 5) return;
  const table = await loadPostortTable();
  const match = table[digits];
  if (match && cityEl && !cityEl.value) {
    cityEl.value = match;
    saveSenderAddressFields();
  }
}
// Byggs in i avsändarblocket i genererade brev, under namn/e-post. Tom sträng
// om inget adressfält är ifyllt — lägger då inte till någon extra rad alls.
function formatSenderAddressBlock() {
  const { address, zip, city } = getSenderInfo();
  const lines = [];
  if (address) lines.push(address);
  const zipCity = [zip, city].filter(Boolean).join(' ');
  if (zipCity) lines.push(zipCity);
  return lines.length ? '\n' + lines.join('\n') : '';
}
function getRelationLabel() {
  const map = { partner: 'Make/Maka', foralder: 'Barn', syskon: 'Syskon', barn: 'Förälder', annan: '' };
  return map[state.relation] || '';
}

// ─── DOCUMENT GENERATOR ──────────────────────
function getDocContext() {
  return {
    deceased: state.name     || '[NAMN PÅ AVLIDEN]',
    personnr: state.personnr || '[PERSONNUMMER]',
    today:    formatDate(new Date()),
  };
}

function showDocForm(type) {
  document.getElementById('doc-chooser').classList.add('hidden');
  document.querySelectorAll('.doc-form').forEach(f => f.classList.add('hidden'));

  const sender = getSenderInfo();
  const relation = getRelationLabel();

  if (type === 'annons') {
    const el = document.getElementById('annons-name');
    if (el && !el.value && state.name) el.value = state.name;
  }
  if (type === 'forsakring') {
    const saved = getTaskNote('forsakringar');
    const el = document.getElementById('fors-bolag');
    if (el && !el.value && saved) el.value = saved.split('\n')[0];
    const sEl = document.getElementById('fors-sender');
    if (sEl && !sEl.value && sender.name) sEl.value = sender.name;
    const eEl = document.getElementById('fors-email');
    if (eEl && !eEl.value && sender.email) eEl.value = sender.email;
    const rEl = document.getElementById('fors-relation');
    if (rEl && !rEl.value && relation) rEl.value = relation;
  }
  if (type === 'bank') {
    const saved = getTaskNote('banker');
    const el = document.getElementById('bank-name');
    if (el && !el.value && saved) el.value = saved.split('\n')[0];
    const sEl = document.getElementById('bank-sender');
    if (sEl && !sEl.value && sender.name) sEl.value = sender.name;
    const eEl = document.getElementById('bank-email');
    if (eEl && !eEl.value && sender.email) eEl.value = sender.email;
    const rEl = document.getElementById('bank-relation');
    if (rEl && !rEl.value && relation) rEl.value = relation;
  }
  if (type === 'letter') {
    const sEl = document.getElementById('letter-sender');
    if (sEl && !sEl.value && sender.name) sEl.value = sender.name;
    const eEl = document.getElementById('letter-email');
    if (eEl && !eEl.value && sender.email) eEl.value = sender.email;
  }
  if (type === 'bulk') {
    initBulkForm();
    // Prefill från både den ibockade checklistan (T199) och kvarvarande fritext för
    // "övrigt" — annars matas inte det man bockat av vidare till uppsägningsbrevet.
    const abonnemangTask = state.tasks.find(t => t.id === 'abonnemang');
    const checked = (abonnemangTask?.checklist || [])
      .filter(item => (state.taskChecklists?.abonnemang || {})[item.key])
      .map(item => item.label);
    const abNotes = getTaskNote('abonnemang');
    const fromNotes = abNotes ? abNotes.split(/[\n,]+/).map(s => s.trim()).filter(Boolean) : [];
    const services = [...checked, ...fromNotes];
    if (services.length > 0) {
      document.getElementById('bulk-rows').innerHTML = '';
      _bulkRowId = 0;
      services.forEach(svc => {
        addBulkRow();
        const rows = document.querySelectorAll('#bulk-rows .bulk-row');
        const lastRow = rows[rows.length - 1];
        const input = lastRow?.querySelector('.bulk-name');
        if (input) input.value = svc;
      });
      addBulkRow(); // one empty row at end
    }
    const sEl = document.getElementById('bulk-sender');
    if (sEl && !sEl.value && sender.name) sEl.value = sender.name;
    const eEl = document.getElementById('bulk-email');
    if (eEl && !eEl.value && sender.email) eEl.value = sender.email;
  }

  document.getElementById(`doc-form-${type}`).classList.remove('hidden');
  window.scrollTo(0, 0);
}

function backToDocChooser() {
  document.querySelectorAll('.doc-form').forEach(f => f.classList.add('hidden'));
  document.getElementById('doc-result-bulk').classList.add('hidden');
  document.getElementById('doc-chooser').classList.remove('hidden');
  window.scrollTo(0, 0);
}

// ─── BULK UPPSÄGNING ──────────────────────────
let _bulkRowId = 0;

function initBulkForm() {
  _bulkRowId = 0;
  document.getElementById('bulk-rows').innerHTML = '';
  addBulkRow();
  addBulkRow();
  addBulkRow();
}

function addBulkRow() {
  _bulkRowId++;
  const id = _bulkRowId;
  const row = document.createElement('div');
  row.className = 'bulk-row';
  row.id = `brow-${id}`;
  row.innerHTML = `
    <input type="text" class="text-input bulk-name" placeholder="Tjänst (t.ex. Spotify, Telia, Netflix…)" />
    <input type="text" class="text-input bulk-custnr" placeholder="Kundnr (valfritt)" />
    <button class="bulk-remove" onclick="removeBulkRow(${id})" aria-label="Ta bort">✕</button>`;
  document.getElementById('bulk-rows').appendChild(row);
}

function removeBulkRow(id) {
  const rows = document.querySelectorAll('.bulk-row');
  if (rows.length > 1) document.getElementById(`brow-${id}`)?.remove();
}

function generateBulkLetters() {
  const sender = document.getElementById('bulk-sender').value.trim();
  const email  = document.getElementById('bulk-email').value.trim();
  clearFormError('err-bulk');
  if (!sender || !email) { showFormError('err-bulk', 'Fyll i ditt namn och din e-post.'); return; }

  // Show loading state — lets browser repaint before synchronous work
  const genBtn = document.querySelector('#doc-form-bulk .btn-primary');
  if (genBtn) { genBtn.disabled = true; genBtn.textContent = 'Förbereder brev…'; }
  requestAnimationFrame(() => setTimeout(() => _doGenerateBulk(sender, email, genBtn), 0));
}

function _doGenerateBulk(sender, email, genBtn) {
  saveSenderInfo(sender, email);

  const services = [];
  document.querySelectorAll('.bulk-row').forEach(row => {
    const name   = row.querySelector('.bulk-name').value.trim();
    const custnr = row.querySelector('.bulk-custnr').value.trim();
    if (name) services.push({ name, custnr });
  });
  if (services.length === 0) { showFormError('err-bulk', 'Lägg till minst en tjänst med namn.'); return; }

  const { deceased, personnr, today } = getDocContext();

  const letters = services.map(({ name, custnr }) => ({
    service: name,
    text: `${sender}\n${email}${formatSenderAddressBlock()}\n\n${today}\n\nTill: ${name}\nÄrende: Avslutning av abonnemang — dödsfall${custnr ? '\nKundnummer: ' + custnr : ''}\n\nHej,\n\nJag kontaktar er angående abonnemanget som tillhörde ${deceased} (personnr ${personnr}), som tyvärr har gått bort.\n\nJag ber er härmed avsluta abonnemanget snarast möjligt och begär återbetalning för eventuell förbetald period efter avslutsdatum.\n\nJag bifogar dödsbevis och är tillgänglig för frågor via e-post.\n\nVänligen bekräfta avslut skriftligen.\n\nMed vänliga hälsningar,\n\n${sender}\n${email}`,
  }));

  const container = document.getElementById('bulk-letters-list');
  container.innerHTML = '';
  letters.forEach((letter, i) => {
    const div = document.createElement('div');
    div.className = 'bulk-letter';
    div.innerHTML = `
      <div class="bulk-letter-head">
        <span class="bulk-letter-name">${letter.service}</span>
        <button class="btn-primary btn-sm" onclick="copyBulkLetter(${i})">Kopiera</button>
      </div>
      <div class="doc-output" id="bletter-${i}">${letter.text}</div>
      <p class="copied-msg hidden" id="bcopied-${i}">Kopierat!</p>`;
    container.appendChild(div);
  });

  document.getElementById('doc-chooser').classList.add('hidden');
  document.querySelectorAll('.doc-form').forEach(f => f.classList.add('hidden'));
  document.getElementById('doc-result-bulk').classList.remove('hidden');
  if (genBtn) { genBtn.disabled = false; genBtn.textContent = 'Skapa alla brev →'; }
  track('doc_generated', { title: 'Bulk uppsägning', count: String(services.length) });
  window.scrollTo(0, 0);
}

function copyBulkLetter(i) {
  const text = document.getElementById(`bletter-${i}`).innerText;
  navigator.clipboard.writeText(text).then(() => {
    const msg = document.getElementById(`bcopied-${i}`);
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 2000);
  });
}

function generateLetter() {
  const service = document.getElementById('letter-service').value.trim();
  const custnr  = document.getElementById('letter-custnr').value.trim();
  const sender  = document.getElementById('letter-sender').value.trim();
  const email   = document.getElementById('letter-email').value.trim();
  clearFormError('err-letter');
  if (!service || !sender || !email) { showFormError('err-letter', 'Fyll i de obligatoriska fälten (märkta med *).'); return; }
  saveSenderInfo(sender, email);

  const { deceased, personnr, today } = getDocContext();
  const custnrLine = custnr ? `\nKundnummer: ${custnr}` : '';

  showDocResult('Uppsägningsbrev — ' + service, `${sender}
${email}${formatSenderAddressBlock()}

${today}

Till: ${service}
Ärende: Avslutning av abonnemang — dödsfall${custnrLine}

Hej,

Jag kontaktar er angående abonnemanget som tillhörde ${deceased} (personnr ${personnr}), som tyvärr har gått bort.

Jag ber er härmed avsluta abonnemanget snarast möjligt och begär återbetalning för eventuell förbetald period efter avslutsdatum.

Jag bifogar dödsbevis och är tillgänglig för eventuella frågor via e-post.

Vänligen bekräfta avslut skriftligen.

Med vänliga hälsningar,

${sender}
${email}`);
}

function generateBank() {
  const bank     = document.getElementById('bank-name').value.trim();
  const sender   = document.getElementById('bank-sender').value.trim();
  const relation = document.getElementById('bank-relation').value.trim();
  const email    = document.getElementById('bank-email').value.trim();
  clearFormError('err-bank');
  if (!bank || !sender || !relation || !email) { showFormError('err-bank', 'Fyll i de obligatoriska fälten (märkta med *).'); return; }
  saveSenderInfo(sender, email);

  const { deceased, personnr, today } = getDocContext();

  showDocResult('Brev till ' + bank, `${sender}
${email}${formatSenderAddressBlock()}

${today}

Till: ${bank}
Ärende: Dödsfallsnotifiering — begäran om kontospärr och tillgångsinformation

Hej,

Jag skriver till er med anledning av att ${deceased} (personnr ${personnr}) har gått bort. Jag är ${relation} och representerar dödsboet.

Jag begär härmed att:

1. Samtliga konton tillhörande ${deceased} spärras tills bouppteckning är genomförd.
2. En förteckning över befintliga konton och tillgångar skickas till mig.
3. Ni bekräftar skriftligen att ni tagit emot detta meddelande.

Dödsbevis bifogas detta brev. Ytterligare dokumentation (bouppteckning, fullmakt) skickas så snart det är tillgängligt.

För frågor, kontakta mig på angiven e-postadress.

Med vänliga hälsningar,

${sender}
${relation} till ${deceased}
${email}`);
}

function generateForsakring() {
  const bolag    = document.getElementById('fors-bolag').value.trim();
  const sender   = document.getElementById('fors-sender').value.trim();
  const relation = document.getElementById('fors-relation').value.trim();
  const email    = document.getElementById('fors-email').value.trim();
  clearFormError('err-forsakring');
  if (!bolag || !sender || !relation || !email) { showFormError('err-forsakring', 'Fyll i de obligatoriska fälten (märkta med *).'); return; }
  saveSenderInfo(sender, email);

  const { deceased, personnr, today } = getDocContext();

  showDocResult('Brev till ' + bolag, `${sender}
${email}${formatSenderAddressBlock()}

${today}

Till: ${bolag}
Ärende: Dödsfallsanmälan — begäran om utredning av försäkringar

Hej,

Jag kontaktar er för att anmäla att ${deceased} (personnr ${personnr}) har gått bort.

Jag är ${relation} och ber er:

1. Bekräfta vilka försäkringar som fanns hos er på den avlidnes namn.
2. Informera om eventuell utbetalning av livförsäkring eller begravningsförsäkring.
3. Avsluta löpande försäkringar från och med dödsdatum.

Dödsbevis bifogas. Kontakta mig för ytterligare dokumentation.

Med vänliga hälsningar,

${sender}
${relation} till ${deceased}
${email}`);
}

function generateAnnons() {
  const name      = document.getElementById('annons-name').value.trim();
  const born      = document.getElementById('annons-born').value.trim();
  const died      = document.getElementById('annons-died').value.trim();
  const survivors = document.getElementById('annons-survivors').value.trim();
  const memory    = document.getElementById('annons-memory').value.trim();
  const funeral   = document.getElementById('annons-funeral').value.trim();
  const ovrigt    = document.getElementById('annons-ovrigt').value.trim();

  clearFormError('err-annons');
  if (!name) { showFormError('err-annons', 'Ange den avlidnes namn.'); return; }

  const lifeSpan  = (born && died) ? `${born} – ${died}` : (died ? `Avled ${died}` : '');
  const memLine   = memory ? `\n${memory}\n` : '';
  const survLine  = survivors ? `\nEfterlämnas av ${survivors}.` : '';
  const funLine   = funeral ? `\nBegravning: ${funeral}.` : '\nBegravning meddelas i god tid.';
  const ovrigtLine = ovrigt ? `\n\n${ovrigt}` : '';

  showDocResult('Dödsannons — ' + name, `${name}
${lifeSpan}
${memLine}${survLine}
${funLine}

Sörjd och saknad.${ovrigtLine}`.trim());
}

function showDocResult(title, text, emailSubject) {
  track('doc_generated', { title: title.split(' — ')[0] });
  document.querySelectorAll('.doc-form').forEach(f => f.classList.add('hidden'));
  document.getElementById('doc-chooser').classList.add('hidden');
  document.getElementById('result-title').textContent = title;
  document.getElementById('doc-output-text').textContent = text;
  document.getElementById('doc-result').classList.remove('hidden');
  document.getElementById('copied-msg').classList.add('hidden');
  const mailtoBtn = document.getElementById('result-mailto');
  if (mailtoBtn) {
    const subj = encodeURIComponent(emailSubject || title);
    const body = encodeURIComponent(text);
    mailtoBtn.href = `mailto:?subject=${subj}&body=${body}`;
  }
}

function generateSkatteverket() {
  const arende   = document.getElementById('skv-arende').value;
  const sender   = document.getElementById('skv-sender').value.trim();
  const relation = document.getElementById('skv-relation').value.trim();
  const email    = document.getElementById('skv-email').value.trim();
  clearFormError('err-skatteverket');
  if (!sender || !relation || !email) { showFormError('err-skatteverket', 'Fyll i de obligatoriska fälten (märkta med *).'); return; }
  saveSenderInfo(sender, email);

  const { deceased, personnr, today } = getDocContext();

  const arendeTexts = {
    intyg:    { subject: 'Begäran om dödsfallsintyg och personbevis för dödsbo', body: `Jag kontaktar er för att begära dödsfallsintyg och personbevis avseende dödsboet efter ${deceased} (personnr ${personnr}), som gick bort nyligen.\n\nDokumenten behövs för dödsboets räkning i samband med bouppteckning och kontakt med banker och myndigheter.\n\nJag är ${relation} och dödsbodelägare. Vänligen skicka handlingarna till angiven e-postadress, eller meddela hur ansökan görs via er e-tjänst.` },
    fskatt:   { subject: 'Begäran om avslut av F-skatt — dödsfall', body: `Jag kontaktar er med anledning av att ${deceased} (personnr ${personnr}) har gått bort och att den av hen bedrivna enskilda näringsverksamheten därmed ska avslutas.\n\nJag ber er avregistrera F-skatten och eventuell mervärdesskatt (moms) med dödsdatum som slutdatum.\n\nJag är ${relation} och företräder dödsboet. Dödsbevis bifogas. Kontakta mig för ytterligare dokumentation.` },
    slutskatt: { subject: 'Begäran om information om slutlig skatt — dödsfall', body: `Jag kontaktar er angående slutlig skatt för ${deceased} (personnr ${personnr}), som har gått bort.\n\nJag ber er bekräfta om det finns kvarsstående skattefordringar eller skatteåterbäring att reglera, samt hur dödsboet ska gå till väga.\n\nJag är ${relation} och dödsbodelägare. Vänligen kontakta mig på angiven e-postadress.` },
  };

  const { subject, body } = arendeTexts[arende];

  showDocResult(`Skatteverket — ${subject}`, `${sender}\n${email}${formatSenderAddressBlock()}\n\n${today}\n\nTill: Skatteverket\nÄrende: ${subject}\n\nHej,\n\n${body}\n\nMed vänliga hälsningar,\n\n${sender}\n${relation} till ${deceased}\n${email}`, subject);
}


function generateFullmakt() {
  const grantor1 = document.getElementById('fullmakt-grantor1').value.trim();
  const grantor2 = document.getElementById('fullmakt-grantor2').value.trim();
  const agent    = document.getElementById('fullmakt-agent').value.trim();
  const relation = document.getElementById('fullmakt-relation').value.trim();
  clearFormError('err-fullmakt');
  if (!grantor1 || !agent) { showFormError('err-fullmakt', 'Fyll i de obligatoriska fälten (märkta med *).'); return; }

  const { deceased, personnr, today } = getDocContext();
  const grantors = grantor2 ? `${grantor1} och ${grantor2}` : grantor1;
  const agentLine = relation ? `${agent} (${relation})` : agent;

  showDocResult('Fullmakt — dödsbo', `FULLMAKT
Utfärdad: ${today}

Vi, undertecknade dödsbodelägare efter ${deceased} (personnr ${personnr}), ger härmed

  ${agentLine}

fullmakt att för dödsboets räkning:

• Kontakta och företräda dödsboet gentemot banker och finansinstitut
• Begära kontoinformation och genomföra betalningar ur dödsboets medel
• Teckna dödsboets namn i löpande ärenden
• Kontakta myndigheter (Skatteverket, Kronofogden m.fl.) å dödsboets vägnar
• Säga upp avtal och abonnemang tillhörande ${deceased}

Fullmakten gäller tills dödsboet är avslutat och ska uppvisas i original vid bankbesök.


______________________________    ______________________________
${grantors}
Dödsbodelägare                    Datum och ort`);
}


function printBulkLetters() {
  const letters = [];
  document.querySelectorAll('[id^="bletter-"]').forEach(el => {
    letters.push(el.innerText);
  });
  if (!letters.length) return;
  const pages = letters.map((letter, i) =>
    `<div style="page-break-after:${i < letters.length - 1 ? 'always' : 'auto'};white-space:pre-wrap;font-family:Georgia,serif;font-size:11pt;line-height:1.8;padding:40px 50px;">${letter}</div>`
  ).join('');
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><title>Brev — dödsbo</title></head><body>${pages}</body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

function copyDocument() {
  const text = document.getElementById('doc-output-text').textContent;
  copyToClipboard(text, () => {
    const msg = document.getElementById('copied-msg');
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 2500);
  });
}

// ─── STATE SNAPSHOT (for localStorage) ───────
function getShareableState() {
  return {
    relation:   state.relation,
    testamente: state.testamente,
    fastighet:  state.fastighet,
    foretag:    state.foretag,
    skulder:    state.skulder,
    utland:     state.utland,
    minderarig: state.minderarig,
    fordon:     state.fordon,
    husdjur:    state.husdjur,
    hyresratt:  state.hyresratt,
    vardepapper: state.vardepapper,
    barn:       state.barn,
    giftSambo:  state.giftSambo,
    litetDodsbo: state.litetDodsbo,
    bostadTyp:  state.bostadTyp,
    maklare:    state.maklare,
    name:       state.name,
    deathDate:  state.deathDate,
    bouppRegDatum: state.bouppRegDatum,
    // personnr intentionally excluded (privacy)
  };
}

function toggleMemoryPhrase(btn) {
  btn.classList.toggle('selected');
  const selected = [...document.querySelectorAll('#memory-chips .phrase-chip.selected')]
    .map(b => b.textContent).join('. ');
  const ta = document.getElementById('annons-memory');
  if (ta && !ta.dataset.manual) ta.value = selected ? selected + '.' : '';
}


// ─── FORM VALIDATION ─────────────────────────
function showFormError(errId, msg) {
  const el = document.getElementById(errId);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function clearFormError(errId) {
  const el = document.getElementById(errId);
  if (el) el.classList.add('hidden');
}

// Icke-blockerande toast — ersätter alert() för meddelanden som inte hör till ett
// specifikt formulärfält (t.ex. betalningsstatus). Samma mönster som showFormError,
// fast utan fast plats i DOM:en.
let _appToastTimer = null;
function showToast(msg, type) {
  const toast = document.getElementById('app-toast');
  const msgEl = document.getElementById('app-toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.remove('hidden', 'is-error', 'is-success');
  if (type) toast.classList.add(type === 'error' ? 'is-error' : 'is-success');
  clearTimeout(_appToastTimer);
  _appToastTimer = setTimeout(() => toast.classList.add('hidden'), 5000);
}

// ─── UTILS ────────────────────────────────────
function formatDate(date) {
  return date.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' });
}

function copyToClipboard(text, onDone) {
  navigator.clipboard.writeText(text).then(onDone).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    onDone();
  });
}

// ─── PERSIST ─────────────────────────────────
function saveState() {
  const toSave = { ...getShareableState(), personnr: state.personnr };
  try { localStorage.setItem('efterplan_state', JSON.stringify(toSave)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
}

// ─── INIT ─────────────────────────────────────
// ─── OFFLINE DETECTION ───────────────────────
(function initOfflineBanner() {
  const banner = document.getElementById('offline-banner');
  if (!banner) return;
  const show = () => banner.classList.add('is-offline');
  const hide = () => banner.classList.remove('is-offline');
  window.addEventListener('offline', show);
  window.addEventListener('online',  hide);
  if (!navigator.onLine) show();
})();

// ─── COMPLETION OVERLAY ──────────────────────
function showCompletionOverlay() {
  const overlay = document.getElementById('completion-overlay');
  if (!overlay || overlay.dataset.shown === '1') return;
  overlay.dataset.shown = '1';
  _completionPrevFocus = document.activeElement;
  const nameEl = document.getElementById('co-name');
  if (nameEl && state.name) {
    nameEl.textContent = 'Du har tagit dig igenom allt för ' + state.name + '.';
  }
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  const first = overlay.querySelector(FOCUSABLE);
  if (first) setTimeout(() => first.focus(), 50);
  overlay.addEventListener('keydown', _coEscHandler);
  track('plan_completed');
}

function closeCompletionOverlay() {
  const overlay = document.getElementById('completion-overlay');
  if (!overlay) return;
  overlay.classList.add('hidden');
  overlay.removeEventListener('keydown', _coEscHandler);
  document.body.style.overflow = '';
  if (_completionPrevFocus) { _completionPrevFocus.focus(); _completionPrevFocus = null; }
}

// ─── PDF / PRINT ─────────────────────────────
function printPlan() {
  track('plan_printed');
  window.print();
}

// ─── T177: DELA LÄSBAR LÄNK (zero-knowledge) ──
function openShareModal() {
  document.getElementById('share-modal-status').textContent = '';
  document.getElementById('share-modal-body').innerHTML =
    `<button type="button" class="btn-primary" style="width:100%;" onclick="generateShareLink()">Skapa länk</button>`;
  document.getElementById('share-modal').classList.remove('hidden');
}

async function generateShareLink() {
  const statusEl = document.getElementById('share-modal-status');
  statusEl.textContent = 'Skapar länk…';
  try {
    if (!window.efterplanAuth || !window.efterplanAuth.isConfigured()) {
      statusEl.textContent = 'Delning är inte tillgänglig just nu.';
      return;
    }
    // Bara det som behövs för en läsbar checklista — aldrig personnummer.
    const shareData = {
      name: state.name || '',
      tasks: (state.tasks || []).map(t => ({
        title: t.title, urgency: t.urgency, done: !!t.done,
      })),
    };
    const url = await window.efterplanAuth.createSharedLink(shareData);
    track('shared_plan_created');
    document.getElementById('share-modal-body').innerHTML = `
      <input type="text" readonly value="${url}" id="share-link-input"
        style="width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:10px;font-size:0.85rem;margin-bottom:10px;"
        onclick="this.select()" />
      <button type="button" class="btn-ghost btn-sm" style="width:100%;" onclick="navigator.clipboard.writeText(document.getElementById('share-link-input').value); this.textContent='Kopierad ✓'">Kopiera länk</button>`;
    statusEl.textContent = 'Klart. Länken innehåller nyckeln — dela den bara med den du litar på.';
  } catch (err) {
    console.error('[share]', err);
    statusEl.textContent = 'Kunde inte skapa länken. Försök igen om en stund.';
  }
}

// Visar en läsbar, icke-interaktiv kopia när ?shared=<id>#k=<nyckel> öppnas.
async function tryRenderSharedView() {
  const params = new URLSearchParams(window.location.search);
  const sharedId = params.get('shared');
  if (!sharedId) return false;
  const hash = window.location.hash || '';
  const keyMatch = hash.match(/[#&]k=([^&]+)/);
  const key = keyMatch ? keyMatch[1] : null;

  showScreen('shared-view');
  const titleEl = document.getElementById('shared-view-title');
  const listEl = document.getElementById('shared-view-tasks');

  if (!key || !window.efterplanAuth || !window.efterplanAuth.isConfigured()) {
    listEl.innerHTML = '<p class="modal-sub">Länken saknar nyckeln som krävs för att låsa upp innehållet.</p>';
    return true;
  }
  try {
    const data = await window.efterplanAuth.resolveSharedLink(sharedId, key);
    titleEl.textContent = data.name ? `${data.name}s plan` : 'Delad plan';
    const groups = { today: [], week: [], later: [] };
    (data.tasks || []).forEach(t => { (groups[t.urgency] || groups.later).push(t); });
    const labels = { today: 'Gör idag', week: 'Denna vecka', later: 'Senare' };
    listEl.innerHTML = Object.keys(labels).map(key => {
      const items = groups[key];
      if (!items.length) return '';
      return `<h2 class="plan-title" style="font-size:1.1rem;margin-top:20px">${labels[key]}</h2>
        <ul style="list-style:none;padding:0;margin:0;">
          ${items.map(t => `<li style="padding:8px 0;border-bottom:1px solid var(--border);">
            <span style="${t.done ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">${t.done ? '✓ ' : ''}${t.title}</span>
          </li>`).join('')}
        </ul>`;
    }).join('');
    track('shared_plan_opened');
  } catch (err) {
    console.error('[shared-view]', err);
    listEl.innerHTML = '<p class="modal-sub">Länken är ogiltig eller har tagits bort.</p>';
  }
  return true;
}

// ─── PAYWALL ─────────────────────────────────
(function initPaywall() {
  applyPremiumState();
  handlePremiumReturn();
  // Re-check entitlement when auth state changes (logged-in users get
  // their premium auto-restored across devices).
  window.addEventListener('efterplan:auth-changed', () => { checkPremiumServerSide(); });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { checkPremiumServerSide(); });
  } else {
    checkPremiumServerSide();
  }
})();

async function handlePaywallCTA() {
  track('paywall_cta_clicked');
  if (isPremium()) return;
  let email = '';
  let userId = '';
  try {
    if (window.efterplanAuth && typeof window.efterplanAuth.getCurrentUser === 'function') {
      const u = await window.efterplanAuth.getCurrentUser();
      if (u) { userId = u.id || ''; email = u.email || ''; }
    }
  } catch (_) { /* anonymous flow is fine */ }
  if (!email) email = localStorage.getItem(PREMIUM_EMAIL_KEY) || '';

  try {
    const r = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, userId }),
    });
    const data = await r.json();
    if (!r.ok || !data || !data.url) {
      showToast('Kunde inte starta betalningen. Försök igen om en stund.', 'error');
      return;
    }
    if (email) localStorage.setItem(PREMIUM_EMAIL_KEY, email);
    window.location.href = data.url;
  } catch (err) {
    showToast('Något gick fel mot betaltjänsten. Kontrollera din anslutning och försök igen.', 'error');
  }
}

// ─── INIT ─────────────────────────────────────
(async function init() {
  // T177: en delad länk (?shared=...#k=...) vinner alltid över lokalt sparad state.
  if (await tryRenderSharedView()) return;

  initSenderAddressFields(); // oberoende av vilken gren nedan som körs — bara localStorage-återställning
  // Restore own plan from localStorage
  try {
    const saved = localStorage.getItem('efterplan_state');
    if (saved) {
      Object.assign(state, JSON.parse(saved));
      buildTasks();
      applyDeadlines();
      applyLagfartDeadline();
      loadTaskState();
      loadBills();
      loadDocuments();
      renderPlan();
      showScreen('screen-plan');
      return;
    }
  } catch(e) {}

  // PWA shortcut: ./#start forces onboarding even on revisit
  if (window.location.hash === '#start') {
    history.replaceState(null, '', window.location.pathname);
    startOnboarding();
  }
})();

// Dödsdatum kan aldrig ligga i framtiden
(function initDeathDateMax() {
  const el = document.getElementById('deceased-date');
  if (el) el.max = new Date().toISOString().slice(0, 10);
})();

// ─── BOUPPTECKNING ────────────────────────────
const BOPP_KEY = 'efterplan_bouppteckning';

const boppData = {
  delbagare:  [],  // [{ namn, roll }]
  tillgangar: [],  // [{ beskrivning, varde }]
  skulder:    [],  // [{ beskrivning, belopp }]
};

// T208 — förifyllda default-rader istället för en tom lista: användaren slipper komma på
// vad som ska fyllas i, och kan redigera/ta bort raderna precis som vanligt.
const BOPP_DEFAULT_TILLGANGAR = [
  { beskrivning: 'Bankkonto', varde: '' },
  { beskrivning: 'Bostad', varde: '' },
  { beskrivning: 'Bil', varde: '' },
  { beskrivning: 'Bohag', varde: '' },
];

let boppTracked = false; // T133: rapportera aktivering en gång per session, inte per tangenttryck

function boppSave() {
  try { localStorage.setItem(BOPP_KEY, JSON.stringify(boppData)); } catch(e) {}
  if (!boppTracked && (boppData.delbagare.length || boppData.tillgangar.length || boppData.skulder.length)) {
    boppTracked = true;
    track('bouppteckning_saved', {
      delbagare: boppData.delbagare.length,
      tillgangar: boppData.tillgangar.length,
      skulder: boppData.skulder.length,
    });
  }
}

function boppLoad() {
  try {
    const raw = localStorage.getItem(BOPP_KEY);
    const saved = JSON.parse(raw || 'null');
    if (saved) {
      boppData.delbagare  = saved.delbagare  || [];
      boppData.tillgangar = saved.tillgangar || [];
      boppData.skulder    = saved.skulder    || [];
    } else if (raw === null) {
      // Första besöket i Bouppteckning (inget sparat ännu) — starta med vanliga rader
      // istället för en tom lista. Ifyllningsbara och borttagbara som vanligt.
      boppData.tillgangar = BOPP_DEFAULT_TILLGANGAR.map(row => ({ ...row }));
    }
  } catch(e) {}
  boppRender();
}

function boppRender() {
  boppRenderSection('delbagare',  'bopp-delbagare-list',  boppRowDelbagare);
  boppRenderSection('tillgangar', 'bopp-tillgangar-list', boppRowTillgang);
  boppRenderSection('skulder',    'bopp-skulder-list',    boppRowSkuld);
  boppUpdateSummary();
}

function boppRenderSection(key, containerId, rowFn) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  boppData[key].forEach((item, i) => {
    container.appendChild(rowFn(item, i));
  });
  if (boppData[key].length === 0) {
    const empty = document.createElement('p');
    empty.className = 'bopp-empty';
    empty.textContent = 'Ingen tillagd ännu.';
    container.appendChild(empty);
  }
}

function boppRowDelbagare(item, i) {
  const row = document.createElement('div');
  row.className = 'bopp-row';
  row.innerHTML = `
    <input class="bill-input bopp-input-name" type="text" placeholder="Namn" value="${_esc(item.namn)}"
      oninput="boppData.delbagare[${i}].namn=this.value;boppSave()">
    <select class="bill-input bopp-select" onchange="boppData.delbagare[${i}].roll=this.value;boppSave()">
      <option value="arvinge"${item.roll==='arvinge'?' selected':''}>Arvinge</option>
      <option value="testamentstagare"${item.roll==='testamentstagare'?' selected':''}>Testamentstagare</option>
      <option value="efterlevande_make"${item.roll==='efterlevande_make'?' selected':''}>Efterlevande make/maka</option>
      <option value="annan"${item.roll==='annan'?' selected':''}>Annan</option>
    </select>
    <button class="bopp-remove" onclick="boppRemove('delbagare',${i})" aria-label="Ta bort">×</button>`;
  return row;
}

function boppRowTillgang(item, i) {
  const row = document.createElement('div');
  row.className = 'bopp-row';
  row.innerHTML = `
    <input class="bill-input bopp-input-name" type="text" placeholder="Beskrivning (t.ex. Bankkonto Swedbank)" value="${_esc(item.beskrivning)}"
      oninput="boppData.tillgangar[${i}].beskrivning=this.value;boppSave()">
    <input class="bill-input bopp-input-amount" type="number" placeholder="Belopp (kr)" value="${item.varde||''}"
      oninput="boppData.tillgangar[${i}].varde=this.value;boppSave();boppUpdateSummary()">
    <button class="bopp-remove" onclick="boppRemove('tillgangar',${i})" aria-label="Ta bort">×</button>`;
  return row;
}

function boppRowSkuld(item, i) {
  const row = document.createElement('div');
  row.className = 'bopp-row';
  row.innerHTML = `
    <input class="bill-input bopp-input-name" type="text" placeholder="Borgenär (skuld till, t.ex. Swedbank)" value="${_esc(item.beskrivning)}"
      oninput="boppData.skulder[${i}].beskrivning=this.value;boppSave()">
    <input class="bill-input bopp-input-amount" type="number" placeholder="Belopp (kr)" value="${item.belopp||''}"
      oninput="boppData.skulder[${i}].belopp=this.value;boppSave();boppUpdateSummary()">
    <button class="bopp-remove" onclick="boppRemove('skulder',${i})" aria-label="Ta bort">×</button>`;
  return row;
}

function boppAddDelbagare() {
  boppData.delbagare.push({ namn: '', roll: 'arvinge' });
  boppSave();
  boppRenderSection('delbagare', 'bopp-delbagare-list', boppRowDelbagare);
  const inputs = document.querySelectorAll('#bopp-delbagare-list .bopp-input-name');
  if (inputs.length) inputs[inputs.length - 1].focus();
}

function boppAddTillgang() {
  boppData.tillgangar.push({ beskrivning: '', varde: '' });
  boppSave();
  boppRenderSection('tillgangar', 'bopp-tillgangar-list', boppRowTillgang);
  const inputs = document.querySelectorAll('#bopp-tillgangar-list .bopp-input-name');
  if (inputs.length) inputs[inputs.length - 1].focus();
}

function boppAddSkuld() {
  boppData.skulder.push({ beskrivning: '', belopp: '' });
  boppSave();
  boppRenderSection('skulder', 'bopp-skulder-list', boppRowSkuld);
  const inputs = document.querySelectorAll('#bopp-skulder-list .bopp-input-name');
  if (inputs.length) inputs[inputs.length - 1].focus();
}

function boppRemove(key, index) {
  boppData[key].splice(index, 1);
  boppSave();
  boppRender();
}

function boppUpdateSummary() {
  const tillgangar = boppData.tillgangar.reduce((s, t) => s + (parseFloat(t.varde) || 0), 0);
  const skulder    = boppData.skulder.reduce((s, t) => s + (parseFloat(t.belopp) || 0), 0);
  const netto      = tillgangar - skulder;
  const fmt = n => n.toLocaleString('sv-SE') + ' kr';
  const el = id => document.getElementById(id);
  if (el('bopp-sum-tillgangar')) el('bopp-sum-tillgangar').textContent = fmt(tillgangar);
  if (el('bopp-sum-skulder'))    el('bopp-sum-skulder').textContent    = fmt(skulder);
  if (el('bopp-sum-netto')) {
    el('bopp-sum-netto').textContent = fmt(netto);
    el('bopp-sum-netto').classList.toggle('bopp-netto-neg', netto < 0);
  }
}

function _esc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}

// Load on init
document.addEventListener('DOMContentLoaded', () => { boppLoad(); });
