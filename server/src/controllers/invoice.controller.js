import { Op } from 'sequelize';
import { Invoice, PaymentLink } from '../models/pg/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { generateInvoiceNumber } from '../services/invoice.service.js';
import { generateShortCode } from '../services/paymentLink.service.js';
import NotificationLog from '../models/mongo/NotificationLog.js';

/**
 * POST /api/invoices
 */
export const createInvoice = async (req, res, next) => {
  try {
    const { customer_name, customer_email, customer_phone, items, subtotal, tax, total_amount, due_date, notes } = req.body;

    const invoice_number = await generateInvoiceNumber(req.merchant.id);

    const invoice = await Invoice.create({
      merchant_id: req.merchant.id,
      customer_name,
      customer_email,
      customer_phone,
      invoice_number,
      items: items || [],
      subtotal,
      tax: tax || 0,
      total_amount,
      due_date,
      notes,
    });

    return successResponse(res, 201, 'Invoice created.', { invoice });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/invoices
 */
export const listInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, customer, date_from, date_to } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { merchant_id: req.merchant.id };
    if (status) where.status = status;
    if (customer) where.customer_name = { [Op.iLike]: `%${customer}%` };
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) where.created_at[Op.lte] = new Date(date_to);
    }

    const { count, rows } = await Invoice.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [{ model: PaymentLink, as: 'paymentLink', attributes: ['id', 'short_url', 'status'] }],
    });

    return successResponse(res, 200, 'Invoices retrieved.', {
      invoices: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/invoices/:id
 */
export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
      include: [{ model: PaymentLink, as: 'paymentLink' }],
    });

    if (!invoice) return errorResponse(res, 404, 'Invoice not found.');
    return successResponse(res, 200, 'Invoice retrieved.', { invoice });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/invoices/:id
 */
export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!invoice) return errorResponse(res, 404, 'Invoice not found.');
    if (!['DRAFT', 'SENT'].includes(invoice.status)) {
      return errorResponse(res, 400, 'Only DRAFT or SENT invoices can be updated.');
    }

    const { customer_name, customer_email, customer_phone, items, subtotal, tax, total_amount, due_date, notes } = req.body;

    await invoice.update({
      ...(customer_name !== undefined && { customer_name }),
      ...(customer_email !== undefined && { customer_email }),
      ...(customer_phone !== undefined && { customer_phone }),
      ...(items !== undefined && { items }),
      ...(subtotal !== undefined && { subtotal }),
      ...(tax !== undefined && { tax }),
      ...(total_amount !== undefined && { total_amount }),
      ...(due_date !== undefined && { due_date }),
      ...(notes !== undefined && { notes }),
    });

    return successResponse(res, 200, 'Invoice updated.', { invoice });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/invoices/:id/send
 */
export const sendInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!invoice) return errorResponse(res, 404, 'Invoice not found.');

    // Create a payment link for this invoice
    const short_url = generateShortCode();
    const paymentLink = await PaymentLink.create({
      merchant_id: req.merchant.id,
      amount: invoice.total_amount,
      description: `Invoice ${invoice.invoice_number}`,
      title: `Invoice ${invoice.invoice_number}`,
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email,
      short_url,
    });

    await invoice.update({
      status: 'SENT',
      payment_link_id: paymentLink.id,
    });

    // Log notification
    await NotificationLog.create({
      merchant_id: req.merchant.id,
      type: 'invoice_sent',
      recipient: invoice.customer_email,
      subject: `Invoice ${invoice.invoice_number}`,
      status: 'sent',
      metadata: { invoice_id: invoice.id, payment_link_id: paymentLink.id },
    });

    return successResponse(res, 200, 'Invoice sent.', {
      invoice,
      payment_url: `${process.env.CALLBACK_BASE_URL}/pay/link/${short_url}`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/invoices/:id/remind
 */
export const remindInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!invoice) return errorResponse(res, 404, 'Invoice not found.');

    await NotificationLog.create({
      merchant_id: req.merchant.id,
      type: 'invoice_reminder',
      recipient: invoice.customer_email,
      subject: `Payment reminder: Invoice ${invoice.invoice_number}`,
      status: 'sent',
      metadata: { invoice_id: invoice.id },
    });

    return successResponse(res, 200, 'Payment reminder sent.');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/invoices/:id/cancel
 */
export const cancelInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id, merchant_id: req.merchant.id },
    });

    if (!invoice) return errorResponse(res, 404, 'Invoice not found.');
    if (invoice.status === 'PAID') {
      return errorResponse(res, 400, 'Cannot cancel a paid invoice.');
    }

    await invoice.update({ status: 'CANCELLED' });
    return successResponse(res, 200, 'Invoice cancelled.', { invoice });
  } catch (err) {
    next(err);
  }
};
