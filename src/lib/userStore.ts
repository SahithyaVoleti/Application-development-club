import { hashPassword } from '@/lib/auth';

export type Role = 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';
export type AdminStatus = 'PENDING_OTP' | 'PENDING_APPROVAL' | 'TRUSTED_ADMIN' | 'REJECTED' | 'ACTIVE';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  staffId?: string;
  studentId?: string;
  department?: string;
  year?: string;
  section?: string;
  passwordHash: string;
  role: Role;
  status: AdminStatus;
  otpVerified: boolean;
  createdAt: string;
  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectionReason?: string | null;
}

const DEFAULT_SECRET = process.env.AUTH_SECRET || 'super-secret-adhub-jwt-key-2026';

// Persistent in-memory store initialized with seed accounts
let globalUsers: UserRecord[] = [
  // 1. Super Admin Account
  {
    id: 'user-super-admin-001',
    name: 'Dr. K. Ranganathan (Super Admin)',
    email: 'superadmin@vignan.ac.in',
    phone: '+91 9440011223',
    staffId: 'SA-001',
    department: 'CSE / Executive Board',
    passwordHash: hashPassword('SuperAdmin@2026'),
    role: 'SUPER_ADMIN',
    status: 'TRUSTED_ADMIN',
    otpVerified: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    approvedAt: '2026-01-01T00:00:00.000Z',
    approvedBy: 'System Init',
  },
  // 2. Default Trusted Admin Account
  {
    id: 'user-admin-001',
    name: 'Dr. Ramesh Babu (CSE Head)',
    email: 'admin@cse.vignan.ac.in',
    phone: '+91 9848022334',
    staffId: 'FAC-CSE-001',
    department: 'CSE',
    passwordHash: hashPassword('ADHub@2026'),
    role: 'ADMIN',
    status: 'TRUSTED_ADMIN',
    otpVerified: true,
    createdAt: '2026-01-05T00:00:00.000Z',
    approvedAt: '2026-01-05T00:00:00.000Z',
    approvedBy: 'Super Admin',
  },
  // 3. Demo Pending Admin Request for UI Testing
  {
    id: 'user-admin-pending-001',
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    phone: '+91 9876543210',
    staffId: 'FAC123',
    department: 'CSE',
    passwordHash: hashPassword('RahulPass@2026'),
    role: 'ADMIN',
    status: 'PENDING_APPROVAL',
    otpVerified: true,
    createdAt: new Date().toISOString(),
  },
];

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const cleanEmail = email.toLowerCase().trim();
  const user = globalUsers.find(u => u.email.toLowerCase() === cleanEmail);
  return user ? { ...user } : null;
}

export async function findUserByStaffId(staffId: string): Promise<UserRecord | null> {
  if (!staffId) return null;
  const cleanStaffId = staffId.toUpperCase().trim();
  const user = globalUsers.find(u => u.staffId && u.staffId.toUpperCase() === cleanStaffId);
  return user ? { ...user } : null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const user = globalUsers.find(u => u.id === id);
  return user ? { ...user } : null;
}

export async function createUser(data: Omit<UserRecord, 'id' | 'createdAt'>): Promise<UserRecord> {
  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newUser: UserRecord = {
    ...data,
    id,
    email: data.email.toLowerCase().trim(),
    staffId: data.staffId ? data.staffId.toUpperCase().trim() : undefined,
    createdAt: new Date().toISOString(),
  };

  globalUsers.push(newUser);
  return { ...newUser };
}

export async function updateUser(id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
  const index = globalUsers.findIndex(u => u.id === id);
  if (index === -1) return null;

  globalUsers[index] = {
    ...globalUsers[index],
    ...updates,
  };

  return { ...globalUsers[index] };
}

export async function getPendingAdminRequests(): Promise<UserRecord[]> {
  return globalUsers
    .filter(u => u.role === 'ADMIN' && u.status === 'PENDING_APPROVAL')
    .map(u => ({ ...u }));
}

export async function getAllAdminRequests(): Promise<UserRecord[]> {
  return globalUsers
    .filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN')
    .map(u => ({ ...u }));
}

export async function approveAdminRequest(id: string, approvedBy: string = 'Super Admin'): Promise<UserRecord | null> {
  const index = globalUsers.findIndex(u => u.id === id);
  if (index === -1) return null;

  globalUsers[index] = {
    ...globalUsers[index],
    role: 'ADMIN',
    status: 'TRUSTED_ADMIN',
    approvedAt: new Date().toISOString(),
    approvedBy,
    rejectionReason: null,
  };

  return { ...globalUsers[index] };
}

export async function rejectAdminRequest(id: string, rejectionReason: string = 'Verification details did not match faculty records.'): Promise<UserRecord | null> {
  const index = globalUsers.findIndex(u => u.id === id);
  if (index === -1) return null;

  globalUsers[index] = {
    ...globalUsers[index],
    status: 'REJECTED',
    rejectionReason,
  };

  return { ...globalUsers[index] };
}

export async function getAllUsers(): Promise<UserRecord[]> {
  return globalUsers.map(u => ({ ...u }));
}
