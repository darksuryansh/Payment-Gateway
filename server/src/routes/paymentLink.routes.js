import { Router } from 'express';
import {
  createPaymentLink, listPaymentLinks, getPaymentLink,
  updatePaymentLink, deletePaymentLink,
  renderPaymentLinkPage, initiatePaymentLinkPayment,
} from '../controllers/paymentLink.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

// Public routes — hosted payment link pages
router.get('/pay/link/:shortCode', renderPaymentLinkPage);
router.post('/pay/link/:shortCode/initiate', initiatePaymentLinkPayment);

// Authenticated management routes
router.post('/', authenticate, validate({
  amount: { required: true, type: 'number' },
}), createPaymentLink);

router.get('/', authenticate, listPaymentLinks);
router.get('/:id', authenticate, getPaymentLink);
router.put('/:id', authenticate, updatePaymentLink);
router.delete('/:id', authenticate, deletePaymentLink);

export default router;
