import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRoute, type RouteProp, useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../context/AuthContext';
import { addFeedback } from '../services/feedbackService';
import type { AppStackParamList } from '../navigation/types';

type R = RouteProp<AppStackParamList, 'Feedback'>;

export function FeedbackScreen() {
  const { params } = useRoute<R>();
  const nav = useNavigation();
  const { user } = useAuthContext();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const groupId = params?.groupId;

  const submit = async () => {
    if (!user || !groupId) {
      return;
    }
    setBusy(true);
    try {
      await addFeedback(user.uid, groupId, text);
      Alert.alert('Gracias', 'Tu comentario fue publicado.');
      setText('');
      nav.goBack();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo enviar');
    } finally {
      setBusy(false);
    }
  };

  if (!groupId) {
    return null;
  }

  return (
    <View style={styles.box}>
      <Text style={styles.t}>Feedback</Text>
      <TextInput
        style={styles.area}
        multiline
        placeholder="Escribe tu experiencia con la agrupación"
        value={text}
        onChangeText={setText}
      />
      <Pressable
        style={[styles.btn, busy && styles.dis]}
        onPress={submit}
        disabled={busy}
      >
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnT}>Enviar</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 16 },
  t: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  area: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
  },
  btn: { backgroundColor: '#0d6efd', marginTop: 12, padding: 14, borderRadius: 8, alignItems: 'center' },
  btnT: { color: '#fff', fontWeight: '600' },
  dis: { opacity: 0.6 },
});
