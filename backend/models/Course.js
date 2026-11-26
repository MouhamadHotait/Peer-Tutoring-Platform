const mongoose = require('mongoose');

// A university course (e.g. CSC443 - Web Programming)
const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true }, // used by the Subject filter
});

module.exports = mongoose.model('Course', courseSchema);