import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config';
import { GROUP_TYPES } from '../constants/collections';
import type { GroupType } from '../domain/types';

function db(): Firestore {
  return getFirebaseDb();
}

export async function listGroupTypes(): Promise<GroupType[]> {
  const q = query(collection(db(), GROUP_TYPES), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt,
    } as GroupType;
  });
}

export async function getGroupType(id: string): Promise<GroupType | null> {
  const ref = doc(db(), GROUP_TYPES, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return null;
  }
  return { id: snap.id, ...snap.data() } as GroupType;
}

export async function createGroupType(data: { name: string; description?: string }): Promise<string> {
  const col = collection(db(), GROUP_TYPES);
  const ref = await addDoc(col, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateGroupType(
  id: string,
  data: { name: string; description?: string },
): Promise<void> {
  const ref = doc(db(), GROUP_TYPES, id);
  await updateDoc(ref, data);
}

export async function removeGroupType(id: string): Promise<void> {
  await deleteDoc(doc(db(), GROUP_TYPES, id));
}
