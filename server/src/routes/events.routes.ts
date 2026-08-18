import { Router } from 'express';
import {
  createEvent,
  getEvents,
  registerForEvent,
  cancelRegistration,
  verifyQRPass,
} from '../controllers/events.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logActivity } from '../middleware/auditLog.js';

const router = Router();

router.use(authenticate);

router.get('/', getEvents);
router.post('/', requireRole('COORDINATOR', 'ADMIN'), logActivity('CREATE_EVENT', 'Event'), createEvent);
router.post('/:eventId/register', requireRole('STUDENT'), registerForEvent);
router.delete('/:eventId/register', requireRole('STUDENT'), cancelRegistration);
router.post('/verify-qr', requireRole('COORDINATOR', 'ADMIN'), verifyQRPass);

export default router;
