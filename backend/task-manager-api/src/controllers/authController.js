const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /auth/register - Register a new user
exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ 
                error: "Registration failed", 
                details: { email: "Email is already registered" } 
            });
        }

        // Hash the password with bcrypt (10 rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user document
        const newUser = new User({
            email: normalizedEmail,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                email: savedUser.email
            }
        });
    } catch (err) {
        next(err);
    }
};

// POST /auth/login - Login user and return JWT token
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user exists
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ 
                error: "Invalid email or password" 
            });
        }

        // Verify password hash match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                error: "Invalid email or password" 
            });
        }

        // Sign JWT token
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            secret, 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
};

// GET /auth/me - Retrieve currently logged in user info
exports.getMe = async (req, res, next) => {
    try {
        // req.user has decoded info from auth middleware (contains id)
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ 
                error: "User not found" 
            });
        }
        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
};
