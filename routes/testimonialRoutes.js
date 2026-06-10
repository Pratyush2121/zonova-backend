import express from 'express';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', protect, authorize('admin', 'editor'), upload.single('image'), createTestimonial);
router.put('/:id', protect, authorize('admin', 'editor'), upload.single('image'), updateTestimonial);
router.delete('/:id', protect, authorize('admin'), deleteTestimonial);

export default router;
