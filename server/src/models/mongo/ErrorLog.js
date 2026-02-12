import mongoose from 'mongoose';

const errorLogSchema = new mongoose.Schema({
  source: { type: String, required: true },
  error_message: { type: String, required: true },
  stack_trace: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

errorLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model('ErrorLog', errorLogSchema);
