import { Op, fn, col } from 'sequelize';
import { Transaction, Settlement, Refund, PaymentLink, Webhook } from '../models/pg/index.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * GET /api/dashboard/stats
 */
export const getStats = async (req, res, next) => {
  try {
    const merchantId = req.merchant.id;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [todayTxns, totalRevenue, pendingSettlements, totalTxns] = await Promise.all([
      Transaction.findAll({
        where: {
          merchant_id: merchantId,
          created_at: { [Op.gte]: todayStart },
        },
        attributes: [
          [fn('COUNT', col('id')), 'count'],
          [fn('SUM', col('amount')), 'total_amount'],
          'status',
        ],
        group: ['status'],
        raw: true,
      }),
      Transaction.sum('settle_amount', {
        where: { merchant_id: merchantId, status: 'COMPLETED' },
      }),
      Settlement.sum('net_amount', {
        where: { merchant_id: merchantId, status: 'PENDING' },
      }),
      Transaction.count({ where: { merchant_id: merchantId } }),
    ]);

    const todayCompleted = todayTxns.find(t => t.status === 'COMPLETED');
    const todayTotal = todayTxns.reduce((s, t) => s + parseInt(t.count), 0);

    return successResponse(res, 200, 'Dashboard stats retrieved.', {
      today: {
        transactions: todayTotal,
        revenue: todayCompleted ? parseFloat(todayCompleted.total_amount) || 0 : 0,
        successful: todayCompleted ? parseInt(todayCompleted.count) : 0,
      },
      overall: {
        total_transactions: totalTxns,
        total_revenue: totalRevenue || 0,
        pending_settlements: pendingSettlements || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/revenue-chart
 */
export const getRevenueChart = async (req, res, next) => {
  try {
    const merchantId = req.merchant.id;
    const { period = 'day', from, to } = req.query;

    const dateFilter = {};
    if (from) dateFilter[Op.gte] = new Date(from);
    if (to) dateFilter[Op.lte] = new Date(to);

    const groupFn = {
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
        [groupFn[period] || groupFn.day, 'period'],
        [fn('SUM', col('amount')), 'revenue'],
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['period'],
      order: [['period', 'ASC']],
      raw: true,
    });

    return successResponse(res, 200, 'Revenue chart data retrieved.', { chart: results });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/recent-transactions
 */
export const getRecentTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      where: { merchant_id: req.merchant.id },
      order: [['created_at', 'DESC']],
      limit: 10,
      attributes: { exclude: ['callback_url'] },
    });

    return successResponse(res, 200, 'Recent transactions retrieved.', { transactions });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/quick-stats
 */
export const getQuickStats = async (req, res, next) => {
  try {
    const merchantId = req.merchant.id;

    const [activeLinks, pendingRefunds, activeWebhooks] = await Promise.all([
      PaymentLink.count({ where: { merchant_id: merchantId, status: 'ACTIVE' } }),
      Refund.count({ where: { merchant_id: merchantId, status: 'PENDING' } }),
      Webhook.count({ where: { merchant_id: merchantId, is_active: true } }),
    ]);

    return successResponse(res, 200, 'Quick stats retrieved.', {
      active_payment_links: activeLinks,
      pending_refunds: pendingRefunds,
      active_webhooks: activeWebhooks,
    });
  } catch (err) {
    next(err);
  }
};
