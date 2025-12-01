const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and attach userId to request
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming token is sent as "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        // Verify and decode the token
        console.log(token,"token");
        const decodedToken = jwt.verify(token, process.env.jwt_secret);
        req.userId = decodedToken.id; // Attach userId to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error.message, error.stack);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateJWT;
