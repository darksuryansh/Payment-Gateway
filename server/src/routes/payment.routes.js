import { Router } from 'express';
import {
  initiatePayment,
  paytmWebhook,
  getPaymentStatus,
  listTransactions,
  exportTransactions,
} from '../controllers/payment.controller.js';
import { authenticate, authenticateApiKey } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

// Payment initiation - API key auth
router.post('/initiate', authenticateApiKey, validate({
  amount: { required: true, type: 'number' },
  note: { required: false, min: 2 },
}), initiatePayment);

// Paytm webhook - NO auth (external Paytm callback)
router.post('/webhooks/paytm', paytmWebhook);

// Status check - JWT auth
router.get('/status/:orderId', authenticate, getPaymentStatus);

// List transactions with filters - JWT auth
router.get('/transactions', authenticate, listTransactions);

// Export transactions as CSV - JWT auth
router.get('/transactions/export', authenticate, exportTransactions);

export default router;
