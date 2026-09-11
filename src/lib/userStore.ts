import fs from 'fs';
import path from 'path';
import { hashPassword } from '@/lib/auth';
import { SUPER_ADMIN_EMAILS, isSuperAdminEmail } from '@/lib/constants';

export { isSuperAdminEmail };

export type Role = 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';
export type AdminStatus = 'PENDING' | 'PENDING_OTP' | 'PENDING_APPROVAL' | 'APPROVED' | 'TRUSTED_ADMIN' | 'REJECTED' | 'ACTIVE';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  staffId?: string;
  studentId?: string;
  department?: string;
  designation?: string;
  college?: string;
  organization?: string;
  year?: string;
  section?: string;
  passwordHash: string;
  role: Role;
  status: AdminStatus;
  otpVerified: boolean;
  createdAt: string;
  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectedAt?: string | null;
  rejectedBy?: string | null;
  rejectionReason?: string | null;
}

export interface AuditLogRecord {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: 'APPROVED' | 'REJECTED' | 'CREATED' | 'UPDATED' | 'DELETED' | 'REGISTERED';
  performedBy: string;
  performedAt: string;
  rejectionReason?: string | null;
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

const DB_FILE_PATH = getDbFilePath('users-persistent-db.json');

const INITIAL_SEED_USERS: UserRecord[] = [
  // 1. Sahithya Voleti (Super Admin)
  {
    id: 'user-super-admin-001',
    name: 'Sahithya Voleti (Super Admin)',
    email: 'sahithyalakshmivoleti@gmail.com',
    phone: '+91 9876543210',
    staffId: 'SA-001',
    studentId: '221FA04049',
    department: 'Computer Science & Engineering',
    designation: 'Super Admin',
    year: '3rd Year',
    section: 'A',
    passwordHash: hashPassword('Ramana@5445'),
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    otpVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    approvedAt: '2026-01-01T00:00:00.000Z',
    approvedBy: 'System Init',
  },
  // 2. E. Deepak Chowdary (Super Admin)
  {
    id: 'user-super-admin-002',
    name: 'E. Deepak Chowdary (Super Admin)',
    email: 'deepakchowdaryedara@gmail.com',
    phone: '+91 9876543211',
    staffId: 'SA-002',
    department: 'Computer Science & Engineering',
    designation: 'Super Admin',
    passwordHash: hashPassword('SuperAdmin@2026'),
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    otpVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    approvedAt: '2026-01-01T00:00:00.000Z',
    approvedBy: 'System Init',
  },
  // 3. U. Venkateswarao (Super Admin)
  {
    id: 'user-super-admin-003',
    name: 'U. Venkateswarao (Super Admin)',
    email: 'uvr_cse@vignan.ac.in',
    phone: '+91 9876543212',
    staffId: 'SA-003',
    department: 'Computer Science & Engineering',
    designation: 'Super Admin',
    passwordHash: hashPassword('SuperAdmin@2026'),
    role: 'SUPER_ADMIN',
    status: 'APPROVED',
    otpVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    approvedAt: '2026-01-01T00:00:00.000Z',
    approvedBy: 'System Init',
  },
  // 4. Default Approved Admin Account: Dr. Ramesh Babu
  {
    id: 'user-admin-001',
    name: 'Dr. Ramesh Babu (CSE Head)',
    email: 'admin@cse.vignan.ac.in',
    phone: '+91 9848022334',
    staffId: 'FAC-CSE-001',
    department: 'CSE',
    designation: 'Head of Department',
    passwordHash: hashPassword('ADHub@2026'),
    role: 'ADMIN',
    status: 'APPROVED',
    otpVerified: true,
    createdAt: '2026-01-05T00:00:00.000Z',
    approvedAt: '2026-01-05T00:00:00.000Z',
    approvedBy: 'Super Admin',
  },
  // 5. Seeded Student Account: Sahithya Voleti
  {
    id: 'user-student-001',
    name: 'Sahithya Voleti',
    email: 'sahithyavoleti14@gmail.com',
    phone: '+91 9876543210',
    studentId: '221FA04049',
    department: 'Computer Science & Engineering',
    designation: 'Student Developer',
    year: '3rd Year',
    section: 'A',
    passwordHash: hashPassword('Ramana@5445'),
    role: 'STUDENT',
    status: 'ACTIVE',
    otpVerified: true,
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  // 6. Pending Admin Registration Request: M. Varun Kumar
  {
    id: 'user-admin-varun-001',
    name: 'M. Varun Kumar',
    email: 'varunkumar@vignan.ac.in',
    phone: '+91 9876543211',
    staffId: 'FAC-CSE-007',
    department: 'Computer Science & Engineering',
    designation: 'Faculty Coordinator',
    passwordHash: hashPassword('Varun@2026'),
    role: 'ADMIN',
    status: 'PENDING_APPROVAL',
    otpVerified: false,
    createdAt: new Date().toISOString(),
  },
];

function loadUsersFromStorage(): { users: UserRecord[]; auditLogs: AuditLogRecord[]; usedTokens: string[] } {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users)) {
        // Merge loaded users with seed defaults if missing essential fields
        const mergedUsers = parsed.users.map((u: any) => {
          const seedMatch = INITIAL_SEED_USERS.find(
            s => s.id === u.id || (u.email && s.email.toLowerCase() === u.email.toLowerCase())
          );
          if (seedMatch) {
            return { ...seedMatch, ...u };
          }
          return u;
        });

        // Ensure all 3 Super Admins exist
        for (const seed of INITIAL_SEED_USERS) {
          if (seed.role === 'SUPER_ADMIN') {
            const exists = mergedUsers.some(
              (u: any) => u.id === seed.id || (u.email && u.email.toLowerCase() === seed.email.toLowerCase())
            );
            if (!exists) {
              mergedUsers.unshift(seed);
            }
          }
        }

        return {
          users: mergedUsers,
          auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : [],
          usedTokens: Array.isArray(parsed.usedTokens) ? parsed.usedTokens : [],
        };
      }
    }
  } catch (err) {
    console.error('Error reading user DB file:', err);
  }
  const initialData = { users: INITIAL_SEED_USERS, auditLogs: [], usedTokens: [] };
  saveUsersToStorage(initialData.users, initialData.auditLogs, initialData.usedTokens);
  return initialData;
}

function saveUsersToStorage(users: UserRecord[], auditLogs: AuditLogRecord[], usedTokens: string[] = []) {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      DB_FILE_PATH,
      JSON.stringify({ users, auditLogs, usedTokens, updatedAt: new Date().toISOString() }, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('Error saving user DB file:', err);
  }
}

export function ensureSuperAdminsExist() {
  // 1. Ensure seed Super Admins are present
  for (const seed of INITIAL_SEED_USERS) {
    if (seed.role === 'SUPER_ADMIN') {
      const idx = globalUsers.findIndex(
        u => u.id === seed.id || (u.email && u.email.toLowerCase() === seed.email.toLowerCase())
      );
      if (idx === -1) {
        globalUsers.unshift({ ...seed });
      } else {
        globalUsers[idx] = {
          ...globalUsers[idx],
          email: seed.email,
          role: 'SUPER_ADMIN',
          status: 'APPROVED',
          otpVerified: true,
        };
      }
    }
  }

  // 2. Scan all stored users: upgrade authorized emails & demote unauthorized super_admins
  for (let i = 0; i < globalUsers.length; i++) {
    const userEmail = globalUsers[i].email;
    if (userEmail && isSuperAdminEmail(userEmail)) {
      globalUsers[i].role = 'SUPER_ADMIN';
      globalUsers[i].status = 'APPROVED';
      globalUsers[i].otpVerified = true;
    } else if (globalUsers[i].role === 'SUPER_ADMIN') {
      // Demote unauthorized user claiming SUPER_ADMIN
      globalUsers[i].role = globalUsers[i].status === 'APPROVED' ? 'ADMIN' : 'STUDENT';
    }
  }
}

// Global Singleton pattern to maintain in-memory state across Next.js HMR reloads
const globalForUserStore = globalThis as unknown as {
  globalUsers: UserRecord[] | undefined;
  globalAuditLogs: AuditLogRecord[] | undefined;
  globalUsedTokens: string[] | undefined;
};

if (!globalForUserStore.globalUsers) {
  const loaded = loadUsersFromStorage();
  globalForUserStore.globalUsers = loaded.users;
  globalForUserStore.globalAuditLogs = loaded.auditLogs;
  globalForUserStore.globalUsedTokens = loaded.usedTokens;
}

let globalUsers = globalForUserStore.globalUsers!;
let globalAuditLogs = globalForUserStore.globalAuditLogs!;
let globalUsedTokens = globalForUserStore.globalUsedTokens || [];
ensureSuperAdminsExist();

function syncStore() {
  globalForUserStore.globalUsers = globalUsers;
  globalForUserStore.globalAuditLogs = globalAuditLogs;
  globalForUserStore.globalUsedTokens = globalUsedTokens;
  saveUsersToStorage(globalUsers, globalAuditLogs, globalUsedTokens);
}

export function isTokenUsed(token: string): boolean {
  if (!token) return false;
  return globalUsedTokens.includes(token.trim());
}

export function markTokenAsUsed(token: string): void {
  if (!token) return;
  const cleanToken = token.trim();
  if (!globalUsedTokens.includes(cleanToken)) {
    globalUsedTokens.push(cleanToken);
    syncStore();
  }
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  if (!email) return null;
  ensureSuperAdminsExist();
  const cleanEmail = email.toLowerCase().trim();
  
  let user = globalUsers.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (!user) {
    user = globalUsers.find(u => u.email && u.email.toLowerCase().includes(cleanEmail));
  }

  if (user) {
    if (isSuperAdminEmail(user.email) || isSuperAdminEmail(cleanEmail)) {
      user.role = 'SUPER_ADMIN';
      user.status = 'APPROVED';
      user.otpVerified = true;
      syncStore();
    }
    return { ...user };
  }

  // Auto-provision missing Super Admin accounts on initial lookup
  if (isSuperAdminEmail(cleanEmail)) {
    const newSuperAdmin: UserRecord = {
      id: `user-super-admin-${Date.now()}`,
      name: cleanEmail.includes('sahithya')
        ? 'Sahithya Voleti (Super Admin)'
        : cleanEmail.includes('deepak')
        ? 'E. Deepak Chowdary (Super Admin)'
        : 'U. Venkateswarao (Super Admin)',
      email: cleanEmail,
      passwordHash: hashPassword('SuperAdmin@2026'),
      role: 'SUPER_ADMIN',
      status: 'APPROVED',
      otpVerified: true,
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      approvedBy: 'System Init',
    };
    globalUsers.unshift(newSuperAdmin);
    syncStore();
    return { ...newSuperAdmin };
  }

  return null;
}

export async function findUserByStaffId(staffId: string): Promise<UserRecord | null> {
  if (!staffId) return null;
  const cleanStaffId = staffId.toUpperCase().trim();
  const user = globalUsers.find(u => u.staffId && u.staffId.toUpperCase() === cleanStaffId);
  return user ? { ...user } : null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  if (!id) return null;
  const user = globalUsers.find(u => u.id === id);
  return user ? { ...user } : null;
}

export async function createUser(data: Omit<UserRecord, 'id' | 'createdAt'>): Promise<UserRecord> {
  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newUser: UserRecord = {
    ...data,
    id,
    email: (data.email || '').toLowerCase().trim(),
    staffId: data.staffId ? data.staffId.toUpperCase().trim() : undefined,
    createdAt: new Date().toISOString(),
  };

  globalUsers.push(newUser);
  syncStore();
  return { ...newUser };
}

export async function updateUser(id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
  if (!id) return null;
  const cleanId = id.trim().toLowerCase();
  const index = globalUsers.findIndex(
    u => (u.id && u.id.toLowerCase() === cleanId) || (u.email && u.email.toLowerCase() === cleanId)
  );
  if (index === -1) return null;

  globalUsers[index] = {
    ...globalUsers[index],
    ...updates,
  };

  syncStore();
  return { ...globalUsers[index] };
}

export async function deleteUser(id: string): Promise<boolean> {
  if (!id) return false;
  const clean = id.trim().toLowerCase();
  const index = globalUsers.findIndex(
    u =>
      (u.id && u.id.toLowerCase() === clean) ||
      (u.email && u.email.toLowerCase() === clean) ||
      (u.staffId && u.staffId.toLowerCase() === clean)
  );
  if (index === -1) return false;
  globalUsers.splice(index, 1);
  syncStore();
  return true;
}

export async function getPendingAdminRequests(): Promise<UserRecord[]> {
  ensureSuperAdminsExist();
  return globalUsers
    .filter(u => u.role === 'ADMIN' && (u.status === 'PENDING' || u.status === 'PENDING_APPROVAL' || u.status === 'PENDING_OTP'))
    .map(u => ({ ...u }));
}

export async function getAllAdminRequests(): Promise<UserRecord[]> {
  ensureSuperAdminsExist();
  return globalUsers
    .filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN')
    .map(u => ({ ...u }));
}

/** Configured Super Admin email addresses */
export function getSuperAdminEmails(): string[] {
  const envEmails = process.env.SUPER_ADMIN_EMAILS;
  if (envEmails) {
    return envEmails
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
  }
  return [...SUPER_ADMIN_EMAILS];
}

export async function getAuditLogs(): Promise<AuditLogRecord[]> {
  return [...globalAuditLogs].sort(
    (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
  );
}

export async function addAuditLog(log: Omit<AuditLogRecord, 'id' | 'performedAt'>): Promise<AuditLogRecord> {
  const newLog: AuditLogRecord = {
    ...log,
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    performedAt: new Date().toISOString(),
  };
  globalAuditLogs.push(newLog);
  syncStore();
  return newLog;
}

export async function approveAdminRequest(
  id: string,
  approvedBy: string = 'Super Admin'
): Promise<{ user: UserRecord | null; alreadyProcessed?: boolean }> {
  if (!id) return { user: null };
  const cleanId = id.trim().toLowerCase();
  const index = globalUsers.findIndex(
    u => u.id === id || (u.id && u.id.toLowerCase() === cleanId) || (u.email && u.email.toLowerCase() === cleanId)
  );
  if (index === -1) return { user: null };

  const target = globalUsers[index];

  // Atomic Check: Prevent duplicate approval / reprocessing
  if (target.status === 'APPROVED' || target.status === 'REJECTED') {
    return { user: { ...target }, alreadyProcessed: true };
  }

  globalUsers[index] = {
    ...target,
    role: 'ADMIN',
    status: 'APPROVED',
    approvedAt: new Date().toISOString(),
    approvedBy,
    rejectionReason: null,
  };

  const updatedUser = { ...globalUsers[index] };

  // Add audit log
  await addAuditLog({
    adminId: updatedUser.id,
    adminName: updatedUser.name,
    adminEmail: updatedUser.email,
    action: 'APPROVED',
    performedBy: approvedBy,
  });

  syncStore();
  return { user: updatedUser, alreadyProcessed: false };
}

export async function rejectAdminRequest(
  id: string,
  rejectedBy: string = 'Super Admin',
  rejectionReason: string = 'Verification details did not match CSE Faculty records.'
): Promise<{ user: UserRecord | null; alreadyProcessed?: boolean }> {
  if (!id) return { user: null };
  const cleanId = id.trim().toLowerCase();
  const index = globalUsers.findIndex(
    u => u.id === id || (u.id && u.id.toLowerCase() === cleanId) || (u.email && u.email.toLowerCase() === cleanId)
  );
  if (index === -1) return { user: null };

  const target = globalUsers[index];

  // Atomic Check: Prevent duplicate rejection / reprocessing
  if (target.status === 'APPROVED' || target.status === 'REJECTED') {
    return { user: { ...target }, alreadyProcessed: true };
  }

  globalUsers[index] = {
    ...target,
    status: 'REJECTED',
    rejectedBy,
    rejectedAt: new Date().toISOString(),
    rejectionReason,
  };

  const updatedUser = { ...globalUsers[index] };

  // Add audit log
  await addAuditLog({
    adminId: updatedUser.id,
    adminName: updatedUser.name,
    adminEmail: updatedUser.email,
    action: 'REJECTED',
    performedBy: rejectedBy,
    rejectionReason,
  });

  syncStore();
  return { user: updatedUser, alreadyProcessed: false };
}

export async function createDirectAdmin(data: {
  name: string;
  email: string;
  phone?: string;
  staffId?: string;
  department?: string;
  designation?: string;
  passwordHash: string;
}, approvedBy: string = 'Super Admin'): Promise<UserRecord> {
  if (!data?.email) throw new Error('Email is required');
  const cleanEmail = data.email.toLowerCase().trim();
  const existing = globalUsers.find(u => u.email && u.email.toLowerCase() === cleanEmail);

  if (existing) {
    existing.role = 'ADMIN';
    existing.status = 'APPROVED';
    existing.otpVerified = true;
    existing.name = data.name;
    if (data.phone) existing.phone = data.phone;
    if (data.staffId) existing.staffId = data.staffId.toUpperCase().trim();
    if (data.department) existing.department = data.department;
    if (data.designation) existing.designation = data.designation;
    if (data.passwordHash) existing.passwordHash = data.passwordHash;
    existing.approvedAt = new Date().toISOString();
    existing.approvedBy = approvedBy;
    existing.rejectionReason = null;
    syncStore();
    return { ...existing };
  }

  const id = `user-admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newAdmin: UserRecord = {
    id,
    name: data.name,
    email: cleanEmail,
    phone: data.phone,
    staffId: data.staffId ? data.staffId.toUpperCase().trim() : `FAC-${Date.now().toString().slice(-4)}`,
    department: data.department || 'CSE',
    designation: data.designation || 'Faculty Coordinator',
    passwordHash: data.passwordHash,
    role: 'ADMIN',
    status: 'APPROVED',
    otpVerified: true,
    createdAt: new Date().toISOString(),
    approvedAt: new Date().toISOString(),
    approvedBy,
  };

  globalUsers.push(newAdmin);
  syncStore();
  return { ...newAdmin };
}

export async function getAllUsers(): Promise<UserRecord[]> {
  return globalUsers.map(u => ({ ...u }));
}
