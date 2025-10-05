import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    // Get token from headers or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
      }

      // Attach user ID to request object
      req.userId = decoded.userId || decoded.id;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error in auth middleware.', error: error.message });
  }
};

export default authMiddleware;
