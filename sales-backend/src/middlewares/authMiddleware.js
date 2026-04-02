const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// @desc    Protect routes - verify token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, name: true, email: true, role: true }
            });

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User account no longer exists' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, session expired or invalid token' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, please log in' });
    }
};

// @desc    Optional Protect - allow guests
const optionalProtect = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, name: true, email: true, role: true }
            });

            if (!req.user) {
                req.user = { role: 'GUEST', name: 'Guest User' };
            }
        } catch (error) {
            req.user = { role: 'GUEST', name: 'Guest User' };
        }
    } else {
        req.user = { role: 'GUEST', name: 'Guest User' };
    }
    next();
};

// @desc    Authorize specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied: Role ${req.user.role} is not authorized for this resource`
            });
        }

        next();
    };
};

module.exports = {
    protect,
    optionalProtect,
    authorize
};
