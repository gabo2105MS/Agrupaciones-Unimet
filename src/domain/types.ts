/** Rol de usuario (Firestore / claims; se implementará en la capa de auth). */
export type UserRole = 'student' | 'admin';

/** Placeholder para perfiles: se ampliará con el módulo de auth. */
export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  photoUrl?: string;
  phone?: string;
};
