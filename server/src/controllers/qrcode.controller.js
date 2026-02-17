import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generatePaymentQR, generateUpiDeepLink, generateBulkQR } from '../services/qrcode.service.js';
import { PaymentLink, UpiAccount } from '../models/pg/index.js';

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
 */
export const generateStaticQR = async (req, res, next) => {
  try {
    const { format = 'png' } = req.body;

    const upiAccount = await UpiAccount.findOne({
      where: { merchant_id: req.merchant.id, is_primary: true, is_active: true },
    });

    if (!upiAccount) return errorResponse(res, 400, 'No primary UPI account found.');

    const qrData = generateUpiDeepLink({
      payeeVpa: upiAccount.upi_id,
      payeeName: req.merchant.business_name,
    });

    const qrImage = await generatePaymentQR(qrData, format);

    return successResponse(res, 200, 'Static QR code generated.', {
      qr_data: qrData,
      qr_image: qrImage,
      format,
    });
  } catch (err) {
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
