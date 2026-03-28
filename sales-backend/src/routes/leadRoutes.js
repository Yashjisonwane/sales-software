const express = require('express');
const router = express.Router();
const { createLead, getLeads, assignLead, deleteLead, updateLead, getCategories, getStats, createCategory, updateCategory, deleteCategory, getLocations, getSubscriptions, enrollInPlan, getActiveSubscriptions } = require('../controllers/leadController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   GET /api/v1/leads/stats
router.get('/stats', protect, getStats);

// @route   GET /api/v1/leads/locations
router.get('/locations', getLocations);

// @route   GET /api/v1/leads/subscriptions
router.get('/subscriptions', getSubscriptions);
router.get('/subscriptions/active', getActiveSubscriptions);
router.post('/subscriptions/enroll', protect, authorize('ADMIN'), enrollInPlan);

// @route   GET /api/v1/leads/categories
router.get('/categories', getCategories);

// @route   POST /api/v1/leads/categories
router.post('/categories', protect, authorize('ADMIN'), createCategory);

// @route   PUT /api/v1/leads/categories/:id
router.put('/categories/:id', protect, authorize('ADMIN'), updateCategory);

// @route   DELETE /api/v1/leads/categories/:id
router.delete('/categories/:id', protect, authorize('ADMIN'), deleteCategory);

// @route   POST /api/v1/leads
router.post('/', createLead);

// @route   GET /api/v1/leads
router.get('/', protect, authorize('ADMIN', 'WORKER'), getLeads);

// @route   PATCH /api/v1/leads/:id/assign
router.patch('/:id/assign', protect, authorize('WORKER', 'ADMIN'), assignLead);

// @route   PUT /api/v1/leads/:id
router.put('/:id', protect, authorize('ADMIN'), updateLead);

// @route   DELETE /api/v1/leads/:id
router.delete('/:id', protect, authorize('ADMIN'), deleteLead);

module.exports = router;
