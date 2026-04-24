import { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { navigateFromTabs } from '../../navigation/helpers';
import { listGroupTypes } from '../../repositories/groupTypeRepository';
import { listGroups } from '../../repositories/groupRepository';
import { deleteGroupIfNoMembers, deleteTypeIfNoGroups } from '../../services/adminService';
import { seedIfAllowed } from '../../services/seedService';
import { useAuthContext } from '../../context/AuthContext';
import type { GroupType, Group } from '../../domain/types';
import { isSeedEnabled } from '../../config/envExtra';

export function AdminScreen() {
  const nav = useNavigation<NavigationProp<ParamListBase>>();
  const { user, profile } = useAuthContext();
  const [types, setTypes] = useState<GroupType[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setTypes(await listGroupTypes());
    setGroups(await listGroups());
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (profile?.role !== 'admin' || !user) {
    return (
      <View style={styles.centered}>
        <Text>No tienes permisos de administrador (configura EXPO_PUBLIC_ADMIN_EMAILS o asigna rol en Firestore).</Text>
      </View>
    );
  }

  const onSeed = async () => {
    if (!user.email) {
      return;
    }
    const m = await seedIfAllowed(user.uid, user.email);
    setMsg(m);
    if (m) {
      void load();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {msg ? <Text style={styles.msg}>{msg}</Text> : null}
      {isSeedEnabled() ? (
        <Pressable style={styles.seed} onPress={onSeed}>
          <Text style={styles.seedT}>Cargar datos de demostración (si no hay grupos)</Text>
        </Pressable>
      ) : null}
      <View style={styles.row}>
        <Text style={styles.h}>Tipos de agrupación</Text>
        <Pressable onPress={() => navigateFromTabs(nav, 'GroupTypeForm', {})}>
          <Text style={styles.add}>+ Nuevo</Text>
        </Pressable>
      </View>
      {loading ? <ActivityIndicator /> : null}
      {types.map((t) => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.n}>{t.name}</Text>
          <View style={styles.row}>
            <Pressable
              onPress={() => navigateFromTabs(nav, 'GroupTypeForm', { typeId: t.id })}
            >
              <Text style={styles.link}>Editar</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                try {
                  await deleteTypeIfNoGroups(t.id);
                  void load();
                } catch (e) {
                  Alert.alert('Error', e instanceof Error ? e.message : 'No se puede borrar');
                }
              }}
            >
              <Text style={styles.danger}>Borrar</Text>
            </Pressable>
          </View>
        </View>
      ))}
      <View style={[styles.row, { marginTop: 20 }]}>
        <Text style={styles.h}>Agrupaciones</Text>
        <Pressable onPress={() => navigateFromTabs(nav, 'GroupForm', {})}>
          <Text style={styles.add}>+ Nueva</Text>
        </Pressable>
      </View>
      {groups.map((g) => (
        <View key={g.id} style={styles.card}>
          <Text>
            {g.code} — {g.name} ({g.memberCount} miembros)
          </Text>
          <View style={styles.row}>
            <Pressable
              onPress={() => navigateFromTabs(nav, 'GroupForm', { groupId: g.id })}
            >
              <Text style={styles.link}>Editar</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                try {
                  await deleteGroupIfNoMembers(g.id);
                  void load();
                } catch (e) {
                  Alert.alert('Error', e instanceof Error ? e.message : 'No se puede borrar');
                }
              }}
            >
              <Text style={styles.danger}>Borrar</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, paddingBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h: { fontSize: 18, fontWeight: '600' },
  add: { color: '#0d6efd' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 8 },
  n: { fontWeight: '600' },
  link: { color: '#0d6efd', marginRight: 16 },
  danger: { color: '#b02' },
  centered: { flex: 1, justifyContent: 'center', padding: 20 },
  msg: { backgroundColor: '#d1e7dd', padding: 8, borderRadius: 6, marginBottom: 8 },
  seed: { backgroundColor: '#fff3cd', padding: 10, borderRadius: 6, marginBottom: 10 },
  seedT: { color: '#664d03' },
});
