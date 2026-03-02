const Stripe = require('stripe');

const PRICE_IDS = {
  paperback: process.env.STRIPE_PRICE_PAPERBACK,
  hardcover: process.env.STRIPE_PRICE_HARDCOVER,
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

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[edition], quantity: 1 }],
      mode: 'payment',
      success_url: `${siteUrl}?order=success#book`,
      cancel_url: `${siteUrl}#book`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
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
