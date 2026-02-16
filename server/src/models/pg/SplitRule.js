import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SplitRule = sequelize.define('split_rules', {
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    split_type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    recipients: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  });

  return SplitRule;
};
