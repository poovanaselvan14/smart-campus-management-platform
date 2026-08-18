import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { createNotification } from '../services/notification.service.js';
import { createAuditLog } from '../services/audit.service.js';

export async function createAssignment(req: AuthRequest, res: Response) {
  const { courseId, title, description, deadline, maxMarks, attachmentUrl } = req.body;
  const facultyId = req.user?.userId;

  if (!facultyId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  let targetCourseId = courseId;
  if (!targetCourseId) {
    const firstCourse = await prisma.course.findFirst();
    if (!firstCourse) return res.status(400).json({ success: false, message: 'No course found.' });
    targetCourseId = firstCourse.id;
  }

  const assignment = await prisma.assignment.create({
    data: {
      courseId: targetCourseId,
      facultyId,
      title,
      description,
      deadline: new Date(deadline || Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxMarks: Number(maxMarks) || 100,
      attachmentUrl: attachmentUrl || null,
    },
  });

  // Notify all students
  const students = await prisma.user.findMany({ where: { role: 'STUDENT' }, select: { id: true } });
  for (const s of students) {
    await createNotification(
      s.id,
      'New Assignment Posted',
      `Assignment "${title}" published. Due: ${new Date(assignment.deadline).toLocaleDateString()}.`,
      'ASSIGNMENT'
    );
  }

  await createAuditLog(facultyId, 'ASSIGNMENT_CREATED', 'Assignment', assignment.id, { title });

  return res.status(201).json({ success: true, message: 'Assignment created successfully.', data: assignment });
}

export async function getAssignments(req: AuthRequest, res: Response) {
  const user = req.user;

  let assignments;
  if (user?.role === 'STUDENT') {
    assignments = await prisma.assignment.findMany({
      include: {
        course: true,
        faculty: { select: { name: true, email: true } },
        submissions: {
          where: { studentId: user.userId },
        },
      },
      orderBy: { deadline: 'asc' },
    });
  } else {
    assignments = await prisma.assignment.findMany({
      include: {
        course: true,
        faculty: { select: { name: true, email: true } },
        _count: { select: { submissions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  return res.json({ success: true, data: assignments });
}

export async function submitAssignment(req: AuthRequest, res: Response) {
  const { assignmentId } = req.params;
  const { solutionUrl, githubUrl } = req.body;
  const studentId = req.user?.userId;

  if (!studentId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) {
    return res.status(404).json({ success: false, message: 'Assignment not found.' });
  }

  const now = new Date();
  const isLate = now > new Date(assignment.deadline);

  const submission = await prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId,
        studentId,
      },
    },
    update: {
      solutionUrl: solutionUrl || null,
      githubUrl: githubUrl || null,
      submittedAt: now,
      isLate,
      status: 'SUBMITTED',
    },
    create: {
      assignmentId,
      studentId,
      solutionUrl: solutionUrl || null,
      githubUrl: githubUrl || null,
      submittedAt: now,
      isLate,
      status: 'SUBMITTED',
    },
  });

  await createAuditLog(studentId, 'ASSIGNMENT_SUBMITTED', 'AssignmentSubmission', submission.id, { isLate });

  return res.json({
    success: true,
    message: isLate ? 'Assignment submitted (LATE).' : 'Assignment submitted successfully on time.',
    data: submission,
  });
}

export async function gradeSubmission(req: AuthRequest, res: Response) {
  const { submissionId } = req.params;
  const { marks, feedback } = req.body;

  const submission = await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      marks: Number(marks),
      feedback: feedback || null,
      status: 'GRADED',
    },
    include: { assignment: true },
  });

  await createNotification(
    submission.studentId,
    'Assignment Graded',
    `Your submission for "${submission.assignment.title}" has been graded: ${marks}/${submission.assignment.maxMarks} marks.`,
    'ASSIGNMENT'
  );

  await createAuditLog(req.user?.userId || null, 'GRADE_UPDATED', 'AssignmentSubmission', submissionId, { marks });

  return res.json({ success: true, message: 'Submission graded successfully.', data: submission });
}

export async function getSubmissionsForAssignment(req: AuthRequest, res: Response) {
  const { assignmentId } = req.params;

  const submissions = await prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: {
      student: {
        select: { id: true, name: true, email: true, studentProfile: true },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });

  return res.json({ success: true, data: submissions });
}
