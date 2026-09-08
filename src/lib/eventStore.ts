import fs from 'fs';
import path from 'path';
import { MOCK_EVENTS, Event, EventStatus } from './mockData';

export interface PersistentEvent extends Event {
  isPublished?: boolean;
}

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'events-persistent-db.json');

declare global {
  var __EVENT_DB_CACHE__: PersistentEvent[] | undefined;
}

/**
 * Dynamically computes status based on event date and time relative to current time.
 * When event date and end time pass (now > endDateTime), status becomes COMPLETED.
 */
export function calculateDynamicStatus(event: PersistentEvent): EventStatus {
  if (event.isPublished === false) {
    return 'UNPUBLISHED' as any;
  }

  try {
    const now = new Date();
    const eventDateStr = event.date; // YYYY-MM-DD
    const startTimeStr = event.startTime || '00:00';
    const endTimeStr = event.endTime || '23:59';

    const startDateTime = new Date(`${eventDateStr}T${startTimeStr}:00`);
    const endDateTime = new Date(`${eventDateStr}T${endTimeStr}:00`);

    if (!isNaN(startDateTime.getTime()) && !isNaN(endDateTime.getTime())) {
      // Once event date and end time pass, immediately transition to COMPLETED (Finished Events)
      if (now > endDateTime) {
        return 'COMPLETED';
      }
      if (now >= startDateTime && now <= endDateTime) {
        return 'ONGOING';
      }
    } else {
      // Fallback date-only check
      const d = new Date(eventDateStr);
      d.setHours(23, 59, 59, 999);
      if (!isNaN(d.getTime()) && now > d) {
        return 'COMPLETED';
      }
    }

    if (event.registrationDeadline) {
      const deadline = new Date(event.registrationDeadline);
      if (!isNaN(deadline.getTime()) && now > deadline && now < startDateTime) {
        return 'REGISTRATION_CLOSED';
      }
    }

    return event.status || 'UPCOMING';
  } catch (e) {
    return event.status || 'UPCOMING';
  }
}

function loadEventsFromFile(): PersistentEvent[] {
  if (globalThis.__EVENT_DB_CACHE__ && globalThis.__EVENT_DB_CACHE__.length > 0) {
    return globalThis.__EVENT_DB_CACHE__;
  }

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
      const parsed: PersistentEvent[] = JSON.parse(raw);
      globalThis.__EVENT_DB_CACHE__ = parsed;
      return parsed;
    }
  } catch (error) {
    console.error('Error reading events-persistent-db.json:', error);
  }

  globalThis.__EVENT_DB_CACHE__ = [...MOCK_EVENTS];
  return globalThis.__EVENT_DB_CACHE__;
}

function saveEventsToFile(events: PersistentEvent[]): void {
  globalThis.__EVENT_DB_CACHE__ = [...events];
  
  // Keep in-memory MOCK_EVENTS reference synced as well
  MOCK_EVENTS.length = 0;
  events.forEach((e) => MOCK_EVENTS.push(e));

  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(events, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving events-persistent-db.json:', error);
  }
}

export class PersistentEventStore {
  /**
   * Get all events with dynamic status computation
   */
  static getAllEvents(): PersistentEvent[] {
    const events = loadEventsFromFile();
    return events.map((e) => {
      const computedStatus = calculateDynamicStatus(e);
      return {
        ...e,
        status: computedStatus !== ('UNPUBLISHED' as any) ? computedStatus : e.status,
        isPublished: e.isPublished !== false,
      };
    });
  }

  /**
   * Get upcoming events (published & date/time in future, excluding completed)
   */
  static getUpcomingEvents(): PersistentEvent[] {
    const all = this.getAllEvents();
    const now = new Date();
    
    return all
      .filter((e) => {
        if (e.isPublished === false) return false;
        if (e.status === 'COMPLETED') return false;

        const endDateTime = new Date(`${e.date}T${e.endTime || '23:59'}:00`);
        if (!isNaN(endDateTime.getTime())) {
          return now <= endDateTime;
        }
        const d = new Date(e.date);
        d.setHours(23, 59, 59, 999);
        return now <= d;
      })
      .sort((a, b) => new Date(`${a.date}T${a.startTime || '00:00'}`).getTime() - new Date(`${b.date}T${b.startTime || '00:00'}`).getTime());
  }

  /**
   * Get past/finished events (completed or date/time in past)
   */
  static getPastEvents(): PersistentEvent[] {
    const all = this.getAllEvents();
    const now = new Date();

    return all
      .filter((e) => {
        if (e.isPublished === false) return false;
        if (e.status === 'COMPLETED') return true;

        const endDateTime = new Date(`${e.date}T${e.endTime || '23:59'}:00`);
        if (!isNaN(endDateTime.getTime())) {
          return now > endDateTime;
        }
        const d = new Date(e.date);
        d.setHours(23, 59, 59, 999);
        return now > d;
      })
      .sort((a, b) => new Date(`${b.date}T${b.startTime || '00:00'}`).getTime() - new Date(`${a.date}T${a.startTime || '00:00'}`).getTime());
  }

  /**
   * Get single event by ID
   */
  static getEventById(id: string): PersistentEvent | null {
    const events = this.getAllEvents();
    return events.find((e) => e.id === id) || null;
  }

  /**
   * Create a new event
   */
  static createEvent(data: Omit<PersistentEvent, 'id' | 'createdAt'> & { id?: string }): PersistentEvent {
    const events = loadEventsFromFile();
    const newId = data.id || `event-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEvent: PersistentEvent = {
      title: data.title || 'Untitled Event',
      category: data.category || 'AI/ML Workshop',
      branches: data.branches || ['CSE', 'IT', 'AI/ML'],
      description: data.description || 'Event description and schedule guidelines.',
      date: data.date || new Date().toISOString().slice(0, 10),
      startTime: data.startTime || '09:00',
      endTime: data.endTime || '18:00',
      venue: data.venue || 'CSE Seminar Hall, Block A',
      organizer: data.organizer || 'Dept. of Computer Science & Engineering',
      registrationDeadline: data.registrationDeadline || `${data.date || new Date().toISOString().slice(0, 10)}T23:59`,
      capacity: data.capacity && data.capacity > 0 ? Number(data.capacity) : 150,
      posterUrl: data.posterUrl || '/images/events/remote-event-10.png',
      eligibility: data.eligibility || 'Open to all CSE, IT and Engineering Students',
      rules: data.rules || 'Standard workshop guidelines apply.',
      requirements: data.requirements || 'College ID Card, Laptop',
      contactPerson: data.contactPerson || 'Event Coordinator',
      contactEmail: data.contactEmail || 'admin@vignan.ac.in',
      status: data.status || 'UPCOMING',
      isPublished: data.isPublished !== false,
      createdAt: new Date().toISOString(),
      id: newId,
    };

    events.unshift(newEvent);
    saveEventsToFile(events);
    return newEvent;
  }

  /**
   * Update an existing event
   */
  static updateEvent(id: string, updateData: Partial<PersistentEvent>): PersistentEvent | null {
    const events = loadEventsFromFile();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const updated: PersistentEvent = {
      ...events[index],
      ...updateData,
      id, // Preserve ID
    };

    events[index] = updated;
    saveEventsToFile(events);
    return updated;
  }

  /**
   * Delete an event
   */
  static deleteEvent(id: string): boolean {
    const events = loadEventsFromFile();
    const filtered = events.filter((e) => e.id !== id);
    if (filtered.length === events.length) return false;

    saveEventsToFile(filtered);
    return true;
  }

  /**
   * Toggle Publish / Unpublish status
   */
  static togglePublish(id: string): PersistentEvent | null {
    const events = loadEventsFromFile();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const currentPublished = events[index].isPublished !== false;
    events[index].isPublished = !currentPublished;

    saveEventsToFile(events);
    return events[index];
  }
}
