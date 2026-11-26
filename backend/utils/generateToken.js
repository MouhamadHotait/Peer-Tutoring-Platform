const jwt = require('jsonwebtoken');

// Creates a JWT containing the user's id, signed with our secret.
// The frontend sends this token back on protected requests to prove who it is.
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

module.exports = generateToken;