import express from 'express';
import { applyForJob, getCareerApplications, updateCareerApplicationStatus, deleteCareerApplication } from '../controllers/careerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('resume'), applyForJob);
router.get('/', protect, getCareerApplications);
router.put('/:id/status', protect, updateCareerApplicationStatus);
router.delete('/:id', protect, authorize('admin'), deleteCareerApplication);

export default router;
