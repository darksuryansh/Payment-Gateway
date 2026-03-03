import { Router } from 'express';
import {
  getProfile, updateProfile,
  listBankAccounts, addBankAccount, updateBankAccount, deleteBankAccount,
  changePassword,
  getPaytmConfig, updatePaytmConfig,
} from '../controllers/merchant.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Bank Accounts
router.get('/bank-accounts', listBankAccounts);
router.post('/bank-accounts', validate({
  upi_id: { required: true },
}), addBankAccount);
router.put('/bank-accounts/:id', updateBankAccount);
router.delete('/bank-accounts/:id', deleteBankAccount);

// Paytm Configuration
router.get('/paytm-config', getPaytmConfig);
router.put('/paytm-config', validate({
  paytm_mid: { required: true },
  paytm_merchant_key: { required: true },
}), updatePaytmConfig);

// Password
router.post('/change-password', validate({
  current_password: { required: true, min: 8 },
  new_password: { required: true, min: 8 },
}), changePassword);

export default router;
