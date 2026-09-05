import { PrismaClient, Role } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Simple JWT / Token session generation using HMAC SHA-256
const SECRET_KEY = process.env.AUTH_SECRET || 'super-secret-adhub-jwt-key-2026';

export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', SECRET_KEY).update(password).digest('hex');
}

export function generateToken(payload: { id: string; email: string; role: Role; name: string }): string {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  return Buffer.from(`${data}.${signature}`).toString('base64');
}

export function verifyToken(token: string): { id: string; email: string; role: Role; name: string } | null {
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

    return payload;
  } catch (error) {
    return null;
  }
}
