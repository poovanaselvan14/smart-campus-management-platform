import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { createNotification } from '../services/notification.service.js';
import { createAuditLog } from '../services/audit.service.js';

export async function createEvent(req: AuthRequest, res: Response) {
  const { title, bannerUrl, description, venue, eventDate, registrationDeadline, capacity, category } = req.body;
  const coordinatorId = req.user?.userId;

  if (!coordinatorId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const event = await prisma.event.create({
    data: {
      title,
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
      description,
      venue,
      eventDate: new Date(eventDate),
      registrationDeadline: new Date(registrationDeadline),
      capacity: Number(capacity) || 100,
      category: category || 'General',
      coordinatorId,
    },
  });

  await createAuditLog(coordinatorId, 'EVENT_CREATED', 'Event', event.id, { title });

  return res.status(201).json({ success: true, message: 'Event published successfully.', data: event });
}

export async function getEvents(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;

  const events = await prisma.event.findMany({
    include: {
      coordinator: { select: { name: true, email: true } },
      _count: { select: { registrations: true } },
      registrations: userId
        ? { where: { studentId: userId } }
        : false,
    },
    orderBy: { eventDate: 'asc' },
  });

  const formattedEvents = events.map(e => ({
    ...e,
    registeredCount: e._count.registrations,
    isRegistered: Array.isArray(e.registrations) && e.registrations.length > 0,
    registration: Array.isArray(e.registrations) && e.registrations.length > 0 ? e.registrations[0] : null,
  }));

  return res.json({ success: true, data: formattedEvents });
}

export async function registerForEvent(req: AuthRequest, res: Response) {
  const { eventId } = req.params;
  const studentId = req.user?.userId;

  if (!studentId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  // Use Prisma transaction to safely check deadline & capacity
  const registration = await prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) throw new Error('Event not found.');

    if (new Date() > new Date(event.registrationDeadline)) {
      throw new Error('Event registration deadline has passed.');
    }

    if (event._count.registrations >= event.capacity) {
      throw new Error('Event Full: Maximum capacity reached.');
    }

    const existingReg = await tx.eventRegistration.findUnique({
      where: { eventId_studentId: { eventId, studentId } },
    });

    if (existingReg) {
      throw new Error('You are already registered for this event.');
    }

    const qrPassCode = `TICKET-${eventId.slice(0, 4).toUpperCase()}-${studentId.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newReg = await tx.eventRegistration.create({
      data: {
        eventId,
        studentId,
        qrPassCode,
        status: 'CONFIRMED',
      },
      include: { event: true },
    });

    return newReg;
  });

  await createNotification(
    studentId,
    'Event Registration Confirmed!',
    `Registered for "${registration.event.title}". View your QR ticket in your dashboard.`,
    'EVENT'
  );

  await createAuditLog(studentId, 'EVENT_REGISTERED', 'EventRegistration', registration.id, { eventId });

  return res.status(201).json({
    success: true,
    message: 'Registered for event! QR entry pass generated.',
    data: registration,
  });
}

export async function cancelRegistration(req: AuthRequest, res: Response) {
  const { eventId } = req.params;
  const studentId = req.user?.userId;

  if (!studentId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  await prisma.eventRegistration.delete({
    where: { eventId_studentId: { eventId: eventId as string, studentId: studentId as string } },
  });

  return res.json({ success: true, message: 'Event registration cancelled.' });
}

export async function verifyQRPass(req: AuthRequest, res: Response) {
  const { qrPassCode } = req.body;

  const registration = await prisma.eventRegistration.findUnique({
    where: { qrPassCode },
    include: {
      event: true,
      student: { select: { id: true, name: true, email: true, studentProfile: true } },
    },
  });

  if (!registration) {
    return res.status(404).json({ success: false, message: 'Invalid or fake QR Pass Ticket.' });
  }

  if (registration.status === 'CHECKED_IN') {
    return res.status(400).json({
      success: false,
      message: 'Ticket already scanned/checked-in previously.',
      data: registration,
    });
  }

  const updated = await prisma.eventRegistration.update({
    where: { id: registration.id },
    data: { status: 'CHECKED_IN' },
  });

  await createAuditLog(req.user?.userId || null, 'QR_TICKET_CHECKED_IN', 'EventRegistration', registration.id);

  return res.json({
    success: true,
    message: `VALID TICKET! Welcome ${registration.student.name} to ${registration.event.title}.`,
    data: { ...registration, status: 'CHECKED_IN' },
  });
}
