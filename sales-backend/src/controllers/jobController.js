const prisma = require('../config/db');

// @route   GET /api/v1/jobs
// @desc    Get jobs based on role
// @access  Private
const getJobs = async (req, res) => {
    try {
        const user = req.user;
        let jobs;

        if (user.role === 'ADMIN') {
            jobs = await prisma.job.findMany({
                include: { customer: { select: { name: true, phone: true } }, worker: { select: { name: true } } }
            });
        } else if (user.role === 'CUSTOMER') {
            jobs = await prisma.job.findMany({
                where: { customerId: user.id },
                include: { worker: { select: { name: true, phone: true } } }
            });
        } else if (user.role === 'WORKER') {
            jobs = await prisma.job.findMany({
                where: { workerId: user.id },
                include: { customer: { select: { name: true, location: true, phone: true } } }
            });
        }

        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        console.error("Get Jobs Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @route   POST /api/v1/jobs/:id/photos
// @desc    Upload Job Photos (First Step of Workflow)
// @access  Private (WORKER)
const uploadPhotos = async (req, res) => {
    try {
        const { id } = req.params;
        const { url, type } = req.body; // type: 'BEFORE', 'PROCESS', 'AFTER'

        const job = await prisma.job.findUnique({ where: { id } });
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // Guard Check: Can only upload if Job belongs to the worker (or admin overrides)
        if (req.user.role === 'WORKER' && job.workerId !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized for this job" });
        }

        // Change Status to IN_PROGRESS when first BEFORE photo is uploaded
        if (job.status === 'SCHEDULED' && type === 'BEFORE') {
            await prisma.job.update({ where: { id }, data: { status: 'IN_PROGRESS' } });
        }

        const photo = await prisma.jobPhoto.create({
            data: { jobId: id, url, type }
        });

        res.status(201).json({ success: true, message: "Photo uploaded successfully", data: photo });
    } catch (error) {
        console.error("Upload Photo Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @route   POST /api/v1/jobs/:id/inspection
// @desc    Submit Inspection Notes (Second Step)
// @access  Private (WORKER)
const submitInspection = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, signature } = req.body;

        const job = await prisma.job.findUnique({ where: { id }, include: { photos: true } });
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // GUARD: Must have at least one BEFORE photo uploaded 
        const beforePhotos = job.photos.filter(p => p.type === 'BEFORE');
        if (beforePhotos.length === 0) {
            return res.status(400).json({ success: false, message: "Workflow Error: Photos must be uploaded prior to Inspection." });
        }

        const inspection = await prisma.jobInspection.create({
            data: { jobId: id, notes, signature }
        });

        res.status(201).json({ success: true, message: "Inspection submitted successfully", data: inspection });
    } catch (error) {
        console.error("Submit Inspection Error:", error);
        res.status(500).json({ success: false, message: "Server Error, maybe inspection already exists for this job" });
    }
};

// @route   POST /api/v1/jobs/:id/estimate
// @desc    Submit Cost Estimate (Third Step)
// @access  Private (WORKER)
const submitEstimate = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, details } = req.body;

        const job = await prisma.job.findUnique({ where: { id }, include: { inspection: true } });
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // GUARD: Must have passed Inspection stage
        if (!job.inspection) {
            return res.status(400).json({ success: false, message: "Workflow Error: Inspection must be completed prior to submitting Estimate." });
        }

        const estimate = await prisma.jobEstimate.create({
            data: { jobId: id, amount: parseFloat(amount), details }
        });

        // Update Job status to Reflect Waiting on Estimate
        await prisma.job.update({ where: { id }, data: { status: 'ESTIMATED' } });

        res.status(201).json({ success: true, message: "Estimate submitted, awaiting customer approval", data: estimate });
    } catch (error) {
        console.error("Submit Estimate Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @route   PATCH /api/v1/jobs/:id/estimate/approve
// @desc    Customer approves the Job Estimate
// @access  Private (CUSTOMER)
const approveEstimate = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await prisma.job.findUnique({ where: { id }, include: { estimate: true } });
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // GUARD: Must belong to customer
        if (req.user.role === 'CUSTOMER' && job.customerId !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to approve this estimate" });
        }

        // GUARD: Estimate must exist
        if (!job.estimate) {
            return res.status(400).json({ success: false, message: "Workflow Error: Estimate not yet submitted by professional." });
        }

        const estimate = await prisma.jobEstimate.update({
            where: { jobId: id },
            data: { isApproved: true }
        });

        res.status(200).json({ success: true, message: "Estimate approved successfully", data: estimate });
    } catch (error) {
        console.error("Approve Estimate Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @route   POST /api/v1/jobs/:id/contract
// @desc    Upload Contract and confirm Customer Signature (Fourth Step)
// @access  Private (WORKER)
const submitContract = async (req, res) => {
    try {
        const { id } = req.params;
        const { documentUrl, customerSignature } = req.body;

        const job = await prisma.job.findUnique({ where: { id }, include: { estimate: true } });
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // GUARD: Estimate must be approved prior to Contract
        if (!job.estimate || !job.estimate.isApproved) {
            return res.status(400).json({ success: false, message: "Workflow Error: Customer must approve estimate before signing the contract." });
        }

        const contract = await prisma.jobContract.create({
            data: {
                jobId: id,
                documentUrl,
                customerSignature,
                signedByCustomer: !!customerSignature
            }
        });

        res.status(201).json({ success: true, message: "Contract signed successfully", data: contract });
    } catch (error) {
        console.error("Submit Contract Error:", error);
        res.status(500).json({ success: false, message: "Server Error, maybe contract already exists" });
    }
};

// @route   POST /api/v1/jobs/:id/invoice
// @desc    Generate Invoice and complete the job (Final Step)
// @access  Private (WORKER or ADMIN)
const submitInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, status, paymentId } = req.body; // status defaults to "UNPAID", or "PAID" if handled directly

        const job = await prisma.job.findUnique({ where: { id }, include: { contract: true } });
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // GUARD: Contract must be signed before billing
        if (!job.contract || !job.contract.signedByCustomer) {
            return res.status(400).json({ success: false, message: "Workflow Error: Contract must be officially signed before generating invoice." });
        }

        const invoice = await prisma.jobInvoice.create({
            data: {
                jobId: id,
                amount: parseFloat(amount),
                status: status || 'UNPAID',
                paymentId
            }
        });

        // 🚀 Mark JOB as Completed!
        await prisma.job.update({
            where: { id },
            data: { status: 'COMPLETED' }
        });

        res.status(201).json({ success: true, message: "Invoice generated. Job marked as COMPLETED.", data: invoice });
    } catch (error) {
        console.error("Submit Invoice Error:", error);
        res.status(500).json({ success: false, message: "Server Error, invoice may already exist" });
    }
};

module.exports = {
    getJobs,
    uploadPhotos,
    submitInspection,
    submitEstimate,
    approveEstimate,
    submitContract,
    submitInvoice
};
