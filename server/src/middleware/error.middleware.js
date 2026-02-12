import ErrorLog from '../models/mongo/ErrorLog.js';

/**
 * Global error handling middleware.
 * Must be the LAST middleware registered in app.js.
 */
export const errorHandler = async (err, req, res, next) => {
  // Log error to MongoDB
  try {
    await ErrorLog.create({
      source: `${req.method} ${req.originalUrl}`,
      error_message: err.message,
      stack_trace: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      metadata: {
        merchant_id: req.merchant?.id,
        body: req.body,
        params: req.params,
        ip: req.ip,
      },
    });
  } catch (logErr) {
    console.error('Failed to log error to MongoDB:', logErr.message);
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
