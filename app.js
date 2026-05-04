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
      track('Premium Activated');
      alert('Tack! Premium är upplåst på den här enheten.');
    } else {
      alert('Vi kunde inte bekräfta betalningen direkt. Försök ladda om sidan om en stund.');
    }
  } catch (_) {
    alert('Kunde inte verifiera betalningen — kolla din inkorg för Stripe-kvittot.');
  } finally {
    // Strip query params so reloads don't re-trigger.
    const clean = window.location.pathname + window.location.hash;
    window.history.replaceState({}, '', clean);
  }
}

// ─── SHARED MODE ─────────────────────────────
// When someone opens ?share=TOKEN the plan is rendered from Supabase instead
// of localStorage. mode='read' disables all mutations; mode='edit' routes
// task checkbox toggles through the toggle_shared_task RPC.
const SHARED = {
  mode:       'owner', // 'owner' | 'read' | 'edit'
  token:      null,
  taskMap:    null,    // overrides localStorage efterplan_tasks when set
  notifyList: null,    // overrides localStorage efterplan_notify_list
};
function isOwnerMode()  { return SHARED.mode === 'owner'; }
function isReadOnly()   { return SHARED.mode === 'read'; }
function isSharedEdit() { return SHARED.mode === 'edit'; }

// ─── STATE ───────────────────────────────────
const state = {
  relation:            null,
  testamente:          false,
  fastighet:           false,
  foretag:             false,
  skulder:             false,
  utland:              false,
  minderarig:          false,
  fordon:              false,
  husdjur:             false,
  hyresratt:           false,
  ansvar:              null,
  name:                '',
  personnr:            '',
  participants:        [],
  participantPersonnr: {}, // name → personnr
  taskChecklists:      {}, // taskId → {key: bool}
  tasks:               [],
  bills:               [],
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
  if (!isOwnerMode()) return;
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
  // Step 3 — ansvar
  document.querySelectorAll('#ob-step-3 .ob-choice').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.val === state.ansvar);
  });
  if (state.ansvar) {
    const nb = document.querySelector('#ob-step-3 .ob-next-btn');
    if (nb) nb.disabled = false;
  }
  // Step 4 — participants (if returning to edit)
  const selfInput = document.getElementById('ob-self-name');
  if (selfInput) selfInput.value = state.participants?.[0] || '';
  // Render others (index 1+) as chips
  const _allP = state.participants || [];
  const _others = _allP.slice(1);
  const _savedP = state.participants;
  state.participants = _others;
  renderObParticipantList();
  state.participants = _savedP;
  // Step 5 — name
  const nameEl = document.getElementById('deceased-name');
  if (nameEl) nameEl.value = state.name || '';
  // Step 6 — personnr
  const pnrEl = document.getElementById('deceased-personnr');
  if (pnrEl) pnrEl.value = state.personnr || '';
}

// ─── ONBOARDING (conversational) ─────────────
let OB_TOTAL = 5;
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

const OB_FOCUS_IDS = { 4: 'ob-self-name', 5: 'deceased-name' };  /* tangentbordet ska inte öppnas automatiskt på personnr-steget */

function obShowStep(step) {
  const el = document.getElementById(`ob-step-${step}`);
  if (!el) return;
  el.classList.add('active');
  obCurrentStep = step;
  obUpdateDots(step);
  document.getElementById('ob-back-btn').style.visibility = step === 1 ? 'hidden' : 'visible';
  // Update label dynamically to reflect logical step number
  const labelEl = el.querySelector('.ob-label');
  if (labelEl) {
    const logicalStep = (OB_TOTAL === 5 && step >= 5) ? step - 1 : step;
    const suffix = step === 6 ? ' — helt frivilligt' : '';
    labelEl.textContent = `Steg ${logicalStep} av ${OB_TOTAL}${suffix}`;
  }
  if (OB_FOCUS_IDS[step]) {
    setTimeout(() => document.getElementById(OB_FOCUS_IDS[step])?.focus(), 350);
  }
  // Update visual progress bar
  const fillEl = document.getElementById('ob-progress-bar-fill');
  if (fillEl) {
    const logicalStep = (OB_TOTAL === 5 && step >= 5) ? step - 1 : step;
    fillEl.style.width = `${Math.round((logicalStep / OB_TOTAL) * 100)}%`;
  }
}

function obBack() {
  if (obCurrentStep === 1) { goToLanding(); return; }
  // When ensam: step 5 (name) goes back to step 3, skipping participants step 4
  if (obCurrentStep === 5 && state.ansvar === 'ensam') { obGoTo(3); return; }
  obGoTo(obCurrentStep - 1);
}

function obAfterAnsvar() {
  if (state.ansvar === 'flera') {
    OB_TOTAL = 6;
    obInitDots();
    obGoTo(4); // participants step
  } else {
    OB_TOTAL = 5;
    obInitDots();
    obGoTo(5); // skip participants, go straight to name
  }
}

function obSaveParticipantsAndContinue() {
  const selfName = document.getElementById('ob-self-name')?.value.trim() || '';
  // others = chips already added
  const others = state.participants || [];
  // Build final list: self first, then others (deduped)
  const all = selfName ? [selfName, ...others.filter(n => n !== selfName)] : others;
  state.participants = all;
  obGoTo(5);
}

function obAddParticipant() {
  const input = document.getElementById('ob-participant-name');
  const name = input ? input.value.trim() : '';
  if (!name) return;
  if (!state.participants) state.participants = [];
  if (!state.participants.includes(name)) state.participants.push(name);
  if (input) input.value = '';
  renderObParticipantList();
  renderParticipants();
}

function obRemoveParticipant(i) {
  if (!state.participants) return;
  state.participants.splice(i, 1);
  renderObParticipantList();
  renderParticipants();
}

function renderObParticipantList() {
  const list = document.getElementById('ob-participant-list');
  if (!list) return;
  list.innerHTML = (state.participants || []).map((name, i) =>
    `<span class="ob-participant-chip">${name} <button class="ob-participant-remove" type="button" onclick="obRemoveParticipant(${i})" aria-label="Ta bort ${name}">×</button></span>`
  ).join('');
}

function updateCheckboxState(key) {
  document.querySelectorAll('#ob-step-2 input[type="checkbox"]').forEach(cb => {
    state[cb.dataset.key] = cb.checked;
  });
  if (key) track('Checkbox Toggle', { key });
}

function generatePlan() {
  state.name     = document.getElementById('deceased-name').value.trim();
  state.personnr = document.getElementById('deceased-personnr').value.trim();
  buildTasks();
  loadTaskState(); // bevara progress/assignees vid "Ändra svar"
  // Auto-tilldela person1 till uppgifter som saknar ansvarig
  if (state.participants.length > 0) {
    state.tasks.forEach(t => { if (!t.assignee) t.assignee = state.participants[0]; });
  }
  loadBills();
  renderPlan();
  saveState();
  saveTaskState(); // spara default-tilldelningar
  track('plan_generated', { relation: state.relation || 'okänd', ansvar: state.ansvar || 'okänd' });
  showScreen('screen-plan');
}

// ─── RULE ENGINE ─────────────────────────────
// Each task: id, title, desc, urgency, time, link, phone?, triggers, hasDoc?, notesPlaceholder?
const TASK_LIBRARY = [

  // ── ALWAYS ─────────────────────────────────
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
    desc: 'Det här sker i etapper — du behöver inte nå alla på en gång. Börja med de allra närmaste: familj och nära vänner. Övriga kan meddelas under de kommande dagarna. Det är okej att be någon annan hjälpa till.',
    urgency: 'today',
    time: 'Din tid',
    link: null,
    triggers: [],
    notesPlaceholder: 'Vem har meddelats, vem återstår…',
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
    desc: 'Ta hand om bostadsnycklar och gör en adressändring för den avlidnes post via adressändring.se. Viktiga brev kan annars gå förlorade.',
    urgency: 'today',
    time: 'ca 20 min',
    link: 'https://www.adressandring.se',
    triggers: [],
    notesPlaceholder: 'Var finns nycklarna? Adressändring gjord hos Postnord?',
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
    triggers: ['flera_delägare'],
    hasDoc: 'fullmakt',
    assigneeLabel: 'Vem får fullmakten?',
  },
  {
    id: 'bouppteckning',
    title: 'Planera bouppteckningen',
    desc: 'En bouppteckning är en förteckning över den avlidnes tillgångar och skulder. Den ska vara klar inom 3 månader och skickas till Skatteverket inom 4 månader.<br><br><strong>Är boet litet?</strong> Om tillgångarna knappt täcker begravnings- och bouppteckningskostnaderna kan du istället göra en <em>dödsboanmälan</em> hos kommunens socialtjänst — det är gratis och enklare. Kontakta socialtjänsten för att se om det gäller dig.<br><br><strong>Göra själv:</strong> Möjligt om boet är enkelt (bara bankmedel och lösöre). Kräver två utomstående vittnen som inte är arvingar. Sparar 6 500–15 000 kr.<br><strong>Anlita jurist:</strong> Rekommenderas vid fastighet, företag, testamente eller om arvingarna inte är överens.',
    urgency: 'week',
    time: 'Kontakta jurist inom veckan',
    link: null,
    triggers: [],
    resources: [
      { label: 'Familjens Jurist — rikstäckande, specialiserade på dödsbon', url: 'https://www.familjens-jurist.se' },
      { label: 'Advokatsamfundet — hitta advokat nära dig', url: 'https://www.advokatsamfundet.se/hitta-advokat' },
    ],
    notesPlaceholder: 'Jurist kontaktad, offert, datum för förrättning…',
  },
  {
    id: 'bank_kontakt',
    title: 'Kontakta banken',
    desc: 'Meddela banken om dödsfallet så att kontona hanteras korrekt. Ha dödsbevis och personnummer redo. Skriv ned vilka banker du känner till nedan — du kan fylla på efterhand.',
    urgency: 'week',
    time: 'ca 30 min',
    link: null,
    triggers: [],
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
    desc: `Försäkringskassan behöver meddelas om dödsfallet för att stoppa löpande utbetalningar och för att du ska kunna ansöka om förmåner du kan ha rätt till.<br><br>
<strong>Stoppa automatiskt:</strong> Barnbidrag, bostadsbidrag, sjukpenning och andra bidrag avslutas inte alltid automatiskt — kontakta FK för att undvika återkrav.<br><br>
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
    notesPlaceholder: 'Ärenden öppnade, ärendenummer, beviljade förmåner…',
  },

  // ── LATER ──────────────────────────────────
  {
    id: 'abonnemang',
    title: 'Avsluta abonnemang och prenumerationer',
    desc: 'Mobil, streaming, tidningar, el, gym — säg upp tjänster en efter en. Använd dokumentgeneratorn för att skapa uppsägningsbrev. Skriv ned det du vet eller hittar nedan.',
    urgency: 'later',
    time: 'ca 1–2 timmar',
    link: null,
    triggers: [],
    hasDoc: 'bulk',
    notesPlaceholder: 'Vet du några abonnemang eller tjänster? Notera dem här — du kan fylla på. (t.ex. Telia, Spotify, Netflix, el, gym…)',
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
    desc: 'Dödsboet är skattskyldigt och kan behöva lämna in en deklaration. Kontakta Skatteverket eller en revisor.',
    urgency: 'later',
    time: 'Senast 2 maj efter dödsåret',
    link: 'https://www.skatteverket.se',
    triggers: [],
    notesPlaceholder: 'Deklaration inlämnad, revisor anlitad, datum…',
  },

  // ── CONDITIONAL: Fastighet ─────────────────
  {
    id: 'fastighet_boende',
    title: 'Besluta om bostadens framtid',
    desc: 'Ska bostaden säljas, övertas av anhörig, eller hyras ut? Ta detta beslut med alla delägare i boet.',
    urgency: 'week',
    time: 'Diskussion med familjen',
    link: null,
    triggers: ['fastighet'],
    notesPlaceholder: 'Beslut om bostaden, kontaktad mäklare eller arvinge…',
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
    desc: 'När en fastighet ärvs måste den nya ägaren ansöka om lagfart hos Lantmäteriet. Ansökan ska göras inom 3 månader från att bouppteckningen registrerats hos Skatteverket. Stämpelskatten är 1,5 % av fastighetens taxeringsvärde, plus en expeditionsavgift på 825 kr.',
    urgency: 'later',
    time: 'ca 30 min online',
    link: 'https://www.lantmateriet.se/sv/fastigheter/agande-och-rattigheter/lagfart/',
    triggers: ['fastighet'],
    notesPlaceholder: 'Ansökan skickad, datum, stämpelskatt beräknad…',
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
    desc: 'Samla en komplett bild av lån, krediter och obetalda räkningar. Skulder betalas av dödsboet innan arv utbetalas.<br><br><strong>Viktigt:</strong> Begravnings- och bouppteckningskostnader prioriteras före alla andra skulder. Om boet inte räcker till kontaktar du borgenärerna och begär anstånd tills bouppteckningen är klar. Du som anhörig är <em>inte</em> personligt betalningsansvarig för den avlidnes skulder.',
    urgency: 'week',
    time: 'ca 1–2 timmar',
    link: null,
    triggers: ['skulder'],
    notesPlaceholder: 'Skulder listade, kontakter till borgenärer, belopp…',
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
  {
    id: 'make_bostadsratt',
    title: 'Kontrollera bostadsrättens framtid',
    desc: 'Om ni bodde i bostadsrätt ihop — kontakta bostadsrättsföreningen om hur överlåtelse eller fortsatt boende hanteras.',
    urgency: 'week',
    time: 'ca 30 min',
    link: null,
    triggers: ['make'],
    notesPlaceholder: 'BRF kontaktad, beslut om boende eller överlåtelse…',
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
    urgency: 'later',
    time: 'Din tid',
    link: 'https://www.1177.se/liv-halsa/psykisk-halsa/sorg/',
    triggers: [],
    notesPlaceholder: 'Vad hjälper dig just nu? Är det någon du vill ringa?',
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
  if (state.ansvar === 'flera') triggers.add('flera_delägare');
  if (state.fordon)      triggers.add('fordon');
  if (state.husdjur)     triggers.add('husdjur');
  if (state.hyresratt)   triggers.add('hyresratt');

  state.tasks = TASK_LIBRARY.filter(task =>
    task.triggers.length === 0 || task.triggers.some(t => triggers.has(t))
  ).map(task => ({ ...task, done: false, started: false }));

  loadTaskState();
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
  if (!isOwnerMode()) return;
  const notes = _getNotes();
  notes[taskId] = value;
  try { localStorage.setItem('efterplan_notes', JSON.stringify(notes)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
  if (value.length > 0) track('Note Saved', { task: taskId });
}, 400);

function getTaskNote(taskId) {
  return _getNotes()[taskId] || '';
}

function saveTaskState() {
  if (!isOwnerMode()) return; // shared viewers never touch localStorage
  const saved = {};
  state.tasks.forEach(t => { saved[t.id] = { done: t.done, started: t.started, assignee: t.assignee || null }; });
  try { localStorage.setItem('efterplan_tasks', JSON.stringify(saved)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
}

function loadTaskState() {
  try {
    const source = SHARED.taskMap
      ? SHARED.taskMap
      : JSON.parse(localStorage.getItem('efterplan_tasks') || '{}');
    state.tasks = state.tasks.map(t => {
      const s = source[t.id];
      if (!s) return t;
      // Backward-compat: old format stored a boolean
      if (typeof s === 'boolean') return { ...t, done: s, started: false };
      return { ...t, done: s.done || false, started: s.started || false, assignee: s.assignee || null };
    });
  } catch(e) {}
}

// ─── PARTICIPANTS NAV ─────────────────────────
function renderParticipants() {
  const container = document.getElementById('plan-participants');
  if (!container) return;
  const participants = state.participants || [];
  const deceased = state.name ? state.name.trim() : '';

  // Deceased first (different style — primary chip)
  const deceasedChip = deceased
    ? `<span class="plan-participant-chip plan-participant-chip--deceased"
         title="${deceased}">${deceased.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase()}</span>`
    : '';

  const chips = participants.map(name => {
    const initials = name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `<span class="plan-participant-chip" title="${name}">${initials}</span>`;
  }).join('');

  container.innerHTML = deceasedChip + chips +
    `<button class="plan-participant-add-btn" onclick="openModal('modal-participants')" title="Lägg till deltagare" aria-label="Lägg till deltagare">+</button>`;
}

// ─── RENDER PLAN ─────────────────────────────
function renderPlan() {
  renderParticipants();
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
  renderTaskList('tasks-today', today, nextTaskId, 0);
  renderTaskList('tasks-week',  week,  nextTaskId, today.length);
  renderTaskList('tasks-later', later, nextTaskId, today.length + week.length);

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
}

let expandedTaskId = null;

function buildPreviewCTACard() {
  const cta = document.createElement('div');
  cta.className = 'preview-cta-card';
  cta.innerHTML = `
    <div class="preview-cta-lock" aria-hidden="true">🔒</div>
    <h3 class="preview-cta-title">Lås upp hela planen</h3>
    <p class="preview-cta-desc">Du har sett de första ${PREVIEW_STEPS} stegen. Lås upp alla återstående uppgifter — engångsbetalning, ingen prenumeration.</p>
    <button class="btn-primary preview-cta-btn" onclick="handlePreviewCTA()">Lås upp — 149 kr</button>
  `;
  return cta;
}

function handlePreviewCTA() {
  track('Preview CTA Clicked');
  handlePaywallCTA();
}

function renderTaskList(containerId, tasks, nextTaskId, globalOffset = 0) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

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

    if (isLocked) {
      wrap.innerHTML = `
        <div class="task-card task-card--locked" id="task-card-${task.id}" aria-disabled="true">
          <div class="task-check" aria-hidden="true"></div>
          <div class="task-body">
            <div class="task-title">${task.title}</div>
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

    const docHtml = task.hasDoc && !task.done
      ? `<button class="task-expand-doc" onclick="event.stopPropagation();switchTab('docs');showDocForm('${task.hasDoc}')">Generera dokument →</button>`
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
    const assigneeBadge = task.assignee
      ? `<span class="task-assignee-badge" id="assignee-badge-${task.id}">${task.assignee}</span>`
      : `<span class="task-assignee-badge hidden" id="assignee-badge-${task.id}"></span>`;

    wrap.innerHTML = `
      <div class="task-card${cardClass}" id="task-card-${task.id}">
        <div class="task-check${checkClass}" id="check-${task.id}"></div>
        <div class="task-body">
          <div class="task-title">${task.title}${nextBadge}</div>
          <div class="task-time">${task.time}${startedBadge}${assigneeBadge}</div>
        </div>
        <div class="task-chevron" id="chevron-${task.id}" aria-hidden="true">›</div>
      </div>
      <div class="task-expand hidden" id="expand-${task.id}">
        <div class="task-expand-desc">${task.desc}</div>
        ${linkHtml}
        ${phoneHtml}
        ${phone2Html}
        ${resourcesHtml}
        ${(task.id === 'begravningsceremoni' && state.ansvar !== 'flera') ? '' : renderAssigneePicker(task.id)}
        ${notifyHtml}
        ${checklistHtml}
        ${notesHtml}
        <div class="task-expand-actions">
          ${doneHtml}
          ${docHtml}
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
      if (isReadOnly()) return;
      const t = state.tasks.find(x => x.id === task.id);
      if (!t) return;
      if (t.done) { undoTaskDoneManual(task.id); } else { markTaskDone(task.id); }
    });
    checkEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        if (isReadOnly()) return;
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
    // Återställ badge för tidigare öppnad uppgift
    const prevTask = state.tasks.find(t => t.id === expandedTaskId);
    const prevBadge = document.getElementById(`assignee-badge-${expandedTaskId}`);
    if (prevBadge && prevTask?.assignee) prevBadge.classList.remove('hidden');
  }

  if (isOpen) { expandedTaskId = null; return; }

  expandedTaskId = taskId;
  const el   = document.getElementById(`expand-${taskId}`);
  const chev = document.getElementById(`chevron-${taskId}`);
  const card = document.getElementById(`task-card-${taskId}`);
  if (el)   el.classList.remove('hidden');
  if (chev) chev.classList.add('open');
  if (card) { card.classList.add('expanded'); card.setAttribute('aria-expanded', 'true'); }
  // Dölj badge när uppgiften är expanderad (syns i pickern istället)
  document.getElementById(`assignee-badge-${taskId}`)?.classList.add('hidden');
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
  if (!isOwnerMode()) return;
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
function submitBill() {
  if (!isOwnerMode()) return;
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
  state.bills.push({ id: Date.now().toString(), desc, amount: amount || '', paid: false, photo, ocr });
  saveBills();
  renderBills();
  hideBillForm();
  track('Bill Added');
}
function toggleBillPaid(id) {
  if (!isOwnerMode()) return;
  const b = state.bills.find(b => b.id === id);
  if (b) { b.paid = !b.paid; saveBills(); renderBills(); }
}
function deleteBill(id) {
  if (!isOwnerMode()) return;
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
  if (!isOwnerMode()) return;
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
      track('Bill Scanned QR');
    } else {
      setBillScanStatus('Foto sparat. Skriv beskrivning manuellt.');
      track('Bill Scanned Photo Only');
    }
    setTimeout(() => setBillScanStatus(''), 5000);
  } catch (err) {
    console.error('Bill scan error', err);
    setBillScanStatus('Det gick inte att läsa bilden. Försök igen.', true);
    setTimeout(() => setBillScanStatus(''), 5000);
  }
}

function markTaskStarted(taskId) {
  if (!isOwnerMode()) return; // shared viewers cannot "start" tasks
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
  if (isReadOnly()) return;
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  if (isSharedEdit()) {
    _sharedToggleTask(taskId, true);
    // UI updated below; no localStorage write (saveTaskState no-ops)
  }
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

  // Scroll to next uncompleted task
  const next = state.tasks.find(t => !t.done);
  if (next) {
    setTimeout(() => {
      const el = document.getElementById(`task-card-${next.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  }
}

// ─── ASSIGNEES ────────────────────────────────
// Single source of truth: state.participants — same list used for task
// assignment and notify notifier. Add people via the + button in the nav.
function _getAssignees() {
  return state.participants || [];
}
function getTaskAssignee(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  return task ? (task.assignee || null) : null;
}
function setTaskAssignee(taskId, name) {
  if (!isOwnerMode()) return;
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  task.assignee = (task.assignee === name) ? null : name;
  saveTaskState();
  _refreshAssigneePicker(taskId);
  _refreshAssigneeBadge(taskId);
}
function _refreshAssigneePicker(taskId) {
  const picker = document.getElementById(`assignee-picker-${taskId}`);
  if (picker) picker.innerHTML = _buildAssigneePickerInner(taskId);
}
function _refreshAssigneeBadge(taskId) {
  const badge = document.getElementById(`assignee-badge-${taskId}`);
  const task = state.tasks.find(t => t.id === taskId);
  if (!badge || !task) return;
  if (task.assignee) {
    badge.textContent = task.assignee;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}
function _buildAssigneePickerInner(taskId) {
  const assignees = _getAssignees();
  const current = getTaskAssignee(taskId);
  if (!assignees.length) {
    return `<button class="assignee-add-hint"
              onclick="event.stopPropagation();openModal('modal-participants')"
              title="Lägg till deltagare">+ Lägg till deltagare</button>`;
  }
  return assignees.map(n =>
    `<button class="assignee-chip${n === current ? ' selected' : ''}"
             onclick="event.stopPropagation();setTaskAssignee('${taskId}','${n.replace(/'/g,"\\'")}')">
       ${n}
     </button>`
  ).join('');
}
function renderAssigneePicker(taskId) {
  const taskDef = TASK_LIBRARY.find(t => t.id === taskId);
  const label = (taskDef && taskDef.assigneeLabel) || 'Ansvarig';
  return `<div class="task-assignee-section">
    <span class="task-assignee-label">${label}</span>
    <div class="assignee-picker" id="assignee-picker-${taskId}">
      ${_buildAssigneePickerInner(taskId)}
    </div>
  </div>`;
}

// ─── PARTICIPANTS ──────────────────────────────
function _getParticipants() {
  return state.participants || [];
}
function addParticipant() {
  if (!isOwnerMode()) return;
  const input = document.getElementById('ob-participant-input');
  const name = input?.value.trim();
  if (!name) return;
  if (!state.participants) state.participants = [];
  if (!state.participants.includes(name)) {
    state.participants.push(name);
    saveState();
  }
  input.value = '';
  _refreshParticipantList();
  renderParticipants();
  _refreshAllAssigneePickers();
}

function _refreshAllAssigneePickers() {
  state.tasks.forEach(t => _refreshAssigneePicker(t.id));
}
function removeParticipant(name) {
  if (!isOwnerMode()) return;
  state.participants = (state.participants || []).filter(n => n !== name);
  saveState();
  _refreshParticipantList();
  _refreshAllAssigneePickers();
}
function _refreshParticipantList() {
  // Onboarding list — simple chips
  const obList = document.getElementById('ob-participant-list');
  if (obList) {
    obList.innerHTML = (state.participants || []).map(name =>
      `<div class="ob-participant-chip">
        <span>${name}</span>
        <button onclick="removeParticipant('${name.replace(/'/g, "\\'")}')" aria-label="Ta bort ${name}">×</button>
      </div>`
    ).join('');
  }
  // Modal list — with optional personnr input
  const modalList = document.getElementById('modal-participant-list');
  if (modalList) {
    if (!(state.participants || []).length) {
      modalList.innerHTML = '<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">Inga deltagare tillagda ännu.</p>';
      return;
    }
    modalList.innerHTML = (state.participants || []).map(name => {
      const safeN = name.replace(/'/g, "\\'");
      const personnr = (state.participantPersonnr || {})[name] || '';
      return `<div class="modal-participant-item">
        <div class="modal-participant-row">
          <span class="modal-participant-name">${name}</span>
          <button class="modal-participant-remove" onclick="removeParticipant('${safeN}')" aria-label="Ta bort ${name}">×</button>
        </div>
        <input type="text" class="participant-personnr-input"
               placeholder="Personnummer (valfritt — för fullmakter)"
               value="${personnr}"
               onchange="saveParticipantPersonnr('${safeN}', this.value)" />
      </div>`;
    }).join('');
  }
}

function saveParticipantPersonnr(name, val) {
  if (!isOwnerMode()) return;
  if (!state.participantPersonnr) state.participantPersonnr = {};
  state.participantPersonnr[name] = val.trim();
  saveState();
}

// ─── NOTIFY LIST ──────────────────────────────
function _getNotifyList() {
  if (SHARED.notifyList) return SHARED.notifyList;
  try { return JSON.parse(localStorage.getItem('efterplan_notify_list') || '[]'); } catch(e) { return []; }
}
function _saveNotifyList(list) {
  if (!isOwnerMode()) return;
  try { localStorage.setItem('efterplan_notify_list', JSON.stringify(list)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
}
function _genNotifyId() {
  return Math.random().toString(36).slice(2, 10);
}

function addNotifyPerson() {
  const input = document.getElementById('notify-new-input');
  const name = input?.value.trim();
  if (!name) return;
  const list = _getNotifyList();
  list.push({ id: _genNotifyId(), name, notified: false, notifier: '' });
  _saveNotifyList(list);
  input.value = '';
  _refreshNotifyList();
}

function toggleNotified(personId) {
  const list = _getNotifyList();
  const person = list.find(p => p.id === personId);
  if (person) { person.notified = !person.notified; _saveNotifyList(list); }
  _refreshNotifyList();
}

function removeNotifyPerson(personId) {
  const list = _getNotifyList().filter(p => p.id !== personId);
  _saveNotifyList(list);
  _refreshNotifyList();
}

function setNotifyNotifier(personId, notifier) {
  const list = _getNotifyList();
  const person = list.find(p => p.id === personId);
  if (person) { person.notifier = notifier; _saveNotifyList(list); }
}

function _refreshNotifyList() {
  const container = document.getElementById('notify-list-container');
  if (!container) return;
  container.innerHTML = _buildNotifyListInner();
  const list = _getNotifyList();
  const done = list.filter(p => p.notified).length;
  const el = document.getElementById('notify-counter');
  if (el) el.textContent = list.length ? `${done} av ${list.length} meddelade` : '';
}

function _buildNotifyListInner() {
  const list = _getNotifyList();
  const participants = _getParticipants();
  if (!list.length) return '<p class="notify-empty">Inga tillagda än</p>';
  return list.map(p => {
    const safeId = p.id;
    const notifierSelect = participants.length > 0
      ? `<select class="notify-notifier-select" onclick="event.stopPropagation()"
           onchange="event.stopPropagation();setNotifyNotifier('${safeId}',this.value)">
           <option value="">Vem ringer?</option>
           ${participants.map(n => `<option value="${n}"${p.notifier === n ? ' selected' : ''}>${n}</option>`).join('')}
         </select>`
      : '';
    return `
      <div class="notify-person${p.notified ? ' notified' : ''}">
        <button class="notify-check${p.notified ? ' checked' : ''}"
          onclick="event.stopPropagation();toggleNotified('${safeId}')"
          aria-label="Markera ${p.name} som meddelad">${p.notified ? '✓' : ''}</button>
        <span class="notify-name">${p.name}</span>
        ${notifierSelect}
        <button class="notify-remove"
          onclick="event.stopPropagation();removeNotifyPerson('${safeId}')"
          aria-label="Ta bort ${p.name}">×</button>
      </div>`;
  }).join('');
}

function renderNotifyList() {
  const list = _getNotifyList();
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
  if (isReadOnly()) return;
  if (!_undoTaskId) return;
  clearTimeout(_undoTimer);
  document.getElementById('undo-toast').classList.add('hidden');

  const taskId = _undoTaskId;
  _undoTaskId = null;

  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  if (isSharedEdit()) _sharedToggleTask(taskId, false);
  task.done    = false;
  task.started = false;
  saveTaskState();
  renderPlan();   // full re-render restores accordion, buttons, notes
}

function undoTaskDoneManual(taskId) {
  if (isReadOnly()) return;
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  if (isSharedEdit()) _sharedToggleTask(taskId, false);
  task.done    = false;
  task.started = false;
  saveTaskState();
  renderPlan();
}

// Push a task toggle to Supabase via the anon RPC. Optimistic — we don't
// block the UI on success; we surface errors via the shared banner if any.
function _sharedToggleTask(taskId, done) {
  if (!SHARED.token || !window.efterplanAuth) return;
  try {
    window.efterplanAuth.toggleSharedTask(SHARED.token, taskId, done).catch(err => {
      _showSharedError('Kunde inte spara ändringen: ' + (err && err.message || err));
    });
  } catch (err) {
    _showSharedError('Kunde inte spara ändringen: ' + (err && err.message || err));
  }
}

function _showSharedError(msg) {
  const banner = document.getElementById('shared-banner');
  if (!banner) return;
  const txt = banner.querySelector('.shared-banner-text');
  if (txt) txt.textContent = msg;
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
  if (id === 'modal-participants') _refreshParticipantList();
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
    name:  localStorage.getItem('efterplan_sender_name')  || '',
    email: localStorage.getItem('efterplan_sender_email') || ''
  };
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
    const abNotes = getTaskNote('abonnemang');
    if (abNotes) {
      const services = abNotes.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
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
    text: `${sender}\n${email}\n\n${today}\n\nTill: ${name}\nÄrende: Avslutning av abonnemang — dödsfall${custnr ? '\nKundnummer: ' + custnr : ''}\n\nHej,\n\nJag kontaktar er angående abonnemanget som tillhörde ${deceased} (personnr ${personnr}), som tyvärr har gått bort.\n\nJag ber er härmed avsluta abonnemanget snarast möjligt och begär återbetalning för eventuell förbetald period efter avslutsdatum.\n\nJag bifogar dödsbevis och är tillgänglig för frågor via e-post.\n\nVänligen bekräfta avslut skriftligen.\n\nMed vänliga hälsningar,\n\n${sender}\n${email}`,
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
  track('Doc Generated', { title: 'Bulk uppsägning', count: String(services.length) });
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
${email}

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
${email}

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
${email}

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
  track('Doc Generated', { title: title.split(' — ')[0] });
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

  const { deceased, personnr, today } = getDocContext();

  const arendeTexts = {
    intyg:    { subject: 'Begäran om dödsfallsintyg och personbevis för dödsbo', body: `Jag kontaktar er för att begära dödsfallsintyg och personbevis avseende dödsboet efter ${deceased} (personnr ${personnr}), som gick bort nyligen.\n\nDokumenten behövs för dödsboets räkning i samband med bouppteckning och kontakt med banker och myndigheter.\n\nJag är ${relation} och dödsbodelägare. Vänligen skicka handlingarna till angiven e-postadress, eller meddela hur ansökan görs via er e-tjänst.` },
    fskatt:   { subject: 'Begäran om avslut av F-skatt — dödsfall', body: `Jag kontaktar er med anledning av att ${deceased} (personnr ${personnr}) har gått bort och att den av hen bedrivna enskilda näringsverksamheten därmed ska avslutas.\n\nJag ber er avregistrera F-skatten och eventuell mervärdesskatt (moms) med dödsdatum som slutdatum.\n\nJag är ${relation} och företräder dödsboet. Dödsbevis bifogas. Kontakta mig för ytterligare dokumentation.` },
    slutskatt: { subject: 'Begäran om information om slutlig skatt — dödsfall', body: `Jag kontaktar er angående slutlig skatt för ${deceased} (personnr ${personnr}), som har gått bort.\n\nJag ber er bekräfta om det finns kvarsstående skattefordringar eller skatteåterbäring att reglera, samt hur dödsboet ska gå till väga.\n\nJag är ${relation} och dödsbodelägare. Vänligen kontakta mig på angiven e-postadress.` },
  };

  const { subject, body } = arendeTexts[arende];

  showDocResult(`Skatteverket — ${subject}`, `${sender}\n${email}\n\n${today}\n\nTill: Skatteverket\nÄrende: ${subject}\n\nHej,\n\n${body}\n\nMed vänliga hälsningar,\n\n${sender}\n${relation} till ${deceased}\n${email}`, subject);
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
    ansvar:       state.ansvar,
    name:         state.name,
    participants: state.participants || [],
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
  if (!isOwnerMode()) return;
  // Save locally with personnr (own device only — never shared)
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
  track('Plan Completed');
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
  track('Plan Printed');
  window.print();
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
  track('Paywall CTA Clicked');
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
      alert('Kunde inte starta betalningen. Försök igen om en stund.');
      return;
    }
    if (email) localStorage.setItem(PREMIUM_EMAIL_KEY, email);
    window.location.href = data.url;
  } catch (err) {
    alert('Något gick fel mot betaltjänsten. Kontrollera din anslutning och försök igen.');
  }
}

// ─── SHARED PLAN INIT ────────────────────────
// Loaded asynchronously by supabase-client.js → efterplan:shared-loaded.
// Overlays a remote snapshot onto `state` and renders the plan view.
function applySharedSnapshot(detail) {
  if (!detail || !detail.state) return;
  SHARED.mode  = (detail.kind === 'edit') ? 'edit' : 'read';
  SHARED.token = detail.token || null;

  const parseMaybe = (v, fallback) => {
    if (v == null) return fallback;
    if (typeof v !== 'string') return v;
    try { return JSON.parse(v); } catch (_) { return fallback; }
  };

  const snap       = detail.state;
  const stateJson  = parseMaybe(snap.efterplan_state, null);
  const taskMap    = parseMaybe(snap.efterplan_tasks, {});
  const notes      = parseMaybe(snap.efterplan_notes, {});
  const bills      = parseMaybe(snap.efterplan_bills, []);
  const notifyList = parseMaybe(snap.efterplan_notify_list, []);

  if (stateJson) {
    // Never trust a remote personnr — strip it even if included.
    delete stateJson.personnr;
    Object.assign(state, stateJson);
  }
  SHARED.taskMap    = taskMap || {};
  SHARED.notifyList = Array.isArray(notifyList) ? notifyList : [];
  _notesCache       = notes || {};
  state.bills       = Array.isArray(bills) ? bills : [];

  buildTasks();         // respects SHARED.taskMap via loadTaskState
  renderPlan();

  // Update banner text + mode attribute
  const banner = document.getElementById('shared-banner');
  if (banner) {
    const txt = banner.querySelector('.shared-banner-text');
    banner.setAttribute('data-mode', SHARED.mode);
    if (txt) {
      const who = state.name ? state.name : 'en anhörig';
      txt.textContent = SHARED.mode === 'edit'
        ? `Du kan bocka av uppgifter i ${who}s plan. Inget annat sparas.`
        : 'Du ser en delad plan (skrivskyddad).';
    }
    banner.classList.remove('hidden');
  }

  document.body.classList.add(SHARED.mode === 'edit' ? 'shared-edit' : 'shared-read');
  showScreen('screen-plan');
  track('Shared Plan Opened', { mode: SHARED.mode });
}

window.addEventListener('efterplan:shared-loaded', (e) => {
  applySharedSnapshot(e.detail);
});

// ─── INIT ─────────────────────────────────────
(function init() {
  // If the URL carries a share token, wait for supabase-client to resolve it
  // via efterplan:shared-loaded. Don't leak the owner's own localStorage plan
  // into the view in the meantime.
  const hasShare = new URLSearchParams(window.location.search).get('share');
  if (hasShare) {
    // Leave landing screen visible; applySharedSnapshot will take over.
    return;
  }

  // Restore own plan from localStorage
  try {
    const saved = localStorage.getItem('efterplan_state');
    if (saved) {
      Object.assign(state, JSON.parse(saved));
      buildTasks();
      loadTaskState();
      loadBills();
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
