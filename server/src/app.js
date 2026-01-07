const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
// const helmet = require('helmet'); // Removed due to Express 5 incompatibility
// const mongoSanitize = require('express-mongo-sanitize'); // Removed due to Express 5 incompatibility
// const xss = require('xss-clean'); // Removed due to Express 5 incompatibility
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- Standard Middleware (CORS First!) ---
app.use(cors()); // Allow all origins
app.use(express.json());

// --- Security Middleware ---
// All security middleware disabled for now due to Express 5 breaking changes
// In production, consider downgrading to Express 4 or finding compatible alternatives

// Logging Middleware (Only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- Routes Configuration ---

// 1. Health Check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'SmartTasker API is running...' });
});

// 2. API Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// 3. Error Handling Middleware (Must be last)
app.use(errorHandler);

module.exports = app;