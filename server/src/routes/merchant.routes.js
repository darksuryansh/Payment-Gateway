import { Router } from 'express';
import { getProfile, updateProfile, regenerateKeys } from '../controllers/merchant.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/regenerate-keys', regenerateKeys);

export default router;
