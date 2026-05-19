const Stripe = require('stripe');
const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key, email, name } = req.body;
  if (!key || key.trim() !== (process.env.ADMIN_SECRET || '').trim()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY?.trim());

  // Find the Complimentary coupon
  let coupon;
  try {
    const coupons = await stripe.coupons.list({ limit: 100 });
    coupon = coupons.data.find(c => c.name === 'Complimentary' && c.valid);
  } catch (err) {
    return res.status(500).json({ error: `Stripe error: ${err.message}` });
  }
  if (!coupon) return res.status(404).json({ error: 'Complimentary coupon not found in Stripe' });

  // Generate single-use promo code
  let code;
  try {
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const promo = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: `COMP-${suffix}`,
      max_redemptions: 1,
      metadata: { recipient_name: name.trim(), recipient_email: email.trim() },
    });
    code = promo.code;
  } catch (err) {
    return res.status(500).json({ error: `Could not create code: ${err.message}` });
  }

  const firstName = name.trim().split(' ')[0];
  const siteUrl = process.env.SITE_URL || 'https://www.joeprofitneverbroken.com';

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
    <p style="font-size:26px; color:#1a1a2e; margin:0 0 25px; line-height:1.4;">Hey ${firstName},</p>

    <p style="font-size:22px; color:#333; margin:0 0 20px; line-height:1.6;">
      I wanted to personally reach out and say thank you. It means the world to me that you're on this journey.
    </p>

    <p style="font-size:22px; color:#333; margin:0 0 35px; line-height:1.6;">
      I'd love for you to have the full <strong>Never Broken Read-Along Bundle</strong> — the audiobook and eBook together — completely on me.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8ee; border:3px solid #d4a95a; border-radius:12px; margin:0 0 35px;">
    <tr><td style="padding:30px; text-align:center;">
      <p style="font-size:16px; color:#888; margin:0 0 12px; text-transform:uppercase; letter-spacing:2px;">Your complimentary code</p>
      <p style="font-size:36px; font-weight:bold; color:#1a1a2e; margin:0 0 20px; letter-spacing:0.12em; font-family:'Courier New', monospace;">${code}</p>
      <a href="${siteUrl}/shop" style="display:inline-block; background:#d4a95a; color:#1a1a2e; font-size:20px; font-weight:bold; text-decoration:none; padding:18px 40px; border-radius:10px;">
        Redeem Your Bundle
      </a>
    </td></tr>
    </table>

    <p style="font-size:19px; color:#555; margin:0 0 16px; line-height:1.7;">
      Just head to the shop, add the Read-Along Bundle to checkout, and enter the code above. It covers the full amount — no card needed.
    </p>

    <p style="font-size:19px; color:#555; margin:0; line-height:1.7;">
      If you have any trouble at all, just reply to this email and I'll take care of you personally.
    </p>

    <p style="font-size:22px; color:#1a1a2e; margin:30px 0 0; line-height:1.6;">
      Stay unbroken,<br>
      <strong>Joe Profit</strong>
    </p>
  </td></tr>

  <tr><td style="background:#f5f0eb; padding:30px 40px; text-align:center;">
    <p style="font-size:15px; color:#888; margin:0; line-height:1.6;">
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
      subject: `A gift from Joe Profit - your Never Broken bundle`,
      html,
    });
  } catch (err) {
    return res.status(500).json({ error: `Email failed: ${err.message}` });
  }

  return res.status(200).json({ ok: true, code });
};
