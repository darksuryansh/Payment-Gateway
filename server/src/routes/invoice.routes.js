import { Router } from 'express';
import {
  createInvoice, listInvoices, getInvoice, updateInvoice,
  sendInvoice, remindInvoice, cancelInvoice,
} from '../controllers/invoice.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', validate({
  customer_name: { required: true },
  total_amount: { required: true, type: 'number' },
  subtotal: { required: true, type: 'number' },
}), createInvoice);

router.get('/', listInvoices);
router.get('/:id', getInvoice);
router.put('/:id', updateInvoice);
router.post('/:id/send', sendInvoice);
router.post('/:id/remind', remindInvoice);
router.post('/:id/cancel', cancelInvoice);

export default router;
