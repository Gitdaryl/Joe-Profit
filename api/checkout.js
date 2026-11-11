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

// Shipping & handling: first book, then each extra book in the same box.
// Keep in sync with SHIP_FIRST / SHIP_EXTRA in src/App.jsx (shop + CashApp amounts).
const SHIP_FIRST_CENTS = 797;
const SHIP_EXTRA_CENTS = 350;
const shippingCents = (qty) => SHIP_FIRST_CENTS + SHIP_EXTRA_CENTS * (qty - 1);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { edition } = req.body;
  const MAX_QTY = 10;

  if (!edition || !PRICE_IDS[edition]) {
    return res.status(400).json({ error: 'Invalid edition' });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY?.trim());
  const siteUrl = process.env.SITE_URL || 'https://joe-profit.vercel.app';
  const isDigital = DIGITAL_EDITIONS.includes(edition);
  const requestedQty = parseInt(req.body.quantity, 10);
  const quantity = isDigital ? 1 : Math.min(MAX_QTY, Math.max(1, Number.isFinite(requestedQty) ? requestedQty : 1));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // Quantity is locked here (no adjustable_quantity): shipping is priced per book,
      // so a count changed on the Stripe page would keep the wrong shipping charge.
      line_items: [{ price: PRICE_IDS[edition], quantity }],
      mode: 'payment',
      success_url: `${siteUrl}${SUCCESS_PATHS[edition]}`,
      cancel_url: `${siteUrl}/shop`,
      ...(!isDigital ? {
        // Checkout enforces shipping collection in the Link flow too; per-session Link
        // disable is not supported by this API version (param rejected → checkout 500s).
        // To hide Link entirely: Stripe Dashboard → Settings → Payment methods.
        shipping_address_collection: { allowed_countries: ['US'] },
      } : {}),
      ...(!isDigital ? {
        shipping_options: [{
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingCents(quantity), currency: 'usd' },
            display_name: quantity > 1 ? `Shipping & handling (${quantity} books)` : 'Shipping & handling',
          },
        }],
      } : {}),
      allow_promotion_codes: true,
      metadata: {
        product: 'Never Broken',
        edition,
        quantity: String(quantity),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
