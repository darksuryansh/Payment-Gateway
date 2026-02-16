import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SubscriptionPayment = sequelize.define('subscription_payments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    subscription_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'subscriptions', key: 'id' },
    },
    transaction_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'transactions', key: 'id' },
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED', 'RETRYING'),
      defaultValue: 'PENDING',
    },
    billing_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    attempt_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    next_retry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return SubscriptionPayment;
};
