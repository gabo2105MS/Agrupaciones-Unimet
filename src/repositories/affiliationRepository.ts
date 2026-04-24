import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
  type Firestore,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config';
import { AFFILIATIONS, GROUPS } from '../constants/collections';
import type { Affiliation } from '../domain/types';

function db(): Firestore {
  return getFirebaseDb();
}

export function buildAffiliationId(userId: string, groupId: string): string {
  return `${userId}_${groupId}`;
}

export async function getAffiliation(userId: string, groupId: string): Promise<Affiliation | null> {
  const id = buildAffiliationId(userId, groupId);
  const ref = doc(db(), AFFILIATIONS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return null;
  }
  return { id, ...(snap.data() as Omit<Affiliation, 'id'>) } as Affiliation;
}

export async function listAffiliationsByUser(userId: string): Promise<Affiliation[]> {
  const q = query(collection(db(), AFFILIATIONS), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Affiliation));
}

export async function createAffiliation(userId: string, groupId: string): Promise<void> {
  const id = buildAffiliationId(userId, groupId);
  const ref = doc(db(), AFFILIATIONS, id);
  const groupRef = doc(db(), GROUPS, groupId);
  await runTransaction(db(), async (tx) => {
    const g = await tx.get(groupRef);
    if (!g.exists()) {
      throw new Error('Grupo no encontrado');
    }
    const aff = await tx.get(ref);
    if (aff.exists()) {
      return;
    }
    tx.set(ref, {
      userId,
      groupId,
      joinedAt: serverTimestamp(),
    });
    const mc = (g.data()?.memberCount as number) ?? 0;
    tx.update(groupRef, { memberCount: mc + 1, updatedAt: serverTimestamp() });
  });
}

export async function countMembers(groupId: string): Promise<number> {
  const g = await getDoc(doc(db(), GROUPS, groupId));
  if (!g.exists()) {
    return 0;
  }
  return (g.data()?.memberCount as number) ?? 0;
}
