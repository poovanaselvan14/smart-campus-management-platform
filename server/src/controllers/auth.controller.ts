import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { AuthRequest } from '../middleware/auth.js';

export async function register(req: Request, res: Response) {
  const { email, password, name, phone, role, departmentId, rollNumber, batch, employeeId, designation } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email address is already registered.' });
  }

  const passwordHash = await hashPassword(password);
  // Default to STUDENT for public registration unless specified and valid
  const userRole = ['STUDENT', 'FACULTY', 'COORDINATOR'].includes(role) ? role : 'STUDENT';

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      phone,
      role: userRole,
      departmentId: departmentId || null,
      emailVerified: true, // Auto-verified for demo convenience
    },
  });

  if (userRole === 'STUDENT') {
    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        rollNumber: rollNumber || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        batch: batch || '2024-2028',
        semester: 1,
        gpa: 3.5,
      },
    });
  } else if (userRole === 'FACULTY') {
    await prisma.facultyProfile.create({
      data: {
        userId: user.id,
        employeeId: employeeId || `FAC-${Math.floor(100 + Math.random() * 900)}`,
        designation: designation || 'Assistant Professor',
      },
    });
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: 'User account created successfully.',
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
      },
    },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      studentProfile: true,
      facultyProfile: true,
      department: true,
    },
  });

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if (user.status === 'SUSPENDED') {
    return res.status(403).json({ success: false, message: 'Your account has been suspended by an administrator.' });
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    success: true,
    message: 'Login successful.',
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        department: user.department,
        profile: user.studentProfile || user.facultyProfile || null,
      },
    },
  });
}

export async function me(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      studentProfile: true,
      facultyProfile: true,
      department: true,
    },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  return res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      department: user.department,
      profile: user.studentProfile || user.facultyProfile || null,
    },
  });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully.' });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    // Return success to avoid email enumeration
    return res.json({ success: true, message: 'If an account exists, a reset link has been dispatched.' });
  }

  return res.json({
    success: true,
    message: 'Password reset link sent to your registered email address.',
    resetToken: 'demo-reset-token-' + Date.now(),
  });
}
