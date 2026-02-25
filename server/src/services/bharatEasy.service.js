import axios from 'axios';
import dotenv from 'dotenv';
import { generateChecksum, verifyChecksum, decryptHash } from '../utils/checksum.js';

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
 * Verify a callback response from BharatEasy.
 * Matches txnResult.php flow:
 *   1. Decrypt the "hash" field → get transaction data as JSON string
 *   2. Verify checksum against the decrypted hash string (NOT raw POST params)
 *   3. Parse the decrypted JSON to extract transaction details
 *
 * @param {Object} callbackData - The raw callback POST data (status, hash, checksum, etc.)
 * @returns {{ verified: boolean, data: Object|null }} - Verification result and parsed transaction data
 */
export const verifyCallbackChecksum = (callbackData) => {
  const { checksum, hash } = callbackData;
  if (!checksum || checksum === 'false') return { verified: false, data: null };

  // Must have hash field to verify (matches PHP: hash_decrypt then verifySignature)
  if (!hash) {
    console.warn('[Checksum] No hash field in callback data, cannot verify.');
    return { verified: false, data: null };
  }

  // Step 1: Decrypt the hash field (matches PHP: hash_decrypt($hash, $secret))
  const decryptedHash = decryptHash(hash, BHARATEASY_SECRET_KEY);
  if (!decryptedHash) {
    console.error('[Checksum] Failed to decrypt hash field.');
    return { verified: false, data: null };
  }

  // Step 2: Verify checksum against decrypted hash STRING (matches PHP: verifySignature($paramList, $secret, $checksum))
  const verified = verifyChecksum(decryptedHash, BHARATEASY_SECRET_KEY, checksum);

  // Step 3: Parse the decrypted JSON to get transaction details
  let data = null;
  try {
    data = JSON.parse(decryptedHash);
  } catch (e) {
    console.error('[Checksum] Failed to parse decrypted hash as JSON:', e.message);
  }

  return { verified, data };
};
