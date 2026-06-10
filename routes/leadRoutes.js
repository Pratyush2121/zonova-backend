import express from 'express';
import { createLead, getLeads, updateLeadStatus, deleteLead, exportLeadsCSV } from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createLead);
router.get('/', protect, getLeads);
router.get('/export', protect, exportLeadsCSV);
router.put('/:id/status', protect, updateLeadStatus);
router.delete('/:id', protect, authorize('admin'), deleteLead);

export default router;
