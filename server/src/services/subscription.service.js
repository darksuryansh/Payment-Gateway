import { Op } from 'sequelize';
import { Subscription, SubscriptionPayment } from '../models/pg/index.js';

export const updateNextBilling = (subscription) => {
  const current = new Date(subscription.next_billing);
  const count = subscription.interval_count || 1;

  switch (subscription.interval) {
    case 'daily':
      current.setDate(current.getDate() + count);
      break;
    case 'weekly':
      current.setDate(current.getDate() + (7 * count));
      break;
    case 'monthly':
      current.setMonth(current.getMonth() + count);
      break;
    case 'yearly':
      current.setFullYear(current.getFullYear() + count);
      break;
  }

  return current.toISOString().split('T')[0];
};

export const processRecurringPayments = async () => {
  const today = new Date().toISOString().split('T')[0];

  const dueSubscriptions = await Subscription.findAll({
    where: {
      status: 'ACTIVE',
      next_billing: { [Op.lte]: today },
    },
  });

  for (const sub of dueSubscriptions) {
    // Check if end_date has passed
    if (sub.end_date && sub.end_date < today) {
      await sub.update({ status: 'EXPIRED' });
      continue;
    }

    // Create a pending subscription payment
    await SubscriptionPayment.create({
      subscription_id: sub.id,
      amount: sub.amount,
      status: 'PENDING',
      billing_date: today,
    });

    // Update next billing date
    const nextBilling = updateNextBilling(sub);
    await sub.update({ next_billing: nextBilling, retry_count: 0 });
  }

  return dueSubscriptions.length;
};

export const handleRetries = async () => {
  const failedPayments = await SubscriptionPayment.findAll({
    where: {
      status: { [Op.in]: ['FAILED', 'RETRYING'] },
      next_retry: { [Op.lte]: new Date() },
    },
    include: [{
      model: Subscription,
      as: 'subscription',
      where: { status: 'ACTIVE' },
    }],
  });

  for (const payment of failedPayments) {
    const sub = payment.subscription;

    if (payment.attempt_count >= sub.max_retries) {
      await payment.update({ status: 'FAILED' });
      continue;
    }

    // Mark as retrying with incremented attempt count
    const nextRetry = new Date(Date.now() + payment.attempt_count * 60 * 60 * 1000); // exponential backoff in hours
    await payment.update({
      status: 'RETRYING',
      attempt_count: payment.attempt_count + 1,
      next_retry: nextRetry,
    });
  }

  return failedPayments.length;
};
