const mongoose = require('mongoose');
const { Schema } = mongoose;

const EnrollmentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }], // completed lesson ids
  enrolledAt: { type: Date, default: Date.now },
  paid: { type: Boolean, default: false },
});

EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
