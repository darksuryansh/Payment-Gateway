import mongoose from 'mongoose';

const kycDocumentSchema = new mongoose.Schema({
  merchant_id: { type: String, required: true, index: true },
  doc_type: { type: String, required: true },
  file_url: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
  verified_at: { type: Date },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model('KycDocument', kycDocumentSchema);
