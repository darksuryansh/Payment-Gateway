import { successResponse } from '../utils/apiResponse.js';
import {
  getRevenueByPeriod,
  getSuccessRate,
  getPeakHours,
  getPaymentModeBreakdown,
  getTopCustomers,
} from '../services/analytics.service.js';

/**
 * GET /api/analytics/revenue
 */
export const revenue = async (req, res, next) => {
  try {
    const { group_by = 'day', from, to } = req.query;
    const data = await getRevenueByPeriod(req.merchant.id, group_by, from, to);
    return successResponse(res, 200, 'Revenue analytics retrieved.', { revenue: data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/analytics/success-rate
 */
export const successRate = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await getSuccessRate(req.merchant.id, from, to);
    return successResponse(res, 200, 'Success rate analytics retrieved.', data);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/analytics/peak-hours
 */
export const peakHours = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await getPeakHours(req.merchant.id, from, to);
    return successResponse(res, 200, 'Peak hours analytics retrieved.', { peak_hours: data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/analytics/payment-modes
 */
export const paymentModes = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const data = await getPaymentModeBreakdown(req.merchant.id, from, to);
    return successResponse(res, 200, 'Payment mode breakdown retrieved.', { payment_modes: data });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/analytics/customers
 */
export const customers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const data = await getTopCustomers(req.merchant.id, parseInt(limit));
    return successResponse(res, 200, 'Top customers retrieved.', { customers: data });
  } catch (err) {
    next(err);
  }
};
