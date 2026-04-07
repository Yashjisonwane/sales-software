import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

/**
 * Shown on admin modules that still use demo data; clarifies server sync status for clients.
 */
export default function BusinessModuleBanner({ title = 'Preview', subtitle }) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} style={styles.icon} />
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  icon: { marginRight: 10, marginTop: 1 },
  textCol: { flex: 1 },
  title: { fontSize: 13, fontWeight: '700', color: '#1E3A8A' },
  sub: { fontSize: 12, color: '#1E40AF', marginTop: 4, lineHeight: 17 },
});
