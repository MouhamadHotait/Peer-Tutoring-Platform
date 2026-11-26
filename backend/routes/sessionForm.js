const express = require('express');
const router = express.Router();

// OWNER: Moubarak (Create/Edit Session, My Sessions)
// GET    /api/sessions/mine   sessions I host + sessions I joined (protected)
// POST   /api/sessions        create a session (protected)
// PUT    /api/sessions/:id    edit a session (protected, isSessionHost)
// DELETE /api/sessions/:id    cancel a session (protected, isSessionHost)

module.exports = router;