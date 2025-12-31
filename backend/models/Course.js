const mongoose = require('mongoose');
const { Schema } = mongoose;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, default: 0 },
  level: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner' },
  status: { type: String, enum: ['draft','published','review'], default: 'draft' },
  instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String }, // base64 encoded image or image URL
  imageSize: { type: Number }, // image size in KB
  chapters: [
    {
      title: { type: String },
      description: { type: String },
      items: [
        {
          type: { type: String, enum: ['lesson', 'quiz'], required: true },
          title: { type: String },
          content: { type: String },
        }
      ]
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', CourseSchema);
