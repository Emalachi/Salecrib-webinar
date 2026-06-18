import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import * as postmark from 'postmark';

admin.initializeApp();

const db = admin.firestore();

interface ProviderConfig {
  provider: 'sendgrid' | 'mailgun' | 'postmark' | 'smtp' | 'gmail';
  apiKey?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  fromName?: string;
  fromEmail?: string;
  domain?: string; // used for Mailgun
}

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

// ----------------------------------------------------------------------------
// Utility: Replace variables in strings
// ----------------------------------------------------------------------------
function mergeVariables(text: string, data: Record<string, any>): string {
  if (!text) return text;
  let merged = text;
  for (const [key, value] of Object.entries(data)) {
    const safeValue = value || '';
    merged = merged.replace(new RegExp(`{{${key}}}`, 'g'), String(safeValue));
  }
  return merged;
}

// ----------------------------------------------------------------------------
// Core Email Sending Function
// ----------------------------------------------------------------------------
async function sendEmailImpl(config: ProviderConfig, payload: EmailPayload): Promise<void> {
  const fromName = config.fromName || 'System';
  const fromEmail = config.fromEmail || 'noreply@salecrib.com';
  const fromStr = `"${fromName}" <${fromEmail}>`;

  if (config.provider === 'sendgrid') {
    if (!config.apiKey) throw new Error("SendGrid configured but no API key provided");
    sgMail.setApiKey(config.apiKey);
    await sgMail.send({
      to: payload.to,
      from: fromStr,
      subject: payload.subject,
      html: payload.html,
    });
  } else if (config.provider === 'mailgun') {
    if (!config.apiKey) throw new Error("Mailgun configured but no API key provided");
    // default domain if not provided... (usually Mailgun requires a domain)
    const domain = config.domain || fromEmail.split('@')[1] || 'sandbox.mailgun.org';
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({ username: 'api', key: config.apiKey });
    await mg.messages.create(domain, {
      from: fromStr,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
    });
  } else if (config.provider === 'postmark') {
    if (!config.apiKey) throw new Error("Postmark configured but no API key provided");
    const client = new postmark.ServerClient(config.apiKey);
    await client.sendEmail({
      From: fromStr,
      To: payload.to,
      Subject: payload.subject,
      HtmlBody: payload.html,
    });
  } else if (config.provider === 'smtp' || config.provider === 'gmail') {
    let transporterConfig: any = {};
    if (config.provider === 'gmail') {
      transporterConfig = {
        service: 'gmail',
        auth: {
          user: config.username,
          pass: config.password,
        }
      };
    } else {
      transporterConfig = {
        host: config.host,
        port: config.port || 587,
        secure: config.port === 465,
        auth: {
          user: config.username,
          pass: config.password,
        }
      };
    }
    const transporter = nodemailer.createTransport(transporterConfig);
    await transporter.sendMail({
      from: fromStr,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });
  } else {
    throw new Error(`Unknown provider: ${config.provider}`);
  }
}

// ----------------------------------------------------------------------------
// Callable: Send Test Email
// ----------------------------------------------------------------------------
export const sendTestEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  const ownerUid = context.auth.uid;
  const { to } = data;

  if (!to) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing "to" address');
  }

  const settingsDoc = await db.collection('platform_settings').doc(ownerUid).get();
  if (!settingsDoc.exists) {
    throw new functions.https.HttpsError('failed-precondition', 'No platform settings found for user');
  }

  const config = settingsDoc.data();
  if (!config || !config.provider) {
    throw new functions.https.HttpsError('failed-precondition', 'Email provider not configured');
  }

  try {
    await sendEmailImpl(config as ProviderConfig, {
      to,
      subject: 'Test Email from SaleCrib',
      html: '<p>If you are reading this, your email API configuration works!</p>',
    });
    return { success: true };
  } catch (err: any) {
    console.error("Test email failed:", err);
    throw new functions.https.HttpsError('internal', `Test email failed: ${err.message}`);
  }
});

// ----------------------------------------------------------------------------
// Trigger: Confirmation Email on New Registration
// ----------------------------------------------------------------------------
export const onRegistrationCreate = functions.firestore
  .document('registrations/{registrationId}')
  .onCreate(async (snap, context) => {
    const regData = snap.data();
    if (!regData.email || !regData.webinarId || !regData.ownerUid) {
      console.log('Missing necessary registration fields, aborting email.');
      return;
    }
    
    // Default idempotency check (did we already log a confirmation?)
    if (regData.confirmationSentAt) {
      console.log('Confirmation already sent.');
      return;
    }

    try {
      // 1. Get the Webinar
      const webinarDoc = await db.collection('webinars').doc(regData.webinarId).get();
      if (!webinarDoc.exists) {
        console.log(`Webinar ${regData.webinarId} not found.`);
        return;
      }
      const webinar = webinarDoc.data();

      // 2. Get the Marketer's Provider Settings
      const settingsDoc = await db.collection('platform_settings').doc(regData.ownerUid).get();
      if (!settingsDoc.exists || !settingsDoc.data()?.provider) {
        console.log(`No email provider configured for owner ${regData.ownerUid}.`);
        return;
      }
      const config = settingsDoc.data() as ProviderConfig;

      // 3. Define the email (Could also query 'email_campaigns' here, but we'll use a strong default)
      const mergeContext = {
        first_name: regData.name ? regData.name.split(' ')[0] : '',
        last_name: regData.name && regData.name.split(' ').length > 1 ? regData.name.split(' ')[1] : '',
        name: regData.name || '',
        webinar_title: webinar?.title || 'Our Webinar',
        date_time: webinar?.schedule || regData.sessionTime || 'Upcoming',
        host_name: config.fromName || 'SaleCrib Host',
        webinar_link: `https://salecrib.com/webinar/room/${webinar?.slug}?uid=${context.params.registrationId}`,
      };

      // Check if they have a confirmation campaign
      let subjectTemplate = 'Registration Confirmed: {{webinar_title}}';
      let htmlTemplate = `<p>Hi {{first_name}},</p>
<p>You're confirmed for <strong>{{webinar_title}}</strong>.</p>
<p>When it's time, join using your private room link:</p>
<p><a href="{{webinar_link}}">{{webinar_link}}</a></p>
<p>See you there!</p>
<p>- {{host_name}}</p>`;

      const campaignsSnap = await db.collection('email_campaigns')
        .where('ownerUid', '==', regData.ownerUid)
        .where('type', '==', 'confirmation')
        .limit(1)
        .get();

      if (!campaignsSnap.empty) {
        const camp = campaignsSnap.docs[0].data();
        if (camp.subject) subjectTemplate = camp.subject;
        if (camp.html) htmlTemplate = camp.html;
      }

      await sendEmailImpl(config, {
        to: regData.email,
        subject: mergeVariables(subjectTemplate, mergeContext),
        html: mergeVariables(htmlTemplate, mergeContext),
      });

      // Mark as sent
      await snap.ref.update({ confirmationSentAt: admin.firestore.FieldValue.serverTimestamp() });

      // Log the sent email as a campaign stat if the marketer uses custom campaigns
      if (!campaignsSnap.empty) {
         // Increase sent stat
         campaignsSnap.docs[0].ref.update({
           sent: admin.firestore.FieldValue.increment(1)
         });
      }

    } catch (err: any) {
      console.error('Error sending confirmation email:', err);
      // Log failure in firestore
      await snap.ref.update({ confirmationError: err.message });
    }
  });

// ----------------------------------------------------------------------------
// Scheduled Trigger: Sequence Reminders (Every 15 min)
// ----------------------------------------------------------------------------
export const sequenceReminders = functions.pubsub.schedule('every 15 minutes').onRun(async (context) => {
    // Strategy: Look for registrations without "reminderSentAt" that match certain time windows,
    // or use a more robust "reminders: []" tracker array on registration doc.
    const now = Date.now();
    const futureLimit = new Date(now + 24 * 60 * 60 * 1000); // within 24h
    // This is a minimal placeholder for scheduled logic. 
    // In a production system, we'd query registrations whose scheduled time is soon 
    // and who lack the "24hReminderSent" flag, etc.

    // Example logic querying for reminders...
    const regsSnap = await db.collection('registrations')
      .where('status', '==', 'registered')
      .where('reminder24hSent', '==', false)
      .limit(50)
      .get();

    for (const doc of regsSnap.docs) {
      // process reminder...
    }
  });
