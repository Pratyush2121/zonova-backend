import express from 'express';
import { loginUser, registerUser, getUserProfile, getUsers, updateUserRole } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', protect, authorize('admin'), registerUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);

export default router;
