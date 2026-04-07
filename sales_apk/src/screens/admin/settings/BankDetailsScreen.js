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
import { COLORS, SHADOWS } from '../../../constants/theme';
import { getProfile, updateProfile, refreshLocalUserSnapshot } from '../../../api/apiService';

function digitsOnly(s) {
  return (s || '').replace(/\D/g, '');
}

function lastNDigits(s, n) {
  const d = digitsOnly(s);
  return d.length >= n ? d.slice(-n) : d;
}

function normalizePayout(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return {
    holderName: raw.holderName != null ? String(raw.holderName) : '',
    bankName: raw.bankName != null ? String(raw.bankName) : '',
    accountLast4: raw.accountLast4 != null ? String(raw.accountLast4) : '',
    routingLast4: raw.routingLast4 != null ? String(raw.routingLast4) : '',
  };
}

export default function BankDetailsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [holderName, setHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountInput, setAccountInput] = useState('');
  const [routingInput, setRoutingInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getProfile();
    if (res.success && res.data) {
      const p = normalizePayout(res.data.payoutSettings);
      setHolderName(p.holderName);
      setBankName(p.bankName);
      setAccountInput(p.accountLast4 ? `••••${p.accountLast4}` : '');
      setRoutingInput(p.routingLast4 ? `••••${p.routingLast4}` : '');
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onSave = async () => {
    const accountLast4 = lastNDigits(accountInput, 4);
    const routingLast4 = lastNDigits(routingInput, 4);
    if (!holderName.trim() || !bankName.trim()) {
      Alert.alert('Required', 'Please enter account holder name and bank name.');
      return;
    }
    if (accountLast4.length < 4 || routingLast4.length < 4) {
      Alert.alert(
        'Account / routing',
        'Enter enough digits so we can store the last 4 for display (full numbers are not kept on the server).'
      );
      return;
    }

    setSaving(true);
    const res = await updateProfile({
      payoutSettings: {
        holderName: holderName.trim(),
        bankName: bankName.trim(),
        accountLast4,
        routingLast4,
      },
    });
    setSaving(false);
    if (res.success) {
      await refreshLocalUserSnapshot();
      Alert.alert('Saved', 'Masked payout details are stored on your account.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } else {
      Alert.alert('Error', res.message || 'Could not save');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank details</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.alertBox}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
              <Text style={styles.alertText}>
                Only masked values (last digits) are saved on the server. For live payouts, PSP webhooks can be added later without changing this screen.
              </Text>
            </View>

            <Text style={styles.label}>Account holder name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={holderName}
                onChangeText={setHolderName}
                placeholder="Name on the account"
                placeholderTextColor={COLORS.textTertiary}
              />
            </View>

            <Text style={styles.label}>Bank name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={bankName}
                onChangeText={setBankName}
                placeholder="e.g. Chase, HDFC"
                placeholderTextColor={COLORS.textTertiary}
              />
            </View>

            <Text style={styles.label}>Account number (last 4 stored)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={accountInput}
                onChangeText={setAccountInput}
                placeholder="Enter full or last digits"
                keyboardType="number-pad"
                placeholderTextColor={COLORS.textTertiary}
              />
            </View>

            <Text style={styles.label}>Routing / IFSC (last 4 stored)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={routingInput}
                onChangeText={setRoutingInput}
                placeholder="Enter full or last digits"
                keyboardType="number-pad"
                placeholderTextColor={COLORS.textTertiary}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            activeOpacity={0.8}
            disabled={saving}
            onPress={onSave}
          >
            {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveBtnText}>Update bank account</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 20 },
  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, ...SHADOWS.small },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 10,
  },
  alertText: { fontSize: 13, color: COLORS.success, fontWeight: '500', flex: 1, lineHeight: 18 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8, marginTop: 15 },
  inputWrapper: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    justifyContent: 'center',
  },
  input: { fontSize: 15, color: COLORS.textPrimary },
  saveBtn: {
    backgroundColor: '#8B5CF6',
    height: 55,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    ...SHADOWS.medium,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
