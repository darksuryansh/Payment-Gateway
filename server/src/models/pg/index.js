import sequelize from '../../config/sequelize.js';

import defineMerchant from './Merchant.js';
import defineTransaction from './Transaction.js';
import defineSettlement from './Settlement.js';
import defineRefund from './Refund.js';
import definePaymentLink from './PaymentLink.js';
import defineWebhook from './Webhook.js';
import defineUpiAccount from './UpiAccount.js';
import defineInvoice from './Invoice.js';
import defineSubscription from './Subscription.js';
import defineSubscriptionPayment from './SubscriptionPayment.js';
import defineSplitRule from './SplitRule.js';
import defineSplitTransaction from './SplitTransaction.js';
import defineTeamMember from './TeamMember.js';
import definePaymentPage from './PaymentPage.js';
import definePaymentButton from './PaymentButton.js';
import defineMerchantSetting from './MerchantSetting.js';

// Initialize models
const Merchant = defineMerchant(sequelize);
const Transaction = defineTransaction(sequelize);
const Settlement = defineSettlement(sequelize);
const Refund = defineRefund(sequelize);
const PaymentLink = definePaymentLink(sequelize);
const Webhook = defineWebhook(sequelize);
const UpiAccount = defineUpiAccount(sequelize);
const Invoice = defineInvoice(sequelize);
const Subscription = defineSubscription(sequelize);
const SubscriptionPayment = defineSubscriptionPayment(sequelize);
const SplitRule = defineSplitRule(sequelize);
const SplitTransaction = defineSplitTransaction(sequelize);
const TeamMember = defineTeamMember(sequelize);
const PaymentPage = definePaymentPage(sequelize);
const PaymentButton = definePaymentButton(sequelize);
const MerchantSetting = defineMerchantSetting(sequelize);

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

// Merchant -> Invoices
Merchant.hasMany(Invoice, { foreignKey: 'merchant_id', as: 'invoices' });
Invoice.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Invoice -> PaymentLink
Invoice.belongsTo(PaymentLink, { foreignKey: 'payment_link_id', as: 'paymentLink' });
PaymentLink.hasOne(Invoice, { foreignKey: 'payment_link_id', as: 'invoice' });

// Merchant -> Subscriptions
Merchant.hasMany(Subscription, { foreignKey: 'merchant_id', as: 'subscriptions' });
Subscription.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Subscription -> SubscriptionPayments
Subscription.hasMany(SubscriptionPayment, { foreignKey: 'subscription_id', as: 'payments' });
SubscriptionPayment.belongsTo(Subscription, { foreignKey: 'subscription_id', as: 'subscription' });

// SubscriptionPayment -> Transaction
SubscriptionPayment.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
Transaction.hasOne(SubscriptionPayment, { foreignKey: 'transaction_id', as: 'subscriptionPayment' });

// Transaction -> Subscription
Transaction.belongsTo(Subscription, { foreignKey: 'subscription_id', as: 'subscription' });

// Transaction -> Invoice
Transaction.belongsTo(Invoice, { foreignKey: 'invoice_id', as: 'invoice' });

// Merchant -> SplitRules
Merchant.hasMany(SplitRule, { foreignKey: 'merchant_id', as: 'splitRules' });
SplitRule.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// SplitRule -> SplitTransactions
SplitRule.hasMany(SplitTransaction, { foreignKey: 'split_rule_id', as: 'splitTransactions' });
SplitTransaction.belongsTo(SplitRule, { foreignKey: 'split_rule_id', as: 'splitRule' });

// Transaction -> SplitTransactions
Transaction.hasMany(SplitTransaction, { foreignKey: 'transaction_id', as: 'splitTransactions' });
SplitTransaction.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });

// Transaction -> SplitRule
Transaction.belongsTo(SplitRule, { foreignKey: 'split_rule_id', as: 'splitRule' });

// Merchant -> TeamMembers
Merchant.hasMany(TeamMember, { foreignKey: 'merchant_id', as: 'teamMembers' });
TeamMember.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Merchant -> PaymentPages
Merchant.hasMany(PaymentPage, { foreignKey: 'merchant_id', as: 'paymentPages' });
PaymentPage.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Merchant -> PaymentButtons
Merchant.hasMany(PaymentButton, { foreignKey: 'merchant_id', as: 'paymentButtons' });
PaymentButton.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

// Merchant -> MerchantSetting (one-to-one)
Merchant.hasOne(MerchantSetting, { foreignKey: 'merchant_id', as: 'settings' });
MerchantSetting.belongsTo(Merchant, { foreignKey: 'merchant_id', as: 'merchant' });

export {
  sequelize,
  Merchant,
  Transaction,
  Settlement,
  Refund,
  PaymentLink,
  Webhook,
  UpiAccount,
  Invoice,
  Subscription,
  SubscriptionPayment,
  SplitRule,
  SplitTransaction,
  TeamMember,
  PaymentPage,
  PaymentButton,
  MerchantSetting,
};
