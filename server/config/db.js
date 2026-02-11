import { Pool } from 'pg';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// --- 1. PostgreSQL Connection ---
const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const connectPG = async () => {
  try {
    const client = await pgPool.connect();
    console.log('✅ PostgreSQL Connected (Docker)');
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL Connection Failed:', err.message);
    process.exit(1);
  }
};

// --- 2. MongoDB Connection ---
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected (Atlas)');
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};

export { pgPool, connectPG, connectMongo };