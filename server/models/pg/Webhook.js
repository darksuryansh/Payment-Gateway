import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Webhook = sequelize.define('webhooks', {
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
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    events: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    secret: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Webhook;
};
