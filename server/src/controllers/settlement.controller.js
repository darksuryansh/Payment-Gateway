import { Op } from 'sequelize';
import { Settlement } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { aggregateSettlements, getSettlementSummary } from '../services/settlement.service.js';
import { exportSettlementsCSV } from '../services/export.service.js';

/**
 * GET /api/settlements
 */
export const listSettlements = async (req, res, next) => {
  try {
    const merchantId = req.merchant.id;
    const { page = 1, limit = 20, status, date_from, date_to } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { merchant_id: merchantId };
    if (status) where.status = status;
    if (date_from || date_to) {
      where.settlement_date = {};
      if (date_from) where.settlement_date[Op.gte] = new Date(date_from);
      if (date_to) where.settlement_date[Op.lte] = new Date(date_to);
    }

    const { count, rows } = await Settlement.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return successResponse(res, 200, 'Settlements retrieved.', {
      settlements: rows,
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
 * GET /api/settlements/summary
 */
export const getSummary = async (req, res, next) => {
  try {
    const { period = 'daily', from, to } = req.query;

    const [aggregated, summary] = await Promise.all([
      aggregateSettlements(req.merchant.id, period),
      getSettlementSummary(req.merchant.id, from, to),
    ]);

    return successResponse(res, 200, 'Settlement summary retrieved.', {
      aggregated,
      summary,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/settlements/:id
 */
export const getSettlement = async (req, res, next) => {
  try {
    const settlement = await Settlement.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!settlement) {
      return errorResponse(res, 404, 'Settlement not found.');
    }

    return successResponse(res, 200, 'Settlement retrieved.', { settlement });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/settlements/export
 */
export const exportSettlements = async (req, res, next) => {
  try {
    const { status, date_from, date_to } = req.query;
    const where = { merchant_id: req.merchant.id };
    if (status) where.status = status;
    if (date_from || date_to) {
      where.settlement_date = {};
      if (date_from) where.settlement_date[Op.gte] = new Date(date_from);
      if (date_to) where.settlement_date[Op.lte] = new Date(date_to);
    }

    const settlements = await Settlement.findAll({ where, raw: true });
    const csv = exportSettlementsCSV(settlements);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=settlements.csv');
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};
