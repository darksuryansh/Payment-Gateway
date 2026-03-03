import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"Node Gateway" <${process.env.SMTP_USER || 'noreply@nodegateway.in'}>`;

/**
 * Send a payment success confirmation to the customer.
 */
export const sendPaymentSuccessEmail = async ({ to, customerName, amount, orderId, merchantName }) => {
  if (!process.env.SMTP_USER) return; // skip if SMTP not configured
  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: `Payment Confirmed – ₹${Number(amount).toLocaleString('en-IN')}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <h2 style="color:#16a34a;">✓ Payment Successful</h2>
          <p>Hi ${customerName || 'there'},</p>
          <p>Your payment of <strong>₹${Number(amount).toLocaleString('en-IN')}</strong> to <strong>${merchantName}</strong> was successful.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;color:#6b7280;">Order ID</td><td style="padding:8px;font-family:monospace;">${orderId}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Amount</td><td style="padding:8px;font-weight:bold;">₹${Number(amount).toLocaleString('en-IN')}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Status</td><td style="padding:8px;color:#16a34a;font-weight:bold;">Completed</td></tr>
          </table>
          <p style="color:#6b7280;font-size:0.875rem;">This is an automated confirmation. Zero platform fees charged on UPI payments.</p>
          <p style="color:#6b7280;font-size:0.75rem;">Powered by Node Gateway</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('[EMAIL] Failed to send payment success email:', err.message);
  }
};

/**
 * Send a payment failure notification to the customer.
 */
export const sendPaymentFailedEmail = async ({ to, customerName, amount, orderId, merchantName }) => {
  if (!process.env.SMTP_USER) return;
  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: `Payment Failed – ₹${Number(amount).toLocaleString('en-IN')}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <h2 style="color:#dc2626;">✗ Payment Failed</h2>
          <p>Hi ${customerName || 'there'},</p>
          <p>Your payment of <strong>₹${Number(amount).toLocaleString('en-IN')}</strong> to <strong>${merchantName}</strong> could not be completed.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;color:#6b7280;">Order ID</td><td style="padding:8px;font-family:monospace;">${orderId}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Amount</td><td style="padding:8px;">₹${Number(amount).toLocaleString('en-IN')}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Status</td><td style="padding:8px;color:#dc2626;font-weight:bold;">Failed</td></tr>
          </table>
          <p>Please try again or contact <strong>${merchantName}</strong> for assistance.</p>
          <p style="color:#6b7280;font-size:0.75rem;">Powered by Node Gateway</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('[EMAIL] Failed to send payment failed email:', err.message);
  }
};

/**
 * Send a new invoice email to the customer.
 */
export const sendInvoiceEmail = async ({ to, customerName, invoiceNumber, amount, paymentUrl, merchantName, dueDate }) => {
  if (!process.env.SMTP_USER) return;
  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: `Invoice ${invoiceNumber} from ${merchantName} – ₹${Number(amount).toLocaleString('en-IN')}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <h2 style="color:#1d4ed8;">Invoice from ${merchantName}</h2>
          <p>Hi ${customerName || 'there'},</p>
          <p>You have a new invoice of <strong>₹${Number(amount).toLocaleString('en-IN')}</strong> from <strong>${merchantName}</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0;">
            <tr><td style="padding:8px;color:#6b7280;">Invoice #</td><td style="padding:8px;font-family:monospace;">${invoiceNumber}</td></tr>
            <tr><td style="padding:8px;color:#6b7280;">Amount</td><td style="padding:8px;font-weight:bold;">₹${Number(amount).toLocaleString('en-IN')}</td></tr>
            ${dueDate ? `<tr><td style="padding:8px;color:#6b7280;">Due Date</td><td style="padding:8px;">${new Date(dueDate).toLocaleDateString('en-IN')}</td></tr>` : ''}
          </table>
          ${paymentUrl ? `<a href="${paymentUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Pay Now</a>` : ''}
          <p style="color:#6b7280;font-size:0.75rem;margin-top:24px;">Powered by Node Gateway</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('[EMAIL] Failed to send invoice email:', err.message);
  }
};

/**
 * Send subscription payment confirmation.
 */
export const sendSubscriptionPaymentEmail = async ({ to, customerName, planName, amount, merchantName }) => {
  if (!process.env.SMTP_USER) return;
  try {
    await transporter.sendMail({
      from: FROM,
      to,
      subject: `Subscription Renewed – ${planName}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <h2 style="color:#7c3aed;">Subscription Renewed</h2>
          <p>Hi ${customerName || 'there'},</p>
          <p>Your subscription <strong>${planName}</strong> with <strong>${merchantName}</strong> has been renewed.</p>
          <p>Amount charged: <strong>₹${Number(amount).toLocaleString('en-IN')}</strong></p>
          <p style="color:#6b7280;font-size:0.75rem;">Powered by Node Gateway</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('[EMAIL] Failed to send subscription email:', err.message);
  }
};
