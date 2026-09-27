// T228 — Avregistrering från deadline-påminnelser. GET ?token=<uuid>
import { getSupabaseAdmin } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send(page('Fel metod', 'Använd länken från e-postmeddelandet.'));
  }

  const token = typeof req.query?.token === 'string' ? req.query.token.trim() : '';
  if (!token || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    return res.status(400).send(page('Ogiltig länk', 'Den här avregistreringslänken är ogiltig eller har gått ut.'));
  }

  try {
    const supa = getSupabaseAdmin();
    const { data, error } = await supa
      .from('reminder_optins')
      .update({ unsubscribed: true })
      .eq('unsubscribe_token', token)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('[unsubscribe-reminder]', error);
      return res.status(500).send(page('Något gick fel', 'Försök igen om en stund.'));
    }
    if (!data) {
      // Token existerar inte eller raden redan avregistrerad — behandla som lyckad
      return res.status(200).send(page('Redan avregistrerad', 'Du får inga fler påminnelser från Efterplan.'));
    }

    return res.status(200).send(page(
      'Avregistrerad',
      'Du kommer inte längre att få påminnelser om deadlines från Efterplan.'
    ));
  } catch (err) {
    console.error('[unsubscribe-reminder]', err);
    return res.status(500).send(page('Något gick fel', 'Försök igen om en stund.'));
  }
}

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} – Efterplan</title>
<style>
  *{box-sizing:border-box}
  body{font-family:system-ui,sans-serif;max-width:38rem;margin:4rem auto;padding:1.5rem;color:#2d2d2b;line-height:1.6}
  h1{font-size:1.4rem;margin-bottom:.75rem}
  a{color:#5a7a6a}
</style>
</head>
<body>
<h1>${title}</h1>
<p>${body}</p>
<p><a href="https://efterplan.se">Gå till Efterplan</a></p>
</body>
</html>`;
}
