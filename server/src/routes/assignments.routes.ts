import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  submitAssignment,
  gradeSubmission,
  getSubmissionsForAssignment,
} from '../controllers/assignments.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logActivity } from '../middleware/auditLog.js';

const router = Router();

router.use(authenticate);

router.get('/', getAssignments);
router.post('/', requireRole('FACULTY', 'ADMIN'), logActivity('CREATE_ASSIGNMENT', 'Assignment'), createAssignment);
router.post('/:assignmentId/submit', requireRole('STUDENT'), submitAssignment);
router.get('/:assignmentId/submissions', requireRole('FACULTY', 'COORDINATOR', 'ADMIN'), getSubmissionsForAssignment);
router.patch('/submissions/:submissionId/grade', requireRole('FACULTY', 'ADMIN'), logActivity('GRADE_SUBMISSION', 'AssignmentSubmission'), gradeSubmission);

export default router;
