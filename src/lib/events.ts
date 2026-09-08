import { prisma } from './db';
import { Registration } from './mockData';
import { PersistentEventStore, PersistentEvent } from './eventStore';
import { PersistentRegistrationStore } from './registrationStore';

function withTimeout<T>(promise: Promise<T>, ms: number = 400): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('DB query timeout')), ms)),
  ]);
}

/**
 * Fetch all events from persistent store (and PostgreSQL if available)
 */
export async function getEventsFromDb(): Promise<PersistentEvent[]> {
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
    // Silent fallback to file-backed JSON store
  }
  return PersistentEventStore.getAllEvents();
}

/**
 * Fetch a single event by ID
 */
export async function getEventByIdFromDb(id: string): Promise<PersistentEvent | null> {
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
    // Silent fallback to file-backed JSON store
  }
  return PersistentEventStore.getEventById(id);
}

/**
 * Create a new event in persistent JSON store and PostgreSQL
 */
export async function createEventInDb(eventData: Omit<PersistentEvent, 'id' | 'createdAt'>): Promise<PersistentEvent> {
  const createdInStore = PersistentEventStore.createEvent(eventData);

  try {
    await prisma.event.create({
      data: {
        id: createdInStore.id,
        title: createdInStore.title,
        category: createdInStore.category,
        branches: createdInStore.branches || [],
        description: createdInStore.description,
        date: createdInStore.date,
        startTime: createdInStore.startTime,
        endTime: createdInStore.endTime,
        venue: createdInStore.venue,
        organizer: createdInStore.organizer,
        registrationDeadline: createdInStore.registrationDeadline,
        capacity: createdInStore.capacity,
        posterUrl: createdInStore.posterUrl,
        eligibility: createdInStore.eligibility,
        rules: createdInStore.rules,
        requirements: createdInStore.requirements,
        contactPerson: createdInStore.contactPerson,
        contactEmail: createdInStore.contactEmail,
        status: createdInStore.status,
      },
    });
  } catch (error) {
    console.log('PostgreSQL bypass/fallback for create event:', (error as Error).message);
  }

  return createdInStore;
}

/**
 * Update an existing event in persistent JSON store and PostgreSQL
 */
export async function updateEventInDb(id: string, updateData: Partial<PersistentEvent>): Promise<PersistentEvent | null> {
  const updatedInStore = PersistentEventStore.updateEvent(id, updateData);

  try {
    await prisma.event.update({
      where: { id },
      data: {
        title: updateData.title,
        category: updateData.category,
        branches: updateData.branches,
        description: updateData.description,
        date: updateData.date,
        startTime: updateData.startTime,
        endTime: updateData.endTime,
        venue: updateData.venue,
        organizer: updateData.organizer,
        registrationDeadline: updateData.registrationDeadline,
        capacity: updateData.capacity,
        posterUrl: updateData.posterUrl,
        eligibility: updateData.eligibility,
        rules: updateData.rules,
        requirements: updateData.requirements,
        contactPerson: updateData.contactPerson,
        contactEmail: updateData.contactEmail,
        status: updateData.status,
      },
    });
  } catch (error) {
    console.log('PostgreSQL bypass/fallback for update event:', (error as Error).message);
  }

  return updatedInStore;
}

/**
 * Delete an event from persistent JSON store and PostgreSQL
 */
export async function deleteEventInDb(id: string): Promise<boolean> {
  const deletedInStore = PersistentEventStore.deleteEvent(id);

  try {
    await prisma.event.delete({
      where: { id },
    });
  } catch (error) {
    console.log('PostgreSQL bypass/fallback for delete event:', (error as Error).message);
  }

  return deletedInStore;
}

/**
 * Toggle publish / unpublish status
 */
export async function togglePublishInDb(id: string): Promise<PersistentEvent | null> {
  return PersistentEventStore.togglePublish(id);
}

/**
 * Create a registration record in PostgreSQL database with duplicate check & capacity check
 */
export async function createRegistrationInDb(
  regData: Omit<Registration, 'id' | 'registrationDate' | 'registrationId' | 'attendanceStatus'>
): Promise<Registration> {
  // Use PersistentRegistrationStore for duplicate & capacity validation and storage
  const result = PersistentRegistrationStore.createRegistration(regData);

  try {
    await prisma.registration.create({
      data: {
        id: result.registration.id,
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
        registrationId: result.registration.registrationId,
        attendanceStatus: 'not_marked',
      },
    });
  } catch (error) {
    console.log('PostgreSQL bypass/fallback for registration create:', (error as Error).message);
  }

  return result.registration;
}

/**
 * Delete a registration record by ID
 */
export async function deleteRegistrationInDb(registrationId: string): Promise<{ success: boolean; eventId?: string }> {
  PersistentRegistrationStore.deleteRegistration(registrationId);

  try {
    await prisma.registration.deleteMany({
      where: {
        OR: [{ id: registrationId }, { registrationId }],
      },
    });
  } catch (error) {
    // Database bypass/fallback handled cleanly
  }

  return { success: true };
}

/**
 * Fetch registrations for an event from persistent store and PostgreSQL database
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
    // Silent fallback to persistent store
  }

  return eventId
    ? PersistentRegistrationStore.getRegistrationsForEvent(eventId)
    : PersistentRegistrationStore.getAllRegistrations();
}
