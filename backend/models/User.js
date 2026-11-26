const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// A user of the app. A tutor is simply a user who hosts sessions.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // stored hashed, never plain
    major: { type: String, trim: true },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

// Before saving: hash the password with bcrypt.
// Only when it's new or changed, so we never hash an already-hashed password.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10); // 10 = salt rounds (cost)
});

// Used at login: compares a plain password with the stored hash
userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Never send the password (even hashed) back in API responses
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);