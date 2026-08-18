import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { hashPassword } from '../utils/password.js';
import { createAuditLog } from '../services/audit.service.js';

export async function getUsers(req: AuthRequest, res: Response) {
  const { role, departmentId, search } = req.query;

  const where: any = {};
  if (role) where.role = String(role);
  if (departmentId) where.departmentId = String(departmentId);
  if (search) {
    where.OR = [
      { name: { contains: String(search) } },
      { email: { contains: String(search) } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      department: true,
      studentProfile: true,
      facultyProfile: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ success: true, data: users });
}

export async function updateMyProfile(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const { name, phone, bio, resumeUrl, rollNumber, officeHours } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name ? { name } : {}),
      ...(phone ? { phone } : {}),
    },
    include: {
      studentProfile: true,
      facultyProfile: true,
      department: true,
    },
  });

  if (updatedUser.role === 'STUDENT') {
    await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        ...(bio ? { bio } : {}),
        ...(resumeUrl ? { resumeUrl } : {}),
        ...(rollNumber ? { rollNumber } : {}),
      },
      create: {
        userId,
        rollNumber: rollNumber || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        batch: '2024-2028',
        bio: bio || null,
        resumeUrl: resumeUrl || null,
      },
    });
  } else if (updatedUser.role === 'FACULTY') {
    await prisma.facultyProfile.upsert({
      where: { userId },
      update: {
        ...(bio ? { bio } : {}),
        ...(officeHours ? { officeHours } : {}),
      },
      create: {
        userId,
        employeeId: `FAC-${Math.floor(100 + Math.random() * 900)}`,
        designation: 'Assistant Professor',
        bio: bio || null,
        officeHours: officeHours || null,
      },
    });
  }

  await createAuditLog(userId, 'UPDATE_PROFILE', 'User', userId, { name, phone });

  const refreshed = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentProfile: true,
      facultyProfile: true,
      department: true,
    },
  });

  return res.json({
    success: true,
    message: 'Profile updated successfully.',
    data: refreshed,
  });
}

export async function createUser(req: AuthRequest, res: Response) {
  const { email, password, name, phone, role, departmentId, rollNumber, employeeId, designation } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email address already exists.' });
  }

  const passwordHash = await hashPassword(password || 'Password123!');
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      phone,
      role: role || 'STUDENT',
      departmentId: departmentId || null,
      emailVerified: true,
    },
  });

  if (role === 'STUDENT') {
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        rollNumber: rollNumber || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        batch: '2024-2028',
      },
    });
  } else if (role === 'FACULTY') {
    await prisma.facultyProfile.create({
      data: {
        userId: user.id,
        employeeId: employeeId || `FAC-${Math.floor(100 + Math.random() * 900)}`,
        designation: designation || 'Assistant Professor',
      },
    });
  }

  await createAuditLog(req.user?.userId || null, 'CREATE_USER', 'User', user.id, { email, role });

  return res.status(201).json({ success: true, message: 'User created successfully.', data: user });
}

export async function updateUserRole(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { role, status } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
    },
  });

  await createAuditLog(req.user?.userId || null, 'ROLE_CHANGED', 'User', id, { role, status });

  return res.json({ success: true, message: 'User role/status updated.', data: user });
}

export async function deleteUser(req: AuthRequest, res: Response) {
  const { id } = req.params;

  if (id === req.user?.userId) {
    return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
  }

  await prisma.user.delete({ where: { id } });
  await createAuditLog(req.user?.userId || null, 'USER_DELETED', 'User', id);

  return res.json({ success: true, message: 'User removed from platform.' });
}
