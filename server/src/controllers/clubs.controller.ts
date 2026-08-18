import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getClubs(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;

  const clubs = await prisma.club.findMany({
    include: {
      coordinator: { select: { name: true, email: true } },
      _count: { select: { members: true } },
      members: userId ? { where: { studentId: userId } } : false,
    },
  });

  const formatted = clubs.map(c => ({
    ...c,
    memberCount: c._count.members,
    isJoined: Array.isArray(c.members) && c.members.length > 0,
  }));

  return res.json({ success: true, data: formatted });
}

export async function toggleClubMembership(req: AuthRequest, res: Response) {
  const { clubId } = req.params;
  const studentId = req.user?.userId;

  if (!studentId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const existing = await prisma.clubMembership.findUnique({
    where: { clubId_studentId: { clubId, studentId } },
  });

  if (existing) {
    await prisma.clubMembership.delete({ where: { id: existing.id } });
    return res.json({ success: true, message: 'Left club.', isJoined: false });
  } else {
    await prisma.clubMembership.create({
      data: { clubId, studentId },
    });
    return res.json({ success: true, message: 'Joined club successfully!', isJoined: true });
  }
}
