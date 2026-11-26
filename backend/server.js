// Load environment variables from .env into process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(cors());          // allow requests from the frontend (different domain)
app.use(express.json());  // parse JSON request bodies into req.body

// --- Test route ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});