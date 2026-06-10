import express from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.post('/', protect, authorize('admin', 'editor'), upload.single('featuredImage'), createBlog);
router.put('/:id', protect, authorize('admin', 'editor'), upload.single('featuredImage'), updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);

export default router;
