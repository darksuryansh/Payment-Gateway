import crypto from 'crypto';
import { Webhook } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * POST /api/webhooks
 * Register a new webhook URL.
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
 * List all webhooks for the authenticated merchant.
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
 * DELETE /api/webhooks/:id
 * Delete a webhook.
 */
export const deleteWebhook = async (req, res, next) => {
  try {
    const webhook = await Webhook.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!webhook) {
      return errorResponse(res, 404, 'Webhook not found.');
    }

    await webhook.destroy();
    return successResponse(res, 200, 'Webhook deleted successfully.');
  } catch (err) {
    next(err);
  }
};
