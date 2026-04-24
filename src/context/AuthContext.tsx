import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '../config';
import {
  loadSession,
  loginWithEmail,
  logoutAuth,
  registerWithEmail,
  signInWithFacebookToken,
  signInWithGoogleIdToken,
  subscribeAuth,
} from '../services/authService';
import type { UserProfile } from '../domain/types';

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  ready: boolean;
  error: string | null;
};

type AuthValue = AuthState & {
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signInGoogleIdToken: (idToken: string | undefined) => Promise<void>;
  signInFacebookAccessToken: (accessToken: string | undefined) => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): React.ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyUser = useCallback(async (u: User | null) => {
    setUser(u);
    if (!u) {
      setProfile(null);
      return;
    }
    const s = await loadSession(u);
    setProfile(s.profile);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setReady(true);
      return;
    }
    const unsub = subscribeAuth((u) => {
      void applyUser(u).finally(() => setReady(true));
    });
    return unsub;
  }, [applyUser]);

  const login = useCallback(async (email: string, pass: string) => {
    setError(null);
    try {
      await loginWithEmail(email, pass);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al iniciar sesión');
      throw e;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, pass: string) => {
    setError(null);
    try {
      await registerWithEmail(name, email, pass);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al registrarse');
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    await logoutAuth();
  }, []);

  const signInGoogleIdToken = useCallback(async (idToken: string | undefined) => {
    setError(null);
    try {
      await signInWithGoogleIdToken(idToken);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error con Google');
      throw e;
    }
  }, []);

  const signInFacebookAccessToken = useCallback(async (accessToken: string | undefined) => {
    setError(null);
    try {
      await signInWithFacebookToken(accessToken);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error con Facebook');
      throw e;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const s = await loadSession(user);
      setProfile(s.profile);
    }
  }, [user]);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      profile,
      ready,
      error,
      login,
      register,
      logout,
      signInGoogleIdToken,
      signInFacebookAccessToken,
      clearError,
      refreshProfile,
    }),
    [
      user,
      profile,
      ready,
      error,
      login,
      register,
      logout,
      signInGoogleIdToken,
      signInFacebookAccessToken,
      clearError,
      refreshProfile,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuthContext(): AuthValue {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return v;
}
