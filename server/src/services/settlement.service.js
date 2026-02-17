import { Op, fn, col, literal } from 'sequelize';
import { Settlement, Transaction } from '../models/pg/index.js';

export const aggregateSettlements = async (merchantId, period = 'daily') => {
  const groupBy = {
    daily: fn('DATE', col('created_at')),
    weekly: fn('DATE_TRUNC', 'week', col('created_at')),
    monthly: fn('DATE_TRUNC', 'month', col('created_at')),
  };

  const results = await Transaction.findAll({
    where: {
      merchant_id: merchantId,
      status: 'COMPLETED',
    },
    attributes: [
      [groupBy[period] || groupBy.daily, 'period'],
      [fn('SUM', col('amount')), 'total_amount'],
      [fn('SUM', col('fees')), 'total_fees'],
      [fn('SUM', col('settle_amount')), 'net_amount'],
      [fn('COUNT', col('id')), 'transaction_count'],
    ],
    group: ['period'],
    order: [[literal('period'), 'DESC']],
    raw: true,
  });

  return results;
};

export const getSettlementSummary = async (merchantId, from, to) => {
  const dateFilter = {};
  if (from) dateFilter[Op.gte] = new Date(from);
  if (to) dateFilter[Op.lte] = new Date(to);

  const results = await Settlement.findAll({
    where: {
      merchant_id: merchantId,
      ...(from || to ? { settlement_date: dateFilter } : {}),
    },
    attributes: [
      'status',
      [fn('SUM', col('total_amount')), 'total_amount'],
      [fn('SUM', col('fees')), 'total_fees'],
      [fn('SUM', col('net_amount')), 'total_net'],
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['status'],
    raw: true,
  });

  return results;
};
