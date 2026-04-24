import { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { isFirebaseConfigured } from './src/config';

export default function App() {
  const status = useMemo(() => {
    if (!isFirebaseConfigured()) {
      return {
        ok: false,
        line: 'Copia .env.example a .env y completa las claves de Firebase (consola: Configuración del proyecto).',
      };
    }
    return {
      ok: true,
      line: 'Variables EXPO_PUBLIC_FIREBASE_* detectadas. La inicialización perezosa de Firebase ocurre al usar getFirebaseApp().',
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agrupaciones Unimet</Text>
      <Text style={styles.hint} accessibilityRole="text">
        {status.line}
      </Text>
      <Text style={styles.badge}>
        Firebase (env): {status.ok ? 'listo' : 'pendiente'}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  hint: {
    textAlign: 'center',
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
  },
  badge: {
    fontSize: 14,
    color: '#0d6efd',
  },
});
