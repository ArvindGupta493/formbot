const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateEmail, updatePassword } = require('../controllers/userController');
const authMiddleware = require('../middlewares/AuthMiddleware');
const { getFormDashboard } = require('../controllers/folderController');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Update email (requires authentication)
router.put('/update-email', authMiddleware, updateEmail);

// Update password (requires authentication)
router.put('/update-password', authMiddleware, updatePassword);
 
// Get form-dashboard
router.get("/form-dashboard/:userID", getFormDashboard);

module.exports = router;
