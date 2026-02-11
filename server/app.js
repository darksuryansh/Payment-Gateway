
import express from 'express';
import { connectPG, connectMongo } from './config/db.js';

import dotenv from 'dotenv';
dotenv.config();


const app = express();

// Middleware
app.use(express.json()); // To parse JSON bodies

// Initialize Databases
const startServer = async () => {
  await connectPG();      // Connect to Postgres
  await connectMongo();   // Connect to Mongo

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    
  });
};

startServer();

// Basic Test Route
app.get('/', (req, res) => {
  res.send('UPI Payment Gateway API is Running...');
});