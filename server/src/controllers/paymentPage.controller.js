import { PaymentPage, Merchant } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { initiateTransaction } from '../services/paytm.service.js';
import { generateTier1PaymentData } from '../services/tier1Payment.service.js';
import { Transaction } from '../models/pg/index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/payment-pages
 */
export const createPaymentPage = async (req, res, next) => {
  try {
    const { title, description, slug, logo_url, theme_color, amount, success_url, cancel_url } = req.body;

    const existing = await PaymentPage.findOne({ where: { slug } });
    if (existing) return errorResponse(res, 409, 'Slug already in use.');

    const page = await PaymentPage.create({
      merchant_id: req.merchant.id,
      title,
      description,
      slug,
      logo_url,
      theme_color: theme_color || '#000000',
      amount: amount || null,
      success_url,
      cancel_url,
    });

    return successResponse(res, 201, 'Payment page created.', {
      payment_page: page,
      page_url: `${process.env.CALLBACK_BASE_URL}/pay/${slug}`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payment-pages
 */
export const listPaymentPages = async (req, res, next) => {
  try {
    const pages = await PaymentPage.findAll({
      where: { merchant_id: req.merchant.id },
      order: [['created_at', 'DESC']],
    });

    return successResponse(res, 200, 'Payment pages retrieved.', { payment_pages: pages });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/payment-pages/:id
 */
export const updatePaymentPage = async (req, res, next) => {
  try {
    const page = await PaymentPage.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!page) return errorResponse(res, 404, 'Payment page not found.');

    const { title, description, logo_url, theme_color, amount, success_url, cancel_url, is_active } = req.body;

    await page.update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(logo_url !== undefined && { logo_url }),
      ...(theme_color !== undefined && { theme_color }),
      ...(amount !== undefined && { amount }),
      ...(success_url !== undefined && { success_url }),
      ...(cancel_url !== undefined && { cancel_url }),
      ...(is_active !== undefined && { is_active }),
    });

    return successResponse(res, 200, 'Payment page updated.', { payment_page: page });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/payment-pages/:id
 */
export const deletePaymentPage = async (req, res, next) => {
  try {
    const page = await PaymentPage.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!page) return errorResponse(res, 404, 'Payment page not found.');

    await page.update({ is_active: false });
    return successResponse(res, 200, 'Payment page deactivated.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /pay/:slug — Public: render EJS checkout page
 */
export const renderCheckoutPage = async (req, res, next) => {
  try {
    const page = await PaymentPage.findOne({
      where: { slug: req.params.slug, is_active: true },
      include: [{ model: Merchant, as: 'merchant', attributes: ['business_name', 'logo_url', 'merchant_tier'] }],
    });

    if (!page) {
      return res.status(404).render('payment-failed', {
        title: 'Page Not Found',
        message: 'This payment page does not exist or is no longer active.',
      });
    }

    res.render('checkout', {
      page,
      merchant: page.merchant,
      merchantTier: page.merchant.merchant_tier || 'tier_1',
      baseUrl: process.env.CALLBACK_BASE_URL,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /pay/:slug/initiate — Public: process payment from hosted page
 */
export const initiateHostedPayment = async (req, res, next) => {
  try {
    const page = await PaymentPage.findOne({
      where: { slug: req.params.slug, is_active: true },
    });

    if (!page) return errorResponse(res, 404, 'Payment page not found.');

    // Fetch merchant with Paytm credentials
    const merchant = await Merchant.findByPk(page.merchant_id, {
      attributes: { exclude: ['password'] },
    });

    const isTier1 = merchant.merchant_tier === 'tier_1';

    if (!isTier1 && (!merchant.paytm_configured || !merchant.paytm_mid || !merchant.paytm_merchant_key)) {
      return errorResponse(res, 400, 'Merchant has not configured Paytm payments.');
    }

    const amount = page.amount || req.body.amount;
    if (!amount) return errorResponse(res, 400, 'Amount is required.');

    const orderId = `ORD${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;
    const baseUrl = (process.env.CALLBACK_BASE_URL || '').replace(/\/+$/, '');

    const transaction = await Transaction.create({
      merchant_id: page.merchant_id,
      order_id: orderId,
      amount,
      sender_note: page.title || 'Payment',
      callback_url: isTier1 ? null : `${baseUrl}/api/webhooks/paytm`,
      status: isTier1 ? 'PENDING_VERIFICATION' : 'PENDING',
    });

    if (isTier1) {
      const tier1Data = await generateTier1PaymentData({ merchant, amount, note: page.title, orderId });
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
      callbackUrl: `${baseUrl}/api/webhooks/paytm`,
    });

    return successResponse(res, 201, 'Payment initiated.', {
      order_id: orderId,
      transaction_id: transaction.id,
      txn_token: paytmResponse.txnToken,
      payment_url: paytmResponse.paymentUrl,
      mid: paytmResponse.mid,
    });
  } catch (err) {
    next(err);
  }
};
