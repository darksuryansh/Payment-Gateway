import { Router } from 'express';
import {
  createPaymentButton, listPaymentButtons, updatePaymentButton,
  deletePaymentButton, getEmbed, renderButtonCheckout, initiateButtonPayment,
} from '../controllers/paymentButton.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

// ─── Public routes (no auth) ─────────────────────────────────────────────────
router.get('/pay/button/:id', renderButtonCheckout);
router.post('/pay/button/:id/initiate', initiateButtonPayment);

// ─── Authenticated management routes ─────────────────────────────────────────
router.use(authenticate);

router.post('/', validate({
  label: { required: true },
  amount: { required: true, type: 'number' },
}), createPaymentButton);

router.get('/', listPaymentButtons);
router.put('/:id', updatePaymentButton);
router.delete('/:id', deletePaymentButton);
router.get('/:id/embed', getEmbed);

export default router;
