// LOGGER: prints every request in the terminal once it's finished,
// e.g.  GET /api/sessions 200 - 35ms
function logger(req, res, next) {
  const start = Date.now();

  // 'finish' fires when the response has been sent, so we know the status code
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
}

module.exports = logger;