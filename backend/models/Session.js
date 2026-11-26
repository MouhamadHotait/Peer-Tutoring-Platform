const mongoose = require('mongoose');

// A tutoring session or study group. Each session belongs to a host (a user) and a course.
const sessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['tutoring', 'study-group'], required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD', same format as Phase 1
    time: { type: String, required: true }, // 'HH:MM'
    mode: { type: String, enum: ['online', 'in-person'], required: true },
    location: { type: String, required: true, trim: true }, // room or meeting link
    capacity: { type: Number, required: true, min: 1 },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who joined
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);