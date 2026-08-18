import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { prisma } from '../config/db.js';

export function logActivity(action: string, resource: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Continue request processing first
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        try {
          await prisma.activityLog.create({
            data: {
              userId: req.user?.userId || null,
              action,
              resource,
              resourceId: (req.params.id as string) || (req.body.id as string) || null,
              ipAddress: req.ip || req.socket.remoteAddress || '127.0.0.1',
              metadata: JSON.stringify({
                method: req.method,
                url: req.originalUrl,
                userEmail: req.user?.email || 'ANONYMOUS',
                userRole: req.user?.role || 'NONE',
              }),
            },
          });
        } catch (err) {
          console.error('Failed to log activity:', err);
        }
      }
    });
    next();
  };
}
