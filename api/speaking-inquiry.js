const { Resend } = require('resend');

const REQUIRED_FIELDS = ['name', 'email', 'organization', 'eventType', 'city'];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, organization, city, eventType, audienceSize, dateRange, budget, message } = req.body;

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    if (!req.body[field] || !req.body[field].toString().trim()) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const emailBody = `
New Speaking Inquiry — Joe Profit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT
  Name:           ${name}
  Email:          ${email}
  Phone:          ${phone || '—'}
  Organization:   ${organization}
  City / State:   ${city}

EVENT DETAILS
  Event Type:     ${eventType}
  Audience Size:  ${audienceSize || '—'}
  Preferred Date: ${dateRange || '—'}
  Budget Range:   ${budget || '—'}

MESSAGE
  ${message || '(none)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reply to this email to respond directly to ${name}.
`.trim();

  try {
    const toAddresses = ['jprofit23@gmail.com'];
    if (process.env.BOOKING_CC_EMAIL) {
      toAddresses.push(process.env.BOOKING_CC_EMAIL);
    }

    await resend.emails.send({
      from: 'Joe Profit Bookings <bookings@joeprofitneverbroken.com>',
      to: toAddresses,
      replyTo: email,
      subject: `New Speaking Inquiry — ${organization} — ${eventType}`,
      text: emailBody,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err.message);
    return res.status(500).json({ error: 'Failed to send inquiry' });
  }
};
