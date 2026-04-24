import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config';
import { USER_PROFILES } from '../constants/collections';
import type { UserProfile, UserRole } from '../domain/types';

function db(): Firestore {
  return getFirebaseDb();
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db(), USER_PROFILES, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return null;
  }
  return snap.data() as UserProfile;
}

type CreateUserProfileInput = {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
};

export async function createUserProfile(input: CreateUserProfileInput): Promise<void> {
  const ref = doc(db(), USER_PROFILES, input.uid);
  await setDoc(ref, {
    displayName: input.displayName,
    email: input.email,
    role: input.role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, 'displayName' | 'phone' | 'photoUrl' | 'email' | 'role'>>,
): Promise<void> {
  const ref = doc(db(), USER_PROFILES, uid);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
