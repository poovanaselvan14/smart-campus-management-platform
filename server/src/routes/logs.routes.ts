import { Router } from 'express';
import { getActivityLogs } from '../controllers/logs.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', requireRole('ADMIN'), getActivityLogs);

export default router;
