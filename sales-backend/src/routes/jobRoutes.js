const express = require('express');
const router = express.Router();
const { getJobs, updateJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   GET /api/v1/jobs
router.get('/', protect, getJobs);

// @route   PATCH /api/v1/jobs/:id
router.patch('/:id', protect, updateJob);

module.exports = router;
