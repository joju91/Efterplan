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
  const deceased = val(c, 'deceased', LIMITS.context) || '[NAMN PÃ… AVLIDEN]';
  const personnr = val(c, 'personnr', LIMITS.context) || '[PERSONNUMMER]';
  const today = new Intl.DateTimeFormat('sv-SE', { dateStyle: 'long', timeZone: 'Europe/Stockholm' }).format(new Date());
  const address = [val(f, 'address'), [val(f, 'zip'), val(f, 'city')].filter(Boolean).join(' ')].filter(Boolean).join('\n');
  const head = `${sender}\n${email}${address ? `\n${address}` : ''}\n\n${today}`;
  const footer = `Med vÃ¤nliga hÃ¤lsningar,\n\n${sender}\n${relation ? `${relation} till ${deceased}\n` : ''}${email}`;
  let title, text, emailSubject, phoneScript;
  switch (type) {
    case 'letter': {
      const service = val(f, 'service'), customer = val(f, 'custnr'); title = `UppsÃ¤gningsbrev â€” ${service}`;
      text = `${head}\n\nTill: ${service}\nÃ„rende: Avslutning av abonnemang â€” dÃ¶dsfall${customer ? `\nKundnummer: ${customer}` : ''}\n\nHej,\n\nJag kontaktar er angÃ¥ende abonnemanget som tillhÃ¶rde ${deceased} (personnr ${personnr}), som tyvÃ¤rr har gÃ¥tt bort.\n\nJag ber er hÃ¤rmed avsluta abonnemanget snarast mÃ¶jligt och begÃ¤r Ã¥terbetalning fÃ¶r eventuell fÃ¶rbetald period efter avslutsdatum.\n\nJag bifogar dÃ¶dsbevis och Ã¤r tillgÃ¤nglig fÃ¶r eventuella frÃ¥gor via e-post.\n\nVÃ¤nligen bekrÃ¤fta avslut skriftligen.\n\n${footer}`; break;
    }
    case 'bulk': {
      const services = Array.isArray(f.services) ? f.services : [];
      if (!sender || !email || !services.length || services.length > 20) throw new Error('invalid_fields');
      const letters = services.map(s => { const service = val(s, 'name'); const customer = val(s, 'custnr'); if (!service) return null; return { service, text: `${head}\n\nTill: ${service}\nÃ„rende: Avslutning av abonnemang â€” dÃ¶dsfall${customer ? `\nKundnummer: ${customer}` : ''}\n\nHej,\n\nJag kontaktar er angÃ¥ende abonnemanget som tillhÃ¶rde ${deceased} (personnr ${personnr}), som tyvÃ¤rr har gÃ¥tt bort.\n\nJag ber er hÃ¤rmed avsluta abonnemanget snarast mÃ¶jligt och begÃ¤r Ã¥terbetalning fÃ¶r eventuell fÃ¶rbetald period efter avslutsdatum.\n\nJag bifogar dÃ¶dsbevis och Ã¤r tillgÃ¤nglig fÃ¶r frÃ¥gor via e-post.\n\nVÃ¤nligen bekrÃ¤fta avslut skriftligen.\n\nMed vÃ¤nliga hÃ¤lsningar,\n\n${sender}\n${email}` }; }).filter(Boolean);
      if (!letters.length) throw new Error('invalid_fields'); return { bulk: true, letters };
    }
    case 'bank': {
      const bank = val(f, 'bank'); title = `Brev till ${bank}`;
      text = `${head}\n\nTill: ${bank}\nÃ„rende: DÃ¶dsfallsnotifiering â€” begÃ¤ran om kontospÃ¤rr och tillgÃ¥ngsinformation\n\nHej,\n\nJag skriver till er med anledning av att ${deceased} (personnr ${personnr}) har gÃ¥tt bort. Jag Ã¤r ${relation} och representerar dÃ¶dsboet.\n\nJag begÃ¤r hÃ¤rmed att:\n\n1. Samtliga konton tillhÃ¶rande ${deceased} spÃ¤rras tills bouppteckning Ã¤r genomfÃ¶rd.\n2. En fÃ¶rteckning Ã¶ver befintliga konton och tillgÃ¥ngar skickas till mig.\n3. Ni bekrÃ¤ftar skriftligen att ni tagit emot detta meddelande.\n\nDÃ¶dsbevis bifogas detta brev. Ytterligare dokumentation (bouppteckning, fullmakt) skickas sÃ¥ snart det Ã¤r tillgÃ¤ngligt.\n\nFÃ¶r frÃ¥gor, kontakta mig pÃ¥ angiven e-postadress.\n\n${footer}`;
      phoneScript = { text: `Hej, jag heter ${sender}. Jag Ã¤r ${relation} till ${deceased}, som har gÃ¥tt bort, och jag ringer fÃ¶r att anmÃ¤la dÃ¶dsfallet.\n\nKan ni spÃ¤rra kontona som stod i hens namn, och kan jag fÃ¥ en fÃ¶rteckning Ã¶ver konton och tillgÃ¥ngar?\n\nJag kan mejla eller posta dÃ¶dsbeviset till er â€” vad vill ni ha det till, och behÃ¶ver ni nÃ¥got mer av mig just nu?`, checklist: ['Den avlidnes personnummer', 'Ditt eget namn och personnummer', 'Eventuellt kundnummer hos banken', 'Din relation till den avlidne'] }; break;
    }
    case 'hyresvard': {
      const landlord = val(f, 'landlord'), addressLine = val(f, 'propertyAddress'); title = 'Brev till hyresvÃ¤rden'; emailSubject = 'UppsÃ¤gning av hyreskontrakt â€” dÃ¶dsfall';
      text = `${head}\n\nTill: ${landlord || 'HyresvÃ¤rden'}\nÃ„rende: UppsÃ¤gning av hyreskontrakt â€” dÃ¶dsfall${addressLine ? `\nAvser: ${addressLine}` : ''}\n\nHej,\n\nJag skriver angÃ¥ende hyresavtalet fÃ¶r ${deceased} (personnr ${personnr}), som har gÃ¥tt bort.\n\nJag Ã¤r ${relation} och fÃ¶retrÃ¤der dÃ¶dsboet. Jag sÃ¤ger hÃ¤rmed upp hyresavtalet med en mÃ¥nads uppsÃ¤gningstid frÃ¥n detta brev, i enlighet med 12 kap. 31 Â§ jordabalken.\n\nVar vÃ¤nlig bekrÃ¤fta uppsÃ¤gningen och meddela datum och tid fÃ¶r besiktning och nyckelÃ¶verlÃ¤mnande. DÃ¶dsbevis bifogas.\n\n${footer}`;
      phoneScript = { text: `Hej, jag heter ${sender}. Jag Ã¤r ${relation} till ${deceased}, som har gÃ¥tt bort, och jag ringer angÃ¥ende hens hyreslÃ¤genhet.\n\nJag vill sÃ¤ga upp lÃ¤genheten. Kan ni bekrÃ¤fta uppsÃ¤gningstiden och nÃ¤r ni vill ha nycklarna tillbaka?\n\nJag kan mejla dÃ¶dsbevis och en skriftlig uppsÃ¤gning â€” vad behÃ¶ver ni av mig?`, checklist: ['Den avlidnes personnummer', 'LÃ¤genhetens adress', 'Din relation till den avlidne', 'DÃ¶dsbevis (begÃ¤rs av hyresvÃ¤rden)'] }; break;
    }
    case 'pension': {
      const child = val(f, 'type') === 'barnpension'; const subject = child ? 'AnsÃ¶kan om barnpension och efterlevandestÃ¶d' : 'AnsÃ¶kan om omstÃ¤llningspension'; title = `Pensionsmyndigheten â€” ${subject}`; emailSubject = subject;
      const body = child ? `Jag kontaktar er med anledning av att ${deceased} (personnr ${personnr}), fÃ¶rÃ¤lder till barn under 20 Ã¥r, har gÃ¥tt bort.\n\nJag ber er informera om rÃ¤tten till barnpension och eventuellt efterlevandestÃ¶d fÃ¶r barnet/barnen, samt hur ansÃ¶kan gÃ¶rs.` : `Jag kontaktar er fÃ¶r att ansÃ¶ka om omstÃ¤llningspension med anledning av att min ${relation}, ${deceased} (personnr ${personnr}), har gÃ¥tt bort.\n\nJag uppfyller villkoren fÃ¶r omstÃ¤llningspension (gemensamt hushÃ¥ll, ej Ã¥lderspension). Jag ber er bekrÃ¤fta att ansÃ¶kan tagits emot och informera om nÃ¤sta steg.\n\nOmstÃ¤llningspension betalas inte ut retroaktivt â€” jag ansÃ¶ker dÃ¤rfÃ¶r snarast.`;
      text = `${head}\n\nTill: Pensionsmyndigheten\nÃ„rende: ${subject}\n\nHej,\n\n${body}\n\nDÃ¶dsbevis bifogas. Kontakta mig fÃ¶r ytterligare dokumentation.\n\n${footer}`;
      phoneScript = { text: `Hej, jag heter ${sender}. Jag Ã¤r ${relation} till ${deceased}, som har gÃ¥tt bort. Jag ringer fÃ¶r att ${child ? 'frÃ¥ga om barnpension fÃ¶r ett barn under 20 Ã¥r' : 'ansÃ¶ka om omstÃ¤llningspension'}.\n\nKan ni bekrÃ¤fta vad som gÃ¤ller och vad jag behÃ¶ver skicka in?${child ? '' : '\n\nObservera att omstÃ¤llningspension inte betalas ut retroaktivt â€” det Ã¤r viktigt att ansÃ¶ka snabbt.'}`, checklist: ['Den avlidnes personnummer', 'Ditt eget personnummer', 'Din relation till den avlidne'] }; break;
    }
    case 'skatteverket': {
      const kind = val(f, 'case'); const subjects = { intyg: 'BegÃ¤ran om dÃ¶dsfallsintyg och personbevis fÃ¶r dÃ¶dsbo', fskatt: 'BegÃ¤ran om avslut av F-skatt â€” dÃ¶dsfall', slutskatt: 'BegÃ¤ran om information om slutlig skatt â€” dÃ¶dsfall' }; emailSubject = subjects[kind] || subjects.intyg; title = `Skatteverket â€” ${emailSubject}`;
      const bodies = { intyg: `Jag kontaktar er fÃ¶r att begÃ¤ra dÃ¶dsfallsintyg och personbevis avseende dÃ¶dsboet efter ${deceased} (personnr ${personnr}), som gick bort nyligen.\n\nDokumenten behÃ¶vs fÃ¶r dÃ¶dsboets rÃ¤kning i samband med bouppteckning och kontakt med banker och myndigheter.\n\nJag Ã¤r ${relation} och dÃ¶dsbodelÃ¤gare. VÃ¤nligen skicka handlingarna till angiven e-postadress, eller meddela hur ansÃ¶kan gÃ¶rs via er e-tjÃ¤nst.`, fskatt: `Jag kontaktar er med anledning av att ${deceased} (personnr ${personnr}) har gÃ¥tt bort och att den av hen bedrivna enskilda nÃ¤ringsverksamheten dÃ¤rmed ska avslutas.\n\nJag ber er avregistrera F-skatten och eventuell mervÃ¤rdesskatt (moms) med dÃ¶dsdatum som slutdatum.\n\nJag Ã¤r ${relation} och fÃ¶retrÃ¤der dÃ¶dsboet. DÃ¶dsbevis bifogas. Kontakta mig fÃ¶r ytterligare dokumentation.`, slutskatt: `Jag kontaktar er angÃ¥ende slutlig skatt fÃ¶r ${deceased} (personnr ${personnr}), som har gÃ¥tt bort.\n\nJag ber er bekrÃ¤fta om det finns kvarstÃ¥ende skattefordringar eller skatteÃ¥terbÃ¤ring att reglera, samt hur dÃ¶dsboet ska gÃ¥ till vÃ¤ga.\n\nJag Ã¤r ${relation} och dÃ¶dsbodelÃ¤gare. VÃ¤nligen kontakta mig pÃ¥ angiven e-postadress.` };
      text = `${head}\n\nTill: Skatteverket\nÃ„rende: ${emailSubject}\n\nHej,\n\n${bodies[kind] || bodies.intyg}\n\n${footer}`; break;
    }
    case 'fullmakt': {
      const grantor1 = val(f, 'grantor1'), grantor2 = val(f, 'grantor2'), agent = val(f, 'agent'), agentRelation = val(f, 'agentRelation');
      title = 'Fullmakt â€” dÃ¶dsbo'; text = `FULLMAKT\nUtfÃ¤rdad: ${today}\n\nVi, undertecknade dÃ¶dsbodelÃ¤gare efter ${deceased} (personnr ${personnr}), ger hÃ¤rmed\n\n  ${agent}${agentRelation ? ` (${agentRelation})` : ''}\n\nfullmakt att fÃ¶r dÃ¶dsboets rÃ¤kning:\n\nâ€¢ Kontakta och fÃ¶retrÃ¤da dÃ¶dsboet gentemot banker och finansinstitut\nâ€¢ BegÃ¤ra kontoinformation och genomfÃ¶ra betalningar ur dÃ¶dsboets medel\nâ€¢ Teckna dÃ¶dsboets namn i lÃ¶pande Ã¤renden\nâ€¢ Kontakta myndigheter (Skatteverket, Kronofogden m.fl.) Ã¥ dÃ¶dsboets vÃ¤gnar\nâ€¢ SÃ¤ga upp avtal och abonnemang tillhÃ¶rande ${deceased}\n\nFullmakten gÃ¤ller tills dÃ¶dsboet Ã¤r avslutat och ska uppvisas i original vid bankbesÃ¶k.\n\n\n______________________________    ______________________________\n${grantor2 ? `${grantor1} och ${grantor2}` : grantor1}\nDÃ¶dsbodelÃ¤gare                    Datum och ort`; break;
    }
    case 'annons': {
      const name = val(f, 'name'), born = val(f, 'born'), died = val(f, 'died'), survivors = val(f, 'survivors'), memory = val(f, 'memory'), funeral = val(f, 'funeral'), other = val(f, 'other');
      const life = born && died ? `${born} â€“ ${died}` : died ? `Avled ${died}` : '';
      title = `DÃ¶dsannons â€” ${name}`; text = `${name}\n${life}${memory ? `\n\n${memory}\n` : ''}${survivors ? `\nEfterlÃ¤mnas av ${survivors}.` : ''}\n\n${funeral ? `Begravning: ${funeral}.` : 'Begravning meddelas i god tid.'}\n\nSÃ¶rjd och saknad.${other ? `\n\n${other}` : ''}`.trim(); break;
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

