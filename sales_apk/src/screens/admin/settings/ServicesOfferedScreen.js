import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

const SERVICES = [
  'Regular Cleaning', 'Deep Cleaning', 'Office Cleaning',
  'Post-Construction', 'Window Cleaning', 'Carpet Cleaning',
  'Kitchen Cleaning', 'Bathroom Deep Clean'
];

export default function ServicesOfferedScreen({ navigation }) {
  const [selected, setSelected] = useState(['Regular Cleaning', 'Deep Cleaning']);

  const toggleService = (service) => {
    if (selected.includes(service)) {
      setSelected(selected.filter(s => s !== service));
    } else {
      setSelected([...selected, service]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services Offered</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Select the services you provide:</Text>
        <View style={styles.grid}>
          {SERVICES.map((service) => (
            <TouchableOpacity
              key={service}
              style={[
                styles.chip,
                selected.includes(service) && styles.chipSelected
              ]}
              onPress={() => toggleService(service)}
            >
              <Text style={[
                styles.chipText,
                selected.includes(service) && styles.chipTextSelected
              ]}>{service}</Text>
              <Ionicons
                name={selected.includes(service) ? "checkbox" : "add-circle-outline"}
                size={18}
                color={selected.includes(service) ? COLORS.white : '#8B5CF6'}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert("Success", "Your services list has been updated!");
            navigation.goBack();
          }}
        >
          <Text style={styles.saveBtnText}>Update Services</Text>
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
  sectionTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.border, ...SHADOWS.small,
  },
  chipSelected: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  chipText: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  chipTextSelected: { color: COLORS.white },
  saveBtn: {
    backgroundColor: '#8B5CF6', height: 55, borderRadius: 16, alignItems: 'center',
    justifyContent: 'center', marginTop: 40, ...SHADOWS.medium,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
