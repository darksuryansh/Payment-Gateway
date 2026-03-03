import { UpiAccount } from '../models/pg/index.js';
import { generateUpiDeepLink, generatePaymentQR } from './qrcode.service.js';

/**
 * For Tier 1 merchants: generate UPI deep link + QR code.
 */
export const generateTier1PaymentData = async ({ merchant, amount, note, orderId }) => {
  const upiAccount = await UpiAccount.findOne({
    where: { merchant_id: merchant.id, is_primary: true, is_active: true },
  });

  if (!upiAccount) {
    throw new Error('No primary UPI account configured. Please add a UPI ID in Bank Accounts settings.');
  }

  const upiLink = generateUpiDeepLink({
    payeeVpa: upiAccount.upi_id,
    payeeName: merchant.business_name,
    amount,
    note: note || 'Payment',
    txnId: orderId,
  });

  const qrImage = await generatePaymentQR(upiLink, 'png');

  return {
    upi_link: upiLink,
    qr_image: qrImage,
    payee_vpa: upiAccount.upi_id,
    payee_name: merchant.business_name,
  };
};
