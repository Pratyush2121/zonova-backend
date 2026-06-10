import express from 'express';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getTeamMembers);
router.post('/', protect, authorize('admin', 'editor'), upload.single('image'), createTeamMember);
router.put('/:id', protect, authorize('admin', 'editor'), upload.single('image'), updateTeamMember);
router.delete('/:id', protect, authorize('admin'), deleteTeamMember);

export default router;
