import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../../constants/theme';

export default function BusinessNameScreen({ navigation }) {
  const [name, setName] = useState('Wilson Plumbing Co.');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Business Name</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputCard}>
          <Text style={styles.label}>Your Business Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="business-outline" size={20} color={COLORS.textTertiary} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter Business Name"
            />
          </View>
          <Text style={styles.infoText}>This name will be visible to all customers when they search for services.</Text>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert("Updated", "Business name has been updated successfully!");
            navigation.goBack();
          }}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
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
  inputCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, ...SHADOWS.small },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 10 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: COLORS.textPrimary },
  infoText: { fontSize: 12, color: COLORS.textTertiary, marginTop: 12, lineHeight: 18 },
  saveBtn: {
    backgroundColor: '#8B5CF6', height: 55, borderRadius: 16, alignItems: 'center',
    justifyContent: 'center', marginTop: 30, ...SHADOWS.medium,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
