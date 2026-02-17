import { PaymentButton } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const generateEmbedCode = (button, baseUrl) => {
  return `<!-- Boomlex Payment Button -->
<div id="boomlex-btn-${button.id}">
  <button onclick="window.open('${baseUrl}/pay/button/${button.id}','_blank','width=450,height=600')"
    style="background:${button.style.color || '#000'};color:#fff;padding:12px 24px;border:none;border-radius:${button.style.borderRadius || '4px'};cursor:pointer;font-size:16px;">
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

    return successResponse(res, 201, 'Payment button created.', {
      payment_button: button,
    });
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
      button_code: button.button_code,
    });
  } catch (err) {
    next(err);
  }
};
