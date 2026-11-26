const express = require('express');
const Course = require('../models/Course');
const Session = require('../models/Session');

const router = express.Router();

// OWNER: Hotait (Homepage, Session List)
// GET /api/sessions   all sessions, with course and host attached
// GET /api/courses    all courses

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get all sessions
 *     description: Each session comes with its course and host (name, major) attached. Filtering is done in the frontend.
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: All sessions, soonest first
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 */
// GET ALL SESSIONS: public. Course and host are populated so the pages can show
// "CSC443 · Web Programming" and "hosted by ..." without extra requests.
// Attendees stay as ids: the cards only need how many there are.
router.get('/sessions', async (req, res) => {
  const sessions = await Session.find()
    .populate('course')
    .populate('host', 'name major') // only the fields the pages need
    .sort({ date: 1, time: 1 });    // soonest first

  res.json(sessions);
});

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     description: Used by the Session List filters, the Register major list and the Session Form.
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: All courses, sorted by code
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
// GET ALL COURSES: public, sorted by code (CSC first, then MTH)
router.get('/courses', async (req, res) => {
  const courses = await Course.find().sort({ code: 1 });
  res.json(courses);
});

module.exports = router;