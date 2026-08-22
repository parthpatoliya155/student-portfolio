const validateTask = (req, res, next) => {
    const { title, priority } = req.body;
    const errors = {};

    // Validate title on POST, and on PUT if title is supplied
    if (req.method === 'POST' || (req.method === 'PUT' && title !== undefined)) {
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            errors.title = "Task title is required and cannot be empty";
        }
    }

    if (priority !== undefined) {
        if (!['low', 'medium', 'high'].includes(priority)) {
            errors.priority = "Priority must be either 'low', 'medium', or 'high'";
        }
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ error: "Validation failed", details: errors });
    }

    next();
};

const validateAuth = (req, res, next) => {
    const { email, password } = req.body;
    const errors = {};

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
        errors.email = "Email is required";
    } else {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email.trim())) {
            errors.email = "Please fill a valid email address";
        }
    }

    if (!password || typeof password !== 'string' || password.length === 0) {
        errors.password = "Password is required";
    } else if (req.path.includes('/register') && password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ error: "Validation failed", details: errors });
    }

    next();
};

module.exports = {
    validateTask,
    validateAuth
};
