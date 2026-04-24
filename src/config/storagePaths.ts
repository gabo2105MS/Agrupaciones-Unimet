export function avatarPath(uid: string): string {
  return `avatars/${uid}/profile.jpg`;
}

export function groupImagePath(groupId: string): string {
  return `groupImages/${groupId}/cover.jpg`;
}
