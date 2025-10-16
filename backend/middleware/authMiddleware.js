const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const protect = async (req, res, next) => {
  let token;

  // The token is sent in the headers like: "Bearer [token]"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's ID and attach it to the request object
      // We don't want the password, so we use .select('-password')
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Move on to the next piece of middleware or the controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
    // req.user is available from the 'protect' middleware which runs before this
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, proceed to the controller
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin }; 