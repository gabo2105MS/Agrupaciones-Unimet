import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateEmail as authUpdateEmail, updateProfile as authUpdateProfile } from 'firebase/auth';
import { getFirebaseAuthInstance, getFirebaseStorageInstance } from '../config';
import { updateUserProfile } from '../repositories/userRepository';
import { avatarPath } from '../config/storagePaths';

export async function uploadAvatarAndSaveUrl(
  uid: string,
  uri: string,
  mime: string,
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storage = getFirebaseStorageInstance();
  const path = avatarPath(uid);
  const r = ref(storage, path);
  await uploadBytes(
    r,
    blob,
    mime ? { contentType: mime } : undefined,
  );
  const url = await getDownloadURL(r);
  await updateUserProfile(uid, { photoUrl: url });
  return url;
}

export async function updateMyProfileData(
  uid: string,
  data: { displayName?: string; phone?: string; newEmail?: string },
): Promise<void> {
  const auth = getFirebaseAuthInstance();
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Sin sesión');
  }
  if (data.displayName) {
    await authUpdateProfile(user, { displayName: data.displayName });
  }
  if (data.newEmail && data.newEmail !== user.email) {
    await authUpdateEmail(user, data.newEmail);
  }
  await updateUserProfile(uid, {
    displayName: data.displayName,
    phone: data.phone,
    email: data.newEmail ?? user.email ?? undefined,
  });
}
