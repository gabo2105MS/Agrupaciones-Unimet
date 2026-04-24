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
  where,
  type Firestore,
} from 'firebase/firestore';
import { getFirebaseDb } from '../config';
import { GROUPS } from '../constants/collections';
import type { Group } from '../domain/types';

function db(): Firestore {
  return getFirebaseDb();
}

export async function listGroups(): Promise<Group[]> {
  const q = query(collection(db(), GROUPS), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapGroup(d.id, d.data()));
}

function mapGroup(id: string, data: Record<string, unknown>): Group {
  return {
    id,
    typeId: data.typeId as string,
    code: data.code as string,
    name: data.name as string,
    mission: data.mission as string,
    vision: data.vision as string,
    photoUrl: data.photoUrl as string | undefined,
    isAvailable: (data.isAvailable as boolean) ?? true,
    memberCount: (data.memberCount as number) ?? 0,
    leaderName: data.leaderName as string | undefined,
    participantNames: data.participantNames as string | undefined,
    feedbackSum: data.feedbackSum as number | undefined,
    feedbackCount: data.feedbackCount as number | undefined,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  } as Group;
}

export async function getGroup(id: string): Promise<Group | null> {
  const ref = doc(db(), GROUPS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return null;
  }
  return mapGroup(snap.id, snap.data() as Record<string, unknown>);
}

export async function searchGroups(filters: {
  name?: string;
  code?: string;
  typeId?: string;
}): Promise<Group[]> {
  const all = await listGroups();
  const n = (filters.name ?? '').toLowerCase().trim();
  const c = (filters.code ?? '').toLowerCase().trim();
  return all.filter((g) => {
    if (filters.typeId && g.typeId !== filters.typeId) {
      return false;
    }
    if (n && !g.name.toLowerCase().includes(n)) {
      return false;
    }
    if (c && !g.code.toLowerCase().includes(c)) {
      return false;
    }
    return true;
  });
}

export type GroupCreate = Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'feedbackSum' | 'feedbackCount'>;
export type GroupUpdate = Partial<
  Pick<
    Group,
    | 'name'
    | 'mission'
    | 'vision'
    | 'photoUrl'
    | 'isAvailable'
    | 'typeId'
    | 'code'
    | 'leaderName'
    | 'participantNames'
  >
>;

export async function createGroup(
  data: GroupCreate & { memberCount?: number },
): Promise<string> {
  const col = collection(db(), GROUPS);
  const ref = await addDoc(col, {
    typeId: data.typeId,
    code: data.code,
    name: data.name,
    mission: data.mission,
    vision: data.vision,
    photoUrl: data.photoUrl ?? null,
    isAvailable: data.isAvailable,
    memberCount: data.memberCount ?? 0,
    leaderName: data.leaderName ?? null,
    participantNames: data.participantNames ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateGroup(id: string, data: GroupUpdate): Promise<void> {
  const ref = doc(db(), GROUPS, id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() } as Record<string, unknown>);
}

export async function removeGroup(id: string): Promise<void> {
  await deleteDoc(doc(db(), GROUPS, id));
}

export async function groupsByType(typeId: string): Promise<Group[]> {
  const q = query(collection(db(), GROUPS), where('typeId', '==', typeId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapGroup(d.id, d.data() as Record<string, unknown>));
}
