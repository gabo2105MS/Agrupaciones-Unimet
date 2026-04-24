import { useEffect, useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import { navigateFromTabs } from '../navigation/helpers';
import { searchGroups } from '../repositories/groupRepository';
import { listGroupTypes } from '../repositories/groupTypeRepository';
import type { Group, GroupType } from '../domain/types';

export function SearchScreen() {
  const nav = useNavigation<NavigationProp<ParamListBase>>();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [typeId, setTypeId] = useState<string | undefined>(undefined);
  const [types, setTypes] = useState<GroupType[]>([]);
  const [items, setItems] = useState<Group[]>([]);

  useEffect(() => {
    void listGroupTypes().then(setTypes);
  }, []);

  const run = () => {
    void searchGroups({ name, code, typeId }).then(setItems);
  };

  const filtered = useMemo(() => items, [items]);

  return (
    <View style={styles.wrap}>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.form}>
        <Text style={styles.h}>Búsqueda</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Identificador (código)"
          value={code}
          onChangeText={setCode}
        />
        <Text style={styles.label}>Tipo (opcional)</Text>
        <View style={styles.chips}>
          <Pressable
            style={[styles.chip, !typeId && styles.chipOn]}
            onPress={() => setTypeId(undefined)}
          >
            <Text style={styles.chipT}>Todos</Text>
          </Pressable>
          {types.map((t) => (
            <Pressable
              key={t.id}
              style={[styles.chip, typeId === t.id && styles.chipOn]}
              onPress={() => setTypeId(t.id)}
            >
              <Text style={styles.chipT}>{t.name}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.btn} onPress={run}>
          <Text style={styles.btnT}>Buscar</Text>
        </Pressable>
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={(g) => g.id}
        style={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigateFromTabs(nav, 'GroupDetail', { groupId: item.id })}
          >
            <Text style={styles.code}>{item.code}</Text>
            <Text style={styles.gname}>{item.name}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Busca para ver resultados</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#f0f0f0' },
  form: { padding: 12, maxHeight: 280 },
  h: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
  label: { fontSize: 13, color: '#555', marginBottom: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#e9ecef', marginRight: 6, marginBottom: 6 },
  chipOn: { backgroundColor: '#cfe2ff' },
  chipT: { fontSize: 13 },
  btn: { backgroundColor: '#0d6efd', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnT: { color: '#fff', fontWeight: '600' },
  list: { flex: 1, padding: 12 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  code: { color: '#6c757d', fontSize: 12 },
  gname: { fontSize: 16, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
});
