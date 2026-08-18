import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getDashboardAnalytics);

export default router;
