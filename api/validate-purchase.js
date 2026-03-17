const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(403).json({ valid: false, error: 'Payment not completed' });
    }

    const edition = session.metadata.edition;
    return res.status(200).json({
      valid: true,
      product: edition,
      isBundle: edition === 'bundle',
      email: session.customer_details?.email || null,
    });
  } catch (err) {
    console.error('Validation error:', err.message);
    return res.status(400).json({ valid: false, error: 'Invalid session' });
  }
}
