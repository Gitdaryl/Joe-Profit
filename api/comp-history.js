const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key } = req.body;
  if (!key || key.trim() !== (process.env.ADMIN_SECRET || '').trim()) {
    return res.status(401).json({ error: 'Unauthorized' });
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
  if (!coupon) return res.status(404).json({ error: 'Complimentary coupon not found' });

  // Fetch all promotion codes for this coupon
  try {
    const promos = await stripe.promotionCodes.list({ coupon: coupon.id, limit: 100 });
    const records = promos.data
      .sort((a, b) => b.created - a.created)
      .map(p => ({
        code: p.code,
        name: p.metadata?.recipient_name || '-',
        email: p.metadata?.recipient_email || '-',
        redeemed: p.times_redeemed > 0,
        created: p.created,
      }));
    return res.status(200).json({ records });
  } catch (err) {
    return res.status(500).json({ error: `Stripe error: ${err.message}` });
  }
};
