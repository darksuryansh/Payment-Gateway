import { Router } from 'express';
import {
  createPaymentPage, listPaymentPages, updatePaymentPage, deletePaymentPage,
  renderCheckoutPage, initiateHostedPayment,
} from '../controllers/paymentPage.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

// Public routes — hosted payment pages
router.get('/pay/:slug', renderCheckoutPage);
router.post('/pay/:slug/initiate', initiateHostedPayment);

// Authenticated management routes
router.post('/', authenticate, validate({
  title: { required: true },
  slug: { required: true },
}), createPaymentPage);

router.get('/', authenticate, listPaymentPages);
router.put('/:id', authenticate, updatePaymentPage);
router.delete('/:id', authenticate, deletePaymentPage);

export default router;
