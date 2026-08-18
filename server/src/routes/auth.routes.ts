import { Router } from 'express';
import { register, login, me, logout, forgotPassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { z } from 'zod';
import { validateBody } from '../middleware/validate.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(['STUDENT', 'FACULTY', 'COORDINATOR']).optional(),
  departmentId: z.string().optional(),
  rollNumber: z.string().optional(),
  batch: z.string().optional(),
  employeeId: z.string().optional(),
  designation: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticate, me);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', forgotPassword);

export default router;
