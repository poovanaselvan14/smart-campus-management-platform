import { Router } from 'express';
import { createAnnouncement, getAnnouncements } from '../controllers/announcements.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logActivity } from '../middleware/auditLog.js';

const router = Router();

router.use(authenticate);

router.get('/', getAnnouncements);
router.post('/', requireRole('FACULTY', 'COORDINATOR', 'ADMIN'), logActivity('CREATE_ANNOUNCEMENT', 'Announcement'), createAnnouncement);

export default router;
