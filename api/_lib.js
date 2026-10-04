import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY missing');
  return new Stripe(key, { apiVersion: '2024-11-20.acacia' });
}

// SUPABASE_URL i Vercel har legat som ".../rest/v1", vilket gav
// ".../rest/v1/rest/v1/..." (404/PGRST125). Klipp bort sökvägen så bara
// projektets bas-URL används.
function supabaseBaseUrl() {
  const url = (process.env.SUPABASE_URL || '').trim();
  return url.replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
}

function supabaseServerKey() {
  // Stöder både nya sb_secret_* och äldre service_role JWT.
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function getSupabaseAdmin() {
  const url = supabaseBaseUrl();
  const key = supabaseServerKey();
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SECRET_KEY missing');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// Rå REST-anrop med servernyckeln (för ads-API:erna, som kör fetch direkt).
export function supabaseRest(path) {
  return `${supabaseBaseUrl()}/rest/v1/${path}`;
}

export function supabaseServerHeaders(extra = {}) {
  const key = supabaseServerKey();
  if (!key) throw new Error('SUPABASE_SECRET_KEY missing');
  const headers = { apikey: key, 'Content-Type': 'application/json', ...extra };
  // Legacy service_role är en JWT och vill ha Bearer; sb_secret_* räcker i apikey.
  if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
  return headers;
}

export async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export function originFromReq(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

export function normalizeEmail(e) {
  return (e || '').trim().toLowerCase();
}

// T162: klientens IP för rate-limiting. Vercel sätter x-forwarded-for;
// första adressen i listan är den faktiska klienten (resten är proxy-hopp).
export function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

// T162: enkelt per-nyckel dagligt tak, backat av Supabase (samma projekt/secret
// som redan finns, se T163) istället för att kräva en ny Upstash/KV-integration.
// Fail-open: om rate-limit-kontrollen själv failar (nätverk, Supabase pausat)
// släpper vi igenom anropet — en trög/nere rate-limiter ska inte slå ut hela
// funktionen för alla användare.
export async function checkRateLimit(bucket, ip, limit) {
  try {
    const supa = getSupabaseAdmin();
    const today = new Date().toISOString().slice(0, 10);
    const key = `${bucket}:${ip}:${today}`;
    const { data, error } = await supa.rpc('rate_limit_increment', { key_in: key });
    if (error) {
      console.error('[rate-limit]', bucket, error);
      return { limited: false };
    }
    return { limited: typeof data === 'number' && data > limit, count: data };
  } catch (err) {
    console.error('[rate-limit]', bucket, err);
    return { limited: false };
  }
}
