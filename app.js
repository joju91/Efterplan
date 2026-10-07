/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   EFTERPLAN â€” App Logic
   MVP v1.0
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

// â”€â”€â”€ FEATURE FLAGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PAYWALL_ENABLED = true;  // Stripe is wired (api/create-checkout + webhook)
// Hela checklistan Ã¤r gratis (Jonas 2026-09-10) â€” betalning gÃ¤ller bara
// breven/dokumenten, inte uppgifterna. SÃ¤tt LOCK_TASK_PREVIEW = true fÃ¶r
// att Ã¥terinfÃ¶ra "fÃ¶rsta N stegen gratis, resten lÃ¥sta".
const LOCK_TASK_PREVIEW = false;
const PREVIEW_STEPS   = 5;     // T030: first N tasks free, rest locked â€” bara aktivt om LOCK_TASK_PREVIEW

// â”€â”€â”€ PREMIUM ENTITLEMENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// localStorage is the fast path. Server-side source of truth is Supabase
// (table `purchases`, written by /api/stripe-webhook). Logged-in users and
// verified buyers restore via a Stripe receipt or their signed-in Supabase account.
const LEGACY_PREMIUM_KEY  = 'efterplan_premium';
const PREMIUM_SESSION_KEY = 'efterplan_premium_session';
let premiumInMemory = false;
try {
  localStorage.removeItem(LEGACY_PREMIUM_KEY);
  localStorage.removeItem('efterplan_premium_email');
} catch (_) {}

function isPremium() {
  return premiumInMemory;
}

function setPremium(sessionId) {
  premiumInMemory = true;
  try {
    localStorage.removeItem(LEGACY_PREMIUM_KEY); // Legacy flag is never trusted as proof of purchase.
    localStorage.removeItem('efterplan_premium_email');
    if (sessionId) localStorage.setItem(PREMIUM_SESSION_KEY, sessionId);
  } catch (_) { /* private browsing: entitlement remains available for this session */ }
  applyPremiumState();
}

function clearPremium() {
  premiumInMemory = false;
  try {
    localStorage.removeItem(LEGACY_PREMIUM_KEY);
    localStorage.removeItem('efterplan_premium_email');
    localStorage.removeItem(PREMIUM_SESSION_KEY);
  } catch (_) {}
  applyPremiumState();
}

// Ett brev Ã¤r gratis fÃ¶r att visa vad Efterplan skriver â€” fÃ¶rsÃ¤kringsbrevet,
// eftersom det oftast Ã¤r det som ger mest tillbaka (TGL/livfÃ¶rsÃ¤kring som
// familjen inte visste fanns). Resten lÃ¥ses upp fÃ¶r 49 kr.
const FREE_DOC_TYPES = ['forsakring'];

function isDocLocked(type) {
  return PAYWALL_ENABLED && !isPremium() && !FREE_DOC_TYPES.includes(type);
}

// â”€â”€â”€ GOOGLE ADS â€” KONVERTERINGSSPÃ…RNING (opt-in) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Fyll i vÃ¤rdena frÃ¥n Google Ads â†’ Verktyg â†’ Konverteringar (se ADS-SETUP.md).
// Alla tre tomma = ingen Google-kod laddas, allt nedan blir no-op.
// OBS: nÃ¤r ADS_CONVERSION_ID Ã¤r ifyllt laddas Google-taggen och sÃ¤tter
// mÃ¤tcookies (_gcl_*) fÃ¶r den som kommer via en annons. Detta Ã¤r en
// medveten avvikelse frÃ¥n "ingen Google-kod" (PR #85) â€” bara fÃ¶r
// annonskonvertering, ingen GA4-analys.
const ADS_CONVERSION_ID   = 'AW-18391491446';
const ADS_LABEL_PLAN      = '07qVCNedmoIdEPbG38FE';   // "Personlig plan skapad" (mjuk)
const ADS_LABEL_PURCHASE  = '_6NoCNqdmoIdEPbG38FE';   // "KÃ¶p 49 kr" (hÃ¥rd, med vÃ¤rde)

// FÃ¥nga gclid + utm_* vid landning â€” fÃ¶r attribution och ev. offline
// conversion import (Stripe â†’ Ads) senare. Rent localStorage, ingen kod laddas.
(function captureAdClick() {
  try {
    const p = new URLSearchParams(location.search);
    const gclid = p.get('gclid');
    if (gclid) {
      localStorage.setItem('efterplan_gclid', JSON.stringify({ gclid, ts: Date.now() }));
    }
    const utm = {};
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const v = p.get(k);
      if (v) utm[k] = v;
    }
    if (Object.keys(utm).length) {
      localStorage.setItem('efterplan_utm', JSON.stringify({ ...utm, ts: Date.now() }));
    }
  } catch (e) { /* private mode / storage disabled */ }
})();

// Ladda Google Ads-taggen â€” bara om ett konverterings-ID Ã¤r konfigurerat.
(function loadAdsTag() {
  if (!ADS_CONVERSION_ID) return;
  if (typeof window.gtag === 'function') return; // redan laddad statiskt i HTML
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ADS_CONVERSION_ID);
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ADS_CONVERSION_ID);
  document.head.appendChild(s);
})();

// Fyr en Google Ads-konvertering. No-op om taggen inte Ã¤r konfigurerad.
function adsConversion(label, opts) {
  opts = opts || {};
  if (!ADS_CONVERSION_ID || !label || typeof window.gtag !== 'function') return;
  const params = { send_to: ADS_CONVERSION_ID + '/' + label };
  if (typeof opts.value === 'number' && opts.value > 0) {
    params.value = opts.value;
    params.currency = 'SEK';
  }
  if (opts.transactionId) params.transaction_id = String(opts.transactionId);
  try { window.gtag('event', 'conversion', params); } catch (e) {}
}

function applyPremiumState() {
  const premium = isPremium();
  document.body.classList.toggle('is-premium', premium);
  const card = document.getElementById('paywall-card');
  if (card) card.classList.toggle('hidden', !PAYWALL_ENABLED || premium);
  // Alla brevknappar syns alltid; de betalda fÃ¥r ett lÃ¥s tills 49 kr betalats.
  document.querySelectorAll('.doc-type-btn[data-doc], .doc-bulk-cta[data-doc]').forEach(el => {
    el.classList.toggle('doc-locked', isDocLocked(el.dataset.doc));
  });
  // Re-render the plan so locked-task cards reflect the new state.
  if (typeof renderPlan === 'function' && state && Array.isArray(state.tasks) && state.tasks.length) {
    try { renderPlan(); } catch (_) { /* renderPlan is fine to skip on landing */ }
  }
}

async function checkPremiumServerSide() {
  // A stored Stripe session is an opaque, server-verifiable receipt. Never
  // trust the old editable localStorage premium flag.
  try {
    let sessionId = '';
    try { sessionId = localStorage.getItem(PREMIUM_SESSION_KEY) || ''; } catch (_) {}
    if (sessionId) {
      const r = await fetch(`/api/verify-checkout?session_id=${encodeURIComponent(sessionId)}`);
      if (r.ok) {
        const data = await r.json();
        if (data && data.ok) {
          setPremium(sessionId);
          return;
        }
        try { localStorage.removeItem(PREMIUM_SESSION_KEY); } catch (_) {}
      } else if (r.status === 400) {
        try { localStorage.removeItem(PREMIUM_SESSION_KEY); } catch (_) {}
      }
    }

    const token = window.efterplanAuth?.getAccessToken
      ? await window.efterplanAuth.getAccessToken()
      : null;
    if (!token) return;
    const r = await fetch('/api/check-premium', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return;
    const data = await r.json();
    if (data && data.ok && data.premium) setPremium();
  } catch (_) { /* offline ok */ }
}

async function handlePremiumReturn() {
  const checkoutReturn = window.efterplanCheckoutReturn;
  window.efterplanCheckoutReturn = null;
  if (!checkoutReturn) return;
  const result = checkoutReturn.result;
  if (result === 'cancelled') {
    showToast('Betalningen avbrÃ¶ts. Du har inte debiterats. Du kan fortsÃ¤tta planen utan att betala.', 'info');
    return;
  }
  if (result !== 'success') return;
  const sessionId = checkoutReturn.sessionId;
  if (!sessionId) return;
  try {
    const r = await fetch(`/api/verify-checkout?session_id=${encodeURIComponent(sessionId)}`);
    const data = await r.json();
    if (data && data.ok) {
      setPremium(sessionId);
      track('premium_activated');
      // HÃ¥rd konvertering â€” 49 kr-kÃ¶p. transaction_id = Stripe-sessionen
      // (Google Ads deduplicerar, sÃ¥ en omladdning dubbelrÃ¤knar inte).
      const kr = typeof data.amount_total === 'number' ? data.amount_total / 100 : 49;
      adsConversion(ADS_LABEL_PURCHASE, { value: kr, transactionId: sessionId });
      showToast('Tack! Premium Ã¤r upplÃ¥st pÃ¥ den hÃ¤r enheten.', 'success');
      // Visa breven direkt â€” Ã¤ven fÃ¶r den som kom via ett gratisverktyg utan sparad plan.
      if (typeof openDocsDirect === 'function') openDocsDirect();
    } else {
      showToast('Vi kunde inte bekrÃ¤fta betalningen direkt. FÃ¶rsÃ¶k ladda om sidan om en stund.', 'error');
    }
  } catch (_) {
    showToast('Kunde inte verifiera betalningen â€” kolla din inkorg fÃ¶r Stripe-kvittot.', 'error');
  }
}


// â”€â”€â”€ STATE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  giftSambo:      false, // T190 â€” triggar bodelning-pÃ¥minnelse
  litetDodsbo:    false, // T189 â€” triggar dÃ¶dsboanmÃ¤lan istÃ¤llet fÃ¶r bouppteckning
  bostadTyp:      null,  // T193 â€” 'villa' | 'brf' | 'lantbruk' | null
  maklare:        false, // T193 â€” filtrerar bort mÃ¤klarhanterade uppgifter
  name:           '',
  personnr:       '',
  deathDate:      '', // Ã…Ã…Ã…Ã…-MM-DD, frivilligt â€” driver T135-deadline-motorn
  bouppRegDatum:  '', // Ã…Ã…Ã…Ã…-MM-DD, frivilligt â€” datum dÃ¥ bouppteckningen registrerades hos Skatteverket, driver lagfartsfristen
  taskChecklists: {}, // taskId â†’ {key: bool}
  tasks:               [],
  bills:               [],
  documents:           [], // Arkiv/Dokumentcentral (T143â€“T148)
};

// â”€â”€â”€ SCREENS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.removeAttribute('role');
  });
  const screen = document.getElementById(id);
  screen.classList.add('active');
  screen.setAttribute('role', 'main');
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) skipLink.setAttribute('href', '#' + id);
  window.scrollTo(0, 0);
}

function goToLanding() {
  showScreen('screen-landing');
  // Visa "FortsÃ¤tt din plan" om det finns en sparad plan att Ã¥tervÃ¤nda till.
  const cont = document.getElementById('landing-continue');
  if (cont) {
    let hasPlan = false;
    try { hasPlan = !!localStorage.getItem('efterplan_state'); } catch (e) {}
    cont.hidden = !hasPlan;
  }
}

// Ã…teruppta en sparad plan (byggs upp om den inte redan finns i minnet).
function resumePlan() {
  if (!Array.isArray(state.tasks) || !state.tasks.length) {
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
      }
    } catch (e) {}
  }
  showScreen('screen-plan');
}

// â”€â”€â”€ ANALYTICS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Plausible custom events â€” safe noop if script hasn't loaded
function track(event, props) {
  if (typeof window.plausible === 'function') {
    window.plausible(event, props ? { props } : undefined);
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
  const confirmed = window.confirm('Vill du Ã¤ndra dina svar? Planen uppdateras nÃ¤r du Ã¤r klar â€” dina anteckningar och markeringar behÃ¥lls.');
  if (!confirmed) return;
  startOnboarding();
  obPrefillAnswers();
}

function obPrefillAnswers() {
  // Step 1 â€” relation
  document.querySelectorAll('#ob-step-1 .ob-choice').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.val === state.relation);
  });
  if (state.relation) {
    const nb = document.querySelector('#ob-step-1 .ob-next-btn');
    if (nb) nb.disabled = false;
  }
  // Step 2 â€” checkboxes
  document.querySelectorAll('#ob-step-2 input[type="checkbox"]').forEach(cb => {
    cb.checked = !!state[cb.dataset.key];
  });
  // Step 3 â€” name + dÃ¶dsdatum
  const nameEl = document.getElementById('deceased-name');
  if (nameEl) nameEl.value = state.name || '';
  const dateEl = document.getElementById('deceased-date');
  if (dateEl) dateEl.value = state.deathDate || '';
  // Step 4 â€” personnr
  const pnrEl = document.getElementById('deceased-personnr');
  if (pnrEl) pnrEl.value = state.personnr || '';
}

// â”€â”€â”€ ONBOARDING (conversational) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // Enable the NÃ¤sta button for this step
  const step = btn.closest('.ob-step');
  const nextBtn = step?.querySelector('.ob-next-btn');
  if (nextBtn) nextBtn.disabled = false;
}


// T193 â†’ 2026-09-10: bostadstyp + mÃ¤klare frÃ¥gas inte lÃ¤ngre i onboarding.
// De fÃ¤lls ut i sjÃ¤lva uppgiften "Besluta om bostadens framtid" i planen
// (renderBostadWidget nedan). "Ã„gde sin bostad" (state.fastighet) rÃ¤cker
// fÃ¶r att uppgiften ska visas; typ/mÃ¤klare finjusterar sedan triggers.
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

const OB_FOCUS_IDS = { 3: 'deceased-name' };  /* tangentbordet ska inte Ã¶ppnas automatiskt pÃ¥ personnr-steget */

function obShowStep(step) {
  const el = document.getElementById(`ob-step-${step}`);
  if (!el) return;
  el.classList.add('active');
  obCurrentStep = step;
  obUpdateDots(step);
  const backButton = document.getElementById('ob-back-btn');
  backButton.style.visibility = 'visible';
  backButton.textContent = step === 1 ? 'â† Avsluta' : 'â† Tillbaka';
  // Update label dynamically
  const labelEl = el.querySelector('.ob-label');
  if (labelEl) {
    labelEl.textContent = `Steg ${Math.min(step, OB_TOTAL)} av ${OB_TOTAL}`;
  }
  // Put focus in the newly shown step so keyboard and screen-reader users
  // are not left on a control that has just been hidden.
  const heading = el.querySelector('.ob-title');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    setTimeout(() => {
      if (el.classList.contains('active')) heading.focus({ preventScroll: true });
    }, 220);
  }
  if (OB_FOCUS_IDS[step]) {
    setTimeout(() => document.getElementById(OB_FOCUS_IDS[step])?.focus(), 350);
  }
  // Update visual progress bar
  const fillEl = document.getElementById('ob-progress-bar-fill');
  if (fillEl) {
    fillEl.style.transform = `scaleX(${Math.min(step, OB_TOTAL) / OB_TOTAL})`;
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
  track('plan_generated', { relation: state.relation || 'okÃ¤nd', has_death_date: !!state.deathDate });
  adsConversion(ADS_LABEL_PLAN); // mjuk konvertering â€” personlig plan skapad
  showScreen('screen-plan');
}

// â”€â”€â”€ RULE ENGINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Each task: id, title, desc, urgency, time, link, phone?, triggers, hasDoc?, notesPlaceholder?
const TASK_LIBRARY = [

  // â”€â”€ ALWAYS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // "Konstatera dÃ¶dsfallet" ligger absolut fÃ¶rst â€” det Ã¤r det enda som
  // mÃ¥ste ske innan nÃ¥got annat, och kan bockas av direkt om sjukhus/
  // lÃ¤kare redan gjort det.
  {
    id: 'konstatera_dodsfall',
    title: 'Konstatera dÃ¶dsfallet',
    desc: '<strong>Om dÃ¶dsfallet var ovÃ¤ntat eller plÃ¶tsligt â€” ring 112 omedelbart.</strong><br><br>Om personen avled hemma efter en lÃ¤ngre tids sjukdom ringer du jourhavande lÃ¤kare via 1177 â€” de skickar en lÃ¤kare som utfÃ¤rdar dÃ¶dsbeviset. Utan ett utfÃ¤rdat dÃ¶dsbevis kan inget annat steg pÃ¥bÃ¶rjas.<br><br>Har sjukhus, hospice eller lÃ¤kare redan konstaterat dÃ¶dsfallet? DÃ¥ Ã¤r det hÃ¤r steget klart â€” bocka av det.',
    urgency: 'today',
    time: 'Direkt',
    phone: '112',
    phone2: '1177',
    triggers: [],
    notesPlaceholder: 'Noterat klockslag, vem som kontaktadesâ€¦',
  },
  {
    id: 'viktiga_dokument',
    title: 'Hitta viktiga dokument',
    desc: 'Samla dessa pÃ¥ ett stÃ¤lle â€” du behÃ¶ver dem gÃ¥ng pÃ¥ gÃ¥ng de kommande veckorna:<br><br><strong>Prioritera:</strong><br>â€” Testamente (bankfack, hos notarie, bland papper)<br>â€” DÃ¶dsfallsintyg nÃ¤r det anlÃ¤nder<br>â€” FÃ¶rsÃ¤kringsbrev (livfÃ¶rsÃ¤kring, TGL via arbetsgivare)<br>â€” Ã„ktenskapsfÃ¶rord eller samboavtal<br>â€” Bankuppgifter och kontoutdrag<br>â€” ID-handlingar (pass, kÃ¶rkort)<br>â€” Fullmakter, avtal och kvitton pÃ¥ lÃ¥n',
    urgency: 'today',
    time: 'ca 1 tim',
    link: null,
    triggers: [],
    resources: [
      { label: 'Skatteverket â€” bestÃ¤ll dÃ¶dsfallsintyg', url: 'https://www.skatteverket.se/privat/folkbokforing/dodsfall.html' },
    ],
  },
  {
    id: 'narmaste_anhÃ¶rig',
    title: 'Meddela nÃ¤rstÃ¥ende',
    desc: 'Det hÃ¤r sker i etapper â€” du behÃ¶ver inte nÃ¥ alla pÃ¥ en gÃ¥ng. BÃ¶rja med de allra nÃ¤rmaste: familj och nÃ¤ra vÃ¤nner. Ã–vriga kan meddelas under de kommande dagarna. Det Ã¤r okej att be nÃ¥gon annan hjÃ¤lpa till. LÃ¤gg till personer i listan nedan och bocka av vartefter du nÃ¥r dem.',
    urgency: 'today',
    time: 'Din tid',
    link: null,
    triggers: [],
  },
  {
    id: 'begravningsbyra',
    title: 'Kontakta en begravningsbyrÃ¥',
    desc: 'BegravningsbyrÃ¥n tar hand om kroppen, skÃ¶ter registreringen hos Skatteverket och hjÃ¤lper dig planera ceremonin. Du behÃ¶ver inte ha alla svar klara nÃ¤r du ringer â€” de guidar dig. NÃ¥gra alternativ:',
    urgency: 'today',
    time: 'ca 30 min',
    link: null,
    triggers: [],
    resources: [
      { label: 'Fonus â€” Sveriges stÃ¶rsta, hitta byrÃ¥ nÃ¤ra dig', url: 'https://www.fonus.se' },
      { label: 'Memorial â€” rikstÃ¤ckande kedja', url: 'https://www.memorial.se' },
      { label: 'SBF â€” branschfÃ¶rbundets byrÃ¥sÃ¶k', url: 'https://www.sbf.se' },
    ],
    notesPlaceholder: 'ByrÃ¥ kontaktad, kontaktperson, datum och tid fÃ¶r mÃ¶teâ€¦',
  },
  {
    id: 'dodsbevis',
    title: 'BestÃ¤ll dÃ¶dsfallsintyg',
    desc: 'DÃ¶dsbeviset utfÃ¤rdas automatiskt av lÃ¤karen. Det du behÃ¶ver bestÃ¤lla Ã¤r <strong>dÃ¶dsfallsintyg med slÃ¤ktutredning</strong> frÃ¥n Skatteverket â€” det Ã¤r detta dokument som banker, fÃ¶rsÃ¤kringsbolag och myndigheter krÃ¤ver fÃ¶r att du ska fÃ¥ fÃ¶retrÃ¤da dÃ¶dsboet. Ha den <em>avlidnas</em> personnummer tillgÃ¤ngligt.',
    urgency: 'today',
    time: 'ca 15 min',
    link: 'https://www.skatteverket.se/privat/folkbokforing/dodsfall.html',
    phone: '0771-567 567',
    triggers: [],
    notesPlaceholder: 'Ã„rendenummer, vem som bestÃ¤llde, fÃ¶rvÃ¤ntat datumâ€¦',
  },
  {
    id: 'nycklar_post',
    title: 'SÃ¤kra nycklar och eftersÃ¤nd post',
    desc: 'Ta hand om bostadsnycklar och gÃ¶r en adressÃ¤ndring fÃ¶r den avlidnes post via adressÃ¤ndring.se. Viktiga brev kan annars gÃ¥ fÃ¶rlorade. Hade den avlidna digital myndighetspost (Kivra eller Min myndighetspost) blir den normalt inte tillgÃ¤nglig fÃ¶r dÃ¶dsboet automatiskt â€” kontrollera separat om det finns brev dÃ¤r ocksÃ¥.',
    urgency: 'today',
    time: 'ca 20 min',
    link: 'https://www.adressandring.se',
    triggers: [],
    notesPlaceholder: 'Var finns nycklarna? AdressÃ¤ndring gjord hos Postnord?',
  },
  // Placerad hÃ¤r (inte lÃ¤ngst ner bland "later"-uppgifterna) eftersom urgency:'today'
  // fÃ¶rutsÃ¤tter att positionen i TASK_LIBRARY matchar â€” markTaskDone()s "scrolla till
  // nÃ¤sta uppgift" letar i array-ordning, inte i renderad sektionsordning.
  {
    id: 'sorgstod',
    title: 'Ta hand om dig sjÃ¤lv',
    desc: `Det praktiska tar tid och energi â€” men sorgen krÃ¤ver sin egen plats.<br><br>
Du behÃ¶ver inte ha allt under kontroll. Det Ã¤r normalt att kÃ¤nna sig utmattad, arg, lÃ¤ttad, tom eller allt pÃ¥ en gÃ¥ng.<br><br>
<strong>Prata med nÃ¥gon:</strong><br>
â€” <em>1177 Sorgelinjen</em>: Ring 1177 och be om att bli kopplad till sorgestÃ¶d.<br>
â€” <em>SPES</em> (Suicidprevention och efterlevandestÃ¶d): spes.se, fÃ¶r dig som fÃ¶rlorat nÃ¥gon till sjÃ¤lvmord.<br>
â€” <em>Kyrkans stÃ¶d</em>: Oavsett tro erbjuder Svenska kyrkan samtalsstÃ¶d â€” kontakta nÃ¤rmaste kyrka.<br><br>
Det finns ingen tidsgrÃ¤ns fÃ¶r sorg, och du behÃ¶ver inte vara klar.`,
    urgency: 'today',
    time: 'Din tid',
    link: 'https://www.1177.se/liv-halsa/psykisk-halsa/sorg/',
    triggers: [],
    notesPlaceholder: 'Vad hjÃ¤lper dig just nu? Ã„r det nÃ¥gon du vill ringa?',
  },

  // â”€â”€ WEEK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'begravningsceremoni',
    title: 'Planera begravningsceremonin',
    desc: 'BestÃ¤m vem i familjen som ansvarar fÃ¶r vad â€” och se till att nÃ¥gon fÃ¶rmedlar era Ã¶nskemÃ¥l till begravningsbyrÃ¥n.<br><br>Vem ansvarar fÃ¶r musik? Vem hÃ¥ller tal? Vem ordnar minnesstunden? Vem samlar in den avlidnas eventuella Ã¶nskemÃ¥l?',
    urgency: 'week',
    time: 'ca 30 min med familjen',
    link: null,
    triggers: [],
    notesPlaceholder: 'Vem ansvarar fÃ¶r vad â€” musik, tal, minnesstund, Ã¶nskemÃ¥lâ€¦',
  },
  {
    id: 'fullmakt_dodsbo',
    title: 'UpprÃ¤tta fullmakt fÃ¶r dÃ¶dsboet',
    urgency: 'week',
    time: 'ca 30 min',
    desc: 'NÃ¤r ni Ã¤r flera som Ã¤rver mÃ¥ste normalt alla godkÃ¤nna varje Ã¥tgÃ¤rd â€” vilket snabbt blir tungrott. LÃ¶sningen Ã¤r att alla skriver en fullmakt till en person som fÃ¥r agera fÃ¶r er gemensamt: betala rÃ¤kningar, kontakta banker och hantera lÃ¶pande Ã¤renden. Fullmakten mÃ¥ste visas upp i original vid bankbesÃ¶k.',
    link: null,
    triggers: [],
    digital: 'fysisk',
    hasDoc: 'fullmakt',
  },
  {
    id: 'bouppteckning',
    title: 'Planera bouppteckningen',
    desc: '<details class="info-box"><summary>Juridiskt ansvar</summary><p>Bouppteckning Ã¤r ett juridiskt ansvar. Den ska fÃ¶rrÃ¤ttas inom tre mÃ¥nader frÃ¥n dÃ¶dsfallet och lÃ¤mnas till Skatteverket inom en mÃ¥nad dÃ¤refter. Ansvaret ligger pÃ¥ den dÃ¶dsbodelÃ¤gare som har egendomen i sin vÃ¥rd â€” oftast efterlevande make/maka, sambo eller barn. Om boet saknar tillgÃ¥ngar utÃ¶ver begravningskostnader rÃ¤cker det ofta med en dÃ¶dsboanmÃ¤lan istÃ¤llet.</p></details>En bouppteckning Ã¤r en fÃ¶rteckning Ã¶ver den avlidnes tillgÃ¥ngar och skulder. Den ska vara klar inom 3 mÃ¥nader och skickas till Skatteverket inom 4 mÃ¥nader.<br><br><strong>Ã„r boet litet?</strong> Om tillgÃ¥ngarna knappt tÃ¤cker begravnings- och bouppteckningskostnaderna kan du istÃ¤llet gÃ¶ra en <em>dÃ¶dsboanmÃ¤lan</em> hos kommunens socialtjÃ¤nst â€” det Ã¤r gratis och enklare. Kontakta socialtjÃ¤nsten fÃ¶r att se om det gÃ¤ller dig.<br><br><strong>GÃ¶ra sjÃ¤lv:</strong> MÃ¶jligt om boet Ã¤r enkelt (bara bankmedel och lÃ¶sÃ¶re). KrÃ¤ver tvÃ¥ utomstÃ¥ende vittnen som inte Ã¤r arvingar. Sparar 6 500â€“15 000 kr.<br><strong>Anlita jurist:</strong> Rekommenderas vid fastighet, fÃ¶retag, testamente eller om arvingarna inte Ã¤r Ã¶verens. ByrÃ¥erna nedan Ã¤r fÃ¶rslag fÃ¶r att komma igÃ¥ng â€” det finns mÃ¥nga andra jurister och byrÃ¥er att vÃ¤lja bland.',
    urgency: 'week',
    time: 'Kontakta jurist inom veckan',
    link: null,
    triggers: [],
    digital: 'fysisk',
    resources: [
      { label: 'Familjens Jurist â€” rikstÃ¤ckande, specialiserade pÃ¥ dÃ¶dsbon', url: 'https://www.familjens-jurist.se' },
      { label: 'Advokatsamfundet â€” hitta advokat nÃ¤ra dig', url: 'https://www.advokatsamfundet.se/hitta-advokat' },
    ],
    notesPlaceholder: 'Jurist kontaktad, offert, datum fÃ¶r fÃ¶rrÃ¤ttningâ€¦',
  },
  // â”€â”€ CONDITIONAL: DÃ¶dsboanmÃ¤lan (T189) â€” ersÃ¤tter bouppteckning fÃ¶r mycket smÃ¥ dÃ¶dsbon â”€â”€
  {
    id: 'dodsboanmalan',
    title: 'GÃ¶r dÃ¶dsboanmÃ¤lan hos kommunens socialtjÃ¤nst',
    desc: 'Eftersom dÃ¶dsboets tillgÃ¥ngar bara tÃ¤cker begravningskostnaden (och det inte finns fastighet eller bostadsrÃ¤tt) kan ni gÃ¶ra en <em>dÃ¶dsboanmÃ¤lan</em> istÃ¤llet fÃ¶r en full bouppteckning â€” det Ã¤r gratis och enklare.<br><br><strong>SÃ¥ gÃ¥r det till:</strong> Kontakta kommunens socialtjÃ¤nst (inte Skatteverket â€” de tar bara emot den fÃ¤rdiga anmÃ¤lan). SocialtjÃ¤nsten begÃ¤r vanligen kontoutdrag fÃ¶r de senaste 3 mÃ¥naderna och gÃ¶r ett hembesÃ¶k i bostaden, som bÃ¶r lÃ¤mnas orÃ¶rd fram till dess.<br><br>AnmÃ¤lan bÃ¶r vara kommunen tillhanda inom ungefÃ¤r 2 mÃ¥nader efter dÃ¶dsfallet â€” kortare tidsram Ã¤n bouppteckningens 3â€“4 mÃ¥nader. Ingen bouppteckning behÃ¶ver gÃ¶ras, men skulderna fÃ¶rsvinner inte â€” det Ã¤r bara den formella utredningsplikten som faller bort.',
    urgency: 'week',
    time: 'Kontakta kommunen inom veckan',
    link: null,
    triggers: ['litetDodsbo'],
    digital: 'fysisk',
    notesPlaceholder: 'SocialtjÃ¤nsten kontaktad, hembesÃ¶k bokat, kontoutdrag ordnatâ€¦',
  },
  // â”€â”€ CONDITIONAL: Bodelning-pÃ¥minnelse (T190) â€” triggas av civilstÃ¥nd, inte antal barn â”€â”€
  {
    id: 'bodelning_paminnelse',
    title: 'Kontrollera om bodelning behÃ¶ver gÃ¶ras',
    desc: 'Var den avlidna gift eller sambo kan bodelning behÃ¶va gÃ¶ras <strong>innan</strong> arvet fÃ¶rdelas.<br><br><strong>Gift:</strong> Bodelning omfattar hela giftorÃ¤ttsgodset (det som inte Ã¤r enskild egendom) â€” den efterlevande maken/makan har normalt rÃ¤tt till hÃ¤lften innan resten gÃ¥r till arvskifte.<br><strong>Sambo:</strong> Bodelning omfattar bara samboegendom (gemensam bostad och bohag som skaffats fÃ¶r gemensamt bruk) â€” inte hela boet, och bara om den efterlevande sambon begÃ¤r det inom ett Ã¥r.',
    urgency: 'week',
    time: 'ca 20 min',
    link: null,
    triggers: ['giftSambo'],
    notesPlaceholder: 'Bodelning behÃ¶vs? Vem hjÃ¤lper till â€” jurist, egen Ã¶verenskommelseâ€¦',
  },
  // SlÃ¥r ihop den tidigare "Kontrollera bostadsrÃ¤ttens framtid" (make-triggad) i denna â€”
  // samma beslut, oavsett om det Ã¤r du eller nÃ¥gon annan som fyller i formulÃ¤ret.
  // Flyttad hit (bredvid bouppteckningen) eftersom bostadens framtid Ã¤r ett beslut som
  // hÃ¶r ihop med bouppteckningen, inte nÃ¥got som hÃ¶r hemma bland de administrativa
  // sÃ¤ljstegen lÃ¤ngre ner.
  // Trigger Ã¤r bara 'fastighet' (inte 'make') â€” "Ã„gde sin bostad" fÃ¥ngar redan Ã¤gande
  // oavsett relation, och 'make' ensam skulle visa uppgiften Ã¤ven fÃ¶r en efterlevande
  // vars avlidna partner bara hyrde (inget att besluta om dÃ¥).
  {
    id: 'fastighet_boende',
    title: 'Besluta om bostadens framtid',
    desc: 'Ska bostaden sÃ¤ljas, Ã¶vertas av anhÃ¶rig, eller hyras ut? Ta detta beslut med alla delÃ¤gare i boet. BestÃ¤mmer ni er fÃ¶r att sÃ¤lja via mÃ¤klare skÃ¶ter de sedan visning, budgivning och kÃ¶pekontrakt Ã¥t er â€” det behÃ¶ver ni inte ha koll pÃ¥ sjÃ¤lva.<br><br>Bor eller bodde ni i en bostadsrÃ¤tt tillsammans â€” kontakta bostadsrÃ¤ttsfÃ¶reningen om hur Ã¶verlÃ¥telse eller fortsatt boende hanteras. BRF:en behÃ¶ver godkÃ¤nna en ny Ã¤gare.',
    urgency: 'week',
    time: 'Diskussion med familjen',
    link: null,
    triggers: ['fastighet'],
    notesPlaceholder: 'Beslut om bostaden, kontaktad mÃ¤klare, arvinge eller BRFâ€¦',
  },
  {
    id: 'bank_kontakt',
    title: 'Kontakta banken',
    desc: 'Meddela banken om dÃ¶dsfallet sÃ¥ att kontona hanteras korrekt. Ha dÃ¶dsbevis och personnummer redo. Skriv ned vilka banker du kÃ¤nner till nedan â€” du kan fylla pÃ¥ efterhand.',
    urgency: 'week',
    time: 'ca 30 min',
    link: null,
    triggers: [],
    digital: 'hybrid',
    hasDoc: 'bank',
    notesPlaceholder: 'Vet du vilka banker? Skriv de du kÃ¤nner till â€” det Ã¤r okej att bÃ¶rja med en. (t.ex. Swedbank, SEB, Nordeaâ€¦)',
    resources: [
      { label: 'Swedbank â€” dÃ¶dsbo & efterlevande', url: 'https://www.swedbank.se/privat/mer-fran-swedbank/dodsfall.html' },
      { label: 'SEB â€” nÃ¤r nÃ¥gon gÃ¥tt bort', url: 'https://seb.se/privat/dodsfall' },
      { label: 'Nordea â€” dÃ¶dsfall och dÃ¶dsbo', url: 'https://www.nordea.se/privat/livshÃ¤ndelser/dodsfall/' },
      { label: 'Handelsbanken â€” dÃ¶dsfall', url: 'https://www.handelsbanken.se/sv/privat/livet/dodsfall' },
      { label: 'LÃ¤nsfÃ¶rsÃ¤kringar Bank â€” dÃ¶dsfall', url: 'https://www.lansforsakringar.se/privat/bank/dodsfall/' },
      { label: 'Skandiabanken â€” dÃ¶dsfall', url: 'https://www.skandia.se/bank/dodsfall/' },
    ],
  },
  {
    id: 'forsakringar',
    title: 'GÃ¥ igenom fÃ¶rsÃ¤kringar',
    desc: `FÃ¶rsÃ¤kringar kan ge stora belopp som riskerar att aldrig sÃ¶kas â€” gÃ¶r en systematisk genomgÃ¥ng.<br><br>
<strong>TGL (TjÃ¤nstegrupplivfÃ¶rsÃ¤kring)</strong> â€” De flesta anstÃ¤llda med kollektivavtal har detta. BegravningshjÃ¤lp: ~29 400 kr till dÃ¶dsboet. Grundbelopp till partner/barn: upp till ~350 000 kr. MÃ¥ste sÃ¶kas manuellt hos t.ex. Afa, Folksam eller KPA.<br><br>
<strong>Hitta dolda fÃ¶rsÃ¤kringar:</strong> GÃ¥ igenom bankutdrag efter premiebetalningar. Kontakta arbetsgivare och fackfÃ¶rbund. Ring de fyra stora (Folksam, If, LÃ¤nsfÃ¶rsÃ¤kringar, Trygg-Hansa) och frÃ¥ga om den avlidne hade engagemang.`,
    urgency: 'week',
    time: 'ca 1â€“2 timmar',
    link: null,
    triggers: [],
    digital: 'hybrid',
    hasDoc: 'forsakring',
    notesPlaceholder: 'Vet du nÃ¥got fÃ¶rsÃ¤kringsbolag? Skriv det du hittar â€” ett i taget Ã¤r bra nog. (t.ex. Folksam, If, Skandia, Afaâ€¦)',
    resources: [
      { label: 'Afa FÃ¶rsÃ¤kring â€” TGL och dÃ¶dsfall', url: 'https://www.afaforsakring.se/privatperson/dodsfall/' },
      { label: 'Folksam â€” anmÃ¤lan vid dÃ¶dsfall', url: 'https://www.folksam.se/liv-halsa/nar-nagon-dor' },
    ],
  },
  {
    id: 'arbetsgivare',
    title: 'Kontakta arbetsgivaren och fackfÃ¶rbundet',
    desc: 'Meddela arbetsgivaren om dÃ¶dsfallet. Be dem bekrÃ¤fta om den avlidne haft TGL (TjÃ¤nstegrupplivfÃ¶rsÃ¤kring) via kollektivavtal â€” detta Ã¤r en livfÃ¶rsÃ¤kring som ger skattefritt engÃ¥ngsbelopp och mÃ¥ste sÃ¶kas aktivt. Kontakta Ã¤ven fackfÃ¶rbundet, mÃ¥nga har egna dÃ¶dsfallsfÃ¶rsÃ¤kringar via t.ex. Bliwa eller Folksam.',
    urgency: 'week',
    time: 'ca 30 min',
    link: null,
    triggers: [],
    notesPlaceholder: 'Arbetsgivare meddelad, TGL bekrÃ¤ftat, fackfÃ¶rbund kontaktatâ€¦',
  },

  {
    id: 'forsakringskassan',
    title: 'Kontakta FÃ¶rsÃ¤kringskassan',
    desc: `FÃ¶rsÃ¤kringskassan fÃ¥r automatiskt besked om dÃ¶dsfallet via folkbokfÃ¶ringen â€” samma uppgift som Skatteverket registrerar. Det stoppar dock <strong>inte</strong> alltid pÃ¥gÃ¥ende utbetalningar automatiskt, och det startar <strong>aldrig</strong> nya fÃ¶rmÃ¥ner du kan ha rÃ¤tt till â€” dÃ¤rfÃ¶r behÃ¶ver du Ã¤ndÃ¥ kontakta dem aktivt.<br><br>
<strong>Stoppa manuellt vid behov:</strong> Barnbidrag, bostadsbidrag, sjukpenning och andra bidrag avslutas inte alltid automatiskt â€” kontakta FK fÃ¶r att undvika Ã¥terkrav.<br><br>
<strong>AnsÃ¶k om:</strong><br>
â€” <em>Barnpension</em>: Barn under 20 Ã¥r kan ha rÃ¤tt till barnpension om en fÃ¶rÃ¤lder dÃ¶r.<br>
â€” <em>EfterlevandestÃ¶d</em>: Om barnpensionen inte rÃ¤cker fÃ¥r barnet efterlevandestÃ¶d upp till 18 Ã¥r.<br>
â€” <em>OmstÃ¤llningspension</em>: Efterlevande make/registrerad partner kan ansÃ¶ka om omstÃ¤llningspension i upp till 12 mÃ¥nader.<br><br>
Kontakta FK pÃ¥ telefon eller logga in pÃ¥ Mina sidor pÃ¥ forsakringskassan.se.`,
    urgency: 'week',
    time: 'ca 30 min',
    phone: '0771-524 524',
    link: 'https://www.forsakringskassan.se/privatperson/nar-nagon-dor',
    triggers: [],
    digital: 'digital',
    notesPlaceholder: 'Ã„renden Ã¶ppnade, Ã¤rendenummer, beviljade fÃ¶rmÃ¥nerâ€¦',
  },

  // â”€â”€ LATER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'autogiron_avsluta',
    title: 'Avsluta autogiron och e-fakturor',
    desc: 'LÃ¶pande betalningsuppdrag fortsÃ¤tter dra pengar frÃ¥n dÃ¶dsboets konton tills de aktivt avslutas. Bankerna kan ta fram en fullstÃ¤ndig lista Ã¶ver aktiva autogiron kopplade till ett konto.<br><br>Be banken om listan via nÃ¤rmaste kontor eller digitalt. Avsluta abonnemangen hos respektive leverantÃ¶r â€” banken kan spÃ¤rra betalningarna men inte avsluta avtalen.',
    urgency: 'later',
    time: 'ca 1â€“2 timmar',
    link: null,
    triggers: [],
    checklist: [
      { key: 'hyra',        label: 'Hyra / mÃ¥nadsavgift' },
      { key: 'el',          label: 'El, vatten, fjÃ¤rrvÃ¤rme' },
      { key: 'internet',    label: 'Internet, TV, mobilabonnemang' },
      { key: 'streaming',   label: 'Streaming (Spotify, Netflix, HBO)' },
      { key: 'tidningar',   label: 'Tidningsprenumerationer' },
      { key: 'gym',         label: 'Gymmedlemskap' },
      { key: 'larm',        label: 'LarmtjÃ¤nster' },
      { key: 'forsakring',  label: 'FÃ¶rsÃ¤kringspremier' },
    ],
    notesPlaceholder: 'Ã–vriga autogiron eller e-fakturorâ€¦',
  },
  {
    id: 'abonnemang',
    title: 'Avsluta abonnemang och prenumerationer',
    desc: 'SÃ¤g upp tjÃ¤nster en efter en. AnvÃ¤nd dokumentgeneratorn fÃ¶r att skapa uppsÃ¤gningsbrev.',
    urgency: 'later',
    time: 'ca 1â€“2 timmar',
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
    notesPlaceholder: 'Ã–vriga abonnemang eller tjÃ¤nsterâ€¦',
  },
  {
    id: 'arvskifte',
    title: 'FÃ¶rdela arvet',
    desc: 'NÃ¤r bouppteckningen Ã¤r klar och godkÃ¤nd av Skatteverket delas tillgÃ¥ngarna upp mellan arvingarna â€” enligt testamente eller enligt lag om inget testamente finns. GÃ¶rs ofta med hjÃ¤lp av jurist och kan ta tid om ni Ã¤r oense.',
    urgency: 'later',
    time: 'MÃ¥nader efter dÃ¶dsfallet',
    link: null,
    triggers: [],
    notesPlaceholder: 'Jurist anlitad, arvingar Ã¶verens, datum fÃ¶r skifteâ€¦',
  },
  {
    id: 'avsluta_konton',
    title: 'Avsluta digitala konton',
    desc: `Spara viktiga foton och dokument innan du stÃ¤nger konton. Varje plattform har egna rutiner:<br><br>
<strong>Facebook/Instagram:</strong> Kan minnesmÃ¤rkas eller raderas. KrÃ¤ver dÃ¶dsfallsintyg till supporten.<br>
<strong>Google:</strong> Kontrollera "Hantering av inaktiva konton" â€” utan fÃ¶rinstÃ¤llningar kan anhÃ¶riga begÃ¤ra data via supporten.<br>
<strong>Apple/iCloud:</strong> Utan en fÃ¶rutbestÃ¤md "digital arvskontakt" krÃ¤vs ofta domstolsbeslut fÃ¶r att fÃ¥ ut foton och filer.<br><br>
SÃ¤g Ã¤ven upp betaltjÃ¤nster som Klarna, PayPal, spelkonton â€” logga aldrig in med den avlidnes lÃ¶senord, anvÃ¤nd de officiella vÃ¤garna.`,
    urgency: 'later',
    time: 'ca 1â€“2 timmar',
    link: null,
    triggers: [],
    checklist: [
      { key: 'facebook',  label: 'Facebook / Instagram' },
      { key: 'google',    label: 'Google-konto (Gmail, Drive, Foton)' },
      { key: 'apple',     label: 'Apple / iCloud' },
      { key: 'email',     label: 'Ã–vrig e-post' },
      { key: 'klarna',    label: 'Klarna' },
      { key: 'paypal',    label: 'PayPal' },
      { key: 'streaming', label: 'Streaming (Spotify, Netflix m.fl.)' },
      { key: 'gaming',    label: 'Spelkonton' },
    ],
    notesPlaceholder: 'Ã–vriga konton att avslutaâ€¦',
  },
  {
    id: 'skattedeklaration',
    title: 'DÃ¶dsboets skattedeklaration',
    desc: 'DÃ¶dsboet Ã¤r skattskyldigt och kan behÃ¶va lÃ¤mna in en deklaration. Skatteverket har en egen guide fÃ¶r hur man deklarerar fÃ¶r ett dÃ¶dsbo â€” annars gÃ¥r det bra att kontakta en revisor.',
    urgency: 'later',
    time: 'Senast 2 maj efter dÃ¶dsÃ¥ret',
    link: 'https://www.skatteverket.se/privat/folkbokforing/narenanhorigdor/deklareradodsbo.4.3528414214b3f87580566e.html',
    triggers: [],
    digital: 'digital',
    notesPlaceholder: 'Deklaration inlÃ¤mnad, revisor anlitad, datumâ€¦',
  },

  // â”€â”€ CONDITIONAL: Fastighet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'fastighet_forsaljningsadmin',
    title: 'Visning, budgivning och kÃ¶pekontrakt',
    desc: 'Om ni sÃ¤ljer bostaden sjÃ¤lva (utan mÃ¤klare) behÃ¶ver dÃ¶dsboet skÃ¶ta visning, ta emot bud och upprÃ¤tta kÃ¶pekontrakt. Ta gÃ¤rna hjÃ¤lp av en jurist fÃ¶r sjÃ¤lva kontraktet â€” ett fel hÃ¤r kan bli kostsamt. Anlitar ni mÃ¤klare skÃ¶ter de allt detta Ã¥t er.',
    urgency: 'week',
    time: 'Veckor',
    link: null,
    triggers: ['fastighet'],
    maklarhanterad: true,
    notesPlaceholder: 'Visningar bokade, bud mottagna, kontrakt upprÃ¤ttatâ€¦',
  },
  {
    id: 'bostadsratt_brf',
    title: 'Kontakta bostadsrÃ¤ttsfÃ¶reningen',
    desc: 'Meddela fÃ¶reningen om dÃ¶dsfallet och frÃ¥ga vad som gÃ¤ller fÃ¶r Ã¶verlÃ¥telse av bostadsrÃ¤tten till arvinge eller fÃ¶rsÃ¤ljning. BRF:en behÃ¶ver godkÃ¤nna en ny Ã¤gare och har egna rutiner fÃ¶r detta.',
    urgency: 'week',
    time: 'ca 20 min',
    link: null,
    triggers: ['fastighet'],
    notesPlaceholder: 'BRF kontaktad, kontaktperson, beslut om Ã¶verlÃ¥telseâ€¦',
  },
  {
    id: 'lagfart',
    title: 'AnsÃ¶k om lagfart',
    desc: 'NÃ¤r en fastighet Ã¤rvs mÃ¥ste den nya Ã¤garen ansÃ¶ka om lagfart hos LantmÃ¤teriet. AnsÃ¶kan ska gÃ¶ras inom 3 mÃ¥nader frÃ¥n att bouppteckningen registrerats hos Skatteverket. Vid ett rent arvskifte (ingen arvinge betalar de andra) kostar det bara 825 kr i expeditionsavgift â€” ingen stÃ¤mpelskatt. LÃ¶ser en arvinge ut de andra med kontanter och ersÃ¤ttningen nÃ¥r 85 % eller mer av taxeringsvÃ¤rdet, tillkommer 1,5 % stÃ¤mpelskatt pÃ¥ den delen.',
    urgency: 'later',
    time: 'ca 30 min online',
    link: 'https://www.lantmateriet.se/sv/fastigheter/agande-och-rattigheter/lagfart/',
    triggers: ['fastighet'],
    digital: 'digital',
    notesPlaceholder: 'AnsÃ¶kan skickad, datum, stÃ¤mpelskatt berÃ¤knadâ€¦',
  },
  {
    id: 'lantbruk_fastighet',
    title: 'Lantbruks- eller skogsfastighet i dÃ¶dsboet',
    desc: 'Lantbruks- och skogsfastigheter kan ha sÃ¤rskilda regler utÃ¶ver det som gÃ¤ller fÃ¶r vanliga bostÃ¤der â€” t.ex. kring virkesfÃ¶rrÃ¥d, arrendeavtal och jordbruksstÃ¶d som ska Ã¶verfÃ¶ras eller avslutas. Kontakta Skogsstyrelsen eller Jordbruksverket om fastigheten Ã¤r aktiv, och en jurist som Ã¤r van vid lantbruksfastigheter fÃ¶r arvskiftet. LÃ¤s mer i vÃ¥r <a href="./dodsbo-fastighet.html" target="_blank" rel="noopener">guide om dÃ¶dsbo och fastighet</a>.',
    urgency: 'week',
    time: 'ca 1 timme',
    link: null,
    triggers: ['lantbruk'],
    notesPlaceholder: 'Arrendeavtal, jordbruksstÃ¶d, skogsbruksplanâ€¦',
  },

  // â”€â”€ CONDITIONAL: HyresrÃ¤tt â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'hyresratt_uppsagning',
    title: 'SÃ¤g upp hyreskontrakt',
    urgency: 'today',
    time: 'GÃ¶r inom 1 mÃ¥nad â€” annars lÃ¶per kontraktet vidare',
    desc: 'Hyreskontrakt upphÃ¶r inte automatiskt vid dÃ¶dsfall. SÃ¤g upp direkt till hyresvÃ¤rden skriftligen â€” om det gÃ¶rs inom en mÃ¥nad frÃ¥n dÃ¶dsfallet Ã¤r uppsÃ¤gningstiden normalt en mÃ¥nad. VÃ¤ntar du lÃ¤ngre lÃ¶per vanlig uppsÃ¤gningstid (ofta 3 mÃ¥nader). Ha dÃ¶dsbevis redo.',
    link: null,
    triggers: ['hyresratt'],
    digital: 'hybrid',
    hasDoc: 'letter',
  },

  // â”€â”€ CONDITIONAL: FÃ¶retag â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'foretag_bolagsverket',
    title: 'Meddela Bolagsverket om dÃ¶dsfall',
    desc: 'Om den avlidne hade ett aktiebolag eller enskild firma behÃ¶ver styrelse/dÃ¶dsbo meddela Bolagsverket.',
    urgency: 'week',
    time: 'ca 1 timme',
    link: 'https://www.bolagsverket.se',
    phone: '0771-670 670',
    triggers: ['foretag'],
    digital: 'digital',
    notesPlaceholder: 'AnmÃ¤lan skickad, Ã¤rendenummer, datumâ€¦',
  },
  {
    id: 'foretag_avveckling',
    title: 'Planera avveckling eller Ã¶verlÃ¥telse av fÃ¶retaget',
    desc: 'Ska bolaget avvecklas, sÃ¤ljas, eller tas Ã¶ver av en arvinge? Detta Ã¤r komplext och tidskÃ¤nsligt â€” anlita revisor och jurist tidigt.<br><br><strong>Om det finns aktiva kunder eller uppdrag:</strong> DÃ¶dsboet tar automatiskt Ã¶ver Ã¤garens rÃ¤ttigheter och skyldigheter. Kontakta kunderna och informera om dÃ¶dsfallet â€” var transparent om vad som hÃ¤nder. Kan pÃ¥gÃ¥ende avtal inte fullfÃ¶ljas, meddela motparten snarast och diskutera avslut i god anda.<br><br><strong>Praktiska steg nu:</strong><br>1. Kontakta fÃ¶retagets revisor och redovisningskonsult direkt.<br>2. SÃ¤kerstÃ¤ll att lÃ¶pande rÃ¤kningar, lÃ¶ner och moms hanteras â€” betalstopp sker inte automatiskt.<br>3. Meddela Bolagsverket om dÃ¶dsfallet (se uppgiften ovan).<br>4. AnvÃ¤nd <em>Dokument â†’ Skatteverket</em> hÃ¤rifrÃ¥n fÃ¶r att begÃ¤ra avregistrering av F-skatt.',
    urgency: 'week',
    time: 'Kontakta revisor',
    link: null,
    triggers: ['foretag'],
    notesPlaceholder: 'Revisor kontaktad, pÃ¥gÃ¥ende avtal identifierade, Ã¥tgÃ¤rderâ€¦',
  },

  // â”€â”€ CONDITIONAL: Skulder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'skulder_inventering',
    title: 'Inventera skulder noggrant',
    desc: 'Samla en komplett bild av lÃ¥n, krediter och obetalda rÃ¤kningar. Skulder betalas av dÃ¶dsboet innan arv utbetalas.<br><br><strong>Viktigt:</strong> Begravnings- och bouppteckningskostnader prioriteras fÃ¶re alla andra skulder. Om boet inte rÃ¤cker till kontaktar du borgenÃ¤rerna och begÃ¤r anstÃ¥nd tills bouppteckningen Ã¤r klar. Du som anhÃ¶rig Ã¤r <em>inte</em> personligt betalningsansvarig fÃ¶r den avlidnes skulder.<br><br>Lista varje skuld med borgenÃ¤r och belopp under fliken Bouppteckning â€” samma lista anvÃ¤nds dÃ¤r boets nettovÃ¤rde rÃ¤knas ut.',
    urgency: 'week',
    time: 'ca 1â€“2 timmar',
    link: null,
    triggers: ['skulder'],
    notesPlaceholder: 'Ã–vrigt att komma ihÃ¥g â€” t.ex. begÃ¤rt anstÃ¥nd, vÃ¤ntar svar frÃ¥n borgenÃ¤râ€¦',
  },
  {
    id: 'skulder_kronofogden',
    title: 'Kontrollera skulder hos Kronofogden',
    desc: 'Du kan begÃ¤ra ett skuldsaldo direkt hos Kronofogden fÃ¶r att se om det finns registrerade skulder.',
    urgency: 'week',
    time: 'ca 15 min',
    link: 'https://www.kronofogden.se',
    phone: '0771-73 73 00',
    triggers: ['skulder'],
    notesPlaceholder: 'Kontroll utfÃ¶rd, datum, eventuella skulder noteradeâ€¦',
  },

  // â”€â”€ CONDITIONAL: Utland â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'utland_juridik',
    title: 'HÃ¤mta juridisk rÃ¥dgivning fÃ¶r utlandstillgÃ¥ngar',
    desc: 'TillgÃ¥ngar i annat land â€” bankkonto, bostad, pension â€” lyder under det landets lagar och krÃ¤ver separat utredning. EU:s arvsfÃ¶rordning (nr 650/2012) gÃ¤ller om den hemmahÃ¶rande i Sverige dog inom EU, men utanfÃ¶r EU gÃ¤ller det lÃ¤ndets egna regler.<br><br><strong>BÃ¶rja med dessa steg:</strong><br>1. Kontakta banken i det andra landet och meddela dÃ¶dsfallet.<br>2. Anlita en jurist specialiserad pÃ¥ internationell arvsrÃ¤tt â€” frÃ¥ga begravningsbyrÃ¥n eller Advokatsamfundet.<br>3. HÃ¶r med Utrikesdepartementet om konsulÃ¤r hjÃ¤lp vid bostad eller tillgÃ¥ngar utanfÃ¶r EU.<br>4. Se till att bouppteckningen tÃ¤cker utlandstillgÃ¥ngarna â€” en svensk bouppteckning rÃ¤cker ofta inom EU, men ibland krÃ¤vs en lokal kopia.',
    urgency: 'week',
    time: 'Kontakta jurist',
    link: null,
    triggers: ['utland'],
    resources: [
      { label: 'Advokatsamfundet â€” hitta specialist i internationell arvsrÃ¤tt', url: 'https://www.advokatsamfundet.se/hitta-advokat' },
      { label: 'UD â€” konsulÃ¤r hjÃ¤lp vid dÃ¶dsfall utomlands', url: 'https://www.swedenabroad.se/sv/om-utlandet-for-svenska-medborgare/konsulart-bistand/' },
    ],
    notesPlaceholder: 'Land och tillgÃ¥ng, jurist kontaktad, datumâ€¦',
  },

  // â”€â”€ CONDITIONAL: MinderÃ¥rigt barn â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'minderarig_goman',
    title: 'Utred om god man behÃ¶vs fÃ¶r minderÃ¥rigt barn',
    desc: 'Om ett minderÃ¥rigt barn Ã¤r delÃ¤gare i dÃ¶dsboet kan en god man behÃ¶va utses fÃ¶r att representera barnet. En fÃ¶rÃ¤lder kan inte ensam fÃ¶retrÃ¤da sitt barn i ett dÃ¶dsbo dÃ¤r de sjÃ¤lva Ã¤r delÃ¤gare â€” det uppstÃ¥r en intressekonflikt.<br><br>Kontakta <strong>Ã¶verfÃ¶rmyndaren i din kommun</strong> â€” det Ã¤r de som hanterar detta. Du hittar dem via din kommuns hemsida (sÃ¶k "Ã¶verfÃ¶rmyndare [kommunens namn]"). Be om en handlÃ¤ggningstid direkt â€” processen kan ta nÃ¥gra veckor.',
    urgency: 'today',
    time: 'Kontakta Ã¶verfÃ¶rmyndaren',
    link: null,
    triggers: ['minderarig'],
    resources: [
      { label: 'Sveriges Kommuner och Regioner â€” hitta din Ã¶verfÃ¶rmyndare', url: 'https://skr.se/skr/demokratiledningstyrning/valmaktfordelning/overformyndare.html' },
    ],
    notesPlaceholder: 'Ã–verfÃ¶rmyndare kontaktad, kommun, handlÃ¤ggare, datumâ€¦',
  },

  // â”€â”€ CONDITIONAL: Ã„ktenskapsfÃ¶rord / samboavtal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'aktemanskapsforord',
    title: 'Kontrollera Ã¤ktenskapsfÃ¶rord / samboavtal',
    desc: 'Ã„ktenskapsfÃ¶rord och samboavtal avgÃ¶r vad som Ã¤r giftorÃ¤ttsgods (delas lika) respektive enskild egendom (tillfaller Ã¤garen). Det pÃ¥verkar direkt hur bouppteckningen ska upprÃ¤ttas och vad som ingÃ¥r i arvet.<br><br><strong>Hitta dokumentet:</strong> Bland papperen hemma, i bankfack, hos den jurist som upprÃ¤ttade det, eller via Skatteverket (Ã¤ktenskapsregistret).<br><br><strong>Om inget avtal finns:</strong> Hela giftorÃ¤ttsgodset ingÃ¥r i bouppteckningen â€” det ska delas lika mellan makarna.',
    urgency: 'week',
    time: 'ca 30 min + jurist vid behov',
    link: null,
    // Trigger pÃ¥ giftSambo (var den avlidne gift/sambo?) â€” inte bara 'make' (Ã¤r DU
    // maken/makan). En bouppteckning pÃ¥verkas av Ã¤ktenskapsfÃ¶rord oavsett vem som fyller i.
    triggers: ['giftSambo', 'make'],
    resources: [
      { label: 'Skatteverket â€” Ã¤ktenskapsregistret', url: 'https://www.skatteverket.se/privat/folkbokforing/aktenskapochpartnerskap/aktenskapsregistret.html' },
    ],
    notesPlaceholder: 'Hittat Ã¤ktenskapsfÃ¶rord? Var? InnehÃ¥ll och konsekvenserâ€¦',
  },

  // â”€â”€ ALWAYS: LivfÃ¶rsÃ¤kringsersÃ¤ttning â”€â”€â”€â”€â”€â”€
  {
    id: 'livforsakring_ansokan',
    title: 'AnsÃ¶k om livfÃ¶rsÃ¤kringsersÃ¤ttning',
    desc: 'En livfÃ¶rsÃ¤kring betalar ut ett skattefritt belopp vid dÃ¶dsfall. AnsÃ¶kan sker <em>inte</em> automatiskt â€” du mÃ¥ste aktivt kontakta varje fÃ¶rsÃ¤kringsbolag.<br><br><strong>Tre stÃ¤llen att leta:</strong><br>1. <em>Privat livfÃ¶rsÃ¤kring</em> â€” hos fÃ¶rsÃ¤kringsbolaget (Folksam, If, Skandia, LÃ¤nsfÃ¶rsÃ¤kringar m.fl.)<br>2. <em>TGL (TjÃ¤nstegrupplivfÃ¶rsÃ¤kring)</em> â€” via arbetsgivaren om den avlidne haft kollektivavtal. Kontakta Afa, Folksam eller KPA beroende pÃ¥ sektor.<br>3. <em>FackfÃ¶rbundets livfÃ¶rsÃ¤kring</em> â€” mÃ¥nga fackfÃ¶rbund har egna livfÃ¶rsÃ¤kringar via t.ex. Bliwa eller Folksam<br><br>Du behÃ¶ver dÃ¶dsfallsintyg och den fÃ¶rmÃ¥nstaginges personnummer. AnsÃ¶k sÃ¥ snart dÃ¶dsfallsintyget finns.',
    urgency: 'week',
    time: 'ca 1 tim per fÃ¶rsÃ¤kring',
    link: null,
    triggers: [],
    resources: [
      { label: 'Afa FÃ¶rsÃ¤kring â€” TGL och dÃ¶dsfall', url: 'https://www.afaforsakring.se/privatperson/dodsfall/' },
      { label: 'Konsumenternas â€” jÃ¤mfÃ¶r livfÃ¶rsÃ¤kringar', url: 'https://www.konsumenternas.se/forsakring/livforsakring/' },
    ],
    notesPlaceholder: 'FÃ¶rsÃ¤kringsbolag kontaktade, Ã¤rendenummer, belopp beviljadeâ€¦',
  },

  // â”€â”€ CONDITIONAL: VÃ¤rdepapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'vardepapper_hantering',
    title: 'Hantera aktier, fonder och vÃ¤rdepapper',
    desc: 'VÃ¤rdepapper och depÃ¥konton ingÃ¥r i bouppteckningen och ska vÃ¤rderas per dÃ¶dsdagen.<br><br><strong>Viktiga distinktioner:</strong><br>â€” <em>ISK och vanlig depÃ¥</em>: ingÃ¥r i dÃ¶dsboet och fÃ¶rdelas med arvet<br>â€” <em>KapitalfÃ¶rsÃ¤kring med namngiven fÃ¶rmÃ¥nstagare</em>: tillfaller fÃ¶rmÃ¥nstagaren <em>utanfÃ¶r</em> dÃ¶dsboet â€” ska Ã¤ndÃ¥ noteras i bouppteckningen men fÃ¶rdelas separat<br>â€” <em>TjÃ¤nstepension med fÃ¶rmÃ¥nstagare</em>: samma princip som kapitalfÃ¶rsÃ¤kring<br><br><strong>Steg nu:</strong><br>1. Kontakta banken/mÃ¤klaren och meddela dÃ¶dsfallet<br>2. BegÃ¤r en innehavsfÃ¶rteckning med vÃ¤rde per dÃ¶dsdagen<br>3. Kontakta Euroclear om aktier saknar kÃ¤nd depÃ¥',
    urgency: 'week',
    time: 'ca 1â€“2 timmar',
    link: null,
    triggers: ['vardepapper'],
    resources: [
      { label: 'Euroclear â€” aktieÃ¤garregistret', url: 'https://www.euroclear.com/sweden/sv/private-individuals/private-individuals-main.html' },
    ],
    notesPlaceholder: 'DepÃ¥er och konton identifierade, vÃ¤rden per dÃ¶dsdagenâ€¦',
  },

  // â”€â”€ CONDITIONAL: Barnpension â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'barnpension_ansokan',
    title: 'AnsÃ¶k om barnpension',
    desc: 'Barn under 20 Ã¥r som fÃ¶rlorat en fÃ¶rÃ¤lder kan ha rÃ¤tt till <em>barnpension</em> och <em>efterlevandestÃ¶d</em> frÃ¥n FÃ¶rsÃ¤kringskassan. AnsÃ¶kan Ã¤r inte automatisk â€” du mÃ¥ste aktivt ansÃ¶ka.<br><br><strong>Barnpension:</strong> Baseras pÃ¥ den avlidnes livsinkomst. SÃ¶ks via FÃ¶rsÃ¤kringskassan.<br><strong>EfterlevandestÃ¶d:</strong> Kompletterande stÃ¶d om barnpensionen Ã¤r lÃ¥g. Upp till 18 Ã¥r.<br><strong>TjÃ¤nstepension:</strong> Kontrollera om den avlidne hade ett efterlevandeskydd fÃ¶r barn i sin tjÃ¤nstepension.<br><br>AnsÃ¶k inom 1 Ã¥r â€” du kan inte fÃ¥ retroaktiv utbetalning lÃ¤ngre tillbaka.',
    urgency: 'week',
    time: 'ca 30 min',
    phone: '0771-524 524',
    link: 'https://www.forsakringskassan.se/privatperson/nar-nagon-dor/barnpension',
    triggers: ['barn'],
    digital: 'digital',
    notesPlaceholder: 'AnsÃ¶kan inlÃ¤mnad, Ã¤rendenummer, beviljade beloppâ€¦',
  },

  // â”€â”€ CONDITIONAL: OmstÃ¤llningspension â”€â”€â”€â”€â”€â”€
  {
    id: 'omstallningspension',
    title: 'AnsÃ¶k om omstÃ¤llningspension',
    desc: 'Som efterlevande make kan du ha rÃ¤tt till <em>omstÃ¤llningspension</em> i upp till 12 mÃ¥nader. Syftet Ã¤r att ge ekonomiskt stÃ¶d medan du stÃ¤ller om livet.<br><br><strong>Krav:</strong> Du och den avlidna mÃ¥ste ha bott ihop. Du ska inte vara i Ã¥lderspension.<br><strong>Retroaktiv utbetalning ges ej</strong> â€” ansÃ¶k snarast efter dÃ¶dsfallet.<br><br>Kontakta Pensionsmyndigheten fÃ¶r att kontrollera om du har rÃ¤tt och fÃ¶r att ansÃ¶ka.',
    urgency: 'week',
    time: 'ca 30 min',
    phone: '0771-776 776',
    link: 'https://www.pensionsmyndigheten.se/privatperson/nar-nagon-dor/omstallningspension',
    triggers: ['make'],
    digital: 'digital',
    notesPlaceholder: 'AnsÃ¶kan inlÃ¤mnad, Ã¤rendenummer, beviljad periodâ€¦',
  },

  // â”€â”€ CONDITIONAL: Make/maka â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'make_pension',
    title: 'Kontrollera efterlevandepension',
    desc: 'Som make/maka kan du ha rÃ¤tt till efterlevandepension. Kontakta Pensionsmyndigheten och eventuella tjÃ¤nstepensionsbolag.',
    urgency: 'week',
    time: 'ca 30 min',
    link: 'https://www.pensionsmyndigheten.se',
    phone: '0771-776 776',
    triggers: ['make'],
    notesPlaceholder: 'Kontaktad Pensionsmyndigheten, Ã¤rendenummer, tjÃ¤nstepensionsbolagâ€¦',
  },

  // â”€â”€ CONDITIONAL: Testamente â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'testamente_oppna',
    title: 'Ã–ppna och bevittna testamentet',
    desc: 'Testamentet ska delges alla arvingar. Ta hjÃ¤lp av en jurist om du Ã¤r osÃ¤ker pÃ¥ hur detta gÃ¶rs korrekt.',
    urgency: 'week',
    time: 'ca 1 timme',
    link: null,
    triggers: ['testamente'],
    digital: 'fysisk',
    notesPlaceholder: 'Testamente delgivet, datum, eventuell jurist anlitadâ€¦',
  },

  // â”€â”€ CONDITIONAL: Inget testamente â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'inget_testamente_koll',
    title: 'Kontrollera om testamente kan finnas',
    desc: 'Kolla i den avlidnes papper, bankfack och hos jurister. Det Ã¤r vanligare Ã¤n man tror att testamenten hittas senare.',
    urgency: 'week',
    time: 'ca 1 timme',
    link: null,
    triggers: ['inget_testamente'],
    notesPlaceholder: 'Kontrollerat papper, bankfack, jurister â€” resultatâ€¦',
  },

  // â”€â”€ CONDITIONAL: Fordon â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'fordon_transport',
    title: 'Byt Ã¤gare pÃ¥ fordon',
    urgency: 'later',
    time: 'ca 30 min + posthantering',
    desc: 'Fordon i ett dÃ¶dsbo krÃ¤ver en manuell process â€” de digitala tjÃ¤nsterna hos Transportstyrelsen fungerar inte nÃ¤r sÃ¤ljaren Ã¤r avliden. AnvÃ¤nd registreringsbevisets gula del (Del 2) i original. En dÃ¶dsbofÃ¶retrÃ¤dare skriver under i nuvarande Ã¤gares stÃ¤lle. Den nye Ã¤garen mÃ¥ste teckna trafikfÃ¶rsÃ¤kring frÃ¥n Ã¤garbytesdagen.',
    link: 'https://www.transportstyrelsen.se/sv/vagtrafik/fordon/agarbyte/',
    triggers: ['fordon'],
    notesPlaceholder: 'Fordon, ny Ã¤gare, registreringsbevis del 2 skickatâ€¦',
  },

  // â”€â”€ CONDITIONAL: Husdjur â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'husdjur_omplacering',
    title: 'Ordna omsorg fÃ¶r husdjur',
    urgency: 'week',
    time: 'Din tid',
    desc: 'Husdjur Ã¤r juridiskt lÃ¶s egendom och hanteras i bouppteckning och testamente. Om den avlidne hade hund mÃ¥ste Ã¤garbyte registreras i Jordbruksverkets hundregister av den nya Ã¤garen. BehÃ¶ver djuret omplaceras finns djurhem och uppfÃ¶dare som kan hjÃ¤lpa till.',
    link: 'https://www.jordbruksverket.se/djur/hundar-katter-och-harliga-djur/hundar/registrera-din-hund',
    triggers: ['husdjur'],
    notesPlaceholder: 'Djurets namn, ny Ã¤gare kontaktad, Ã¤garbyte registreratâ€¦',
  },

  // â”€â”€ ALWAYS: HjÃ¤lpmedel och mediciner â”€â”€â”€â”€â”€â”€
  {
    id: 'hjalpmedel_mediciner',
    title: 'Ã…terlÃ¤mna hjÃ¤lpmedel och mediciner',
    urgency: 'week',
    time: 'ca 30 min',
    desc: 'Rullstol, sÃ¤ng, lyft och andra medicintekniska produkter Ã¤r ofta lÃ¥n frÃ¥n regionen och ska Ã¥terlÃ¤mnas rengjorda. StÃ¶rre hjÃ¤lpmedel hÃ¤mtas ofta kostnadsfritt â€” ring regionen eller kommunen. Ã–verblivna mediciner (tabletter, sprutor, krÃ¤mer) lÃ¤mnas till nÃ¤rmaste apotek fÃ¶r sÃ¤ker destruktion.',
    triggers: [],
    notesPlaceholder: 'HjÃ¤lpmedel Ã¥terlÃ¤mnade, mediciner till apoteket, datumâ€¦',
  },

  // â”€â”€ ALWAYS: Bostadsavveckling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'bostadsavveckling',
    title: 'TÃ¶m och stÃ¤da bostaden',
    urgency: 'later',
    time: 'Dagarâ€“veckor',
    desc: 'Samordna med Ã¶vriga arvingar vad som sparas, sÃ¤ljas eller skÃ¤nks bort. GÃ¶r det i god tid â€” en tom bostad sÃ¤ljs snabbare och minskar lÃ¶pande hyra eller avgift som annars belastar dÃ¶dsboet.<br><br><strong>Donera / sÃ¤lja:</strong> Stadsmissionen, Myrorna och ErikshjÃ¤lpen hÃ¤mtar mÃ¶bler och klÃ¤der kostnadsfritt. Blocket och Facebook Marketplace fungerar bra fÃ¶r lÃ¶sa fÃ¶remÃ¥l. BegravningsbyrÃ¥n kan rekommendera lokala aktÃ¶rer.<br><br><strong>Anlita stÃ¤dhjÃ¤lp:</strong> Specialiserade dÃ¶dsbofÃ¶retag hanterar hel tÃ¶mning och stÃ¤d. Typisk kostnad: 5 000â€“20 000 kr beroende pÃ¥ bostadens storlek. Betalas ur dÃ¶dsboets tillgÃ¥ngar.<br><br><strong>RUT-avdraget gÃ¤ller inte dÃ¶dsbo</strong> â€” dÃ¶dsboet Ã¤r en juridisk person och Skatteverket medger inte skattereduktion.',
    triggers: [],
    notesPlaceholder: 'Vad ska sparas, sÃ¤ljas, skÃ¤nkas? Kontakter till stÃ¤dfirmaâ€¦',
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
  // T189: dÃ¶dsboanmÃ¤lan ersÃ¤tter bouppteckning bara om boet Ã¤r litet OCH ingen fastighet finns
  const useDodsboanmalan = state.litetDodsbo && !state.fastighet;
  if (useDodsboanmalan) triggers.add('litetDodsbo');
  // T193: strukturerat bostadsflÃ¶de â€” lantbruk/skog fÃ¥r en egen uppgift
  if (state.fastighet && state.bostadTyp === 'lantbruk') triggers.add('lantbruk');
  // "Anlitar ni mÃ¤klare?" filtrerar bort mÃ¤klarhanterade uppgifter â€” minskar bÃ¶rda
  const useMaklare = state.fastighet && state.maklare;

  state.tasks = TASK_LIBRARY.filter(task => {
    if (task.id === 'bouppteckning' && useDodsboanmalan) return false;
    if (task.id === 'dodsboanmalan' && !useDodsboanmalan) return false;
    if (task.maklarhanterad && useMaklare) return false;
    return task.triggers.length === 0 || task.triggers.some(t => triggers.has(t));
  }).map(task => ({ ...task, done: false, started: false }));

  loadTaskState();
}

// â”€â”€â”€ DEADLINE ENGINE (T135) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Ren datumaritmetik utifrÃ¥n dÃ¶dsdatumet â€” inget gissas, bara adderad tid.
// Om inget dÃ¶dsdatum Ã¤r ifyllt lÃ¤mnas TASK_LIBRARY:s statiska fristtext orÃ¶rd (fallback).
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

  // Bouppteckning (Ã„B 20 kap 1 Â§): fÃ¶rrÃ¤ttas inom 3 mÃ¥n, skickas till Skatteverket inom 4 mÃ¥n.
  const boupp = state.tasks.find(t => t.id === 'bouppteckning');
  if (boupp) {
    const boFrist  = addMonths(death, 3);
    const skvFrist = addMonths(death, 4);
    boupp.time = `Bouppteckning senast ${formatDate(boFrist)}`;
    boupp.desc = boupp.desc.replace(
      'Den ska vara klar inom 3 mÃ¥nader och skickas till Skatteverket inom 4 mÃ¥nader.',
      `Den ska vara klar senast <strong>${formatDate(boFrist)}</strong> och skickas till Skatteverket senast <strong>${formatDate(skvFrist)}</strong>.`
    );
    // DÃ¶dsboanmÃ¤lan (litet bo): hÃ¥lls mjuk med "runt"/"cirka" â€” exakt kommunregel Ã¤r overifierad,
    // och en falskt exakt deadline hÃ¤r skulle skapa onÃ¶dig stress snarare Ã¤n hjÃ¤lpa.
    const smaBo = addMonths(death, 2);
    boupp.desc = boupp.desc.replace(
      'Kontakta socialtjÃ¤nsten fÃ¶r att se om det gÃ¤ller dig.',
      `Kontakta socialtjÃ¤nsten fÃ¶r att se om det gÃ¤ller dig â€” gÃ¶r det gÃ¤rna runt <strong>${formatDate(smaBo)}</strong> eller tidigare (exakt frist varierar per kommun).`
    );
  }

  // HyresuppsÃ¤gning: kortare uppsÃ¤gningstid om det gÃ¶rs inom 1 mÃ¥nad frÃ¥n dÃ¶dsfallet.
  const hyra = state.tasks.find(t => t.id === 'hyresratt_uppsagning');
  if (hyra) {
    const hyresFrist = addDays(death, 30);
    hyra.time = `SÃ¤g upp senast ${formatDate(hyresFrist)} fÃ¶r kortare uppsÃ¤gningstid`;
  }

  track('deadline_dates_computed');
}

// Lagfart-fristen rÃ¤knas separat, eftersom den utgÃ¥r frÃ¥n datumet bouppteckningen
// registrerades hos Skatteverket â€” inte dÃ¶dsdatumet. Fylls i av anvÃ¤ndaren sjÃ¤lv
// pÃ¥ lagfart-uppgiften, nÃ¤r det datumet vÃ¤l finns.
const LAGFART_DEFAULT_TIME = 'ca 30 min online';

function applyLagfartDeadline() {
  const lagfart = state.tasks?.find(t => t.id === 'lagfart');
  if (!lagfart) return;
  if (!state.bouppRegDatum) { lagfart.time = LAGFART_DEFAULT_TIME; return; }
  const reg = new Date(state.bouppRegDatum + 'T00:00:00');
  if (isNaN(reg.getTime())) { lagfart.time = LAGFART_DEFAULT_TIME; return; }
  const frist = addMonths(reg, 3);
  lagfart.time = `AnsÃ¶k senast ${formatDate(frist)}`;
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

// â”€â”€â”€ NOTES (cached) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ HIDE DONE TASKS (per sektion + global) â”€â”€
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
  // Om nÃ¥gon sektion just nu visar klara uppgifter, dÃ¶ljer vi allt. Annars visar vi allt igen.
  const anyVisible = HIDE_DONE_SECTIONS.some(s => !hd[s]);
  HIDE_DONE_SECTIONS.forEach(s => { hd[s] = anyVisible; });
  _saveHideDone(hd);
  renderPlan();
}

function updateHideDoneButtons() {
  const hd = _getHideDone();
  HIDE_DONE_SECTIONS.forEach(section => {
    const btn = document.getElementById(`hide-done-${section}`);
    if (btn) btn.textContent = hd[section] ? 'Visa klara igen' : 'DÃ¶lj klara';
  });
  const globalBtn = document.getElementById('hide-done-all');
  if (globalBtn) {
    const anyVisible = HIDE_DONE_SECTIONS.some(s => !hd[s]);
    globalBtn.textContent = anyVisible ? 'DÃ¶lj alla klara uppgifter' : 'Visa alla klara uppgifter igen';
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


// â”€â”€â”€ RENDER PLAN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderPlan() {
  const name = state.name;
  document.getElementById('plan-title').textContent =
    name ? `Efter ${name}` : 'Din plan';
  document.getElementById('plan-sub').textContent =
    'Uppdateras allteftersom du gÃ¥r vidare. Det finns inget fel sÃ¤tt att bÃ¶rja.';

  const defEl = document.getElementById('plan-dodsbo-def');
  if (defEl) {
    const n = state.name || 'den som gick bort';
    defEl.textContent = `DÃ¶dsboet Ã¤r ett tillfÃ¤lligt begrepp fÃ¶r allt ${n} lÃ¤mnade efter sig â€” tillgÃ¥ngar och skulder. Det upphÃ¶r nÃ¤r allt Ã¤r fÃ¶rdelat.`;
  }

  const today  = state.tasks.filter(t => t.urgency === 'today');
  const week   = state.tasks.filter(t => t.urgency === 'week');
  const later  = state.tasks.filter(t => t.urgency === 'later');

  // â”€â”€ BÃ¶rja hÃ¤r-kort â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const firstTask = state.tasks.find(t => !t.done);
  const startEl   = document.getElementById('start-here');
  if (startEl) {
    if (firstTask) {
      startEl.innerHTML = `
        <div>
          <div class="start-here-label">BÃ¶rja hÃ¤r</div>
          <div class="start-here-title">${firstTask.title}</div>
        </div>
        <div class="start-here-arrow">â€º</div>`;
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
  const hyresBtn = document.getElementById('doc-btn-hyresvard');
  if (hyresBtn) hyresBtn.classList.toggle('hidden', !state.hyresratt);
  const pensionBtn = document.getElementById('doc-btn-pension');
  if (pensionBtn) pensionBtn.classList.toggle('hidden', !state.giftSambo && !state.barn);

  document.getElementById('count-today').textContent = `${today.length} uppgifter`;
  document.getElementById('count-week').textContent  = `${week.length} uppgifter`;
  document.getElementById('count-later').textContent = `${later.length} uppgifter`;

  // "Fylls pÃ¥ efterhand"-taggen bara nÃ¤r sektionen faktiskt Ã¤r gles â€”
  // annars sÃ¤ger den emot de uppgifter som redan stÃ¥r dÃ¤r.
  const weekTag  = document.querySelector('#section-week .section-coming-tag');
  const laterTag = document.querySelector('#section-later .section-coming-tag');
  if (weekTag)  weekTag.hidden  = week.length  > 1;
  if (laterTag) laterTag.hidden = later.length > 1;

  updateProgress();
  renderBills();
  renderDocuments();
}

let expandedTaskId = null;

function buildPreviewCTACard() {
  const cta = document.createElement('div');
  cta.className = 'preview-cta-card';
  cta.innerHTML = `
    <div class="preview-cta-lock" aria-hidden="true">ðŸ”’</div>
    <h3 class="preview-cta-title">LÃ¥s upp hela planen</h3>
    <p class="preview-cta-desc">Du har sett de fÃ¶rsta ${PREVIEW_STEPS} stegen. LÃ¥s upp alla Ã¥terstÃ¥ende uppgifter â€” engÃ¥ngsbetalning, ingen prenumeration.</p>
    <button class="btn-primary preview-cta-btn" onclick="handlePreviewCTA()">LÃ¥s upp â€” 49 kr</button>
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
    const isLocked  = LOCK_TASK_PREVIEW && PAYWALL_ENABLED && !isPremium() && globalIdx >= PREVIEW_STEPS;

    // T030: insert preview CTA once, right before the first locked task
    if (LOCK_TASK_PREVIEW && PAYWALL_ENABLED && !isPremium() && globalIdx === PREVIEW_STEPS) {
      container.appendChild(buildPreviewCTACard());
    }

    const wrap = document.createElement('div');
    wrap.className = 'task-wrap';
    wrap.id = `task-wrap-${task.id}`;
    if (task.done && sectionHideDone) wrap.classList.add('task-wrap--hidden-done');

    // T192 â€” digital/fysisk-indikator. Kopy utgÃ¥r alltid frÃ¥n att det Ã¤r den
    // EFTERLEVANDES eget BankID som anvÃ¤nds, aldrig den avlidnes (spÃ¤rras vid dÃ¶dsfall).
    const DIGITAL_LEVELS = {
      digital:  { emoji: 'ðŸŸ¢', title: 'GÃ¥r att gÃ¶ra digitalt, med ditt eget BankID' },
      hybrid:   { emoji: 'ðŸŸ¡', title: 'Delvis digitalt â€” vissa steg kan krÃ¤va telefon, mÃ¶te eller post' },
      fysisk:   { emoji: 'ðŸ”´', title: 'KrÃ¤ver post eller original i fysisk form' },
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
          <div class="task-lock" aria-hidden="true">ðŸ”’</div>
        </div>`;
      wrap.style.animationDelay = `${i * 35}ms`;
      wrap.classList.add('task-anim-in');
      container.appendChild(wrap);
      return;
    }

    const linkHtml = task.link
      ? `<a class="task-expand-link" href="${task.link}" target="_blank" rel="noopener">Ã–ppna ${task.link.replace('https://www.', '')} â†—</a>`
      : '';

    const phoneHtml = task.phone
      ? `<a class="task-expand-phone" href="tel:${task.phone.replace(/\s|-/g,'')}">Ring ${task.phone}</a>`
      : '';

    const phone2Html = task.phone2
      ? `<a class="task-expand-phone task-expand-phone--secondary" href="tel:${task.phone2.replace(/\s|-/g,'')}">Ring ${task.phone2}</a>`
      : '';

    // Lagfart-fristen (3 mÃ¥n) rÃ¤knas frÃ¥n datumet bouppteckningen registrerades hos
    // Skatteverket â€” inte dÃ¶dsdatumet. Frivilligt fÃ¤lt, syns bara pÃ¥ lagfart-uppgiften.
    const lagfartDateHtml = task.id === 'lagfart'
      ? `<label class="task-date-field">
           <span class="task-date-label">Datum dÃ¥ bouppteckningen registrerades hos Skatteverket</span>
           <input type="date" class="task-date-input" id="bopp-reg-datum-input" value="${state.bouppRegDatum || ''}"
             onclick="event.stopPropagation()" onchange="event.stopPropagation();setBouppRegDatum(this.value)">
         </label>`
      : '';

    const resourcesHtml = task.resources?.length
      ? `<div class="task-resources">${task.resources.map(r =>
          `<a class="task-resource-link" href="${r.url}" target="_blank" rel="noopener">${r.label} â†—</a>`
        ).join('')}</div>`
      : '';

    const notesHtml = task.notesPlaceholder && !task.done
      ? `<textarea class="task-notes" id="notes-${task.id}" placeholder="${task.notesPlaceholder}" rows="2"
           oninput="autoStartOnNote('${task.id}'); saveTaskNote('${task.id}', this.value)">${getTaskNote(task.id)}</textarea>`
      : '';

    const checklistHtml = task.checklist?.length ? renderTaskChecklist(task) : '';

    const notifyHtml = task.id === 'narmaste_anhÃ¶rig' ? renderNotifyList() : '';

    const docLocationHtml = task.id === 'viktiga_dokument' ? renderDocumentLocationList() : '';

    const bostadWidgetHtml = task.id === 'fastighet_boende' ? renderBostadWidget() : '';

    const docHtml = task.hasDoc && !task.done
      ? `<button class="task-expand-doc" onclick="event.stopPropagation();switchTab('docs');showDocForm('${task.hasDoc}')">Generera dokument â†’</button>`
      : '';

    // "Hitta viktiga dokument" ber anvÃ¤ndaren samla ihop papper men saknade
    // en vÃ¤g vidare till Arkiv-fliken (foto + AI-kategorisering, T143â€“T148)
    // dÃ¤r de faktiskt kan sparas. Kopplar ihop dem.
    const arkivLinkHtml = task.id === 'viktiga_dokument'
      ? `<button class="task-expand-doc" onclick="event.stopPropagation();switchTab('arkiv')">ðŸ“· Fota och spara dokumenten â†’</button>`
      : '';

    // "Inventera skulder noggrant" hade ett eget fritextfÃ¤lt som inte var kopplat
    // till Bouppteckningens skuldlista, dÃ¤r nettovÃ¤rdet faktiskt rÃ¤knas ut. LÃ¤nkar dit istÃ¤llet.
    const boppLinkHtml = task.id === 'skulder_inventering'
      ? `<button class="task-expand-doc" onclick="event.stopPropagation();switchTab('bopp')">ðŸ“‹ Lista skulder i Bouppteckning â†’</button>`
      : '';

    const doneHtml = task.done
      ? `<span class="task-expand-done">Klar âœ“</span>
         <button class="task-expand-undo-btn" onclick="event.stopPropagation();undoTaskDoneManual('${task.id}')">Markera som ej klar</button>`
      : task.started
      ? `<button class="task-expand-btn" onclick="event.stopPropagation();markTaskDone('${task.id}')">Markera som klar</button>`
      : `<button class="task-expand-start-btn" onclick="event.stopPropagation();markTaskStarted('${task.id}')">PÃ¥bÃ¶rjad</button>
         <button class="task-expand-btn" onclick="event.stopPropagation();markTaskDone('${task.id}')">Markera som klar</button>`;

    const isNext = !task.done && task.id === nextTaskId;
    const cardClass = task.done ? ' done' : task.started ? ' started' : (isNext ? ' task-card--next' : '');
    const checkClass = task.done ? ' checked' : task.started ? ' started' : '';
    const nextBadge = isNext ? `<span class="task-next-badge">NÃ¤sta steg</span>` : '';
    const startedBadge = task.started && !task.done
      ? `<span class="task-started-badge">PÃ¥bÃ¶rjad</span>`
      : '';

    wrap.innerHTML = `
      <div class="task-card${cardClass}" id="task-card-${task.id}">
        <div class="task-check${checkClass}" id="check-${task.id}"></div>
        <div class="task-body">
          <div class="task-title">${task.title}${digitalBadge}${nextBadge}</div>
          <div class="task-time">${task.time}${startedBadge}</div>
        </div>
        <div class="task-chevron" id="chevron-${task.id}" aria-hidden="true">â€º</div>
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
        ${bostadWidgetHtml}
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
    cardEl.setAttribute('aria-label', task.title + (isNext ? ', nÃ¤sta steg' : '') + (task.done ? ', klar' : task.started ? ', pÃ¥bÃ¶rjad' : ''));
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
      if (notesEl) notesEl.setAttribute('aria-label', `Anteckningar fÃ¶r ${task.title}`);
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

  if (fillEl) fillEl.style.transform = `scaleX(${total ? done / total : 0})`;

  if (done === total) {
    summaryEl.innerHTML = `<strong>${total} av ${total}</strong> uppgifter klara`;
    if (completionEl) completionEl.classList.add('visible');
    document.getElementById('plan-sub').textContent = 'Du har gÃ¥tt igenom allt. Ta ett djupt andetag.';
    setTimeout(showCompletionOverlay, 600);
  } else {
    summaryEl.innerHTML = `<strong>${done} av ${total}</strong> uppgifter klara`;
    if (completionEl) completionEl.classList.remove('visible');
  }

  // â”€â”€ Plan-done footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const doneFooter = document.getElementById('plan-done-footer');
  if (doneFooter) doneFooter.classList.toggle('hidden', done !== total);

  // â”€â”€ Section-done badges â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ['today', 'week', 'later'].forEach(section => {
    const urgencyMap = { today: 'today', week: 'week', later: 'later' };
    const sectionTasks = state.tasks.filter(t => t.urgency === urgencyMap[section]);
    if (sectionTasks.length === 0) return;
    const allDone = sectionTasks.every(t => t.done);
    const badge = document.getElementById(`badge-${section}`);
    if (badge) badge.classList.toggle('hidden', !allDone);
  });
}

// â”€â”€â”€ TASK CHECKLIST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ BILLS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      ${b.photo ? `<img class="bill-photo" src="${b.photo}" alt="Foto av rÃ¤kning" onclick="viewBillPhoto('${b.id}')">` : ''}
      <div class="bill-info">
        <span class="bill-desc">${escapeHtml(b.desc)}</span>
        ${b.amount ? `<span class="bill-amount">${escapeHtml(String(b.amount))} kr</span>` : ''}
        ${b.ocr ? `<span class="bill-ocr">OCR ${escapeHtml(b.ocr)}</span>` : ''}
      </div>
      <button class="bill-delete" onclick="deleteBill('${b.id}')" aria-label="Ta bort">Ã—</button>
    </li>`).join('');
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function viewBillPhoto(id) {
  const b = state.bills.find(b => b.id === id);
  if (!b || !b.photo) return;
  const w = window.open('', '_blank');
  if (w) { w.document.write(`<title>${escapeHtml(b.desc)}</title><body style="margin:0;background:#222;display:grid;place-items:center;min-height:100vh"><img src="${b.photo}" style="max-width:100%;max-height:100vh;object-fit:contain"></body>`); w.document.close(); }
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
// Dubblettdetektering: OCR/fakturareferens Ã¤r en starkare signal Ã¤n bildhash
// (samma faktura kan fotograferas i annan vinkel/ljus och fÃ¥ annan hash).
// Kollas en gÃ¥ng, hÃ¤r â€” inte mitt i skanningen â€” eftersom manuellt inmatade
// rÃ¤kningar (utan QR) bara gÃ¥r att jÃ¤mfÃ¶ra nÃ¤r desc/belopp/foto Ã¤r klara.
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
    const paidNote = dup.bill.paid ? ' Den Ã¤r redan markerad som BETALD.' : '';
    const reason = dup.matchType === 'ocr'
      ? `samma OCR-/fakturanummer (${ocr}) som "${dup.bill.desc}"`
      : `samma foto som "${dup.bill.desc}"`;
    const proceed = window.confirm(
      `Det hÃ¤r ser ut som ${reason}, som redan finns bland dina rÃ¤kningar.${paidNote} LÃ¤gga till den Ã¤ndÃ¥?`
    );
    if (!proceed) return; // formulÃ¤ret lÃ¤mnas Ã¶ppet â€” ingen spÃ¤rr, bara en paus
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

// â”€â”€â”€ BILL SCANNING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    s.onerror = () => reject(new Error('Kunde inte ladda QR-lÃ¤sare'));
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
    img.onerror = () => reject(new Error('Kunde inte lÃ¤sa bilden'));
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
  setBillScanStatus('LÃ¤ser rÃ¤kningâ€¦');
  try {
    const reader = new FileReader();
    const rawDataUrl = await new Promise((resolve, reject) => {
      reader.onload = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Kunde inte lÃ¤sa filen'));
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
      const desc = qr.nme || 'RÃ¤kning';
      document.getElementById('bill-desc-input').value = desc;
      if (qr.due) document.getElementById('bill-amount-input').value = String(qr.due);
      if (qr.iref && form) form.dataset.ocr = String(qr.iref);
      setBillScanStatus('Hittade fakturadata â€” kontrollera och spara.');
      track('bill_scanned_qr');
      setTimeout(() => setBillScanStatus(''), 5000);
    } else {
      // Ingen QR â€” samma AI-assist som Arkiv redan anvÃ¤nder (categorize-document)
      // fÃ¶reslÃ¥r avsÃ¤ndare/namn utifrÃ¥n fotot. Ren assist: misslyckas anropet
      // (nÃ¤tverk, saknad nyckel, rate-limit) faller vi bara tillbaka till manuell
      // ifyllning, precis som i Arkiv. Aldrig en spÃ¤rr.
      setBillScanStatus('FÃ¶reslÃ¥r avsÃ¤ndareâ€¦');
      const ai = await categorizeDocumentAI(compressed);
      if (ai?.name) {
        document.getElementById('bill-desc-input').value = ai.name;
        setBillScanStatus('Foto sparat â€” avsÃ¤ndare fÃ¶reslagen. Kontrollera och spara.');
        track('bill_scanned_categorized_ai');
      } else {
        setBillScanStatus('Foto sparat. Skriv beskrivning manuellt.');
        track('bill_scanned_photo_only');
      }
      setTimeout(() => setBillScanStatus(''), 5000);
    }
  } catch (err) {
    console.error('Bill scan error', err);
    setBillScanStatus('Det gick inte att lÃ¤sa bilden. FÃ¶rsÃ¶k igen.', true);
    setTimeout(() => setBillScanStatus(''), 5000);
  }
}

// â”€â”€â”€ ARKIV / DOKUMENTCENTRAL (T143â€“T148) â”€â”€â”€â”€â”€
let documentFilter = 'alla';
let expandedDocId = null; // id of the document whose "FÃ¶rklara"-panel is open, if any
const FLAG_LABELS = { viktig: 'Viktig', mellan: 'Kanske', onodig: 'OnÃ¶dig' };

function loadDocuments() {
  try { state.documents = JSON.parse(localStorage.getItem('efterplan_documents')) || []; } catch(e) { state.documents = []; }
}
function saveDocuments() {
  try { localStorage.setItem('efterplan_documents', JSON.stringify(state.documents)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
  // T147: dokumentfoton synkas separat mot Supabase Storage, inte via
  // state-changed (som bara tÃ¤cker plans.state_json-nycklarna).
  try { window.dispatchEvent(new CustomEvent('efterplan:documents-changed', { detail: state.documents })); } catch(e) {}
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
        ? 'Inga dokument tillagda Ã¤n â€” fota det fÃ¶rsta papperet som dyker upp.'
        : 'Inga dokument med den hÃ¤r flaggan.';
    }
    return;
  }
  empty && empty.classList.add('hidden');

  // Dubblettdetektering: dokument som delar samma bild-hash flaggas visuellt,
  // oavsett i vilken ordning de lades till eller togs bort (rÃ¤knas om varje render).
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
          ${isDup ? `<span class="arkiv-dup-badge" title="Ser ut som samma foto som ett annat dokument i arkivet">âš  MÃ¶jlig dubblett</span>` : ''}
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
            ${isExplainOpen ? 'DÃ¶lj fÃ¶rklaring' : 'âœ¨ FÃ¶rklara detta dokument'}
          </button>
        </div>
        <div class="arkiv-explain${isExplainOpen ? '' : ' hidden'}" id="arkiv-explain-${d.id}">${
          isExplainOpen ? escapeHtml(d.explanation || 'Tar fram en fÃ¶rklaringâ€¦') : ''
        }</div>
      </div>
      <button class="arkiv-delete" onclick="deleteDocument('${d.id}')" aria-label="Ta bort dokument">Ã—</button>
    </li>`;
  }).join('');
}

// Enkel, deterministisk hash av bildinnehÃ¥llet â€” fÃ¶r att upptÃ¤cka att exakt
// samma foto laddas upp igen. Inte kryptografiskt sÃ¤ker, behÃ¶ver inte vara det.
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
  if (w) { w.document.write(`<title>${escapeHtml(d.name)}</title><body style="margin:0;background:#222;display:grid;place-items:center;min-height:100vh"><img src="${d.photo}" style="max-width:100%;max-height:100vh;object-fit:contain"></body>`); w.document.close(); }
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
  d.flag = d.flag === flag ? null : flag; // klicka igen pÃ¥ samma flagga fÃ¶r att avmarkera
  saveDocuments();
  renderDocuments();
  track('document_flag_set', { flag: d.flag || 'none' });
}

function deleteDocument(id) {
  state.documents = state.documents.filter(d => d.id !== id);
  saveDocuments();
  renderDocuments();
  track('document_deleted');
  // T147: explicit borttagning pÃ¥ servern (rad + Storage-fil) â€” inte inferrerad
  // via diff, se supabase-client.js fÃ¶r varfÃ¶r.
  try { window.dispatchEvent(new CustomEvent('efterplan:document-deleted', { detail: id })); } catch(e) {}
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
  renderDocuments(); // Ã¶ppnar panelen direkt â€” visar cachat svar eller en vÃ¤ntetext
  track('document_explain_opened');

  if (d.explanation) return; // redan hÃ¤mtat â€” inget nytt anrop
  if (!d.photo) return; // sÃ¤kerhet: inget foto att skicka (borde inte kunna hÃ¤nda)

  const explanation = await explainDocumentAI(d.photo);
  if (expandedDocId !== id) return; // anvÃ¤ndaren stÃ¤ngde/Ã¶ppnade en annan panel innan svaret kom

  const panel = document.getElementById(`arkiv-explain-${id}`);
  if (!explanation) {
    if (panel) panel.textContent = '';
    setDocumentScanStatus('Kunde inte ta fram en fÃ¶rklaring just nu. FÃ¶rsÃ¶k gÃ¤rna igen om en stund.', true);
    setTimeout(() => setDocumentScanStatus(''), 5000);
    expandedDocId = null;
    renderDocuments();
    return;
  }

  d.explanation = explanation;
  saveDocuments();
  if (panel) panel.textContent = explanation; // textContent, aldrig innerHTML, fÃ¶r AI-text
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

// Ren assist â€” misslyckas anropet (nÃ¤tverk, saknad ANTHROPIC_API_KEY, m.m.)
// faller vi tillbaka till manuell kategorisering. Aldrig en spÃ¤rr.
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

// Ren assist â€” misslyckas anropet (nÃ¤tverk, saknad ANTHROPIC_API_KEY, rate-limit,
// m.m.) visar vi bara ett kort felmeddelande. Aldrig en spÃ¤rr fÃ¶r att se eller
// hantera dokumentet i Ã¶vrigt.
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
  setDocumentScanStatus('LÃ¤ser dokumentâ€¦');
  try {
    const reader = new FileReader();
    const rawDataUrl = await new Promise((resolve, reject) => {
      reader.onload = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Kunde inte lÃ¤sa filen'));
      reader.readAsDataURL(file);
    });
    const compressed = await compressBillImage(rawDataUrl, 1280, 0.7);
    const imageHash = hashImageData(compressed);

    const existingDup = state.documents.find(d => d.imageHash === imageHash);
    if (existingDup) {
      const proceed = window.confirm(
        `Det hÃ¤r ser ut som samma foto som "${existingDup.name}" som redan finns i arkivet. LÃ¤gga till det Ã¤ndÃ¥?`
      );
      if (!proceed) {
        setDocumentScanStatus('Hoppade Ã¶ver â€” fanns redan i arkivet.');
        setTimeout(() => setDocumentScanStatus(''), 3000);
        return;
      }
    }

    setDocumentScanStatus('FÃ¶reslÃ¥r kategoriâ€¦');
    const ai = await categorizeDocumentAI(compressed);

    const doc = {
      id: Date.now().toString(),
      name: ai?.name || `Dokument ${formatDate(new Date())}`,
      category: ai?.category || 'Ã–vrigt',
      date: formatDate(new Date()),
      flag: null,
      photo: compressed,
      imageHash,
    };
    state.documents.push(doc);
    saveDocuments();
    renderDocuments();
    track(ai ? 'document_categorized_ai' : 'document_added_manual', { category: doc.category });
    setDocumentScanStatus(ai ? 'Dokument tillagt â€” kategori fÃ¶reslagen.' : 'Dokument tillagt. Byt namn/kategori manuellt ovan om du vill.');
    setTimeout(() => setDocumentScanStatus(''), 4000);
  } catch (err) {
    console.error('Document scan error', err);
    setDocumentScanStatus('Det gick inte att lÃ¤sa bilden. FÃ¶rsÃ¶k igen.', true);
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
    badge.textContent = 'PÃ¥bÃ¶rjad';
    timeEl.appendChild(badge);
  }

  // Swap start button â†’ only "Markera som klar" remains
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

  // Scroll to the next uncompleted task AFTER the one just finished â€” not the first
  // uncompleted task overall. Annars kan man t.ex. klara av uppgift 15 och bli
  // skickad hela vÃ¤gen upp till uppgift 2, vilket kÃ¤nns som att sidan hoppar till toppen.
  const idx  = state.tasks.findIndex(t => t.id === taskId);
  const next = state.tasks.slice(idx + 1).find(t => !t.done);
  if (next) {
    setTimeout(() => {
      const el = document.getElementById(`task-card-${next.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 350);
  }
}


// â”€â”€â”€ DELAD LOCALSTORAGE-LIST-KOMPONENT â”€â”€â”€â”€â”€â”€â”€â”€
// Tidigare fanns tre nÃ¤stan identiska implementationer av "spara/hÃ¤mta/lÃ¤gg till/ta
// bort rader i en localStorage-lista" (underrÃ¤tta-listan, dokumentplats-listan, och den
// generiska _getLSList den ena byggde pÃ¥). Konsoliderat till en delad fabrik hÃ¤r â€”
// nya "hjÃ¤lp mig komma ihÃ¥g X"-listor kan Ã¥teranvÃ¤nda mÃ¶nstret utan att skrivas om.
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

// â”€â”€â”€ NOTIFY LIST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  if (!list.length) return '<p class="notify-empty">Inga tillagda Ã¤n</p>';
  return list.map(p => {
    const safeId = p.id;
    return `
      <div class="notify-person${p.notified ? ' notified' : ''}">
        <button class="notify-check${p.notified ? ' checked' : ''}"
          onclick="event.stopPropagation();toggleNotified('${safeId}')"
          aria-label="Markera ${_esc(p.name)} som meddelad">${p.notified ? 'âœ“' : ''}</button>
        <span class="notify-name">${escapeHtml(p.name)}</span>
        <button class="notify-remove"
          onclick="event.stopPropagation();removeNotifyPerson('${safeId}')"
          aria-label="Ta bort ${_esc(p.name)}">Ã—</button>
      </div>`;
  }).join('');
}

// â”€â”€ Bostads-widget (uppgiften "Besluta om bostadens framtid") â”€â”€â”€â”€â”€â”€â”€â”€
// Typ av bostad + mÃ¤klare frÃ¥gades tidigare i onboarding; nu hÃ¤r,
// kontextuellt. Ã„ndring rÃ¤knar om planen (lantbruk-trigger, mÃ¤klare tar
// bort visnings-/budgivningssteg).
function renderBostadWidget() {
  const typ = state.bostadTyp || '';
  const opt = (val, label) =>
    `<button type="button" class="ob-choice ob-choice--sm${typ === val ? ' selected' : ''}"` +
    ` onclick="event.stopPropagation();setBostadTyp('${val}')">${label}</button>`;
  return `<div class="bostad-widget">
    <p class="bostad-widget-label">Vilken typ av bostad Ã¤r det?</p>
    <div class="ob-choices ob-choices--compact">
      ${opt('villa', 'Villa / fritidshus')}
      ${opt('brf', 'BostadsrÃ¤tt')}
      ${opt('lantbruk', 'Lantbruks-/skogsfastighet')}
    </div>
    <label class="ob-check ob-check--sub bostad-widget-maklare" onclick="event.stopPropagation()">
      <input type="checkbox" ${state.maklare ? 'checked' : ''}
        onchange="event.stopPropagation();setBostadMaklare(this.checked)">
      <span class="ob-check-box"></span>
      <span class="ob-check-label">Ni anlitar mÃ¤klare fÃ¶r fÃ¶rsÃ¤ljningen
        <span class="ob-check-hint">DÃ¥ skÃ¶ter mÃ¤klaren visning, budgivning och kÃ¶pekontrakt â€” vi tar bort de stegen frÃ¥n din checklista.</span>
      </span>
    </label>
  </div>`;
}

function setBostadTyp(val) {
  state.bostadTyp = (state.bostadTyp === val) ? null : val;
  track('checkbox_toggle', { key: 'bostadTyp', val: state.bostadTyp || 'none' });
  recomputePlan('fastighet_boende');
}

function setBostadMaklare(checked) {
  state.maklare = !!checked;
  track('checkbox_toggle', { key: 'maklare', val: String(!!checked) });
  recomputePlan('fastighet_boende');
}

// RÃ¤kna om planen efter ett svar som Ã¤ndrar vilka uppgifter som gÃ¤ller.
// BehÃ¥ller markeringar/anteckningar (loadTaskState) och Ã¶ppnar uppgiften
// anvÃ¤ndaren jobbar i igen.
function recomputePlan(reopenTaskId) {
  saveState();
  buildTasks();
  applyDeadlines();
  applyLagfartDeadline();
  loadTaskState();
  renderPlan();
  if (reopenTaskId && document.getElementById('expand-' + reopenTaskId)) {
    expandedTaskId = null;
    toggleTask(reopenTaskId);
    document.getElementById('task-card-' + reopenTaskId)
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

function renderNotifyList() {
  const list = _notifyList.get();
  const done = list.filter(p => p.notified).length;
  const counterText = list.length ? `${done} av ${list.length} meddelade` : '';
  return `<div class="notify-list-section">
    <div class="notify-list-header">
      <span class="notify-list-label">Att underrÃ¤tta</span>
      <span class="notify-counter" id="notify-counter">${counterText}</span>
    </div>
    <div class="notify-list-items" id="notify-list-container">
      ${_buildNotifyListInner()}
    </div>
    <div class="notify-add-row">
      <input class="notify-new-input" id="notify-new-input" type="text"
        placeholder="LÃ¤gg till personâ€¦"
        onclick="event.stopPropagation()"
        onkeydown="if(event.key==='Enter'){event.stopPropagation();addNotifyPerson();}" />
      <button class="notify-add-btn" onclick="event.stopPropagation();addNotifyPerson()">LÃ¤gg till</button>
    </div>
  </div>`;
}

// â”€â”€â”€ DOCUMENT LOCATION LIST (viktiga dokument) â”€
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
  if (!list.length) return '<p class="notify-empty">Inga tillagda Ã¤n</p>';
  return list.map(r => `
    <div class="doc-location-row">
      <input class="bill-input doc-location-input-doc" type="text" placeholder="Dokument (t.ex. Testamente)" value="${_esc(r.doc)}"
        onclick="event.stopPropagation()" oninput="setDocLocationField('${r.id}','doc',this.value)">
      <input class="bill-input doc-location-input-plats" type="text" placeholder="Var det finns (t.ex. Bankfack Swedbank)" value="${_esc(r.plats)}"
        onclick="event.stopPropagation()" oninput="setDocLocationField('${r.id}','plats',this.value)">
      <button class="notify-remove" onclick="event.stopPropagation();removeDocLocation('${r.id}')" aria-label="Ta bort rad">Ã—</button>
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
      <button class="notify-add-btn" onclick="event.stopPropagation();addDocLocation()">+ LÃ¤gg till rad</button>
    </div>
  </div>`;
}

// â”€â”€â”€ UNDO TOAST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ MODALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ TABS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function switchTab(name) {
  document.querySelectorAll('.plan-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.plan-tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  document.getElementById(`tabcontent-${name}`).classList.add('active');
  if (name === 'bopp') boppUpdateSummary(); // T137: arvsfÃ¶rdelningen beror pÃ¥ state.testamente
  window.scrollTo(0, 0);
}

// â”€â”€â”€ SENDER INFO PERSISTENCE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function saveSenderInfo(name, email) {
  try {
    if (name)  localStorage.setItem('efterplan_sender_name',  name);
    if (email) localStorage.setItem('efterplan_sender_email', email);
  } catch(e) {}
}
function getSenderInfo() {
  try {
    return {
      name:    localStorage.getItem('efterplan_sender_name')    || '',
      email:   localStorage.getItem('efterplan_sender_email')   || '',
      address: localStorage.getItem('efterplan_sender_address') || '',
      zip:     localStorage.getItem('efterplan_sender_zip')     || '',
      city:    localStorage.getItem('efterplan_sender_city')    || '',
    };
  } catch (_) {
    return { name: '', email: '', address: '', zip: '', city: '' };
  }
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
// Postnummer â†’ stad, helt klientsidan mot ett bundlat dataset (data/postnummer-se.json,
// kÃ¤lla GeoNames.org, CC BY 4.0) â€” inget postnummer skickas till nÃ¥gon extern tjÃ¤nst.
// Ren assist: skriver aldrig Ã¶ver ett fÃ¤lt anvÃ¤ndaren redan fyllt i sjÃ¤lv, och
// misslyckas tyst (offline, saknad fil, okÃ¤nt postnummer) utan felmeddelande.
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
// Byggs in i avsÃ¤ndarblocket i genererade brev, under namn/e-post. Tom strÃ¤ng
// om inget adressfÃ¤lt Ã¤r ifyllt â€” lÃ¤gger dÃ¥ inte till nÃ¥gon extra rad alls.
function formatSenderAddressBlock() {
  const { address, zip, city } = getSenderInfo();
  const lines = [];
  if (address) lines.push(address);
  const zipCity = [zip, city].filter(Boolean).join(' ');
  if (zipCity) lines.push(zipCity);
  return lines.length ? '\n' + lines.join('\n') : '';
}
function getRelationLabel() {
  const map = { partner: 'Make/Maka', foralder: 'Barn', syskon: 'Syskon', barn: 'FÃ¶rÃ¤lder', annan: '' };
  return map[state.relation] || '';
}

// â”€â”€â”€ DOCUMENT GENERATOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function getDocContext() {
  return {
    deceased: state.name     || '[NAMN PÃ… AVLIDEN]',
    personnr: state.personnr || '[PERSONNUMMER]',
    today:    formatDate(new Date()),
  };
}

function showDocForm(type) {
  if (isDocLocked(type)) { showDocPaywall(type); return; }
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
    // Prefill frÃ¥n bÃ¥de den ibockade checklistan (T199) och kvarvarande fritext fÃ¶r
    // "Ã¶vrigt" â€” annars matas inte det man bockat av vidare till uppsÃ¤gningsbrevet.
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

  if (type === 'hyresvard') {
    const sEl = document.getElementById('hyres-sender');
    if (sEl && !sEl.value && sender.name) sEl.value = sender.name;
    const eEl = document.getElementById('hyres-email');
    if (eEl && !eEl.value && sender.email) eEl.value = sender.email;
    const rEl = document.getElementById('hyres-relation');
    if (rEl && !rEl.value && relation) rEl.value = relation;
  }
  if (type === 'pension') {
    const sEl = document.getElementById('pension-sender');
    if (sEl && !sEl.value && sender.name) sEl.value = sender.name;
    const eEl = document.getElementById('pension-email');
    if (eEl && !eEl.value && sender.email) eEl.value = sender.email;
    const rEl = document.getElementById('pension-relation');
    if (rEl && !rEl.value && relation) rEl.value = relation;
    if (state.barn && !state.giftSambo) {
      const tEl = document.getElementById('pension-typ');
      if (tEl) tEl.value = 'barnpension';
    }
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

// Klick pÃ¥ ett lÃ¥st brev â†’ visa paywall-kortet i stÃ¤llet fÃ¶r formulÃ¤ret.
function showDocPaywall(type) {
  track('paywall_shown', { doc: type || 'okÃ¤nd' });
  if (typeof switchTab === 'function') switchTab('docs');
  document.querySelectorAll('.doc-form').forEach(f => f.classList.add('hidden'));
  document.getElementById('doc-result-bulk')?.classList.add('hidden');
  document.getElementById('doc-chooser').classList.remove('hidden');
  const card = document.getElementById('paywall-card');
  if (card) {
    card.classList.remove('hidden');
    card.scrollIntoView({ block: 'center', behavior: 'smooth' });
    card.classList.remove('paywall-card--flash');
    void card.offsetWidth; // reflow sÃ¥ animationen kan spelas om
    card.classList.add('paywall-card--flash');
    card.querySelector('.paywall-cta')?.focus({ preventScroll: true });
  }
}

// â”€â”€â”€ BULK UPPSÃ„GNING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let _bulkRowId = 0;
const MAX_BULK_SERVICES = 20;

function initBulkForm() {
  _bulkRowId = 0;
  document.getElementById('bulk-rows').innerHTML = '';
  addBulkRow();
  addBulkRow();
  addBulkRow();
}

function addBulkRow() {
  if (document.querySelectorAll('.bulk-row').length >= MAX_BULK_SERVICES) {
    showFormError('err-bulk', `Du kan lÃ¤gga till hÃ¶gst ${MAX_BULK_SERVICES} tjÃ¤nster i taget.`);
    return;
  }
  _bulkRowId++;
  const id = _bulkRowId;
  const row = document.createElement('div');
  row.className = 'bulk-row';
  row.id = `brow-${id}`;
  row.innerHTML = `
    <input type="text" class="text-input bulk-name" placeholder="TjÃ¤nst (t.ex. Spotify, Telia, Netflixâ€¦)" />
    <input type="text" class="text-input bulk-custnr" placeholder="Kundnr (valfritt)" />
    <button class="bulk-remove" onclick="removeBulkRow(${id})" aria-label="Ta bort">âœ•</button>`;
  document.getElementById('bulk-rows').appendChild(row);
}

function removeBulkRow(id) {
  const rows = document.querySelectorAll('.bulk-row');
  if (rows.length > 1) document.getElementById(`brow-${id}`)?.remove();
}

function generateBulkLetters() {
  const sender = document.getElementById('bulk-sender').value.trim();
  const email = document.getElementById('bulk-email').value.trim();
  clearFormError('err-bulk');
  if (!sender || !email) { showFormError('err-bulk', 'Fyll i ditt namn och din e-post.'); return; }
  const services = [...document.querySelectorAll('.bulk-row')].map(row => ({ name: row.querySelector('.bulk-name').value.trim(), custnr: row.querySelector('.bulk-custnr').value.trim() })).filter(s => s.name);
  if (!services.length) { showFormError('err-bulk', 'LÃ¤gg till minst en tjÃ¤nst med namn.'); return; }
  saveSenderInfo(sender, email);
  requestPremiumDocument('bulk', { sender, email, services }, 'err-bulk', { button: document.querySelector('#doc-form-bulk .btn-primary') });
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
  const fields = { service: document.getElementById('letter-service').value.trim(), custnr: document.getElementById('letter-custnr').value.trim(), sender: document.getElementById('letter-sender').value.trim(), email: document.getElementById('letter-email').value.trim() };
  clearFormError('err-letter');
  if (!fields.service || !fields.sender || !fields.email) { showFormError('err-letter', 'Fyll i alla fÃ¤lt markerade med *.'); return; }
  saveSenderInfo(fields.sender, fields.email); requestPremiumDocument('letter', fields, 'err-letter');
}

function generateBank() {
  const fields = { bank: document.getElementById('bank-name').value.trim(), sender: document.getElementById('bank-sender').value.trim(), relation: document.getElementById('bank-relation').value.trim(), email: document.getElementById('bank-email').value.trim() };
  clearFormError('err-bank'); if (!fields.bank || !fields.sender || !fields.relation || !fields.email) { showFormError('err-bank', 'Fyll i alla fÃ¤lt markerade med *.'); return; }
  saveSenderInfo(fields.sender, fields.email); requestPremiumDocument('bank', fields, 'err-bank');
}

function generateForsakring() {
  const bolag    = document.getElementById('fors-bolag').value.trim();
  const sender   = document.getElementById('fors-sender').value.trim();
  const relation = document.getElementById('fors-relation').value.trim();
  const email    = document.getElementById('fors-email').value.trim();
  clearFormError('err-forsakring');
  if (!bolag || !sender || !relation || !email) { showFormError('err-forsakring', 'Fyll i alla fÃ¤lt markerade med *.'); return; }
  saveSenderInfo(sender, email);

  const { deceased, personnr, today } = getDocContext();

  showDocResult('Brev till ' + bolag, `${sender}
${email}${formatSenderAddressBlock()}

${today}

Till: ${bolag}
Ã„rende: DÃ¶dsfallsanmÃ¤lan â€” begÃ¤ran om utredning av fÃ¶rsÃ¤kringar

Hej,

Jag kontaktar er fÃ¶r att anmÃ¤la att ${deceased} (personnr ${personnr}) har gÃ¥tt bort.

Jag Ã¤r ${relation} och ber er:

1. BekrÃ¤fta vilka fÃ¶rsÃ¤kringar som fanns hos er pÃ¥ den avlidnes namn.
2. Informera om eventuell utbetalning av livfÃ¶rsÃ¤kring eller begravningsfÃ¶rsÃ¤kring.
3. Avsluta lÃ¶pande fÃ¶rsÃ¤kringar frÃ¥n och med dÃ¶dsdatum.

DÃ¶dsbevis bifogas. Kontakta mig fÃ¶r ytterligare dokumentation.

Med vÃ¤nliga hÃ¤lsningar,

${sender}
${relation} till ${deceased}
${email}`, undefined, {
    text: `Hej, jag heter ${sender}. Jag Ã¤r ${relation} till ${deceased}, som har gÃ¥tt bort, och jag ringer fÃ¶r att anmÃ¤la dÃ¶dsfallet och hÃ¶ra vilka fÃ¶rsÃ¤kringar hen hade hos er.

Kan ni kolla om det finns en livfÃ¶rsÃ¤kring eller begravningsfÃ¶rsÃ¤kring som ska betalas ut, och avsluta lÃ¶pande fÃ¶rsÃ¤kringar frÃ¥n och med dÃ¶dsdatumet?

Vad behÃ¶ver ni av mig fÃ¶r att gÃ¥ vidare â€” dÃ¶dsbevis, fÃ¶rsÃ¤kringsnummer, nÃ¥got annat?`,
    checklist: [
      'Den avlidnes personnummer',
      'Eventuellt fÃ¶rsÃ¤kringsnummer (om kÃ¤nt)',
      'Ditt eget namn och kontaktuppgifter',
      'Din relation till den avlidne',
    ],
  });
}

function generateHyresvard() {
  const fields = { landlord: document.getElementById('hyres-vard').value.trim(), propertyAddress: document.getElementById('hyres-adr').value.trim(), sender: document.getElementById('hyres-sender').value.trim(), relation: document.getElementById('hyres-relation').value.trim(), email: document.getElementById('hyres-email').value.trim() };
  clearFormError('err-hyresvard'); if (!fields.sender || !fields.relation || !fields.email) { showFormError('err-hyresvard', 'Fyll i alla fÃ¤lt markerade med *.'); return; }
  saveSenderInfo(fields.sender, fields.email); requestPremiumDocument('hyresvard', fields, 'err-hyresvard');
}

function generatePension() {
  const fields = { type: document.getElementById('pension-typ').value, sender: document.getElementById('pension-sender').value.trim(), relation: document.getElementById('pension-relation').value.trim(), email: document.getElementById('pension-email').value.trim() };
  clearFormError('err-pension'); if (!fields.sender || !fields.relation || !fields.email) { showFormError('err-pension', 'Fyll i alla fÃ¤lt markerade med *.'); return; }
  saveSenderInfo(fields.sender, fields.email); requestPremiumDocument('pension', fields, 'err-pension');
}

function generateAnnons() {
  const fields = { name: document.getElementById('annons-name').value.trim(), born: document.getElementById('annons-born').value.trim(), died: document.getElementById('annons-died').value.trim(), survivors: document.getElementById('annons-survivors').value.trim(), memory: document.getElementById('annons-memory').value.trim(), funeral: document.getElementById('annons-funeral').value.trim(), other: document.getElementById('annons-ovrigt').value.trim() };
  clearFormError('err-annons'); if (!fields.name) { showFormError('err-annons', 'Ange den avlidnes namn.'); return; }
  requestPremiumDocument('annons', fields, 'err-annons');
}

function showDocResult(title, text, emailSubject, phoneScript) {
  track('doc_generated', { title: title.split(' â€” ')[0] });
  document.querySelectorAll('.doc-form').forEach(f => f.classList.add('hidden'));
  document.getElementById('doc-chooser').classList.add('hidden');
  document.getElementById('result-title').textContent = title;
  document.getElementById('doc-result').classList.remove('hidden');
  document.getElementById('copied-msg').classList.add('hidden');
  const mailtoBtn = document.getElementById('result-mailto');
  if (mailtoBtn) {
    const subj = encodeURIComponent(emailSubject || title);
    const body = encodeURIComponent(text);
    mailtoBtn.href = `mailto:?subject=${subj}&body=${body}`;
  }

  docLetterText  = text;
  docPhoneScript = phoneScript || null;
  document.getElementById('doc-mode-tabs').classList.toggle('hidden', !docPhoneScript);
  switchDocMode('brev');
}

async function requestPremiumDocument(type, fields, errorId, options = {}) {
  const form = document.getElementById(errorId)?.closest('.doc-form');
  const button = options.button || form?.querySelector('.btn-primary') || null;
  const oldLabel = button?.textContent || '';
  if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); button.textContent = 'Skapar brevâ€¦'; }
  try {
    const context = getDocContext();
    const senderInfo = getSenderInfo();
    const needsSenderAddress = ['letter', 'bulk', 'bank', 'hyresvard', 'pension', 'skatteverket'].includes(type);
    const requestContext = type === 'annons' ? {} : context;
    const token = await window.efterplanAuth?.getAccessToken?.();
    const sessionId = localStorage.getItem(PREMIUM_SESSION_KEY) || '';
    const r = await fetch('/api/generate-premium-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({
        type,
        fields: needsSenderAddress ? { ...fields, address: senderInfo.address || '', zip: senderInfo.zip || '', city: senderInfo.city || '' } : fields,
        context: requestContext,
        sessionId,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (r.status === 403) {
      clearPremium(); showDocPaywall(type); return;
    }
    if (!r.ok || !data.document) throw new Error('request_failed');
    const doc = data.document;
    if (doc.bulk) {
      const container = document.getElementById('bulk-letters-list');
      container.replaceChildren();
      doc.letters.forEach((letter, i) => {
        const card = document.createElement('div'); card.className = 'bulk-letter';
        const head = document.createElement('div'); head.className = 'bulk-letter-head';
        const name = document.createElement('span'); name.className = 'bulk-letter-name'; name.textContent = letter.service;
        const copy = document.createElement('button'); copy.className = 'btn-primary btn-sm'; copy.textContent = 'Kopiera'; copy.onclick = () => copyBulkLetter(i);
        const text = document.createElement('div'); text.className = 'doc-output'; text.id = `bletter-${i}`; text.textContent = letter.text;
        const copied = document.createElement('p'); copied.className = 'copied-msg hidden'; copied.id = `bcopied-${i}`; copied.textContent = 'Kopierat!';
        head.append(name, copy); card.append(head, text, copied); container.append(card);
      });
      document.getElementById('doc-chooser').classList.add('hidden');
      document.querySelectorAll('.doc-form').forEach(form => form.classList.add('hidden'));
      document.getElementById('doc-result-bulk').classList.remove('hidden');
      track('doc_generated', { title: 'Bulk uppsÃ¤gning', count: String(doc.letters.length) });
      window.scrollTo(0, 0);
    } else {
      showDocResult(doc.title, doc.text, doc.emailSubject, doc.phoneScript);
    }
  } catch (_) {
    showFormError(errorId, 'Brevet kunde inte skapas just nu. Kontrollera anslutningen och fÃ¶rsÃ¶k igen.');
  } finally {
    if (button) { button.disabled = false; button.removeAttribute('aria-busy'); button.textContent = oldLabel; }
  }
}

function switchDocMode(mode) {
  docMode = mode;
  const isPhone = mode === 'telefon' && docPhoneScript;
  document.getElementById('doc-mode-tab-brev').classList.toggle('active', !isPhone);
  document.getElementById('doc-mode-tab-telefon').classList.toggle('active', isPhone);
  document.getElementById('doc-output-text').textContent = isPhone ? docPhoneScript.text : docLetterText;

  const checklistBox = document.getElementById('doc-phone-checklist');
  if (isPhone && docPhoneScript.checklist && docPhoneScript.checklist.length) {
    const list = document.getElementById('doc-phone-checklist-items');
    list.innerHTML = docPhoneScript.checklist.map(item => `<li>${item}</li>`).join('');
    checklistBox.classList.remove('hidden');
    track('doc_phone_script_viewed', { title: document.getElementById('result-title').textContent.split(' â€” ')[0] });
  } else {
    checklistBox.classList.add('hidden');
  }
}

function generateSkatteverket() {
  const fields = { case: document.getElementById('skv-arende').value, sender: document.getElementById('skv-sender').value.trim(), relation: document.getElementById('skv-relation').value.trim(), email: document.getElementById('skv-email').value.trim() };
  clearFormError('err-skatteverket'); if (!fields.sender || !fields.relation || !fields.email) { showFormError('err-skatteverket', 'Fyll i alla fÃ¤lt markerade med *.'); return; }
  saveSenderInfo(fields.sender, fields.email); requestPremiumDocument('skatteverket', fields, 'err-skatteverket');
}

function generateFullmakt() {
  const fields = { grantor1: document.getElementById('fullmakt-grantor1').value.trim(), grantor2: document.getElementById('fullmakt-grantor2').value.trim(), agent: document.getElementById('fullmakt-agent').value.trim(), agentRelation: document.getElementById('fullmakt-relation').value.trim() };
  clearFormError('err-fullmakt'); if (!fields.grantor1 || !fields.agent) { showFormError('err-fullmakt', 'Fyll i alla fÃ¤lt markerade med *.'); return; }
  requestPremiumDocument('fullmakt', fields, 'err-fullmakt');
}

function printBulkLetters() {
  const letters = [];
  document.querySelectorAll('[id^="bletter-"]').forEach(el => {
    letters.push(el.innerText);
  });
  if (!letters.length) return;
  const pages = letters.map((letter, i) =>
    `<div style="page-break-after:${i < letters.length - 1 ? 'always' : 'auto'};white-space:pre-wrap;font-family:Georgia,serif;font-size:11pt;line-height:1.8;padding:40px 50px;">${escapeHtml(letter)}</div>`
  ).join('');
  const win = window.open('', '_blank');
  if (!win) { showToast('Din webblÃ¤sare blockerade popup-fÃ¶nstret. TillÃ¥t popups fÃ¶r efterplan.se och fÃ¶rsÃ¶k igen.', 'error'); return; }
  win.document.write(`<!DOCTYPE html><html lang="sv"><head><meta charset="UTF-8"><title>Brev â€” dÃ¶dsbo</title></head><body>${pages}</body></html>`);
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

// â”€â”€â”€ STATE SNAPSHOT (for localStorage) â”€â”€â”€â”€â”€â”€â”€
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


// â”€â”€â”€ FORM VALIDATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// Icke-blockerande toast â€” ersÃ¤tter alert() fÃ¶r meddelanden som inte hÃ¶r till ett
// specifikt formulÃ¤rfÃ¤lt (t.ex. betalningsstatus). Samma mÃ¶nster som showFormError,
// fast utan fast plats i DOM:en.
let _appToastTimer = null;
function showToast(msg, type) {
  const toast = document.getElementById('app-toast');
  const msgEl = document.getElementById('app-toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.remove('hidden', 'is-error', 'is-success');
  if (type === 'error') toast.classList.add('is-error');
  if (type === 'success') toast.classList.add('is-success');
  clearTimeout(_appToastTimer);
  _appToastTimer = setTimeout(() => toast.classList.add('hidden'), 5000);
}

// â”€â”€â”€ UTILS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ PERSIST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function saveState() {
  const toSave = { ...getShareableState(), personnr: state.personnr };
  try { localStorage.setItem('efterplan_state', JSON.stringify(toSave)); } catch(e) {}
  try { window.dispatchEvent(new Event('efterplan:state-changed')); } catch(e) {}
}

// â”€â”€â”€ INIT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€â”€ OFFLINE DETECTION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
(function initOfflineBanner() {
  const banner = document.getElementById('offline-banner');
  if (!banner) return;
  const show = () => banner.classList.add('is-offline');
  const hide = () => banner.classList.remove('is-offline');
  window.addEventListener('offline', show);
  window.addEventListener('online',  hide);
  if (!navigator.onLine) show();
})();

// â”€â”€â”€ COMPLETION OVERLAY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function showCompletionOverlay() {
  const overlay = document.getElementById('completion-overlay');
  if (!overlay || overlay.dataset.shown === '1') return;
  overlay.dataset.shown = '1';
  _completionPrevFocus = document.activeElement;
  const nameEl = document.getElementById('co-name');
  if (nameEl && state.name) {
    nameEl.textContent = 'Du har tagit dig igenom allt fÃ¶r ' + state.name + '.';
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

// â”€â”€â”€ PDF / PRINT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function printPlan() {
  track('plan_printed');
  window.print();
}

// â”€â”€â”€ T177: DELA LÃ„SBAR LÃ„NK (zero-knowledge) â”€â”€
function openShareModal() {
  document.getElementById('share-modal-status').textContent = '';
  document.getElementById('share-modal-body').innerHTML =
    `<button type="button" class="btn-primary" style="width:100%;" onclick="generateShareLink()">Skapa lÃ¤nk</button>`;
  openModal('share-modal');
}

async function generateShareLink() {
  const statusEl = document.getElementById('share-modal-status');
  statusEl.textContent = 'Skapar lÃ¤nkâ€¦';
  try {
    if (!window.efterplanAuth || !window.efterplanAuth.isConfigured()) {
      statusEl.textContent = 'Delning Ã¤r inte tillgÃ¤nglig just nu.';
      return;
    }
    // Bara det som behÃ¶vs fÃ¶r en lÃ¤sbar checklista â€” aldrig personnummer.
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
      <button type="button" class="btn-ghost btn-sm" style="width:100%;" onclick="navigator.clipboard.writeText(document.getElementById('share-link-input').value); this.textContent='Kopierad âœ“'">Kopiera lÃ¤nk</button>`;
    statusEl.textContent = 'Klart. LÃ¤nken innehÃ¥ller nyckeln â€” dela den bara med den du litar pÃ¥.';
  } catch (err) {
    console.error('[share]', err);
    statusEl.textContent = 'Kunde inte skapa lÃ¤nken. FÃ¶rsÃ¶k igen om en stund.';
  }
}

// Visar en lÃ¤sbar, icke-interaktiv kopia nÃ¤r ?shared=<id>#k=<nyckel> Ã¶ppnas.
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
    listEl.innerHTML = '<p class="modal-sub">LÃ¤nken saknar nyckeln som krÃ¤vs fÃ¶r att lÃ¥sa upp innehÃ¥llet.</p>';
    return true;
  }
  try {
    const data = await window.efterplanAuth.resolveSharedLink(sharedId, key);
    titleEl.textContent = data.name ? `Plan efter ${data.name}` : 'Delad plan';
    const groups = { today: [], week: [], later: [] };
    (data.tasks || []).forEach(t => { (groups[t.urgency] || groups.later).push(t); });
    const labels = { today: 'GÃ¶r idag', week: 'Denna vecka', later: 'Senare' };
    listEl.innerHTML = Object.keys(labels).map(key => {
      const items = groups[key];
      if (!items.length) return '';
      return `<h2 class="plan-title" style="font-size:1.1rem;margin-top:20px">${labels[key]}</h2>
        <ul style="list-style:none;padding:0;margin:0;">
          ${items.map(t => `<li style="padding:8px 0;border-bottom:1px solid var(--border);">
            <span style="${t.done ? 'text-decoration:line-through;color:var(--text-muted);' : ''}">${t.done ? 'âœ“ ' : ''}${escapeHtml(t.title)}</span>
          </li>`).join('')}
        </ul>`;
    }).join('');
    track('shared_plan_opened');
  } catch (err) {
    console.error('[shared-view]', err);
    listEl.innerHTML = '<p class="modal-sub">LÃ¤nken Ã¤r ogiltig eller har tagits bort.</p>';
  }
  return true;
}

// â”€â”€â”€ PAYWALL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// T147: dokument som synkats ner frÃ¥n Supabase Storage (t.ex. vid inloggning
// pÃ¥ en ny enhet) lÃ¤ggs in i state.documents/localStorage av supabase-client.js
// â€” hÃ¤mta in dem hÃ¤r och rendera om, utan att krÃ¤va en sidladdning.
window.addEventListener('efterplan:documents-hydrated', (e) => {
  const added = Array.isArray(e.detail) ? e.detail : [];
  if (!added.length) return;
  const existingIds = new Set(state.documents.map(d => d.id));
  added.forEach(d => { if (!existingIds.has(d.id)) state.documents.push(d); });
  if (document.getElementById('arkiv-list')) renderDocuments();
});
async function handlePaywallCTA() {
  if (checkoutInFlight) return;
  checkoutInFlight = true;
  const button = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
  const originalLabel = button?.textContent || '';
  if (button) {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Ã–ppnar betalningenâ€¦';
  }
  track('paywall_cta_clicked');
  if (isPremium()) {
    checkoutInFlight = false;
    if (button) { button.disabled = false; button.removeAttribute('aria-busy'); button.textContent = originalLabel; }
    return;
  }
  let email = '';
  let userId = '';
  let redirecting = false;
  try {
    if (window.efterplanAuth && typeof window.efterplanAuth.getCurrentUser === 'function') {
      const u = await window.efterplanAuth.getCurrentUser();
      if (u) { userId = u.id || ''; email = u.email || ''; }
    }
  } catch (_) { /* anonymous flow is fine */ }
  try {
    const r = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, userId }),
    });
    const data = await r.json();
    if (!r.ok || !data || !data.url) {
      showToast('Kunde inte starta betalningen. FÃ¶rsÃ¶k igen om en stund.', 'error');
      return;
    }
    redirecting = true;
    window.location.href = data.url;
  } catch (err) {
    showToast('NÃ¥got gick fel mot betaltjÃ¤nsten. Kontrollera din anslutning och fÃ¶rsÃ¶k igen.', 'error');
  } finally {
    if (!redirecting) {
      checkoutInFlight = false;
      if (button) { button.disabled = false; button.removeAttribute('aria-busy'); button.textContent = originalLabel; }
    }
  }
}

// â”€â”€â”€ DIREKTLÃ„NK TILL DOKUMENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ?doc=bank m.fl. frÃ¥n gratisverktygen Ã¶ppnar Dokument-fliken direkt, utan att
// besÃ¶karen fÃ¶rst mÃ¥ste gÃ¥ igenom onboardingen. Breven fungerar utan plan.
const DIRECT_DOC_TYPES = ['bank', 'skatteverket', 'fullmakt', 'forsakring', 'letter', 'bulk', 'annons'];

function openDocsDirect(type) {
  showScreen('screen-plan');
  switchTab('docs');
  if (type && DIRECT_DOC_TYPES.includes(type)) showDocForm(type);
}

function takeDirectDocParam() {
  const params = new URLSearchParams(window.location.search);
  const doc = params.get('doc');
  if (!doc || !DIRECT_DOC_TYPES.includes(doc)) return null;
  params.delete('doc');
  const qs = params.toString();
  history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
  return doc;
}

// â”€â”€â”€ INIT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
(async function init() {
  // T177: en delad lÃ¤nk (?shared=...#k=...) vinner alltid Ã¶ver lokalt sparad state.
  if (await tryRenderSharedView()) return;

  initSenderAddressFields(); // oberoende av vilken gren nedan som kÃ¶rs â€” bara localStorage-Ã¥terstÃ¤llning
  const directDoc = takeDirectDocParam();
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
      if (directDoc) openDocsDirect(directDoc);
      return;
    }
  } catch(e) {}

  if (directDoc) { openDocsDirect(directDoc); return; }

  // PWA shortcut: ./#start forces onboarding even on revisit
  if (window.location.hash === '#start') {
    history.replaceState(null, '', window.location.pathname);
    startOnboarding();
  }
})();

// DÃ¶dsdatum kan aldrig ligga i framtiden
(function initDeathDateMax() {
  const el = document.getElementById('deceased-date');
  if (el) el.max = new Date().toISOString().slice(0, 10);
})();

// â”€â”€â”€ BOUPPTECKNING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BOPP_KEY = 'efterplan_bouppteckning';

const boppData = {
  delbagare:  [],  // [{ namn, roll, barnTyp, avstarArv }] â€” barnTyp: null|'barn'|'gemensamt'|'sarkullbarn' (T137)
  tillgangar: [],  // [{ beskrivning, varde, samboegendom }] â€” samboegendom bara relevant vid sambo (T137)
  skulder:    [],  // [{ beskrivning, belopp }]
  civilstand: null, // T137 â€” 'gift' | 'sambo' | 'ensam' | null
};

// T208 â€” fÃ¶rifyllda default-rader istÃ¤llet fÃ¶r en tom lista: anvÃ¤ndaren slipper komma pÃ¥
// vad som ska fyllas i, och kan redigera/ta bort raderna precis som vanligt.
const BOPP_DEFAULT_TILLGANGAR = [
  { beskrivning: 'Bankkonto', varde: '' },
  { beskrivning: 'Bostad', varde: '' },
  { beskrivning: 'Bil', varde: '' },
  { beskrivning: 'Bohag', varde: '' },
];

let boppTracked = false; // T133: rapportera aktivering en gÃ¥ng per session, inte per tangenttryck

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
      boppData.civilstand = saved.civilstand || null;
    } else if (raw === null) {
      // FÃ¶rsta besÃ¶ket i Bouppteckning (inget sparat Ã¤nnu) â€” starta med vanliga rader
      // istÃ¤llet fÃ¶r en tom lista. Ifyllningsbara och borttagbara som vanligt.
      boppData.tillgangar = BOPP_DEFAULT_TILLGANGAR.map(row => ({ ...row }));
    }
  } catch(e) {}
  boppRender();
}

function boppRender() {
  const cs = document.getElementById('bopp-civilstand');
  if (cs) cs.value = boppData.civilstand || '';
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
    empty.textContent = 'Ingen tillagd Ã¤nnu.';
    container.appendChild(empty);
  }
}

function boppRowDelbagare(item, i) {
  const row = document.createElement('div');
  row.className = 'bopp-row bopp-row--wrap';
  // T137: barnTyp/avstarArv bara fÃ¶r arvingar. Gemensamt barn/sÃ¤rkullbarn spelar
  // bara roll nÃ¤r den avlidne var gift â€” annars Ã¤rver alla barn direkt.
  const gift = boppData.civilstand === 'gift';
  const bt = item.barnTyp || '';
  const barnTypHtml = item.roll !== 'arvinge' ? '' : gift ? `
    <select class="bill-input bopp-select bopp-select--full" aria-label="Ã„r arvingen barn till den avlidne?" onchange="boppSetBarnTyp(${i},this.value)">
      <option value=""${!bt?' selected':''}>Inte barn till den avlidne</option>
      <option value="gemensamt"${bt==='gemensamt'?' selected':''}>Gemensamt barn med maken/makan</option>
      <option value="sarkullbarn"${bt==='sarkullbarn'?' selected':''}>SÃ¤rkullbarn</option>
      ${bt==='barn'?'<option value="barn" selected>Barn â€” ange gemensamt eller sÃ¤rkull</option>':''}
    </select>` : `
    <select class="bill-input bopp-select bopp-select--full" aria-label="Ã„r arvingen barn till den avlidne?" onchange="boppSetBarnTyp(${i},this.value)">
      <option value=""${!bt?' selected':''}>Inte barn till den avlidne</option>
      <option value="barn"${bt?' selected':''}>Barn till den avlidne</option>
    </select>`;
  // Bara sÃ¤rkullbarn kan vÃ¤lja att avstÃ¥ till fÃ¶rmÃ¥n fÃ¶r efterlevande make/maka
  // (3 kap. 9 Â§ Ã„B). Gemensamma barns rÃ¤tt skjuts upp automatiskt enligt lag.
  const avstarHtml = item.roll === 'arvinge' && gift && bt === 'sarkullbarn' ? `
    <label class="bopp-check-inline">
      <input type="checkbox" ${item.avstarArv?'checked':''}
        onchange="boppData.delbagare[${i}].avstarArv=this.checked;boppSave();boppUpdateSummary()">
      AvstÃ¥r sitt arv tills vidare till fÃ¶rmÃ¥n fÃ¶r maken/makan (3 kap. 9 Â§ Ã„B)
    </label>` : '';
  row.innerHTML = `
    <input class="bill-input bopp-input-name" type="text" placeholder="Namn" aria-label="DÃ¶dsbodelÃ¤garens namn" value="${_esc(item.namn)}"
      oninput="boppData.delbagare[${i}].namn=this.value;boppSave()">
    <select class="bill-input bopp-select" aria-label="Roll i dÃ¶dsboet" onchange="boppData.delbagare[${i}].roll=this.value;boppSave();boppRender()">
      <option value="arvinge"${item.roll==='arvinge'?' selected':''}>Arvinge</option>
      <option value="testamentstagare"${item.roll==='testamentstagare'?' selected':''}>Testamentstagare</option>
      <option value="efterlevande_make"${item.roll==='efterlevande_make'?' selected':''}>Efterlevande make/maka</option>
      <option value="annan"${item.roll==='annan'?' selected':''}>Annan</option>
    </select>
    ${barnTypHtml}
    <button class="bopp-remove" onclick="boppRemove('delbagare',${i})" aria-label="Ta bort delÃ¤gare">Ã—</button>
    ${avstarHtml}`;
  return row;
}

function boppRowTillgang(item, i) {
  const row = document.createElement('div');
  row.className = boppData.civilstand === 'sambo' ? 'bopp-row bopp-row--wrap' : 'bopp-row';
  // T137: vid sambo delas bara samboegendom i bodelningen (sambolagen 2003:376).
  const samboHtml = boppData.civilstand === 'sambo' ? `
    <label class="bopp-check-inline">
      <input type="checkbox" ${item.samboegendom?'checked':''}
        onchange="boppData.tillgangar[${i}].samboegendom=this.checked;boppSave();boppUpdateSummary()">
      Samboegendom â€” gemensam bostad eller bohag kÃ¶pt fÃ¶r att anvÃ¤ndas tillsammans
    </label>` : '';
  row.innerHTML = `
    <input class="bill-input bopp-input-name" type="text" placeholder="Beskrivning (t.ex. Bankkonto Swedbank)" aria-label="TillgÃ¥ngens beskrivning" value="${_esc(item.beskrivning)}"
      oninput="boppData.tillgangar[${i}].beskrivning=this.value;boppSave()">
    <input class="bill-input bopp-input-amount" type="number" placeholder="Belopp (kr)" aria-label="TillgÃ¥ngens vÃ¤rde i kronor" value="${_esc(String(item.varde||''))}"
      oninput="boppData.tillgangar[${i}].varde=this.value;boppSave();boppUpdateSummary()">
    <button class="bopp-remove" onclick="boppRemove('tillgangar',${i})" aria-label="Ta bort tillgÃ¥ng">Ã—</button>
    ${samboHtml}`;
  return row;
}

function boppRowSkuld(item, i) {
  const row = document.createElement('div');
  row.className = 'bopp-row';
  row.innerHTML = `
    <input class="bill-input bopp-input-name" type="text" placeholder="BorgenÃ¤r (skuld till, t.ex. Swedbank)" aria-label="BorgenÃ¤r â€” vem skulden gÃ¤ller" value="${_esc(item.beskrivning)}"
      oninput="boppData.skulder[${i}].beskrivning=this.value;boppSave()">
    <input class="bill-input bopp-input-amount" type="number" placeholder="Belopp (kr)" aria-label="Skuldens belopp i kronor" value="${_esc(String(item.belopp||''))}"
      oninput="boppData.skulder[${i}].belopp=this.value;boppSave();boppUpdateSummary()">
    <button class="bopp-remove" onclick="boppRemove('skulder',${i})" aria-label="Ta bort skuld">Ã—</button>`;
  return row;
}

function boppAddDelbagare() {
  boppData.delbagare.push({ namn: '', roll: 'arvinge', barnTyp: null, avstarArv: false });
  boppSave();
  boppRenderSection('delbagare', 'bopp-delbagare-list', boppRowDelbagare);
  const inputs = document.querySelectorAll('#bopp-delbagare-list .bopp-input-name');
  if (inputs.length) inputs[inputs.length - 1].focus();
}

function boppAddTillgang() {
  boppData.tillgangar.push({ beskrivning: '', varde: '', samboegendom: false });
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
  boppRenderArvsfordelning(boppComputeArvsfordelning(netto));
}

function boppSetCivilstand(val) {
  boppData.civilstand = val || null;
  boppSave();
  boppRender();
}

function boppSetBarnTyp(i, val) {
  const d = boppData.delbagare[i];
  d.barnTyp = val || null;
  if (d.barnTyp !== 'sarkullbarn') d.avstarArv = false;
  boppSave();
  boppRender();
}

// T137 â€” preliminÃ¤r arvsfÃ¶rdelning, bara arvsklass 1 (barn). Medvetet utanfÃ¶r:
// giftorÃ¤ttsgodsets bodelning vid Ã¤ktenskap, basbeloppsreglerna (3 kap. 1 Â§ Ã„B,
// 18 Â§ sambolagen), barnbarn/istadarÃ¤tt, arvsklass 2â€“3 och testamentets fÃ¶rdelning.
function boppComputeArvsfordelning(netto) {
  const cs = boppData.civilstand;
  const res = { cs, netto, samboegendom: 0, samboBodelning: 0, kvarlatenskap: netto,
    barn: [], makeAndel: 0, oklaraBarn: 0, testamente: !!state.testamente };
  if (!cs || netto <= 0) return res;

  if (cs === 'sambo') {
    res.samboegendom = boppData.tillgangar
      .filter(t => t.samboegendom)
      .reduce((s, t) => s + (parseFloat(t.varde) || 0), 0);
    // Bodelning: samboegendomen delas lika â€” hÃ¤lften gÃ¥r till efterlevande sambo.
    res.samboBodelning = Math.min(res.samboegendom / 2, netto);
    res.kvarlatenskap = netto - res.samboBodelning;
  }

  const gift = cs === 'gift';
  const barn = boppData.delbagare.filter(d => d.roll === 'arvinge' && d.barnTyp);
  res.oklaraBarn = gift ? barn.filter(d => d.barnTyp === 'barn').length : 0;
  if (barn.length === 0) {
    // Inga barn: make/maka Ã¤rver allt (3 kap. 1 Â§ Ã„B). Sambo Ã¤rver inte enligt lag.
    if (gift) res.makeAndel = res.kvarlatenskap;
    return res;
  }

  const arvslott = res.kvarlatenskap / barn.length;
  let direktTotal = 0;
  res.barn = barn.map(d => {
    // Gift: gemensamma barn fÃ¥r vÃ¤nta (efterarv), sÃ¤rkullbarn Ã¤rver direkt om de inte
    // avstÃ¥r. Inte gift: alla barn Ã¤rver direkt (2 kap. 1 Â§ Ã„B).
    const vantar = gift && (d.barnTyp !== 'sarkullbarn' || d.avstarArv);
    const direkt = vantar ? 0 : arvslott;
    direktTotal += direkt;
    return { namn: d.namn || 'NamnlÃ¶s arvinge', barnTyp: d.barnTyp, arvslott, laglott: arvslott / 2, direkt, vantar };
  });
  if (gift) res.makeAndel = res.kvarlatenskap - direktTotal;
  return res;
}

function boppRenderArvsfordelning(r) {
  const el = document.getElementById('bopp-arvsfordelning');
  if (!el) return;
  const fmt = n => Math.round(n).toLocaleString('sv-SE') + ' kr';
  const row = (label, value) => `<div class="bopp-summary-row"><span>${label}</span><strong>${value}</strong></div>`;

  if (!r.cs) { el.innerHTML = '<p class="bopp-empty">VÃ¤lj civilstÃ¥nd ovan fÃ¶r att se fÃ¶rdelningen.</p>'; return; }
  if (r.netto <= 0) { el.innerHTML = '<p class="bopp-empty">NettovÃ¤rdet Ã¤r noll eller negativt â€” det finns inget arv att fÃ¶rdela. Fyll i tillgÃ¥ngar och skulder ovan.</p>'; return; }

  let html = '<div class="bopp-summary">';
  if (r.cs === 'sambo') {
    html += row(`Bodelning: hÃ¤lften av samboegendomen (${fmt(r.samboegendom)}) till efterlevande sambo`, fmt(r.samboBodelning));
  }
  html += row('Att fÃ¶rdela som arv', fmt(r.kvarlatenskap));
  r.barn.forEach(b => {
    const status = !b.vantar ? 'Ã¤rver nu'
      : b.barnTyp === 'sarkullbarn' ? 'har avstÃ¥tt â€” Ã¤rver nÃ¤r maken/makan dÃ¶r'
      : 'Ã¤rver nÃ¤r maken/makan dÃ¶r';
    const laglott = r.testamente ? ` (laglott ${fmt(b.laglott)})` : '';
    html += row(`${_esc(b.namn)} â€” ${status}`, fmt(b.arvslott) + laglott);
  });
  if (r.cs === 'gift') html += row('Maken/makan (med fri fÃ¶rfoganderÃ¤tt)', fmt(r.makeAndel));
  html += '</div>';

  if (r.oklaraBarn) {
    html += '<p class="bopp-warn">Ange fÃ¶r varje barn om det Ã¤r gemensamt med maken/makan eller ett sÃ¤rkullbarn â€” det avgÃ¶r vem som Ã¤rver nu.</p>';
  }
  if (!r.barn.length && r.cs !== 'gift') {
    html += '<p class="bopp-empty">Inga barn markerade. DÃ¥ Ã¤rver fÃ¶rÃ¤ldrar eller syskon (arvsklass 2), annars far- och morfÃ¶rÃ¤ldrar â€” det rÃ¤knar vi inte ut hÃ¤r. En sambo Ã¤rver inte enligt lag utan testamente.</p>';
  }
  if (r.testamente) {
    html += '<p class="bopp-warn">Testamente finns. Barn har alltid rÃ¤tt till sin laglott â€” hÃ¤lften av arvslotten. Ett barn som fÃ¥r mindre mÃ¥ste begÃ¤ra jÃ¤mkning inom sex mÃ¥nader frÃ¥n att testamentet delgavs.</p>';
  }
  html += '<p class="bopp-section-hint">PreliminÃ¤r berÃ¤kning enligt Ã¤rvdabalkens grundregler â€” inte juridisk rÃ¥dgivning. Bodelning mellan makar, basbeloppsregler och testamentets innehÃ¥ll rÃ¤knas inte in. RÃ¥dgÃ¶r med jurist om boet Ã¤r komplicerat.</p>';
  el.innerHTML = html;
}

function _esc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Load on init
document.addEventListener('DOMContentLoaded', () => { boppLoad(); });

// T260: event delegation â€” ersÃ¤tter 101 inline onclick-attribut
document.addEventListener('click', function dispatchAction(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  const v = el.dataset.arg || '';
  if (el.tagName === 'A') e.preventDefault();
  switch (a) {
    case 'startOnboarding':          startOnboarding(); break;
    case 'resumePlan':               resumePlan(); break;
    case 'generatePlan':             generatePlan(); break;
    case 'editAnswers':              editAnswers(); break;
    case 'obBack':                   obBack(); break;
    case 'obGoTo':                   obGoTo(+v); break;
    case 'obChoose':                 obChoose(el); break;
    case 'switchTab':                switchTab(v); break;
    case 'toggleHideDoneSection':    toggleHideDoneSection(v); break;
    case 'toggleHideDoneAll':        toggleHideDoneAll(); break;
    case 'printPlan':                printPlan(); break;
    case 'printBulkLetters':         printBulkLetters(); break;
    case 'openShareModal':           openShareModal(); break;
    case 'undoTaskDone':             undoTaskDone(); break;
    case 'showBillForm':             showBillForm(); break;
    case 'hideBillForm':             hideBillForm(); break;
    case 'submitBill':               submitBill(); break;
    case 'handlePaywallCTA':         handlePaywallCTA(); break;
    case 'backToDocChooser':         backToDocChooser(); break;
    case 'switchDocMode':            switchDocMode(v); break;
    case 'showDocForm':              showDocForm(v); break;
    case 'setDocumentFilter':        setDocumentFilter(v); break;
    case 'openModal':                openModal(v); break;
    case 'toggleMemoryPhrase':       toggleMemoryPhrase(el); break;
    case 'print':                    window.print(); break;
    case 'mailto':
      window.location.href = 'mailto:' + el.dataset.mail + '@' + el.dataset.domain;
      break;
    case 'closeAuthModal': {
      const m = document.getElementById('auth-modal');
      if (m) m.classList.add('hidden');
      break;
    }
    case 'plausibleFreeToApp':
      if (window.plausible) window.plausible('free_tool_to_app_click', { props: { area: v } });
      break;
    case 'removeHeir': {
      const node = document.getElementById('am-heir-' + el.dataset.id);
      if (node) node.remove();
      if (typeof renderAssetOwnerOptions === 'function') renderAssetOwnerOptions();
      break;
    }
    case 'removeAsset': {
      const node = document.getElementById('am-asset-' + el.dataset.id);
      if (node) node.remove();
      break;
    }
    case 'addBulkRow':           addBulkRow(); break;
    case 'boppAddDelbagare':     boppAddDelbagare(); break;
    case 'boppAddSkuld':         boppAddSkuld(); break;
    case 'boppAddTillgang':      boppAddTillgang(); break;
    case 'clearBillPhoto':       clearBillPhoto(); break;
    case 'closeCompletionOverlay': closeCompletionOverlay(); break;
    case 'closeModal':           closeModal(v); break;
    case 'copyDocument':         copyDocument(); break;
    case 'generateAnnons':       generateAnnons(); break;
    case 'generateBank':         generateBank(); break;
    case 'generateBulkLetters':  generateBulkLetters(); break;
    case 'generateForsakring':   generateForsakring(); break;
    case 'generateHyresvard':    generateHyresvard(); break;
    case 'generatePension':      generatePension(); break;
    case 'generateFullmakt':     generateFullmakt(); break;
    case 'generateLetter':       generateLetter(); break;
    case 'generateShareLink':    generateShareLink(); break;
    case 'generateSkatteverket': generateSkatteverket(); break;
    case 'triggerInput': {
      const target = document.getElementById(v);
      if (target) target.click();
      break;
    }
    // Per-sida funktioner (definierade i inline scripts pÃ¥ respektive sida)
    case 'generateNotice':   if (typeof generateNotice   === 'function') generateNotice(); break;
    case 'generateFreeLetter': if (typeof generateFreeLetter === 'function') generateFreeLetter(); break;
    case 'generateAgreement': if (typeof generateAgreement === 'function') generateAgreement(); break;
    case 'copyNotice':       if (typeof copyNotice       === 'function') copyNotice(); break;
    case 'copyFreeLetter':   if (typeof copyFreeLetter   === 'function') copyFreeLetter(); break;
    case 'copyAgreement':    if (typeof copyAgreement    === 'function') copyAgreement(); break;
    case 'addHeir':          if (typeof addHeir          === 'function') addHeir(); break;
    case 'addAsset':         if (typeof addAsset         === 'function') addAsset(); break;
  }
});

