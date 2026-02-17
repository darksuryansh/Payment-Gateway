import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import { PaymentLink } from '../models/pg/index.js';

export const generateShortCode = () => {
  return nanoid(10);
};

export const expirePaymentLinks = async () => {
  const now = new Date();

  const [updatedCount] = await PaymentLink.update(
    { status: 'EXPIRED' },
    {
      where: {
        status: 'ACTIVE',
        expires_at: { [Op.lt]: now },
      },
    }
  );

  return updatedCount;
};
