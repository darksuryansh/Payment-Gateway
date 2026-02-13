import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.BHARATEASY_SECRET_KEY;

/**
 * Generate HMAC-SHA256 checksum for BharatEasy API requests.
 * Parameters are pipe-delimited: orderId|txnAmount|token
 */
export const generateChecksum = ({ orderId, txnAmount, token }) => {
  const data = `${orderId}|${txnAmount}|${token}`;
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(data);
  return hmac.digest('base64');
};

/**
 * Verify a checksum received in a BharatEasy callback.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export const verifyChecksum = (receivedChecksum, params) => {
  const expectedChecksum = generateChecksum(params);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(receivedChecksum, 'base64'),
      Buffer.from(expectedChecksum, 'base64')
    );
  } catch {
    return false;
  }
};
