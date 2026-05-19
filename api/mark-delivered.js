const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key, piId, delivered } = req.body;
  if (!key || key.trim() !== (process.env.ADMIN_SECRET || '').trim()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!piId) return res.status(400).json({ error: 'Missing payment intent ID' });

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY?.trim());
  try {
    await stripe.paymentIntents.update(piId, {
      metadata: { delivered: delivered ? 'true' : 'false' },
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: `Stripe error: ${err.message}` });
  }
};
