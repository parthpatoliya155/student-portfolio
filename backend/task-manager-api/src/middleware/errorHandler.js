const errorHandler = (err, req, res, next) => {
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const details = {};
        for (const field in err.errors) {
            details[field] = err.errors[field].message;
        }
        return res.status(400).json({ 
            error: "Validation failed", 
            details 
        });
    }

    // Mongoose casting errors (e.g. invalid type casting)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: `Invalid format for field ${err.path}`
        });
    }

    // Database connection / buffering timeout error
    if (err.name === 'MongooseServerSelectionError' || err.name === 'MongooseError' || (err.message && err.message.includes('buffering timed out'))) {
        console.error("Database Connection Error:", err.message);
        return res.status(503).json({
            error: "Database connection unavailable. Please check that MONGO_URI is set in Render and Atlas Network Access allows 0.0.0.0/0.",
            details: err.message
        });
    }

    console.error("Global Error Handler Caught:", err.stack);
    res.status(500).json({ 
        error: "Something went wrong" 
    });
};

module.exports = errorHandler;
