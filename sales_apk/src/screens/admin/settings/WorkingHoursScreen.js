import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

const DAYS = [
  { day: 'Monday', active: true, open: '09:00 AM', close: '06:00 PM' },
  { day: 'Tuesday', active: true, open: '09:00 AM', close: '06:00 PM' },
  { day: 'Wednesday', active: true, open: '09:00 AM', close: '06:00 PM' },
  { day: 'Thursday', active: true, open: '09:00 AM', close: '06:00 PM' },
  { day: 'Friday', active: true, open: '09:00 AM', close: '05:00 PM' },
  { day: 'Saturday', active: false, open: '10:00 AM', close: '02:00 PM' },
  { day: 'Sunday', active: false, open: 'Closed', close: '' },
];

export default function WorkingHoursScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Working Hours</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {DAYS.map((item, index) => (
            <View key={item.day} style={[styles.dayRow, index < DAYS.length - 1 && styles.border]}>
              <View style={styles.dayInfo}>
                <Text style={[styles.dayName, !item.active && styles.inactiveText]}>{item.day}</Text>
                {item.active ? (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Open</Text>
                  </View>
                ) : (
                  <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={[styles.statusText, { color: '#EF4444' }]}>Closed</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.timeBtn}
                onPress={() => Alert.alert("Edit Hours", `Select new working hours for ${item.day}`)}
              >
                <Text style={styles.timeText}>{item.open} {item.close && ` - ${item.close}`}</Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.textTertiary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert("Success", "Working hours have been updated!");
            navigation.goBack();
          }}
        >
          <Text style={styles.saveBtnText}>Save Schedule</Text>
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
  card: { backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 15, ...SHADOWS.small },
  dayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18 },
  border: { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  dayInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dayName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  inactiveText: { color: COLORS.textTertiary },
  statusBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700', color: '#16A34A' },
  timeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.surfaceAlt, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  timeText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  saveBtn: {
    backgroundColor: '#8B5CF6', height: 55, borderRadius: 16, alignItems: 'center',
    justifyContent: 'center', marginTop: 30, ...SHADOWS.medium,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
