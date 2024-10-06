require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('./models/user');

// JWT Authentication Middleware
const jwtAuthMiddleware = (req, res, next) => {
    // Extract the authorization header from the request
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing from header' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure you have a JWT_SECRET in your environment variables
        req.user = decoded; // Attach user data to request
        next();
    } catch (err) {
        console.error(err); // Log the error
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Function to generate JWT token
function generateToken(username) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

module.exports = { jwtAuthMiddleware, generateToken };
