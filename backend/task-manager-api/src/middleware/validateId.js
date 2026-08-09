const mongoose = require('mongoose');

const validateId = (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ 
            error: "Invalid Task ID format. Must be a valid 24-character hexadecimal string." 
        });
    }
    next();
};

module.exports = validateId;
