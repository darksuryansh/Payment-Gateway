import jwt from 'jsonwebtoken';
import { Merchant } from '../src/models/pg/index.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * JWT Bearer token authentication for dashboard APIs.
 * Attaches merchant to req.merchant on success.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const merchant = await Merchant.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!merchant) {
      return errorResponse(res, 401, 'Invalid token. Merchant not found.');
    }

    if (!merchant.is_active) {
      return errorResponse(res, 403, 'Account is deactivated.');
    }

    req.merchant = merchant;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired.');
    }
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token.');
    }
    next(err);
  }
};

/**
 * API key authentication for server-to-server payment APIs.
 * Uses X-Api-Key header.
 */
export const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return errorResponse(res, 401, 'Access denied. No API key provided.');
    }

    const merchant = await Merchant.findOne({
      where: { api_key: apiKey, is_active: true },
      attributes: { exclude: ['password'] },
    });

    if (!merchant) {
      return errorResponse(res, 401, 'Invalid API key.');
    }

    req.merchant = merchant;
    next();
  } catch (err) {
    next(err);
  }
};
