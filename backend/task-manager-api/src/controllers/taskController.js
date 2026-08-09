const Task = require('../models/Task');

// GET /tasks - Get all tasks
exports.getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
};

// GET /tasks/:id - Get a single task by ID
exports.getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ 
                error: `Task with ID ${req.params.id} not found` 
            });
        }
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
};

// POST /tasks - Create a new task
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, completed, priority } = req.body;
        
        const newTask = new Task({
            title,
            description,
            completed,
            priority
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        next(err);
    }
};

// PUT /tasks/:id - Update an existing task
exports.updateTask = async (req, res, next) => {
    try {
        const { title, description, completed, priority } = req.body;
        
        const task = await Task.findById(req.params.id);
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
        res.status(200).json(updatedTask);
    } catch (err) {
        next(err);
    }
};

// DELETE /tasks/:id - Delete a task by ID
exports.deleteTask = async (req, res, next) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ 
                error: `Task with ID ${req.params.id} not found` 
            });
        }
        res.status(200).json({ 
            message: "Task deleted successfully", 
            task: deletedTask 
        });
    } catch (err) {
        next(err);
    }
};
