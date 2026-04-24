/**
 * firebase/auth fija tipos hacia el entry web; en runtime (Metro) se usa el bundle
 * de @firebase/auth para react-native, donde sí existe getReactNativePersistence.
 */
import type { Persistence } from 'firebase/auth';

type AsyncStorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

declare module 'firebase/auth' {
  export function getReactNativePersistence(
    storage: AsyncStorageLike,
  ): Persistence;
}
