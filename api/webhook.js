const Stripe = require('stripe');
const nodemailer = require('nodemailer');

// Stripe requires the raw body for signature verification
module.exports.config = { api: { bodyParser: false } };

const PHYSICAL_EDITIONS = ['hardcover', 'paperback'];

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

  if (!PHYSICAL_EDITIONS.includes(edition)) {
    return res.status(200).json({ received: true });
  }

  // Build shipping address string
  const addr = session.shipping_details?.address || {};
  const name = session.shipping_details?.name || session.customer_details?.name || 'Unknown';
  const email = session.customer_details?.email || 'Not provided';
  const shippingLines = [
    addr.line1,
    addr.line2,
    addr.city && addr.state ? `${addr.city}, ${addr.state} ${addr.postal_code}` : addr.city || '',
    addr.country,
  ].filter(Boolean).join('\n');

  const editionLabel = edition === 'hardcover' ? 'Hardcover' : 'Paperback';
  const amount = (session.amount_total / 100).toFixed(2);

  // Send email to Joe
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Never Broken Shop" <${process.env.SMTP_USER}>`,
    to: 'jprofit23@gmail.com',
    subject: `New Book Order — ${editionLabel} · $${amount}`,
    text: [
      `NEW ORDER — Never Broken`,
      ``,
      `Product:  ${editionLabel}`,
      `Amount:   $${amount}`,
      ``,
      `SHIP TO:`,
      `${name}`,
      `${shippingLines}`,
      ``,
      `Buyer email: ${email}`,
      `Stripe session: ${session.id}`,
    ].join('\n'),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order email sent for session ${session.id}`);
  } catch (err) {
    console.error('Failed to send order email:', err.message);
    // Don't return 500 — Stripe will retry. Log only.
  }

  return res.status(200).json({ received: true });
};
