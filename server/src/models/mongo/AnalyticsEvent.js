import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema({
  merchant_id: { type: String, required: true, index: true },
  event_type: { type: String, required: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true },
});

export default mongoose.model('AnalyticsEvent', analyticsEventSchema);
