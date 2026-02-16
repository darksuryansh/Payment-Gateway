import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SplitTransaction = sequelize.define('split_transactions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'transactions', key: 'id' },
    },
    split_rule_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'split_rules', key: 'id' },
    },
    recipient_upi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    recipient_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'TRANSFERRED', 'FAILED'),
      defaultValue: 'PENDING',
    },
    transfer_utr: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  });

  return SplitTransaction;
};
