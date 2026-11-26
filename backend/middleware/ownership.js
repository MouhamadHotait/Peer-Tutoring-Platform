const mongoose = require('mongoose');
const Session = require('../models/Session');

// SESSION HOST ONLY: used on edit and delete session routes.
// Must come AFTER protect, because it needs req.user.
async function isSessionHost(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // .equals compares two MongoDB ids
    if (!session.host.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the host can modify this session' });
    }

    req.foundSession = session; // so the route doesn't need to look it up again
    next();
  } catch (error) {
    next(error); // send to the error handler
  }
}

// ACCOUNT OWNER ONLY: used on update and delete user routes.
// A user can only change or delete their own account.
function isSelf(req, res, next) {
  if (req.params.id !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can only modify your own account' });
  }
  next();
}

module.exports = { isSessionHost, isSelf };