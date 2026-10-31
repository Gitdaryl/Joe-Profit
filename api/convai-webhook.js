// ElevenLabs post-call webhook for the "Joe" voice widget.
// Verifies the HMAC signature, reads the post-call analysis, and emails Joe
// (plus BOOKING_CC_EMAIL) whenever a caller asked for something a human must act on.
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const { Resend } = require('resend');

module.exports.config = { api: { bodyParser: false } };

const JOE_AGENT_ID = process.env.ELEVENLABS_JOE_AGENT_ID || 'agent_1401khwfqmasffjtw001sm9rg7m6';
const TO = ['jprofit23@gmail.com'];

const TYPE_LABELS = {
  book_order: 'Book order',
  signed_book: 'Signed book request',
  speaking_request: 'Speaking request',
  partnership_or_investment: 'Partnership / investment pitch',
  media_or_interview: 'Media / interview request',
  foundation_or_donation: 'Foundation / donation',
  ministry: 'Ministry',
  support_issue: 'Site or order support',
  family_or_friend: 'Family or friend',
  other: 'Other request',
  none: 'Conversation',
};
const ACTION_TYPES = new Set(['book_order', 'signed_book', 'speaking_request', 'partnership_or_investment', 'media_or_interview', 'foundation_or_donation', 'support_issue', 'other']);

function val(results, key) {
  const r = results && results[key];
  if (!r) return '';
  const v = typeof r === 'object' && r !== null && 'value' in r ? r.value : r;
  if (v === null || v === undefined) return '';
  const s = String(v).trim();
  return /^(none|null|unknown|n\/a|not provided)$/i.test(s) ? '' : s;
}

// Decide whether a human needs to act, and build the email. Exported for tests.
function assess(data) {
  const a = data.analysis || {};
  const dc = a.data_collection_results || {};
  const ev = a.evaluation_criteria_results || {};
  const fields = {
    name: val(dc, 'caller_name'),
    email: val(dc, 'contact_email'),
    phone: val(dc, 'contact_phone'),
    organization: val(dc, 'organization'),
    type: val(dc, 'request_type') || 'none',
    summary: val(dc, 'request_summary'),
    address: val(dc, 'shipping_address'),
    promised: /^true$/i.test(val(dc, 'follow_up_promised')),
  };
  const evalNeeds = ev.needs_human_follow_up && String(ev.needs_human_follow_up.result || '').toLowerCase() === 'success';
  const text = (a.transcript_summary || '').toLowerCase();
  const keyword = /\b(signed copy|ship|mail me|speak at|keynote|book (him|joe)|invest|partner|interview|podcast|donat|sponsor|call me back|reach out|my (email|number) is)\b/.test(text);
  const needsHuman = evalNeeds || ACTION_TYPES.has(fields.type) || fields.promised || !!fields.email || !!fields.phone || !!fields.address || keyword;
  return { fields, needsHuman, reasons: { evalNeeds, keyword } };
}

function buildEmail(data, assessment) {
  const { fields } = assessment;
  const m = data.metadata || {};
  const when = m.start_time_unix_secs ? new Date(m.start_time_unix_secs * 1000).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' }) + ' ET' : 'unknown time';
  const mins = m.call_duration_secs ? `${Math.round(m.call_duration_secs / 60)} min` : '';
  const label = (fields.type === 'none' && assessment.reasons.keyword) ? 'Possible request (keyword match)' : (TYPE_LABELS[fields.type] || TYPE_LABELS.other);
  const who = fields.name || 'Unknown caller';
  const subject = `[Joe site] ${label}: ${who}${fields.organization ? ` (${fields.organization})` : ''}`;
  const lines = [
    `Someone spoke with the AI "Joe" on joeprofitneverbroken.com and needs a real person to follow up.`,
    ``,
    `WHAT THEY WANT`,
    `  Type:      ${label}`,
    `  Summary:   ${fields.summary || (data.analysis && data.analysis.transcript_summary) || '(no summary)'}`,
    fields.promised ? `  NOTE:      The AI promised a follow-up, a shipment, or a call. Someone must honor or correct that.` : null,
    ``,
    `WHO`,
    `  Name:      ${who}`,
    fields.organization ? `  Org:       ${fields.organization}` : null,
    `  Email:     ${fields.email || 'not given'}`,
    `  Phone:     ${fields.phone || 'not given'}`,
    fields.address ? `  Address:   ${fields.address}` : null,
    ``,
    `CALL`,
    `  When:      ${when}${mins ? ` · ${mins}` : ''}`,
    `  Transcript summary: ${(data.analysis && data.analysis.transcript_summary) || '(none)'}`,
    `  Conversation ID: ${data.conversation_id}`,
    `  Open in ElevenLabs: https://elevenlabs.io/app/agents/history/${data.conversation_id}`,
    ``,
    `The AI cannot ship books, book events, or call anyone back. Reply to the caller directly.`,
  ].filter(l => l !== null).join('\n');
  return { subject, text: lines };
}

async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!secret) {
    console.error('convai-webhook: ELEVENLABS_WEBHOOK_SECRET not set');
    return res.status(500).json({ error: 'Webhook not configured' });
  }
  const raw = await readRawBody(req);
  let event;
  try {
    const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY || 'unused' });
    event = await client.webhooks.constructEvent(raw, req.headers['elevenlabs-signature'], secret);
  } catch (err) {
    console.error('convai-webhook: bad signature:', err.message);
    return res.status(401).json({ error: 'Invalid signature' });
  }

  if (event.type !== 'post_call_transcription') return res.status(200).json({ received: true, ignored: event.type });
  const data = event.data || {};
  if (data.agent_id !== JOE_AGENT_ID) return res.status(200).json({ received: true, ignored: 'other agent' });

  const assessment = assess(data);
  console.log(`convai-webhook: ${data.conversation_id} type=${assessment.fields.type} needsHuman=${assessment.needsHuman}`);
  if (!assessment.needsHuman) return res.status(200).json({ received: true, action: 'none' });

  const { subject, text } = buildEmail(data, assessment);
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const cc = process.env.BOOKING_CC_EMAIL ? [process.env.BOOKING_CC_EMAIL] : undefined;
    await resend.emails.send({
      from: 'Never Broken Site <neverbroken@joeprofitneverbroken.com>',
      to: TO,
      cc,
      replyTo: assessment.fields.email || undefined,
      subject,
      text,
    });
  } catch (err) {
    // Log and still return 200: ElevenLabs keeps the transcript, and a 5xx would
    // only make it retry into the same failure.
    console.error('convai-webhook: email failed:', err.message);
    return res.status(200).json({ received: true, action: 'email_failed' });
  }
  return res.status(200).json({ received: true, action: 'emailed' });
}

module.exports = handler;
module.exports.assess = assess;
module.exports.buildEmail = buildEmail;
