const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateAuth } = require('../middleware/validation');

// Public routes
router.post('/register', validateAuth, authController.register);
router.post('/login', validateAuth, authController.login);

// Protected routes (require valid JWT)
router.get('/me', auth, authController.getMe);

module.exports = router;
