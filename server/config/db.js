import mongoose from 'mongoose';
import dotenv from 'dotenv';
import sequelize from './sequelize.js';

dotenv.config();

// --- 1. PostgreSQL Connection (Sequelize) ---
const connectPG = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected via Sequelize (Docker)');
  } catch (err) {
    console.error('PostgreSQL Connection Failed:', err.message);
    process.exit(1);
  }
};

// --- 2. Sync Sequelize Models ---
const syncDatabase = async () => {
  try {
    const syncOptions = process.env.NODE_ENV === 'development'
      ? { alter: true }
      : {};
    await sequelize.sync(syncOptions);
    console.log('PostgreSQL tables synced');
  } catch (err) {
    console.error('Database sync failed:', err.message);
    process.exit(1);
  }
};

// --- 3. MongoDB Connection ---
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected (Atlas)');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};

export { connectPG, syncDatabase, connectMongo };
