const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Uncommented bcrypt import
const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');

router.post('/signup', async (req, res) => {
    try {
        const { password, name, age, isVoted, aadharCardNumber, email, role, address, mobile } = req.body;

        // Simple validation
        if (!password || !name || !email) { // Ensure all required fields are checked
            return res.status(400).json({ error: "Required fields are missing" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email }); // Check by email, not username
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ password: hashedPassword, name, age, isVoted, aadharCardNumber, email, role, address, mobile });
        const savedUser = await newUser.save();

        const payload = {
            id: savedUser.id,
        };

        const token = generateToken(payload); // Pass payload to generateToken
        res.status(200).json({ response: savedUser, token: token });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post('/login', async (req, res) => {
    try {
        // Extract aadharcardnumber and password from req body
        const { aadharCardNumber, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber }); // Changed to User instead of Person

        // If user does not exist or password does not match
        if (!user || !(await bcrypt.compare(password, user.password))) { // Corrected password comparison
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate token
        const payload = {
            id: user.id,
            
        };
        const token = generateToken(payload);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Make sure to access the correct user ID
        const user = await User.findById(userId); // Ensure correct model is used

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Correctly retrieve user ID
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ error: "Invalid current password" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
