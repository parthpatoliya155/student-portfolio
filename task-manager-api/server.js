const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// 1. In-memory storage for tasks
let tasks = [
    { id: 1, title: "Learn HTML/CSS", completed: true },
    { id: 2, title: "Build a Node/Express API", completed: false }
];

// 2. Global Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 3. Content-Type Checker Middleware for POST/PUT
// Rejects requests without Content-Type: application/json header
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const contentType = req.headers['content-type'];
        if (!contentType) {
            return res.status(400).json({ 
                error: "Bad Request. Content-Type header is missing." 
            });
        }
        if (!contentType.includes('application/json')) {
            return res.status(415).json({ 
                error: "Unsupported Media Type. Content-Type must be application/json." 
            });
        }
    }
    next();
});

// 4. Body Parser Middleware
app.use(express.json());

// 5. Route-specific Middleware: Task ID Validator
// Validates that the task ID is a positive integer before reaching the handler
const validateId = (req, res, next) => {
    const idStr = req.params.id;
    const id = parseInt(idStr, 10);
    
    // Ensure the ID is a valid positive integer and does not contain trailing letters (e.g. '123abc')
    if (isNaN(id) || String(id) !== idStr || id <= 0) {
        return res.status(400).json({ 
            error: "Invalid Task ID. Task ID must be a positive integer." 
        });
    }
    req.taskId = id; // Store validated ID as a number on the request object
    next();
};

// 6. RESTful CRUD Routes

// GET /tasks - Get all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// GET /tasks/:id - Get a single task by ID
app.get('/tasks/:id', validateId, (req, res) => {
    const task = tasks.find(t => t.id === req.taskId);
    if (!task) {
        return res.status(404).json({ 
            error: `Task with ID ${req.taskId} not found` 
        });
    }
    res.status(200).json(task);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res, next) => {
    try {
        const { title, completed } = req.body;
        
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ 
                error: "Validation failed. Task title is required and must be a non-empty string." 
            });
        }

        const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        const newTask = {
            id: nextId,
            title: title.trim(),
            completed: completed === true || completed === 'true'
        };

        tasks.push(newTask);
        res.status(201).json(newTask);
    } catch (err) {
        next(err); // Forward unexpected errors to global handler
    }
});

// PUT /tasks/:id - Update an existing task
app.put('/tasks/:id', validateId, (req, res, next) => {
    try {
        const { title, completed } = req.body;
        const task = tasks.find(t => t.id === req.taskId);

        if (!task) {
            return res.status(404).json({ 
                error: `Task with ID ${req.taskId} not found` 
            });
        }

        if (title !== undefined) {
            if (typeof title !== 'string' || title.trim() === '') {
                return res.status(400).json({ 
                    error: "Validation failed. Task title must be a non-empty string." 
                });
            }
            task.title = title.trim();
        }

        if (completed !== undefined) {
            task.completed = completed === true || completed === 'true';
        }

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// DELETE /tasks/:id - Delete a task by ID
app.delete('/tasks/:id', validateId, (req, res, next) => {
    try {
        const taskIndex = tasks.findIndex(t => t.id === req.taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ 
                error: `Task with ID ${req.taskId} not found` 
            });
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];
        res.status(200).json({ 
            message: "Task deleted successfully", 
            task: deletedTask 
        });
    } catch (err) {
        next(err);
    }
});

// Route to deliberately trigger an internal error (for testing error handler)
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
app.use((err, req, res, next) => {
    console.error("Global Error Handler Caught:", err.stack);
    res.status(500).json({ 
        error: "Something went wrong" 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
