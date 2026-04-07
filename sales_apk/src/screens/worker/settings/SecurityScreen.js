import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import {
  getBiometricPrefEnabled,
  setBiometricPrefEnabled,
  getBiometricActionLabels,
  getStoredCredentials,
} from '../../../api/biometricLogin';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../../constants/theme';

const SecurityScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isBiometricEnabled, setBiometricEnabled] = React.useState(false);
  const [bioSettingsLabels, setBioSettingsLabels] = React.useState({
    settingsTitle: 'Fingerprint & Face login',
    settingsSubtitle: 'Fingerprint or Face ID on the login screen',
  });

  React.useEffect(() => {
    getBiometricPrefEnabled().then(setBiometricEnabled);
  }, []);

  React.useEffect(() => {
    getBiometricActionLabels().then((l) =>
      setBioSettingsLabels({ settingsTitle: l.settingsTitle, settingsSubtitle: l.settingsSubtitle })
    );
  }, []);

  const SecurityOption = ({ icon, title, sub, type = 'switch' }) => (
    <TouchableOpacity style={styles.optionItem} disabled={type === 'switch'} activeOpacity={0.7}>
      <View style={styles.optionIconContainer}>
        <Ionicons name={icon} size={22} color="#0E56D0" />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSub}>{sub}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={isBiometricEnabled}
          onValueChange={async (val) => {
            setBiometricEnabled(val);
            await setBiometricPrefEnabled(val);
            if (val) {
              const l = await getBiometricActionLabels();
              const hasCreds = !!(await getStoredCredentials());
              Alert.alert(
                l.settingsTitle,
                hasCreds
                  ? `Fingerprint works on the worker login screen. If you sign out, you can sign back in with password or fingerprint.`
                  : `After your next successful sign-in with email and password, you can use ${l.settingsSubtitle.toLowerCase()}.`
              );
            }
          }}
          trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
          thumbColor={COLORS.white}
        />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
            <Ionicons name="finger-print-outline" size={40} color="#0E56D0" />
          </View>
          <Text style={styles.introTitle}>Login methods</Text>
          <Text style={styles.introSub}>
            Choose how you unlock the app on this device after you sign out.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Login Methods</Text>
          <View style={styles.sectionCard}>
            <SecurityOption
              icon="finger-print-outline"
              title={bioSettingsLabels.settingsTitle}
              sub={bioSettingsLabels.settingsSubtitle}
              type="switch"
            />
          </View>
        </View>

        <View style={{ height: 32 }} />
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
    marginBottom: 24,
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

  section: { marginBottom: 8 },
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
});

export default SecurityScreen;
