import express from 'express';
import { getPrivacyContent, updatePrivacyContent } from '../controllers/privacyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:type', getPrivacyContent);
router.put('/:type', protect, authorize('admin', 'editor'), updatePrivacyContent);

export default router;
