/*
  taskRoutes.js
  Task API Routes Definition
  Author: Parth Patoliya | Practical 9: In-Memory Caching & Query Optimization
*/

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateId = require('../middleware/validateId');
const auth = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');

// Require authentication for all task routes
router.use(auth);

// Cache Diagnostics & Metrics Debug Endpoints (Must be registered BEFORE /:id route)
router.get('/cache/stats', taskController.getCacheStats);
router.post('/cache/clear', taskController.clearCache);

// Core CRUD Task Routes with Caching & Invalidation
router.get('/', taskController.getAllTasks);
router.get('/:id', validateId, taskController.getTaskById);
router.post('/', validateTask, taskController.createTask);
router.put('/:id', validateId, validateTask, taskController.updateTask);
router.delete('/:id', validateId, taskController.deleteTask);

module.exports = router;
