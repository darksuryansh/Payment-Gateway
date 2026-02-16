import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Transaction = sequelize.define('transactions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    merchant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'merchants', key: 'id' },
    },
    order_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    txn_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bank_txn_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    fees: {
      type: DataTypes.DECIMAL(12, 4),
      defaultValue: 0,
    },
    settle_amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
      defaultValue: 'PENDING',
    },
    payment_mode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    sender_vpa: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    sender_note: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    payee_vpa: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    utr: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    callback_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    txn_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    invoice_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'invoices', key: 'id' },
    },
    subscription_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'subscriptions', key: 'id' },
    },
    split_rule_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'split_rules', key: 'id' },
    },
    environment: {
      type: DataTypes.ENUM('test', 'live'),
      defaultValue: 'live',
    },
  });

  return Transaction;
};
