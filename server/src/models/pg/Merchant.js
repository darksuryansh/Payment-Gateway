import { DataTypes } from 'sequelize';
import { encrypt, decrypt } from '../../utils/encryption.js';

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
    test_api_key: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: true,
    },
    test_api_secret: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: true,
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    gst_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    pan_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    merchant_tier: {
      type: DataTypes.ENUM('tier_1', 'tier_2'),
      defaultValue: 'tier_1',
    },
    paytm_mid: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    paytm_merchant_key: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    paytm_website: {
      type: DataTypes.STRING(50),
      defaultValue: 'DEFAULT',
    },
    paytm_configured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    hooks: {
      beforeCreate(merchant) {
        if (merchant.paytm_merchant_key && !merchant.paytm_merchant_key.includes(':')) {
          merchant.paytm_merchant_key = encrypt(merchant.paytm_merchant_key);
        }
      },
      beforeUpdate(merchant) {
        if (merchant.changed('paytm_merchant_key') && merchant.paytm_merchant_key && !merchant.paytm_merchant_key.includes(':')) {
          merchant.paytm_merchant_key = encrypt(merchant.paytm_merchant_key);
        }
      },
      afterFind(result) {
        if (!result) return;
        const decryptKey = (m) => {
          if (m.paytm_merchant_key && m.paytm_merchant_key.includes(':')) {
            try {
              m.paytm_merchant_key = decrypt(m.paytm_merchant_key);
            } catch {
              // If decryption fails, leave as-is
            }
          }
        };
        if (Array.isArray(result)) {
          result.forEach(decryptKey);
        } else {
          decryptKey(result);
        }
      },
    },
  });

  return Merchant;
};
