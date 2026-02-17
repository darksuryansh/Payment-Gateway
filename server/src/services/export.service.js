import { Parser } from 'json2csv';

export const exportTransactionsCSV = (transactions) => {
  const fields = [
    { label: 'Order ID', value: 'order_id' },
    { label: 'Transaction ID', value: 'txn_id' },
    { label: 'Amount', value: 'amount' },
    { label: 'Fees', value: 'fees' },
    { label: 'Settle Amount', value: 'settle_amount' },
    { label: 'Status', value: 'status' },
    { label: 'Payment Mode', value: 'payment_mode' },
    { label: 'Sender VPA', value: 'sender_vpa' },
    { label: 'UTR', value: 'utr' },
    { label: 'Date', value: 'created_at' },
  ];

  const parser = new Parser({ fields });
  return parser.parse(transactions);
};

export const exportSettlementsCSV = (settlements) => {
  const fields = [
    { label: 'Settlement ID', value: 'id' },
    { label: 'Total Amount', value: 'total_amount' },
    { label: 'Fees', value: 'fees' },
    { label: 'Net Amount', value: 'net_amount' },
    { label: 'Status', value: 'status' },
    { label: 'Settlement Date', value: 'settlement_date' },
    { label: 'UTR Number', value: 'utr_number' },
  ];

  const parser = new Parser({ fields });
  return parser.parse(settlements);
};
