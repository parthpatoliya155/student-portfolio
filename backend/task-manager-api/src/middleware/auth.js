const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: "Access denied. No authentication token provided or token format is invalid." 
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token. Use process.env.JWT_SECRET (fallback to a temporary key if not defined)
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        
        const decoded = jwt.verify(token, secret);
        
        // Attach user info to request object (contains decoded JWT payload, e.g. { id: user._id })
        req.user = decoded;
        
        next();
    } catch (err) {
        // Handle expired token or invalid signature signature
        res.status(401).json({ 
            error: "Authentication failed. Token is invalid or has expired." 
        });
    }
};

module.exports = auth;
