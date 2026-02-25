import axios from 'axios';
import PaytmChecksum from 'paytmchecksum';

const getBaseUrl = () => {
  return process.env.PAYTM_ENV === 'staging'
    ? 'https://securegw-stage.paytm.in'
    : 'https://securegw.paytm.in';
};

/**
 * Initiate a transaction with Paytm.
 * Returns a txnToken that the frontend uses to open Paytm's payment page.
 */
export const initiateTransaction = async ({ merchant, orderId, amount, callbackUrl }) => {
  const { paytm_mid: mid, paytm_merchant_key: merchantKey, paytm_website: website } = merchant;

  const paytmParams = {
    body: {
      requestType: 'Payment',
      mid,
      websiteName: website || 'DEFAULT',
      orderId,
      callbackUrl,
      txnAmount: {
        value: String(parseFloat(amount).toFixed(2)),
        currency: 'INR',
      },
      userInfo: {
        custId: `CUST_${merchant.id.substring(0, 8)}`,
      },
    },
  };

  const checksum = await PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    merchantKey
  );

  paytmParams.head = {
    signature: checksum,
  };

  const url = `${getBaseUrl()}/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`;

  const { data } = await axios.post(url, paytmParams, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (data.body?.resultInfo?.resultStatus !== 'S') {
    throw new Error(
      data.body?.resultInfo?.resultMsg || 'Failed to initiate Paytm transaction'
    );
  }

  const baseUrl = getBaseUrl();
  return {
    txnToken: data.body.txnToken,
    orderId,
    mid,
    amount: String(parseFloat(amount).toFixed(2)),
    paymentUrl: `${baseUrl}/theia/api/v1/showPaymentPage?mid=${mid}&orderId=${orderId}&txnToken=${data.body.txnToken}`,
  };
};

/**
 * Create a dynamic QR code via Paytm API.
 * Returns QR data (image/string) that the customer scans to pay.
 */
export const createDynamicQR = async ({ merchant, orderId, amount }) => {
  const { paytm_mid: mid, paytm_merchant_key: merchantKey } = merchant;

  const paytmParams = {
    body: {
      mid,
      orderId,
      amount: String(parseFloat(amount).toFixed(2)),
      businessType: 'UPI_QR_CODE',
    },
  };

  const checksum = await PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    merchantKey
  );

  paytmParams.head = {
    tokenType: 'CHECKSUM',
    signature: checksum,
  };

  const url = `${getBaseUrl()}/paymentservices/qr/create`;

  const { data } = await axios.post(url, paytmParams, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (data.body?.resultInfo?.resultStatus !== 'SUCCESS') {
    throw new Error(
      data.body?.resultInfo?.resultMsg || 'Failed to create Paytm QR code'
    );
  }

  return {
    qrData: data.body.qrData,
    qrCodeId: data.body.qrCodeId,
    image: data.body.image,
    orderId,
    amount,
  };
};

/**
 * Check the status of a transaction with Paytm.
 */
export const checkTransactionStatus = async ({ merchant, orderId }) => {
  const { paytm_mid: mid, paytm_merchant_key: merchantKey } = merchant;

  const paytmParams = {
    body: {
      mid,
      orderId,
    },
  };

  const checksum = await PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    merchantKey
  );

  paytmParams.head = {
    signature: checksum,
  };

  const url = `${getBaseUrl()}/v3/order/status`;

  const { data } = await axios.post(url, paytmParams, {
    headers: { 'Content-Type': 'application/json' },
  });

  return {
    resultStatus: data.body?.resultInfo?.resultStatus,
    resultMsg: data.body?.resultInfo?.resultMsg,
    txnId: data.body?.txnId,
    bankTxnId: data.body?.bankTxnId,
    orderId: data.body?.orderId,
    txnAmount: data.body?.txnAmount,
    txnDate: data.body?.txnDate,
    gatewayName: data.body?.gatewayName,
    bankName: data.body?.bankName,
    paymentMode: data.body?.paymentMode,
  };
};

/**
 * Verify the checksum from a Paytm webhook/callback.
 */
export const verifyPaytmCallback = async (params, merchantKey) => {
  const checksum = params.CHECKSUMHASH;
  if (!checksum) return false;

  const paramsWithoutChecksum = { ...params };
  delete paramsWithoutChecksum.CHECKSUMHASH;

  return PaytmChecksum.verifySignature(
    paramsWithoutChecksum,
    merchantKey,
    checksum
  );
};
