import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getActivityLogs(req: AuthRequest, res: Response) {
  const logs = await prisma.activityLog.findMany({
    include: {
      user: { select: { name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return res.json({ success: true, data: logs });
}
