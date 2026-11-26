// Load environment variables from .env into process.env
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// --- Middleware (runs on every request, in this order) ---
app.use(cors());          // allow requests from the frontend (different domain)
app.use(express.json());  // parse JSON request bodies into req.body
app.use(logger);          // print each request in the terminal

// --- API documentation (public) ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check that the API is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is up
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// (teammates' route files will be mounted here)

// (teammates' route files will be mounted here)

// --- Error handling (must come AFTER all routes) ---
app.use(notFound);
app.use(errorHandler);

// --- Start server (only after the database is connected) ---
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});