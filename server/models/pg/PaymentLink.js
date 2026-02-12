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
  });

  return PaymentLink;
};
