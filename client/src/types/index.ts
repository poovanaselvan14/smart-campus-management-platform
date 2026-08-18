export type Role = 'STUDENT' | 'FACULTY' | 'COORDINATOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  department?: Department;
  profile?: any;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  _count?: { users: number; courses: number };
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  departmentId: string;
  department?: Department;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  markedAt: string;
  session: {
    title: string;
    date: string;
    course: Course;
    faculty: { name: string };
  };
}

export interface AttendanceSummary {
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  overallPercentage: number;
  targetAdvice: string;
  courseBreakdown: Array<{
    courseName: string;
    code: string;
    total: number;
    present: number;
    percentage: number;
  }>;
  history: AttendanceRecord[];
}

export interface Assignment {
  id: string;
  courseId: string;
  facultyId: string;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  attachmentUrl?: string;
  course?: Course;
  faculty?: { name: string; email: string };
  submissions?: AssignmentSubmission[];
  _count?: { submissions: number };
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  solutionUrl?: string;
  githubUrl?: string;
  submittedAt: string;
  isLate: boolean;
  status: 'SUBMITTED' | 'GRADED';
  marks?: number;
  feedback?: string;
  student?: { id: string; name: string; email: string };
}

export interface Event {
  id: string;
  title: string;
  bannerUrl?: string;
  description: string;
  venue: string;
  eventDate: string;
  registrationDeadline: string;
  capacity: number;
  category: string;
  registeredCount: number;
  isRegistered?: boolean;
  registration?: EventRegistration;
  coordinator?: { name: string; email: string };
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  qrPassCode: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
  registeredAt: string;
  event?: Event;
}

export interface Placement {
  id: string;
  company: string;
  title: string;
  description: string;
  eligibilityGpa: number;
  skills: string;
  ctc: string;
  location: string;
  deadline: string;
  applicantCount: number;
  hasApplied?: boolean;
  applicationStatus?: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED' | null;
  isEligible?: boolean;
  studentGpa?: number;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  logoUrl?: string;
  memberCount: number;
  isJoined?: boolean;
  coordinator?: { name: string; email: string };
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  audienceRole: 'ALL' | 'STUDENT' | 'FACULTY' | 'COORDINATOR';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  createdBy?: { name: string; role: string };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  metadata?: string;
  createdAt: string;
  user?: { name: string; email: string; role: string };
}
