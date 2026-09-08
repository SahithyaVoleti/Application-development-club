import fs from 'fs';
import path from 'path';
import { Registration, MOCK_REGISTRATIONS, REGISTERED_COUNTS } from './mockData';
import { PersistentEventStore } from './eventStore';

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'registrations-persistent-db.json');

declare global {
  var __REGISTRATION_DB_CACHE__: Registration[] | undefined;
}

function loadRegistrationsFromFile(): Registration[] {
  if (globalThis.__REGISTRATION_DB_CACHE__ && globalThis.__REGISTRATION_DB_CACHE__.length > 0) {
    return globalThis.__REGISTRATION_DB_CACHE__;
  }

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf8');
      const parsed: Registration[] = JSON.parse(raw);
      globalThis.__REGISTRATION_DB_CACHE__ = parsed;
      
      // Keep MOCK_REGISTRATIONS in sync
      MOCK_REGISTRATIONS.length = 0;
      parsed.forEach((r) => MOCK_REGISTRATIONS.push(r));

      // Re-calculate registered counts dynamically
      recalculateCounts(parsed);

      return parsed;
    }
  } catch (error) {
    console.error('Error reading registrations-persistent-db.json:', error);
  }

  globalThis.__REGISTRATION_DB_CACHE__ = [];
  return [];
}

function recalculateCounts(regs: Registration[]): void {
  // Reset counts
  Object.keys(REGISTERED_COUNTS).forEach((key) => {
    REGISTERED_COUNTS[key] = 0;
  });

  regs.forEach((r) => {
    if (r.eventId) {
      REGISTERED_COUNTS[r.eventId] = (REGISTERED_COUNTS[r.eventId] || 0) + 1;
    }
  });
}

function saveRegistrationsToFile(regs: Registration[]): void {
  globalThis.__REGISTRATION_DB_CACHE__ = [...regs];

  // Keep in-memory MOCK_REGISTRATIONS array in sync
  MOCK_REGISTRATIONS.length = 0;
  regs.forEach((r) => MOCK_REGISTRATIONS.push(r));

  recalculateCounts(regs);

  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(regs, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving registrations-persistent-db.json:', error);
  }
}

export class PersistentRegistrationStore {
  /**
   * Get all registrations
   */
  static getAllRegistrations(): Registration[] {
    return loadRegistrationsFromFile();
  }

  /**
   * Get registrations for a specific event
   */
  static getRegistrationsForEvent(eventId: string): Registration[] {
    const all = loadRegistrationsFromFile();
    return all.filter((r) => r.eventId === eventId);
  }

  /**
   * Get dynamically computed registration count for an event
   */
  static getRegisteredCount(eventId: string): number {
    const eventRegs = this.getRegistrationsForEvent(eventId);
    return eventRegs.length;
  }

  /**
   * Get event seat stats: { capacity, registeredCount, availableSeats, isFull }
   */
  static getEventSeatStats(eventId: string) {
    const event = PersistentEventStore.getEventById(eventId);
    const capacity = event?.capacity || 150;
    const registeredCount = this.getRegisteredCount(eventId);
    const availableSeats = Math.max(0, capacity - registeredCount);
    const isFull = registeredCount >= capacity;

    return {
      eventId,
      capacity,
      registeredCount,
      availableSeats,
      isFull,
    };
  }

  /**
   * Check if a student has already registered for an event
   */
  static isStudentRegistered(eventId: string, studentId?: string, email?: string): boolean {
    if (!studentId && !email) return false;
    const regs = this.getRegistrationsForEvent(eventId);

    return regs.some((r) => {
      const matchStudentId = Boolean(studentId && r.studentId && r.studentId.trim().toLowerCase() === studentId.trim().toLowerCase());
      const matchEmail = Boolean(email && r.email && r.email.trim().toLowerCase() === email.trim().toLowerCase());
      return matchStudentId || matchEmail;
    });
  }

  /**
   * Create a new student registration record
   */
  static createRegistration(data: {
    eventId: string;
    studentId: string;
    studentName: string;
    email: string;
    mobile?: string;
    department?: string;
    year?: string;
    section?: string;
    gender?: string;
    skills?: string;
  }): { registration: Registration; seatStats: ReturnType<typeof PersistentRegistrationStore.getEventSeatStats> } {
    const { eventId, studentId, email } = data;

    // 1. Prevent duplicate registration
    if (this.isStudentRegistered(eventId, studentId, email)) {
      const error: any = new Error('You are already registered for this event.');
      error.code = 'DUPLICATE_REGISTRATION';
      throw error;
    }

    // 2. Check capacity
    const seatStats = this.getEventSeatStats(eventId);
    if (seatStats.isFull) {
      const error: any = new Error('Event is full. Maximum participant capacity reached.');
      error.code = 'EVENT_FULL';
      throw error;
    }

    const regs = loadRegistrationsFromFile();
    const registrationId = `CSE26-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReg: Registration = {
      id: `reg-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      eventId,
      studentId: data.studentId,
      studentName: data.studentName,
      email: data.email,
      mobile: data.mobile || '',
      department: data.department || 'Computer Science & Engineering',
      year: data.year || '3rd Year',
      section: data.section || 'A',
      gender: data.gender || 'Other',
      skills: data.skills || '',
      registrationDate: new Date().toISOString(),
      registrationId,
      attendanceStatus: 'not_marked',
    };

    regs.unshift(newReg);
    saveRegistrationsToFile(regs);

    const updatedStats = this.getEventSeatStats(eventId);

    return {
      registration: newReg,
      seatStats: updatedStats,
    };
  }

  /**
   * Delete a registration by ID
   */
  static deleteRegistration(registrationId: string): boolean {
    const regs = loadRegistrationsFromFile();
    const filtered = regs.filter((r) => r.id !== registrationId && r.registrationId !== registrationId);
    if (filtered.length === regs.length) return false;

    saveRegistrationsToFile(filtered);
    return true;
  }
}
