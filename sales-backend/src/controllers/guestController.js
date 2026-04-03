const prisma = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const generateShortId = (prefix) => {
    return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
};

// @route   POST /api/v1/guest/request
// @desc    Create a service request without login
const createRequest = async (req, res) => {
    try {
        const { name, phone, email, categoryName, location, description, latitude, longitude } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ success: false, message: "Name and Phone are required." });
        }

        const leadNo = generateShortId('L');
        const sessionToken = uuidv4();

        // 1. Resolve Category
        let categoryId = null;
        if (categoryName) {
            const cat = await prisma.category.findFirst({ where: { name: { contains: categoryName } } });
            if (cat) categoryId = cat.id;
        }

        if (!categoryId) {
            const fallback = await prisma.category.findFirst();
            categoryId = fallback?.id;
        }

        // 2. Create Lead as Guest
        const lead = await prisma.lead.create({
            data: {
                leadNo: leadNo,
                isGuest: true,
                guestName: name,
                guestPhone: phone,
                guestEmail: email || '',
                sessionToken: sessionToken,
                categoryId: categoryId,
                location: location || 'Not Specified',
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                description: description || '',
                status: 'OPEN'
            },
            include: { category: true }
        });

        // 3. Create Notification for Admin
        await prisma.notification.create({
            data: {
                userId: null,
                title: "New Guest Request",
                message: `Guest ${name} requested ${lead.category?.name || 'Service'} (#${leadNo}).`,
                type: 'LEAD'
            }
        });

        res.status(201).json({
            success: true,
            message: "Request submitted successfully!",
            sessionToken: sessionToken,
            trackingId: lead.id,
            displayId: leadNo
        });
    } catch (error) {
        console.error("Guest Request Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   GET /api/v1/guest/track/:token
// @desc    Track request status and get job details
const trackRequest = async (req, res) => {
    try {
        const { token } = req.params;

        // Find by lead or job
        let lead = await prisma.lead.findUnique({
            where: { sessionToken: token },
            include: { category: true, job: { include: { worker: { select: { name: true, phone: true, rating: true } } } } }
        });

        if (!lead) {
            return res.status(404).json({ success: false, message: "Invalid or expired session token." });
        }

        res.status(200).json({
            success: true,
            data: {
                id: lead.id,
                displayId: lead.leadNo,
                status: lead.job ? lead.job.status : lead.status,
                category: lead.category?.name,
                worker: lead.job?.worker ? {
                    name: lead.job.worker.name,
                    phone: lead.job.worker.phone,
                    rating: lead.job.worker.rating
                } : null,
                jobId: lead.job?.id,
                chatId: lead.job ? (await prisma.chats.findUnique({ where: { job_id: lead.job.id } }))?.id : null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @route   POST /api/v1/guest/review
const submitReview = async (req, res) => {
    try {
        const { sessionToken, rating, comment } = req.body;

        const job = await prisma.job.findFirst({
            where: { sessionToken: sessionToken, status: 'COMPLETED' }
        });

        if (!job) {
            return res.status(400).json({ success: false, message: "Job not found or not completed." });
        }

        const review = await prisma.reviews.create({
            data: {
                id: uuidv4(),
                job_id: job.id,
                rating: parseInt(rating),
                comment: comment,
                created_at: new Date()
            }
        });

        res.status(201).json({ success: true, message: "Review submitted!", data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createRequest,
    trackRequest,
    submitReview
};
