import { SplitRule, SplitTransaction, Transaction } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * POST /api/splits/rules
 */
export const createSplitRule = async (req, res, next) => {
  try {
    const { name, split_type, recipients } = req.body;

    // Validate recipients
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return errorResponse(res, 400, 'At least one recipient is required.');
    }

    if (split_type === 'percentage') {
      const totalShare = recipients.reduce((sum, r) => sum + (r.share || 0), 0);
      if (totalShare > 100) {
        return errorResponse(res, 400, 'Total percentage share cannot exceed 100%.');
      }
    }

    const rule = await SplitRule.create({
      merchant_id: req.merchant.id,
      name,
      split_type,
      recipients,
    });

    return successResponse(res, 201, 'Split rule created.', { split_rule: rule });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/splits/rules
 */
export const listSplitRules = async (req, res, next) => {
  try {
    const rules = await SplitRule.findAll({
      where: { merchant_id: req.merchant.id },
      order: [['created_at', 'DESC']],
    });

    return successResponse(res, 200, 'Split rules retrieved.', { split_rules: rules });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/splits/rules/:id
 */
export const updateSplitRule = async (req, res, next) => {
  try {
    const rule = await SplitRule.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!rule) return errorResponse(res, 404, 'Split rule not found.');

    const { name, split_type, recipients, is_active } = req.body;

    if (split_type === 'percentage' && recipients) {
      const totalShare = recipients.reduce((sum, r) => sum + (r.share || 0), 0);
      if (totalShare > 100) {
        return errorResponse(res, 400, 'Total percentage share cannot exceed 100%.');
      }
    }

    await rule.update({
      ...(name !== undefined && { name }),
      ...(split_type !== undefined && { split_type }),
      ...(recipients !== undefined && { recipients }),
      ...(is_active !== undefined && { is_active }),
    });

    return successResponse(res, 200, 'Split rule updated.', { split_rule: rule });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/splits/rules/:id
 */
export const deleteSplitRule = async (req, res, next) => {
  try {
    const rule = await SplitRule.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!rule) return errorResponse(res, 404, 'Split rule not found.');

    await rule.update({ is_active: false });
    return successResponse(res, 200, 'Split rule deactivated.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/splits/transactions
 */
export const listSplitTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const rules = await SplitRule.findAll({
      where: { merchant_id: req.merchant.id },
      attributes: ['id'],
      raw: true,
    });

    const ruleIds = rules.map(r => r.id);

    const { count, rows } = await SplitTransaction.findAndCountAll({
      where: { split_rule_id: ruleIds },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        { model: Transaction, as: 'transaction', attributes: ['order_id', 'amount', 'status'] },
        { model: SplitRule, as: 'splitRule', attributes: ['name', 'split_type'] },
      ],
    });

    return successResponse(res, 200, 'Split transactions retrieved.', {
      split_transactions: rows,
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
 * GET /api/splits/transactions/:id
 */
export const getSplitTransaction = async (req, res, next) => {
  try {
    const splitTxn = await SplitTransaction.findByPk(req.params.id, {
      include: [
        { model: Transaction, as: 'transaction', attributes: ['order_id', 'amount', 'status'] },
        { model: SplitRule, as: 'splitRule', attributes: ['name', 'split_type', 'recipients'] },
      ],
    });

    if (!splitTxn) return errorResponse(res, 404, 'Split transaction not found.');
    return successResponse(res, 200, 'Split transaction retrieved.', { split_transaction: splitTxn });
  } catch (err) {
    next(err);
  }
};
