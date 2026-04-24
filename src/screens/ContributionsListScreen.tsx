import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthContext } from '../context/AuthContext';
import { getGroup } from '../repositories/groupRepository';
import { listContributionsByUser } from '../repositories/contributionRepository';
import type { Contribution, Group } from '../domain/types';

type Row = Contribution & { groupName?: string };

export function ContributionsListScreen() {
  const { user } = useAuthContext();
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    if (!user) {
      return;
    }
    const list = await listContributionsByUser(user.uid);
    const withNames: Row[] = [];
    for (const c of list) {
      const g = await getGroup(c.groupId);
      withNames.push({ ...c, groupName: g?.name ?? c.groupId });
    }
    setRows(withNames);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <View style={styles.box}>
      <Text style={styles.t}>Tus contribuciones</Text>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.n}>{item.groupName}</Text>
            <Text>
              {item.amount} {item.currency} · {item.status}
            </Text>
            <Text style={styles.d}>
              {item.createdAt?.toDate
                ? item.createdAt.toDate().toLocaleString()
                : '—'}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Sin contribuciones aún</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 12 },
  t: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  n: { fontWeight: '600' },
  d: { fontSize: 12, color: '#666' },
  empty: { textAlign: 'center', color: '#888' },
});
