const express = require('express');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Session = require('../models/Session');
const protect = require('../middleware/auth');
const { isSessionHost } = require('../middleware/ownership');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SessionForm:
 *       type: object
 *       required: [title, course, type, date, time, mode, location, capacity]
 *       properties:
 *         title: { type: string }
 *         course: { type: string, description: Course ID }
 *         type: { type: string, enum: [tutoring, study-group] }
 *         date: { type: string, format: date }
 *         time: { type: string, example: '14:30' }
 *         mode: { type: string, enum: [online, in-person] }
 *         location: { type: string }
 *         capacity: { type: integer, minimum: 2, maximum: 50 }
 *         description: { type: string }
 */
const allowedFields = ['title', 'course', 'type', 'date', 'time', 'mode', 'location', 'capacity', 'description'];
const population = ['course', { path: 'host', select: 'name major' }];

function pickFields(body = {}) {
  // Only authentication and join/leave routes determine host and attendees.
  return Object.fromEntries(allowedFields.filter((field) => Object.hasOwn(body, field))
    .map((field) => [field, body[field]]));
}

async function courseExists(course) {
  return mongoose.isValidObjectId(course) && await Course.exists({ _id: course });
}

function validCapacity(capacity) {
  return Number.isInteger(capacity) && capacity >= 2 && capacity <= 50;
}

const capacityMessage = 'Capacity must be a whole number between 2 and 50';

/**
 * @swagger
 * /api/sessions/mine:
 *   get:
 *     summary: List sessions the current user hosts or has joined
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Hosting and joined session arrays }
 *       401: { description: Authentication required }
 */
// Return both dashboard lists in chronological order for the authenticated user.
router.get('/sessions/mine', protect, async (req, res) => {
  const userId = req.user._id;
  const sort = { date: 1, time: 1 };
  const [hosting, joined] = await Promise.all([
    Session.find({ host: userId }).populate(population).sort(sort),
    Session.find({ attendees: userId }).populate(population).sort(sort),
  ]);
  res.json({ hosting, joined });
});

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Create a session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionForm'
 *     responses:
 *       201: { description: Created session with course and host }
 *       400: { description: Invalid fields or course }
 *       401: { description: Authentication required }
 */
// Create a session hosted by the authenticated user and return the populated session.
router.post('/sessions', protect, async (req, res) => {
  const fields = pickFields(req.body);
  if (!(await courseExists(fields.course))) {
    return res.status(400).json({ message: 'Course not found' });
  }
  if (!validCapacity(fields.capacity)) {
    return res.status(400).json({ message: capacityMessage });
  }

  const session = await Session.create({ ...fields, host: req.user._id, attendees: [] });
  await session.populate(population);
  res.status(201).json(session);
});

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Update a session as its host
 *     tags: [Sessions]
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
 *             $ref: '#/components/schemas/SessionForm'
 *     responses:
 *       200: { description: Updated session with course and host }
 *       400: { description: Invalid fields or capacity }
 *       401: { description: Authentication required }
 *       403: { description: Only the host can update the session }
 *       404: { description: Session not found }
 */
// Apply the host's changes and return the populated session.
router.put('/sessions/:id', protect, isSessionHost, async (req, res) => {
  const session = req.foundSession;
  const fields = pickFields(req.body);
  if (Object.hasOwn(fields, 'course') && !session.course.equals(fields.course)
    && !(await courseExists(fields.course))) {
    return res.status(400).json({ message: 'Course not found' });
  }
  if (!validCapacity(fields.capacity)) {
    return res.status(400).json({ message: capacityMessage });
  }

  // Every student who already joined must keep their place.
  const attendeeCount = session.attendees.length;
  if (fields.capacity < attendeeCount) {
    return res.status(400).json({ message: `Capacity cannot be lower than the number of attendees (${attendeeCount})` });
  }

  session.set(fields);
  await session.save();
  await session.populate(population);
  res.json(session);
});

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Cancel a session as its host
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Session cancelled }
 *       401: { description: Authentication required }
 *       403: { description: Only the host can cancel the session }
 *       404: { description: Session not found }
 */
// Delete the host's session and confirm cancellation.
router.delete('/sessions/:id', protect, isSessionHost, async (req, res) => {
  await req.foundSession.deleteOne();
  res.json({ message: 'Session cancelled' });
});

module.exports = router;
