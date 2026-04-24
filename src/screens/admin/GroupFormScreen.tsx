import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { getGroup, createGroup, updateGroup } from '../../repositories/groupRepository';
import { listGroupTypes } from '../../repositories/groupTypeRepository';
import type { AppStackParamList } from '../../navigation/types';
import type { GroupType } from '../../domain/types';

type R = RouteProp<AppStackParamList, 'GroupForm'>;

export function GroupFormScreen() {
  const { params } = useRoute<R>();
  const nav = useNavigation();
  const id = params?.groupId;
  const [types, setTypes] = useState<GroupType[]>([]);
  const [typeId, setTypeId] = useState<string>('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [participantNames, setParticipantNames] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [load, setLoad] = useState(!!id);

  useEffect(() => {
    void listGroupTypes().then((t) => {
      setTypes(t);
      if (t[0] && !id) {
        setTypeId(t[0].id);
      }
    });
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLoad(false);
      return;
    }
    void (async () => {
      const g = await getGroup(id);
      if (g) {
        setTypeId(g.typeId);
        setCode(g.code);
        setName(g.name);
        setMission(g.mission);
        setVision(g.vision);
        setLeaderName(g.leaderName ?? '');
        setParticipantNames(g.participantNames ?? '');
        setIsAvailable(g.isAvailable);
      }
      setLoad(false);
    })();
  }, [id]);

  const save = async () => {
    if (!typeId || !code.trim() || !name.trim()) {
      Alert.alert('Faltan datos', 'Tipo, identificador y nombre son obligatorios');
      return;
    }
    try {
      if (id) {
        await updateGroup(id, {
          typeId,
          code: code.trim(),
          name: name.trim(),
          mission: mission.trim(),
          vision: vision.trim(),
          leaderName: leaderName.trim() || undefined,
          participantNames: participantNames.trim() || undefined,
          isAvailable,
        });
      } else {
        await createGroup({
          typeId,
          code: code.trim(),
          name: name.trim(),
          mission: mission.trim(),
          vision: vision.trim(),
          leaderName: leaderName.trim() || undefined,
          participantNames: participantNames.trim() || undefined,
          isAvailable,
        });
      }
      Alert.alert('Listo', 'Grupo guardado');
      nav.goBack();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo guardar');
    }
  };

  if (load) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.box}>
      <Text style={styles.t}>{id ? 'Editar agrupación' : 'Nueva agrupación'}</Text>
      <Text>Tipos: usa chips en consola o elija — aquí toma el primero y puedes tocar de lista simple.</Text>
      {types.map((t) => (
        <Pressable
          key={t.id}
          style={[styles.typeChip, typeId === t.id && styles.typeOn]}
          onPress={() => setTypeId(t.id)}
        >
          <Text>{t.name}</Text>
        </Pressable>
      ))}
      <TextInput style={styles.in} value={code} onChangeText={setCode} placeholder="Identificador (ej. MT-01)" />
      <TextInput style={styles.in} value={name} onChangeText={setName} placeholder="Nombre" />
      <TextInput
        style={[styles.in, styles.mult]}
        value={mission}
        onChangeText={setMission}
        placeholder="Misión"
        multiline
      />
      <TextInput
        style={[styles.in, styles.mult]}
        value={vision}
        onChangeText={setVision}
        placeholder="Visión"
        multiline
      />
      <TextInput
        style={styles.in}
        value={leaderName}
        onChangeText={setLeaderName}
        placeholder="Nombre líder (opcional)"
      />
      <TextInput
        style={styles.in}
        value={participantNames}
        onChangeText={setParticipantNames}
        placeholder="Participantes (texto, opcional)"
      />
      <Pressable
        style={styles.typeChip}
        onPress={() => setIsAvailable((v) => !v)}
      >
        <Text>Disponible: {isAvailable ? 'Sí' : 'No'}</Text>
      </Pressable>
      <Pressable style={styles.btn} onPress={save}>
        <Text style={styles.btnT}>Guardar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: { padding: 16, paddingBottom: 40 },
  t: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  in: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 8 },
  mult: { minHeight: 70, textAlignVertical: 'top' },
  typeChip: { marginTop: 6, padding: 8, backgroundColor: '#e9ecef', borderRadius: 6, alignSelf: 'flex-start' },
  typeOn: { backgroundColor: '#cfe2ff' },
  btn: { backgroundColor: '#0d6efd', padding: 12, borderRadius: 8, marginTop: 12, alignItems: 'center' },
  btnT: { color: '#fff', fontWeight: '600' },
});
