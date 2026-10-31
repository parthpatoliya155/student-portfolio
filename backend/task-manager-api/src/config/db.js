const mongoose = require('mongoose');

const connectDB = async () => {
    // If already connected or connecting, reuse existing database connection
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
        return null;
    }
};

module.exports = connectDB;
