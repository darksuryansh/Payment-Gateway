import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Settlement = sequelize.define('settlements', {
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
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    fees: {
      type: DataTypes.DECIMAL(12, 4),
      defaultValue: 0,
    },
    net_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PROCESSED', 'PAID'),
      defaultValue: 'PENDING',
    },
    settlement_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    utr_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  });

  return Settlement;
};
