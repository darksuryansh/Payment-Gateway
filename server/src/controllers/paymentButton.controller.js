import { PaymentButton, Merchant, Transaction } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { initiateTransaction } from '../services/paytm.service.js';
import { v4 as uuidv4 } from 'uuid';

const generateEmbedCode = (button, baseUrl) => {
  const bg = button.style?.bg_color || '#3B82F6';
  const color = button.style?.text_color || '#fff';
  const radius = button.style?.border_radius || '6px';
  return `<!-- Boomlex Payment Button -->
<div id="boomlex-btn-${button.id}">
  <button onclick="window.open('${baseUrl}/pay/button/${button.id}','_blank','width=460,height=620')"
    style="background:${bg};color:${color};padding:12px 24px;border:none;border-radius:${radius};cursor:pointer;font-size:15px;font-weight:600;">
    ${button.label}
  </button>
</div>`;
};

/**
 * POST /api/payment-buttons
 */
export const createPaymentButton = async (req, res, next) => {
  try {
    const { label, amount, style, redirect_url } = req.body;

    const button = await PaymentButton.create({
      merchant_id: req.merchant.id,
      label,
      amount,
      style: style || {},
      redirect_url,
    });

    const button_code = generateEmbedCode(button, process.env.CALLBACK_BASE_URL);
    await button.update({ button_code });

    return successResponse(res, 201, 'Payment button created.', { payment_button: button });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payment-buttons
 */
export const listPaymentButtons = async (req, res, next) => {
  try {
    const buttons = await PaymentButton.findAll({
      where: { merchant_id: req.merchant.id },
      order: [['created_at', 'DESC']],
    });

    return successResponse(res, 200, 'Payment buttons retrieved.', { payment_buttons: buttons });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/payment-buttons/:id
 */
export const updatePaymentButton = async (req, res, next) => {
  try {
    const button = await PaymentButton.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!button) return errorResponse(res, 404, 'Payment button not found.');

    const { label, amount, style, redirect_url, is_active } = req.body;

    await button.update({
      ...(label !== undefined && { label }),
      ...(amount !== undefined && { amount }),
      ...(style !== undefined && { style }),
      ...(redirect_url !== undefined && { redirect_url }),
      ...(is_active !== undefined && { is_active }),
    });

    const button_code = generateEmbedCode(button, process.env.CALLBACK_BASE_URL);
    await button.update({ button_code });

    return successResponse(res, 200, 'Payment button updated.', { payment_button: button });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/payment-buttons/:id
 */
export const deletePaymentButton = async (req, res, next) => {
  try {
    const button = await PaymentButton.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!button) return errorResponse(res, 404, 'Payment button not found.');

    await button.update({ is_active: false });
    return successResponse(res, 200, 'Payment button deactivated.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payment-buttons/:id/embed
 */
export const getEmbed = async (req, res, next) => {
  try {
    const button = await PaymentButton.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!button) return errorResponse(res, 404, 'Payment button not found.');

    return successResponse(res, 200, 'Embed code retrieved.', {
      embed_code: button.button_code,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /pay/button/:id — Public: render checkout page for payment button
 */
export const renderButtonCheckout = async (req, res, next) => {
  try {
    const button = await PaymentButton.findOne({
      where: { id: req.params.id, is_active: true },
      include: [{ model: Merchant, as: 'merchant', attributes: ['business_name', 'logo_url'] }],
    });

    if (!button) {
      return res.status(404).render('payment-failed', {
        title: 'Button Not Found',
        message: 'This payment button does not exist or is no longer active.',
      });
    }

    res.render('button-checkout', {
      button,
      merchant: button.merchant,
      baseUrl: process.env.CALLBACK_BASE_URL,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /pay/button/:id/initiate — Public: initiate payment from button popup
 */
export const initiateButtonPayment = async (req, res, next) => {
  try {
    const button = await PaymentButton.findOne({
      where: { id: req.params.id, is_active: true },
    });

    if (!button) return errorResponse(res, 404, 'Payment button not found.');

    // Fetch merchant with Paytm credentials
    const merchant = await Merchant.findByPk(button.merchant_id, {
      attributes: { exclude: ['password'] },
    });

    if (!merchant.paytm_configured || !merchant.paytm_mid || !merchant.paytm_merchant_key) {
      return errorResponse(res, 400, 'Merchant has not configured Paytm payments.');
    }

    const orderId = `ORD${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;
    const baseUrl = (process.env.CALLBACK_BASE_URL || '').replace(/\/+$/, '');

    const transaction = await Transaction.create({
      merchant_id: button.merchant_id,
      order_id: orderId,
      amount: button.amount,
      sender_note: button.label,
      callback_url: `${baseUrl}/api/webhooks/paytm`,
      status: 'PENDING',
    });

    const paytmResponse = await initiateTransaction({
      merchant,
      orderId,
      amount: button.amount,
      callbackUrl: `${baseUrl}/api/webhooks/paytm`,
    });

    return successResponse(res, 201, 'Payment initiated.', {
      order_id: orderId,
      transaction_id: transaction.id,
      txn_token: paytmResponse.txnToken,
      payment_url: paytmResponse.paymentUrl,
      mid: paytmResponse.mid,
      redirect_url: button.redirect_url || null,
    });
  } catch (err) {
    next(err);
  }
};
