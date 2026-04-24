import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useFocusEffect, useNavigation, type RouteProp } from '@react-navigation/native';
import { getGroup } from '../repositories/groupRepository';
import { useAuthContext } from '../context/AuthContext';
import { joinGroup, getAffiliation } from '../services/affiliationService';
import type { AppStackParamList } from '../navigation/types';
import type { Group } from '../domain/types';

type R = RouteProp<AppStackParamList, 'Affiliation'>;

export function AffiliationScreen() {
  const { params } = useRoute<R>();
  const nav = useNavigation();
  const { user } = useAuthContext();
  const [g, setG] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const groupId = params?.groupId;

  useFocusEffect(
    useCallback(() => {
      if (!groupId) {
        Alert.alert('Selecciona un grupo', 'Debes elegir un grupo primero (desde búsqueda o inicio).', [
          { text: 'OK', onPress: () => nav.goBack() },
        ]);
        return;
      }
      void (async () => {
        setLoading(true);
        const gr = await getGroup(groupId);
        setG(gr);
        setLoading(false);
      })();
    }, [groupId, nav]),
  );

  if (!groupId) {
    return null;
  }

  const onJoin = async () => {
    if (!user) {
      return;
    }
    setBusy(true);
    try {
      await joinGroup(user.uid, groupId);
      const aff = await getAffiliation(user.uid, groupId);
      if (aff) {
        Alert.alert('Éxito', 'Te has afiliado. Puedes dejar feedback desde el detalle del grupo.');
        nav.goBack();
      }
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo afiliar');
    } finally {
      setBusy(false);
    }
  };

  if (loading || !g) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <Text style={styles.t}>Afiliación a {g.name}</Text>
      <Text style={styles.p}>
        Tras unirte podrás dejar feedback y acceder a contribuciones, según las reglas del grupo.
      </Text>
      <Pressable
        style={[styles.btn, busy && styles.dis]}
        onPress={onJoin}
        disabled={busy}
      >
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnT}>Confirmar afiliación</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center' },
  box: { flex: 1, padding: 20 },
  t: { fontSize: 20, fontWeight: '600' },
  p: { marginTop: 8, lineHeight: 20, color: '#444' },
  btn: { backgroundColor: '#198754', marginTop: 20, padding: 14, borderRadius: 8, alignItems: 'center' },
  btnT: { color: '#fff', fontWeight: '600' },
  dis: { opacity: 0.7 },
});
