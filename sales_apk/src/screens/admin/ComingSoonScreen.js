import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ComingSoonScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { title } = route.params || { title: 'Module' };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="construct-outline" size={80} color="#0062E1" />
        </View>
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>
          We are currently working on the {title} module. Stay tuned for updates!
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingBottom: 16, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  iconContainer: {
    width: 150, height: 150, borderRadius: 75, backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center', marginBottom: 30
  },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 12 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  btn: {
    backgroundColor: '#0062E1', paddingHorizontal: 40, paddingHeight: 52,
    height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', ...SHADOWS.medium
  },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }
});
