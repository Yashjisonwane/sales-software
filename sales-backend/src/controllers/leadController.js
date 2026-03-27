const prisma = require('../config/db');

// @route   POST /api/v1/leads
// @desc    Create a new Lead (Customer requests a service)
// @access  Private (CUSTOMER)
const createLead = async (req, res) => {
    try {
        const { categoryId, location, description, name, email, phone } = req.body;
        
        let customerId;

        // AUTH CHECK: If logged in, use that ID. If not, find or create the guest user.
        if (req.user && req.user.id) {
            customerId = req.user.id;
        } else {
            // Guest Flow: Need name, email, phone
            if (!email || !phone || !name) {
                return res.status(400).json({ success: false, message: "Name, Email, and Phone are required for guest requests." });
            }

            // Find or Create the customer
            let user = await prisma.user.findFirst({
                where: { OR: [{ email }, { phone }] }
            });

            if (!user) {
                // Create a placeholder account for this customer
                user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        phone,
                        password: 'guest_password_reset_needed', // In real app, trigger welcome email
                        role: 'CUSTOMER'
                    }
                });
            }
            customerId = user.id;
        }

        const newLead = await prisma.lead.create({
            data: {
                customerId,
                categoryId,
                location,
                description,
                status: 'OPEN'
            }
        });

        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            data: newLead
        });
    } catch (error) {
        console.error("Create Lead Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @route   GET /api/v1/leads
// @desc    Get all leads (Admin sees all, Customer sees theirs, Worker sees OPEN and ASSIGNED)
// @access  Private
const getLeads = async (req, res) => {
    try {
        const user = req.user;
        let leads;

        if (user.role === 'ADMIN') {
            leads = await prisma.lead.findMany({
                include: { customer: { select: { name: true, phone: true } }, category: true }
            });
        } else if (user.role === 'CUSTOMER') {
            leads = await prisma.lead.findMany({
                where: { customerId: user.id },
                include: { category: true }
            });
        } else if (user.role === 'WORKER') {
            // Very simplified: Worker sees all OPEN leads + leads assigned to jobs they own
            // In a strict app, we match the worker's categories `workerCategories`
            leads = await prisma.lead.findMany({
                where: {
                    status: 'OPEN' // For now, we list all OPEN to show workers opportunities
                },
                include: { customer: { select: { name: true, location: true } }, category: true }
            });
        }

        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads
        });
    } catch (error) {
        console.error("Get Leads Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @route   PATCH /api/v1/leads/:id/assign
// @desc    Assign an OPEN Lead to a WORKER. Changes Lead to 'ASSIGNED' and creates a new JOB.
// @access  Private (WORKER or ADMIN)
const assignLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        const workerId = req.user.role === 'WORKER' ? req.user.id : req.body.workerId; // Worker assigns themselves, or Admin assigns
        
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { category: true }
        });

        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
        if (lead.status !== 'OPEN') return res.status(400).json({ success: false, message: "Lead is already assigned or closed" });

        // Update Lead status
        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: { status: 'ASSIGNED' }
        });

        // 🚀 Create the Official JOB connection!
        const newJob = await prisma.job.create({
            data: {
                leadId: lead.id,
                customerId: lead.customerId,
                workerId: workerId,
                categoryName: lead.category.name,
                location: lead.location,
                description: lead.description,
                status: 'SCHEDULED', // Job starts at SCHEDULED until worker initiates Trip/Progress
                
                // For demonstration, defaulting to current time. Can be pulled from req.body if customer provided exact slot
                scheduledDate: new Date(), 
                scheduledTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
        });

        res.status(200).json({
            success: true,
            message: "Lead successfully assigned. Job Created natively in DB.",
            data: {
                lead: updatedLead,
                job: newJob
            }
        });

    } catch (error) {
        console.error("Assign Lead Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    createLead,
    getLeads,
    assignLead,
    getCategories
};
