const path = require('path');
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const contentTypeChecker = require('./middleware/contentTypeChecker');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Enable CORS for frontend requests
app.use(cors());


// 1. Global Logging Middleware
app.use(logger);

// 2. Content-Type Checker Middleware for POST/PUT
app.use(contentTypeChecker);

// 3. Body Parser Middleware
app.use(express.json());

// 4. Serve static frontend for diagnostic testing
app.use(express.static(path.join(__dirname, '../public')));

// 5. RESTful API Routes
app.use('/tasks', taskRoutes);

// 6. Diagnostic error-trigger route
app.get('/trigger-error', (req, res, next) => {
    next(new Error("Simulated internal server error."));
});

// 7. 404 Handler for Undefined Routes
app.use((req, res, next) => {
    res.status(404).json({ 
        error: `Route not found. Cannot ${req.method} ${req.url}` 
    });
});

// 8. Global Error Handler (Must be defined last)
app.use(errorHandler);

module.exports = app;
