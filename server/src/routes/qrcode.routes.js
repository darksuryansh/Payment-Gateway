import { Router } from 'express';
import { generateQR, generateStaticQR, generateBulk } from '../controllers/qrcode.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/generate', generateQR);
router.post('/static', generateStaticQR);
router.post('/bulk', generateBulk);

export default router;
