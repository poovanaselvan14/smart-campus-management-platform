import { Router } from 'express';
import { createSession, getStudentAttendance, getFacultySessions } from '../controllers/attendance.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { logActivity } from '../middleware/auditLog.js';

const router = Router();

router.use(authenticate);

router.post('/session', requireRole('FACULTY', 'ADMIN'), logActivity('CREATE_ATTENDANCE_SESSION', 'AttendanceSession'), createSession);
router.get('/my', requireRole('STUDENT'), getStudentAttendance);
router.get('/student/:studentId', requireRole('FACULTY', 'COORDINATOR', 'ADMIN'), getStudentAttendance);
router.get('/faculty-sessions', requireRole('FACULTY', 'ADMIN'), getFacultySessions);

export default router;
