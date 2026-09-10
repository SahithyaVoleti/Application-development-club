import fs from 'fs';
import path from 'path';

export interface NotificationLogRecord {
  id: string;
  recipient: string;
  type:
    | 'ADMIN_REGISTRATION'
    | 'ADMIN_APPROVAL'
    | 'ADMIN_REJECTED'
    | 'CLUB_ASSIGNMENT'
    | 'CLUB_REMOVAL'
    | 'EVENT_CREATION'
    | 'EVENT_UPDATE'
    | 'EVENT_DELETION'
    | 'STUDENT_REGISTRATION'
    | 'SECURITY_OTP';
  subject: string;
  sentDate: string;
  status: 'SUCCESS' | 'FAILED';
  relatedId?: string;
  metadata?: Record<string, any>;
}

function getDbFilePath(filename: string): string {
  try {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      return path.join('/tmp', filename);
    }
    const localDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(localDir)) {
      try {
        fs.mkdirSync(localDir, { recursive: true });
      } catch {
        return path.join('/tmp', filename);
      }
    }
    return path.join(localDir, filename);
  } catch {
    return path.join('/tmp', filename);
  }
}

const DB_FILE_PATH = getDbFilePath('notifications-persistent-db.json');

const INITIAL_SEED_NOTIFICATIONS: NotificationLogRecord[] = [
  {
    id: 'notif-001',
    recipient: 'admin@cse.vignan.ac.in',
    type: 'ADMIN_APPROVAL',
    subject: '[Admin Approved] Your Admin Account Has Been Approved!',
    sentDate: '2026-01-05T10:00:00.000Z',
    status: 'SUCCESS',
    relatedId: 'user-admin-001',
  },
  {
    id: 'notif-002',
    recipient: 'varunkumar@vignan.ac.in',
    type: 'ADMIN_REGISTRATION',
    subject: '[Admin Registration] Request Received - Pending Approval',
    sentDate: '2026-01-10T14:30:00.000Z',
    status: 'SUCCESS',
    relatedId: 'user-admin-varun-001',
  },
];

const globalForNotifs = globalThis as unknown as {
  globalNotifications: NotificationLogRecord[] | undefined;
};

function loadNotificationsFromStorage(): NotificationLogRecord[] {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading notifications DB file:', err);
  }
  saveNotificationsToStorage(INITIAL_SEED_NOTIFICATIONS);
  return INITIAL_SEED_NOTIFICATIONS;
}

function saveNotificationsToStorage(logs: NotificationLogRecord[]) {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving notifications DB file:', err);
  }
}

if (!globalForNotifs.globalNotifications) {
  globalForNotifs.globalNotifications = loadNotificationsFromStorage();
}

let globalNotifications = globalForNotifs.globalNotifications!;

function syncStore() {
  globalForNotifs.globalNotifications = globalNotifications;
  saveNotificationsToStorage(globalNotifications);
}

export async function addNotificationLog(
  log: Omit<NotificationLogRecord, 'id' | 'sentDate'>
): Promise<NotificationLogRecord> {
  const newLog: NotificationLogRecord = {
    ...log,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sentDate: new Date().toISOString(),
  };

  globalNotifications.unshift(newLog);
  syncStore();
  return newLog;
}

export async function getNotificationLogs(
  recipient?: string
): Promise<NotificationLogRecord[]> {
  if (recipient) {
    const clean = recipient.trim().toLowerCase();
    return globalNotifications
      .filter(n => n.recipient.toLowerCase() === clean)
      .sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime());
  }

  return [...globalNotifications].sort(
    (a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()
  );
}
