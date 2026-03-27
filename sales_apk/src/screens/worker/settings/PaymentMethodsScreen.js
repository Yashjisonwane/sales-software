import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const METHODS = [
  { id: '1', type: 'Visa', number: '**** **** **** 4242', expiry: '12/26', icon: 'card' },
  { id: '2', type: 'Mastercard', number: '**** **** **** 8888', expiry: '09/25', icon: 'card' },
];

export default function PaymentMethodsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {METHODS.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.typeRow}>
                <Ionicons name={item.icon} size={24} color={COLORS.primary} />
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
              <TouchableOpacity onPress={() => Alert.alert("Remove Card", "Are you sure you want to remove this card?")}>
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardNumber}>{item.number}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.expiryLabel}>Expiry Date</Text>
              <Text style={styles.expiryValue}>{item.expiry}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => Alert.alert("Add Card", "Redirecting to secure card entry...")}
        >
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          <Text style={styles.addBtnText}>Add New Card</Text>
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
    backgroundColor: COLORS.white, borderRadius: 24, padding: 20, marginBottom: 20, ...SHADOWS.medium,
    borderWidth: 1, borderColor: COLORS.borderLight,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  typeText: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  cardNumber: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: 2, marginBottom: 20 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  expiryLabel: { fontSize: 12, color: COLORS.textTertiary, fontWeight: '600' },
  expiryValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.white, height: 60, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.border, marginTop: 10,
  },
  addBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
});
