// T136/T228 — Skickar deadline-påminnelser via Resend.
// Körs dagligen från GitHub Actions (.github/workflows/send-reminders.yml).
// Kräver: SUPABASE_URL, SUPABASE_SECRET_KEY, RESEND_API_KEY i miljön.

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_KEY   = process.env.RESEND_API_KEY;
// RESEND_FROM sätts som GitHub-secret. Defaultar till onboarding@resend.dev vid lokal testning.
const FROM         = process.env.RESEND_FROM || 'Efterplan <onboarding@resend.dev>';
const BASE_URL     = 'https://efterplan.se';

if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('SUPABASE_URL / SUPABASE_SECRET_KEY saknas'); process.exit(1); }
if (!RESEND_KEY)                    { console.error('RESEND_API_KEY saknas');                      process.exit(1); }

const supa = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

// ── Deadline-beräkning ────────────────────────────────────────────────────────

function addMonths(date, n) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function diffDays(a, b) {
  // Antal hela dygn från a till b (positivt om b är framtiden)
  return Math.round((b - a) / 86_400_000);
}

function deadlines(deathDate) {
  const d = new Date(deathDate);
  return {
    bouppteckning: addMonths(d, 3),
    inlamning:     addMonths(d, 4),
    dodsboanmalan: addDays(d, 60),
  };
}

// ── E-postinnehåll ────────────────────────────────────────────────────────────

const LABELS = {
  bouppteckning: 'bouppteckning',
  inlamning:     'inlämning av bouppteckning till Skatteverket',
  dodsboanmalan: 'dödsboanmälan',
};

const DESCRIPTIONS = {
  bouppteckning: 'En bouppteckning ska upprättas senast tre månader efter dödsfallet. Den förtecknar tillgångar och skulder i dödsboet.',
  inlamning:     'Bouppteckningen ska lämnas in till Skatteverket senast fyra månader efter dödsfallet.',
  dodsboanmalan: 'Om dödsboet är litet kan en dödsboanmälan ersätta bouppteckningen. Den ska lämnas in senast 60 dagar efter dödsfallet.',
};

function formatDate(d) {
  return d.toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' });
}

function emailHtml({ type, deadlineDate, daysLeft, unsubscribeUrl }) {
  const label = LABELS[type];
  const desc  = DESCRIPTIONS[type];
  const date  = formatDate(deadlineDate);
  const urgent = daysLeft <= 3;

  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Påminnelse: ${label} – Efterplan</title>
</head>
<body style="margin:0;padding:0;background:#f5f2ee;font-family:system-ui,sans-serif;color:#2d2d2b">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ee;padding:40px 16px">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf9;border-radius:6px;overflow:hidden">
      <tr>
        <td style="background:#3d5a4a;padding:24px 32px">
          <span style="font-size:1.1rem;font-weight:600;color:#f5f2ee;letter-spacing:.02em">Efterplan</span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 32px 16px">
          <p style="margin:0 0 8px;font-size:.85rem;color:#7a7060;text-transform:uppercase;letter-spacing:.06em">Påminnelse</p>
          <h1 style="margin:0 0 20px;font-size:1.4rem;line-height:1.3;color:#1e1e1c">
            ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dagar'} kvar till ${label}
          </h1>
          <p style="margin:0 0 16px;font-size:1rem;line-height:1.6;color:#3a3830">
            ${desc}
          </p>
          <p style="margin:0 0 24px;font-size:1rem;line-height:1.6;color:#3a3830">
            <strong>Deadline: ${date}</strong>${urgent ? ' — det är snart dags att agera.' : '.'}
          </p>
          <a href="${BASE_URL}" style="display:inline-block;background:#5a7a6a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:4px;font-size:.95rem;font-weight:500">
            Öppna min plan på Efterplan
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px;border-top:1px solid #e8e4dc">
          <p style="margin:0;font-size:.8rem;color:#a09880;line-height:1.6">
            Du får det här mejlet för att du bett om påminnelser på efterplan.se.<br>
            <a href="${unsubscribeUrl}" style="color:#a09880">Avregistrera mig</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function emailText({ type, deadlineDate, daysLeft, unsubscribeUrl }) {
  return `Påminnelse från Efterplan

${daysLeft} ${daysLeft === 1 ? 'dag' : 'dagar'} kvar till ${LABELS[type]}.

${DESCRIPTIONS[type]}

Deadline: ${formatDate(deadlineDate)}

Öppna din plan: ${BASE_URL}

---
Du får det här mejlet för att du bett om påminnelser på efterplan.se.
Avregistrera mig: ${unsubscribeUrl}
`;
}

// ── Resend ────────────────────────────────────────────────────────────────────

async function sendEmail({ to, subject, html, text }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to, subject, html, text }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend ${res.status}: ${body}`);
  }
  return res.json();
}

// ── Huvudloop ─────────────────────────────────────────────────────────────────

const TRIGGERS = [14, 3]; // dagar före deadline

async function run() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const { data: rows, error } = await supa
    .from('reminder_optins')
    .select('id, email, death_date, optin_types, reminders_sent, unsubscribe_token')
    .eq('unsubscribed', false)
    .not('death_date', 'is', null);

  if (error) { console.error('Supabase-fel:', error); process.exit(1); }
  console.log(`Hittade ${rows.length} aktiva prenumeranter.`);

  let sent = 0;
  let skipped = 0;

  for (const row of rows) {
    const dl = deadlines(row.death_date);
    const unsubscribeUrl = `${BASE_URL}/api/unsubscribe-reminder?token=${row.unsubscribe_token}`;
    const alreadySent = new Set(row.reminders_sent || []);
    const newKeys = [];

    for (const type of (row.optin_types || [])) {
      const deadlineDate = dl[type];
      if (!deadlineDate) continue;

      for (const trigger of TRIGGERS) {
        const key = `${type}_${trigger}d`;
        if (alreadySent.has(key)) { skipped++; continue; }

        const daysLeft = diffDays(today, deadlineDate);
        if (daysLeft !== trigger) continue;

        const subject = `Påminnelse: ${trigger} dagar kvar till ${LABELS[type]}`;
        try {
          await sendEmail({
            to: row.email,
            subject,
            html: emailHtml({ type, deadlineDate, daysLeft, unsubscribeUrl }),
            text: emailText({ type, deadlineDate, daysLeft, unsubscribeUrl }),
          });
          newKeys.push(key);
          sent++;
          console.log(`  ✓ ${row.email} — ${key}`);
        } catch (err) {
          console.error(`  ✗ ${row.email} — ${key}:`, err.message);
        }
      }
    }

    if (newKeys.length > 0) {
      const updated = [...alreadySent, ...newKeys];
      const { error: upErr } = await supa
        .from('reminder_optins')
        .update({ reminders_sent: updated })
        .eq('id', row.id);
      if (upErr) console.error(`  Kunde inte uppdatera reminders_sent för ${row.id}:`, upErr);
    }
  }

  console.log(`Klart. Skickade: ${sent}, hoppade över (redan skickade): ${skipped}.`);
}

run().catch(err => { console.error(err); process.exit(1); });
