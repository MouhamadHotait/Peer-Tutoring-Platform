const mongoose = require('mongoose');

// Connects to MongoDB Atlas using the connection string from .env
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // stop the server: the app can't work without a database
  }
}

module.exports = connectDB;