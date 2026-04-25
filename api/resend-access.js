const Stripe = require('stripe');
const { Resend } = require('resend');

const DIGITAL_EDITIONS = ['audiobook', 'ebook', 'bundle'];
const DIGITAL_LABELS = { audiobook: 'Audiobook', ebook: 'eBook', bundle: 'Read-Along Bundle' };
const DIGITAL_PATHS = { audiobook: '/audiobook', ebook: '/ebook', bundle: '/read-along' };
const DIGITAL_ICONS = { audiobook: '🎧', ebook: '📖', bundle: '🎧📖' };

// Simple in-memory rate limit: one send per email per 5 minutes
const recentSends = new Map();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const normalized = email.trim().toLowerCase();

  // Rate limit
  const lastSent = recentSends.get(normalized);
  if (lastSent && Date.now() - lastSent < 5 * 60 * 1000) {
    return res.status(200).json({ ok: true }); // silent — don't reveal rate limiting
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const siteUrl = process.env.SITE_URL || 'https://www.joeprofitneverbroken.com';

  let paidSessions;
  try {
    const result = await stripe.checkout.sessions.search({
      query: `customer_email:"${normalized}"`,
      limit: 20,
    });
    paidSessions = result.data.filter(
      s => s.payment_status === 'paid' && DIGITAL_EDITIONS.includes(s.metadata?.edition)
    );
  } catch (err) {
    console.error('Stripe search error:', err.message);
    return res.status(500).json({ error: 'Lookup failed' });
  }

  // Always return ok — don't reveal whether email was found
  if (paidSessions.length === 0) {
    return res.status(200).json({ ok: true });
  }

  recentSends.set(normalized, Date.now());

  const firstName = paidSessions[0].customer_details?.name?.split(' ')[0] || 'Friend';
  const resend = new Resend(process.env.RESEND_API_KEY);

  const linkRows = paidSessions.map(s => {
    const edition = s.metadata.edition;
    const url = `${siteUrl}${DIGITAL_PATHS[edition]}?session_id=${s.id}`;
    return `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
      <tr><td align="center">
        <a href="${url}" style="display:inline-block;background:#d4a95a;color:#1a1a2e;font-size:24px;font-weight:bold;text-decoration:none;padding:22px 48px;border-radius:10px;">
          ${DIGITAL_ICONS[edition]}&nbsp; Open Your ${DIGITAL_LABELS[edition]}
        </a>
      </td></tr>
      </table>`;
  }).join('');

  const linkText = paidSessions.map(s => {
    const edition = s.metadata.edition;
    return `${DIGITAL_LABELS[edition]}: ${siteUrl}${DIGITAL_PATHS[edition]}?session_id=${s.id}`;
  }).join('\n');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:12px;overflow:hidden;">

  <tr><td style="background:#1a1a2e;padding:35px 40px;text-align:center;">
    <h1 style="color:#d4a95a;margin:0;font-size:32px;font-weight:normal;letter-spacing:1px;">Never Broken</h1>
    <p style="color:#d4a95a;margin:4px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.8;">An Unrelenting Pursuit for Success</p>
    <p style="color:#ccc;margin:10px 0 0;font-size:16px;">by Dr. Joe Profit</p>
  </td></tr>

  <tr><td style="padding:40px;">
    <p style="font-size:26px;color:#1a1a2e;margin:0 0 20px;line-height:1.4;">Hey ${firstName},</p>
    <p style="font-size:22px;color:#333;margin:0 0 35px;line-height:1.6;">
      Here's your access link. Tap the button below to open your book right now.
    </p>

    ${linkRows}

    <hr style="border:none;border-top:2px solid #e5e0da;margin:35px 0;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8ee;border:3px solid #d4a95a;border-radius:10px;">
    <tr><td style="padding:28px;">
      <p style="font-size:22px;color:#1a1a2e;margin:0 0 12px;font-weight:bold;">⭐ Save this email!</p>
      <p style="font-size:19px;color:#444;margin:0;line-height:1.7;">
        This is your permanent link. It works on any phone, tablet, or computer - any time you need it.
      </p>
    </td></tr>
    </table>

    <hr style="border:none;border-top:2px solid #e5e0da;margin:35px 0;">

    <p style="font-size:19px;color:#444;margin:0 0 16px;line-height:1.7;">
      <strong>"Do I need to download anything?"</strong><br>
      Nope. It opens right in your browser. Nothing to install.
    </p>
    <p style="font-size:19px;color:#444;margin:0;line-height:1.7;">
      <strong>Still having trouble?</strong><br>
      Just reply to this email and we will take care of you.
    </p>
  </td></tr>

  <tr><td style="background:#f5f0eb;padding:28px 40px;text-align:center;">
    <p style="font-size:16px;color:#888;margin:0;line-height:1.6;">
      100% of proceeds support the YUP Foundation.<br>
      Thank you for being part of something bigger.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    `Hey ${firstName},`,
    ``,
    `Here are your access links:`,
    ``,
    linkText,
    ``,
    `---`,
    `Save this email - it works any time on any device.`,
    ``,
    `Still having trouble? Just reply and we will help you out.`,
    ``,
    `100% of proceeds support the YUP Foundation.`,
  ].join('\n');

  try {
    await resend.emails.send({
      from: 'Joe Profit <neverbroken@joeprofitneverbroken.com>',
      to: [email.trim()],
      replyTo: 'jprofit23@gmail.com',
      subject: 'Your Never Broken access link',
      html,
      text,
    });
    console.log(`Access resent to ${normalized}`);
  } catch (err) {
    console.error('Resend error:', err.message);
    return res.status(500).json({ error: 'Email failed' });
  }

  return res.status(200).json({ ok: true });
};
