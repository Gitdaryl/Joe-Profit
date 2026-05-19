const Stripe = require('stripe');

const EDITION_LABELS = {
  paperback: 'Paperback', hardcover: 'Hardcover',
  audiobook: 'Audiobook', ebook: 'eBook', bundle: 'Read-Along Bundle',
};
const PHYSICAL = ['paperback', 'hardcover'];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { key } = req.body;
  if (!key || key.trim() !== (process.env.ADMIN_SECRET || '').trim()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY?.trim());

  // Fetch completed sessions + comp emails in parallel
  let sessions, compEmails;
  try {
    const [sessionList, couponList] = await Promise.all([
      stripe.checkout.sessions.list({ status: 'complete', limit: 100, expand: ['data.payment_intent'] }),
      stripe.coupons.list({ limit: 100 }),
    ]);

    const compCoupon = couponList.data.find(c => c.name === 'Complimentary' && c.valid);
    compEmails = new Set();
    if (compCoupon) {
      const promos = await stripe.promotionCodes.list({ coupon: compCoupon.id, limit: 100 });
      promos.data.forEach(p => {
        if (p.metadata?.recipient_email) compEmails.add(p.metadata.recipient_email.trim().toLowerCase());
      });
    }
    sessions = sessionList.data;
  } catch (err) {
    return res.status(500).json({ error: `Stripe error: ${err.message}` });
  }

  const orders = sessions
    .filter(s => {
      const paid = s.payment_status === 'paid' || s.payment_status === 'no_payment_required';
      return paid && s.metadata?.edition;
    })
    .map(s => {
      const edition = s.metadata.edition;
      const isPhysical = PHYSICAL.includes(edition);
      const isComp = s.payment_status === 'no_payment_required';
      const email = (s.customer_details?.email || '').toLowerCase();
      const pi = s.payment_intent;
      const piId = typeof pi === 'string' ? pi : pi?.id;
      const delivered = pi?.metadata?.delivered === 'true';

      const addr = s.shipping_details?.address || {};
      const shipName = s.shipping_details?.name || s.customer_details?.name || '';
      const addrLine = [
        shipName,
        addr.line1,
        addr.line2,
        addr.city && addr.state ? `${addr.city}, ${addr.state} ${addr.postal_code}` : addr.city,
        addr.country,
      ].filter(Boolean).join(' · ');

      return {
        id: s.id,
        piId,
        name: s.customer_details?.name || '-',
        email: s.customer_details?.email || '-',
        edition,
        label: EDITION_LABELS[edition] || edition,
        isPhysical,
        isComp,
        amount: (s.amount_total / 100).toFixed(2),
        shipping: isPhysical ? addrLine : null,
        delivered,
        compSent: isComp || compEmails.has(email),
        created: s.created,
      };
    })
    .sort((a, b) => b.created - a.created);

  return res.status(200).json({ orders });
};
