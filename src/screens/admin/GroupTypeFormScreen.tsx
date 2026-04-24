import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { getGroupType, createGroupType, updateGroupType } from '../../repositories/groupTypeRepository';
import type { AppStackParamList } from '../../navigation/types';

type R = RouteProp<AppStackParamList, 'GroupTypeForm'>;

export function GroupTypeFormScreen() {
  const { params } = useRoute<R>();
  const nav = useNavigation();
  const id = params?.typeId;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [load, setLoad] = useState(!!id);

  useEffect(() => {
    if (!id) {
      setLoad(false);
      return;
    }
    void (async () => {
      const t = await getGroupType(id);
      if (t) {
        setName(t.name);
        setDescription(t.description ?? '');
      }
      setLoad(false);
    })();
  }, [id]);

  const save = async () => {
    if (!name.trim()) {
      return;
    }
    try {
      if (id) {
        await updateGroupType(id, { name: name.trim(), description: description.trim() || undefined });
      } else {
        await createGroupType({ name: name.trim(), description: description.trim() || undefined });
      }
      Alert.alert('Listo', 'Tipo guardado');
      nav.goBack();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo guardar');
    }
  };

  if (load) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.box}>
      <Text style={styles.t}>{id ? 'Editar tipo' : 'Nuevo tipo'}</Text>
      <TextInput style={styles.in} value={name} onChangeText={setName} placeholder="Nombre" />
      <TextInput
        style={[styles.in, styles.mult]}
        value={description}
        onChangeText={setDescription}
        placeholder="Descripción"
        multiline
      />
      <Pressable style={styles.btn} onPress={save}>
        <Text style={styles.btnT}>Guardar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 16 },
  t: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  in: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 },
  mult: { minHeight: 80, textAlignVertical: 'top' },
  btn: { backgroundColor: '#0d6efd', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnT: { color: '#fff', fontWeight: '600' },
});
