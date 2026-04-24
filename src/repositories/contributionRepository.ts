import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
  type Firestore,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config';
import { CONTRIBUTIONS } from '../constants/collections';
import type { Contribution, ContributionStatus } from '../domain/types';

function db(): Firestore {
  return getFirebaseDb();
}

export async function addContribution(data: {
  userId: string;
  groupId: string;
  amount: number;
  currency: string;
  status: ContributionStatus;
  paypalOrderId?: string;
}): Promise<string> {
  const col = collection(db(), CONTRIBUTIONS);
  const ref = await addDoc(col, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listContributionsByUser(userId: string): Promise<Contribution[]> {
  const q = query(
    collection(db(), CONTRIBUTIONS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Contribution));
}

export async function listContributionsByGroupAndUser(
  userId: string,
  groupId: string,
): Promise<Contribution[]> {
  const all = await listContributionsByUser(userId);
  return all.filter((c) => c.groupId === groupId);
}
