import express from 'express';
import { createStartupApplication, getStartupApplications, updateStartupApplicationStatus, deleteStartupApplication } from '../controllers/startupController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createStartupApplication);
router.get('/', protect, getStartupApplications);
router.put('/:id/status', protect, updateStartupApplicationStatus);
router.delete('/:id', protect, authorize('admin'), deleteStartupApplication);

export default router;
