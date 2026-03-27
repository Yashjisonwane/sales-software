import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ADDRESSES = [
  { id: '1', type: 'Home', address: '123 Luxury Lane, Green Park, NY', icon: 'home' },
  { id: '2', type: 'Office', address: '456 Business Plaza, Downtown, NY', icon: 'briefcase' },
];

export default function SavedAddressesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {ADDRESSES.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.iconBg}>
              <Ionicons name={item.icon} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.address}>{item.address}</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert("Edit", "Redirecting to edit address...")}>
              <Ionicons name="create-outline" size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => Alert.alert("Add Address", "Redirecting to add new address flow...")}
        >
          <Ionicons name="add" size={24} color={COLORS.primary} />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingBottom: 15, paddingHorizontal: 20, backgroundColor: COLORS.white,
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: 20, padding: 16, marginBottom: 15, ...SHADOWS.small,
  },
  iconBg: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  info: { flex: 1 },
  type: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  address: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.white, height: 60, borderRadius: 20, borderStyle: 'dashed',
    borderWidth: 2, borderColor: COLORS.primary, marginTop: 10,
  },
  addBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
});
