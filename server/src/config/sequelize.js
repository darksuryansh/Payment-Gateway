import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbOptions = {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
};

// Use POSTGRES_URI if available, otherwise fall back to individual PG_* vars
const sequelize = process.env.POSTGRES_URI
  ? new Sequelize(process.env.POSTGRES_URI, dbOptions)
  : new Sequelize(
      process.env.PG_DATABASE,
      process.env.PG_USER,
      process.env.PG_PASSWORD,
      {
        ...dbOptions,
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
      }
    );

export default sequelize;
