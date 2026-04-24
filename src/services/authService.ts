import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  type Auth,
} from 'firebase/auth';
import { getFirebaseAuthInstance } from '../config';
import { createUserProfile, getUserProfile, updateUserProfile } from '../repositories/userRepository';
import type { UserRole, UserProfile } from '../domain/types';
import { resolveInitialRole } from './roleResolver';

function auth(): Auth {
  return getFirebaseAuthInstance();
}

export function subscribeAuth(onUser: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth(), (u) => onUser(u));
}

export async function registerWithEmail(
  displayName: string,
  email: string,
  password: string,
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth(), email, password);
  await updateProfile(user, { displayName });
  const role = resolveInitialRole(email);
  await createUserProfile({ uid: user.uid, displayName, email, role });
  return user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth(), email, password);
  const existing = await getUserProfile(user.uid);
  if (!existing) {
    const role = resolveInitialRole(email);
    await createUserProfile({
      uid: user.uid,
      displayName: user.displayName || email.split('@')[0] || 'Usuario',
      email: user.email || email,
      role,
    });
  }
  return user;
}

export async function signInWithGoogleIdToken(idToken: string | undefined): Promise<User> {
  if (!idToken) {
    throw new Error('No se recibió id_token de Google');
  }
  const credential = GoogleAuthProvider.credential(idToken);
  const { user } = await signInWithCredential(auth(), credential);
  const existing = await getUserProfile(user.uid);
  if (!existing) {
    const email = user.email || '';
    const role = resolveInitialRole(email);
    await createUserProfile({
      uid: user.uid,
      displayName: user.displayName || email.split('@')[0] || 'Usuario',
      email,
      role,
    });
  }
  return user;
}

export async function signInWithFacebookToken(accessToken: string | undefined): Promise<User> {
  if (!accessToken) {
    throw new Error('No se recibió token de Facebook');
  }
  const credential = FacebookAuthProvider.credential(accessToken);
  const { user } = await signInWithCredential(auth(), credential);
  const existing = await getUserProfile(user.uid);
  if (!existing) {
    const email = user.email || '';
    const role = resolveInitialRole(email);
    await createUserProfile({
      uid: user.uid,
      displayName: user.displayName || 'Usuario',
      email: email || `fb_${user.uid}@users.noreply.facebook.com`,
      role,
    });
  }
  return user;
}

export async function logoutAuth(): Promise<void> {
  await signOut(auth());
}

export type AuthSession = { firebaseUser: User; profile: UserProfile | null };

export async function loadSession(user: User): Promise<AuthSession> {
  const profile = await getUserProfile(user.uid);
  return { firebaseUser: user, profile };
}
