/*
  taskController.js
  Task Controller with In-Memory Caching & Cache Invalidation
  Author: Parth Patoliya | Practical 9: In-Memory Caching & Query Optimization
  
  Integrates node-cache to minimize expensive MongoDB read operations.
  Implements automatic cache invalidation on write (POST, PUT, DELETE)
  to ensure strict data consistency and zero stale data.
*/

const Task = require('../models/Task');
const cacheService = require('../services/cacheService');

// Helper to generate consistent user-scoped cache keys
const getTasksCacheKey = (userId) => `tasks_user_${userId}`;
const getSingleTaskCacheKey = (userId, taskId) => `task_${userId}_${taskId}`;

// GET /tasks - Get all tasks for the logged-in user (with Caching)
exports.getAllTasks = async (req, res, next) => {
    try {
        const cacheKey = getTasksCacheKey(req.user.id);
        
        // 1. Cache Check: Check if tasks exist in fast in-memory cache
        const cachedTasks = cacheService.get(cacheKey);
        if (cachedTasks !== undefined) {
            // Cache HIT: Return immediately without querying MongoDB
            res.setHeader('X-Cache', 'HIT');
            return res.status(200).json(cachedTasks);
        }

        // 2. Cache MISS: Query MongoDB
        const tasks = await Task.find({ user: req.user.id });

        // 3. Populate Cache with TTL of 60 seconds
        cacheService.set(cacheKey, tasks, 60);

        res.setHeader('X-Cache', 'MISS');
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
};

// GET /tasks/:id - Get a single task by ID for the logged-in user (with Caching)
exports.getTaskById = async (req, res, next) => {
    try {
        const cacheKey = getSingleTaskCacheKey(req.user.id, req.params.id);

        // 1. Cache Check
        const cachedTask = cacheService.get(cacheKey);
        if (cachedTask !== undefined) {
            res.setHeader('X-Cache', 'HIT');
            return res.status(200).json(cachedTask);
        }

        // 2. Cache MISS: Query MongoDB
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ 
                error: `Task with ID ${req.params.id} not found` 
            });
        }

        // 3. Populate Cache with TTL of 60 seconds
        cacheService.set(cacheKey, task, 60);

        res.setHeader('X-Cache', 'MISS');
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
};

// POST /tasks - Create a new task and Invalidate Cache
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, completed, priority } = req.body;
        
        const newTask = new Task({
            title,
            description,
            completed,
            priority,
            user: req.user.id
        });

        const savedTask = await newTask.save();

        // CACHE INVALIDATION: Invalidate all tasks cache for this user
        cacheService.del(getTasksCacheKey(req.user.id));

        res.status(201).json(savedTask);
    } catch (err) {
        next(err);
    }
};

// PUT /tasks/:id - Update an existing task and Invalidate Cache
exports.updateTask = async (req, res, next) => {
    try {
        const { title, description, completed, priority } = req.body;
        
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) {
            return res.status(404).json({ 
                error: `Task with ID ${req.params.id} not found` 
            });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (completed !== undefined) task.completed = completed;
        if (priority !== undefined) task.priority = priority;

        const updatedTask = await task.save();

        // CACHE INVALIDATION: Invalidate both all-tasks list cache and single-task cache
        cacheService.del(getTasksCacheKey(req.user.id));
        cacheService.del(getSingleTaskCacheKey(req.user.id, req.params.id));

        res.status(200).json(updatedTask);
    } catch (err) {
        next(err);
    }
};

// DELETE /tasks/:id - Delete a task and Invalidate Cache
exports.deleteTask = async (req, res, next) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deletedTask) {
            return res.status(404).json({ 
                error: `Task with ID ${req.params.id} not found` 
            });
        }

        // CACHE INVALIDATION: Invalidate both all-tasks list cache and single-task cache
        cacheService.del(getTasksCacheKey(req.user.id));
        cacheService.del(getSingleTaskCacheKey(req.user.id, req.params.id));

        res.status(200).json({ 
            message: "Task deleted successfully", 
            task: deletedTask 
        });
    } catch (err) {
        next(err);
    }
};

// GET /tasks/cache/stats - Diagnostic and Laboratory Evidence Endpoint
exports.getCacheStats = (req, res) => {
    const stats = cacheService.getStats();
    res.status(200).json({
        message: "In-Memory Cache Diagnostics & Performance Metrics",
        status: "active",
        ...stats
    });
};

// POST /tasks/cache/clear - Clear cache endpoint for manual benchmarking
exports.clearCache = (req, res) => {
    cacheService.flush();
    cacheService.resetStats();
    res.status(200).json({
        message: "Cache flushed and metric counters reset successfully"
    });
};
