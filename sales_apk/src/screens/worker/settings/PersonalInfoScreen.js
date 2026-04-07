import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SHADOWS, SIZES, FONTS } from '../../../constants/theme';
import { getProfile, updateProfile, refreshLocalUserSnapshot } from '../../../api/apiService';

const PersonalInfoScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getProfile();
    if (res.success && res.data) {
      const u = res.data;
      setName(u.name || '');
      setEmail(u.email || '');
      setPhone(u.phone || '');
      setAddress(u.address || '');
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const InputField = ({ label, value, onChangeText, icon, placeholder, keyboardType = 'default' }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={20} color="#A0AEC0" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Required', 'Name and phone are required.');
      return;
    }
    setSaving(true);
    const res = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim() || undefined,
    });
    setSaving(false);
    if (res.success) {
      await refreshLocalUserSnapshot();
      Alert.alert('Success', 'Profile saved to the server.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } else {
      Alert.alert('Error', res.message || 'Update failed');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <InputField
              label="Full Name"
              value={name}
              onChangeText={setName}
              icon="person-outline"
              placeholder="Enter your name"
            />
            <InputField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              icon="mail-outline"
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            <InputField
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              icon="call-outline"
              placeholder="Enter your phone"
              keyboardType="phone-pad"
            />
            <InputField
              label="Street / address"
              value={address}
              onChangeText={setAddress}
              icon="home-outline"
              placeholder="Service or mailing address"
            />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#0E56D0" />
            <Text style={styles.infoText}>
              Data is stored on your company server — same account as admin and web when using one backend.
            </Text>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  scrollContent: { padding: SIZES.screenPadding },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.small,
  },
  inputGroup: { marginBottom: 4 },
  label: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#4A5568',
    marginBottom: 8,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, fontFamily: FONTS.regular, color: '#1A202C' },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#EBF8FF',
    borderRadius: 16,
    marginTop: 20,
    alignItems: 'flex-start',
    gap: 10,
  },
  infoText: { flex: 1, fontSize: 13, color: '#4A5568', lineHeight: 20, fontFamily: FONTS.regular },
  saveBtn: {
    backgroundColor: '#0E56D0',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    ...SHADOWS.medium,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: FONTS.bold },
});

export default PersonalInfoScreen;
