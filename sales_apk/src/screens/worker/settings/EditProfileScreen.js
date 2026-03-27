import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@email.com');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={COLORS.textTertiary} style={styles.icon} />
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textTertiary} style={styles.icon} />
            <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert("Profile Updated", "Your profile details have been saved successfully.");
            navigation.goBack();
          }}
        >
          <Text style={styles.saveBtnText}>Save Profile</Text>
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
  avatarSection: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 30, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, fontWeight: '800', color: COLORS.white },
  cameraBtn: { position: 'absolute', bottom: 0, right: -5, width: 34, height: 34, borderRadius: 12, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: COLORS.white },
  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, ...SHADOWS.small },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8, marginTop: 15 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  saveBtn: {
    backgroundColor: COLORS.primary, height: 55, borderRadius: 16, alignItems: 'center',
    justifyContent: 'center', marginTop: 30, ...SHADOWS.medium,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
