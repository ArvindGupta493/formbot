const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        req.user = decoded;  // Attach user info to the request
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
