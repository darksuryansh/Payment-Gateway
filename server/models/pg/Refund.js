import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Refund = sequelize.define('refunds', {
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
    merchant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'merchants', key: 'id' },
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PROCESSED', 'FAILED'),
      defaultValue: 'PENDING',
    },
    reason: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    refund_id: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
    },
  });

  return Refund;
};
