const Stripe = require('stripe');

const PRICE_IDS = {
  paperback: process.env.STRIPE_PRICE_PAPERBACK,
  hardcover: process.env.STRIPE_PRICE_HARDCOVER,
  audiobook: process.env.STRIPE_PRICE_AUDIOBOOK,
  ebook: process.env.STRIPE_PRICE_EBOOK,
  bundle: process.env.STRIPE_PRICE_BUNDLE,
};

const DIGITAL_EDITIONS = ['audiobook', 'ebook', 'bundle'];

const SUCCESS_PATHS = {
  paperback: '/shop?order=success&session_id={CHECKOUT_SESSION_ID}',
  hardcover: '/shop?order=success&session_id={CHECKOUT_SESSION_ID}',
  audiobook: '/audiobook?session_id={CHECKOUT_SESSION_ID}',
  ebook: '/ebook?session_id={CHECKOUT_SESSION_ID}',
  bundle: '/read-along?session_id={CHECKOUT_SESSION_ID}',
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { edition } = req.body;

  if (!edition || !PRICE_IDS[edition]) {
    return res.status(400).json({ error: 'Invalid edition' });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const siteUrl = process.env.SITE_URL || 'https://joe-profit.vercel.app';
  const isDigital = DIGITAL_EDITIONS.includes(edition);

  try {
    const session = await stripe.checkout.sessions.create({
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      line_items: [{ price: PRICE_IDS[edition], quantity: 1 }],
      mode: 'payment',
      success_url: `${siteUrl}${SUCCESS_PATHS[edition]}`,
      cancel_url: `${siteUrl}/shop`,
      ...(!isDigital ? { shipping_address_collection: { allowed_countries: ['US'] } } : {}),
      ...(!isDigital && process.env.STRIPE_SHIPPING_RATE_ID
        ? { shipping_options: [{ shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID }] }
        : {}),
      metadata: {
        product: 'Never Broken',
        edition,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
