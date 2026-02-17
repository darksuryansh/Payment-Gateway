import { Router } from 'express';
import {
  createSubscription, listSubscriptions, getSubscription, updateSubscription,
  pauseSubscription, resumeSubscription, cancelSubscription, getSubscriptionPayments,
} from '../controllers/subscription.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', validate({
  plan_name: { required: true },
  amount: { required: true, type: 'number' },
  interval: { required: true },
  customer_name: { required: true },
}), createSubscription);

router.get('/', listSubscriptions);
router.get('/:id', getSubscription);
router.put('/:id', updateSubscription);
router.post('/:id/pause', pauseSubscription);
router.post('/:id/resume', resumeSubscription);
router.post('/:id/cancel', cancelSubscription);
router.get('/:id/payments', getSubscriptionPayments);

export default router;
