import { v4 as uuidv4 } from 'uuid';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generatePaymentQR, generateUpiDeepLink, generateBulkQR } from '../services/qrcode.service.js';
import { PaymentLink, UpiAccount, Transaction } from '../models/pg/index.js';
import { processPayment } from '../services/bharatEasy.service.js';
import ApiLog from '../models/mongo/ApiLog.js';

/**
 * POST /api/qrcodes/generate
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
      // Generate UPI deep link using merchant's primary UPI account
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
 * POST /api/qrcodes/static
 * Now creates an order via BharatEasy so the payment is tracked.
 * Requires: { amount, note? (optional), format? (optional) }
 */
export const generateStaticQR = async (req, res, next) => {
  try {
    const { amount, note, format = 'png' } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return errorResponse(res, 400, 'A valid amount is required to generate a QR code.');
    }

    const merchantId = req.merchant.id;
    const orderId = `QR${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;

    // Create a transaction record so the payment is tracked
    const transaction = await Transaction.create({
      merchant_id: merchantId,
      order_id: orderId,
      amount: parseFloat(amount),
      sender_note: note || 'QR Payment',
      callback_url: `${process.env.CALLBACK_BASE_URL}/api/payment/callback`,
      status: 'PENDING',
    });

    // Create order with BharatEasy to get a tracked payment link
    const bharatEasyResponse = await processPayment({
      orderId,
      txnAmount: amount,
      txnNote: note || 'QR Payment',
      callbackUrl: `${process.env.CALLBACK_BASE_URL}/api/payment/callback`,
    });

    await ApiLog.create({
      merchant_id: merchantId,
      endpoint: '/order/process',
      method: 'POST',
      request_body: { orderId, txnAmount: amount, txnNote: note },
      response_body: bharatEasyResponse,
      status_code: 200,
      ip_address: req.ip,
    });

    // Use the BharatEasy payment URL for the QR code
    const paymentUrl = bharatEasyResponse?.url || bharatEasyResponse?.payment_url || bharatEasyResponse?.data?.url;
    const qrData = paymentUrl || `${process.env.CALLBACK_BASE_URL}/pay/${orderId}`;
    const qrImage = await generatePaymentQR(qrData, format);

    return successResponse(res, 200, 'QR code generated.', {
      qr_data: qrData,
      qr_image: qrImage,
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
        endpoint: '/order/process',
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
