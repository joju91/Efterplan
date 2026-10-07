// T145 â€” Dokumentcentral: AI-kategorisering.
// FÃ¶reslÃ¥r kategori + kort filnamn Ã¥t anvÃ¤ndaren utifrÃ¥n ett foto av ett dokument.
// KrÃ¤ver ANTHROPIC_API_KEY i Vercel env. Saknas den, eller misslyckas anropet,
// svarar vi med ett fel â€” klienten (app.js, categorizeDocumentClientSide) faller
// dÃ¥ tillbaka till manuell kategorisering. AI Ã¤r en assist, aldrig en spÃ¤rr
// (readme.md: "No AI in the core flow").
//
// T162 â€” endpointen Ã¤r Ã¶ppen utan inloggning och drar riktiga Anthropic-tokens
// frÃ¥n Owners delade server-side-nyckel per anrop. Dagligt tak per IP sÃ¥
// spam/missbruk inte kan dra obegrÃ¤nsad kostnad.

import { getClientIp, checkRateLimit } from './_lib.js';

const CATEGORIES = [
  'Skatteverket', 'FÃ¶rsÃ¤kringskassan', 'Bank', 'FÃ¶rsÃ¤kringsbolag',
  'HyresvÃ¤rd/Bostad', 'Pensionsmyndigheten', 'Kronofogden', 'Ã–vrigt',
];

// GenerÃ¶st fÃ¶r en enskild dÃ¶dsbo-genomgÃ¥ng (kan lÃ¤tt bli 10-15 dokument),
// men stoppar automatiserad spam/missbruk av den delade AI-nyckeln.
const DAILY_LIMIT_PER_IP = 30;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ ok: false, error: 'ai_not_configured' });
  }

  const ip = getClientIp(req);
  const { limited, unavailable } = await checkRateLimit('categorize-document', ip, DAILY_LIMIT_PER_IP, { failClosed: true });
  if (unavailable) {
    return res.status(503).json({ ok: false, error: 'rate_limit_unavailable' });
  }
  if (limited) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const image = typeof body.image === 'string' ? body.image : '';
  const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    return res.status(400).json({ ok: false, error: 'missing_or_invalid_image' });
  }
  const [, mediaType, base64Data] = match;
  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(mediaType)) {
    return res.status(415).json({ ok: false, error: 'unsupported_image_type' });
  }
  if (base64Data.length > 7_000_000) return res.status(413).json({ ok: false, error: 'image_too_large' });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            {
              type: 'text',
              text:
                'Det hÃ¤r Ã¤r ett foto av ett dokument som hÃ¶r till ett dÃ¶dsbo (en avliden persons kvarlÃ¤mnade papper). ' +
                'Svara ENDAST med kompakt JSON, inget annat text: {"category": "...", "name": "..."}. ' +
                `"category" mÃ¥ste vara exakt ett av: ${CATEGORIES.join(', ')}. ` +
                '"name" ska vara ett kort, konkret namn pÃ¥ svenska (max 6 ord), t.ex. "DÃ¶dsfallsintyg Skatteverket" eller "Slutfaktura Telia". ' +
                'Ã„r du osÃ¤ker, vÃ¤lj "Ã–vrigt" och ett neutralt namn â€” gissa aldrig personuppgifter du inte kan lÃ¤sa tydligt.',
            },
          ],
        }],
      }),
    });

    if (!r.ok) {
      console.error('[categorize-document] Anthropic error', r.status, await r.text().catch(() => ''));
      return res.status(502).json({ ok: false, error: 'ai_request_failed' });
    }

    const data = await r.json();
    const text = (data?.content || []).find(b => b.type === 'text')?.text || '';
    let parsed = null;
    try { parsed = JSON.parse(text.trim()); } catch (e) { /* fall through */ }

    if (!parsed || typeof parsed.category !== 'string' || typeof parsed.name !== 'string') {
      return res.status(502).json({ ok: false, error: 'ai_bad_response' });
    }

    const category = CATEGORIES.includes(parsed.category) ? parsed.category : 'Ã–vrigt';
    const name = parsed.name.trim().slice(0, 80) || 'Dokument';

    return res.status(200).json({ ok: true, category, name });
  } catch (err) {
    console.error('[categorize-document]', err);
    return res.status(500).json({ ok: false, error: 'categorize_failed' });
  }
}

