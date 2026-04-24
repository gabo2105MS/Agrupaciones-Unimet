import { getAffiliation } from '../repositories/affiliationRepository';
import { addFeedback as addFeedbackRepo, listFeedbackForGroup } from '../repositories/feedbackRepository';

export async function addFeedback(
  userId: string,
  groupId: string,
  comment: string,
): Promise<void> {
  if (!comment.trim()) {
    throw new Error('Escribe un comentario');
  }
  const aff = await getAffiliation(userId, groupId);
  if (!aff) {
    throw new Error('Solo los miembros afiliados pueden dejar comentarios');
  }
  await addFeedbackRepo(userId, groupId, comment);
}

export { listFeedbackForGroup };
