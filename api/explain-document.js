// Explain-document â€” Dokumentcentral: AI-fÃ¶rklaring.
// Ger en kort, varm fÃ¶rklaring pÃ¥ svenska av vad ett skannat dokument
// (myndighet/bank/fÃ¶rsÃ¤kring) betyder och vad mottagaren behÃ¶ver gÃ¶ra.
// KrÃ¤ver ANTHROPIC_API_KEY i Vercel env. Saknas den, eller misslyckas anropet,
// visar klienten (app.js, explainDocumentAI) bara ett kort statusmeddelande â€”
// dokumentet fÃ¶rblir fullt anvÃ¤ndbart. AI Ã¤r en assist, aldrig en spÃ¤rr
// (readme.md: "No AI in the core flow"), samma mÃ¶nster som categorize-document.js.

import { getClientIp, checkRateLimit } from './_lib.js';

// Striktare Ã¤n categorize-document (30/dag): samma delade AI-nyckel, men
// dyrare per anrop (lÃ¤ngre svar, max_tokens 500 mot 200) och klienten cachar
// svaret i state.documents[].explanation efter fÃ¶rsta lyckade anropet, sÃ¥
// samma dokument ska aldrig behÃ¶va fÃ¶rklaras om och om igen.
const DAILY_LIMIT_PER_IP = 20;

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
  const { limited, unavailable } = await checkRateLimit('explain-document', ip, DAILY_LIMIT_PER_IP, { failClosed: true });
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
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            {
              type: 'text',
              text:
                'Det hÃ¤r Ã¤r ett foto av ett dokument som hÃ¶r till ett dÃ¶dsbo (en avliden persons kvarlÃ¤mnade papper). ' +
                'Personen som lÃ¤ser din fÃ¶rklaring Ã¤r troligen en anhÃ¶rig mitt i sorgearbetet, inte van vid myndighets- eller banksprÃ¥k. ' +
                'Svara ENDAST med kompakt JSON, inget annat text: {"explanation": "..."}. ' +
                '"explanation" ska vara en kort fÃ¶rklaring pÃ¥ enkel, varm svenska (3â€“5 meningar, ingen rubrik, inga punktlistor) ' +
                'av vad dokumentet Ã¤r och vad mottagaren konkret behÃ¶ver gÃ¶ra med det (t.ex. betala, svara, arkivera, eller inget alls). ' +
                'NÃ¤mn tydligt om det finns en deadline eller ett belopp. Undvik juridiska/byrÃ¥kratiska termer utan att fÃ¶rklara dem enkelt. ' +
                'Ã„r du osÃ¤ker pÃ¥ vad dokumentet Ã¤r eller vad som krÃ¤vs, sÃ¤g det Ã¤rligt istÃ¤llet fÃ¶r att gissa â€” ' +
                'gissa aldrig personuppgifter du inte kan lÃ¤sa tydligt.',
            },
          ],
        }],
      }),
    });

    if (!r.ok) {
      console.error('[explain-document] Anthropic error', r.status, await r.text().catch(() => ''));
      return res.status(502).json({ ok: false, error: 'ai_request_failed' });
    }

    const data = await r.json();
    const text = (data?.content || []).find(b => b.type === 'text')?.text || '';
    let parsed = null;
    try { parsed = JSON.parse(text.trim()); } catch (e) { /* fall through */ }

    if (!parsed || typeof parsed.explanation !== 'string' || !parsed.explanation.trim()) {
      return res.status(502).json({ ok: false, error: 'ai_bad_response' });
    }

    const explanation = parsed.explanation.trim().slice(0, 1500);
    return res.status(200).json({ ok: true, explanation });
  } catch (err) {
    console.error('[explain-document]', err);
    return res.status(500).json({ ok: false, error: 'explain_failed' });
  }
}

