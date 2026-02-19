import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connections
import { connectPG, syncDatabase, connectMongo } from './src/config/db.js';

// Import models (triggers registration + associations)
import './src/models/pg/index.js';

// Cron jobs
import { initCronJobs } from './src/cron/index.js';

// Routes
import authRoutes from './src/routes/auth.routes.js';
import merchantRoutes from './src/routes/merchant.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import webhookRoutes from './src/routes/webhook.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import settlementRoutes from './src/routes/settlement.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import paymentLinkRoutes from './src/routes/paymentLink.routes.js';
import qrcodeRoutes from './src/routes/qrcode.routes.js';
import paymentPageRoutes from './src/routes/paymentPage.routes.js';
import paymentButtonRoutes from './src/routes/paymentButton.routes.js';
import invoiceRoutes from './src/routes/invoice.routes.js';
import subscriptionRoutes from './src/routes/subscription.routes.js';
import refundRoutes from './src/routes/refund.routes.js';
import splitRoutes from './src/routes/splitPayment.routes.js';
import teamRoutes from './src/routes/team.routes.js';

// Middleware
import { errorHandler } from './src/middleware/error.middleware.js';

const app = express();

// --- EJS View Engine ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// --- Static Files ---
app.use('/static', express.static(path.join(__dirname, 'src', 'public')));

// --- Security ---
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts in EJS templates
}));
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
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payment-links', paymentLinkRoutes);
app.use('/api/qrcodes', qrcodeRoutes);
app.use('/api/payment-pages', paymentPageRoutes);
app.use('/api/payment-buttons', paymentButtonRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/splits', splitRoutes);
app.use('/api/team', teamRoutes);

// --- Public Routes (Hosted Payment Pages & Buttons) ---
app.use('/', paymentPageRoutes);
app.use('/', paymentLinkRoutes);
app.use('/', paymentButtonRoutes);

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

  // Initialize cron jobs
  initCronJobs();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();
