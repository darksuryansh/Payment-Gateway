import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../models/pg/index.js';
import { processPayment, checkTransactionStatus, verifyCallbackChecksum } from '../services/bharatEasy.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { exportTransactionsCSV } from '../services/export.service.js';
import ApiLog from '../models/mongo/ApiLog.js';

/**
 * POST /api/payment/initiate
 * Initiate a new UPI payment.
 */
export const initiatePayment = async (req, res, next) => {
  try {
    const { amount, note, callback_url } = req.body;
    const merchantId = req.merchant.id;

    // Generate unique alphanumeric order ID
    const orderId = `ORD${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;

    // Create transaction in PENDING state
    const transaction = await Transaction.create({
      merchant_id: merchantId,
      order_id: orderId,
      amount,
      sender_note: note || 'Payment',
      callback_url: callback_url || `${process.env.CALLBACK_BASE_URL}/api/payment/callback`,
      status: 'PENDING',
    });

    // Call BharatEasy API
    const bharatEasyResponse = await processPayment({
      orderId,
      txnAmount: amount,
      txnNote: note || 'Payment',
      callbackUrl: `${process.env.CALLBACK_BASE_URL}/api/payment/callback`,
    });

    // Log the API call
    await ApiLog.create({
      merchant_id: merchantId,
      endpoint: '/order/process',
      method: 'POST',
      request_body: { orderId, txnAmount: amount, txnNote: note },
      response_body: bharatEasyResponse,
      status_code: 200,
      ip_address: req.ip,
    });

    return successResponse(res, 201, 'Payment initiated successfully.', {
      order_id: orderId,
      transaction_id: transaction.id,
      amount,
      status: 'PENDING',
      gateway_response: bharatEasyResponse,
    });
  } catch (err) {
    // Log failed API calls
    try {
      await ApiLog.create({
        merchant_id: req.merchant?.id,
        endpoint: '/order/process',
        method: 'POST',
        request_body: req.body,
        response_body: { error: err.message },
        status_code: err.response?.status || 500,
        ip_address: req.ip,
      });
    } catch (logErr) {
      console.error('Failed to log API error:', logErr.message);
    }
    next(err);
  }
};

/**
 * POST /api/payment/callback
 * Callback endpoint called by BharatEasy after payment processing.
 * NOT authenticated - called by BharatEasy's server.
 */
export const paymentCallback = async (req, res, next) => {
  try {
    const { status, message, hash, checksum, orderId } = req.body;

    const transaction = await Transaction.findOne({ where: { order_id: orderId } });
    if (!transaction) {
      return errorResponse(res, 404, 'Transaction not found for this order.');
    }

    // Verify checksum for SUCCESS responses
    if (status === 'SUCCESS' && checksum) {
      const isValid = verifyCallbackChecksum({
        checksum,
        orderId,
        txnAmount: String(transaction.amount),
      });

      if (!isValid) {
        console.error(`Checksum verification failed for order: ${orderId}`);
        await transaction.update({ status: 'FAILED' });
        return errorResponse(res, 400, 'Checksum verification failed.');
      }
    }

    // Fetch full transaction details from BharatEasy status API
    const statusResponse = await checkTransactionStatus(orderId);

    if (statusResponse.status === 'SUCCESS' && statusResponse.result) {
      const result = statusResponse.result;
      await transaction.update({
        txn_id: result.txnId || null,
        bank_txn_id: result.bankTxnId || null,
        fees: result.fees ? parseFloat(result.fees) : 0,
        settle_amount: result.settle_amount ? parseFloat(result.settle_amount) : 0,
        status: result.txnStatus === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
        payment_mode: result.paymentMode || null,
        sender_vpa: result.sender_vpa || null,
        sender_note: result.sender_note || null,
        payee_vpa: result.payee_vpa || null,
        utr: result.utr || null,
        txn_date: result.txnDate ? new Date(result.txnDate) : null,
      });
    } else {
      await transaction.update({ status: 'FAILED' });
    }

    // Log callback
    await ApiLog.create({
      merchant_id: transaction.merchant_id,
      endpoint: '/api/payment/callback',
      method: 'POST',
      request_body: req.body,
      response_body: statusResponse,
      status_code: 200,
      ip_address: req.ip,
    });

    return successResponse(res, 200, 'Callback processed.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payment/status/:orderId
 * Check the status of a payment.
 */
export const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const merchantId = req.merchant.id;

    const transaction = await Transaction.findOne({
      where: { order_id: orderId, merchant_id: merchantId },
    });

    if (!transaction) {
      return errorResponse(res, 404, 'Transaction not found.');
    }

    // Refresh from BharatEasy if still PENDING
    if (transaction.status === 'PENDING') {
      try {
        const statusResponse = await checkTransactionStatus(orderId);

        if (statusResponse.status === 'SUCCESS' && statusResponse.result) {
          const result = statusResponse.result;
          await transaction.update({
            txn_id: result.txnId || null,
            bank_txn_id: result.bankTxnId || null,
            fees: result.fees ? parseFloat(result.fees) : 0,
            settle_amount: result.settle_amount ? parseFloat(result.settle_amount) : 0,
            status: result.txnStatus === 'COMPLETED' ? 'COMPLETED'
                  : result.txnStatus === 'FAILED' ? 'FAILED' : 'PENDING',
            payment_mode: result.paymentMode || null,
            sender_vpa: result.sender_vpa || null,
            utr: result.utr || null,
            txn_date: result.txnDate ? new Date(result.txnDate) : null,
          });
          await transaction.reload();
        }
      } catch (apiErr) {
        console.error('BharatEasy status check failed:', apiErr.message);
      }
    }

    return successResponse(res, 200, 'Transaction status retrieved.', {
      transaction: {
        order_id: transaction.order_id,
        txn_id: transaction.txn_id,
        amount: transaction.amount,
        fees: transaction.fees,
        settle_amount: transaction.settle_amount,
        status: transaction.status,
        payment_mode: transaction.payment_mode,
        sender_vpa: transaction.sender_vpa,
        utr: transaction.utr,
        txn_date: transaction.txn_date,
        created_at: transaction.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payment/transactions
 * List all transactions with filters, search, sorting.
 */
export const listTransactions = async (req, res, next) => {
  try {
    const merchantId = req.merchant.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { status, date_from, date_to, min_amount, max_amount, search, sort_by, sort_order } = req.query;

    const where = { merchant_id: merchantId };

    if (status) where.status = status;
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) where.created_at[Op.lte] = new Date(date_to);
    }
    if (min_amount || max_amount) {
      where.amount = {};
      if (min_amount) where.amount[Op.gte] = parseFloat(min_amount);
      if (max_amount) where.amount[Op.lte] = parseFloat(max_amount);
    }
    if (search) {
      where[Op.or] = [
        { order_id: { [Op.iLike]: `%${search}%` } },
        { utr: { [Op.iLike]: `%${search}%` } },
        { sender_vpa: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const validSortFields = ['created_at', 'amount', 'status'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const orderDir = sort_order === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      order: [[orderField, orderDir]],
      limit,
      offset,
      attributes: { exclude: ['callback_url'] },
    });

    return successResponse(res, 200, 'Transactions retrieved.', {
      transactions: rows,
      pagination: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payment/transactions/export
 * Export transactions as CSV.
 */
export const exportTransactions = async (req, res, next) => {
  try {
    const merchantId = req.merchant.id;
    const { status, date_from, date_to, min_amount, max_amount } = req.query;

    const where = { merchant_id: merchantId };
    if (status) where.status = status;
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) where.created_at[Op.lte] = new Date(date_to);
    }
    if (min_amount || max_amount) {
      where.amount = {};
      if (min_amount) where.amount[Op.gte] = parseFloat(min_amount);
      if (max_amount) where.amount[Op.lte] = parseFloat(max_amount);
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['callback_url'] },
      raw: true,
    });

    const csv = exportTransactionsCSV(transactions);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};
