import mongoose from 'mongoose';

const apiLogSchema = new mongoose.Schema({
  merchant_id: { type: String, index: true },
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  request_body: { type: mongoose.Schema.Types.Mixed },
  response_body: { type: mongoose.Schema.Types.Mixed },
  status_code: { type: Number },
  ip_address: { type: String },
  timestamp: { type: Date, default: Date.now },
});

apiLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.model('ApiLog', apiLogSchema);
