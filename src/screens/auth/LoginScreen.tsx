import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { useAuthContext } from '../../context/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

WebBrowser.maybeCompleteAuthSession();

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login, signInGoogleIdToken, signInFacebookAccessToken, error, clearError } = useAuthContext();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const webId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const [, googleResponse, promptGoogle] = Google.useIdTokenAuthRequest(
    {
      clientId: webId ?? 'placeholder',
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    },
  );

  const fbId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;
  const [, fbResponse, promptFacebook] = Facebook.useAuthRequest({
    clientId: fbId || '0',
  });

  useEffect(() => {
    (async () => {
      if (googleResponse?.type === 'success') {
        setLoading(true);
        try {
          const p = googleResponse.params as { id_token?: string };
          await signInGoogleIdToken(p.id_token);
        } finally {
          setLoading(false);
        }
      } else if (googleResponse?.type === 'error') {
        setLoading(false);
      }
    })();
  }, [googleResponse, signInGoogleIdToken]);

  useEffect(() => {
    (async () => {
      if (fbResponse?.type === 'success' && 'access_token' in fbResponse.params) {
        setLoading(true);
        try {
          const token = fbResponse.params.access_token;
          await signInFacebookAccessToken(
            Array.isArray(token) ? token[0] : token,
          );
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [fbResponse, signInFacebookAccessToken]);

  const onEmailLogin = async () => {
    clearError();
    setLoading(true);
    try {
      await login(email.trim(), pass);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      {error ? <Text style={styles.err}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Correo"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />
      <Pressable
        style={[styles.btn, loading && styles.btnDis]}
        onPress={onEmailLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Entrar</Text>}
      </Pressable>
      {webId ? (
        <Pressable
          style={styles.outline}
          onPress={() => {
            setLoading(true);
            void promptGoogle().finally(() => setLoading(false));
          }}
          disabled={loading}
        >
          <Text style={styles.outlineText}>Google</Text>
        </Pressable>
      ) : null}
      {fbId ? (
        <Pressable
          style={styles.outline}
          onPress={() => {
            setLoading(true);
            void promptFacebook().finally(() => setLoading(false));
          }}
          disabled={loading}
        >
          <Text style={styles.outlineText}>Facebook</Text>
        </Pressable>
      ) : null}
      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Crear cuenta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#0d6efd', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnDis: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '600' },
  err: { color: '#b02', marginBottom: 10 },
  outline: {
    borderWidth: 1,
    borderColor: '#0d6efd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  outlineText: { color: '#0d6efd', fontWeight: '600' },
  link: { color: '#0d6efd', marginTop: 20, textAlign: 'center' },
});
