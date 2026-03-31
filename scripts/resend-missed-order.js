/**
 * One-time script: resend the missed physical order emails.
 * Pulls the most recent hardcover/paperback Stripe session and sends
 * both the buyer receipt and Joe's notification via Resend.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... RESEND_API_KEY=re_... SITE_URL=https://... node scripts/resend-missed-order.js
 *
 * Or with Vercel env pulled locally:
 *   vercel env pull .env.local && node -r dotenv/config scripts/resend-missed-order.js
 */

const Stripe = require('stripe');
const { Resend } = require('resend');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const PHYSICAL_EDITIONS = ['hardcover', 'paperback'];

function buildPhysicalBuyerEmail(session, editionLabel, shippingLines, shipName, amount) {
  const firstName = session.customer_details?.name?.split(' ')[0] || 'Friend';

  return {
    subject: `Order confirmed — Never Broken ${editionLabel}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f5f0eb; font-family:Georgia, 'Times New Roman', serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb; padding:40px 20px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:12px; overflow:hidden;">

  <tr><td style="background:#1a1a2e; padding:35px 40px; text-align:center;">
    <h1 style="color:#d4a95a; margin:0; font-size:32px; font-weight:normal; letter-spacing:1px;">Never Broken</h1>
    <p style="color:#cccccc; margin:10px 0 0; font-size:18px;">by Joe Profit</p>
  </td></tr>

  <tr><td style="padding:40px;">

    <p style="font-size:26px; color:#1a1a2e; margin:0 0 25px; line-height:1.4;">
      Hey ${firstName},
    </p>

    <p style="font-size:22px; color:#333; margin:0 0 20px; line-height:1.6;">
      Your order is confirmed! Joe will get your <strong>${editionLabel}</strong> shipped out shortly.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8ee; border:3px solid #d4a95a; border-radius:10px; margin:0 0 30px;">
    <tr><td style="padding:25px 30px;">
      <p style="font-size:18px; color:#888; margin:0 0 6px; text-transform:uppercase; letter-spacing:1px;">Your Order</p>
      <p style="font-size:22px; color:#1a1a2e; margin:0 0 20px; font-weight:bold;">Never Broken — ${editionLabel} &nbsp;·&nbsp; $${amount}</p>
      <p style="font-size:18px; color:#888; margin:0 0 6px; text-transform:uppercase; letter-spacing:1px;">Ships To</p>
      <p style="font-size:20px; color:#333; margin:0; line-height:1.7; white-space:pre-line;">${shipName}\n${shippingLines}</p>
    </td></tr>
    </table>

    <p style="font-size:20px; color:#444; margin:0 0 20px; line-height:1.7;">
      Have a question? Just reply to this email and we'll take care of you.
    </p>

    <hr style="border:none; border-top:2px solid #e5e0da; margin:35px 0;">

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
</html>`,
    text: [
      `Hey ${firstName},`,
      ``,
      `Your order is confirmed! Joe will get your ${editionLabel} shipped out shortly.`,
      ``,
      `ORDER SUMMARY`,
      `Product: Never Broken — ${editionLabel}`,
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

async function main() {
  console.log('Fetching recent Stripe checkout sessions...');

  // Pull last 20 completed sessions, find the missed physical one
  const sessions = await stripe.checkout.sessions.list({ limit: 20 });

  const physicalSessions = sessions.data.filter(s =>
    s.status === 'complete' &&
    PHYSICAL_EDITIONS.includes(s.metadata?.edition)
  );

  // Retrieve each full session individually (shipping_details is included by default)
  const fullSessions = await Promise.all(
    physicalSessions.map(s => stripe.checkout.sessions.retrieve(s.id))
  );

  if (fullSessions.length === 0) {
    console.log('No completed physical orders found in last 20 sessions.');
    return;
  }

  console.log(`Found ${fullSessions.length} physical order(s):`);
  fullSessions.forEach((s, i) => {
    const d = new Date(s.created * 1000).toLocaleString();
    console.log(`  [${i}] ${d} — ${s.metadata?.edition} — $${(s.amount_total/100).toFixed(2)} — ${s.customer_details?.email}`);
  });

  // Use the most recent one (index 0), or set SESSION_ID env to target a specific one
  const target = process.env.SESSION_ID
    ? fullSessions.find(s => s.id === process.env.SESSION_ID)
    : fullSessions[0];

  if (!target) {
    console.error('Could not find target session. Set SESSION_ID env var to match a session above.');
    return;
  }

  const session = target;
  const edition = session.metadata?.edition;
  const editionLabel = edition === 'hardcover' ? 'Hardcover' : 'Paperback';
  const buyerEmail = session.customer_details?.email;
  const buyerName = session.customer_details?.name || 'Customer';
  const amount = (session.amount_total / 100).toFixed(2);
  const addr = session.shipping_details?.address || {};
  const shipName = session.shipping_details?.name || buyerName;
  const shippingLines = [
    addr.line1,
    addr.line2,
    addr.city && addr.state ? `${addr.city}, ${addr.state} ${addr.postal_code}` : addr.city || '',
    addr.country,
  ].filter(Boolean).join('\n');

  console.log(`\nSending for session: ${session.id}`);
  console.log(`  Edition: ${editionLabel}`);
  console.log(`  Buyer:   ${buyerName} <${buyerEmail}>`);
  console.log(`  Ship to: ${shipName}, ${shippingLines.replace(/\n/g, ', ')}`);
  console.log(`  Amount:  $${amount}`);

  // Buyer receipt
  if (buyerEmail) {
    const receipt = buildPhysicalBuyerEmail(session, editionLabel, shippingLines, shipName, amount);
    const { data, error } = await resend.emails.send({
      from: 'Joe Profit <neverbroken@yetigroove.com>',
      to: [buyerEmail],
      replyTo: 'jprofit23@gmail.com',
      subject: receipt.subject,
      html: receipt.html,
      text: receipt.text,
    });
    if (error) {
      console.error('  Buyer receipt FAILED:', error.message);
    } else {
      console.log(`  Buyer receipt sent to ${buyerEmail} (id: ${data.id})`);
    }
  } else {
    console.log('  No buyer email on session — skipping buyer receipt.');
  }

  // Joe notification
  const { data: joeData, error: joeError } = await resend.emails.send({
    from: 'Never Broken Shop <neverbroken@yetigroove.com>',
    to: ['jprofit23@gmail.com'],
    subject: `New Book Order — ${editionLabel} · $${amount}`,
    text: [
      `NEW ORDER — Never Broken`,
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
  if (joeError) {
    console.error('  Joe notification FAILED:', joeError.message);
  } else {
    console.log(`  Joe notification sent (id: ${joeData.id})`);
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
