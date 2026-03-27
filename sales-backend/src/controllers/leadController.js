const prisma = require('../config/db');

// @route   POST /api/v1/leads
// @desc    Create a new lead from the website
const createLead = async (req, res) => {
    try {
        const { customerName, email, phone, categoryId, location, description } = req.body;

        // 1. Upsert Customer (find by email or phone, or create)
        let customer = await prisma.user.findFirst({
            where: { OR: [{ email: email }, { phone: phone }] }
        });

        if (!customer) {
            customer = await prisma.user.create({
                data: {
                    name: customerName,
                    email: email,
                    phone: phone,
                    role: 'CUSTOMER',
                    password: 'MOCK_PASSWORD' // Dynamic password soon
                }
            });
        }

        // 2. Create Lead
        const lead = await prisma.lead.create({
            data: {
                customerId: customer.id,
                categoryId: parseInt(categoryId),
                location: location || 'Not Specified',
                description: description || '',
                status: 'OPEN'
            },
            include: { category: true }
        });

        res.status(201).json({
            success: true,
            message: "Service request submitted successfully",
            data: lead
        });

    } catch (error) {
        console.error("Lead Creation Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @route   GET /api/v1/leads
// @desc    Get leads based on role (ADMIN = all, WORKER = open)
const getLeads = async (req, res) => {
    try {
        const user = req.user;
        let leads;

        if (user.role === 'ADMIN') {
            leads = await prisma.lead.findMany({
                include: { customer: { select: { name: true, phone: true } }, category: true }
            });
        } else if (user.role === 'WORKER') {
            leads = await prisma.lead.findMany({
                where: { status: 'OPEN' },
                include: { customer: { select: { name: true } }, category: true }
            });
        }

        res.status(200).json({ success: true, count: leads.length, data: leads });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @route   PATCH /api/v1/leads/:id/assign
// @desc    Worker accepts/Admin assigns a lead
const assignLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        const workerId = req.user.id; // Worker accepting lead

        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { category: true }
        });

        if (!lead || lead.status !== 'OPEN') {
            return res.status(400).json({ success: false, message: 'Lead not available' });
        }

        // 1. Update Lead Status
        await prisma.lead.update({
            where: { id: leadId },
            data: { status: 'ASSIGNED', assignedTo: workerId }
        });

        // 2. Create Job
        const newJob = await prisma.job.create({
            data: {
                leadId: lead.id,
                customerId: lead.customerId,
                workerId: workerId,
                categoryName: lead.category.name,
                location: lead.location,
                description: lead.description,
                status: 'SCHEDULED',
                scheduledDate: new Date(),
                scheduledTime: new Date().toLocaleTimeString()
            }
        });

        res.status(200).json({ success: true, message: 'Lead accepted!', job: newJob });

    } catch (error) {
        console.error("Assign Lead Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching categories' });
    }
};

module.exports = {
    createLead,
    getLeads,
    assignLead,
    getCategories
};
