import crypto from 'crypto';
import { Webhook } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { deliverWebhook } from '../services/webhook.service.js';
import WebhookLog from '../models/mongo/WebhookLog.js';

/**
 * POST /api/webhooks
 */
export const createWebhook = async (req, res, next) => {
  try {
    const { url, events } = req.body;
    const merchantId = req.merchant.id;

    const secret = crypto.randomBytes(32).toString('hex');

    const webhook = await Webhook.create({
      merchant_id: merchantId,
      url,
      events: events || ['payment.success', 'payment.failed'],
      secret,
    });

    return successResponse(res, 201, 'Webhook registered successfully.', {
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        secret: webhook.secret,
        is_active: webhook.is_active,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/webhooks
 */
export const listWebhooks = async (req, res, next) => {
  try {
    const webhooks = await Webhook.findAll({
      where: { merchant_id: req.merchant.id },
      attributes: { exclude: ['secret'] },
    });

    return successResponse(res, 200, 'Webhooks retrieved.', { webhooks });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/webhooks/:id
 */
export const updateWebhook = async (req, res, next) => {
  try {
    const webhook = await Webhook.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!webhook) return errorResponse(res, 404, 'Webhook not found.');

    const { url, events, is_active } = req.body;

    await webhook.update({
      ...(url !== undefined && { url }),
      ...(events !== undefined && { events }),
      ...(is_active !== undefined && { is_active }),
    });

    return successResponse(res, 200, 'Webhook updated.', {
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        is_active: webhook.is_active,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/webhooks/:id
 */
export const deleteWebhook = async (req, res, next) => {
  try {
    const webhook = await Webhook.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!webhook) return errorResponse(res, 404, 'Webhook not found.');

    await webhook.destroy();
    return successResponse(res, 200, 'Webhook deleted successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/webhooks/:id/logs
 */
export const getWebhookLogs = async (req, res, next) => {
  try {
    const webhook = await Webhook.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!webhook) return errorResponse(res, 404, 'Webhook not found.');

    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await WebhookLog.find({ webhook_id: webhook.id })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WebhookLog.countDocuments({ webhook_id: webhook.id });

    return successResponse(res, 200, 'Webhook logs retrieved.', {
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/webhooks/:id/test
 */
export const testWebhook = async (req, res, next) => {
  try {
    const webhook = await Webhook.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!webhook) return errorResponse(res, 404, 'Webhook not found.');

    const testPayload = {
      event: 'test',
      data: {
        message: 'This is a test webhook delivery.',
        timestamp: new Date().toISOString(),
        merchant_id: req.merchant.id,
      },
    };

    const result = await deliverWebhook(webhook.id, 'test', testPayload);

    return successResponse(res, 200, 'Test webhook sent.', { result });
  } catch (err) {
    next(err);
  }
};
