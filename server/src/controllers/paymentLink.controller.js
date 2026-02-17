import { Op } from 'sequelize';
import { PaymentLink } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generateShortCode } from '../services/paymentLink.service.js';

/**
 * POST /api/payment-links
 */
export const createPaymentLink = async (req, res, next) => {
  try {
    const { amount, description, title, customer_name, customer_email, customer_phone,
            redirect_url, expires_at, is_partial, min_amount, metadata } = req.body;

    const short_url = generateShortCode();

    const link = await PaymentLink.create({
      merchant_id: req.merchant.id,
      amount,
      description,
      title,
      customer_name,
      customer_email,
      customer_phone,
      redirect_url,
      short_url,
      expires_at: expires_at || null,
      is_partial: is_partial || false,
      min_amount: min_amount || null,
      metadata: metadata || {},
    });

    return successResponse(res, 201, 'Payment link created.', {
      payment_link: link,
      payment_url: `${process.env.CALLBACK_BASE_URL}/pay/link/${short_url}`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payment-links
 */
export const listPaymentLinks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { merchant_id: req.merchant.id };
    if (status) where.status = status;

    const { count, rows } = await PaymentLink.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    return successResponse(res, 200, 'Payment links retrieved.', {
      payment_links: rows,
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
 * GET /api/payment-links/:id
 */
export const getPaymentLink = async (req, res, next) => {
  try {
    const link = await PaymentLink.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!link) return errorResponse(res, 404, 'Payment link not found.');
    return successResponse(res, 200, 'Payment link retrieved.', { payment_link: link });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/payment-links/:id
 */
export const updatePaymentLink = async (req, res, next) => {
  try {
    const link = await PaymentLink.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!link) return errorResponse(res, 404, 'Payment link not found.');

    const { amount, description, title, expires_at, is_partial, min_amount } = req.body;

    await link.update({
      ...(amount !== undefined && { amount }),
      ...(description !== undefined && { description }),
      ...(title !== undefined && { title }),
      ...(expires_at !== undefined && { expires_at }),
      ...(is_partial !== undefined && { is_partial }),
      ...(min_amount !== undefined && { min_amount }),
    });

    return successResponse(res, 200, 'Payment link updated.', { payment_link: link });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/payment-links/:id
 */
export const deletePaymentLink = async (req, res, next) => {
  try {
    const link = await PaymentLink.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!link) return errorResponse(res, 404, 'Payment link not found.');

    await link.update({ status: 'EXPIRED' });
    return successResponse(res, 200, 'Payment link deactivated.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /pay/link/:shortCode — Public endpoint
 */
export const resolvePaymentLink = async (req, res, next) => {
  try {
    const link = await PaymentLink.findOne({
      where: { short_url: req.params.shortCode, status: 'ACTIVE' },
    });

    if (!link) return errorResponse(res, 404, 'Payment link not found or expired.');

    // Check expiry
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      await link.update({ status: 'EXPIRED' });
      return errorResponse(res, 410, 'Payment link has expired.');
    }

    return successResponse(res, 200, 'Payment link resolved.', {
      payment_link: {
        id: link.id,
        title: link.title,
        description: link.description,
        amount: link.amount,
        is_partial: link.is_partial,
        min_amount: link.min_amount,
      },
    });
  } catch (err) {
    next(err);
  }
};
