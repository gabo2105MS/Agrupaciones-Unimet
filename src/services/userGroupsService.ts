import { listAffiliationsByUser } from '../repositories/affiliationRepository';

export async function listGroupsByUserId(userId: string): Promise<string[]> {
  const aff = await listAffiliationsByUser(userId);
  return aff.map((a) => a.groupId);
}
