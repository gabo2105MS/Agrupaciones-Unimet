import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthContext } from '../../context/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register, error, clearError } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (pass.length < 6) {
      return;
    }
    clearError();
    setLoading(true);
    try {
      await register(name.trim() || 'Usuario', email.trim(), pass);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      {error ? <Text style={styles.err}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
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
        placeholder="Contraseña (mín. 6 caracteres)"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
      />
      <Pressable
        style={[styles.btn, loading && styles.btnDis]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Registrarse</Text>}
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Ya tengo cuenta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  btn: { backgroundColor: '#198754', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnDis: { opacity: 0.6 },
  btnText: { color: '#fff', fontWeight: '600' },
  err: { color: '#b02', marginBottom: 10 },
  link: { color: '#0d6efd', marginTop: 20, textAlign: 'center' },
});
