import { prisma } from '../config/db.js';

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = 'INFO'
) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        read: false,
      },
    });
  } catch (err) {
    console.error('Failed to create notification:', err);
    return null;
  }
}

export async function notifyTargetUsers(
  targetRole: string,
  title: string,
  message: string,
  type: string = 'ANNOUNCEMENT'
) {
  try {
    const where = targetRole && targetRole !== 'ALL' ? { role: targetRole } : {};
    const users = await prisma.user.findMany({ where, select: { id: true } });

    const notificationsData = users.map((u) => ({
      userId: u.id,
      title,
      message,
      type,
      read: false,
    }));

    if (notificationsData.length > 0) {
      await prisma.notification.createMany({
        data: notificationsData,
      });
    }
  } catch (err) {
    console.error('Failed to notify target users:', err);
  }
}
