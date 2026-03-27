const express = require('express');
const router = express.Router();
const { getWorkers } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// ----------------------------------------------------
// Base URL for these routes: /api/v1/users
// ----------------------------------------------------

// @route   GET /api/v1/users/workers
router.get('/workers', protect, authorize('ADMIN'), getWorkers);

module.exports = router;
