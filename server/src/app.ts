import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import departmentsRoutes from './routes/departments.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import assignmentsRoutes from './routes/assignments.routes.js';
import eventsRoutes from './routes/events.routes.js';
import placementsRoutes from './routes/placements.routes.js';
import clubsRoutes from './routes/clubs.routes.js';
import announcementsRoutes from './routes/announcements.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import searchRoutes from './routes/search.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import assistantRoutes from './routes/assistant.routes.js';
import logsRoutes from './routes/logs.routes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { setupSwagger } from './config/swagger.js';

dotenv.config();

export const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  'https://smart-campus-management-platform-five.vercel.app',
  'https://smart-campus-management-platform.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app')) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Swagger Documentation
setupSwagger(app);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/placements', placementsRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/admin/logs', logsRoutes);

// Healthcheck Endpoints
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Smart Campus API is running', status: 'HEALTHY', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Smart Campus API is running', status: 'HEALTHY', timestamp: new Date().toISOString() });
});

// Error Handler
app.use(errorHandler);
