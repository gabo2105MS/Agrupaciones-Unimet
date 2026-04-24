import type { FirebaseOptions } from 'firebase/app';

/**
 * Configuración leída desde variables EXPO_PUBLIC_* (ver .env.example).
 * Expo inyecta estas variables en tiempo de build.
 */
function readRawConfig(): FirebaseOptions {
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
  };
}

export function isFirebaseConfigured(): boolean {
  const c = readRawConfig();
  return Boolean(c.apiKey && c.projectId && c.appId);
}

export function getFirebaseOptions(): FirebaseOptions {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Falta configurar Firebase. Copia .env.example a .env y completa EXPO_PUBLIC_FIREBASE_*.',
    );
  }
  return readRawConfig();
}
