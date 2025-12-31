const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  enrollment: { type: Schema.Types.ObjectId, ref: 'Enrollment' },
  amount: { type: Number, required: true },
  provider: { type: String },
  providerPaymentId: { type: String },
  status: { type: String, enum: ['pending','succeeded','failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);
