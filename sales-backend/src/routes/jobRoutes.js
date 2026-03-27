const express = require('express');
const router = express.Router();
const { getJobs, uploadPhotos, submitInspection, submitEstimate, approveEstimate, submitContract, submitInvoice } = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// ----------------------------------------------------
// Base URL for these routes: /api/v1/jobs
// ----------------------------------------------------

// @route   GET /api/v1/jobs
router.get('/', protect, getJobs);

// Workflow Step 1: Photos
// @route   POST /api/v1/jobs/:id/photos
router.post('/:id/photos', protect, authorize('WORKER', 'ADMIN'), uploadPhotos);

// Workflow Step 2: Inspection
// @route   POST /api/v1/jobs/:id/inspection
router.post('/:id/inspection', protect, authorize('WORKER', 'ADMIN'), submitInspection);

// Workflow Step 3: Estimate
// @route   POST /api/v1/jobs/:id/estimate
router.post('/:id/estimate', protect, authorize('WORKER', 'ADMIN'), submitEstimate);

// Workflow Step 3.5: Customer Approve Estimate
// @route   PATCH /api/v1/jobs/:id/estimate/approve
router.patch('/:id/estimate/approve', protect, authorize('CUSTOMER', 'ADMIN'), approveEstimate);

// Workflow Step 4: Contract
// @route   POST /api/v1/jobs/:id/contract
router.post('/:id/contract', protect, authorize('WORKER', 'ADMIN'), submitContract);

// Workflow Step 5: Invoice
// @route   POST /api/v1/jobs/:id/invoice
router.post('/:id/invoice', protect, authorize('WORKER', 'ADMIN'), submitInvoice);

module.exports = router;
