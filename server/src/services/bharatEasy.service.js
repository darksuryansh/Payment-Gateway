import axios from 'axios';
import dotenv from 'dotenv';
import { generateChecksum, verifyChecksum } from '../utils/checksum.js';

dotenv.config();

const {
  BHARATEASY_TOKEN,
  BHARATEASY_SECRET_KEY,
  BHARATEASY_UPI_UID,
  BHARATEASY_PROCESS_URL,
  BHARATEASY_STATUS_URL,
  BHARATEASY_TEST_URL,
  NODE_ENV,
} = process.env;

/**
 * Initiate a UPI payment via TheBharatEasy gateway.
 */
export const processPayment = async ({ orderId, txnAmount, txnNote, callbackUrl }) => {
  const txnAmountStr = String(txnAmount);

  // Generate checksum from all params (excluding checksum itself) — sorted alphabetically by key
  const checksumParams = {
    upiuid: BHARATEASY_UPI_UID,
    token: BHARATEASY_TOKEN,
    orderId,
    txnAmount: txnAmountStr,
    txnNote,
    callback_url: callbackUrl,
  };
  const checksum = generateChecksum(checksumParams);

  const payload = {
    ...checksumParams,
    checksum,
  };

  const url = NODE_ENV === 'development' ? BHARATEASY_TEST_URL : BHARATEASY_PROCESS_URL;

  console.log('[BharatEasy] Sending payment to:', url);
  console.log('[BharatEasy] Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(url, new URLSearchParams(payload), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 30000,
    });
    console.log('[BharatEasy] Response:', typeof response.data === 'string' ? response.data.substring(0, 500) : JSON.stringify(response.data));
    return response.data;
  } catch (err) {
    console.error('[BharatEasy] Payment request failed:', err.response?.data || err.message);
    throw err;
  }
};

/**
 * Check the status of a transaction via TheBharatEasy.
 */
export const checkTransactionStatus = async (orderId) => {
  const payload = {
    token: BHARATEASY_TOKEN,
    orderId,
  };

  const response = await axios.post(BHARATEASY_STATUS_URL, new URLSearchParams(payload), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 15000,
  });

  return response.data;
};

/**
 * Verify a callback response checksum from BharatEasy.
 * Uses the new verifyChecksum that decrypts AES-128-CBC and compares hash+salt.
 */
export const verifyCallbackChecksum = (callbackData) => {
  const { checksum, ...rest } = callbackData;
  if (!checksum || checksum === 'false') return false;

  // Remove CHECKSUMHASH if present (BharatEasy SDK convention)
  const params = { ...rest };
  delete params.CHECKSUMHASH;

  return verifyChecksum(params, BHARATEASY_SECRET_KEY, checksum);
};
