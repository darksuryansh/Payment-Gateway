import jwt from 'jsonwebtoken';
import { Merchant, TeamMember } from '../models/pg/index.js';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * JWT Bearer token authentication for dashboard APIs.
 * Supports both merchant and team member tokens.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Team member token
    if (decoded.team_member_id) {
      const teamMember = await TeamMember.findByPk(decoded.team_member_id, {
        attributes: { exclude: ['password'] },
      });

      if (!teamMember || !teamMember.is_active) {
        return errorResponse(res, 401, 'Invalid token. Team member not found or inactive.');
      }

      const merchant = await Merchant.findByPk(teamMember.merchant_id, {
        attributes: { exclude: ['password'] },
      });

      if (!merchant || !merchant.is_active) {
        return errorResponse(res, 403, 'Merchant account is deactivated.');
      }

      req.merchant = merchant;
      req.teamMember = teamMember;
      return next();
    }

    // Merchant token
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
 * Supports both live (pk_live_) and test (pk_test_) keys.
 */
export const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return errorResponse(res, 401, 'Access denied. No API key provided.');
    }

    const isTestKey = apiKey.startsWith('pk_test_');
    const whereClause = isTestKey
      ? { test_api_key: apiKey, is_active: true }
      : { api_key: apiKey, is_active: true };

    const merchant = await Merchant.findOne({
      where: whereClause,
      attributes: { exclude: ['password'] },
    });

    if (!merchant) {
      return errorResponse(res, 401, 'Invalid API key.');
    }

    req.merchant = merchant;
    req.environment = isTestKey ? 'test' : 'live';
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Role-based authorization middleware factory.
 * Usage: authorizeRole('owner', 'admin')
 */
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    // Merchant owners always have full access
    if (!req.teamMember) {
      return next();
    }

    if (!roles.includes(req.teamMember.role)) {
      return errorResponse(res, 403, 'Insufficient permissions for this action.');
    }

    next();
  };
};
