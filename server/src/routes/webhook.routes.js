import { Router } from 'express';
import { createWebhook, listWebhooks, deleteWebhook } from '../controllers/webhook.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', validate({
  url: { required: true },
}), createWebhook);

router.get('/', listWebhooks);
router.delete('/:id', deleteWebhook);

export default router;
