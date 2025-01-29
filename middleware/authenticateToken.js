const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const authenticateToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        if (!req.user) {
            return res.status(401).json({ message: 'Access denied. Invalid token.' });
        }

        next();  // Continue to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Access denied. Invalid or expired token.' });
    }
});

module.exports = authenticateToken;
