import { Op, fn, col, literal } from 'sequelize';
import { Transaction, sequelize } from '../models/pg/index.js';

export const getRevenueByPeriod = async (merchantId, groupBy = 'day', from, to) => {
  const dateFilter = {};
  if (from) dateFilter[Op.gte] = new Date(from);
  if (to) dateFilter[Op.lte] = new Date(to);

  const dateGrouping = {
    day: fn('DATE', col('created_at')),
    week: fn('DATE_TRUNC', 'week', col('created_at')),
    month: fn('DATE_TRUNC', 'month', col('created_at')),
  };

  const results = await Transaction.findAll({
    where: {
      merchant_id: merchantId,
      status: 'COMPLETED',
      ...(from || to ? { created_at: dateFilter } : {}),
    },
    attributes: [
      [dateGrouping[groupBy] || dateGrouping.day, 'period'],
      [fn('SUM', col('amount')), 'total_revenue'],
      [fn('SUM', col('fees')), 'total_fees'],
      [fn('SUM', col('settle_amount')), 'total_settled'],
      [fn('COUNT', col('id')), 'transaction_count'],
    ],
    group: ['period'],
    order: [[literal('period'), 'ASC']],
    raw: true,
  });

  return results;
};

export const getSuccessRate = async (merchantId, from, to) => {
  const dateFilter = {};
  if (from) dateFilter[Op.gte] = new Date(from);
  if (to) dateFilter[Op.lte] = new Date(to);

  const results = await Transaction.findAll({
    where: {
      merchant_id: merchantId,
      ...(from || to ? { created_at: dateFilter } : {}),
    },
    attributes: [
      'status',
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['status'],
    raw: true,
  });

  const total = results.reduce((sum, r) => sum + parseInt(r.count), 0);
  const completed = results.find(r => r.status === 'COMPLETED');
  const successCount = completed ? parseInt(completed.count) : 0;

  return {
    total,
    completed: successCount,
    failed: total - successCount,
    success_rate: total > 0 ? ((successCount / total) * 100).toFixed(2) : '0.00',
    breakdown: results,
  };
};

export const getPeakHours = async (merchantId, from, to) => {
  const dateFilter = {};
  if (from) dateFilter[Op.gte] = new Date(from);
  if (to) dateFilter[Op.lte] = new Date(to);

  const results = await Transaction.findAll({
    where: {
      merchant_id: merchantId,
      status: 'COMPLETED',
      ...(from || to ? { created_at: dateFilter } : {}),
    },
    attributes: [
      [fn('EXTRACT', literal("HOUR FROM created_at")), 'hour'],
      [fn('COUNT', col('id')), 'transaction_count'],
      [fn('SUM', col('amount')), 'total_amount'],
    ],
    group: [literal("EXTRACT(HOUR FROM created_at)")],
    order: [[literal('transaction_count'), 'DESC']],
    raw: true,
  });

  return results;
};

export const getPaymentModeBreakdown = async (merchantId, from, to) => {
  const dateFilter = {};
  if (from) dateFilter[Op.gte] = new Date(from);
  if (to) dateFilter[Op.lte] = new Date(to);

  const results = await Transaction.findAll({
    where: {
      merchant_id: merchantId,
      status: 'COMPLETED',
      payment_mode: { [Op.ne]: null },
      ...(from || to ? { created_at: dateFilter } : {}),
    },
    attributes: [
      'payment_mode',
      [fn('COUNT', col('id')), 'count'],
      [fn('SUM', col('amount')), 'total_amount'],
    ],
    group: ['payment_mode'],
    order: [[literal('count'), 'DESC']],
    raw: true,
  });

  return results;
};

export const getTopCustomers = async (merchantId, limit = 10) => {
  const results = await Transaction.findAll({
    where: {
      merchant_id: merchantId,
      status: 'COMPLETED',
      sender_vpa: { [Op.ne]: null },
    },
    attributes: [
      'sender_vpa',
      [fn('COUNT', col('id')), 'transaction_count'],
      [fn('SUM', col('amount')), 'total_amount'],
    ],
    group: ['sender_vpa'],
    order: [[literal('total_amount'), 'DESC']],
    limit,
    raw: true,
  });

  return results;
};
