import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, SIZES } from '../../../constants/theme';

const { width } = Dimensions.get('window');

const SecurityScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isBiometricEnabled, setBiometricEnabled] = React.useState(true);
  const [isTwoFactorEnabled, setTwoFactorEnabled] = React.useState(false);

  const SecurityOption = ({ icon, title, sub, onPress, type = 'chevron' }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={onPress}
      disabled={type === 'switch'}
      activeOpacity={0.7}
    >
      <View style={styles.optionIconContainer}>
        <Ionicons name={icon} size={22} color="#0E56D0" />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSub}>{sub}</Text>
      </View>
      {type === 'chevron' ? (
        <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />
      ) : type === 'switch' ? (
        <Switch
          value={title === 'Biometric Login' ? isBiometricEnabled : isTwoFactorEnabled}
          onValueChange={(val) => title === 'Biometric Login' ? setBiometricEnabled(val) : setTwoFactorEnabled(val)}
          trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
          thumbColor={COLORS.white}
        />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons name="shield-checkmark" size={40} color="#0E56D0" />
          </View>
          <Text style={styles.introTitle}>Secure Your Account</Text>
          <Text style={styles.introSub}>Manage your login methods and protect your personal data.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Login Methods</Text>
          <View style={styles.sectionCard}>
            <SecurityOption
              icon="key-outline"
              title="Change Password"
              sub="Last changed 3 months ago"
              onPress={() => { }}
            />
            <View style={styles.divider} />
            <SecurityOption
              icon="finger-print-outline"
              title="Biometric Login"
              sub="FaceID or TouchID"
              type="switch"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Security</Text>
          <View style={styles.sectionCard}>
            <SecurityOption
              icon="phone-portrait-outline"
              title="Two-Factor Auth"
              sub="Secure your account with SMS"
              type="switch"
            />
            <View style={styles.divider} />
            <SecurityOption
              icon="log-out-outline"
              title="Manage Devices"
              sub="Currently 2 active devices"
              onPress={() => { }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Deactivate Account</Text>
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

  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    ...SHADOWS.medium,
  },
  introIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  introTitle: { fontSize: 20, fontWeight: '800', color: '#1A202C' },
  introSub: { fontSize: 14, color: '#718096', textAlign: 'center', marginTop: 8, lineHeight: 20 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A202C', marginBottom: 12, marginLeft: 4 },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTextContainer: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  optionSub: { fontSize: 12, color: '#A0AEC0', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 60 },

  deleteBtn: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
});

export default SecurityScreen;
