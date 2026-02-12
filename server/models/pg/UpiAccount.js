import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UpiAccount = sequelize.define('upi_accounts', {
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
    upi_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return UpiAccount;
};
