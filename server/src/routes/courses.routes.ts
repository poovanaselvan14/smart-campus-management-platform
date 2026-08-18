import { Router, Response } from 'express';
import { prisma } from '../config/db.js';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../middleware/auditLog.js';

const router = Router();

router.get('/', async (req, res) => {
  const courses = await prisma.course.findMany({
    include: {
      department: true,
      _count: {
        select: { assignments: true, attendanceSessions: true },
      },
    },
  });
  res.json({ success: true, data: courses });
});

router.post('/', authenticate, requireRole('ADMIN'), logActivity('CREATE_COURSE', 'Course'), async (req: AuthRequest, res: Response) => {
  const { name, code, credits, departmentId, facultyId } = req.body;
  const course = await prisma.course.create({
    data: { name, code, credits: Number(credits) || 3, departmentId, facultyId: facultyId || null },
  });
  res.status(201).json({ success: true, data: course });
});

export default router;
