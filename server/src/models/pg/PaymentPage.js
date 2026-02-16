import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PaymentPage = sequelize.define('payment_pages', {
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    theme_color: {
      type: DataTypes.STRING(7),
      defaultValue: '#000000',
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    success_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    cancel_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  });

  return PaymentPage;
};
