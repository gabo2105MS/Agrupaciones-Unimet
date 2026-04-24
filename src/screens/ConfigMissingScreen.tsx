import { View, Text, StyleSheet } from 'react-native';

export function ConfigMissingScreen() {
  return (
    <View style={styles.box}>
      <Text style={styles.t}>Agrupaciones Unimet</Text>
      <Text style={styles.p}>
        Copia .env.example a .env y completa las claves de Firebase.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8f9fa' },
  t: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  p: { color: '#444', lineHeight: 22 },
});
