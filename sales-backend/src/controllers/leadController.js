const prisma = require('../config/db');

const generateShortId = (prefix) => {
    return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
};

// @route   POST /api/v1/leads
// @desc    Create a new lead from the website
const createLead = async (req, res) => {
    try {
        const { customerName, name, email, phone, categoryId, categoryName, servicePlan, location, description } = req.body;

        if (!email || !phone) {
            return res.status(400).json({ success: false, message: "Email and Phone are required to create a lead." });
        }

        const leadNo = generateShortId('L');

        // 1. Upsert Customer
        let customer = await prisma.user.findFirst({
            where: { OR: [{ email: email }, { phone: phone }] }
        });

        if (!customer) {
            customer = await prisma.user.create({
                data: {
                    name: customerName || name || 'Valued Customer',
                    email: email,
                    phone: phone,
                    role: 'CUSTOMER',
                    password: 'MOCK_PASSWORD'
                }
            });
        }

        // 2. Resolve Category
        let finalCategoryId = categoryId;
        if (!finalCategoryId && categoryName) {
           const cat = await prisma.category.findFirst({ where: { name: { contains: categoryName } } });
           if (cat) finalCategoryId = cat.id;
        }

        if (!finalCategoryId) {
            // Check for a 'General' or first available category if none matched
            const fallback = await prisma.category.findFirst();
            finalCategoryId = fallback?.id;
        }

        if (!finalCategoryId) throw new Error("No categories found in database. Please seed categories.");

        // 3. Create Lead
        const lead = await prisma.lead.create({
            data: {
                leadNo: leadNo,
                customerId: customer.id,
                categoryId: finalCategoryId,
                location: location || 'Not Specified',
                description: description || '',
                servicePlan: servicePlan || 'Starter',
                status: 'OPEN'
            },
            include: { category: true }
        });

        // 4. Auto-register Location for Dashboard
        if (location) {
            const locName = location.trim();
            const existingLoc = await prisma.location.findFirst({
                where: { city: { contains: locName } }
            });

            if (!existingLoc && locName) {
                await prisma.location.create({
                    data: {
                        name: locName,
                        city: locName,
                        state: 'IN', // Default or parse
                        country: 'India', 
                        status: 'Active'
                    }
                });
                console.log(`[AUTO-LOCATION] New demand area registered: ${locName}`);
            }
        }

        res.status(201).json({
            success: true,
            message: "Service request submitted successfully",
            data: lead
        });
    } catch (error) {
        console.error("Create Lead Error:", error);
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

const getLeads = async (req, res) => {
    try {
        const { status } = req.query;
        let where = {};
        
        if (status && status !== 'All') {
            where.status = status.toUpperCase();
        }

        const leads = await prisma.lead.findMany({
            where,
            include: {
                customer: { select: { name: true, phone: true, email: true } },
                category: { select: { name: true } },
                job: {
                    select: { id: true, workerId: true, status: true, jobNo: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, count: leads.length, data: leads });
    } catch (error) {
        console.error("Get Leads Error:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// @route   PATCH /api/v1/leads/:id/assign
// @desc    Worker accepts/Admin assigns a lead
const assignLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        const { workerId: bodyWorkerId } = req.body;
        const workerId = bodyWorkerId || req.user.id; 

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
            data: { status: 'ASSIGNED' }
        });

        // 2. Create Job
        const jobNo = generateShortId('J');
        const newJob = await prisma.job.create({
            data: {
                jobNo: jobNo,
                leadId: lead.id,
                customerId: lead.customerId,
                workerId: workerId,
                categoryName: lead.category.name,
                location: lead.location,
                description: lead.description,
                status: 'SCHEDULED',
                scheduledDate: new Date(),
                scheduledTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            }
        });

        res.status(200).json({ success: true, message: 'Lead assigned!', data: newJob });

    } catch (error) {
        console.error("Assign Lead Error:", error);
        res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const lead = await prisma.lead.update({
            where: { id },
            data,
            include: { customer: true, category: true }
        });
        res.status(200).json({ success: true, data: lead });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lead update failed' });
    }
};

const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.lead.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Lead deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lead deletion failed' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: { select: { leads: true, workers: true } }
            }
        });
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching categories' });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, icon } = req.body;
        const category = await prisma.category.create({ data: { name, icon } });
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Category creation failed' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, icon } = req.body;
        const category = await prisma.category.update({
            where: { id },
            data: { name, icon }
        });
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Category update failed' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.category.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Category deletion failed' });
    }
};

const getStats = async (req, res) => {
    try {
        const user = req.user;
        
        if (user.role === 'WORKER') {
            const totalAssigned = await prisma.job.count({ where: { workerId: user.id } });
            const completed = await prisma.job.count({ where: { workerId: user.id, status: 'COMPLETED' } });
            
            const today = new Date();
            today.setHours(0,0,0,0);
            const leadsToday = await prisma.job.count({
                where: { workerId: user.id, createdAt: { gte: today } }
            });

            return res.status(200).json({
                success: true,
                data: {
                    totalLeads: totalAssigned,
                    totalProfessionals: 1, // Self
                    leadsToday,
                    conversionRate: totalAssigned > 0 ? ((completed / totalAssigned) * 100).toFixed(1) : 0
                }
            });
        }

        const totalLeads = await prisma.lead.count();
        const totalPros = await prisma.user.count({ where: { role: 'WORKER' } });
        const acceptedLeads = await prisma.lead.count({ where: { status: 'ASSIGNED' } });
        
        const today = new Date();
        today.setHours(0,0,0,0);
        const leadsToday = await prisma.lead.count({
            where: { createdAt: { gte: today } }
        });

        res.status(200).json({
            success: true,
            data: {
                totalLeads,
                totalProfessionals: totalPros,
                leadsToday,
                conversionRate: totalLeads > 0 ? ((acceptedLeads / totalLeads) * 100).toFixed(1) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching stats' });
    }
};

const getLocations = async (req, res) => {
    try {
        const locations = await prisma.lead.findMany({
            select: { location: true },
            distinct: ['location']
        });
        res.status(200).json({ success: true, data: locations.map(l => l.location) });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching locations' });
    }
};

const getSubscriptions = async (req, res) => {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: { price: 'asc' }
        });
        
        const formatted = plans.map(p => ({
            ...p,
            features: p.features ? JSON.parse(p.features) : []
        }));

        res.status(200).json({ success: true, data: formatted });
    } catch (err) {
        console.error("GET Subscriptions Error:", err);
        res.status(500).json({ success: false, message: 'Error fetching subscriptions' });
    }
};

const enrollInPlan = async (req, res) => {
    try {
        const { professionalId, professionalName, planName, status } = req.body;
        
        // 1. Find Plan
        const plan = await prisma.subscriptionPlan.findUnique({
            where: { name: planName }
        });
        if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

        // 2. Find or Create User
        let user;
        if (professionalId) {
            user = await prisma.user.findUnique({ where: { id: professionalId } });
        } else {
            user = await prisma.user.findFirst({
                where: { name: professionalName, role: 'WORKER' }
            });
            if (!user && professionalName) {
                user = await prisma.user.findFirst({
                    where: { name: { contains: professionalName }, role: 'WORKER' }
                });
            }
        }

        // AUTO-CREATE if not found (to help Admin maintain flow)
        if (!user && professionalName) {
            const tempEmail = `${professionalName.replace(/\s+/g, '').toLowerCase()}_${Date.now()}@temp.com`;
            user = await prisma.user.create({
                data: {
                    name: professionalName,
                    email: tempEmail,
                    phone: `AUTOGEN_${Date.now()}`, // Placeholder
                    role: 'WORKER',
                    password: 'TEMP_PASSWORD',
                    isAvailable: true
                }
            });
            console.log(`[AUTO-USER] Created new worker profile for enrollment: ${professionalName}`);
        }

        if (!user) return res.status(404).json({ success: false, message: 'Could not resolve professional' });

        // 3. Update User Plan
        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { 
                planId: plan.id,
                subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
            },
            include: { plan: true }
        });

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error("Enrollment Error:", err);
        res.status(500).json({ success: false, message: 'Enrollment failed: ' + err.message });
    }
};

const getActiveSubscriptions = async (req, res) => {
    try {
        const subscribers = await prisma.user.findMany({
            where: { role: 'WORKER', planId: { not: null } },
            include: { plan: true }
        });

        const formatted = subscribers.map(s => ({
            id: s.id,
            name: s.name,
            business: s.name + ' Services',
            plan: s.plan.name,
            amount: `$${s.plan.price}`,
            date: s.updatedAt.toISOString().slice(0, 10),
            status: 'Active'
        }));

        res.status(200).json({ success: true, data: formatted });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Fetch failed' });
    }
};

module.exports = {
    createLead,
    getLeads,
    assignLead,
    updateLead,
    deleteLead,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getStats,
    getLocations,
    getSubscriptions,
    enrollInPlan,
    getActiveSubscriptions
};
