// NOT FOUND: runs when no route matched the URL
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// ERROR HANDLER: catches every error passed with next(error) or thrown in a route,
// and sends a clean JSON message instead of crashing the server.
// Express recognizes it as an error handler because it has 4 parameters.
function errorHandler(err, req, res, next) {
  console.error(err); // full error in the terminal for us, short message for the user

  // Invalid MongoDB id, e.g. /api/sessions/abc
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' });
  }

  // Schema validation failed (missing required field, value not in enum, ...)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Duplicate unique field, e.g. an email that's already registered
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `This ${field} is already in use` });
  }

  // Anything else: unexpected server error
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
}

module.exports = { notFound, errorHandler };