import { Router } from 'express';
import { getClubs, toggleClubMembership } from '../controllers/clubs.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getClubs);
router.post('/:clubId/toggle', requireRole('STUDENT'), toggleClubMembership);

export default router;
