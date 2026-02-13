import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.post('/register', validate({
  business_name: { required: true, min: 2, max: 255 },
  email: { required: true, type: 'email' },
  password: { required: true, min: 8, max: 128 },
}), register);

router.post('/login', validate({
  email: { required: true, type: 'email' },
  password: { required: true },
}), login);

export default router;
