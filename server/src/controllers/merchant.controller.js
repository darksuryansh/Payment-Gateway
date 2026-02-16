import { Merchant } from '../models/pg/index.js';
import { generateApiKey, generateApiSecret } from '../utils/generateKeys.js';
import { successResponse } from '../utils/apiResponse.js';

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
    const { business_name, phone, business_type, website } = req.body;

    await Merchant.update(
      {
        ...(business_name && { business_name }),
        ...(phone && { phone }),
        ...(business_type && { business_type }),
        ...(website && { website }),
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
