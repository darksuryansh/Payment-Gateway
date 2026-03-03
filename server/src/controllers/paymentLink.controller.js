import { Op } from 'sequelize';
import { PaymentLink, Merchant, Transaction } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generateShortCode } from '../services/paymentLink.service.js';
import { initiateTransaction } from '../services/paytm.service.js';
import { generateTier1PaymentData } from '../services/tier1Payment.service.js';
import { v4 as uuidv4 } from 'uuid';

export const createPaymentLink = async (req, res, next) => {
  try {
    const { amount, description, title, customer_name, customer_email, customer_phone,
            redirect_url, expires_at, is_partial, min_amount, metadata } = req.body;
    const short_url = generateShortCode();
    const link = await PaymentLink.create({
      merchant_id: req.merchant.id, amount, description, title, customer_name,
      customer_email, customer_phone, redirect_url, short_url,
      expires_at: expires_at || null, is_partial: is_partial || false,
      min_amount: min_amount || null, metadata: metadata || {},
    });
    return successResponse(res, 201, 'Payment link created.', {
      payment_link: link,
      payment_url: process.env.CALLBACK_BASE_URL + '/pay/link/' + short_url,
    });
  } catch (err) { next(err); }
};

export const listPaymentLinks = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { merchant_id: req.merchant.id };
    if (status) where.status = status;
    const { count, rows } = await PaymentLink.findAndCountAll({
      where, order: [['created_at', 'DESC']], limit: parseInt(limit), offset,
    });
    return successResponse(res, 200, 'Payment links retrieved.', {
      payment_links: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), total_pages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (err) { next(err); }
};

export const getPaymentLink = async (req, res, next) => {
  try {
    const link = await PaymentLink.findOne({ where: { id: req.params.id, merchant_id: req.merchant.id } });
    if (!link) return errorResponse(res, 404, 'Payment link not found.');
    return successResponse(res, 200, 'Payment link retrieved.', { payment_link: link });
  } catch (err) { next(err); }
};

export const updatePaymentLink = async (req, res, next) => {
  try {
    const link = await PaymentLink.findOne({ where: { id: req.params.id, merchant_id: req.merchant.id } });
    if (!link) return errorResponse(res, 404, 'Payment link not found.');
    const { amount, description, title, expires_at, is_partial, min_amount } = req.body;
    await link.update({
      ...(amount !== undefined && { amount }), ...(description !== undefined && { description }),
      ...(title !== undefined && { title }), ...(expires_at !== undefined && { expires_at }),
      ...(is_partial !== undefined && { is_partial }), ...(min_amount !== undefined && { min_amount }),
    });
    return successResponse(res, 200, 'Payment link updated.', { payment_link: link });
  } catch (err) { next(err); }
};

export const deletePaymentLink = async (req, res, next) => {
  try {
    const link = await PaymentLink.findOne({ where: { id: req.params.id, merchant_id: req.merchant.id } });
    if (!link) return errorResponse(res, 404, 'Payment link not found.');
    await link.update({ status: 'EXPIRED' });
    return successResponse(res, 200, 'Payment link deactivated.');
  } catch (err) { next(err); }
};

/** GET /pay/link/:shortCode — Public: render EJS checkout page */
export const renderPaymentLinkPage = async (req, res, next) => {
  try {
    const link = await PaymentLink.findOne({
      where: { short_url: req.params.shortCode },
      include: [{ model: Merchant, as: 'merchant', attributes: ['business_name', 'logo_url', 'merchant_tier'] }],
    });
    if (!link) {
      return res.status(404).render('payment-failed', { title: 'Link Not Found', message: 'This payment link does not exist.' });
    }
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      await link.update({ status: 'EXPIRED' });
      return res.status(410).render('payment-failed', { title: 'Link Expired', message: 'This payment link has expired.' });
    }
    if (link.status !== 'ACTIVE') {
      return res.status(410).render('payment-failed', {
        title: 'Link Unavailable', message: 'This payment link is ' + link.status.toLowerCase() + '.',
      });
    }
    res.render('link-checkout', { link, merchant: link.merchant, merchantTier: link.merchant.merchant_tier || 'tier_1', baseUrl: (process.env.CALLBACK_BASE_URL || '').replace(/\/+$/, '') });
  } catch (err) { next(err); }
};

/** POST /pay/link/:shortCode/initiate — Public: initiate payment from link checkout page */
export const initiatePaymentLinkPayment = async (req, res, next) => {
  try {
    const link = await PaymentLink.findOne({ where: { short_url: req.params.shortCode, status: 'ACTIVE' } });
    if (!link) return errorResponse(res, 404, 'Payment link not found or expired.');
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      await link.update({ status: 'EXPIRED' });
      return errorResponse(res, 410, 'This payment link has expired.');
    }

    // Fetch merchant with Paytm credentials
    const merchant = await Merchant.findByPk(link.merchant_id, {
      attributes: { exclude: ['password'] },
    });

    const isTier1 = merchant.merchant_tier === 'tier_1';

    if (!isTier1 && (!merchant.paytm_configured || !merchant.paytm_mid || !merchant.paytm_merchant_key)) {
      return errorResponse(res, 400, 'Merchant has not configured Paytm payments.');
    }

    const amount = link.is_partial ? req.body.amount : link.amount;
    if (!amount) return errorResponse(res, 400, 'Amount is required.');
    if (link.is_partial && link.min_amount && parseFloat(amount) < parseFloat(link.min_amount)) {
      return errorResponse(res, 400, 'Minimum amount is Rs.' + link.min_amount + '.');
    }

    const orderId = 'ORD' + uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase();
    const baseUrl = (process.env.CALLBACK_BASE_URL || '').replace(/\/+$/, '');

    const transaction = await Transaction.create({
      merchant_id: link.merchant_id, order_id: orderId, amount,
      sender_note: link.title || link.description || 'Payment Link',
      callback_url: isTier1 ? null : baseUrl + '/api/webhooks/paytm',
      status: isTier1 ? 'PENDING_VERIFICATION' : 'PENDING',
    });

    if (isTier1) {
      const tier1Data = await generateTier1PaymentData({ merchant, amount, note: link.title || link.description, orderId });
      return successResponse(res, 201, 'Payment initiated. Scan QR to pay.', {
        order_id: orderId,
        transaction_id: transaction.id,
        tier: 'tier_1',
        ...tier1Data,
      });
    }

    const paytmResponse = await initiateTransaction({
      merchant,
      orderId,
      amount,
      callbackUrl: baseUrl + '/api/webhooks/paytm',
    });

    return successResponse(res, 201, 'Payment initiated.', {
      order_id: orderId,
      transaction_id: transaction.id,
      txn_token: paytmResponse.txnToken,
      payment_url: paytmResponse.paymentUrl,
      mid: paytmResponse.mid,
    });
  } catch (err) { next(err); }
};
