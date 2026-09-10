import crypto from 'crypto';
import { type Role, type AdminStatus } from './userStore';

const SECRET_KEY = process.env.AUTH_SECRET || 'super-secret-adhub-jwt-key-2026';

export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', SECRET_KEY).update(password).digest('hex');
}

export interface AuthTokenPayload {
  id: string;
  email: string;
  role: Role;
  name: string;
  status: AdminStatus;
  staffId?: string;
  department?: string;
}

export function generateToken(payload: AuthTokenPayload): string {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  return Buffer.from(`${data}.${signature}`).toString('base64');
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const lastDotIndex = decoded.lastIndexOf('.');
    if (lastDotIndex === -1) return null;

    const dataStr = decoded.substring(0, lastDotIndex);
    const signature = decoded.substring(lastDotIndex + 1);

    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(dataStr).digest('hex');
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(dataStr);
    if (payload.exp && payload.exp < Date.now()) return null;

    return payload as AuthTokenPayload;
  } catch (error) {
    return null;
  }
}

import { isSuperAdminEmail } from './userStore';

/**
 * Central Super Admin Authorization Function (Requirement 3)
 */
export function isSuperAdmin(
  userOrEmail?: string | { role?: string; email?: string; status?: string } | null
): boolean {
  if (!userOrEmail) return false;

  if (typeof userOrEmail === 'string') {
    return isSuperAdminEmail(userOrEmail);
  }

  const role = (userOrEmail.role || '').toUpperCase().trim();
  const email = (userOrEmail.email || '').toLowerCase().trim();

  if (role === 'SUPER_ADMIN') return true;
  if (isSuperAdminEmail(email)) return true;

  return false;
}

/**
 * STRICT SERVER-SIDE RBAC GUARD: Super Admin Only
 * Enforces authenticated session AND role === 'SUPER_ADMIN'
 */
export function verifySuperAdmin(authHeaderOrToken?: string | null): AuthTokenPayload | null {
  if (!authHeaderOrToken) return null;
  const token = authHeaderOrToken.replace(/^Bearer\s+/i, '');
  const payload = verifyToken(token);
  if (!payload) return null;

  if (isSuperAdmin(payload)) {
    return { ...payload, role: 'SUPER_ADMIN', status: 'APPROVED' };
  }

  return null;
}

/**
 * STRICT SERVER-SIDE RBAC GUARD: Approved Admin Access
 * Enforces authenticated session AND role === 'SUPER_ADMIN' OR (role === 'ADMIN' && status === 'APPROVED')
 */
export function verifyApprovedAdmin(authHeaderOrToken?: string | null): AuthTokenPayload | null {
  if (!authHeaderOrToken) return null;
  const token = authHeaderOrToken.replace(/^Bearer\s+/i, '');
  const payload = verifyToken(token);
  if (!payload) return null;

  if (payload.role === 'SUPER_ADMIN') {
    return payload;
  }

  if (payload.role === 'ADMIN' && (payload.status === 'APPROVED' || payload.status === 'TRUSTED_ADMIN')) {
    return payload;
  }

  return null;
}

/** Backwards-compatible alias */
export const verifyTrustedAdmin = verifyApprovedAdmin;

export interface ActionTokenPayload {
  adminId: string;
  adminEmail: string;
  action: 'approve' | 'reject';
  superAdminEmail: string;
  exp: number;
}

export function generateApprovalActionToken(
  adminId: string,
  adminEmail: string,
  action: 'approve' | 'reject',
  superAdminEmail: string,
  expiresInMs: number = 7 * 24 * 60 * 60 * 1000 // 7 days
): string {
  const payload: ActionTokenPayload = {
    adminId,
    adminEmail,
    action,
    superAdminEmail,
    exp: Date.now() + expiresInMs,
  };
  const data = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(`APPROVAL:${data}`).digest('hex');
  return Buffer.from(`${data}.${signature}`).toString('base64url');
}

export function verifyApprovalActionToken(token: string): ActionTokenPayload | null {
  try {
    let decoded: string;
    try {
      decoded = Buffer.from(token, 'base64url').toString('utf-8');
    } catch {
      decoded = Buffer.from(token, 'base64').toString('utf-8');
    }
    const lastDotIndex = decoded.lastIndexOf('.');
    if (lastDotIndex === -1) return null;

    const dataStr = decoded.substring(0, lastDotIndex);
    const signature = decoded.substring(lastDotIndex + 1);

    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(`APPROVAL:${dataStr}`).digest('hex');
    if (signature !== expectedSig) return null;

    const payload = JSON.parse(dataStr) as ActionTokenPayload;
    if (payload.exp && payload.exp < Date.now()) {
      return { ...payload, exp: payload.exp, isExpired: true } as any;
    }

    return payload;
  } catch (error) {
    return null;
  }
}
