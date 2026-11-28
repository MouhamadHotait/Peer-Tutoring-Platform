const express = require('express');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Mounted on /api/auth in server.js, so the paths below are just '/register' and '/login'
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *    post:
 *      summary: Create a new account and log the user in
 *      tags: [Auth]
 *      requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [name, email, password, major]
 *               properties:
 *                  name: { type: string, example: 'Sara Mansour' }
 *                  email: { type: string, example: 'sara.mansour@lau.edu' }
 *                  password: { type: string, example: 'sara12345' }
 *                  major: { type: string, example: 'Computer Science' }
 *                  bio: { type: string, example: 'I enjoy web development and can help with React.' }
 *      responses:
 *         201:
 *           description: Account created. Returns the user (without the password) and a JWT.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   user: { $ref: '#/components/schemas/User' }
 *                   token: { type: string, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
 *         400:
 *           description: Missing field or password shorter than 8 characters
 *           content:
 *             application/json:
 *               schema: { $ref: '#/components/schemas/Error' }
 *         409:
 *           description: Email already registered
 *           content:
 *             application/json:
 *               schema: { $ref: '#/components/schemas/Error' }
 */
// REGISTER: public route. Creates the user, then returns { user, token } so the app logs them in.
router.post('/register', async (req, res) => {
  // 1. Read the allowed fields one by one (never pass req.body straight to the database)
  // The "|| {}" avoids a crash when the request arrives without a JSON body (Express 5)
  const { name, email, password, major, bio } = req.body || {};

  // 2. Validate on the server too: never trust the frontend
  if (!name || !email || !password || !major) {
    return res.status(400).json({ message: 'Name, email, password and major are required' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  // 3. Create the user. The model hashes the password with bcrypt automatically,
  // so we must NOT hash it here (it would be hashed twice and login would fail).
  // A duplicate email throws an error that the error handler turns into a 409.
  const user = await User.create({ name, email, password, major, bio });

  // 4. Same response shape as login, which is what AuthContext expects
  const token = generateToken(user._id);
  res.status(201).json({ user, token });
});

/**
 * @swagger
 * /api/auth/login:
 *    post:
 *      summary: Log in with email and password
 *      tags: [Auth]
 *      requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [email, password]
 *               properties:
 *                  email: { type: string, example: 'demo@lau.edu' }
 *                  password: { type: string, example: 'demo1234' }
 *      responses:
 *         200:
 *           description: Correct credentials. Returns the user (without the password) and a JWT.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   user: { $ref: '#/components/schemas/User' }
 *                   token: { type: string, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
 *         400:
 *           description: Email or password missing
 *           content:
 *             application/json:
 *               schema: { $ref: '#/components/schemas/Error' }
 *         401:
 *           description: Wrong email or password
 *           content:
 *             application/json:
 *               schema: { $ref: '#/components/schemas/Error' }
 */
// LOGIN: public route. Checks the credentials and returns { user, token }.
router.post('/login', async (req, res) => {
  // 1. Both fields are required (and must be text, so toLowerCase() below cannot crash)
  const { email, password } = req.body || {};
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // 2. Emails are saved in lowercase, so search in lowercase
  const user = await User.findOne({ email: email.toLowerCase().trim() });

  // 3. One message for both cases: never tell an attacker whether the email exists
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Incorrect email or password.' });
  }

  // 4. Correct credentials: send the user and a fresh token
  res.json({ user, token: generateToken(user._id) });
});

module.exports = router;
