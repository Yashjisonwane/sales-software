const express = require('express');
const router = express.Router();
const { getProfessionals, updateLocation, toggleAvailability, createProfessional, updateProfessional, deleteProfessional } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// @route   GET /api/v1/users/workers
router.get('/workers', protect, getProfessionals);

// Admin Professional Management
router.post('/workers', protect, authorize('ADMIN'), createProfessional);
router.put('/workers/:id', protect, authorize('ADMIN'), updateProfessional);
router.delete('/workers/:id', protect, authorize('ADMIN'), deleteProfessional);

// @route   PATCH /api/v1/users/location
router.patch('/location', protect, updateLocation);

// @route   PATCH /api/v1/users/status
router.patch('/status', protect, toggleAvailability);

module.exports = router;
