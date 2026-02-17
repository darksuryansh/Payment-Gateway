import { Router } from 'express';
import { initiateRefund, listRefunds, getRefund, getRefundStatus } from '../controllers/refund.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', validate({
  transaction_id: { required: true },
}), initiateRefund);

router.get('/', listRefunds);
router.get('/:id', getRefund);
router.get('/:id/status', getRefundStatus);

export default router;
