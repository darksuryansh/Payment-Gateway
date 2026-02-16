import cron from 'node-cron';
import { expirePaymentLinks } from '../services/paymentLink.service.js';
import { checkOverdueInvoices } from '../services/invoice.service.js';
import { processRecurringPayments, handleRetries } from '../services/subscription.service.js';
import { retryFailedWebhooks } from '../services/webhook.service.js';

export const initCronJobs = () => {
  // Every hour: expire payment links & check overdue invoices
  cron.schedule('0 * * * *', async () => {
    try {
      const expired = await expirePaymentLinks();
      if (expired > 0) console.log(`[CRON] Expired ${expired} payment links.`);
    } catch (err) {
      console.error('[CRON] Error expiring payment links:', err.message);
    }

    try {
      const overdue = await checkOverdueInvoices();
      if (overdue > 0) console.log(`[CRON] Marked ${overdue} invoices as overdue.`);
    } catch (err) {
      console.error('[CRON] Error checking overdue invoices:', err.message);
    }
  });

  // Every day at midnight: process recurring payments
  cron.schedule('0 0 * * *', async () => {
    try {
      const processed = await processRecurringPayments();
      console.log(`[CRON] Processed ${processed} recurring payments.`);
    } catch (err) {
      console.error('[CRON] Error processing recurring payments:', err.message);
    }
  });

  // Every 5 minutes: retry failed webhooks & subscription retries
  cron.schedule('*/5 * * * *', async () => {
    try {
      await retryFailedWebhooks();
    } catch (err) {
      console.error('[CRON] Error retrying webhooks:', err.message);
    }

    try {
      await handleRetries();
    } catch (err) {
      console.error('[CRON] Error handling subscription retries:', err.message);
    }
  });

  console.log('[CRON] All cron jobs initialized.');
};
