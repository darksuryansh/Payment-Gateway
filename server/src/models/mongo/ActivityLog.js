import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  merchant_id: { type: String, required: true, index: true },
  user_id: { type: String },
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed },
  ip_address: { type: String },
  timestamp: { type: Date, default: Date.now, index: true },
});

export default mongoose.model('ActivityLog', activityLogSchema);
