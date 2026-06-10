import express from 'express';
import { bookMeeting, getMeetings, updateMeetingStatus, deleteMeeting } from '../controllers/meetingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', bookMeeting);
router.get('/', protect, getMeetings);
router.put('/:id', protect, updateMeetingStatus);
router.delete('/:id', protect, authorize('admin'), deleteMeeting);

export default router;
