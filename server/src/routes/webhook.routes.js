import { Router } from 'express';
import {
  createWebhook, listWebhooks, updateWebhook, deleteWebhook,
  getWebhookLogs, testWebhook,
} from '../controllers/webhook.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/', validate({
  url: { required: true },
}), createWebhook);

router.get('/', listWebhooks);
router.put('/:id', updateWebhook);
router.delete('/:id', deleteWebhook);
router.get('/:id/logs', getWebhookLogs);
router.post('/:id/test', testWebhook);

export default router;
