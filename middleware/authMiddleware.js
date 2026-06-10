import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

// Resolve any ESM/CJS interop default wrapping issues safely
const User = (UserModel && UserModel.default) ? (UserModel.default.default || UserModel.default) : UserModel;

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'zonova_super_secret_key_123');
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      // omit password
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'none'}' is not authorized to access this resource`
      });
    }
    next();
  };
};
