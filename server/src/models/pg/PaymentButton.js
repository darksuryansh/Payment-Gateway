import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PaymentButton = sequelize.define('payment_buttons', {
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
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    style: {
      type: DataTypes.JSONB,
      defaultValue: { color: '#000000', size: 'medium', borderRadius: '4px', theme: 'light' },
    },
    redirect_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    button_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return PaymentButton;
};
