const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// OWNER: Hotait (Homepage, Session List)
// GET /api/sessions   all sessions, with course and host attached
// GET /api/courses    all courses

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