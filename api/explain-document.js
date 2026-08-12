// Explain-document — Dokumentcentral: AI-förklaring.
// Ger en kort, varm förklaring på svenska av vad ett skannat dokument
// (myndighet/bank/försäkring) betyder och vad mottagaren behöver göra.
// Kräver ANTHROPIC_API_KEY i Vercel env. Saknas den, eller misslyckas anropet,
// visar klienten (app.js, explainDocumentAI) bara ett kort statusmeddelande —
// dokumentet förblir fullt användbart. AI är en assist, aldrig en spärr
// (readme.md: "No AI in the core flow"), samma mönster som categorize-document.js.

import { getClientIp, checkRateLimit } from './_lib.js';

// Striktare än categorize-document (30/dag): samma delade AI-nyckel, men
// dyrare per anrop (längre svar, max_tokens 500 mot 200) och klienten cachar
// svaret i state.documents[].explanation efter första lyckade anropet, så
// samma dokument ska aldrig behöva förklaras om och om igen.
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
  const { limited } = await checkRateLimit('explain-document', ip, DAILY_LIMIT_PER_IP);
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
                'Det här är ett foto av ett dokument som hör till ett dödsbo (en avliden persons kvarlämnade papper). ' +
                'Personen som läser din förklaring är troligen en anhörig mitt i sorgearbetet, inte van vid myndighets- eller bankspråk. ' +
                'Svara ENDAST med kompakt JSON, inget annat text: {"explanation": "..."}. ' +
                '"explanation" ska vara en kort förklaring på enkel, varm svenska (3–5 meningar, ingen rubrik, inga punktlistor) ' +
                'av vad dokumentet är och vad mottagaren konkret behöver göra med det (t.ex. betala, svara, arkivera, eller inget alls). ' +
                'Nämn tydligt om det finns en deadline eller ett belopp. Undvik juridiska/byråkratiska termer utan att förklara dem enkelt. ' +
                'Är du osäker på vad dokumentet är eller vad som krävs, säg det ärligt istället för att gissa — ' +
                'gissa aldrig personuppgifter du inte kan läsa tydligt.',
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
