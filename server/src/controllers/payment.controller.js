import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, Invoice, Merchant, sequelize } from '../models/pg/index.js';
import { initiateTransaction, checkTransactionStatus, verifyPaytmCallback } from '../services/paytm.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { exportTransactionsCSV } from '../services/export.service.js';
import { triggerMerchantWebhooks } from '../services/webhook.service.js';
import ApiLog from '../models/mongo/ApiLog.js';

/**
 * POST /api/payment/initiate
 * Initiates a payment via Paytm using the merchant's own Paytm credentials.
 */
export const initiatePayment = async (req, res, next) => {
  try {
    const { amount, note, callback_url } = req.body;
    const merchant = req.merchant;

    if (!merchant.paytm_configured || !merchant.paytm_mid || !merchant.paytm_merchant_key) {
      return errorResponse(res, 400, 'Paytm is not configured. Please add your Paytm credentials in settings.');
    }

    const orderId = `ORD${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;
    const callbackUrl = callback_url || `${(process.env.CALLBACK_BASE_URL || '').replace(/\/+$/, '')}/api/webhooks/paytm`;

    const transaction = await Transaction.create({
      merchant_id: merchant.id,
      order_id: orderId,
      amount,
      sender_note: note || 'Payment',
      callback_url: callbackUrl,
      status: 'PENDING',
    });

    const paytmResponse = await initiateTransaction({
      merchant,
      orderId,
      amount,
      callbackUrl,
    });

    await ApiLog.create({
      merchant_id: merchant.id,
      endpoint: '/theia/api/v1/initiateTransaction',
      method: 'POST',
      request_body: { orderId, amount, note },
      response_body: paytmResponse,
      status_code: 200,
      ip_address: req.ip,
    });

    return successResponse(res, 201, 'Payment initiated successfully.', {
      order_id: orderId,
      transaction_id: transaction.id,
      amount,
      status: 'PENDING',
      txn_token: paytmResponse.txnToken,
      payment_url: paytmResponse.paymentUrl,
      mid: paytmResponse.mid,
    });
  } catch (err) {
    try {
      await ApiLog.create({
        merchant_id: req.merchant?.id,
        endpoint: '/theia/api/v1/initiateTransaction',
        method: 'POST',
        request_body: req.body,
        response_body: { error: err.message },
        status_code: err.response?.status || 500,
        ip_address: req.ip,
      });
    } catch (_) {}
    next(err);
  }
};

/**
 * POST /api/webhooks/paytm
 * Receives payment callbacks from Paytm. NOT authenticated (external webhook).
 * Verifies checksum, updates transaction, triggers merchant webhooks.
 */
export const paytmWebhook = async (req, res, next) => {
  try {
    const callbackData = { ...req.body };
    console.log('[Paytm Webhook] Data:', JSON.stringify(callbackData, null, 2));

    const { ORDERID, STATUS, TXNID, BANKTXNID, TXNAMOUNT, PAYMENTMODE, GATEWAYNAME, CHECKSUMHASH } = callbackData;

    if (!ORDERID) return errorResponse(res, 400, 'Missing ORDERID in webhook payload.');

    const transaction = await Transaction.findOne({ where: { order_id: ORDERID } });
    if (!transaction) return errorResponse(res, 404, 'Transaction not found for this order.');

    // Idempotency: skip if already processed
    if (transaction.status === 'COMPLETED' || transaction.status === 'FAILED') {
      return successResponse(res, 200, 'Already processed.');
    }

    // Fetch merchant to get Paytm key for checksum verification
    const merchant = await Merchant.findByPk(transaction.merchant_id, {
      attributes: ['id', 'paytm_merchant_key'],
    });

    if (!merchant || !merchant.paytm_merchant_key) {
      console.error(`[Paytm Webhook] No merchant key for merchant ${transaction.merchant_id}`);
      return errorResponse(res, 500, 'Merchant Paytm configuration not found.');
    }

    // Verify checksum
    if (CHECKSUMHASH) {
      const paramsForVerify = { ...callbackData };
      delete paramsForVerify.CHECKSUMHASH;

      const isValid = await verifyPaytmCallback(callbackData, merchant.paytm_merchant_key);
      if (!isValid) {
        console.error(`[Paytm Webhook] Checksum verification failed for order: ${ORDERID}`);
        await transaction.update({ status: 'FAILED' });
        return errorResponse(res, 400, 'Checksum verification failed.');
      }
    }

    // Determine final status
    const finalStatus = STATUS === 'TXN_SUCCESS' ? 'COMPLETED' : 'FAILED';

    const updateData = {
      txn_id: TXNID || null,
      bank_txn_id: BANKTXNID || null,
      status: finalStatus,
      payment_mode: PAYMENTMODE || null,
      fees: callbackData.TXNFEE ? parseFloat(callbackData.TXNFEE) : 0,
      settle_amount: TXNAMOUNT ? parseFloat(TXNAMOUNT) - (callbackData.TXNFEE ? parseFloat(callbackData.TXNFEE) : 0) : 0,
      txn_date: callbackData.TXNDATE ? new Date(callbackData.TXNDATE) : new Date(),
    };

    // Atomic DB update
    await sequelize.transaction(async (t) => {
      await transaction.update(updateData, { transaction: t });

      if (finalStatus === 'COMPLETED' && transaction.invoice_id) {
        await Invoice.update(
          { status: 'PAID', amount_paid: transaction.amount },
          { where: { id: transaction.invoice_id }, transaction: t }
        );
      }
    });

    // Log the webhook
    await ApiLog.create({
      merchant_id: transaction.merchant_id,
      endpoint: '/api/webhooks/paytm',
      method: 'POST',
      request_body: callbackData,
      response_body: { status: finalStatus, updateData },
      status_code: 200,
      ip_address: req.ip,
    });

    // Fire merchant webhooks (non-blocking)
    const event = finalStatus === 'COMPLETED' ? 'payment.success' : 'payment.failed';
    triggerMerchantWebhooks(transaction.merchant_id, event, {
      event,
      order_id: transaction.order_id,
      transaction_id: transaction.id,
      amount: transaction.amount,
      status: finalStatus,
      txn_id: TXNID,
      payment_mode: PAYMENTMODE,
      txn_date: updateData.txn_date,
    }).catch((err) => console.error('[WEBHOOK]', err.message));

    // Paytm expects a simple response
    return successResponse(res, 200, 'Webhook processed.');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payment/status/:orderId
 */
export const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const merchant = req.merchant;

    const transaction = await Transaction.findOne({
      where: { order_id: orderId, merchant_id: merchant.id },
    });
    if (!transaction) return errorResponse(res, 404, 'Transaction not found.');

    // If still pending, check with Paytm
    if (transaction.status === 'PENDING' && merchant.paytm_configured) {
      try {
        const statusResponse = await checkTransactionStatus({ merchant, orderId });
        if (statusResponse.resultStatus === 'TXN_SUCCESS') {
          await transaction.update({
            txn_id: statusResponse.txnId || null,
            bank_txn_id: statusResponse.bankTxnId || null,
            status: 'COMPLETED',
            payment_mode: statusResponse.paymentMode || null,
            txn_date: statusResponse.txnDate ? new Date(statusResponse.txnDate) : null,
          });
          await transaction.reload();
        } else if (statusResponse.resultStatus === 'TXN_FAILURE') {
          await transaction.update({ status: 'FAILED' });
          await transaction.reload();
        }
      } catch (apiErr) {
        console.error('Paytm status check failed:', apiErr.message);
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
      where, order: [[orderField, orderDir]], limit, offset,
      attributes: { exclude: ['callback_url'] },
    });

    return successResponse(res, 200, 'Transactions retrieved.', {
      transactions: rows,
      pagination: { total: count, page, limit, total_pages: Math.ceil(count / limit) },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payment/transactions/export
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
      where, order: [['created_at', 'DESC']],
      attributes: { exclude: ['callback_url'] }, raw: true,
    });
    const csv = exportTransactionsCSV(transactions);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};
