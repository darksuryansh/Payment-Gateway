import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Merchant = sequelize.define('merchants', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    business_type: {
      type: DataTypes.ENUM('individual', 'partnership', 'pvt_ltd', 'llp', 'other'),
      defaultValue: 'individual',
    },
    website: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    api_key: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: true,
    },
    api_secret: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Merchant;
};
