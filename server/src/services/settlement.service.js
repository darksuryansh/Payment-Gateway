import { Op, fn, col } from 'sequelize';
import { Settlement, Transaction } from '../models/pg/index.js';
import { triggerMerchantWebhooks } from './webhook.service.js';

/**
 * Aggregate completed transactions from the previous day into settlement records.
 * Called nightly by the cron job.
 * Zero-fee UPI gateway: fees are always 0. Net amount = full amount.
 */
export const createDailySettlements = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];

  // Get all merchants who had completed transactions yesterday
  const merchantGroups = await Transaction.findAll({
    where: {
      status: 'COMPLETED',
      txn_date: {
        [Op.gte]: new Date(dateStr + 'T00:00:00.000Z'),
        [Op.lt]:  new Date(dateStr + 'T23:59:59.999Z'),
      },
    },
    attributes: [
      'merchant_id',
      [fn('SUM', col('amount')), 'total_amount'],
      [fn('SUM', col('fees')), 'total_fees'],
      [fn('SUM', col('settle_amount')), 'net_amount'],
      [fn('COUNT', col('id')), 'transaction_count'],
    ],
    group: ['merchant_id'],
    raw: true,
  });

  let created = 0;
  for (const group of merchantGroups) {
    // Avoid duplicate settlements for the same day + merchant
    const existing = await Settlement.findOne({
      where: { merchant_id: group.merchant_id, settlement_date: dateStr },
    });
    if (existing) continue;

    const netAmount = parseFloat(group.net_amount) || parseFloat(group.total_amount);
    const settlement = await Settlement.create({
      merchant_id: group.merchant_id,
      amount: parseFloat(group.total_amount),
      fees: parseFloat(group.total_fees) || 0,
      net_amount: netAmount,
      transaction_count: parseInt(group.transaction_count),
      settlement_date: dateStr,
      status: 'PENDING',
    });

    // Trigger webhook for settlement
    triggerMerchantWebhooks(group.merchant_id, 'settlement.created', {
      event: 'settlement.created',
      settlement_id: settlement.id,
      amount: settlement.amount,
      net_amount: settlement.net_amount,
      transaction_count: settlement.transaction_count,
      settlement_date: dateStr,
    }).catch(() => {});

    created++;
  }

  return created;
};

/**
 * Mark pending settlements as PROCESSED after 2 business days (T+2).
 */
export const processSettlements = async () => {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const cutoff = twoDaysAgo.toISOString().split('T')[0];

  const pending = await Settlement.findAll({
    where: {
      status: 'PENDING',
      settlement_date: { [Op.lte]: cutoff },
    },
  });

  for (const settlement of pending) {
    await settlement.update({ status: 'PROCESSED' });

    triggerMerchantWebhooks(settlement.merchant_id, 'settlement.processed', {
      event: 'settlement.processed',
      settlement_id: settlement.id,
      net_amount: settlement.net_amount,
      settlement_date: settlement.settlement_date,
    }).catch(() => {});
  }

  return pending.length;
};

/**
 * Aggregate settlements for a merchant grouped by period (daily/weekly/monthly).
 */
export const aggregateSettlements = async (merchantId, period = 'daily') => {
  const groupFormats = {
    daily:   fn('DATE_TRUNC', 'day',   col('settlement_date')),
    weekly:  fn('DATE_TRUNC', 'week',  col('settlement_date')),
    monthly: fn('DATE_TRUNC', 'month', col('settlement_date')),
  };

  const truncFn = groupFormats[period] || groupFormats.daily;

  const rows = await Settlement.findAll({
    where: { merchant_id: merchantId },
    attributes: [
      [truncFn, 'period'],
      [fn('SUM', col('amount')),            'total_amount'],
      [fn('SUM', col('fees')),              'total_fees'],
      [fn('SUM', col('net_amount')),        'net_amount'],
      [fn('SUM', col('transaction_count')), 'transaction_count'],
      [fn('COUNT', col('id')),              'settlement_count'],
    ],
    group: [truncFn],
    order: [[truncFn, 'DESC']],
    raw: true,
  });

  return rows;
};

/**
 * Return a high-level summary (totals) for a merchant within an optional date range.
 */
export const getSettlementSummary = async (merchantId, from, to) => {
  const where = { merchant_id: merchantId };
  if (from || to) {
    where.settlement_date = {};
    if (from) where.settlement_date[Op.gte] = new Date(from);
    if (to)   where.settlement_date[Op.lte] = new Date(to);
  }

  const [totals, byStatus] = await Promise.all([
    Settlement.findOne({
      where,
      attributes: [
        [fn('SUM', col('amount')),            'total_amount'],
        [fn('SUM', col('fees')),              'total_fees'],
        [fn('SUM', col('net_amount')),        'net_amount'],
        [fn('SUM', col('transaction_count')), 'transaction_count'],
        [fn('COUNT', col('id')),              'settlement_count'],
      ],
      raw: true,
    }),
    Settlement.findAll({
      where,
      attributes: [
        'status',
        [fn('COUNT', col('id')),         'count'],
        [fn('SUM', col('net_amount')),   'net_amount'],
      ],
      group: ['status'],
      raw: true,
    }),
  ]);

  return { totals, byStatus };
};
