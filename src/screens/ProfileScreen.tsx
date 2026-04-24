import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  useNavigation,
  useFocusEffect,
  type NavigationProp,
  type ParamListBase,
} from '@react-navigation/native';
import { navigateFromTabs } from '../navigation/helpers';
import { useAuthContext } from '../context/AuthContext';
import { getGroup } from '../repositories/groupRepository';
import { listAffiliationsByUser } from '../repositories/affiliationRepository';
import { updateMyProfileData, uploadAvatarAndSaveUrl } from '../services/userProfileService';
import { promoteAdminIfListed } from '../services/seedService';
import type { Group } from '../domain/types';

export function ProfileScreen() {
  const nav = useNavigation<NavigationProp<ParamListBase>>();
  const { user, profile, refreshProfile, clearError, logout } = useAuthContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [saving, setSaving] = useState(false);
  const [affGroups, setAffGroups] = useState<Group[]>([]);
  const [loadingAff, setLoadingAff] = useState(true);

  const loadAff = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoadingAff(true);
    const affs = await listAffiliationsByUser(user.uid);
    const grs: Group[] = [];
    for (const a of affs) {
      const g = await getGroup(a.groupId);
      if (g) {
        grs.push(g);
      }
    }
    setAffGroups(grs);
    setLoadingAff(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (profile) {
        setName(profile.displayName);
        setPhone(profile.phone ?? '');
        setEmailEdit(profile.email);
      }
      if (user?.email) {
        void promoteAdminIfListed(user.uid, user.email!);
        void refreshProfile();
      }
      void loadAff();
    }, [profile, user, loadAff, refreshProfile]),
  );

  const onSave = async () => {
    if (!user) {
      return;
    }
    clearError();
    setSaving(true);
    try {
      await updateMyProfileData(user.uid, {
        displayName: name,
        phone,
        newEmail: emailEdit !== user.email ? emailEdit : undefined,
      });
      await refreshProfile();
      Alert.alert('Perfil', 'Cambios guardados');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo actualizar (email requiere re-login reciente a veces)');
    } finally {
      setSaving(false);
    }
  };

  const pick = async () => {
    if (!user) {
      return;
    }
    const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!p.granted) {
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images' });
    if (res.canceled) {
      return;
    }
    const asset = res.assets[0];
    setSaving(true);
    try {
      await uploadAvatarAndSaveUrl(user.uid, asset.uri, asset.mimeType ?? 'image/jpeg');
      await refreshProfile();
    } finally {
      setSaving(false);
    }
  };

  if (!user || !profile) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      {profile.photoUrl ? (
        <Image source={{ uri: profile.photoUrl }} style={styles.av} />
      ) : null}
      <Text style={styles.r}>Rol: {profile.role === 'admin' ? 'Administrador' : 'Estudiante'}</Text>
      <TextInput
        style={styles.in}
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
      />
      <TextInput
        style={styles.in}
        value={phone}
        onChangeText={setPhone}
        placeholder="Teléfono"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.in}
        value={emailEdit}
        onChangeText={setEmailEdit}
        autoCapitalize="none"
        placeholder="Correo"
      />
      <Pressable style={styles.btn} onPress={onSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnT}>Guardar</Text>}
      </Pressable>
      <Pressable style={styles.out} onPress={pick}>
        <Text style={styles.outT}>Cambiar foto</Text>
      </Pressable>
      <Text style={styles.s}>Agrupaciones a las que perteneces</Text>
      {loadingAff ? <ActivityIndicator /> : null}
      {affGroups.map((g) => (
        <Pressable
          key={g.id}
          style={styles.grow}
          onPress={() => navigateFromTabs(nav, 'GroupDetail', { groupId: g.id })}
        >
          <Text style={styles.gname}>
            {g.code} — {g.name}
          </Text>
        </Pressable>
      ))}
      <Pressable
        onPress={() => navigateFromTabs(nav, 'ContributionsList', undefined)}
        style={styles.out}
      >
        <Text style={styles.outT}>Historial de contribuciones</Text>
      </Pressable>
      <Pressable
        onPress={async () => {
          await logout();
        }}
        style={styles.logout}
      >
        <Text style={styles.logoutT}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, paddingBottom: 40 },
  av: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center' },
  r: { textAlign: 'center', marginBottom: 12, color: '#0d6efd' },
  in: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 },
  btn: { backgroundColor: '#0d6efd', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnT: { color: '#fff', fontWeight: '600' },
  out: { borderWidth: 1, borderColor: '#0d6efd', padding: 10, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  outT: { color: '#0d6efd' },
  s: { fontWeight: '600', marginTop: 20, marginBottom: 8 },
  grow: { backgroundColor: '#e9ecef', padding: 10, borderRadius: 6, marginBottom: 4 },
  gname: { fontSize: 15 },
  logout: { marginTop: 24, backgroundColor: '#6c757d', padding: 12, borderRadius: 8, alignItems: 'center' },
  logoutT: { color: '#fff', fontWeight: '600' },
});
