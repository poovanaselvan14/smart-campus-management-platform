import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getNotifications(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return res.json({
    success: true,
    data: { notifications, unreadCount },
  });
}

export async function markAsRead(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (id === 'all') {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return res.json({ success: true, message: 'All notifications marked as read.' });
  }

  await prisma.notification.update({
    where: { id: id as string },
    data: { read: true },
  });

  return res.json({ success: true, message: 'Notification marked as read.' });
}
