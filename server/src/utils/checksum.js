import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.BHARATEASY_SECRET_KEY;
const IV = Buffer.from('@@@@&&&&####' + String.fromCharCode(36, 36, 36, 36), 'utf8'); // @@@@&&&&####$$$$

/**
 * Pad the AES key to 16 bytes (AES-128) with null bytes, matching PHP behavior.
 */
function padKey(key) {
  const buf = Buffer.alloc(16, 0);
  Buffer.from(key, 'utf8').copy(buf);
  return buf;
}

/**
 * AES-128-CBC encrypt (matches PHP openssl_encrypt with default PKCS7 padding).
 */
function aesEncrypt(data, key) {
  const keyBuf = padKey(key);
  const cipher = crypto.createCipheriv('aes-128-cbc', keyBuf, IV);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

/**
 * AES-128-CBC decrypt (matches PHP openssl_decrypt).
 */
function aesDecrypt(encrypted, key) {
  const keyBuf = padKey(key);
  const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuf, IV);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Generate a random 4-character salt (matches PHP SDK).
 */
function generateRandomSalt(length = 4) {
  const chars = '9876543210ZYXWVUTSRQPONMLKJIHGFEDCBAabcdefghijklmnopqrstuvwxyz!@#$&_';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sort params alphabetically by key, join values with pipe.
 * Matches PHP: ksort($params) then implode("|", $params).
 */
function getStringByParams(params) {
  const sorted = Object.keys(params).sort();
  return sorted
    .map((k) => (params[k] !== null && params[k] !== undefined && String(params[k]).toLowerCase() !== 'null') ? params[k] : '')
    .join('|');
}

/**
 * SHA256 hash of params string + salt, then append salt.
 */
function calculateHash(paramsString, salt) {
  const finalString = paramsString + '|' + salt;
  const hash = crypto.createHash('sha256').update(finalString).digest('hex');
  return hash + salt;
}

/**
 * Generate checksum signature for BharatEasy API requests.
 * Algorithm: SHA256(sorted_params|salt) + salt → AES-128-CBC encrypt → base64.
 * Matches AhkWebCheckSum.php generateSignature().
 *
 * @param {Object} params - All request parameters (excluding checksum).
 * @returns {string} Encrypted checksum string.
 */
export const generateChecksum = (params) => {
  const paramsString = getStringByParams(params);
  const salt = generateRandomSalt(4);
  const hashString = calculateHash(paramsString, salt);
  const checksum = aesEncrypt(hashString, SECRET_KEY);
  return checksum;
};

/**
 * Verify a checksum received in a BharatEasy callback response.
 * Matches AhkWebCheckSum.php verifySignature().
 *
 * @param {Object} params - Response parameters (excluding checksum).
 * @param {string} key - Secret key.
 * @param {string} checksum - Received checksum to verify.
 * @returns {boolean}
 */
export const verifyChecksum = (params, key, checksum) => {
  try {
    const decrypted = aesDecrypt(checksum, key);
    const salt = decrypted.slice(-4);
    // Support both string and object params (matches PHP SDK's verifySignature)
    const paramsString = typeof params === 'string' ? params : getStringByParams(params);
    const expected = calculateHash(paramsString, salt);
    return decrypted === expected;
  } catch {
    return false;
  }
};

/**
 * Decrypt the "hash" field from BharatEasy callback (AES-256-CBC with SHA1 key).
 * Matches hash_decrypt() in AhkWeb_hashAlgo.php.
 */
export const decryptHash = (encryptedBundle, password) => {
  try {
    const pwdHash = crypto.createHash('sha1').update(password).digest('hex');
    const components = encryptedBundle.split(':');
    const iv = components[0];
    const salt = crypto.createHash('sha256').update(pwdHash + components[1]).digest('hex');
    const encryptedMsg = components[2];

    // PHP passes the hex string directly to openssl_decrypt as the key.
    // For AES-256-CBC (32-byte key), PHP truncates the raw ASCII bytes to 32,
    // so we take the first 32 characters of the hex string as UTF-8 bytes.
    const keyBuf = Buffer.from(salt.substring(0, 32), 'utf8');
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuf, iv);
    let decrypted = decipher.update(encryptedMsg, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('[Hash Decrypt] Failed:', err.message);
    return false;
  }
};
