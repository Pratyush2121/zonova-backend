import express from 'express';
import { subscribeNewsletter, getSubscribers, unsubscribeNewsletter } from '../controllers/newsletterController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);
router.get('/subscribers', protect, getSubscribers);

export default router;
