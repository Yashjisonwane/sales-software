const prisma = require('../config/db');

// @route   GET /api/v1/users/professionals
// @desc    Get all users with role 'WORKER'
const getProfessionals = async (req, res) => {
    try {
        const workers = await prisma.user.findMany({
            where: { role: 'WORKER' },
            include: { 
                categories: { 
                    include: { 
                        category: true 
                    } 
                } 
            }
        });
        
        // Flatten categories for UI
        const flattened = workers.map(w => ({
            ...w,
            category: w.categories[0]?.category?.name || 'General',
            onlineStatus: w.isAvailable ? 'Online' : 'Offline',
            lastUpdate: w.updatedAt,
            lastLocation: w.lat && w.lng ? { lat: w.lat, lng: w.lng } : null,
            trackingEnabled: !!(w.lat && w.lng)
        }));

        res.status(200).json({ success: true, count: flattened.length, data: flattened });
    } catch (error) {
        console.error("Fetch Professionals Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const userId = req.user.id;
        const user = await prisma.user.update({
            where: { id: userId },
            data: { lat, lng }
        });
        res.status(200).json({ success: true, data: { lat: user.lat, lng: user.lng } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Location update failed' });
    }
};

const toggleAvailability = async (req, res) => {
    try {
        const { isAvailable } = req.body;
        const userId = req.user.id;
        const user = await prisma.user.update({
            where: { id: userId },
            data: { isAvailable }
        });
        res.status(200).json({ success: true, data: { isAvailable: user.isAvailable } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Status update failed' });
    }
};

const createProfessional = async (req, res) => {
    try {
        const { name, email, phone, password, category, address, city, state, pincode } = req.body;
        
        // 1. Create User as WORKER
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password, // Note: In production, hash this
                role: 'WORKER'
            }
        });

        // 2. Map Category (find or create)
        let cat = await prisma.category.findUnique({ where: { name: category } });
        if (!cat) {
            cat = await prisma.category.create({ data: { name: category } });
        }

        // 3. Link Worker to Category
        await prisma.workerCategory.create({
            data: {
                userId: user.id,
                categoryId: cat.id
            }
        });

        // 4. Auto-register Location for Dashboard
        if (city) {
            const cityName = city.trim();
            const existingLoc = await prisma.location.findFirst({
                where: { city: { contains: cityName } }
            });
            if (!existingLoc && cityName) {
                await prisma.location.create({
                    data: {
                        name: cityName,
                        city: cityName,
                        state: state || '',
                        country: 'USA',
                        status: 'Active'
                    }
                });
                console.log(`[AUTO-LOCATION] New service area registered: ${cityName}`);
            }
        }

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        console.error("Create Pro Error:", err);
        res.status(500).json({ success: false, message: 'Creation failed: ' + err.message });
    }
};

const updateProfessional = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, category, status } = req.body;

        console.log(`[ADMIN] Updating Professional: ${id}`, req.body);

        // 1. Validate Target exists
        const worker = await prisma.user.findUnique({ where: { id } });
        if (!worker) {
            return res.status(404).json({ success: false, message: `Worker with ID ${id} not found` });
        }

        // 2. Perform updates in a transaction for data integrity
        const result = await prisma.$transaction(async (tx) => {
            const dataToUpdate = {};
            if (name) dataToUpdate.name = name;
            
            // Map status to isAvailable field in DB
            if (status !== undefined) {
                dataToUpdate.isAvailable = (status === 'Active' || status === 'Available');
            }

            // Only update email if it changed AND isn't taken by another user
            if (email && email !== worker.email) {
                const emailInUse = await tx.user.findUnique({ where: { email } });
                if (emailInUse) throw new Error('EMAIL_EXISTS');
                dataToUpdate.email = email;
            }

            // Only update phone if it changed AND isn't taken by another user
            if (phone && phone !== worker.phone) {
                const phoneInUse = await tx.user.findUnique({ where: { phone } });
                if (phoneInUse) throw new Error('PHONE_EXISTS');
                dataToUpdate.phone = phone;
            }

            // New: Support for physical address update
            const { address, city, state, pincode } = req.body;
            if (address !== undefined) dataToUpdate.address = address;
            if (city !== undefined) dataToUpdate.city = city;
            if (state !== undefined) dataToUpdate.state = state;
            if (pincode !== undefined) dataToUpdate.pincode = pincode;

            // Perform the update
            const updatedUser = await tx.user.update({
                where: { id },
                data: dataToUpdate
            });

            // Handle Category linking
            if (category) {
                const cat = await tx.category.upsert({
                    where: { name: category },
                    update: {},
                    create: { name: category }
                });

                // Clear and Re-link (MySQL schema has a unique constraint on userId, categoryId)
                await tx.workerCategory.deleteMany({ where: { userId: id } });
                await tx.workerCategory.create({
                    data: { userId: id, categoryId: cat.id }
                });
            }

            return updatedUser;
        });

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error("DEBUG - Full Update Error:", err);
        
        // Handle specific custom errors or Prisma Unique Constraint Errors
        if (err.message === 'EMAIL_EXISTS') {
            return res.status(400).json({ success: false, message: 'This email is already registered to another user.' });
        }
        if (err.message === 'PHONE_EXISTS') {
            return res.status(400).json({ success: false, message: 'This phone number is already registered to another user.' });
        }

        if (err.code === 'P2002') {
            return res.status(400).json({ 
                success: false, 
                message: `The ${err.meta?.target} provided already exists.` 
            });
        }

        res.status(500).json({ 
            success: false, 
            message: 'Database Error: ' + err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

const deleteProfessional = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });
        res.status(200).json({ success: true, message: 'Professional removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Deletion failed' });
    }
};

module.exports = {
    getProfessionals,
    updateLocation,
    toggleAvailability,
    createProfessional,
    updateProfessional,
    deleteProfessional
};
