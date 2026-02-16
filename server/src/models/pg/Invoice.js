import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Invoice = sequelize.define('invoices', {
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
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    customer_phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    amount_paid: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'CANCELLED', 'OVERDUE'),
      defaultValue: 'DRAFT',
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payment_link_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: 'payment_links', key: 'id' },
    },
  });

  return Invoice;
};
