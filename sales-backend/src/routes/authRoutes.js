const express = require('express');
const router = express.Router();
const { registerUser, loginUser, resetPassword } = require('../controllers/authController');

// ----------------------------------------------------
// Base URL for these routes: /api/v1/auth
// ----------------------------------------------------

// @route   POST /api/v1/auth/register
router.post('/register', registerUser);

// @route   POST /api/v1/auth/login
router.post('/login', loginUser);

// @route   POST /api/v1/auth/reset-password
router.post('/reset-password', resetPassword);

module.exports = router;
