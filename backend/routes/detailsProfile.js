const express = require('express');
const router = express.Router();

// OWNER: Jaafar (Session Details, Tutor Profile)
// GET    /api/sessions/:id         one session
// POST   /api/sessions/:id/join    join a session (protected)
// POST   /api/sessions/:id/leave   leave a session (protected)
// GET    /api/users/:id            one user + the sessions they host
// PUT    /api/users/:id            update own account (protected, isSelf)
// DELETE /api/users/:id            delete own account (protected, isSelf)

module.exports = router;