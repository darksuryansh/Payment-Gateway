import mongoose from 'mongoose';

const notificationLogSchema = new mongoose.Schema({
  merchant_id: { type: String, required: true, index: true },
  type: { type: String, required: true },
  recipient: { type: String, required: true },
  subject: { type: String },
  status: { type: String, enum: ['SENT', 'FAILED', 'PENDING'], default: 'PENDING' },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('NotificationLog', notificationLogSchema);
