import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const MerchantSetting = sequelize.define('merchant_settings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    merchant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'merchants', key: 'id' },
    },
    notification_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notification_sms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notification_webhook: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    auto_settlement: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    settlement_schedule: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
      defaultValue: 'daily',
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ip_whitelist: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  });

  return MerchantSetting;
};
