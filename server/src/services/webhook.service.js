import crypto from 'crypto';
import axios from 'axios';
import { Webhook } from '../models/pg/index.js';
import WebhookLog from '../models/mongo/WebhookLog.js';

export const deliverWebhook = async (webhookId, event, payload) => {
  const webhook = await Webhook.findByPk(webhookId);
  if (!webhook || !webhook.is_active) return null;

  // Check if webhook is subscribed to this event
  if (!webhook.events.includes(event)) return null;

  const signature = crypto
    .createHmac('sha256', webhook.secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  const startTime = Date.now();

  try {
    const response = await axios.post(webhook.url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': event,
        'X-Webhook-Id': webhookId,
      },
      timeout: 10000,
    });

    await WebhookLog.create({
      webhook_id: webhookId,
      merchant_id: webhook.merchant_id,
      event,
      url: webhook.url,
      request_body: payload,
      response_status: response.status,
      response_body: response.data,
      duration_ms: Date.now() - startTime,
      status: 'delivered',
    });

    return { success: true, status: response.status };
  } catch (err) {
    await WebhookLog.create({
      webhook_id: webhookId,
      merchant_id: webhook.merchant_id,
      event,
      url: webhook.url,
      request_body: payload,
      response_status: err.response?.status || 0,
      response_body: err.response?.data || { error: err.message },
      duration_ms: Date.now() - startTime,
      status: 'failed',
      error_message: err.message,
    });

    return { success: false, error: err.message };
  }
};

export const retryFailedWebhooks = async () => {
  const failedLogs = await WebhookLog.find({
    status: 'failed',
    retry_count: { $lt: 5 },
    created_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  }).limit(50);

  for (const log of failedLogs) {
    const webhook = await Webhook.findByPk(log.webhook_id);
    if (!webhook || !webhook.is_active) continue;

    const result = await deliverWebhook(webhook.id, log.event, log.request_body);

    await WebhookLog.findByIdAndUpdate(log._id, {
      $inc: { retry_count: 1 },
      $set: {
        last_retry: new Date(),
        ...(result?.success ? { status: 'delivered' } : {}),
      },
    });
  }
};
