// Global in-memory store for Admin OTP codes with expiration (5 minutes)
export const adminOtpStore = new Map<string, { code: string; expiresAt: number }>();
