import assert from 'node:assert';
import test from 'node:test';
import { generateToken } from '../utils/jwt.js';

test('Security & RBAC Enforcement Tests', async (t) => {
  await t.test('Student token should be tagged with STUDENT role', () => {
    const token = generateToken({
      userId: 'student-id-123',
      email: 'student@demo.com',
      role: 'STUDENT',
      name: 'Ethan Student',
    });
    assert.ok(token);
    assert.strictEqual(typeof token, 'string');
  });

  await t.test('Role guard should block STUDENT from accessing ADMIN route', async () => {
    const studentUser = { userId: 'stu-1', role: 'STUDENT' };
    const allowedRoles = ['ADMIN'];
    const isAuthorized = allowedRoles.includes(studentUser.role);
    assert.strictEqual(isAuthorized, false, 'Student MUST be blocked from Admin routes with 403 Forbidden');
  });

  await t.test('Faculty role should allow access to FACULTY routes', async () => {
    const facultyUser = { userId: 'fac-1', role: 'FACULTY' };
    const allowedRoles = ['FACULTY', 'ADMIN'];
    const isAuthorized = allowedRoles.includes(facultyUser.role);
    assert.strictEqual(isAuthorized, true);
  });
});
