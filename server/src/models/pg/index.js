import sequelize from '../../config/sequelize.js';

import defineMerchant from './Merchant.js';
import defineTransaction from './Transaction.js';
import defineSettlement from './Settlement.js';
import defineRefund from './Refund.js';
import definePaymentLink from './PaymentLink.js';
import defineWebhook from './Webhook.js';
import defineUpiAccount from './UpiAccount.js';

// Initialize models
const Merchant = defineMerchant(sequelize);
const Transaction = defineTransaction(sequelize);
const Settlement = defineSettlement(sequelize);
const Refund = defineRefund(sequelize);
const PaymentLink = definePaymentLink(sequelize);
const Webhook = defineWebhook(sequelize);
const UpiAccount = defineUpiAccount(sequelize);

// --- Associations ---

// Merchant -> Transactions
Merchant.hasMany(Transaction, { foreignKey: 'merchant_id', as: 'transactions' });
Transaction.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Merchant -> Settlements
Merchant.hasMany(Settlement, { foreignKey: 'merchant_id', as: 'settlements' });
Settlement.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Merchant -> Refunds
Merchant.hasMany(Refund, { foreignKey: 'merchant_id', as: 'refunds' });
Refund.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Transaction -> Refunds
Transaction.hasMany(Refund, { foreignKey: 'transaction_id', as: 'refunds' });
Refund.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });

// Merchant -> PaymentLinks
Merchant.hasMany(PaymentLink, { foreignKey: 'merchant_id', as: 'paymentLinks' });
PaymentLink.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Merchant -> Webhooks
Merchant.hasMany(Webhook, { foreignKey: 'merchant_id', as: 'webhooks' });
Webhook.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Merchant -> UpiAccounts
Merchant.hasMany(UpiAccount, { foreignKey: 'merchant_id', as: 'upiAccounts' });
UpiAccount.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

export {
  sequelize,
  Merchant,
  Transaction,
  Settlement,
  Refund,
  PaymentLink,
  Webhook,
  UpiAccount,
};
