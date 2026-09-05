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

/**
 * BACKEND SECURITY: Strict Admin Authorization Guard
 * Verifies that the user has token, role === 'ADMIN' or 'SUPER_ADMIN', and status === 'TRUSTED_ADMIN'
 */
export function verifyTrustedAdmin(authHeaderOrToken?: string | null): AuthTokenPayload | null {
  if (!authHeaderOrToken) return null;
  const token = authHeaderOrToken.replace(/^Bearer\s+/i, '');
  const payload = verifyToken(token);
  if (!payload) return null;

  if (payload.role === 'SUPER_ADMIN') {
    return payload;
  }

  if (payload.role === 'ADMIN' && payload.status === 'TRUSTED_ADMIN') {
    return payload;
  }

  return null;
}
