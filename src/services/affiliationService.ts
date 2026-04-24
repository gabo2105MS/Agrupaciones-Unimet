import { createAffiliation, getAffiliation } from '../repositories/affiliationRepository';
import { getGroup } from '../repositories/groupRepository';
import { listGroupsByUserId } from './userGroupsService';

export async function joinGroup(userId: string, groupId: string): Promise<void> {
  const group = await getGroup(groupId);
  if (!group) {
    throw new Error('Grupo no encontrado');
  }
  if (!group.isAvailable) {
    throw new Error('Esta agrupación no acepta nuevas afiliaciones');
  }
  const existing = await getAffiliation(userId, groupId);
  if (existing) {
    return;
  }
  await createAffiliation(userId, groupId);
}

export { getAffiliation } from '../repositories/affiliationRepository';

export async function listUserGroupIds(userId: string): Promise<string[]> {
  return listGroupsByUserId(userId);
}
