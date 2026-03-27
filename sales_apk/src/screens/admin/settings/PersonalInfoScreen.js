import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../../constants/theme';

export default function PersonalInfoScreen({ navigation }) {
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [email, setEmail] = useState('wilson.plumbing@email.com');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={COLORS.textTertiary} style={styles.icon} />
            <TextInput style={styles.input} value="David Wilson" editable={false} />
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textTertiary} style={styles.icon} />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color={COLORS.textTertiary} style={styles.icon} />
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert("Success", "Your personal information has been saved!");
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, padding: 20, paddingBottom: 0 },
  content: { padding: 20 },
  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, ...SHADOWS.small },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8, marginTop: 15 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  saveBtn: {
    backgroundColor: '#8B5CF6', height: 55, borderRadius: 16, alignItems: 'center',
    justifyContent: 'center', marginTop: 30, ...SHADOWS.medium,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
