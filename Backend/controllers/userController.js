const User = require('../schema/user.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
// const { isValidEmail } = require('../utils/helper');
// const authMiddleware = require('../middlewares/AuthMiddleware');

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
  
        // Password matching check
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: "Passwords do not match" });
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name: username, // Use 'name' instead of 'username' to match the database schema
            email,
            password: hashedPassword,
        });

        // Save the user
        await user.save();

        // Create and return JWT
        const payload = { user: { id: user._id } };
        const token = jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '400h' });

        res.status(200).json({ message: "User Created Successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error in creating user" });
    }
};

// User login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        // Check if password matches (assuming bcrypt for password encryption)
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_JWT, {
            expiresIn: '400h',
        });

        res.cookie("token", token);
        res.status(200).json({ success: true, token });

    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
} 
// user.controller.js


// Route for updating email
exports.updateEmail = async (req, res) => {
  const { newEmail } = req.body;

  try {
    // Find user by ID (user ID is decoded from JWT in the middleware)
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    // Update email
    user.email = newEmail;
    await user.save();

    res.status(200).json({ message: 'Email updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Update password
exports.updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "Invalid input" });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ success: false, message: "Error updating password" });
    }
};
