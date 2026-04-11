/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   EFTERPLAN â€” App Logic
   MVP v1.0
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

// â”€â”€â”€ FEATURE FLAGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PAYWALL_ENABLED = false; // set true when Stripe is wired up

// â”€â”€â”€ STATE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  participantPersonnr: {}, // name â†’ personnr
  taskChecklists:      {}, // taskId â†’ {key: bool}
  tasks:               [],
  bills:               [],
};

// â”€â”€â”€ SCREENS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goToLanding() { showScreen('screen-landing'); }

// â”€â”€â”€ ANALYTICS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Plausible custom events â€” safe noop if script hasn't loaded
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
  track('Onboarding Start');
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
  // Step 3 â€” ansvar
  document.querySelectorAll('#ob-step-3 .ob-choice').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.val === state.ansvar);
  });
  if (state.ansvar) {
    const nb = document.querySelector('#ob-step-3 .ob-next-btn');
    if (nb) nb.disabled = false;
  }
  // Step 4 â€” participants (if returning to edit)
  const selfInput = document.getElementById('ob-self-name');
  if (selfInput) selfInput.value = state.participants?.[0] || '';
  // Render others (index 1+) as chips
  const _allP = state.participants || [];
  const _others = _allP.slice(1);
  const _savedP = state.participants;
  state.participants = _others;
  renderObParticipantList();
  state.participants = _savedP;
  // Step 5 â€” name
  const nameEl = document.getElementById('deceased-name');
  if (nameEl) nameEl.value = state.name || '';
  // Step 6 â€” personnr
  const pnrEl = document.getElementById('deceased-personnr');
  if (pnrEl) pnrEl.value = state.personnr || '';
}

// â”€â”€â”€ ONBOARDING (conversational) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // Enable the NÃ¤sta button for this step
  const step = btn.closest('.ob-step');
  const nextBtn = step?.querySelector('.ob-next-btn');
  if (nextBtn) nextBtn.disabled = false;
}

function obGoTo(step) {
  track('Onboarding Step', { step });
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

const OB_FOCUS_IDS = { 4: 'ob-self-name', 5: 'deceased-name' };  /* tangentbordet ska inte Ã¶ppnas automatiskt pÃ¥ personnr-steget */

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
    const suffix = step === 6 ? ' â€” helt frivilligt' : '';
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
    `<span class="ob-participant-chip">${name} <button class="ob-participant-remove" type="button" onclick="obRemoveParticipant(${i})" aria-label="Ta bort ${name}">Ã—</button></span>`
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
  loadTaskState(); // bevara progress/assignees vid "Ã„ndra svar"
  // Auto-tilldela person1 till uppgifter som saknar ansvarig
  if (state.participants.length > 0) {
    state.tasks.forEach(t => { if (!t.assignee) t.assignee = state.participants[0]; });
  }
  loadBills();
  renderPlan();
  saveState();
  saveTaskState(); // spara default-tilldelningar
  track('Plan Generated', { relation: state.relation || 'okÃ¤nd', ansvar: state.ansvar || 'okÃ¤nd' });
  showScreen('screen-plan');
}

// â”€â”€â”€ RULE ENGINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Each task: id, title, desc, urgency, time, link, phone?, triggers, hasDoc?, notesPlaceholder?
const TASK_LIBRARY = [

  // â”€â”€ ALWAYS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'konstatera_dodsfall',
    title: 'Konstatera dÃ¶dsfallet',
    desc: '<strong>Om dÃ¶dsfallet var ovÃ¤ntat eller plÃ¶tsligt â€” ring 112 omedelbart.</strong><br><br>Om personen avled hemma efter en lÃ¤ngre tids sjukdom ringer du jourhavande lÃ¤kare via 1177 â€” de skickar en lÃ¤kare som utfÃ¤rdar dÃ¶dsbeviset. Utan ett utfÃ¤rdat dÃ¶dsbevis kan inget annat steg pÃ¥bÃ¶rjas.',
    urgency: 'today',
    time: 'Direkt',
    phone: '112',
    phone2: '1177',
    triggers: [],
    notesPlaceholder: 'Noterat klockslag, vem som kontaktadesâ€¦',
  },
  {
    id: 'narmaste_anhÃ¶rig',
    title: 'Meddela nÃ¤rstÃ¥ende',
    desc: 'Det hÃ¤r sker i etapper â€” du behÃ¶ver inte nÃ¥ alla pÃ¥ en gÃ¥ng. BÃ¶rja med de allra nÃ¤rmaste: familj och nÃ¤ra vÃ¤nner. Ã–vriga kan meddelas under de kommande dagarna. Det Ã¤r okej att be nÃ¥gon annan hjÃ¤lpa till.',
    urgency: 'today',
    time: 'Din tid',
    link: null,
    triggers: [],
    notesPlaceholder: 'Vem har meddelats, vem Ã¥terstÃ¥râ€¦',
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
    desc: 'Ta hand om bostadsnycklar och gÃ¶r en adressÃ¤ndring fÃ¶r den avlidnes post via adressÃ¤ndring.se. Viktiga brev kan annars gÃ¥ fÃ¶rlorade.',
    urgency: 'today',
    time: 'ca 20 min',
    link: 'https://www.adressandring.se',
    triggers: [],
    notesPlaceholder: 'Var finns nycklarna? AdressÃ¤ndring gjord hos Postnord?',
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
    triggers: ['flera_delÃ¤gare'],
    hasDoc: 'fullmakt',
    assigneeLabel: 'Vem fÃ¥r fullmakten?',
  },
  {
    id: 'bouppteckning',
    title: 'Planera bouppteckningen',
    desc: 'En bouppteckning Ã¤r en fÃ¶rteckning Ã¶ver den avlidnes tillgÃ¥ngar och skulder. Den ska vara klar inom 3 mÃ¥nader och skickas till Skatteverket inom 4 mÃ¥nader.<br><br><strong>Ã„r boet litet?</strong> Om tillgÃ¥ngarna knappt tÃ¤cker begravnings- och bouppteckningskostnaderna kan du istÃ¤llet gÃ¶ra en <em>dÃ¶dsboanmÃ¤lan</em> hos kommunens socialtjÃ¤nst â€” det Ã¤r gratis och enklare. Kontakta socialtjÃ¤nsten fÃ¶r att se om det gÃ¤ller dig.<br><br><strong>GÃ¶ra sjÃ¤lv:</strong> MÃ¶jligt om boet Ã¤r enkelt (bara bankmedel och lÃ¶sÃ¶re). KrÃ¤ver tvÃ¥ utomstÃ¥ende vittnen som inte Ã¤r arvingar. Sparar 6 500â€“15 000 kr.<br><strong>Anlita jurist:</strong> Rekommenderas vid fastighet, fÃ¶retag, testamente eller om arvingarna inte Ã¤r Ã¶verens.',
    urgency: 'week',
    time: 'Kontakta jurist inom veckan',
    link: null,
    triggers: [],
    resources: [
      { label: 'Familjens Jurist â€” rikstÃ¤ckande, specialiserade pÃ¥ dÃ¶dsbon', url: 'https://www.familjens-jurist.se' },
      { label: 'Advokatsamfundet â€” hitta advokat nÃ¤ra dig', url: 'https://www.advokatsamfundet.se/hitta-advokat' },
    ],
    notesPlaceholder: 'Jurist kontaktad, offert, datum fÃ¶r fÃ¶rrÃ¤ttningâ€¦',
  },
  {
    id: 'bank_kontakt',
    title: 'Kontakta banken',
    desc: 'Meddela banken om dÃ¶dsfallet sÃ¥ att kontona hanteras korrekt. Ha dÃ¶dsbevis och personnummer redo. Skriv ned vilka banker du kÃ¤nner till nedan â€” du kan fylla pÃ¥ efterhand.',
    urgency: 'week',
    time: 'ca 30 min',
    link: null,
    triggers: [],
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
    desc: `FÃ¶rsÃ¤kringskassan behÃ¶ver meddelas om dÃ¶dsfallet fÃ¶r att stoppa lÃ¶pande utbetalningar och fÃ¶r att du ska kunna ansÃ¶ka om fÃ¶rmÃ¥ner du kan ha rÃ¤tt till.<br><br>
<strong>Stoppa automatiskt:</strong> Barnbidrag, bostadsbidrag, sjukpenning och andra bidrag avslutas inte alltid automatiskt â€” kontakta FK fÃ¶r att undvika Ã¥terkrav.<br><br>
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
    notesPlaceholder: 'Ã„renden Ã¶ppnade, Ã¤rendenummer, beviljade fÃ¶rmÃ¥nerâ€¦',
  },

  // â”€â”€ LATER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'abonnemang',
    title: 'Avsluta abonnemang och prenumerationer',
    desc: 'Mobil, streaming, tidningar, el, gym â€” sÃ¤g upp tjÃ¤nster en efter en. AnvÃ¤nd dokumentgeneratorn fÃ¶r att skapa uppsÃ¤gningsbrev. Skriv ned det du vet eller hittar nedan.',
    urgency: 'later',
    time: 'ca 1â€“2 timmar',
    link: null,
    triggers: [],
    hasDoc: 'bulk',
    notesPlaceholder: 'Vet du nÃ¥gra abonnemang eller tjÃ¤nster? Notera dem hÃ¤r â€” du kan fylla pÃ¥. (t.ex. Telia, Spotify, Netflix, el, gymâ€¦)',
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
    desc: 'DÃ¶dsboet Ã¤r skattskyldigt och kan behÃ¶va lÃ¤mna in en deklaration. Kontakta Skatteverket eller en revisor.',
    urgency: 'later',
    time: 'Senast 2 maj efter dÃ¶dsÃ¥ret',
    link: 'https://www.skatteverket.se',
    triggers: [],
    notesPlaceholder: 'Deklaration inlÃ¤mnad, revisor anlitad, datumâ€¦',
  },

  // â”€â”€ CONDITIONAL: Fastighet â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'fastighet_boende',
    title: 'Besluta om bostadens framtid',
    desc: 'Ska bostaden sÃ¤ljas, Ã¶vertas av anhÃ¶rig, eller hyras ut? Ta detta beslut med alla delÃ¤gare i boet.',
    urgency: 'week',
    time: 'Diskussion med familjen',
    link: null,
    triggers: ['fastighet'],
    notesPlaceholder: 'Beslut om bostaden, kontaktad mÃ¤klare eller arvingeâ€¦',
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
    desc: 'NÃ¤r en fastighet Ã¤rvs mÃ¥ste den nya Ã¤garen ansÃ¶ka om lagfart hos LantmÃ¤teriet. AnsÃ¶kan ska gÃ¶ras inom 3 mÃ¥nader frÃ¥n att bouppteckningen registrerats hos Skatteverket. StÃ¤mpelskatten Ã¤r 1,5 % av fastighetens taxeringsvÃ¤rde, plus en expeditionsavgift pÃ¥ 825 kr.',
    urgency: 'later',
    time: 'ca 30 min online',
    link: 'https://www.lantmateriet.se/sv/fastigheter/agande-och-rattigheter/lagfart/',
    triggers: ['fastighet'],
    notesPlaceholder: 'AnsÃ¶kan skickad, datum, stÃ¤mpelskatt berÃ¤knadâ€¦',
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
    desc: 'Samla en komplett bild av lÃ¥n, krediter och obetalda rÃ¤kningar. Skulder betalas av dÃ¶dsboet innan arv utbetalas.<br><br><strong>Viktigt:</strong> Begravnings- och bouppteckningskostnader prioriteras fÃ¶re alla andra skulder. Om boet inte rÃ¤cker till kontaktar du borgenÃ¤rerna och begÃ¤r anstÃ¥nd tills bouppteckningen Ã¤r klar. Du som anhÃ¶rig Ã¤r <em>inte</em> personligt betalningsansvarig fÃ¶r den avlidnes skulder.',
    urgency: 'week',
    time: 'ca 1â€“2 timmar',
    link: null,
    triggers: ['skulder'],
    notesPlaceholder: 'Skulder listade, kontakter till borgenÃ¤rer, beloppâ€¦',
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
  {
    id: 'make_bostadsratt',
    title: 'Kontrollera bostadsrÃ¤ttens framtid',
    desc: 'Om ni bodde i bostadsrÃ¤tt ihop â€” kontakta bostadsrÃ¤ttsfÃ¶reningen om hur Ã¶verlÃ¥telse eller fortsatt boende hanteras.',
    urgency: 'week',
    time: 'ca 30 min',
    link: null,
    triggers: ['make'],
    notesPlaceholder: 'BRF kontaktad, beslut om boende eller Ã¶verlÃ¥telseâ€¦',
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
    urgency: 'later',
    time: 'Din tid',
    link: 'https://www.1177.se/liv-halsa/psykisk-halsa/sorg/',
    triggers: [],
    notesPlaceholder: 'Vad hjÃ¤lper dig just nu? Ã„r det nÃ¥gon du vill ringa?',
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
  if (state.ansvar === 'flera') triggers.add('flera_delÃ¤gare');
  if (state.fordon)      triggers.add('fordon');
  if (state.husdjur)     triggers.add('husdjur');
  if (state.hyresratt)   triggers.add('hyresratt');

  state.tasks = TASK_LIBRARY.filter(task =>
    task.triggers.length === 0 || task.triggers.some(t => triggers.has(t))
  ).map(task => ({ ...task, done: false, started: false }));

  loadTaskState();
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
  if (value.length > 0) track('Note Saved', { task: taskId });
}, 400);

function getTaskNote(taskId) {
  return _getNotes()[taskId] || '';
}

function saveTaskState() {
  const saved = {};
  state.tasks.forEach(t => { saved[t.id] = { done: t.done, started: t.started, assignee: t.assignee || null }; });
  try { localStorage.setItem('efterplan_tasks', JSON.stringify(saved)); } catch(e) {}
}

function loadTaskState() {
  try {
    const saved = JSON.parse(localStorage.getItem('efterplan_tasks') || '{}');
    state.tasks = state.tasks.map(t => {
      const s = saved[t.id];
      if (!s) return t;
      // Backward-compat: old format stored a boolean
      if (typeof s === 'boolean') return { ...t, done: s, started: false };
      return { ...t, done: s.done || false, started: s.started || false, assignee: s.assignee || null };
    });
  } catch(e) {}
}

// â”€â”€â”€ PARTICIPANTS NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderParticipants() {
  const container = document.getElementById('plan-participants');
  if (!container) return;
  const participants = state.participants || [];
  const deceased = state.name ? state.name.trim() : '';

  // Deceased first (different style â€” primary chip)
  const deceasedChip = deceased
    ? `<span class="plan-participant-chip plan-participant-chip--deceased"
         title="${deceased}">${deceased.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase()}</span>`
    : '';

  const chips = participants.map(name => {
    const initials = name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return `<span class="plan-participant-chip" title="${name}">${initials}</span>`;
  }).join('');

  container.innerHTML = deceasedChip + chips +
    `<button class="plan-participant-add-btn" onclick="openModal('modal-participants')" title="LÃ¤gg till deltagare" aria-label="LÃ¤gg till deltagare">+</button>`;
}

// â”€â”€â”€ RENDER PLAN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function renderPlan() {
  renderParticipants();
  const name = state.name;
  document.getElementById('plan-title').textContent =
    name ? `${name}s efterplan` : 'Din efterplan';
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
  renderTaskList('tasks-today', today,  nextTaskId);
  renderTaskList('tasks-week',  week,   nextTaskId);
  renderTaskList('tasks-later', later,  nextTaskId);

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

function renderTaskList(containerId, tasks, nextTaskId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  tasks.forEach((task, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'task-wrap';
    wrap.id = `task-wrap-${task.id}`;

    const linkHtml = task.link
      ? `<a class="task-expand-link" href="${task.link}" target="_blank" rel="noopener">Ã–ppna ${task.link.replace('https://www.', '')} â†—</a>`
      : '';

    const phoneHtml = task.phone
      ? `<a class="task-expand-phone" href="tel:${task.phone.replace(/\s|-/g,'')}">Ring ${task.phone}</a>`
      : '';

    const phone2Html = task.phone2
      ? `<a class="task-expand-phone task-expand-phone--secondary" href="tel:${task.phone2.replace(/\s|-/g,'')}">Ring ${task.phone2}</a>`
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

    const docHtml = task.hasDoc && !task.done
      ? `<button class="task-expand-doc" onclick="event.stopPropagation();switchTab('docs');showDocForm('${task.hasDoc}')">Generera dokument â†’</button>`
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
        <div class="task-chevron" id="chevron-${task.id}" aria-hidden="true">â€º</div>
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
    // Ã…terstÃ¤ll badge fÃ¶r tidigare Ã¶ppnad uppgift
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
  // DÃ¶lj badge nÃ¤r uppgiften Ã¤r expanderad (syns i pickern istÃ¤llet)
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
      <div class="bill-info">
        <span class="bill-desc">${b.desc}</span>
        ${b.amount ? `<span class="bill-amount">${b.amount} kr</span>` : ''}
      </div>
      <button class="bill-delete" onclick="deleteBill('${b.id}')" aria-label="Ta bort">Ã—</button>
    </li>`).join('');
}
function showBillForm() {
  document.getElementById('bill-form').classList.remove('hidden');
  document.getElementById('bill-desc-input').focus();
}
function hideBillForm() {
  document.getElementById('bill-form').classList.add('hidden');
  document.getElementById('bill-desc-input').value = '';
  document.getElementById('bill-amount-input').value = '';
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
  state.bills.push({ id: Date.now().toString(), desc, amount: amount || '', paid: false });
  saveBills();
  renderBills();
  hideBillForm();
  track('Bill Added');
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
  track('Task Complete', { task: taskId, urgency: task.urgency || 'unknown' });

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
}

// â”€â”€â”€ ASSIGNEES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Single source of truth: state.participants â€” same list used for task
// assignment and notify notifier. Add people via the + button in the nav.
function _getAssignees() {
  return state.participants || [];
}
function getTaskAssignee(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  return task ? (task.assignee || null) : null;
}
function setTaskAssignee(taskId, name) {
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
              title="LÃ¤gg till deltagare">+ LÃ¤gg till deltagare</button>`;
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

// â”€â”€â”€ PARTICIPANTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _getParticipants() {
  return state.participants || [];
}
function addParticipant() {
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
  state.participants = (state.participants || []).filter(n => n !== name);
  saveState();
  _refreshParticipantList();
  _refreshAllAssigneePickers();
}
function _refreshParticipantList() {
  // Onboarding list â€” simple chips
  const obList = document.getElementById('ob-participant-list');
  if (obList) {
    obList.innerHTML = (state.participants || []).map(name =>
      `<div class="ob-participant-chip">
        <span>${name}</span>
        <button onclick="removeParticipant('${name.replace(/'/g, "\\'")}')" aria-label="Ta bort ${name}">Ã—</button>
      </div>`
    ).join('');
  }
  // Modal list â€” with optional personnr input
  const modalList = document.getElementById('modal-participant-list');
  if (modalList) {
    if (!(state.participants || []).length) {
      modalList.innerHTML = '<p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">Inga deltagare tillagda Ã¤nnu.</p>';
      return;
    }
    modalList.innerHTML = (state.participants || []).map(name => {
      const safeN = name.replace(/'/g, "\\'");
      const personnr = (state.participantPersonnr || {})[name] || '';
      return `<div class="modal-participant-item">
        <div class="modal-participant-row">
          <span class="modal-participant-name">${name}</span>
          <button class="modal-participant-remove" onclick="removeParticipant('${safeN}')" aria-label="Ta bort ${name}">Ã—</button>
        </div>
        <input type="text" class="participant-personnr-input"
               placeholder="Personnummer (valfritt â€” fÃ¶r fullmakter)"
               value="${personnr}"
               onchange="saveParticipantPersonnr('${safeN}', this.value)" />
      </div>`;
    }).join('');
  }
}

function saveParticipantPersonnr(name, val) {
  if (!state.participantPersonnr) state.participantPersonnr = {};
  state.participantPersonnr[name] = val.trim();
  saveState();
}

// â”€â”€â”€ NOTIFY LIST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _getNotifyList() {
  try { return JSON.parse(localStorage.getItem('efterplan_notify_list') || '[]'); } catch(e) { return []; }
}
function _saveNotifyList(list) {
  try { localStorage.setItem('efterplan_notify_list', JSON.stringify(list)); } catch(e) {}
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
  if (!list.length) return '<p class="notify-empty">Inga tillagda Ã¤n</p>';
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
          aria-label="Markera ${p.name} som meddelad">${p.notified ? 'âœ“' : ''}</button>
        <span class="notify-name">${p.name}</span>
        ${notifierSelect}
        <button class="notify-remove"
          onclick="event.stopPropagation();removeNotifyPerson('${safeId}')"
          aria-label="Ta bort ${p.name}">Ã—</button>
      </div>`;
  }).join('');
}

function renderNotifyList() {
  const list = _getNotifyList();
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
  renderPlan();   // full re-render restores accordion, buttons, notes
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

// â”€â”€â”€ TABS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function switchTab(name) {
  document.querySelectorAll('.plan-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.plan-tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  document.getElementById(`tabcontent-${name}`).classList.add('active');
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
  return {
    name:  localStorage.getItem('efterplan_sender_name')  || '',
    email: localStorage.getItem('efterplan_sender_email') || ''
  };
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

// â”€â”€â”€ BULK UPPSÃ„GNING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  const email  = document.getElementById('bulk-email').value.trim();
  clearFormError('err-bulk');
  if (!sender || !email) { showFormError('err-bulk', 'Fyll i ditt namn och din e-post.'); return; }

  // Show loading state â€” lets browser repaint before synchronous work
  const genBtn = document.querySelector('#doc-form-bulk .btn-primary');
  if (genBtn) { genBtn.disabled = true; genBtn.textContent = 'FÃ¶rbereder brevâ€¦'; }
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
  if (services.length === 0) { showFormError('err-bulk', 'LÃ¤gg till minst en tjÃ¤nst med namn.'); return; }

  const { deceased, personnr, today } = getDocContext();

  const letters = services.map(({ name, custnr }) => ({
    service: name,
    text: `${sender}\n${email}\n\n${today}\n\nTill: ${name}\nÃ„rende: Avslutning av abonnemang â€” dÃ¶dsfall${custnr ? '\nKundnummer: ' + custnr : ''}\n\nHej,\n\nJag kontaktar er angÃ¥ende abonnemanget som tillhÃ¶rde ${deceased} (personnr ${personnr}), som tyvÃ¤rr har gÃ¥tt bort.\n\nJag ber er hÃ¤rmed avsluta abonnemanget snarast mÃ¶jligt och begÃ¤r Ã¥terbetalning fÃ¶r eventuell fÃ¶rbetald period efter avslutsdatum.\n\nJag bifogar dÃ¶dsbevis och Ã¤r tillgÃ¤nglig fÃ¶r frÃ¥gor via e-post.\n\nVÃ¤nligen bekrÃ¤fta avslut skriftligen.\n\nMed vÃ¤nliga hÃ¤lsningar,\n\n${sender}\n${email}`,
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
  if (genBtn) { genBtn.disabled = false; genBtn.textContent = 'Skapa alla brev â†’'; }
  track('Doc Generated', { title: 'Bulk uppsÃ¤gning', count: String(services.length) });
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
  if (!service || !sender || !email) { showFormError('err-letter', 'Fyll i de obligatoriska fÃ¤lten (mÃ¤rkta med *).'); return; }
  saveSenderInfo(sender, email);

  const { deceased, personnr, today } = getDocContext();
  const custnrLine = custnr ? `\nKundnummer: ${custnr}` : '';

  showDocResult('UppsÃ¤gningsbrev â€” ' + service, `${sender}
${email}

${today}

Till: ${service}
Ã„rende: Avslutning av abonnemang â€” dÃ¶dsfall${custnrLine}

Hej,

Jag kontaktar er angÃ¥ende abonnemanget som tillhÃ¶rde ${deceased} (personnr ${personnr}), som tyvÃ¤rr har gÃ¥tt bort.

Jag ber er hÃ¤rmed avsluta abonnemanget snarast mÃ¶jligt och begÃ¤r Ã¥terbetalning fÃ¶r eventuell fÃ¶rbetald period efter avslutsdatum.

Jag bifogar dÃ¶dsbevis och Ã¤r tillgÃ¤nglig fÃ¶r eventuella frÃ¥gor via e-post.

VÃ¤nligen bekrÃ¤fta avslut skriftligen.

Med vÃ¤nliga hÃ¤lsningar,

${sender}
${email}`);
}

function generateBank() {
  const bank     = document.getElementById('bank-name').value.trim();
  const sender   = document.getElementById('bank-sender').value.trim();
  const relation = document.getElementById('bank-relation').value.trim();
  const email    = document.getElementById('bank-email').value.trim();
  clearFormError('err-bank');
  if (!bank || !sender || !relation || !email) { showFormError('err-bank', 'Fyll i de obligatoriska fÃ¤lten (mÃ¤rkta med *).'); return; }
  saveSenderInfo(sender, email);

  const { deceased, personnr, today } = getDocContext();

  showDocResult('Brev till ' + bank, `${sender}
${email}

${today}

Till: ${bank}
Ã„rende: DÃ¶dsfallsnotifiering â€” begÃ¤ran om kontospÃ¤rr och tillgÃ¥ngsinformation

Hej,

Jag skriver till er med anledning av att ${deceased} (personnr ${personnr}) har gÃ¥tt bort. Jag Ã¤r ${relation} och representerar dÃ¶dsboet.

Jag begÃ¤r hÃ¤rmed att:

1. Samtliga konton tillhÃ¶rande ${deceased} spÃ¤rras tills bouppteckning Ã¤r genomfÃ¶rd.
2. En fÃ¶rteckning Ã¶ver befintliga konton och tillgÃ¥ngar skickas till mig.
3. Ni bekrÃ¤ftar skriftligen att ni tagit emot detta meddelande.

DÃ¶dsbevis bifogas detta brev. Ytterligare dokumentation (bouppteckning, fullmakt) skickas sÃ¥ snart det Ã¤r tillgÃ¤ngligt.

FÃ¶r frÃ¥gor, kontakta mig pÃ¥ angiven e-postadress.

Med vÃ¤nliga hÃ¤lsningar,

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
  if (!bolag || !sender || !relation || !email) { showFormError('err-forsakring', 'Fyll i de obligatoriska fÃ¤lten (mÃ¤rkta med *).'); return; }
  saveSenderInfo(sender, email);

  const { deceased, personnr, today } = getDocContext();

  showDocResult('Brev till ' + bolag, `${sender}
${email}

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

  const lifeSpan  = (born && died) ? `${born} â€“ ${died}` : (died ? `Avled ${died}` : '');
  const memLine   = memory ? `\n${memory}\n` : '';
  const survLine  = survivors ? `\nEfterlÃ¤mnas av ${survivors}.` : '';
  const funLine   = funeral ? `\nBegravning: ${funeral}.` : '\nBegravning meddelas i god tid.';
  const ovrigtLine = ovrigt ? `\n\n${ovrigt}` : '';

  showDocResult('DÃ¶dsannons â€” ' + name, `${name}
${lifeSpan}
${memLine}${survLine}
${funLine}

SÃ¶rjd och saknad.${ovrigtLine}`.trim());
}

function showDocResult(title, text, emailSubject) {
  track('Doc Generated', { title: title.split(' â€” ')[0] });
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
  if (!sender || !relation || !email) { showFormError('err-skatteverket', 'Fyll i de obligatoriska fÃ¤lten (mÃ¤rkta med *).'); return; }

  const { deceased, personnr, today } = getDocContext();

  const arendeTexts = {
    intyg:    { subject: 'BegÃ¤ran om dÃ¶dsfallsintyg och personbevis fÃ¶r dÃ¶dsbo', body: `Jag kontaktar er fÃ¶r att begÃ¤ra dÃ¶dsfallsintyg och personbevis avseende dÃ¶dsboet efter ${deceased} (personnr ${personnr}), som gick bort nyligen.\n\nDokumenten behÃ¶vs fÃ¶r dÃ¶dsboets rÃ¤kning i samband med bouppteckning och kontakt med banker och myndigheter.\n\nJag Ã¤r ${relation} och dÃ¶dsbodelÃ¤gare. VÃ¤nligen skicka handlingarna till angiven e-postadress, eller meddela hur ansÃ¶kan gÃ¶rs via er e-tjÃ¤nst.` },
    fskatt:   { subject: 'BegÃ¤ran om avslut av F-skatt â€” dÃ¶dsfall', body: `Jag kontaktar er med anledning av att ${deceased} (personnr ${personnr}) har gÃ¥tt bort och att den av hen bedrivna enskilda nÃ¤ringsverksamheten dÃ¤rmed ska avslutas.\n\nJag ber er avregistrera F-skatten och eventuell mervÃ¤rdesskatt (moms) med dÃ¶dsdatum som slutdatum.\n\nJag Ã¤r ${relation} och fÃ¶retrÃ¤der dÃ¶dsboet. DÃ¶dsbevis bifogas. Kontakta mig fÃ¶r ytterligare dokumentation.` },
    slutskatt: { subject: 'BegÃ¤ran om information om slutlig skatt â€” dÃ¶dsfall', body: `Jag kontaktar er angÃ¥ende slutlig skatt fÃ¶r ${deceased} (personnr ${personnr}), som har gÃ¥tt bort.\n\nJag ber er bekrÃ¤fta om det finns kvarsstÃ¥ende skattefordringar eller skatteÃ¥terbÃ¤ring att reglera, samt hur dÃ¶dsboet ska gÃ¥ till vÃ¤ga.\n\nJag Ã¤r ${relation} och dÃ¶dsbodelÃ¤gare. VÃ¤nligen kontakta mig pÃ¥ angiven e-postadress.` },
  };

  const { subject, body } = arendeTexts[arende];

  showDocResult(`Skatteverket â€” ${subject}`, `${sender}\n${email}\n\n${today}\n\nTill: Skatteverket\nÃ„rende: ${subject}\n\nHej,\n\n${body}\n\nMed vÃ¤nliga hÃ¤lsningar,\n\n${sender}\n${relation} till ${deceased}\n${email}`, subject);
}


function generateFullmakt() {
  const grantor1 = document.getElementById('fullmakt-grantor1').value.trim();
  const grantor2 = document.getElementById('fullmakt-grantor2').value.trim();
  const agent    = document.getElementById('fullmakt-agent').value.trim();
  const relation = document.getElementById('fullmakt-relation').value.trim();
  clearFormError('err-fullmakt');
  if (!grantor1 || !agent) { showFormError('err-fullmakt', 'Fyll i de obligatoriska fÃ¤lten (mÃ¤rkta med *).'); return; }

  const { deceased, personnr, today } = getDocContext();
  const grantors = grantor2 ? `${grantor1} och ${grantor2}` : grantor1;
  const agentLine = relation ? `${agent} (${relation})` : agent;

  showDocResult('Fullmakt â€” dÃ¶dsbo', `FULLMAKT
UtfÃ¤rdad: ${today}

Vi, undertecknade dÃ¶dsbodelÃ¤gare efter ${deceased} (personnr ${personnr}), ger hÃ¤rmed

  ${agentLine}

fullmakt att fÃ¶r dÃ¶dsboets rÃ¤kning:

â€¢ Kontakta och fÃ¶retrÃ¤da dÃ¶dsboet gentemot banker och finansinstitut
â€¢ BegÃ¤ra kontoinformation och genomfÃ¶ra betalningar ur dÃ¶dsboets medel
â€¢ Teckna dÃ¶dsboets namn i lÃ¶pande Ã¤renden
â€¢ Kontakta myndigheter (Skatteverket, Kronofogden m.fl.) Ã¥ dÃ¶dsboets vÃ¤gnar
â€¢ SÃ¤ga upp avtal och abonnemang tillhÃ¶rande ${deceased}

Fullmakten gÃ¤ller tills dÃ¶dsboet Ã¤r avslutat och ska uppvisas i original vid bankbesÃ¶k.


______________________________    ______________________________
${grantors}
DÃ¶dsbodelÃ¤gare                    Datum och ort`);
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
  // Save locally with personnr (own device only â€” never shared)
  const toSave = { ...getShareableState(), personnr: state.personnr };
  try { localStorage.setItem('efterplan_state', JSON.stringify(toSave)); } catch(e) {}
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

// â”€â”€â”€ PDF / PRINT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function printPlan() {
  track('Plan Printed');
  window.print();
}

// â”€â”€â”€ PAYWALL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
(function initPaywall() {
  const card = document.getElementById('paywall-card');
  if (!card) return;
  if (PAYWALL_ENABLED) card.classList.remove('hidden');
})();

function handlePaywallCTA() {
  // Placeholder â€” wire Stripe Checkout URL here when ready
  track('Paywall CTA Clicked');
  alert('Betalning Ã¤r inte aktiverat Ã¤nnu â€” kom tillbaka snart!');
}

// â”€â”€â”€ INIT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
(function init() {
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
