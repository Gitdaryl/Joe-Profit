const { Resend } = require('resend');

const DIGITAL_LABELS = { audiobook: 'Audiobook', ebook: 'eBook', bundle: 'Read-Along Bundle' };
const DIGITAL_PATHS = { audiobook: '/audiobook', ebook: '/ebook', bundle: '/read-along' };

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key, email, edition } = req.body;
  if (!key || key.trim() !== (process.env.ADMIN_SECRET || '').trim()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!email || !edition || !DIGITAL_LABELS[edition]) {
    return res.status(400).json({ error: 'Missing email or edition' });
  }

  const siteUrl = process.env.SITE_URL || 'https://www.joeprofitneverbroken.com';
  const label = DIGITAL_LABELS[edition];
  const accessUrl = `${siteUrl}${DIGITAL_PATHS[edition]}?session_id=TEST_PREVIEW`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f5f0eb; font-family:Georgia, 'Times New Roman', serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb; padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:12px; overflow:hidden;">

  <tr><td style="background:#1a1a2e; padding:35px 40px; text-align:center;">
    <h1 style="color:#d4a95a; margin:0; font-size:32px; font-weight:normal; letter-spacing:1px;">Never Broken</h1>
    <p style="color:#d4a95a; margin:4px 0 0; font-size:13px; letter-spacing:2px; text-transform:uppercase; opacity:0.8;">An Unrelenting Pursuit for Success</p>
    <p style="color:#cccccc; margin:10px 0 0; font-size:16px;">by Dr. Joe Profit</p>
  </td></tr>

  <tr><td style="padding:40px;">
    <p style="font-size:26px; color:#1a1a2e; margin:0 0 25px; line-height:1.4;">Hey Friend,</p>
    <p style="font-size:22px; color:#333; margin:0 0 20px; line-height:1.6;">Thank you for your purchase!</p>
    <p style="font-size:22px; color:#333; margin:0 0 35px; line-height:1.6;">
      Your <strong>${label}</strong> is ready. Tap the big button below to open it.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 35px;">
    <tr><td align="center">
      <a href="${accessUrl}" style="display:inline-block; background:#d4a95a; color:#1a1a2e; font-size:26px; font-weight:bold; text-decoration:none; padding:24px 50px; border-radius:10px; letter-spacing:0.5px;">
        &#9654;&nbsp; Open Your ${label}
      </a>
    </td></tr>
    </table>

    <hr style="border:none; border-top:2px solid #e5e0da; margin:35px 0;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8ee; border:3px solid #d4a95a; border-radius:10px;">
    <tr><td style="padding:30px;">
      <p style="font-size:24px; color:#1a1a2e; margin:0 0 15px; font-weight:bold;">&#11088; Save this email!</p>
      <p style="font-size:20px; color:#444; margin:0; line-height:1.7;">
        This email is how you get back to your ${label.toLowerCase()}. If you ever switch phones, get a new computer, or just can't find it - open this email and tap the button above. <strong>It will always work.</strong>
      </p>
    </td></tr>
    </table>

    <hr style="border:none; border-top:2px solid #e5e0da; margin:35px 0;">

    <p style="font-size:22px; color:#1a1a2e; margin:0 0 20px; font-weight:bold;">Quick answers:</p>

    <p style="font-size:20px; color:#444; margin:0 0 20px; line-height:1.7;">
      <strong>"Do I need to download anything?"</strong><br>
      Nope. It plays right in your phone's web browser or on your computer. Nothing to install.
    </p>
    <p style="font-size:20px; color:#444; margin:0 0 20px; line-height:1.7;">
      <strong>"Can I use a different phone or computer?"</strong><br>
      Yes! Just open this email on that device and tap the button. It works everywhere.
    </p>
    <p style="font-size:20px; color:#444; margin:0 0 20px; line-height:1.7;">
      <strong>"What if something isn't working?"</strong><br>
      Just reply to this email and tell us what's happening. We'll get you sorted out.
    </p>
  </td></tr>

  <tr><td style="background:#f5f0eb; padding:30px 40px; text-align:center;">
    <p style="font-size:17px; color:#888; margin:0; line-height:1.6;">
      100% of proceeds support the YUP Foundation.<br>
      Thank you for being part of something bigger.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: 'Joe Profit <neverbroken@joeprofitneverbroken.com>',
      to: [email.trim()],
      replyTo: 'jprofit23@gmail.com',
      subject: `[TEST] You're all set - your ${label} is ready`,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Test email failed:', err.message);
    return res.status(500).json({ error: 'Email failed' });
  }
};
