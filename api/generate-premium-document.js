import { getStripe, getSupabaseAdmin, normalizeEmail, getClientIp, checkRateLimit, stripeIsLiveMode } from './_lib.js';

const TYPES = new Set(['letter', 'bulk', 'bank', 'annons', 'skatteverket', 'fullmakt', 'hyresvard', 'pension']);
const LIMITS = { field: 500, context: 300 };
const MAX_BODY_BYTES = 100_000;
const val = (o, k, max = LIMITS.field) => typeof o?.[k] === 'string' ? o[k].trim().slice(0, max) : '';

async function hasEntitlement(req, body) {
  const sessionId = typeof body.sessionId === 'string' && body.sessionId.startsWith('cs_') ? body.sessionId : '';
  if (sessionId) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
      const item = session.line_items?.data?.[0];
      if (session.mode === 'payment' && session.metadata?.source === 'efterplan_paywall' &&
          session.payment_status === 'paid' && session.amount_total > 0 &&
          item?.price?.id === process.env.STRIPE_PRICE_ID && item.quantity === 1) return true;
    } catch {
      // A stale or invalid stored session must not prevent a valid Supabase
      // purchase entitlement from being checked below.
    }
  }
  const match = /^Bearer\s+([^\s]+)$/i.exec(req.headers.authorization || '');
  if (!match) return false;
  const livemode = stripeIsLiveMode();
  if (livemode === null) return false;
  const supa = getSupabaseAdmin();
  const { data, error } = await supa.auth.getUser(match[1]);
  if (error || !data?.user?.id) return false;
  const { count, error: purchaseError } = await supa.from('purchases').select('id', { count: 'exact', head: true })
    .eq('user_id', data.user.id).eq('livemode', livemode);
  if (purchaseError) throw purchaseError;
  if (count > 0) return true;
  const email = normalizeEmail(data.user.email);
  if (!email) return false;
  const legacy = await supa.from('purchases').select('id', { count: 'exact', head: true })
    .eq('email', email).eq('livemode', livemode);
  if (legacy.error) throw legacy.error;
  return legacy.count > 0;
}

function generate(type, f, c) {
  const sender = val(f, 'sender'), email = val(f, 'email'), relation = val(f, 'relation');
  const deceased = val(c, 'deceased', LIMITS.context) || '[NAMN PÅ AVLIDEN]';
  const personnr = val(c, 'personnr', LIMITS.context) || '[PERSONNUMMER]';
  const today = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'long', timeZone: 'Europe/Stockholm' }).format(new Date());
  const address = [val(f, 'address'), [val(f, 'zip'), val(f, 'city')].filter(Boolean).join(' ')].filter(Boolean).join('\n');
  const head = `${sender}\n${email}${address ? `\n${address}` : ''}\n\n${today}`;
  const footer = `Med vänliga hälsningar,\n\n${sender}\n${relation ? `${relation} till ${deceased}\n` : ''}${email}`;
  let title, text, emailSubject, phoneScript;
  switch (type) {
    case 'letter': {
      const service = val(f, 'service'), customer = val(f, 'custnr'); title = `Uppsägningsbrev — ${service}`;
      text = `${head}\n\nTill: ${service}\nÄrende: Avslutning av abonnemang — dödsfall${customer ? `\nKundnummer: ${customer}` : ''}\n\nHej,\n\nJag kontaktar er angående abonnemanget som tillhörde ${deceased} (personnr ${personnr}), som tyvärr har gått bort.\n\nJag ber er härmed avsluta abonnemanget snarast möjligt och begär återbetalning för eventuell förbetald period efter avslutsdatum.\n\nJag bifogar dödsbevis och är tillgänglig för eventuella frågor via e-post.\n\nVänligen bekräfta avslut skriftligen.\n\n${footer}`; break;
    }
    case 'bulk': {
      const services = Array.isArray(f.services) ? f.services : [];
      if (!sender || !email || !services.length || services.length > 20) throw new Error('invalid_fields');
      const letters = services.map(s => { const service = val(s, 'name'); const customer = val(s, 'custnr'); if (!service) return null; return { service, text: `${head}\n\nTill: ${service}\nÄrende: Avslutning av abonnemang — dödsfall${customer ? `\nKundnummer: ${customer}` : ''}\n\nHej,\n\nJag kontaktar er angående abonnemanget som tillhörde ${deceased} (personnr ${personnr}), som tyvärr har gått bort.\n\nJag ber er härmed avsluta abonnemanget snarast möjligt och begär återbetalning för eventuell förbetald period efter avslutsdatum.\n\nJag bifogar dödsbevis och är tillgänglig för frågor via e-post.\n\nVänligen bekräfta avslut skriftligen.\n\nMed vänliga hälsningar,\n\n${sender}\n${email}` }; }).filter(Boolean);
      if (!letters.length) throw new Error('invalid_fields'); return { bulk: true, letters };
    }
    case 'bank': {
      const bank = val(f, 'bank'); title = `Brev till ${bank}`;
      text = `${head}\n\nTill: ${bank}\nÄrende: Dödsfallsnotifiering — begäran om kontospärr och tillgångsinformation\n\nHej,\n\nJag skriver till er med anledning av att ${deceased} (personnr ${personnr}) har gått bort. Jag är ${relation} och representerar dödsboet.\n\nJag begär härmed att:\n\n1. Samtliga konton tillhörande ${deceased} spärras tills bouppteckning är genomförd.\n2. En förteckning över befintliga konton och tillgångar skickas till mig.\n3. Ni bekräftar skriftligen att ni tagit emot detta meddelande.\n\nDödsbevis bifogas detta brev. Ytterligare dokumentation (bouppteckning, fullmakt) skickas så snart det är tillgängligt.\n\nFör frågor, kontakta mig på angiven e-postadress.\n\n${footer}`;
      phoneScript = { text: `Hej, jag heter ${sender}. Jag är ${relation} till ${deceased}, som har gått bort, och jag ringer för att anmäla dödsfallet.\n\nKan ni spärra kontona som stod i hens namn, och kan jag få en förteckning över konton och tillgångar?\n\nJag kan mejla eller posta dödsbeviset till er — vad vill ni ha det till, och behöver ni något mer av mig just nu?`, checklist: ['Den avlidnes personnummer', 'Ditt eget namn och personnummer', 'Eventuellt kundnummer hos banken', 'Din relation till den avlidne'] }; break;
    }
    case 'hyresvard': {
      const landlord = val(f, 'landlord'), addressLine = val(f, 'propertyAddress'); title = 'Brev till hyresvärden'; emailSubject = 'Uppsägning av hyreskontrakt — dödsfall';
      text = `${head}\n\nTill: ${landlord || 'Hyresvärden'}\nÄrende: Uppsägning av hyreskontrakt — dödsfall${addressLine ? `\nAvser: ${addressLine}` : ''}\n\nHej,\n\nJag skriver angående hyresavtalet för ${deceased} (personnr ${personnr}), som har gått bort.\n\nJag är ${relation} och företräder dödsboet. Jag säger härmed upp hyresavtalet med en månads uppsägningstid från detta brev, i enlighet med 12 kap. 31 § jordabalken.\n\nVar vänlig bekräfta uppsägningen och meddela datum och tid för besiktning och nyckelöverlämnande. Dödsbevis bifogas.\n\n${footer}`;
      phoneScript = { text: `Hej, jag heter ${sender}. Jag är ${relation} till ${deceased}, som har gått bort, och jag ringer angående hens hyreslägenhet.\n\nJag vill säga upp lägenheten. Kan ni bekräfta uppsägningstiden och när ni vill ha nycklarna tillbaka?\n\nJag kan mejla dödsbevis och en skriftlig uppsägning — vad behöver ni av mig?`, checklist: ['Den avlidnes personnummer', 'Lägenhetens adress', 'Din relation till den avlidne', 'Dödsbevis (begärs av hyresvärden)'] }; break;
    }
    case 'pension': {
      const child = val(f, 'type') === 'barnpension'; const subject = child ? 'Ansökan om barnpension och efterlevandestöd' : 'Ansökan om omställningspension'; title = `Pensionsmyndigheten — ${subject}`; emailSubject = subject;
      const body = child ? `Jag kontaktar er med anledning av att ${deceased} (personnr ${personnr}), förälder till barn under 20 år, har gått bort.\n\nJag ber er informera om rätten till barnpension och eventuellt efterlevandestöd för barnet/barnen, samt hur ansökan görs.` : `Jag kontaktar er för att ansöka om omställningspension med anledning av att min ${relation}, ${deceased} (personnr ${personnr}), har gått bort.\n\nJag uppfyller villkoren för omställningspension (gemensamt hushåll, ej ålderspension). Jag ber er bekräfta att ansökan tagits emot och informera om nästa steg.\n\nOmställningspension betalas inte ut retroaktivt — jag ansöker därför snarast.`;
      text = `${head}\n\nTill: Pensionsmyndigheten\nÄrende: ${subject}\n\nHej,\n\n${body}\n\nDödsbevis bifogas. Kontakta mig för ytterligare dokumentation.\n\n${footer}`;
      phoneScript = { text: `Hej, jag heter ${sender}. Jag är ${relation} till ${deceased}, som har gått bort. Jag ringer för att ${child ? 'fråga om barnpension för ett barn under 20 år' : 'ansöka om omställningspension'}.\n\nKan ni bekräfta vad som gäller och vad jag behöver skicka in?${child ? '' : '\n\nObservera att omställningspension inte betalas ut retroaktivt — det är viktigt att ansöka snabbt.'}`, checklist: ['Den avlidnes personnummer', 'Ditt eget personnummer', 'Din relation till den avlidne'] }; break;
    }
    case 'skatteverket': {
      const kind = val(f, 'case'); const subjects = { intyg: 'Begäran om dödsfallsintyg och personbevis för dödsbo', fskatt: 'Begäran om avslut av F-skatt — dödsfall', slutskatt: 'Begäran om information om slutlig skatt — dödsfall' }; emailSubject = subjects[kind] || subjects.intyg; title = `Skatteverket — ${emailSubject}`;
      const bodies = { intyg: `Jag kontaktar er för att begära dödsfallsintyg och personbevis avseende dödsboet efter ${deceased} (personnr ${personnr}), som gick bort nyligen.\n\nDokumenten behövs för dödsboets räkning i samband med bouppteckning och kontakt med banker och myndigheter.\n\nJag är ${relation} och dödsbodelägare. Vänligen skicka handlingarna till angiven e-postadress, eller meddela hur ansökan görs via er e-tjänst.`, fskatt: `Jag kontaktar er med anledning av att ${deceased} (personnr ${personnr}) har gått bort och att den av hen bedrivna enskilda näringsverksamheten därmed ska avslutas.\n\nJag ber er avregistrera F-skatten och eventuell mervärdesskatt (moms) med dödsdatum som slutdatum.\n\nJag är ${relation} och företräder dödsboet. Dödsbevis bifogas. Kontakta mig för ytterligare dokumentation.`, slutskatt: `Jag kontaktar er angående slutlig skatt för ${deceased} (personnr ${personnr}), som har gått bort.\n\nJag ber er bekräfta om det finns kvarstående skattefordringar eller skatteåterbäring att reglera, samt hur dödsboet ska gå till väga.\n\nJag är ${relation} och dödsbodelägare. Vänligen kontakta mig på angiven e-postadress.` };
      text = `${head}\n\nTill: Skatteverket\nÄrende: ${emailSubject}\n\nHej,\n\n${bodies[kind] || bodies.intyg}\n\n${footer}`; break;
    }
    case 'fullmakt': {
      const grantor1 = val(f, 'grantor1'), grantor2 = val(f, 'grantor2'), agent = val(f, 'agent'), agentRelation = val(f, 'agentRelation');
      title = 'Fullmakt — dödsbo'; text = `FULLMAKT\nUtfärdad: ${today}\n\nVi, undertecknade dödsbodelägare efter ${deceased} (personnr ${personnr}), ger härmed\n\n  ${agent}${agentRelation ? ` (${agentRelation})` : ''}\n\nfullmakt att för dödsboets räkning:\n\n• Kontakta och företräda dödsboet gentemot banker och finansinstitut\n• Begära kontoinformation och genomföra betalningar ur dödsboets medel\n• Teckna dödsboets namn i löpande ärenden\n• Kontakta myndigheter (Skatteverket, Kronofogden m.fl.) å dödsboets vägnar\n• Säga upp avtal och abonnemang tillhörande ${deceased}\n\nFullmakten gäller tills dödsboet är avslutat och ska uppvisas i original vid bankbesök.\n\n\n______________________________    ______________________________\n${grantor2 ? `${grantor1} och ${grantor2}` : grantor1}\nDödsbodelägare                    Datum och ort`; break;
    }
    case 'annons': {
      const name = val(f, 'name'), born = val(f, 'born'), died = val(f, 'died'), survivors = val(f, 'survivors'), memory = val(f, 'memory'), funeral = val(f, 'funeral'), other = val(f, 'other');
      const life = born && died ? `${born} – ${died}` : died ? `Avled ${died}` : '';
      title = `Dödsannons — ${name}`; text = `${name}\n${life}${memory ? `\n\n${memory}\n` : ''}${survivors ? `\nEfterlämnas av ${survivors}.` : ''}\n\n${funeral ? `Begravning: ${funeral}.` : 'Begravning meddelas i god tid.'}\n\nSörjd och saknad.${other ? `\n\n${other}` : ''}`.trim(); break;
    }
  }
  if (type === 'bulk') return title ? { title, text, emailSubject, phoneScript } : generate('bulk', f, c);
  if (!title || !text) throw new Error('invalid_document');
  return { title, text, emailSubject, phoneScript };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method_not_allowed' }); }
  const { limited, unavailable } = await checkRateLimit('generate-premium-document', getClientIp(req), 40, { failClosed: true });
  if (unavailable) return res.status(503).json({ error: 'temporarily_unavailable' });
  if (limited) return res.status(429).json({ error: 'rate_limited' });
  try {
    const body = req.body || {};
    if (!TYPES.has(body.type) || Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) {
      return res.status(400).json({ error: 'bad_request' });
    }
    if (!await hasEntitlement(req, body)) return res.status(403).json({ error: 'premium_required' });
    return res.status(200).json({ ok: true, document: generate(body.type, body.fields || {}, body.context || {}) });
  } catch (error) {
    if (error?.message === 'invalid_fields' || error?.message === 'invalid_document') return res.status(400).json({ error: 'invalid_fields' });
    console.error('[generate-premium-document]', error?.message || error);
    return res.status(503).json({ error: 'temporarily_unavailable' });
  }
}
