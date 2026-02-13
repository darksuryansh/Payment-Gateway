import crypto from 'crypto';

export const generateApiKey = () => {
  return `pk_live_${crypto.randomBytes(24).toString('hex')}`;
};

export const generateApiSecret = () => {
  return `sk_live_${crypto.randomBytes(24).toString('hex')}`;
};
