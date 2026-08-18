import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export async function createAnnouncement(req: AuthRequest, res: Response) {
  const { title, content, audienceRole, priority, expiresAt } = req.body;
  const createdById = req.user?.userId;

  if (!createdById) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      audienceRole: audienceRole || 'ALL',
      priority: priority || 'MEDIUM',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdById,
    },
  });

  // Notify audience users
  const targetUsers = await prisma.user.findMany({
    where: audienceRole && audienceRole !== 'ALL' ? { role: audienceRole } : {},
    select: { id: true },
  });

  for (const u of targetUsers) {
    await prisma.notification.create({
      data: {
        userId: u.id,
        title: `Announcement: ${title}`,
        message: content.length > 100 ? content.slice(0, 97) + '...' : content,
        type: 'ANNOUNCEMENT',
      },
    });
  }

  return res.status(201).json({ success: true, message: 'Announcement broadcasted.', data: announcement });
}

export async function getAnnouncements(req: AuthRequest, res: Response) {
  const userRole = req.user?.role || 'STUDENT';

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { audienceRole: 'ALL' },
        { audienceRole: userRole },
      ],
    },
    include: {
      createdBy: { select: { name: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ success: true, data: announcements });
}
