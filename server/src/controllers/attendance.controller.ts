import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { createNotification } from '../services/notification.service.js';
import { createAuditLog } from '../services/audit.service.js';

export async function createSession(req: AuthRequest, res: Response) {
  const { courseId, title, date, startTime, endTime, records } = req.body;
  const facultyId = req.user?.userId;

  if (!facultyId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  // Verify course exists or fallback to first course
  let targetCourseId = courseId;
  if (!targetCourseId) {
    const defaultCourse = await prisma.course.findFirst();
    if (!defaultCourse) return res.status(400).json({ success: false, message: 'No active course found.' });
    targetCourseId = defaultCourse.id;
  }

  const qrCode = `ATT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Transaction safe execution
  const session = await prisma.$transaction(async (tx) => {
    const newSession = await tx.attendanceSession.create({
      data: {
        courseId: targetCourseId,
        facultyId,
        title: title || 'Regular Lecture Session',
        date: date || new Date().toISOString().split('T')[0],
        startTime: startTime || '09:30 AM',
        endTime: endTime || '11:00 AM',
        qrCode,
      },
    });

    if (Array.isArray(records) && records.length > 0) {
      const attendanceData = records.map((r: { studentId: string; status: string }) => ({
        sessionId: newSession.id,
        studentId: r.studentId,
        status: r.status || 'PRESENT',
      }));

      await tx.attendanceRecord.createMany({
        data: attendanceData,
      });
    }

    return newSession;
  });

  // Evaluate attendance health and generate warning notifications for students below 75%
  if (Array.isArray(records)) {
    for (const item of records) {
      const studentId = item.studentId;
      const allStudentRecords = await prisma.attendanceRecord.findMany({ where: { studentId } });
      const total = allStudentRecords.length;
      const present = allStudentRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
      const pct = total > 0 ? Math.round((present / total) * 100) : 100;

      if (pct < 75) {
        await createNotification(
          studentId,
          'Attendance Health Warning',
          `Your overall attendance is currently ${pct}%. Please attend upcoming classes to remain in good standing.`,
          'ATTENDANCE'
        );
      }
    }
  }

  await createAuditLog(facultyId, 'ATTENDANCE_CREATED', 'AttendanceSession', session.id, { title, courseId: targetCourseId });

  return res.status(201).json({
    success: true,
    message: 'Attendance session created & records saved.',
    data: session,
  });
}

export async function getStudentAttendance(req: AuthRequest, res: Response) {
  const studentId = req.params.studentId || req.user?.userId;

  if (!studentId) return res.status(400).json({ success: false, message: 'Student ID required.' });

  // Fetch all attendance records for this student from DB
  const records = await prisma.attendanceRecord.findMany({
    where: { studentId },
    include: {
      session: {
        include: { course: true, faculty: { select: { name: true } } },
      },
    },
    orderBy: { markedAt: 'desc' },
  });

  const totalSessions = records.length;
  const presentCount = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const overallPercentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;

  // Group by Course
  const courseMap: Record<string, { courseName: string; code: string; total: number; present: number }> = {};
  records.forEach(r => {
    const cId = r.session.courseId;
    if (!courseMap[cId]) {
      courseMap[cId] = {
        courseName: r.session.course.name,
        code: r.session.course.code,
        total: 0,
        present: 0,
      };
    }
    courseMap[cId].total += 1;
    if (r.status === 'PRESENT' || r.status === 'LATE') {
      courseMap[cId].present += 1;
    }
  });

  const courseBreakdown = Object.values(courseMap).map(c => {
    const pct = c.total > 0 ? Math.round((c.present / c.total) * 100) : 100;
    return { ...c, percentage: pct };
  });

  // Calculate recommendation target
  const targetPct = 80;
  let targetAdvice = 'Your attendance is in good standing.';
  if (overallPercentage < targetPct && totalSessions > 0) {
    const needed = Math.ceil((0.8 * totalSessions - presentCount) / 0.2);
    targetAdvice = `Your current attendance is ${overallPercentage}%. You need to attend the next ${needed} consecutive class(es) to reach ${targetPct}%.`;
  }

  return res.json({
    success: true,
    data: {
      totalSessions,
      presentCount,
      absentCount,
      overallPercentage,
      targetAdvice,
      courseBreakdown,
      history: records,
    },
  });
}

export async function getFacultySessions(req: AuthRequest, res: Response) {
  const facultyId = req.user?.userId;

  const sessions = await prisma.attendanceSession.findMany({
    where: { facultyId },
    include: {
      course: true,
      records: {
        include: { student: { select: { id: true, name: true, email: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ success: true, data: sessions });
}
