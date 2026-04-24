import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRoute, type RouteProp, useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../context/AuthContext';
import {
  recordSimulatedContribution,
  startPayPalContribution,
  openPayPalApproval,
} from '../services/contributionService';
import type { AppStackParamList } from '../navigation/types';

type R = RouteProp<AppStackParamList, 'Contribute'>;

export function ContributeScreen() {
  const { params } = useRoute<R>();
  const nav = useNavigation();
  const { user } = useAuthContext();
  const [amount, setAmount] = useState('10');
  const [busy, setBusy] = useState(false);
  const groupId = params?.groupId;

  const pay = async () => {
    if (!user || !groupId) {
      return;
    }
    const n = parseFloat(amount.replace(',', '.'));
    if (Number.isNaN(n) || n <= 0) {
      Alert.alert('Monto', 'Indica un monto válido');
      return;
    }
    setBusy(true);
    try {
      const res = await startPayPalContribution(user.uid, groupId, n, 'USD');
      if ('simulated' in res && res.simulated) {
        await recordSimulatedContribution(user.uid, groupId, n, 'USD');
        Alert.alert('Listo (demo)', 'Contribución simulada registrada. Con PayPal en producción use Cloud Functions.');
        nav.goBack();
        return;
      }
      const order = res as { approvalUrl: string; orderId: string };
      if (order.approvalUrl) {
        const web = await openPayPalApproval(order.approvalUrl);
        if (web && typeof web === 'object' && 'type' in web && web.type === 'success' && 'url' in web) {
          await recordSimulatedContribution(user.uid, groupId, n, 'USD');
        }
        nav.goBack();
      }
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Pago no completado');
    } finally {
      setBusy(false);
    }
  };

  if (!groupId) {
    return null;
  }

  return (
    <View style={styles.box}>
      <Text style={styles.t}>Contribuir</Text>
      <Text style={styles.p}>Monto (USD, ejemplo)</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />
      <Pressable
        style={[styles.btn, busy && styles.dis]}
        onPress={pay}
        disabled={busy}
      >
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnT}>Pagar (PayPal o demo)</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 16 },
  t: { fontSize: 20, fontWeight: '600' },
  p: { marginTop: 8, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 8, fontSize: 18 },
  btn: { backgroundColor: '#0d6efd', marginTop: 16, padding: 14, borderRadius: 8, alignItems: 'center' },
  btnT: { color: '#fff', fontWeight: '600' },
  dis: { opacity: 0.6 },
});
