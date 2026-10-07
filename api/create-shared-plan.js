import { getClientIp, getSupabaseAdmin } from './_lib.js';

const MAX_CIPHERTEXT_LENGTH = 200_000;
const MAX_BODY_BYTES = 205_000;

function decodeBase64Url(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const decoded = Buffer.from(value, 'base64url');
    return decoded.length ? decoded : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) return res.status(413).json({ error: 'body_too_large' });

  let body = req.body;
  if (typeof body === 'string') {
    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
      return res.status(413).json({ error: 'body_too_large' });
    }
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'invalid_json' }); }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'invalid_body' });
  }
  if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) {
    return res.status(413).json({ error: 'body_too_large' });
  }

  const { ciphertext, iv } = body;
  const decodedCiphertext = decodeBase64Url(ciphertext);
  const decodedIv = decodeBase64Url(iv);
  if (!decodedCiphertext || ciphertext.length > MAX_CIPHERTEXT_LENGTH) {
    return res.status(400).json({ error: 'invalid_ciphertext' });
  }
  if (!decodedIv || decodedIv.length !== 12 || iv.length > 64) {
    return res.status(400).json({ error: 'invalid_iv' });
  }

  const ip = getClientIp(req);
  if (!ip || ip === 'unknown' || ip.length > 64) {
    return res.status(400).json({ error: 'invalid_client_ip' });
  }

  try {
    const supa = getSupabaseAdmin();
    const day = new Date().toISOString().slice(0, 10);
    const key = `create-shared-plan:${ip}:${day}`;
    const { data: count, error: limitError } = await supa.rpc('rate_limit_increment', { key_in: key });
    // Fail closed when rate limiting cannot be applied.
    if (limitError || typeof count !== 'number') {
      console.error('[create-shared-plan] rate limit failed', limitError);
      return res.status(503).json({ error: 'temporarily_unavailable' });
    }
    if (count > 10) return res.status(429).json({ error: 'rate_limited' });

    const { data: id, error } = await supa.rpc('create_shared_plan', {
      ciphertext_in: ciphertext,
      iv_in: iv,
    });
    if (error) {
      console.error('[create-shared-plan]', error);
      return res.status(500).json({ error: 'share_creation_failed' });
    }
    return res.status(200).json({ ok: true, id });
  } catch (error) {
    console.error('[create-shared-plan]', error);
    return res.status(500).json({ error: 'share_creation_failed' });
  }
}
