import { Router } from 'express';
import { revenue, successRate, peakHours, paymentModes, customers } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/revenue', revenue);
router.get('/success-rate', successRate);
router.get('/peak-hours', peakHours);
router.get('/payment-modes', paymentModes);
router.get('/customers', customers);

export default router;
