const express = require('express');
const router = express.Router();
const { createLead, getLeads, assignLead, getCategories } = require('../controllers/leadController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// ----------------------------------------------------
// Base URL for these routes: /api/v1/leads
// ----------------------------------------------------

// Public Category List (For Website Dropdown)
router.get('/categories', getCategories);

// @route   POST /api/v1/leads
router.post('/', createLead); // Removing protect for now to allow Guest leads from Website

// @route   GET /api/v1/leads
router.get('/', protect, getLeads);

// @route   PATCH /api/v1/leads/:id/assign
router.patch('/:id/assign', protect, authorize('WORKER', 'ADMIN'), assignLead);

module.exports = router;
