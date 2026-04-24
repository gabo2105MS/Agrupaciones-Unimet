import type { UserRole } from '../domain/types';

const SEP = /[\s,;]+/;

/**
 * Asigna rol admin si el email está en EXPO_PUBLIC_ADMIN_EMAILS.
 */
export function resolveInitialRole(email: string): UserRole {
  const raw = process.env.EXPO_PUBLIC_ADMIN_EMAILS?.trim() ?? '';
  if (!raw) {
    return 'student';
  }
  const list = raw.split(SEP).map((e: string) => e.toLowerCase().trim());
  return list.includes(email.toLowerCase()) ? 'admin' : 'student';
}
