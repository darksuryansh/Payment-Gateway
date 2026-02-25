import { Op } from 'sequelize';
import { Subscription, SubscriptionPayment, Transaction, Merchant } from '../models/pg/index.js';
import { initiateTransaction } from './paytm.service.js';
import { triggerMerchantWebhooks } from './webhook.service.js';
import { v4 as uuidv4 } from 'uuid';

export const updateNextBilling = (subscription) => {
  const current = new Date(subscription.next_billing);
  const count = subscription.interval_count || 1;
  switch (subscription.interval) {
    case 'daily':   current.setDate(current.getDate() + count); break;
    case 'weekly':  current.setDate(current.getDate() + (7 * count)); break;
    case 'monthly': current.setMonth(current.getMonth() + count); break;
    case 'yearly':  current.setFullYear(current.getFullYear() + count); break;
  }
  return current.toISOString().split('T')[0];
};

export const processRecurringPayments = async () => {
  const today = new Date().toISOString().split('T')[0];

  const dueSubscriptions = await Subscription.findAll({
    where: { status: 'ACTIVE', next_billing: { [Op.lte]: today } },
  });

  for (const sub of dueSubscriptions) {
    // Cancel if past end date
    if (sub.end_date && sub.end_date < today) {
      await sub.update({ status: 'EXPIRED' });
      triggerMerchantWebhooks(sub.merchant_id, 'subscription.expired', {
        event: 'subscription.expired', subscription_id: sub.id, plan_name: sub.plan_name,
      }).catch(() => {});
      continue;
    }

    try {
      // Fetch merchant with Paytm credentials
      const merchant = await Merchant.findByPk(sub.merchant_id, {
        attributes: { exclude: ['password'] },
      });

      if (!merchant || !merchant.paytm_configured) {
        console.error(`[SUBSCRIPTION] Merchant ${sub.merchant_id} has no Paytm config, skipping`);
        continue;
      }

      const orderId = 'ORD' + uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase();
      const baseUrl = (process.env.CALLBACK_BASE_URL || '').replace(/\/+$/, '');

      const transaction = await Transaction.create({
        merchant_id: sub.merchant_id,
        order_id: orderId,
        amount: sub.amount,
        sender_note: sub.plan_name + ' - Subscription',
        callback_url: baseUrl + '/api/webhooks/paytm',
        status: 'PENDING',
        subscription_id: sub.id,
      });

      const subPayment = await SubscriptionPayment.create({
        subscription_id: sub.id,
        transaction_id: transaction.id,
        amount: sub.amount,
        status: 'PENDING',
        billing_date: today,
        attempt_count: 1,
      });

      await initiateTransaction({
        merchant,
        orderId,
        amount: sub.amount,
        callbackUrl: baseUrl + '/api/webhooks/paytm',
      });

      const nextBilling = updateNextBilling(sub);
      await sub.update({ next_billing: nextBilling, retry_count: 0 });

      triggerMerchantWebhooks(sub.merchant_id, 'subscription.payment_initiated', {
        event: 'subscription.payment_initiated',
        subscription_id: sub.id,
        plan_name: sub.plan_name,
        amount: sub.amount,
        order_id: orderId,
        billing_date: today,
      }).catch(() => {});

    } catch (err) {
      console.error('[SUBSCRIPTION] Failed to process payment for sub', sub.id, err.message);
      await sub.update({ retry_count: (sub.retry_count || 0) + 1 });

      if ((sub.retry_count || 0) + 1 >= (sub.max_retries || 3)) {
        await sub.update({ status: 'PAUSED' });
        triggerMerchantWebhooks(sub.merchant_id, 'subscription.payment_failed', {
          event: 'subscription.payment_failed',
          subscription_id: sub.id, plan_name: sub.plan_name, amount: sub.amount,
        }).catch(() => {});
      }
    }
  }

  return dueSubscriptions.length;
};

export const handleRetries = async () => {
  const failedPayments = await SubscriptionPayment.findAll({
    where: {
      status: { [Op.in]: ['FAILED', 'RETRYING'] },
      next_retry: { [Op.lte]: new Date() },
    },
    include: [{ model: Subscription, as: 'subscription', where: { status: 'ACTIVE' } }],
  });

  for (const payment of failedPayments) {
    const sub = payment.subscription;
    if (payment.attempt_count >= (sub.max_retries || 3)) {
      await payment.update({ status: 'FAILED' });
      continue;
    }

    try {
      const merchant = await Merchant.findByPk(sub.merchant_id, {
        attributes: { exclude: ['password'] },
      });

      if (!merchant || !merchant.paytm_configured) continue;

      const orderId = 'ORD' + uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase();
      const baseUrl = (process.env.CALLBACK_BASE_URL || '').replace(/\/+$/, '');

      const transaction = await Transaction.create({
        merchant_id: sub.merchant_id,
        order_id: orderId,
        amount: sub.amount,
        sender_note: sub.plan_name + ' - Retry',
        callback_url: baseUrl + '/api/webhooks/paytm',
        status: 'PENDING',
        subscription_id: sub.id,
      });

      await initiateTransaction({
        merchant,
        orderId,
        amount: sub.amount,
        callbackUrl: baseUrl + '/api/webhooks/paytm',
      });

      const nextRetry = new Date(Date.now() + payment.attempt_count * 60 * 60 * 1000);
      await payment.update({
        status: 'RETRYING',
        transaction_id: transaction.id,
        attempt_count: payment.attempt_count + 1,
        next_retry: nextRetry,
      });
    } catch (err) {
      console.error('[SUBSCRIPTION RETRY]', sub.id, err.message);
    }
  }

  return failedPayments.length;
};
