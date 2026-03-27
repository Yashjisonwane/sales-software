const express = require('express');
const router = express.Router();
const { getProfessionals } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// @route   GET /api/v1/users/workers
router.get('/workers', protect, getProfessionals);

module.exports = router;
