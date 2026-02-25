import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Merchant, UpiAccount } from '../models/pg/index.js';
import { generateApiKey, generateApiSecret } from '../utils/generateKeys.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import ActivityLog from '../models/mongo/ActivityLog.js';

/**
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { business_name, email, password, phone, business_type, website, paytm_mid, paytm_merchant_key, paytm_website, merchant_tier, upi_id } = req.body;

    const existingMerchant = await Merchant.findOne({ where: { email } });
    if (existingMerchant) {
      return errorResponse(res, 409, 'A merchant with this email already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const api_key = generateApiKey();
    const api_secret = generateApiSecret();

    const paytmConfigured = !!(paytm_mid && paytm_merchant_key);

    const merchant = await Merchant.create({
      business_name,
      email,
      password: hashedPassword,
      phone: phone || null,
      business_type: business_type || 'individual',
      website: website || null,
      api_key,
      api_secret,
      paytm_mid: paytm_mid || null,
      paytm_merchant_key: paytm_merchant_key || null,
      paytm_website: paytm_website || 'DEFAULT',
      paytm_configured: paytmConfigured,
    });

    const token = jwt.sign(
      { id: merchant.id, email: merchant.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    await ActivityLog.create({
      merchant_id: merchant.id,
      action: 'REGISTER',
      details: { email, business_name },
      ip_address: req.ip,
    });

    return successResponse(res, 201, 'Merchant registered successfully.', {
      merchant: {
        id: merchant.id,
        business_name: merchant.business_name,
        email: merchant.email,
        api_key: merchant.api_key,
        api_secret: merchant.api_secret,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const merchant = await Merchant.findOne({ where: { email } });
    if (!merchant) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    if (!merchant.is_active) {
      return errorResponse(res, 403, 'Account is deactivated. Contact support.');
    }

    const isMatch = await bcrypt.compare(password, merchant.password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const token = jwt.sign(
      { id: merchant.id, email: merchant.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    await ActivityLog.create({
      merchant_id: merchant.id,
      action: 'LOGIN',
      details: { email },
      ip_address: req.ip,
    });

    return successResponse(res, 200, 'Login successful.', {
      merchant: {
        id: merchant.id,
        business_name: merchant.business_name,
        email: merchant.email,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};
