import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const TeamMember = sequelize.define('team_members', {
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
    role: {
      type: DataTypes.ENUM('owner', 'admin', 'manager', 'viewer'),
      defaultValue: 'viewer',
    },
    permissions: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    invited_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  });

  return TeamMember;
};
