import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import { listGroups } from '../repositories/groupRepository';
import { navigateFromTabs } from '../navigation/helpers';
import type { Group } from '../domain/types';

export function HomeScreen() {
  const nav = useNavigation<NavigationProp<ParamListBase>>();
  const [items, setItems] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const g = await listGroups();
      setItems(g);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.h}>Agrupaciones</Text>
      <FlatList
        data={items}
        keyExtractor={(g) => g.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigateFromTabs(nav, 'GroupDetail', { groupId: item.id })}
          >
            <Text style={styles.code}>{item.code}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sub}>
              {item.isAvailable ? 'Disponible' : 'No disponible'} · {item.memberCount} miembros
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay grupos. Un admin puede crearlos.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#f0f0f0', padding: 12 },
  h: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  code: { fontSize: 12, color: '#6c757d' },
  name: { fontSize: 18, fontWeight: '600' },
  sub: { fontSize: 13, color: '#666', marginTop: 4 },
  empty: { textAlign: 'center', color: '#666', marginTop: 24 },
});
