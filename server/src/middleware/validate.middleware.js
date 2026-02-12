import { errorResponse } from '../utils/apiResponse.js';

/**
 * Validation middleware factory.
 * @param {Object} rules - { fieldName: { required, type, min, max, pattern } }
 */
export const validate = (rules) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body[field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rule.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${field} must be a valid email`);
        }
      }

      if (rule.type === 'number' && isNaN(Number(value))) {
        errors.push(`${field} must be a number`);
      }

      if (rule.min !== undefined && typeof value === 'string' && value.length < rule.min) {
        errors.push(`${field} must be at least ${rule.min} characters`);
      }

      if (rule.max !== undefined && typeof value === 'string' && value.length > rule.max) {
        errors.push(`${field} must be at most ${rule.max} characters`);
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }

    if (errors.length > 0) {
      return errorResponse(res, 400, 'Validation failed', errors);
    }

    next();
  };
};
