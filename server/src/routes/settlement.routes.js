import { Router } from 'express';
import { listSettlements, getSummary, getSettlement, exportSettlements } from '../controllers/settlement.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', listSettlements);
router.get('/summary', getSummary);
router.get('/export', exportSettlements);
router.get('/:id', getSettlement);

export default router;
