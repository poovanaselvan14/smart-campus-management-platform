import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding Production Smart Campus Management Database...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Departments
  const cseDept = await prisma.department.upsert({
    where: { code: 'CSE' },
    update: {},
    create: { name: 'Computer Science & Engineering', code: 'CSE', description: 'AI, Software Systems & Data Science' },
  });

  const eceDept = await prisma.department.upsert({
    where: { code: 'ECE' },
    update: {},
    create: { name: 'Electronics & Communication', code: 'ECE', description: 'Embedded Systems & VLSI' },
  });

  await prisma.department.upsert({
    where: { code: 'MECH' },
    update: {},
    create: { name: 'Mechanical Engineering', code: 'MECH', description: 'Robotics & Automation' },
  });

  // 2. Demo Core Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: { passwordHash },
    create: {
      email: 'admin@demo.com',
      passwordHash,
      name: 'Dr. Arthur Pendelton',
      role: 'ADMIN',
      phone: '+1 555-0100',
      emailVerified: true,
      departmentId: cseDept.id,
    },
  });

  const facultyUser = await prisma.user.upsert({
    where: { email: 'faculty@demo.com' },
    update: { passwordHash },
    create: {
      email: 'faculty@demo.com',
      passwordHash,
      name: 'Prof. Sarah Jenkins',
      role: 'FACULTY',
      phone: '+1 555-0101',
      emailVerified: true,
      departmentId: cseDept.id,
      facultyProfile: {
        create: {
          employeeId: 'FAC-2024-08',
          designation: 'Associate Professor',
          officeHours: 'Mon/Wed 2:00 PM - 4:00 PM',
        },
      },
    },
  });

  const coordinatorUser = await prisma.user.upsert({
    where: { email: 'coordinator@demo.com' },
    update: { passwordHash },
    create: {
      email: 'coordinator@demo.com',
      passwordHash,
      name: 'Alex Vance',
      role: 'COORDINATOR',
      phone: '+1 555-0102',
      emailVerified: true,
      departmentId: eceDept.id,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@demo.com' },
    update: { passwordHash },
    create: {
      email: 'student@demo.com',
      passwordHash,
      name: 'Ethan Morgan',
      role: 'STUDENT',
      phone: '+1 555-0103',
      emailVerified: true,
      departmentId: cseDept.id,
      studentProfile: {
        create: {
          rollNumber: '2024-CSE-042',
          batch: '2024-2028',
          semester: 4,
          gpa: 3.82,
          bio: 'AI & Data Science Student Lead',
          resumeUrl: 'https://example.com/resumes/ethan_morgan.pdf',
        },
      },
    },
  });

  // Additional Students
  const additionalStudents = [
    { name: 'Arun Kumar', email: 'arun@campus.edu', roll: '24AD001', gpa: 3.9 },
    { name: 'Priya S', email: 'priya@campus.edu', roll: '24AD002', gpa: 3.7 },
    { name: 'Rahul M', email: 'rahul@campus.edu', roll: '24AD003', gpa: 2.9 },
    { name: 'Karthik R', email: 'karthik@campus.edu', roll: '24AD004', gpa: 3.6 },
    { name: 'Ananya Sharma', email: 'ananya@campus.edu', roll: '24AD005', gpa: 3.95 },
  ];

  const studentEntities = [studentUser];
  for (const s of additionalStudents) {
    const u = await prisma.user.upsert({
      where: { email: s.email },
      update: { passwordHash },
      create: {
        email: s.email,
        passwordHash,
        name: s.name,
        role: 'STUDENT',
        phone: '+1 555-0199',
        emailVerified: true,
        departmentId: cseDept.id,
        studentProfile: {
          create: {
            rollNumber: s.roll,
            batch: '2024-2028',
            semester: 4,
            gpa: s.gpa,
          },
        },
      },
    });
    studentEntities.push(u);
  }

  // 3. Courses
  const cs101 = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      name: 'Data Structures & Algorithms',
      code: 'CS101',
      credits: 4,
      departmentId: cseDept.id,
      facultyId: facultyUser.id,
    },
  });

  await prisma.course.upsert({
    where: { code: 'CS202' },
    update: {},
    create: {
      name: 'Full-Stack Web Architectures',
      code: 'CS202',
      credits: 3,
      departmentId: cseDept.id,
      facultyId: facultyUser.id,
    },
  });

  // 4. Attendance Session & Records
  const existingSession = await prisma.attendanceSession.findFirst({
    where: { qrCode: 'ATT-CS101-20260812' },
  });

  const attendanceSession = existingSession || await prisma.attendanceSession.create({
    data: {
      courseId: cs101.id,
      facultyId: facultyUser.id,
      title: 'Binary Trees & Graphs Lecture',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:30 AM',
      endTime: '11:00 AM',
      qrCode: 'ATT-CS101-20260812',
    },
  });

  for (const s of studentEntities) {
    const existingRec = await prisma.attendanceRecord.findFirst({
      where: { sessionId: attendanceSession.id, studentId: s.id },
    });
    if (!existingRec) {
      await prisma.attendanceRecord.create({
        data: {
          sessionId: attendanceSession.id,
          studentId: s.id,
          status: s.email === 'rahul@campus.edu' ? 'ABSENT' : 'PRESENT',
        },
      });
    }
  }

  // 5. Assignments & Submissions
  const existingAssignment = await prisma.assignment.findFirst({
    where: { title: 'Graph Traversal & Dijkstra Algorithm' },
  });

  const assignment1 = existingAssignment || await prisma.assignment.create({
    data: {
      courseId: cs101.id,
      facultyId: facultyUser.id,
      title: 'Graph Traversal & Dijkstra Algorithm',
      description: 'Implement BFS, DFS and Dijkstra algorithm in TypeScript or Python. Provide unit tests.',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      maxMarks: 100,
      attachmentUrl: 'https://example.com/docs/assignment1_specs.pdf',
    },
  });

  await prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId: assignment1.id,
        studentId: studentUser.id,
      },
    },
    update: {
      githubUrl: 'https://github.com/ethanmorgan/graph-dijkstra',
      solutionUrl: 'https://example.com/submissions/ethan_graph_solution.zip',
      status: 'GRADED',
      marks: 95,
    },
    create: {
      assignmentId: assignment1.id,
      studentId: studentUser.id,
      githubUrl: 'https://github.com/ethanmorgan/graph-dijkstra',
      solutionUrl: 'https://example.com/submissions/ethan_graph_solution.zip',
      submittedAt: new Date(),
      isLate: false,
      status: 'GRADED',
      marks: 95,
      feedback: 'Clean code architecture and unit tests!',
    },
  });

  // 6. Events & Registrations
  const existingEvent = await prisma.event.findFirst({
    where: { title: 'DevFusion 2026 AI Hackathon' },
  });

  const hackathonEvent = existingEvent || await prisma.event.create({
    data: {
      title: 'DevFusion 2026 AI Hackathon',
      bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
      description: 'Join the premier 48-hour campus AI & SaaS builder hackathon with $10,000 in grand prize awards!',
      venue: 'Innovation Auditorium & Tech Lab 3',
      eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      capacity: 150,
      category: 'Hackathon',
      coordinatorId: coordinatorUser.id,
    },
  });

  await prisma.eventRegistration.upsert({
    where: {
      eventId_studentId: {
        eventId: hackathonEvent.id,
        studentId: studentUser.id,
      },
    },
    update: { status: 'CONFIRMED' },
    create: {
      eventId: hackathonEvent.id,
      studentId: studentUser.id,
      qrPassCode: 'TICKET-HACK-STU042',
      status: 'CONFIRMED',
    },
  });

  // 7. Placements & Applications
  const existingPlacement = await prisma.placement.findFirst({
    where: { company: 'Google Cloud Solutions' },
  });

  const googlePlacement = existingPlacement || await prisma.placement.create({
    data: {
      company: 'Google Cloud Solutions',
      title: 'Associate Software Engineer (L3)',
      description: 'Role focusing on distributed backend infrastructure, Kubernetes tools, and cloud developer platforms.',
      eligibilityGpa: 3.5,
      skills: 'TypeScript, Go, Node.js, Distributed Systems',
      ctc: '$145,000 / annum',
      location: 'Mountain View, CA / Remote',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdById: adminUser.id,
    },
  });

  await prisma.placementApplication.upsert({
    where: {
      placementId_studentId: {
        placementId: googlePlacement.id,
        studentId: studentUser.id,
      },
    },
    update: { status: 'SHORTLISTED' },
    create: {
      placementId: googlePlacement.id,
      studentId: studentUser.id,
      resumeUrl: 'https://example.com/resumes/ethan_morgan.pdf',
      status: 'SHORTLISTED',
    },
  });

  // 8. Clubs
  const existingClub = await prisma.club.findFirst({ where: { name: 'Antigravity AI & Robotics Club' } });
  if (!existingClub) {
    await prisma.club.create({
      data: {
        name: 'Antigravity AI & Robotics Club',
        description: 'Campus society for machine learning, autonomous robotics, and agentic LLMs.',
        category: 'Technology',
        coordinatorId: coordinatorUser.id,
        members: {
          create: [{ studentId: studentUser.id, role: 'LEAD' }],
        },
      },
    });
  }

  // 9. Announcements & Notifications
  const existingAnn = await prisma.announcement.findFirst({ where: { title: 'Fall Mid-Term Exam Schedule & Policy Released' } });
  if (!existingAnn) {
    await prisma.announcement.create({
      data: {
        title: 'Fall Mid-Term Exam Schedule & Policy Released',
        content: 'The examination schedule for all undergraduate courses is now live on the portal. Please verify hall passes.',
        audienceRole: 'ALL',
        priority: 'HIGH',
        createdById: adminUser.id,
      },
    });
  }

  console.log('🎉 Production database seed complete!');
}

seed()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
