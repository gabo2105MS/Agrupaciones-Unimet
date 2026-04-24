import { getGroup, removeGroup, groupsByType } from '../repositories/groupRepository';
import { removeGroupType } from '../repositories/groupTypeRepository';

export async function deleteGroupIfNoMembers(groupId: string): Promise<void> {
  const g = await getGroup(groupId);
  if (!g) {
    throw new Error('Grupo no encontrado');
  }
  if (g.memberCount > 0) {
    throw new Error('No se puede eliminar: hay miembros activos');
  }
  await removeGroup(groupId);
}

export async function deleteTypeIfNoGroups(typeId: string): Promise<void> {
  const groups = await groupsByType(typeId);
  if (groups.length > 0) {
    throw new Error('Elimina o reasigna los grupos de este tipo primero');
  }
  await removeGroupType(typeId);
}
