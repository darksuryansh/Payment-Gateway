import PaytmChecksum from 'paytmchecksum';

/**
 * Generate a Paytm checksum signature for API requests.
 * @param {Object|string} params - Request body (object or JSON string)
 * @param {string} merchantKey - Merchant's Paytm secret key
 * @returns {Promise<string>} Checksum signature
 */
export const generatePaytmChecksum = async (params, merchantKey) => {
  const body = typeof params === 'string' ? params : JSON.stringify(params);
  return PaytmChecksum.generateSignature(body, merchantKey);
};

/**
 * Verify a Paytm checksum from webhook/callback.
 * @param {Object} params - Callback parameters (excluding CHECKSUMHASH)
 * @param {string} merchantKey - Merchant's Paytm secret key
 * @param {string} checksum - The CHECKSUMHASH value to verify
 * @returns {Promise<boolean>}
 */
export const verifyPaytmChecksum = async (params, merchantKey, checksum) => {
  return PaytmChecksum.verifySignature(params, merchantKey, checksum);
};
