import { Op } from 'sequelize';
import { Subscription, SubscriptionPayment } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { updateNextBilling } from '../services/subscription.service.js';

/**
 * POST /api/subscriptions
 */
export const createSubscription = async (req, res, next) => {
  try {
    const { plan_name, description, amount, currency, interval, interval_count,
            customer_name, customer_email, customer_phone, start_date, end_date, max_retries, metadata } = req.body;

    const startDt = start_date || new Date().toISOString().split('T')[0];

    const sub = await Subscription.create({
      merchant_id: req.merchant.id,
      plan_name,
      description,
      amount,
      currency: currency || 'INR',
      interval,
      interval_count: interval_count || 1,
      customer_name,
      customer_email,
      customer_phone,
      start_date: startDt,
      end_date: end_date || null,
      next_billing: startDt,
      max_retries: max_retries || 3,
      metadata: metadata || {},
    });

    return successResponse(res, 201, 'Subscription created.', { subscription: sub });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/subscriptions
 */
export const listSubscriptions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { merchant_id: req.merchant.id };
    if (status) where.status = status;

    const { count, rows } = await Subscription.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return successResponse(res, 200, 'Subscriptions retrieved.', {
      subscriptions: rows,
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
 * GET /api/subscriptions/:id
 */
export const getSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
      include: [{ model: SubscriptionPayment, as: 'payments', limit: 10, order: [['created_at', 'DESC']] }],
    });

    if (!sub) return errorResponse(res, 404, 'Subscription not found.');
    return successResponse(res, 200, 'Subscription retrieved.', { subscription: sub });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/subscriptions/:id
 */
export const updateSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!sub) return errorResponse(res, 404, 'Subscription not found.');

    const { plan_name, description, amount, interval, interval_count, end_date, max_retries, metadata } = req.body;

    await sub.update({
      ...(plan_name !== undefined && { plan_name }),
      ...(description !== undefined && { description }),
      ...(amount !== undefined && { amount }),
      ...(interval !== undefined && { interval }),
      ...(interval_count !== undefined && { interval_count }),
      ...(end_date !== undefined && { end_date }),
      ...(max_retries !== undefined && { max_retries }),
      ...(metadata !== undefined && { metadata }),
    });

    return successResponse(res, 200, 'Subscription updated.', { subscription: sub });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/subscriptions/:id/pause
 */
export const pauseSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id, status: 'ACTIVE' },
    });

    if (!sub) return errorResponse(res, 404, 'Active subscription not found.');

    await sub.update({ status: 'PAUSED' });
    return successResponse(res, 200, 'Subscription paused.', { subscription: sub });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/subscriptions/:id/resume
 */
export const resumeSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id, status: 'PAUSED' },
    });

    if (!sub) return errorResponse(res, 404, 'Paused subscription not found.');

    await sub.update({ status: 'ACTIVE' });
    return successResponse(res, 200, 'Subscription resumed.', { subscription: sub });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/subscriptions/:id/cancel
 */
export const cancelSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!sub) return errorResponse(res, 404, 'Subscription not found.');
    if (sub.status === 'CANCELLED') return errorResponse(res, 400, 'Subscription already cancelled.');

    await sub.update({ status: 'CANCELLED' });
    return successResponse(res, 200, 'Subscription cancelled.', { subscription: sub });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/subscriptions/:id/payments
 */
export const getSubscriptionPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const sub = await Subscription.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!sub) return errorResponse(res, 404, 'Subscription not found.');

    const { count, rows } = await SubscriptionPayment.findAndCountAll({
      where: { subscription_id: sub.id },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return successResponse(res, 200, 'Subscription payments retrieved.', {
      payments: rows,
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
