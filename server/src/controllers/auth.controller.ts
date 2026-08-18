import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { AuthRequest } from '../middleware/auth.js';

// Helper to seed core demo users on demand if missing in production DB
async function ensureDemoUser(email: string, role: string, name: string) {
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      console.log(`[DEMO_AUTO_SEED] Seeding missing demo account: ${email}`);
      const passwordHash = await hashPassword('Password123!');
      
      const dept = await prisma.department.upsert({
        where: { code: 'CSE' },
        update: {},
        create: { name: 'Computer Science & Engineering', code: 'CSE', description: 'AI, Software Systems & Data Science' },
      });

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          role,
          phone: '+1 555-0100',
          emailVerified: true,
          departmentId: dept.id,
        },
      });

      if (role === 'STUDENT') {
        await prisma.studentProfile.create({
          data: {
            userId: user.id,
            rollNumber: '2024-CSE-042',
            batch: '2024-2028',
            semester: 4,
            gpa: 3.82,
          },
        });
      } else if (role === 'FACULTY') {
        await prisma.facultyProfile.create({
          data: {
            userId: user.id,
            employeeId: 'FAC-2024-08',
            designation: 'Associate Professor',
          },
        });
      }
    }
  } catch (seedErr: any) {
    console.error('[DEMO_AUTO_SEED_ERROR]', seedErr.message);
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name, phone, role, departmentId, rollNumber, batch, employeeId, designation } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Email, password, and name are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address is already registered.' });
    }

    const passwordHash = await hashPassword(password);
    const userRole = ['STUDENT', 'FACULTY', 'COORDINATOR'].includes(role) ? role : 'STUDENT';

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        role: userRole,
        departmentId: departmentId || null,
        emailVerified: true,
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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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
  } catch (error: any) {
    console.error('[AUTH_REGISTER_ERROR]', { error: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: 'Registration failed due to a server error. Please try again.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Auto-seed demo user if this is a known demo account and not yet seeded
    const demoAccounts: Record<string, { role: string; name: string }> = {
      'student@demo.com': { role: 'STUDENT', name: 'Ethan Morgan' },
      'faculty@demo.com': { role: 'FACULTY', name: 'Prof. Sarah Jenkins' },
      'coordinator@demo.com': { role: 'COORDINATOR', name: 'Alex Vance' },
      'admin@demo.com': { role: 'ADMIN', name: 'Dr. Arthur Pendelton' },
    };

    if (demoAccounts[email]) {
      await ensureDemoUser(email, demoAccounts[email].role, demoAccounts[email].name);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        facultyProfile: true,
        department: true,
      },
    });

    if (!user) {
      console.log(`[AUTH_LOGIN] User not found for email: ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      console.log(`[AUTH_LOGIN] Password mismatch for email: ${email}`);
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
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log(`[AUTH_LOGIN_SUCCESS] Logged in user: ${user.email} (Role: ${user.role})`);

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
  } catch (error: any) {
    console.error('[AUTH_LOGIN_ERROR]', { error: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: 'Login failed due to a database connection or server error.' });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
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
  } catch (error: any) {
    console.error('[AUTH_ME_ERROR]', { error: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return res.json({ success: true, message: 'Logged out successfully.' });
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.json({ success: true, message: 'If an account exists, a reset link has been dispatched.' });
    }

    return res.json({
      success: true,
      message: 'Password reset link sent to your registered email address.',
      resetToken: 'demo-reset-token-' + Date.now(),
    });
  } catch (error: any) {
    console.error('[AUTH_FORGOT_PW_ERROR]', { error: error.message, stack: error.stack });
    return res.status(500).json({ success: false, message: 'Failed to process request.' });
  }
}
