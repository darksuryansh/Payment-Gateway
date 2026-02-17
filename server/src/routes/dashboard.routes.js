import { Router } from 'express';
import { getStats, getRevenueChart, getRecentTransactions, getQuickStats } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/stats', getStats);
router.get('/revenue-chart', getRevenueChart);
router.get('/recent-transactions', getRecentTransactions);
router.get('/quick-stats', getQuickStats);

export default router;
