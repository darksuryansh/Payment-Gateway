import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, Invoice, sequelize } from '../models/pg/index.js';
import { processPayment, checkTransactionStatus, verifyCallbackChecksum } from '../services/bharatEasy.service.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { exportTransactionsCSV } from '../services/export.service.js';
import { triggerMerchantWebhooks } from '../services/webhook.service.js';
import ApiLog from '../models/mongo/ApiLog.js';

/**
 * POST /api/payment/initiate
 */
export const initiatePayment = async (req, res, next) => {
  try {
    const { amount, note, callback_url } = req.body;
    const merchantId = req.merchant.id;
    const orderId = `ORD${uuidv4().replace(/-/g, '').substring(0, 16).toUpperCase()}`;

    const transaction = await Transaction.create({
      merchant_id: merchantId,
      order_id: orderId,
      amount,
      sender_note: note || 'Payment',
      callback_url: callback_url || `${(process.env.CALLBACK_BASE_URL || '').replace(/\/+$/, '')}/api/payment/callback`,
      status: 'PENDING',
    });

    const bharatEasyResponse = await processPayment({
      orderId,
      txnAmount: amount,
      txnNote: note || 'Payment',
      callbackUrl: `${(process.env.CALLBACK_BASE_URL || '').replace(/\/+$/, '')}/api/payment/callback?orderId=${orderId}`,
    });

    await ApiLog.create({
      merchant_id: merchantId, endpoint: '/order/process', method: 'POST',
      request_body: { orderId, txnAmount: amount, txnNote: note },
      response_body: bharatEasyResponse, status_code: 200, ip_address: req.ip,
    });

    return successResponse(res, 201, 'Payment initiated successfully.', {
      order_id: orderId, transaction_id: transaction.id,
      amount, status: 'PENDING', gateway_response: bharatEasyResponse,
    });
  } catch (err) {
    try {
      await ApiLog.create({
        merchant_id: req.merchant?.id, endpoint: '/order/process', method: 'POST',
        request_body: req.body, response_body: { error: err.message },
        status_code: err.response?.status || 500, ip_address: req.ip,
      });
    } catch (_) {}
    next(err);
  }
};

/**
 * POST /api/payment/callback
 * Called by BharatEasy after payment. NOT authenticated.
 * Uses DB transaction for atomicity + idempotency guard.
 */
export const paymentCallback = async (req, res, next) => {
  try {
    const callbackData = { ...req.query, ...req.body };
    console.log('[Callback] BharatEasy callback data:', JSON.stringify(callbackData, null, 2));
    const { status, checksum, hash, message, orderId: bodyOrderId, order_id: bodySnakeOrderId } = callbackData;
    const orderId = req.query.orderId || bodyOrderId || bodySnakeOrderId;

    if (!orderId) return errorResponse(res, 400, 'Missing orderId in callback payload.');

    const transaction = await Transaction.findOne({ where: { order_id: orderId } });
    if (!transaction) return errorResponse(res, 404, 'Transaction not found for this order.');

    // Idempotency: skip if already processed
    if (transaction.status === 'COMPLETED' || transaction.status === 'FAILED') {
      if (req.headers.accept?.includes('text/html')) {
        const view = transaction.status === 'COMPLETED' ? 'payment-success' : 'payment-failed';
        return res.status(200).render(view, {
          title: transaction.status === 'COMPLETED' ? 'Payment Successful' : 'Payment Failed',
          message: transaction.status === 'COMPLETED'
            ? 'Your payment has been processed successfully.'
            : 'Your payment could not be processed.',
          order_id: orderId,
        });
      }
      return successResponse(res, 200, 'Already processed.');
    }

    // If no status at all (e.g. GET redirect from failed gateway), check transaction status
    if (!status) {
      try {
        const statusResponse = await checkTransactionStatus(orderId);
        if (statusResponse.status === 'SUCCESS' && statusResponse.result) {
          const r = statusResponse.result;
          const finalStatus = r.txnStatus === 'COMPLETED' ? 'COMPLETED' : 'FAILED';
          await transaction.update({
            txn_id: r.txnId || null, bank_txn_id: r.bankTxnId || null,
            fees: r.fees ? parseFloat(r.fees) : 0,
            settle_amount: r.settle_amount ? parseFloat(r.settle_amount) : 0,
            status: finalStatus, payment_mode: r.paymentMode || null,
            sender_vpa: r.sender_vpa || null, utr: r.utr || null,
            txn_date: r.txnDate ? new Date(r.txnDate) : null,
          });
          if (req.headers.accept?.includes('text/html')) {
            const view = finalStatus === 'COMPLETED' ? 'payment-success' : 'payment-failed';
            return res.status(200).render(view, {
              title: finalStatus === 'COMPLETED' ? 'Payment Successful' : 'Payment Failed',
              message: finalStatus === 'COMPLETED'
                ? 'Your payment has been processed successfully.'
                : 'Your payment could not be processed.',
              order_id: orderId,
            });
          }
          return successResponse(res, 200, 'Callback processed.', { status: finalStatus });
        }
      } catch (statusErr) {
        console.error('[Callback] Status check failed for', orderId, statusErr.message);
      }
      // If status check also failed, mark as failed
      await transaction.update({ status: 'FAILED' });
      if (req.headers.accept?.includes('text/html')) {
        return res.status(200).render('payment-failed', {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          order_id: orderId,
        });
      }
      return successResponse(res, 200, 'Callback processed.', { status: 'FAILED' });
    }

    // FAILED callback — mark as failed, no need to call status API
    if (status !== 'SUCCESS') {
      await transaction.update({ status: 'FAILED' });
      await ApiLog.create({
        merchant_id: transaction.merchant_id, endpoint: '/api/payment/callback',
        method: req.method, request_body: req.body || {}, response_body: { status: 'FAILED', message: req.body?.message || 'Payment failed' },
        status_code: 200, ip_address: req.ip,
      });

      triggerMerchantWebhooks(transaction.merchant_id, 'payment.failed', {
        event: 'payment.failed', order_id: orderId, transaction_id: transaction.id,
        amount: transaction.amount, status: 'FAILED',
      }).catch((err) => console.error('[WEBHOOK]', err.message));

      // If browser request, render HTML page; otherwise return JSON
      if (req.headers.accept?.includes('text/html')) {
        return res.status(200).render('payment-failed', {
          title: 'Payment Failed',
          message: req.body?.message || 'Your payment could not be processed. Please try again.',
          order_id: orderId,
        });
      }
      return successResponse(res, 200, 'Callback processed.');
    }

    // SUCCESS callback — verify checksum using hash field (matches txnResult.php flow)
    // PHP flow: hash_decrypt($hash, $secret) → verifySignature($decrypted, $secret, $checksum)
    let hashData = null;
    if (checksum && checksum !== 'false') {
      const result = verifyCallbackChecksum({ hash, checksum });
      if (!result.verified) {
        console.error(`Checksum verification failed for order: ${orderId}`);
        await transaction.update({ status: 'FAILED' });
        return errorResponse(res, 400, 'Checksum verification failed.');
      }
      hashData = result.data; // Parsed transaction details from decrypted hash
      console.log('[Callback] Decrypted hash data:', JSON.stringify(hashData, null, 2));
    }

    // Build update from decrypted hash data (primary) + status API (fallback/extra details)
    let finalStatus = 'FAILED';
    let updateData = { status: 'FAILED' };

    // If hash decryption gave us transaction data, use it
    if (hashData) {
      finalStatus = hashData.txnStatus === 'COMPLETED' ? 'COMPLETED' : 'FAILED';
      updateData = {
        txn_id: hashData.txnId || null,
        bank_txn_id: hashData.bankTxnId || null,
        fees: hashData.fees ? parseFloat(hashData.fees) : 0,
        settle_amount: hashData.settle_amount ? parseFloat(hashData.settle_amount) : 0,
        status: finalStatus,
        payment_mode: hashData.paymentMode || null,
        sender_vpa: hashData.sender_vpa || null,
        sender_note: hashData.sender_note || null,
        payee_vpa: hashData.payee_vpa || null,
        utr: hashData.utr || null,
        txn_date: hashData.txnDate ? new Date(hashData.txnDate) : null,
      };
    }

    // Also fetch from BharatEasy status API for completeness / fallback
    try {
      const statusResponse = await checkTransactionStatus(orderId);
      if (statusResponse.status === 'SUCCESS' && statusResponse.result) {
        const r = statusResponse.result;
        const apiStatus = r.txnStatus === 'COMPLETED' ? 'COMPLETED' : 'FAILED';
        // If hash data was missing or incomplete, use status API data
        if (!hashData) {
          finalStatus = apiStatus;
          updateData = {
            txn_id: r.txnId || null,
            bank_txn_id: r.bankTxnId || null,
            fees: r.fees ? parseFloat(r.fees) : 0,
            settle_amount: r.settle_amount ? parseFloat(r.settle_amount) : 0,
            status: finalStatus,
            payment_mode: r.paymentMode || null,
            sender_vpa: r.sender_vpa || null,
            sender_note: r.sender_note || null,
            payee_vpa: r.payee_vpa || null,
            utr: r.utr || null,
            txn_date: r.txnDate ? new Date(r.txnDate) : null,
          };
        } else {
          // Fill in any fields that hash data might be missing
          updateData.txn_id = updateData.txn_id || r.txnId || null;
          updateData.bank_txn_id = updateData.bank_txn_id || r.bankTxnId || null;
          updateData.utr = updateData.utr || r.utr || null;
          updateData.payment_mode = updateData.payment_mode || r.paymentMode || null;
          updateData.sender_vpa = updateData.sender_vpa || r.sender_vpa || null;
          updateData.fees = updateData.fees || (r.fees ? parseFloat(r.fees) : 0);
          updateData.settle_amount = updateData.settle_amount || (r.settle_amount ? parseFloat(r.settle_amount) : 0);
        }
      }
    } catch (statusErr) {
      console.error('[Callback] Status API check failed for', orderId, statusErr.message);
      // Continue with hash data if available
    }

    // Atomic DB update
    await sequelize.transaction(async (t) => {
      await transaction.update(updateData, { transaction: t });

      // If completed and linked to an invoice, mark invoice as PAID
      if (finalStatus === 'COMPLETED' && transaction.invoice_id) {
        await Invoice.update(
          { status: 'PAID', amount_paid: transaction.amount },
          { where: { id: transaction.invoice_id }, transaction: t }
        );
      }
    });

    // Log the callback
    await ApiLog.create({
      merchant_id: transaction.merchant_id, endpoint: '/api/payment/callback',
      method: 'POST', request_body: req.body, response_body: { hashData, updateData },
      status_code: 200, ip_address: req.ip,
    });

    // Fire webhooks non-blocking (after commit)
    const event = finalStatus === 'COMPLETED' ? 'payment.success' : 'payment.failed';
    triggerMerchantWebhooks(transaction.merchant_id, event, {
      event,
      order_id: transaction.order_id,
      transaction_id: transaction.id,
      amount: transaction.amount,
      status: finalStatus,
      utr: transaction.utr,
      payment_mode: transaction.payment_mode,
      txn_date: transaction.txn_date,
    }).catch((err) => console.error('[WEBHOOK]', err.message));

    // If browser request, render HTML page; otherwise return JSON
    if (req.headers.accept?.includes('text/html')) {
      if (finalStatus === 'COMPLETED') {
        return res.status(200).render('payment-success', {
          message: 'Your payment has been processed successfully.',
          order_id: orderId,
        });
      }
      return res.status(200).render('payment-failed', {
        title: 'Payment Failed',
        message: 'Your payment could not be processed. Please try again.',
      });
    }
    return successResponse(res, 200, 'Callback processed.');
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
    const transaction = await Transaction.findOne({
      where: { order_id: orderId, merchant_id: req.merchant.id },
    });
    if (!transaction) return errorResponse(res, 404, 'Transaction not found.');

    if (transaction.status === 'PENDING') {
      try {
        const statusResponse = await checkTransactionStatus(orderId);
        if (statusResponse.status === 'SUCCESS' && statusResponse.result) {
          const r = statusResponse.result;
          await transaction.update({
            txn_id: r.txnId || null, bank_txn_id: r.bankTxnId || null,
            fees: r.fees ? parseFloat(r.fees) : 0,
            settle_amount: r.settle_amount ? parseFloat(r.settle_amount) : 0,
            status: r.txnStatus === 'COMPLETED' ? 'COMPLETED' : r.txnStatus === 'FAILED' ? 'FAILED' : 'PENDING',
            payment_mode: r.paymentMode || null, sender_vpa: r.sender_vpa || null,
            utr: r.utr || null, txn_date: r.txnDate ? new Date(r.txnDate) : null,
          });
          await transaction.reload();
        }
      } catch (apiErr) {
        console.error('BharatEasy status check failed:', apiErr.message);
      }
    }

    return successResponse(res, 200, 'Transaction status retrieved.', {
      transaction: {
        order_id: transaction.order_id, txn_id: transaction.txn_id,
        amount: transaction.amount, fees: transaction.fees,
        settle_amount: transaction.settle_amount, status: transaction.status,
        payment_mode: transaction.payment_mode, sender_vpa: transaction.sender_vpa,
        utr: transaction.utr, txn_date: transaction.txn_date, created_at: transaction.created_at,
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
