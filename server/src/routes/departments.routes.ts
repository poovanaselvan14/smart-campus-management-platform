import { Router, Response } from 'express';
import { prisma } from '../config/db.js';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../middleware/auditLog.js';

const router = Router();

router.get('/', async (req, res) => {
  const departments = await prisma.department.findMany({
    include: {
      _count: {
        select: { users: true, courses: true },
      },
    },
  });
  res.json({ success: true, data: departments });
});

router.post('/', authenticate, requireRole('ADMIN'), logActivity('CREATE_DEPARTMENT', 'Department'), async (req: AuthRequest, res: Response) => {
  const { name, code, description } = req.body;
  const department = await prisma.department.create({
    data: { name, code, description },
  });
  res.status(201).json({ success: true, data: department });
});

export default router;
