import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

// Database connections
import { connectPG, syncDatabase, connectMongo } from './src/config/db.js';

// Import models (triggers registration + associations)
import './src/models/pg/index.js';

// Routes
import authRoutes from './src/routes/auth.routes.js';
import merchantRoutes from './src/routes/merchant.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import webhookRoutes from './src/routes/webhook.routes.js';

// Middleware
import { errorHandler } from './src/middleware/error.middleware.js';

const app = express();

// --- Security ---
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'development'
    ? '*'
    : process.env.ALLOWED_ORIGINS?.split(',') || [],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Api-Key'],
  credentials: true,
}));

// --- Body Parsing ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Health Check ---
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'UPI Payment Gateway API is running.',
    environment: process.env.NODE_ENV,
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// --- Global Error Handler (must be last) ---
app.use(errorHandler);

// --- Initialize and Start ---
const startServer = async () => {
  await connectPG();
  await connectMongo();
  await syncDatabase();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();
