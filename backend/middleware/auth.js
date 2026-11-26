const jwt = require('jsonwebtoken');
const User = require('../models/User');

// PROTECT: only lets the request through if it carries a valid JWT.
// The frontend sends it in the header:  Authorization: Bearer <token>
async function protect(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    const token = header.split(' ')[1];                        // take the part after "Bearer "
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if fake or expired

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user; // the next functions (routes) know who is logged in
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = protect;