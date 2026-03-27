const prisma = require('../config/db');

// @route   GET /api/v1/users/professionals
// @desc    Get all users with role 'WORKER'
const getProfessionals = async (req, res) => {
    try {
        const workers = await prisma.user.findMany({
            where: { role: 'WORKER' },
            select: { id: true, name: true, email: true, phone: true }
        });
        res.status(200).json({ success: true, count: workers.length, data: workers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getProfessionals
};
