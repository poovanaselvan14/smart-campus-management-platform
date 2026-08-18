import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export async function globalSearch(req: AuthRequest, res: Response) {
  const query = String(req.query.q || '').trim();
  const userRole = req.user?.role || 'STUDENT';

  if (!query || query.length < 2) {
    return res.json({ success: true, data: { results: [] } });
  }

  const results: Array<{ type: string; title: string; subtitle: string; link: string }> = [];

  // Search Assignments
  const assignments = await prisma.assignment.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    },
    take: 5,
  });
  assignments.forEach(a => {
    results.push({ type: 'Assignment', title: a.title, subtitle: `Due: ${new Date(a.deadline).toLocaleDateString()}`, link: '/assignments' });
  });

  // Search Events
  const events = await prisma.event.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { venue: { contains: query } },
      ],
    },
    take: 5,
  });
  events.forEach(e => {
    results.push({ type: 'Event', title: e.title, subtitle: `${e.venue} • ${new Date(e.eventDate).toLocaleDateString()}`, link: '/events' });
  });

  // Search Placements
  const placements = await prisma.placement.findMany({
    where: {
      OR: [
        { company: { contains: query } },
        { title: { contains: query } },
      ],
    },
    take: 5,
  });
  placements.forEach(p => {
    results.push({ type: 'Placement', title: `${p.company} - ${p.title}`, subtitle: `CTC: ${p.ctc} • Location: ${p.location}`, link: '/placements' });
  });

  // Search Announcements
  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
      ],
    },
    take: 5,
  });
  announcements.forEach(an => {
    results.push({ type: 'Announcement', title: an.title, subtitle: `Priority: ${an.priority}`, link: '/announcements' });
  });

  // Role restricted search: Faculty/Admin can search Users & Students
  if (['FACULTY', 'COORDINATOR', 'ADMIN'].includes(userRole)) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
        ],
      },
      take: 5,
    });
    users.forEach(u => {
      results.push({ type: 'User', title: u.name, subtitle: `${u.role} (${u.email})`, link: userRole === 'ADMIN' ? '/admin/users' : '/dashboard' });
    });
  }

  return res.json({ success: true, data: { query, results } });
}
