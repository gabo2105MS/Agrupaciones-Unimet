import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type Firestore,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config';
import { FEEDBACKS, GROUPS } from '../constants/collections';
import type { Feedback } from '../domain/types';

function db(): Firestore {
  return getFirebaseDb();
}

export async function addFeedback(
  userId: string,
  groupId: string,
  comment: string,
): Promise<void> {
  const groupRef = doc(db(), GROUPS, groupId);
  const col = collection(db(), FEEDBACKS);
  await runTransaction(db(), async (tx) => {
    const gSnap = await tx.get(groupRef);
    if (!gSnap.exists()) {
      throw new Error('Grupo no encontrado');
    }
    const g = gSnap.data() as { feedbackCount?: number };
    const count = (g.feedbackCount ?? 0) + 1;
    const newRef = doc(col);
    tx.set(newRef, {
      userId,
      groupId,
      comment: comment.trim(),
      createdAt: serverTimestamp(),
    });
    tx.update(groupRef, {
      feedbackCount: count,
      updatedAt: serverTimestamp(),
    });
  });
}

export async function listFeedbackForGroup(groupId: string): Promise<Feedback[]> {
  const q = query(
    collection(db(), FEEDBACKS),
    where('groupId', '==', groupId),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Feedback));
}
