const mongoose = require('mongoose');

const connectDB = async () => {
    // If already connected, reuse existing database connection
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.warn('⚠️ Warning: MONGO_URI is not defined in environment variables. Database features will be unavailable.');
        return null;
    }

    try {
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB connected successfully to host: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // Do not crash server in production so healthchecks remain accessible
        if (process.env.NODE_ENV !== 'production' && !process.env.RENDER) {
            process.exit(1);
        }
        return null;
    }
};

module.exports = connectDB;
