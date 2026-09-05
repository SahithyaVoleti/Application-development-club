import { prisma } from './db';
import { MOCK_EVENTS, MOCK_REGISTRATIONS, REGISTERED_COUNTS, GALLERY_IMAGES, Event, Registration, GalleryImage } from './mockData';

function withTimeout<T>(promise: Promise<T>, ms: number = 400): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('DB query timeout')), ms)),
  ]);
}

/**
 * Fetch all events from PostgreSQL database (falls back to MOCK_EVENTS if DB is unavailable)
 */
export async function getEventsFromDb(): Promise<Event[]> {
  try {
    const events = await withTimeout(
      prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
      })
    );
    if (events && events.length > 0) {
      return events.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      }));
    }
  } catch (error) {
    // Silent fallback to mock data
  }
  return MOCK_EVENTS;
}

/**
 * Fetch a single event by ID
 */
export async function getEventByIdFromDb(id: string): Promise<Event | null> {
  try {
    const event = await withTimeout(
      prisma.event.findUnique({
        where: { id },
      })
    );
    if (event) {
      return {
        ...event,
        createdAt: event.createdAt.toISOString(),
      };
    }
  } catch (error) {
    // Silent fallback to mock data
  }
  return MOCK_EVENTS.find((e) => e.id === id) || null;
}

/**
 * Create a new event in PostgreSQL database
 */
export async function createEventInDb(eventData: Omit<Event, 'id' | 'createdAt'>): Promise<Event> {
  try {
    const created = await prisma.event.create({
      data: {
        title: eventData.title,
        category: eventData.category,
        branches: eventData.branches || [],
        description: eventData.description,
        date: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        venue: eventData.venue,
        organizer: eventData.organizer,
        registrationDeadline: eventData.registrationDeadline,
        capacity: eventData.capacity,
        posterUrl: eventData.posterUrl,
        eligibility: eventData.eligibility,
        rules: eventData.rules,
        requirements: eventData.requirements,
        contactPerson: eventData.contactPerson,
        contactEmail: eventData.contactEmail,
        status: eventData.status,
      },
    });
    return {
      ...created,
      createdAt: created.createdAt.toISOString(),
    };
  } catch (error) {
    console.error('Failed to create event in PostgreSQL:', error);
    throw error;
  }
}

/**
 * Create a registration record in PostgreSQL database with duplicate check
 */
export async function createRegistrationInDb(
  regData: Omit<Registration, 'id' | 'registrationDate' | 'registrationId' | 'attendanceStatus'>
): Promise<Registration> {
  const registrationId = `CSE26-${Math.floor(10000 + Math.random() * 90000)}`;

  // In-Memory & Fallback Duplicate Check
  const existingMock = MOCK_REGISTRATIONS.find(
    (r) => r.eventId === regData.eventId && (r.studentId === regData.studentId || r.email === regData.email)
  );
  if (existingMock) {
    const error: any = new Error('You are already registered for this event.');
    error.code = 'DUPLICATE_REGISTRATION';
    error.existingRegistrationId = existingMock.registrationId;
    throw error;
  }

  try {
    // Database duplicate check
    const existingDb = await withTimeout(
      prisma.registration.findFirst({
        where: {
          eventId: regData.eventId,
          OR: [{ studentId: regData.studentId }, { email: regData.email }],
        },
      })
    );

    if (existingDb) {
      const error: any = new Error('You are already registered for this event.');
      error.code = 'DUPLICATE_REGISTRATION';
      error.existingRegistrationId = existingDb.registrationId;
      throw error;
    }

    const created = await prisma.registration.create({
      data: {
        eventId: regData.eventId,
        studentId: regData.studentId,
        studentName: regData.studentName,
        email: regData.email,
        mobile: regData.mobile,
        department: regData.department,
        year: regData.year,
        section: regData.section,
        gender: regData.gender,
        skills: regData.skills,
        registrationId,
        attendanceStatus: 'not_marked',
      },
    });

    const formatted: Registration = {
      ...created,
      registrationDate: created.registrationDate.toISOString(),
    };

    // Keep mock data & counts in sync
    MOCK_REGISTRATIONS.unshift(formatted);
    REGISTERED_COUNTS[regData.eventId] = (REGISTERED_COUNTS[regData.eventId] || 0) + 1;

    return formatted;
  } catch (error: any) {
    if (error.code === 'P2002' || error.code === 'DUPLICATE_REGISTRATION') {
      const err: any = new Error('You are already registered for this event.');
      err.code = 'DUPLICATE_REGISTRATION';
      throw err;
    }
    // Fallback: Save to mock data array if DB is not active
    const fallbackReg: Registration = {
      id: `reg-${Date.now()}`,
      eventId: regData.eventId,
      studentId: regData.studentId,
      studentName: regData.studentName,
      email: regData.email,
      mobile: regData.mobile,
      department: regData.department,
      year: regData.year,
      section: regData.section,
      gender: regData.gender,
      skills: regData.skills || '',
      registrationDate: new Date().toISOString(),
      registrationId,
      attendanceStatus: 'not_marked',
    };
    MOCK_REGISTRATIONS.unshift(fallbackReg);
    REGISTERED_COUNTS[regData.eventId] = (REGISTERED_COUNTS[regData.eventId] || 0) + 1;
    return fallbackReg;
  }
}

/**
 * Delete a registration record by ID
 */
export async function deleteRegistrationInDb(registrationId: string): Promise<{ success: boolean; eventId?: string }> {
  let targetEventId: string | undefined;

  // Sync mock data
  const mockIdx = MOCK_REGISTRATIONS.findIndex((r) => r.id === registrationId || r.registrationId === registrationId);
  if (mockIdx !== -1) {
    targetEventId = MOCK_REGISTRATIONS[mockIdx].eventId;
    MOCK_REGISTRATIONS.splice(mockIdx, 1);
    if (targetEventId && REGISTERED_COUNTS[targetEventId] > 0) {
      REGISTERED_COUNTS[targetEventId] -= 1;
    }
  }

  try {
    const existing = await prisma.registration.findFirst({
      where: {
        OR: [{ id: registrationId }, { registrationId }],
      },
    });

    if (existing) {
      targetEventId = existing.eventId;
      await prisma.registration.delete({
        where: { id: existing.id },
      });
      if (REGISTERED_COUNTS[targetEventId] > 0) {
        REGISTERED_COUNTS[targetEventId] -= 1;
      }
    }
  } catch (error) {
    // Database bypass/fallback handled cleanly
  }

  return { success: true, eventId: targetEventId };
}

/**
 * Fetch registrations for an event from PostgreSQL database
 */
export async function getRegistrationsFromDb(eventId?: string): Promise<Registration[]> {
  try {
    const regs = await withTimeout(
      prisma.registration.findMany({
        where: eventId ? { eventId } : undefined,
        orderBy: { registrationDate: 'desc' },
      })
    );
    if (regs && regs.length > 0) {
      return regs.map((r) => ({
        ...r,
        registrationDate: r.registrationDate.toISOString(),
      }));
    }
  } catch (error) {
    // Silent fallback to mock data
  }
  return eventId ? MOCK_REGISTRATIONS.filter((r) => r.eventId === eventId) : MOCK_REGISTRATIONS;
}

