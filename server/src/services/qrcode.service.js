import QRCode from 'qrcode';

export const generateUpiDeepLink = ({ payeeVpa, payeeName, amount, note, txnId }) => {
  const params = new URLSearchParams();
  params.set('pa', payeeVpa);
  if (payeeName) params.set('pn', payeeName);
  if (amount) params.set('am', String(amount));
  if (note) params.set('tn', note);
  if (txnId) params.set('tr', txnId);
  params.set('cu', 'INR');

  return `upi://pay?${params.toString()}`;
};

export const generatePaymentQR = async (data, format = 'png') => {
  if (format === 'svg') {
    return await QRCode.toString(data, { type: 'svg' });
  }

  // Returns base64 PNG data URL
  return await QRCode.toDataURL(data, {
    width: 400,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
};

export const generateBulkQR = async (items) => {
  const results = [];

  for (const item of items) {
    const qrData = item.url || generateUpiDeepLink(item);
    const qrImage = await generatePaymentQR(qrData, item.format || 'png');

    results.push({
      id: item.id || null,
      label: item.label || null,
      qr_data: qrData,
      qr_image: qrImage,
    });
  }

  return results;
};
