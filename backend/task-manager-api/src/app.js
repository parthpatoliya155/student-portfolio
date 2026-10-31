const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const contentTypeChecker = require('./middleware/contentTypeChecker');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Enable CORS for frontend requests (supports local dev and deployed production domains)
const allowedOrigins = process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL.replace(/\/+$/, ''), 'http://localhost:5173', 'http://localhost:3000'] 
    : '*';

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 1. Global Logging Middleware
app.use(logger);

// 2. Content-Type Checker Middleware for POST/PUT
app.use(contentTypeChecker);

// 3. Body Parser Middleware
app.use(express.json());

// 4. API & Auth Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

// Health check endpoint for cloud monitoring & deployment platforms (Render / Railway)
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Task Manager API',
        uptime: process.uptime()
    });
});

// Diagnostic error-trigger route
app.get('/trigger-error', (req, res, next) => {
    next(new Error("Simulated internal server error."));
});

// 5. Static Assets & Full-Stack Unified Support
const frontendDistPath = path.resolve(__dirname, '../../../frontend/student-portfolio/dist');
const localDistPath = path.resolve(__dirname, '../public/dist');
const defaultPublicPath = path.join(__dirname, '../public');

let staticPath = defaultPublicPath;
if (fs.existsSync(path.join(frontendDistPath, 'index.html'))) {
    staticPath = frontendDistPath;
} else if (fs.existsSync(path.join(localDistPath, 'index.html'))) {
    staticPath = localDistPath;
}

app.use(express.static(staticPath));

// Also serve the legacy Practical 5 diagnostic dashboard under /diagnostics
app.use('/diagnostics', express.static(defaultPublicPath));

// 6. SPA Routing Fallback (for React Router routes like /projects, /tasks, /auth, etc.)
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }
    // If request is targeting API routes, delegate to 404 handler
    if (req.url.startsWith('/tasks') || req.url.startsWith('/auth') || req.url.startsWith('/api') || req.url.startsWith('/ai')) {
        return next();
    }
    const indexPath = path.join(staticPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    next();
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
