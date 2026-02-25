import { Router } from 'express';
import {
  getProfile, updateProfile, regenerateKeys,
  getApiKeys, regenerateTestKeys, getApiKeyUsage,
  listBankAccounts, addBankAccount, updateBankAccount, deleteBankAccount,
  getSettings, updateSettings, changePassword,
  getPaytmConfig, updatePaytmConfig,
} from '../controllers/merchant.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// API Keys
router.get('/api-keys', getApiKeys);
router.post('/regenerate-keys', regenerateKeys);
router.post('/api-keys/test/regenerate', regenerateTestKeys);
router.get('/api-keys/usage', getApiKeyUsage);

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

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Password
router.post('/change-password', validate({
  current_password: { required: true, min: 8 },
  new_password: { required: true, min: 8 },
}), changePassword);

export default router;
