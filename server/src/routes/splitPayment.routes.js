import { Router } from 'express';
import {
  createSplitRule, listSplitRules, updateSplitRule, deleteSplitRule,
  listSplitTransactions, getSplitTransaction,
} from '../controllers/splitPayment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

// Split rules
router.post('/rules', validate({
  name: { required: true },
  split_type: { required: true },
}), createSplitRule);

router.get('/rules', listSplitRules);
router.put('/rules/:id', updateSplitRule);
router.delete('/rules/:id', deleteSplitRule);

// Split transactions
router.get('/transactions', listSplitTransactions);
router.get('/transactions/:id', getSplitTransaction);

export default router;
