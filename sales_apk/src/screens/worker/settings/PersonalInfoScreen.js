import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, SIZES, FONTS } from '../../../constants/theme';

const { width } = Dimensions.get('window');

const PersonalInfoScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('Zain Worker');
  const [email, setEmail] = useState('zain.worker@hinesq.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [dob, setDob] = useState('12/05/1992');

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

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={{ width: 40 }} />
      </View>

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
            label="Date of Birth"
            value={dob}
            onChangeText={setDob}
            icon="calendar-outline"
            placeholder="DD/MM/YYYY"
          />
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#0E56D0" />
          <Text style={styles.infoText}>
            This information is used for identification and payment verification purposes.
          </Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFC' },
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

  scrollContent: { padding: 20 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#1A202C', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#1A202C' },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  infoText: { flex: 1, marginLeft: 12, fontSize: 13, color: '#0E56D0', lineHeight: 18 },

  saveBtn: {
    backgroundColor: '#0E56D0',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default PersonalInfoScreen;
