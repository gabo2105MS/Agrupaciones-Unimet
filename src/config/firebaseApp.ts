import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { getFirebaseOptions, isFirebaseConfigured } from './env';

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

/**
 * Singleton: una sola instancia de FirebaseApp en la app.
 * No inicializar Firebase si no hay .env; las pantallas deben comprobar isFirebaseConfigured() antes.
 */
export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado. Revisa src/config/env.ts y tu archivo .env.');
  }
  if (!appInstance) {
    if (getApps().length === 0) {
      appInstance = initializeApp(getFirebaseOptions());
    } else {
      appInstance = getApp();
    }
  }
  return appInstance;
}

export function getFirebaseAuthInstance(): Auth {
  if (authInstance) {
    return authInstance;
  }
  const app = getFirebaseApp();
  if (Platform.OS === 'web') {
    authInstance = getAuth(app);
    return authInstance;
  }
  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    authInstance = getAuth(app);
  }
  return authInstance;
}

export function getFirebaseDb(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp());
  }
  return firestoreInstance;
}

export function getFirebaseStorageInstance(): FirebaseStorage {
  if (!storageInstance) {
    storageInstance = getStorage(getFirebaseApp());
  }
  return storageInstance;
}

export { isFirebaseConfigured } from './env';
