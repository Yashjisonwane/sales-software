const express = require('express');
const router = express.Router();
const { createLead, getLeads, assignLead, getCategories } = require('../controllers/leadController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   GET /api/v1/leads/categories
router.get('/categories', getCategories);

// @route   POST /api/v1/leads
router.post('/', createLead);

// @route   GET /api/v1/leads
router.get('/', protect, authorize('ADMIN', 'WORKER'), getLeads);

// @route   PATCH /api/v1/leads/:id/assign
router.patch('/:id/assign', protect, authorize('WORKER', 'ADMIN'), assignLead);

module.exports = router;
