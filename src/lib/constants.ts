/**
 * Centralized Super Admin Configuration
 * Exactly 3 authorized Super Admin email addresses for the Application Development Club.
 */
export const SUPER_ADMIN_EMAILS: readonly string[] = [
  'sahithyalakshmivoleti@gmail.com',
  'uvr_cse@vignan.ac.in',
  'deepakchowdaryedara@gmail.com',
] as const;

/**
 * Validates whether an email address belongs to an authorized Super Admin.
 * Performs exact, case-insensitive, trimmed email comparison.
 */
export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return SUPER_ADMIN_EMAILS.includes(clean);
}
