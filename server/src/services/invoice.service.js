import { Op } from 'sequelize';
import { Invoice, sequelize } from '../models/pg/index.js';

export const generateInvoiceNumber = async (merchantId) => {
  const lastInvoice = await Invoice.findOne({
    where: { merchant_id: merchantId },
    order: [['created_at', 'DESC']],
    attributes: ['invoice_number'],
  });

  if (!lastInvoice) {
    return 'INV-000001';
  }

  const lastNum = parseInt(lastInvoice.invoice_number.split('-')[1]) || 0;
  const nextNum = String(lastNum + 1).padStart(6, '0');
  return `INV-${nextNum}`;
};

export const checkOverdueInvoices = async () => {
  const today = new Date().toISOString().split('T')[0];

  const [updatedCount] = await Invoice.update(
    { status: 'OVERDUE' },
    {
      where: {
        status: { [Op.in]: ['SENT', 'PARTIALLY_PAID'] },
        due_date: { [Op.lt]: today },
      },
    }
  );

  return updatedCount;
};
