const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key } = req.body;
  if (!key || key !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY?.trim());

  let coupon;
  try {
    const coupons = await stripe.coupons.list({ limit: 100 });
    coupon = coupons.data.find(c => c.name === 'Complimentary' && c.valid);
  } catch (err) {
    console.error('Stripe coupon lookup failed:', err.message);
    return res.status(500).json({ error: 'Could not reach Stripe' });
  }

  if (!coupon) {
    return res.status(404).json({ error: 'Complimentary coupon not found in Stripe' });
  }

  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const code = `COMP-${suffix}`;

  try {
    const promo = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code,
      max_redemptions: 1,
    });
    return res.status(200).json({ code: promo.code });
  } catch (err) {
    console.error('Promo code creation failed:', err.message);
    return res.status(500).json({ error: 'Failed to create promo code' });
  }
};
