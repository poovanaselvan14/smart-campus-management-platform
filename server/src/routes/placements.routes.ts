import { Router } from 'express';
import {
  createPlacement,
  getPlacements,
  applyForPlacement,
  updateApplicationStatus,
} from '../controllers/placements.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logActivity } from '../middleware/auditLog.js';

const router = Router();

router.use(authenticate);

router.get('/', getPlacements);
router.post('/', requireRole('COORDINATOR', 'ADMIN'), logActivity('CREATE_PLACEMENT', 'Placement'), createPlacement);
router.post('/:placementId/apply', requireRole('STUDENT'), applyForPlacement);
router.patch('/applications/:applicationId/status', requireRole('COORDINATOR', 'ADMIN'), logActivity('UPDATE_PLACEMENT_STATUS', 'PlacementApplication'), updateApplicationStatus);

export default router;
