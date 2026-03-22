const Stripe = require('stripe');
const nodemailer = require('nodemailer');

const PHYSICAL_EDITIONS = ['hardcover', 'paperback'];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.body;
  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['shipping_details'],
    });
  } catch (err) {
    console.error('Stripe session retrieval failed:', err.message);
    return res.status(400).json({ error: 'Invalid session' });
  }

  // Only process paid physical orders
  if (session.payment_status !== 'paid') {
    return res.status(400).json({ error: 'Payment not complete' });
  }

  const edition = session.metadata?.edition;
  if (!PHYSICAL_EDITIONS.includes(edition)) {
    return res.status(400).json({ error: 'Not a physical order' });
  }

  // Build shipping address
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
    console.log(`Fulfillment email sent for session ${session.id}`);
    return res.status(200).json({ ok: true, edition, name, email });
  } catch (err) {
    console.error('Failed to send fulfillment email:', err.message);
    return res.status(500).json({ error: 'Email failed' });
  }
};
