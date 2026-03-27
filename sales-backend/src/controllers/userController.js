const prisma = require('../config/db');

// @route   GET /api/v1/users/workers
// @desc    Get all users with the role 'WORKER'
// @access  Private (ADMIN)
const getWorkers = async (req, res) => {
    try {
        const workers = await prisma.user.findMany({
            where: { role: 'WORKER' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        res.status(200).json({
            success: true,
            count: workers.length,
            data: workers
        });
    } catch (error) {
        console.error("Get Workers Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    getWorkers
};
