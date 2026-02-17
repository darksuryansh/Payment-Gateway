import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Refund, Transaction } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * POST /api/refunds
 */
export const initiateRefund = async (req, res, next) => {
  try {
    const { transaction_id, amount, reason } = req.body;

    const transaction = await Transaction.findOne({
      where: { id: transaction_id, merchant_id: req.merchant.id, status: 'COMPLETED' },
    });

    if (!transaction) {
      return errorResponse(res, 404, 'Completed transaction not found.');
    }

    // Calculate total already refunded
    const existingRefunds = await Refund.sum('amount', {
      where: {
        transaction_id,
        status: { [Op.in]: ['PENDING', 'PROCESSED'] },
      },
    });

    const refundableAmount = parseFloat(transaction.amount) - (existingRefunds || 0);
    const refundAmount = amount || parseFloat(transaction.amount);

    if (refundAmount > refundableAmount) {
      return errorResponse(res, 400, `Maximum refundable amount is ${refundableAmount}.`);
    }

    const refund = await Refund.create({
      transaction_id,
      merchant_id: req.merchant.id,
      amount: refundAmount,
      reason,
      refund_id: `RFD${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`,
    });

    return successResponse(res, 201, 'Refund initiated.', { refund });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/refunds
 */
export const listRefunds = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, date_from, date_to } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { merchant_id: req.merchant.id };
    if (status) where.status = status;
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) where.created_at[Op.lte] = new Date(date_to);
    }

    const { count, rows } = await Refund.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [{ model: Transaction, as: 'transaction', attributes: ['order_id', 'amount', 'status'] }],
    });

    return successResponse(res, 200, 'Refunds retrieved.', {
      refunds: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/refunds/:id
 */
export const getRefund = async (req, res, next) => {
  try {
    const refund = await Refund.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
      include: [{ model: Transaction, as: 'transaction', attributes: ['order_id', 'amount', 'status', 'sender_vpa'] }],
    });

    if (!refund) return errorResponse(res, 404, 'Refund not found.');
    return successResponse(res, 200, 'Refund retrieved.', { refund });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/refunds/:id/status
 */
export const getRefundStatus = async (req, res, next) => {
  try {
    const refund = await Refund.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
      attributes: ['id', 'refund_id', 'amount', 'status', 'created_at', 'updated_at'],
    });

    if (!refund) return errorResponse(res, 404, 'Refund not found.');
    return successResponse(res, 200, 'Refund status retrieved.', { refund });
  } catch (err) {
    next(err);
  }
};
