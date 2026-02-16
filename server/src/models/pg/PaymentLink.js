import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PaymentLink = sequelize.define('payment_links', {
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
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    short_url: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'PAID'),
      defaultValue: 'ACTIVE',
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    redirect_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_partial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    min_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  });

  return PaymentLink;
};
