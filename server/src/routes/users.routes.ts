import { Router } from 'express';
import { getUsers, createUser, updateUserRole, deleteUser, updateMyProfile } from '../controllers/users.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logActivity } from '../middleware/auditLog.js';

const router = Router();

router.use(authenticate);

// User profile self-update
router.patch('/me', updateMyProfile);

// Admin-only user management routes
router.get('/', requireRole('ADMIN'), getUsers);
router.post('/', requireRole('ADMIN'), logActivity('CREATE_USER', 'User'), createUser);
router.patch('/:id', requireRole('ADMIN'), logActivity('UPDATE_USER', 'User'), updateUserRole);
router.delete('/:id', requireRole('ADMIN'), logActivity('DELETE_USER', 'User'), deleteUser);

export default router;
