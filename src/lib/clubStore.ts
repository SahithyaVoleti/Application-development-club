import fs from 'fs';
import path from 'path';

export interface ClubRecord {
  id: string;
  name: string;
  code: string;
  description: string;
  department: string;
  createdAt: string;
}

export interface AdminClubAssignmentRecord {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  clubId: string;
  clubName: string;
  role: 'ADMIN';
  status: 'ACTIVE' | 'REMOVED';
  assignedBy: string;
  assignedAt: string;
  removedAt?: string | null;
  createdAt: string;
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

const DB_FILE_PATH = getDbFilePath('clubs-persistent-db.json');

const INITIAL_SEED_CLUBS: ClubRecord[] = [
  {
    id: 'club-appdev',
    name: 'Application Development Club',
    code: 'ADC',
    description: 'Official campus club for designing, engineering, and deploying modern web, mobile, and AI applications.',
    department: 'Computer Science & Engineering',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'club-ai',
    name: 'AI & ML Innovations Club',
    code: 'AIML',
    description: 'Student-led artificial intelligence, machine learning, and neural network research group.',
    department: 'Computer Science & Engineering',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'club-coding',
    name: 'Competitive Coding & Algorithmic Club',
    code: 'CCAC',
    description: 'Algorithmic problem-solving, hackathons, and LeetCode/Codeforces competitive programming division.',
    department: 'Computer Science & Engineering',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'club-webdev',
    name: 'Web & Cloud Developers Club',
    code: 'WCDC',
    description: 'Full-stack web development, DevOps, microservices, and cloud architecture group.',
    department: 'Computer Science & Engineering',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'club-cyber',
    name: 'Cyber Security & Digital Forensics Club',
    code: 'CSDF',
    description: 'Ethical hacking, Capture The Flag (CTF) challenges, network defense, and digital forensics.',
    department: 'Computer Science & Engineering',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

const INITIAL_SEED_ASSIGNMENTS: AdminClubAssignmentRecord[] = [
  {
    id: 'assign-001',
    adminId: 'user-admin-001',
    adminName: 'Dr. Ramesh Babu (CSE Head)',
    adminEmail: 'admin@cse.vignan.ac.in',
    clubId: 'club-appdev',
    clubName: 'Application Development Club',
    role: 'ADMIN',
    status: 'ACTIVE',
    assignedBy: 'Super Admin',
    assignedAt: '2026-01-05T00:00:00.000Z',
    createdAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'assign-002',
    adminId: 'user-admin-001',
    adminName: 'Dr. Ramesh Babu (CSE Head)',
    adminEmail: 'admin@cse.vignan.ac.in',
    clubId: 'club-coding',
    clubName: 'Competitive Coding & Algorithmic Club',
    role: 'ADMIN',
    status: 'ACTIVE',
    assignedBy: 'Super Admin',
    assignedAt: '2026-01-06T00:00:00.000Z',
    createdAt: '2026-01-06T00:00:00.000Z',
  },
];

const globalForClubs = globalThis as unknown as {
  globalClubs: ClubRecord[] | undefined;
  globalAssignments: AdminClubAssignmentRecord[] | undefined;
};

function loadClubsFromStorage(): { clubs: ClubRecord[]; assignments: AdminClubAssignmentRecord[] } {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.clubs)) {
        return {
          clubs: parsed.clubs,
          assignments: Array.isArray(parsed.assignments) ? parsed.assignments : INITIAL_SEED_ASSIGNMENTS,
        };
      }
    }
  } catch (err) {
    console.error('Error reading clubs DB file:', err);
  }
  const initial = { clubs: INITIAL_SEED_CLUBS, assignments: INITIAL_SEED_ASSIGNMENTS };
  saveClubsToStorage(initial.clubs, initial.assignments);
  return initial;
}

function saveClubsToStorage(clubs: ClubRecord[], assignments: AdminClubAssignmentRecord[]) {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ clubs, assignments }, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving clubs DB file:', err);
  }
}

if (!globalForClubs.globalClubs) {
  const loaded = loadClubsFromStorage();
  globalForClubs.globalClubs = loaded.clubs;
  globalForClubs.globalAssignments = loaded.assignments;
}

let globalClubs = globalForClubs.globalClubs!;
let globalAssignments = globalForClubs.globalAssignments!;

function syncStore() {
  globalForClubs.globalClubs = globalClubs;
  globalForClubs.globalAssignments = globalAssignments;
  saveClubsToStorage(globalClubs, globalAssignments);
}

export async function getAllClubs(): Promise<ClubRecord[]> {
  return [...globalClubs];
}

export async function getClubById(id: string): Promise<ClubRecord | null> {
  const found = globalClubs.find(c => c.id === id || c.code.toLowerCase() === id.toLowerCase());
  return found ? { ...found } : null;
}

export async function getAllAssignments(): Promise<AdminClubAssignmentRecord[]> {
  return [...globalAssignments].sort(
    (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
  );
}

export async function getAssignmentsByAdmin(adminIdOrEmail: string): Promise<AdminClubAssignmentRecord[]> {
  if (!adminIdOrEmail) return [];
  const clean = adminIdOrEmail.trim().toLowerCase();
  return globalAssignments.filter(
    a =>
      a.status === 'ACTIVE' &&
      ((a.adminId && a.adminId.toLowerCase() === clean) ||
        (a.adminEmail && a.adminEmail.toLowerCase() === clean))
  );
}

export async function assignAdminToClub(data: {
  adminId: string;
  adminName: string;
  adminEmail: string;
  clubId: string;
  clubName?: string;
  role?: string;
  assignedBy?: string;
}): Promise<{ assignment: AdminClubAssignmentRecord; alreadyAssigned?: boolean }> {
  const club = await getClubById(data.clubId);
  if (!club) {
    throw new Error(`Club with ID "${data.clubId}" not found.`);
  }

  const cleanEmail = data.adminEmail.toLowerCase().trim();
  const existingIndex = globalAssignments.findIndex(
    a =>
      a.clubId === club.id &&
      (a.adminId === data.adminId || a.adminEmail.toLowerCase() === cleanEmail)
  );

  if (existingIndex !== -1) {
    const existing = globalAssignments[existingIndex];
    if (existing.status === 'ACTIVE') {
      return { assignment: { ...existing }, alreadyAssigned: true };
    }
    // Re-activate assignment
    globalAssignments[existingIndex] = {
      ...existing,
      status: 'ACTIVE',
      assignedBy: data.assignedBy || 'Super Admin',
      assignedAt: new Date().toISOString(),
      removedAt: null,
    };
    syncStore();
    return { assignment: { ...globalAssignments[existingIndex] }, alreadyAssigned: false };
  }

  const newAssignment: AdminClubAssignmentRecord = {
    id: `assign-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    adminId: data.adminId,
    adminName: data.adminName,
    adminEmail: cleanEmail,
    clubId: club.id,
    clubName: club.name,
    role: 'ADMIN',
    status: 'ACTIVE',
    assignedBy: data.assignedBy || 'Super Admin',
    assignedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  globalAssignments.unshift(newAssignment);
  syncStore();
  return { assignment: newAssignment, alreadyAssigned: false };
}

export async function removeAdminFromClub(
  assignmentIdOrAdminClub: { assignmentId?: string; adminId?: string; clubId?: string },
  removedBy: string = 'Super Admin'
): Promise<AdminClubAssignmentRecord | null> {
  const { assignmentId, adminId, clubId } = assignmentIdOrAdminClub;

  const index = globalAssignments.findIndex(a => {
    if (assignmentId) return a.id === assignmentId;
    if (adminId && clubId) {
      return (
        (a.adminId === adminId || a.adminEmail.toLowerCase() === adminId.toLowerCase()) &&
        a.clubId === clubId
      );
    }
    return false;
  });

  if (index === -1) return null;

  globalAssignments[index] = {
    ...globalAssignments[index],
    status: 'REMOVED',
    removedAt: new Date().toISOString(),
  };

  syncStore();
  return { ...globalAssignments[index] };
}

export async function isAdminAssignedToClub(adminIdOrEmail: string, clubId: string): Promise<boolean> {
  if (!adminIdOrEmail || !clubId) return false;
  const clean = adminIdOrEmail.trim().toLowerCase();
  return globalAssignments.some(
    a =>
      a.status === 'ACTIVE' &&
      a.clubId === clubId &&
      ((a.adminId && a.adminId.toLowerCase() === clean) ||
        (a.adminEmail && a.adminEmail.toLowerCase() === clean))
  );
}
