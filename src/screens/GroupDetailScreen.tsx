import { useCallback, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation, type RouteProp, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getGroup } from '../repositories/groupRepository';
import { getGroupType } from '../repositories/groupTypeRepository';
import { getAffiliation } from '../repositories/affiliationRepository';
import { useAuthContext } from '../context/AuthContext';
import { listFeedbackForGroup } from '../services/feedbackService';
import type { AppStackParamList } from '../navigation/types';
import type { Group, GroupType, Feedback } from '../domain/types';

type R = RouteProp<AppStackParamList, 'GroupDetail'>;

export function GroupDetailScreen() {
  const { params } = useRoute<R>();
  const nav = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user } = useAuthContext();
  const [g, setG] = useState<Group | null>(null);
  const [t, setT] = useState<GroupType | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [feed, setFeed] = useState<Feedback[]>([]);

  const load = useCallback(async () => {
    if (!params?.groupId) {
      return;
    }
    const gr = await getGroup(params.groupId);
    setG(gr);
    if (gr) {
      const typ = await getGroupType(gr.typeId);
      setT(typ);
    }
    if (user && gr) {
      const a = await getAffiliation(user.uid, gr.id);
      setIsMember(!!a);
    }
    if (gr) {
      const f = await listFeedbackForGroup(gr.id);
      setFeed(f);
    }
  }, [params?.groupId, user]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  if (!g) {
    return (
      <View style={styles.centered}>
        <Text>Cargando…</Text>
      </View>
    );
  }

  const feedbackLabel = `${g.feedbackCount ?? 0} comentario(s) (ranking por actividad)`;

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {g.photoUrl ? (
        <Image source={{ uri: g.photoUrl }} style={styles.img} />
      ) : null}
      <Text style={styles.code}>{g.code}</Text>
      <Text style={styles.title}>{g.name}</Text>
      {t ? <Text style={styles.tipo}>Tipo: {t.name}</Text> : null}
      <Text style={styles.lbl}>Misión</Text>
      <Text style={styles.txt}>{g.mission}</Text>
      <Text style={styles.lbl}>Visión</Text>
      <Text style={styles.txt}>{g.vision}</Text>
      {g.leaderName ? (
        <>
          <Text style={styles.lbl}>Liderazgo</Text>
          <Text style={styles.txt}>{g.leaderName}</Text>
        </>
      ) : null}
      {g.participantNames ? (
        <>
          <Text style={styles.lbl}>Participantes</Text>
          <Text style={styles.txt}>{g.participantNames}</Text>
        </>
      ) : null}
      <Text style={styles.sub}>
        Estado: {g.isAvailable ? 'Disponible' : 'No disponible'} · {g.memberCount} miembros ·
        {feedbackLabel}
      </Text>
      {user && g.isAvailable && !isMember ? (
        <Pressable
          style={styles.btn}
          onPress={() => nav.navigate('Affiliation', { groupId: g.id })}
        >
          <Text style={styles.btnT}>Proceso de afiliación</Text>
        </Pressable>
      ) : null}
      {user && isMember ? (
        <Text style={styles.mem}>Ya formas parte de esta agrupación</Text>
      ) : null}
      {user && isMember ? (
        <>
          <Pressable
            style={styles.out}
            onPress={() => nav.navigate('Feedback', { groupId: g.id })}
          >
            <Text style={styles.outT}>Dar feedback</Text>
          </Pressable>
          <Pressable
            style={styles.out}
            onPress={() => nav.navigate('Contribute', { groupId: g.id })}
          >
            <Text style={styles.outT}>Contribuir</Text>
          </Pressable>
        </>
      ) : null}
      <Text style={styles.h2}>Comentarios</Text>
      {feed.map((x) => (
        <View key={x.id} style={styles.fcard}>
          <Text style={styles.fbody}>{x.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  wrap: { padding: 16, paddingBottom: 32 },
  img: { width: '100%', height: 180, borderRadius: 12, marginBottom: 8 },
  code: { color: '#6c757d' },
  title: { fontSize: 24, fontWeight: '700' },
  tipo: { color: '#0d6efd', marginBottom: 8 },
  lbl: { fontWeight: '600', marginTop: 8 },
  txt: { lineHeight: 22 },
  sub: { marginTop: 8, color: '#555' },
  btn: { backgroundColor: '#0d6efd', marginTop: 12, padding: 14, borderRadius: 8, alignItems: 'center' },
  btnT: { color: '#fff', fontWeight: '600' },
  out: { borderWidth: 1, borderColor: '#0d6efd', marginTop: 8, padding: 12, borderRadius: 8, alignItems: 'center' },
  outT: { color: '#0d6efd' },
  h2: { fontSize: 18, fontWeight: '600', marginTop: 20 },
  fcard: { backgroundColor: '#f1f3f5', padding: 10, borderRadius: 8, marginTop: 6 },
  fbody: { lineHeight: 20 },
  mem: { marginTop: 8, color: '#198754', fontWeight: '600' },
});
