import { createGroup, listGroups } from '../repositories/groupRepository';
import { createGroupType, listGroupTypes } from '../repositories/groupTypeRepository';
import { isSeedEnabled } from '../config/envExtra';
import { getUserProfile, updateUserProfile } from '../repositories/userRepository';

const TYPE_TECH = { name: 'Tecnología', description: 'Grupos de tecnología e ingeniería' };
const TYPE_CULTURE = { name: 'Cultura', description: 'Cultura y arte' };

/**
 * Crea tipos y grupos de demostración si el perfil es admin, EXPO_PUBLIC_ENABLE_SEED=true y aún no hay grupos.
 */
export async function seedIfAllowed(uid: string, email: string): Promise<string | null> {
  if (!isSeedEnabled()) {
    return null;
  }
  const prof = await getUserProfile(uid);
  if (prof?.role !== 'admin') {
    return null;
  }
  const types = await listGroupTypes();
  const groups = await listGroups();
  if (groups.length > 0) {
    return 'Ya existen grupos. No se insertó semilla.';
  }
  const t1 = types.find((t) => t.name === TYPE_TECH.name);
  const t2 = types.find((t) => t.name === TYPE_CULTURE.name);
  const typeTechId = t1 ? t1.id : await createGroupType(TYPE_TECH);
  const typeCultureId = t2 ? t2.id : await createGroupType(TYPE_CULTURE);
  await createGroup({
    typeId: typeTechId,
    code: 'MT-01',
    name: 'MetroTech',
    mission: 'Contribuir con el aprendizaje de lenguajes de programación en la UNIMET.',
    vision: 'Ser referencia en actividades de programación en la universidad.',
    isAvailable: true,
    memberCount: 0,
    leaderName: 'Coordinación MetroTech',
    participantNames: 'Miembros del equipo (ejemplo de datos)',
  });
  await createGroup({
    typeId: typeCultureId,
    code: 'CU-01',
    name: 'Agrupación Cultural (demo)',
    mission: 'Promover la cultura en el campus.',
    vision: 'Comunidad activa y colaborativa.',
    isAvailable: true,
    memberCount: 0,
  });
  return 'Datos de ejemplo creados (tipos y grupos de demostración).';
}

export async function promoteAdminIfListed(uid: string, email: string): Promise<void> {
  const raw = process.env.EXPO_PUBLIC_ADMIN_EMAILS?.trim();
  if (!raw) {
    return;
  }
  const set = new Set(
    raw.split(/[\s,;]+/).map((e: string) => e.toLowerCase().trim()).filter(Boolean),
  );
  if (!set.has(email.toLowerCase())) {
    return;
  }
  const p = await getUserProfile(uid);
  if (p?.role === 'admin') {
    return;
  }
  await updateUserProfile(uid, { role: 'admin' });
}
