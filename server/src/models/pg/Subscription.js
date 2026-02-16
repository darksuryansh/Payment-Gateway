import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Subscription = sequelize.define('subscriptions', {
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
    plan_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'INR',
    },
    interval: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
      allowNull: false,
    },
    interval_count: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    customer_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED'),
      defaultValue: 'ACTIVE',
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    next_billing: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    retry_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    max_retries: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  });

  return Subscription;
};
