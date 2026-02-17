import bcrypt from 'bcryptjs';
import { Merchant, UpiAccount, MerchantSetting } from '../models/pg/index.js';
import { generateApiKey, generateApiSecret, generateTestApiKey, generateTestApiSecret } from '../utils/generateKeys.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import ApiLog from '../models/mongo/ApiLog.js';

/**
 * GET /api/merchant/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'Merchant profile retrieved.', {
      merchant: req.merchant,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/merchant/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { business_name, phone, business_type, website, logo_url, gst_number, pan_number } = req.body;

    await Merchant.update(
      {
        ...(business_name && { business_name }),
        ...(phone && { phone }),
        ...(business_type && { business_type }),
        ...(website && { website }),
        ...(logo_url !== undefined && { logo_url }),
        ...(gst_number !== undefined && { gst_number }),
        ...(pan_number !== undefined && { pan_number }),
      },
      { where: { id: req.merchant.id } }
    );

    const updatedMerchant = await Merchant.findByPk(req.merchant.id, {
      attributes: { exclude: ['password'] },
    });

    return successResponse(res, 200, 'Profile updated successfully.', {
      merchant: updatedMerchant,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/merchant/regenerate-keys
 */
export const regenerateKeys = async (req, res, next) => {
  try {
    const api_key = generateApiKey();
    const api_secret = generateApiSecret();

    await Merchant.update(
      { api_key, api_secret },
      { where: { id: req.merchant.id } }
    );

    return successResponse(res, 200, 'API keys regenerated successfully.', {
      api_key,
      api_secret,
    });
  } catch (err) {
    next(err);
  }
};

// --- API Keys Management ---

/**
 * GET /api/merchant/api-keys
 */
export const getApiKeys = async (req, res, next) => {
  try {
    const merchant = await Merchant.findByPk(req.merchant.id, {
      attributes: ['api_key', 'api_secret', 'test_api_key', 'test_api_secret'],
    });

    const maskKey = (key) => key ? `${key.substring(0, 12)}...${key.substring(key.length - 4)}` : null;

    return successResponse(res, 200, 'API keys retrieved.', {
      live: {
        api_key: maskKey(merchant.api_key),
        api_secret: maskKey(merchant.api_secret),
        has_keys: !!merchant.api_key,
      },
      test: {
        api_key: maskKey(merchant.test_api_key),
        api_secret: maskKey(merchant.test_api_secret),
        has_keys: !!merchant.test_api_key,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/merchant/api-keys/test/regenerate
 */
export const regenerateTestKeys = async (req, res, next) => {
  try {
    const test_api_key = generateTestApiKey();
    const test_api_secret = generateTestApiSecret();

    await Merchant.update(
      { test_api_key, test_api_secret },
      { where: { id: req.merchant.id } }
    );

    return successResponse(res, 200, 'Test API keys regenerated.', {
      test_api_key,
      test_api_secret,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/merchant/api-keys/usage
 */
export const getApiKeyUsage = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalCalls, recentCalls] = await Promise.all([
      ApiLog.countDocuments({ merchant_id: req.merchant.id }),
      ApiLog.countDocuments({
        merchant_id: req.merchant.id,
        created_at: { $gte: thirtyDaysAgo },
      }),
    ]);

    const dailyUsage = await ApiLog.aggregate([
      {
        $match: {
          merchant_id: req.merchant.id,
          created_at: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return successResponse(res, 200, 'API usage statistics retrieved.', {
      total_calls: totalCalls,
      last_30_days: recentCalls,
      daily_usage: dailyUsage,
    });
  } catch (err) {
    next(err);
  }
};

// --- Bank Accounts (UPI) ---

/**
 * GET /api/merchant/bank-accounts
 */
export const listBankAccounts = async (req, res, next) => {
  try {
    const accounts = await UpiAccount.findAll({
      where: { merchant_id: req.merchant.id },
      order: [['is_primary', 'DESC'], ['created_at', 'DESC']],
    });

    return successResponse(res, 200, 'Bank accounts retrieved.', { accounts });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/merchant/bank-accounts
 */
export const addBankAccount = async (req, res, next) => {
  try {
    const { upi_id, provider, is_primary } = req.body;

    if (is_primary) {
      await UpiAccount.update(
        { is_primary: false },
        { where: { merchant_id: req.merchant.id } }
      );
    }

    const account = await UpiAccount.create({
      merchant_id: req.merchant.id,
      upi_id,
      provider,
      is_primary: is_primary || false,
    });

    return successResponse(res, 201, 'Bank account added.', { account });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/merchant/bank-accounts/:id
 */
export const updateBankAccount = async (req, res, next) => {
  try {
    const account = await UpiAccount.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!account) return errorResponse(res, 404, 'Account not found.');

    const { upi_id, provider, is_primary, is_active } = req.body;

    if (is_primary) {
      await UpiAccount.update(
        { is_primary: false },
        { where: { merchant_id: req.merchant.id } }
      );
    }

    await account.update({
      ...(upi_id !== undefined && { upi_id }),
      ...(provider !== undefined && { provider }),
      ...(is_primary !== undefined && { is_primary }),
      ...(is_active !== undefined && { is_active }),
    });

    return successResponse(res, 200, 'Bank account updated.', { account });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/merchant/bank-accounts/:id
 */
export const deleteBankAccount = async (req, res, next) => {
  try {
    const account = await UpiAccount.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!account) return errorResponse(res, 404, 'Account not found.');

    await account.destroy();
    return successResponse(res, 200, 'Bank account removed.');
  } catch (err) {
    next(err);
  }
};

// --- Settings ---

/**
 * GET /api/merchant/settings
 */
export const getSettings = async (req, res, next) => {
  try {
    let settings = await MerchantSetting.findOne({
      where: { merchant_id: req.merchant.id },
    });

    if (!settings) {
      settings = await MerchantSetting.create({ merchant_id: req.merchant.id });
    }

    return successResponse(res, 200, 'Settings retrieved.', { settings });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/merchant/settings
 */
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await MerchantSetting.findOne({
      where: { merchant_id: req.merchant.id },
    });

    if (!settings) {
      settings = await MerchantSetting.create({ merchant_id: req.merchant.id });
    }

    const { notification_email, notification_sms, notification_webhook,
            auto_settlement, settlement_schedule, two_factor_enabled, ip_whitelist } = req.body;

    await settings.update({
      ...(notification_email !== undefined && { notification_email }),
      ...(notification_sms !== undefined && { notification_sms }),
      ...(notification_webhook !== undefined && { notification_webhook }),
      ...(auto_settlement !== undefined && { auto_settlement }),
      ...(settlement_schedule !== undefined && { settlement_schedule }),
      ...(two_factor_enabled !== undefined && { two_factor_enabled }),
      ...(ip_whitelist !== undefined && { ip_whitelist }),
    });

    return successResponse(res, 200, 'Settings updated.', { settings });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/merchant/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;

    const merchant = await Merchant.findByPk(req.merchant.id);

    const isMatch = await bcrypt.compare(current_password, merchant.password);
    if (!isMatch) return errorResponse(res, 400, 'Current password is incorrect.');

    const hashedPassword = await bcrypt.hash(new_password, 12);
    await merchant.update({ password: hashedPassword });

    return successResponse(res, 200, 'Password changed successfully.');
  } catch (err) {
    next(err);
  }
};
