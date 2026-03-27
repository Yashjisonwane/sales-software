import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../../constants/theme';

export default function BankDetailsScreen({ navigation }) {
  const handleSave = () => {
    Alert.alert("Security Check", "Bank details updated successfully! Your payouts will be sent to this account.");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.alertBox}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.alertText}>Your payment details are encrypted and secure.</Text>
          </View>

          <Text style={styles.label}>Account Holder Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="John Doe" />
          </View>

          <Text style={styles.label}>Bank Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="Chase Bank" />
          </View>

          <Text style={styles.label}>Account Number</Text>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="**** **** **** 1234" keyboardType="number-pad" />
          </View>

          <Text style={styles.label}>Routing Number</Text>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="9-digit code" keyboardType="number-pad" />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Update Bank Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: COLORS.white,
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 20 },
  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, ...SHADOWS.small },
  alertBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', padding: 12, borderRadius: 12, gap: 10, marginBottom: 10 },
  alertText: { fontSize: 13, color: COLORS.success, fontWeight: '500', flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8, marginTop: 15 },
  inputWrapper: {
    backgroundColor: COLORS.surfaceAlt, borderRadius: 12, paddingHorizontal: 15,
    height: 50, borderWidth: 1, borderColor: COLORS.borderLight, justifyContent: 'center',
  },
  input: { fontSize: 15, color: COLORS.textPrimary },
  saveBtn: {
    backgroundColor: '#8B5CF6', height: 55, borderRadius: 16, alignItems: 'center',
    justifyContent: 'center', marginTop: 30, ...SHADOWS.medium,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
