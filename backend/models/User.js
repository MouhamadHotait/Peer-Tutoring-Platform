const mongoose = require('mongoose');

// A user of the app. A tutor is simply a user who hosts sessions.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // will be stored hashed (bcrypt), never plain
    major: { type: String, trim: true },
    bio: { type: String, default: '' },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('User', userSchema);