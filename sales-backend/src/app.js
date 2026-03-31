const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const professionalRequestRoutes = require('./routes/professionalRequestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Routes Registration
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/professional-requests', professionalRequestRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Health Check Route
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running perfectly!' });
});

// Global Error Handler (Fallback)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!', error: err.message });
});

module.exports = app;
