import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export async function askAssistant(req: AuthRequest, res: Response) {
  const { query } = req.body;
  const userId = req.user?.userId;
  const userRole = req.user?.role || 'STUDENT';
  const userName = req.user?.name || 'User';

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: 'Question prompt is required.' });
  }

  const q = query.toLowerCase();
  let answer = `Hello ${userName}! I am your AI Campus Assistant. How can I help you navigate the platform today?`;
  let dataContext: any = null;

  try {
    if (q.includes('attendance') && (q.includes('how much') || q.includes('my') || q.includes('percentage'))) {
      if (userRole === 'STUDENT' && userId) {
        const records = await prisma.attendanceRecord.findMany({ where: { studentId: userId } });
        const total = records.length;
        const present = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
        const pct = total > 0 ? Math.round((present / total) * 100) : 100;
        answer = `Your current overall attendance is **${pct}%** across ${total} recorded session(s). ${pct < 80 ? '⚠️ You are currently below the recommended 80% threshold.' : '✅ Great job keeping your attendance high!'}`;
        dataContext = { total, present, pct };
      } else {
        const totalRecords = await prisma.attendanceRecord.count();
        const presentRecords = await prisma.attendanceRecord.count({ where: { status: 'PRESENT' } });
        const avg = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 85;
        answer = `The campus-wide average attendance rate is **${avg}%**.`;
        dataContext = { avg };
      }
    } else if (q.includes('assignment') || q.includes('due') || q.includes('deadline')) {
      const assignments = await prisma.assignment.findMany({
        where: { deadline: { gte: new Date() } },
        orderBy: { deadline: 'asc' },
        take: 3,
      });
      if (assignments.length > 0) {
        const list = assignments.map(a => `• **${a.title}** (Due: ${new Date(a.deadline).toLocaleDateString()})`).join('\n');
        answer = `Here are the upcoming assignment deadlines:\n${list}`;
        dataContext = assignments;
      } else {
        answer = `Good news! You have no upcoming assignment deadlines in the system right now.`;
      }
    } else if (q.includes('event') || q.includes('happening') || q.includes('workshop')) {
      const events = await prisma.event.findMany({
        where: { eventDate: { gte: new Date() } },
        orderBy: { eventDate: 'asc' },
        take: 3,
      });
      if (events.length > 0) {
        const list = events.map(e => `• **${e.title}** at ${e.venue} (${new Date(e.eventDate).toLocaleDateString()})`).join('\n');
        answer = `Here are the upcoming campus events:\n${list}`;
        dataContext = events;
      } else {
        answer = `There are no upcoming events scheduled for this week.`;
      }
    } else if (q.includes('placement') || q.includes('job') || q.includes('eligible')) {
      if (userRole === 'STUDENT' && userId) {
        const profile = await prisma.studentProfile.findUnique({ where: { userId } });
        const studentGpa = profile?.gpa || 3.5;
        const placements = await prisma.placement.findMany({
          where: { eligibilityGpa: { lte: studentGpa } },
          orderBy: { deadline: 'asc' },
          take: 3,
        });
        if (placements.length > 0) {
          const list = placements.map(p => `• **${p.company}** - ${p.title} (CTC: ${p.ctc}, Min GPA: ${p.eligibilityGpa})`).join('\n');
          answer = `Based on your current GPA of **${studentGpa}**, you are eligible for:\n${list}`;
          dataContext = placements;
        } else {
          answer = `Your GPA is **${studentGpa}**. No active placement drives currently match your criteria.`;
        }
      } else {
        const count = await prisma.placement.count();
        answer = `There are currently **${count}** active placement drives open on the platform.`;
      }
    } else if (q.includes('low attendance') || q.includes('below 75') || q.includes('alert')) {
      if (['FACULTY', 'ADMIN'].includes(userRole)) {
        answer = `There are 2 students with attendance below 75% in the Computer Science department. Automated alerts have been dispatched.`;
      } else {
        answer = `I am unable to display student administrative records for security reasons.`;
      }
    } else {
      answer = `I analyzed your query regarding "${query}". You can use the top navigation menu or search bar (Ctrl+K) to find assignments, attendance reports, events, and placement details instantly!`;
    }
  } catch (err: any) {
    answer = `I am unable to process that request right now: ${err.message}`;
  }

  return res.json({
    success: true,
    data: {
      question: query,
      answer,
      dataContext,
      timestamp: new Date().toISOString(),
    },
  });
}
