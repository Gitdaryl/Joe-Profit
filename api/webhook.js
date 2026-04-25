const Stripe = require('stripe');
const { Resend } = require('resend');

// Stripe requires the raw body for signature verification
module.exports.config = { api: { bodyParser: false } };

const PHYSICAL_EDITIONS = ['hardcover', 'paperback'];
const DIGITAL_EDITIONS = ['audiobook', 'ebook', 'bundle'];

const DIGITAL_LABELS = {
  audiobook: 'Audiobook',
  ebook: 'eBook',
  bundle: 'Read-Along Bundle',
};

const DIGITAL_PATHS = {
  audiobook: '/audiobook',
  ebook: '/ebook',
  bundle: '/read-along',
};

const DIGITAL_DESCRIPTIONS = {
  audiobook: 'Listen to Never Broken - all 19 chapters, read by Joe himself.',
  ebook: 'Read Never Broken - the full book, page by page, right on your screen.',
  bundle: 'Listen AND read along - the full audiobook and eBook together.',
};

function buildBuyerEmail(session, edition, siteUrl) {
  const name = session.customer_details?.name?.split(' ')[0] || 'Friend';
  const label = DIGITAL_LABELS[edition];
  const path = DIGITAL_PATHS[edition];
  const desc = DIGITAL_DESCRIPTIONS[edition];
  const accessUrl = `${siteUrl}${path}?session_id=${session.id}`;

  return {
    subject: `You're all set - your ${label} is ready`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f5f0eb; font-family:Georgia, 'Times New Roman', serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb; padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:12px; overflow:hidden;">

  <!-- Header -->
  <tr><td style="background:#1a1a2e; padding:35px 40px; text-align:center;">
    <h1 style="color:#d4a95a; margin:0; font-size:32px; font-weight:normal; letter-spacing:1px;">Never Broken</h1>
    <p style="color:#cccccc; margin:10px 0 0; font-size:18px;">by Joe Profit</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px;">

    <p style="font-size:26px; color:#1a1a2e; margin:0 0 25px; line-height:1.4;">
      Hey ${name},
    </p>

    <p style="font-size:22px; color:#333; margin:0 0 20px; line-height:1.6;">
      Thank you for your purchase!
    </p>

    <p style="font-size:22px; color:#333; margin:0 0 35px; line-height:1.6;">
      Your <strong>${label}</strong> is ready. Tap the big button below to open it.
    </p>

    <!-- BIG BUTTON -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 35px;">
    <tr><td align="center">
      <a href="${accessUrl}" style="display:inline-block; background:#d4a95a; color:#1a1a2e; font-size:26px; font-weight:bold; text-decoration:none; padding:24px 50px; border-radius:10px; letter-spacing:0.5px;">
        &#9654;&nbsp; Open Your ${label}
      </a>
    </td></tr>
    </table>

    <hr style="border:none; border-top:2px solid #e5e0da; margin:35px 0;">

    <!-- SAVE THIS EMAIL box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8ee; border:3px solid #d4a95a; border-radius:10px;">
    <tr><td style="padding:30px;">
      <p style="font-size:24px; color:#1a1a2e; margin:0 0 15px; font-weight:bold;">
        &#11088; Save this email!
      </p>
      <p style="font-size:20px; color:#444; margin:0; line-height:1.7;">
        This email is how you get back to your ${label.toLowerCase()}. If you ever switch phones, get a new computer, or just can't find it - open this email and tap the button above. <strong>It will always work.</strong>
      </p>
    </td></tr>
    </table>

    <hr style="border:none; border-top:2px solid #e5e0da; margin:35px 0;">

    <!-- Simple FAQ -->
    <p style="font-size:22px; color:#1a1a2e; margin:0 0 20px; font-weight:bold;">
      Quick answers:
    </p>

    <p style="font-size:20px; color:#444; margin:0 0 20px; line-height:1.7;">
      <strong>"Do I need to download anything?"</strong><br>
      Nope. It plays right in your phone's web browser or on your computer. Nothing to install. Nothing to figure out.
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

  <!-- Footer -->
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
</html>`,
    text: [
      `Hey ${name},`,
      ``,
      `Thank you for your purchase! Your ${label} is ready.`,
      ``,
      `${desc}`,
      ``,
      `OPEN YOUR ${label.toUpperCase()}:`,
      `${accessUrl}`,
      ``,
      `---`,
      ``,
      `SAVE THIS EMAIL! This is your ticket back in.`,
      `If you ever switch phones, get a new computer, or just can't find`,
      `your ${label.toLowerCase()} - come back to this email and tap the link above.`,
      `It will always work.`,
      ``,
      `---`,
      ``,
      `"Do I need to download anything?"`,
      `Nope. It plays right in your phone's browser or on your computer.`,
      ``,
      `"Can I use a different device?"`,
      `Yes! Open this email on any device and tap the link.`,
      ``,
      `"What if the link doesn't work?"`,
      `Reply to this email and we'll help you out.`,
      ``,
      `---`,
      `100% of proceeds support the YUP Foundation.`,
      `Thank you for being part of something bigger.`,
    ].join('\n'),
  };
}

function buildPhysicalBuyerEmail(session, editionLabel, shippingLines, shipName, amount) {
  const firstName = session.customer_details?.name?.split(' ')[0] || 'Friend';

  return {
    subject: `Order confirmed - Never Broken ${editionLabel}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f5f0eb; font-family:Georgia, 'Times New Roman', serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb; padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:12px; overflow:hidden;">

  <!-- Header -->
  <tr><td style="background:#1a1a2e; padding:35px 40px; text-align:center;">
    <h1 style="color:#d4a95a; margin:0; font-size:32px; font-weight:normal; letter-spacing:1px;">Never Broken</h1>
    <p style="color:#cccccc; margin:10px 0 0; font-size:18px;">by Joe Profit</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px;">

    <p style="font-size:26px; color:#1a1a2e; margin:0 0 25px; line-height:1.4;">
      Hey ${firstName},
    </p>

    <p style="font-size:22px; color:#333; margin:0 0 20px; line-height:1.6;">
      Your order is confirmed! Joe will get your <strong>${editionLabel}</strong> shipped out shortly.
    </p>

    <!-- Order box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8ee; border:3px solid #d4a95a; border-radius:10px; margin:0 0 30px;">
    <tr><td style="padding:25px 30px;">
      <p style="font-size:18px; color:#888; margin:0 0 6px; text-transform:uppercase; letter-spacing:1px;">Your Order</p>
      <p style="font-size:22px; color:#1a1a2e; margin:0 0 20px; font-weight:bold;">Never Broken - ${editionLabel} &nbsp;·&nbsp; $${amount}</p>
      <p style="font-size:18px; color:#888; margin:0 0 6px; text-transform:uppercase; letter-spacing:1px;">Ships To</p>
      <p style="font-size:20px; color:#333; margin:0; line-height:1.7; white-space:pre-line;">${shipName}\n${shippingLines}</p>
    </td></tr>
    </table>

    <p style="font-size:20px; color:#444; margin:0 0 20px; line-height:1.7;">
      Have a question? Just reply to this email and we'll take care of you.
    </p>

    <hr style="border:none; border-top:2px solid #e5e0da; margin:35px 0;">

  </td></tr>

  <!-- Footer -->
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
</html>`,
    text: [
      `Hey ${firstName},`,
      ``,
      `Your order is confirmed! Joe will get your ${editionLabel} shipped out shortly.`,
      ``,
      `ORDER SUMMARY`,
      `Product: Never Broken - ${editionLabel}`,
      `Amount:  $${amount}`,
      ``,
      `SHIPS TO:`,
      `${shipName}`,
      `${shippingLines}`,
      ``,
      `Questions? Just reply to this email.`,
      ``,
      `---`,
      `100% of proceeds support the YUP Foundation.`,
      `Thank you for being part of something bigger.`,
    ].join('\n'),
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Collect raw body for Stripe signature verification
  const rawBody = await new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object;
  const edition = session.metadata?.edition;
  const siteUrl = process.env.SITE_URL || 'https://joe-profit.vercel.app';
  const buyerEmail = session.customer_details?.email;
  const buyerName = session.customer_details?.name || 'Customer';
  const amount = (session.amount_total / 100).toFixed(2);

  // --- DIGITAL PURCHASES: email buyer their access link ---
  if (DIGITAL_EDITIONS.includes(edition)) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const label = DIGITAL_LABELS[edition];
    const emailContent = buildBuyerEmail(session, edition, siteUrl);

    // Send buyer their access email
    if (buyerEmail) {
      try {
        await resend.emails.send({
          from: 'Joe Profit <neverbroken@joeprofitneverbroken.com>',
          to: [buyerEmail],
          replyTo: 'jprofit23@gmail.com',
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
        console.log(`Buyer receipt sent to ${buyerEmail} for ${edition}`);
      } catch (err) {
        console.error('Failed to send buyer email:', err.message);
      }
    }

    // Notify Joe of the digital sale
    try {
      await resend.emails.send({
        from: 'Never Broken Shop <neverbroken@joeprofitneverbroken.com>',
        to: ['jprofit23@gmail.com'],
        subject: `New Digital Sale - ${label} · $${amount}`,
        text: [
          `NEW DIGITAL SALE - Never Broken`,
          ``,
          `Product:  ${label}`,
          `Amount:   $${amount}`,
          `Buyer:    ${buyerName}`,
          `Email:    ${buyerEmail || 'Not provided'}`,
          `Session:  ${session.id}`,
        ].join('\n'),
      });
    } catch (err) {
      console.error('Failed to send Joe notification:', err.message);
    }

    return res.status(200).json({ received: true });
  }

  // --- PHYSICAL PURCHASES: email buyer confirmation + notify Joe ---
  if (PHYSICAL_EDITIONS.includes(edition)) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const addr = session.shipping_details?.address || {};
    const shipName = session.shipping_details?.name || buyerName;
    const shippingLines = [
      addr.line1,
      addr.line2,
      addr.city && addr.state ? `${addr.city}, ${addr.state} ${addr.postal_code}` : addr.city || '',
      addr.country,
    ].filter(Boolean).join('\n');

    const editionLabel = edition === 'hardcover' ? 'Hardcover' : 'Paperback';

    // Send buyer their order confirmation
    if (buyerEmail) {
      const receipt = buildPhysicalBuyerEmail(session, editionLabel, shippingLines, shipName, amount);
      try {
        await resend.emails.send({
          from: 'Joe Profit <neverbroken@joeprofitneverbroken.com>',
          to: [buyerEmail],
          replyTo: 'jprofit23@gmail.com',
          subject: receipt.subject,
          html: receipt.html,
          text: receipt.text,
        });
        console.log(`Buyer receipt sent to ${buyerEmail} for ${edition}`);
      } catch (err) {
        console.error('Failed to send buyer receipt:', err.message);
      }
    }

    // Notify Joe of the physical sale
    try {
      await resend.emails.send({
        from: 'Never Broken Shop <neverbroken@joeprofitneverbroken.com>',
        to: ['jprofit23@gmail.com'],
        subject: `New Book Order - ${editionLabel} · $${amount}`,
        text: [
          `NEW ORDER - Never Broken`,
          ``,
          `Product:  ${editionLabel}`,
          `Amount:   $${amount}`,
          ``,
          `SHIP TO:`,
          `${shipName}`,
          `${shippingLines}`,
          ``,
          `Buyer email: ${buyerEmail || 'Not provided'}`,
          `Stripe session: ${session.id}`,
        ].join('\n'),
      });
      console.log(`Order notification sent to Joe for session ${session.id}`);
    } catch (err) {
      console.error('Failed to send Joe notification:', err.message);
    }
  }

  return res.status(200).json({ received: true });
};
