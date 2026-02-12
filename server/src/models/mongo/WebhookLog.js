import mongoose from 'mongoose';

const webhookLogSchema = new mongoose.Schema({
  merchant_id: { type: String, required: true, index: true },
  webhook_id: { type: String, required: true },
  event: { type: String, required: true },
  payload: { type: mongoose.Schema.Types.Mixed },
  response_status: { type: Number },
  attempts: { type: Number, default: 0 },
  last_attempt: { type: Date },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('WebhookLog', webhookLogSchema);
