import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Smart Campus Management Platform API Specification',
    version: '1.0.0',
    description: 'Production-ready REST API documentation for centralizing Student, Faculty, Coordinator, and Admin activities.',
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Local Development Server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/api/auth/login': {
      post: {
        summary: 'Authenticate User & Obtain JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'student@demo.com' },
                  password: { type: 'string', example: 'Password123!' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/register': {
      post: {
        summary: 'Register New Campus Account',
        responses: { 201: { description: 'User registered' } },
      },
    },
    '/api/attendance/my': {
      get: {
        summary: 'Get Student Attendance Breakdown & Target Calculator Advice',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Attendance data' } },
      },
    },
    '/api/assignments': {
      get: {
        summary: 'Get Campus Assignments',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Assignment list' } },
      },
    },
    '/api/events': {
      get: {
        summary: 'Get Campus Events Catalog',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Events list' } },
      },
    },
    '/api/placements': {
      get: {
        summary: 'Get Placement Opportunities & Check GPA Eligibility',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Placement list' } },
      },
    },
    '/api/admin/users': {
      get: {
        summary: 'Admin User Management Directory',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Users list' }, 403: { description: 'Forbidden' } },
      },
    },
    '/api/analytics': {
      get: {
        summary: 'Real-time System Analytics & Chart Metrics',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Analytics payload' } },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
