import { v4 as uuidv4 } from 'uuid';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generatePaymentQR, generateUpiDeepLink, generateBulkQR } from '../services/qrcode.service.js';
import { PaymentLink, UpiAccount, Transaction } from '../models/pg/index.js';
import { createDynamicQR } from '../services/paytm.service.js';
import ApiLog from '../models/mongo/ApiLog.js';

/**
 * POST /api/qrcodes/generate
 * Generate a static QR code using merchant's UPI ID (local generation, no API call).
 */
export const generateQR = async (req, res, next) => {
  try {
    const { payment_link_id, amount, note, format = 'png' } = req.body;

    let qrData;

    if (payment_link_id) {
      const link = await PaymentLink.findOne({
        where: { id: payment_link_id, merchant_id: req.merchant.id },
      });
      if (!link) return errorResponse(res, 404, 'Payment link not found.');
      qrData = `${process.env.CALLBACK_BASE_URL}/pay/link/${link.short_url}`;
    } else {
      const upiAccount = await UpiAccount.findOne({
        where: { merchant_id: req.merchant.id, is_primary: true, is_active: true },
      });

      if (!upiAccount) return errorResponse(res, 400, 'No primary UPI account found.');

      qrData = generateUpiDeepLink({
        payeeVpa: upiAccount.upi_id,
        payeeName: req.merchant.business_name,
        amount,
        note,
      });
    }

    const qrImage = await generatePaymentQR(qrData, format);

    return successResponse(res, 200, 'QR code generated.', {
      qr_data: qrData,
      qr_image: qrImage,
      format,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/qrcodes/dynamic
 * Generate a dynamic QR code via Paytm API (tracked, with amount).
 */
export const generateDynamicQR = async (req, res, next) => {
  try {
    const { amount, note, format = 'png' } = req.body;
    const merchant = req.merchant;

    if (!amount || parseFloat(amount) <= 0) {
      return errorResponse(res, 400, 'A valid amount is required to generate a dynamic QR code.');
    }

    if (!merchant.paytm_configured || !merchant.paytm_mid || !merchant.paytm_merchant_key) {
      return errorResponse(res, 400, 'Paytm is not configured. Please add your Paytm credentials in settings.');
    }

    const orderId = `QR${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;

    const transaction = await Transaction.create({
      merchant_id: merchant.id,
      order_id: orderId,
      amount: parseFloat(amount),
      sender_note: note || 'QR Payment',
      callback_url: `${(process.env.CALLBACK_BASE_URL || '').replace(/\/+$/, '')}/api/webhooks/paytm`,
      status: 'PENDING',
    });

    const paytmQR = await createDynamicQR({
      merchant,
      orderId,
      amount,
    });

    await ApiLog.create({
      merchant_id: merchant.id,
      endpoint: '/paymentservices/qr/create',
      method: 'POST',
      request_body: { orderId, amount, note },
      response_body: paytmQR,
      status_code: 200,
      ip_address: req.ip,
    });

    // Generate QR image from the Paytm QR data string
    const qrData = paytmQR.qrData || paytmQR.image;
    const qrImage = qrData ? await generatePaymentQR(qrData, format) : null;

    return successResponse(res, 200, 'Dynamic QR code generated.', {
      qr_data: qrData,
      qr_image: qrImage || paytmQR.image,
      order_id: orderId,
      transaction_id: transaction.id,
      amount: parseFloat(amount),
      status: 'PENDING',
      format,
    });
  } catch (err) {
    try {
      await ApiLog.create({
        merchant_id: req.merchant?.id,
        endpoint: '/paymentservices/qr/create',
        method: 'POST',
        request_body: req.body,
        response_body: { error: err.message },
        status_code: err.response?.status || 500,
        ip_address: req.ip,
      });
    } catch (_) {}
    next(err);
  }
};

/**
 * POST /api/qrcodes/bulk
 */
export const generateBulk = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 400, 'Items array is required.');
    }

    if (items.length > 50) {
      return errorResponse(res, 400, 'Maximum 50 QR codes per batch.');
    }

    const results = await generateBulkQR(items);
    return successResponse(res, 200, 'Bulk QR codes generated.', { qr_codes: results });
  } catch (err) {
    next(err);
  }
};
