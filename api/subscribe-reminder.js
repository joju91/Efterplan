// Email reminders are not available yet. Keep the endpoint closed until the
// sending and unsubscribe flow is ready, so consent is not collected falsely.
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  return res.status(410).json({ error: 'reminders_unavailable' });
}
