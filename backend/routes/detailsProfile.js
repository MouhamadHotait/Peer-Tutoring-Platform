const express = require('express');
const mongoose = require('mongoose');
const Session = require('../models/Session');
const User = require('../models/User');
const protect = require('../middleware/auth');
const { isSelf } = require('../middleware/ownership');

const router = express.Router();

const findFullSession = (id) =>
  Session.findById(id)
    .populate('course')
    .populate('host', 'name major')
    .populate('attendees', 'name');

async function findSession(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Session.findById(id);
}

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Get one session
 *     description: The session with its course, host (name, major) and attendees (names) attached.
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET ONE SESSION: public. Used by Session Details and the edit mode of the Session Form.
router.get('/sessions/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Session not found' });
  }

  const session = await findFullSession(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  res.json(session);
});

/**
 * @swagger
 * /api/sessions/{id}/join:
 *   post:
 *     summary: Join a session
 *     description: The logged-in user joins the session. The host cannot join, nobody can join twice, and a full session cannot be joined.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Joined. Returns the updated session.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: You are the host, you already joined, or the session is full
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not logged in
 *       404:
 *         description: Session not found
 */
// JOIN A SESSION: protected. The user comes from the token (req.user), never from the body.
router.post('/sessions/:id/join', protect, async (req, res) => {
  const session = await findSession(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  if (session.host.equals(req.user._id)) {
    return res.status(400).json({ message: 'You are hosting this session' });
  }

  if (session.attendees.some((attendee) => attendee.equals(req.user._id))) {
    return res.status(400).json({ message: 'You already joined this session' });
  }

  if (session.attendees.length >= session.capacity) {
    return res.status(400).json({ message: 'This session is full' });
  }

  session.attendees.push(req.user._id);
  await session.save();

  res.json(await findFullSession(session._id));
});

/**
 * @swagger
 * /api/sessions/{id}/leave:
 *   post:
 *     summary: Leave a session
 *     description: The logged-in user leaves a session they joined. Also used by the My Sessions page.
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Left. Returns the updated session.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: You have not joined this session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not logged in
 *       404:
 *         description: Session not found
 */
// LEAVE A SESSION: protected. Only someone in the attendee list can leave.
router.post('/sessions/:id/leave', protect, async (req, res) => {
  const session = await findSession(req.params.id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  if (!session.attendees.some((attendee) => attendee.equals(req.user._id))) {
    return res.status(400).json({ message: 'You have not joined this session' });
  }

  session.attendees.pull(req.user._id);
  await session.save();

  res.json(await findFullSession(session._id));
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user's public profile
 *     description: The user plus the sessions they host (soonest first). Used by the Tutor Profile page.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The user and their hosted sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 sessions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Session'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET ONE USER: public. The password is never sent (the User model removes it).
router.get('/users/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'User not found' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const sessions = await Session.find({ host: user._id })
    .populate('course')
    .sort({ date: 1, time: 1 });

  res.json({ user, sessions });
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update your own profile
 *     description: Only name, major and bio can change. Email and password cannot be changed here.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: 'Lara Haddad' }
 *               major: { type: string, example: 'Computer Science' }
 *               bio: { type: string, example: 'Senior student who loves web development.' }
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid value (e.g. empty name)
 *       401:
 *         description: Not logged in
 *       403:
 *         description: You can only modify your own account
 */
// UPDATE OWN PROFILE: protected + isSelf, so req.user is the account being edited.
router.put('/users/:id', protect, isSelf, async (req, res) => {
  const user = req.user;

  for (const field of ['name', 'major', 'bio']) {
    if (req.body && Object.hasOwn(req.body, field)) {
      user[field] = req.body[field];
    }
  }

  await user.save();
  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete your own account
 *     description: Also deletes the sessions you host and removes you from the sessions you joined.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Account deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not logged in
 *       403:
 *         description: You can only modify your own account
 */
// DELETE OWN ACCOUNT: protected + isSelf. Cleans up first so no session points to a missing user.
router.delete('/users/:id', protect, isSelf, async (req, res) => {
  await Session.deleteMany({ host: req.user._id });

  await Session.updateMany(
    { attendees: req.user._id },
    { $pull: { attendees: req.user._id } }
  );

  await req.user.deleteOne();
  res.json({ message: 'Account deleted' });
});

module.exports = router;
