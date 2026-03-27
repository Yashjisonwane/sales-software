const prisma = require('../config/db');

// @route   GET /api/v1/jobs
// @desc    Get all jobs (ADMIN) or professional-specific jobs (WORKER)
const getJobs = async (req, res) => {
    try {
        const user = req.user;
        let jobs;

        if (user.role === 'ADMIN') {
            jobs = await prisma.job.findMany({
                include: { customer: { select: { name: true } }, worker: { select: { name: true } } }
            });
        } else if (user.role === 'WORKER') {
            jobs = await prisma.job.findMany({
                where: { workerId: user.id },
                include: { customer: { select: { name: true } } }
            });
        }

        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { status } = req.body;
        const job = await prisma.job.update({
            where: { id: jobId },
            data: { status: status }
        });
        res.status(200).json({ success: true, data: job });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Job update failed' });
    }
};

module.exports = {
    getJobs,
    updateJob
};
