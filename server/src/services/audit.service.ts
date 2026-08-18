import { prisma } from '../config/db.js';

export async function createAuditLog(
  userId: string | null,
  action: string,
  resource: string,
  resourceId?: string | null,
  metadata?: Record<string, any>
) {
  try {
    return await prisma.activityLog.create({
      data: {
        userId: userId || null,
        action,
        resource,
        resourceId: resourceId || null,
        ipAddress: '127.0.0.1',
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (err) {
    console.error('Failed to record audit log:', err);
    return null;
  }
}
