// T145 — Dokumentcentral: AI-kategorisering.
// Föreslår kategori + kort filnamn åt användaren utifrån ett foto av ett dokument.
// Kräver ANTHROPIC_API_KEY i Vercel env. Saknas den, eller misslyckas anropet,
// svarar vi med ett fel — klienten (app.js, categorizeDocumentClientSide) faller
// då tillbaka till manuell kategorisering. AI är en assist, aldrig en spärr
// (readme.md: "No AI in the core flow").

const CATEGORIES = [
  'Skatteverket', 'Försäkringskassan', 'Bank', 'Försäkringsbolag',
  'Hyresvärd/Bostad', 'Pensionsmyndigheten', 'Kronofogden', 'Övrigt',
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ ok: false, error: 'ai_not_configured' });
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
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            {
              type: 'text',
              text:
                'Det här är ett foto av ett dokument som hör till ett dödsbo (en avliden persons kvarlämnade papper). ' +
                'Svara ENDAST med kompakt JSON, inget annat text: {"category": "...", "name": "..."}. ' +
                `"category" måste vara exakt ett av: ${CATEGORIES.join(', ')}. ` +
                '"name" ska vara ett kort, konkret namn på svenska (max 6 ord), t.ex. "Dödsfallsintyg Skatteverket" eller "Slutfaktura Telia". ' +
                'Är du osäker, välj "Övrigt" och ett neutralt namn — gissa aldrig personuppgifter du inte kan läsa tydligt.',
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

    const category = CATEGORIES.includes(parsed.category) ? parsed.category : 'Övrigt';
    const name = parsed.name.trim().slice(0, 80) || 'Dokument';

    return res.status(200).json({ ok: true, category, name });
  } catch (err) {
    console.error('[categorize-document]', err);
    return res.status(500).json({ ok: false, error: 'categorize_failed' });
  }
}
