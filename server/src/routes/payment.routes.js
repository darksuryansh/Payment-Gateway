import { Router } from 'express';
import {
  initiatePayment,
  paymentCallback,
  getPaymentStatus,
  listTransactions,
} from '../controllers/payment.controller.js';
import { authenticate, authenticateApiKey } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

// Payment initiation - API key auth
router.post('/initiate', authenticateApiKey, validate({
  amount: { required: true, type: 'number' },
  note: { required: false, min: 2 },
}), initiatePayment);

// Callback from BharatEasy - NO auth (external server)
router.post('/callback', paymentCallback);

// Status check - JWT auth
router.get('/status/:orderId', authenticate, getPaymentStatus);

// List transactions - JWT auth (paginated)
router.get('/transactions', authenticate, listTransactions);

export default router;
