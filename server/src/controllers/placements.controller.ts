import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { createNotification } from '../services/notification.service.js';
import { createAuditLog } from '../services/audit.service.js';

export async function createPlacement(req: AuthRequest, res: Response) {
  const { company, title, description, eligibilityGpa, skills, ctc, location, deadline } = req.body;
  const createdById = req.user?.userId;

  if (!createdById) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const placement = await prisma.placement.create({
    data: {
      company,
      title,
      description,
      eligibilityGpa: Number(eligibilityGpa) || 3.0,
      skills: Array.isArray(skills) ? skills.join(', ') : String(skills || 'Java, SQL'),
      ctc,
      location,
      deadline: new Date(deadline),
      createdById,
    },
  });

  await createAuditLog(createdById, 'PLACEMENT_CREATED', 'Placement', placement.id, { company, title });

  return res.status(201).json({ success: true, message: 'Placement opportunity published.', data: placement });
}

export async function getPlacements(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;

  const studentProfile = userId
    ? await prisma.studentProfile.findUnique({ where: { userId } })
    : null;

  const placements = await prisma.placement.findMany({
    include: {
      _count: { select: { applications: true } },
      applications: userId
        ? { where: { studentId: userId } }
        : false,
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatted = placements.map(p => {
    const userApp = Array.isArray(p.applications) && p.applications.length > 0 ? p.applications[0] : null;
    const isEligible = studentProfile ? studentProfile.gpa >= p.eligibilityGpa : true;
    return {
      ...p,
      applicantCount: p._count.applications,
      hasApplied: !!userApp,
      applicationStatus: userApp?.status || null,
      isEligible,
      studentGpa: studentProfile?.gpa || null,
    };
  });

  return res.json({ success: true, data: formatted });
}

export async function applyForPlacement(req: AuthRequest, res: Response) {
  const { placementId } = req.params;
  const { resumeUrl } = req.body;
  const studentId = req.user?.userId;

  if (!studentId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const placement = await prisma.placement.findUnique({ where: { id: placementId } });
  if (!placement) return res.status(404).json({ success: false, message: 'Placement opportunity not found.' });

  const profile = await prisma.studentProfile.findUnique({ where: { userId: studentId } });
  if (profile && profile.gpa < placement.eligibilityGpa) {
    return res.status(400).json({
      success: false,
      message: `Eligibility Check Failed: Minimum required GPA is ${placement.eligibilityGpa}. Your current GPA is ${profile.gpa}.`,
    });
  }

  const application = await prisma.placementApplication.upsert({
    where: { placementId_studentId: { placementId, studentId } },
    update: { resumeUrl: resumeUrl || profile?.resumeUrl || 'https://example.com/resume.pdf', status: 'APPLIED' },
    create: { placementId, studentId, resumeUrl: resumeUrl || profile?.resumeUrl || 'https://example.com/resume.pdf', status: 'APPLIED' },
  });

  await createNotification(
    studentId,
    'Placement Application Submitted',
    `Your application for ${placement.title} at ${placement.company} has been received.`,
    'PLACEMENT'
  );

  await createAuditLog(studentId, 'PLACEMENT_APPLIED', 'PlacementApplication', application.id, { company: placement.company });

  return res.status(201).json({ success: true, message: 'Application submitted successfully.', data: application });
}

export async function updateApplicationStatus(req: AuthRequest, res: Response) {
  const { applicationId } = req.params;
  const { status } = req.body;

  const app = await prisma.placementApplication.update({
    where: { id: applicationId },
    data: { status },
    include: { placement: true },
  });

  await createNotification(
    app.studentId,
    'Placement Status Update',
    `Your application status for ${app.placement.company} changed to: ${status}.`,
    'PLACEMENT'
  );

  await createAuditLog(req.user?.userId || null, 'APPLICATION_STATUS_CHANGED', 'PlacementApplication', applicationId, { status });

  return res.json({ success: true, message: 'Application status updated.', data: app });
}
