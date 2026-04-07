import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';
import { registerWorkerByInvite } from '../../api/apiService';

const InputField = ({ label, placeholder, secureTextEntry, value, onChangeText, showEye, keyboardType, autoCapitalize }) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          secureTextEntry={!!secureTextEntry && isSecure}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
          autoCapitalize={autoCapitalize || 'sentences'}
        />
        {showEye && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Ionicons name={isSecure ? 'eye-off-outline' : 'eye-outline'} size={20} color="#1A202C" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function WorkerSignupScreen({ navigation, route }) {
  const inviteFromRoute = route.params?.inviteToken || route.params?.token || '';
  const [formData, setFormData] = useState({
    inviteToken: inviteFromRoute,
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (inviteFromRoute) {
      setFormData((prev) => ({ ...prev, inviteToken: inviteFromRoute }));
    }
  }, [inviteFromRoute]);

  const { height } = Dimensions.get('window');

  const onSignup = async () => {
    const token = (formData.inviteToken || '').trim();
    const name = `${(formData.firstName || '').trim()} ${(formData.lastName || '').trim()}`.trim();
    const phone = (formData.phone || '').trim();
    const pw = formData.password;
    if (!token) {
      Alert.alert('Invite required', 'Worker accounts are invite-only. Paste the invitation code from your admin.');
      return;
    }
    if (!name || name.length < 2) {
      Alert.alert('Name', 'Enter your first and last name.');
      return;
    }
    if (!phone) {
      Alert.alert('Phone', 'Phone is required.');
      return;
    }
    if (!pw || pw.length < 6) {
      Alert.alert('Password', 'Use at least 6 characters.');
      return;
    }
    if (pw !== formData.confirmPassword) {
      Alert.alert('Password', 'Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const res = await registerWorkerByInvite({ token, name, phone, password: pw });
    setSubmitting(false);
    if (res.success) {
      Alert.alert('Welcome', 'Your worker account is ready.', [
        {
          text: 'OK',
          onPress: () =>
            navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'WorkerTabs' }] })),
        },
      ]);
    } else {
      Alert.alert('Sign up failed', res.message || 'Check invite code and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollInner} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="#1A202C" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.headline}>Worker sign up</Text>
              <Text style={styles.subheadline}>
                Invite-only — same account as admin sends from the dashboard / web. Email comes from the invite.
              </Text>
            </View>

            <View style={styles.form}>
              <InputField
                label="Invitation code"
                placeholder="Paste token from invite email"
                value={formData.inviteToken}
                onChangeText={(txt) => setFormData({ ...formData, inviteToken: txt })}
                autoCapitalize="none"
              />

              <View style={styles.nameRow}>
                <View style={{ flex: 1 }}>
                  <InputField
                    label="First name"
                    placeholder="First name"
                    value={formData.firstName}
                    onChangeText={(txt) => setFormData({ ...formData, firstName: txt })}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField
                    label="Last name"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChangeText={(txt) => setFormData({ ...formData, lastName: txt })}
                  />
                </View>
              </View>

              <InputField
                label="Phone"
                placeholder="Mobile number"
                value={formData.phone}
                onChangeText={(txt) => setFormData({ ...formData, phone: txt })}
                keyboardType="phone-pad"
              />

              <InputField
                label="Password"
                placeholder="Password"
                secureTextEntry
                showEye
                value={formData.password}
                onChangeText={(txt) => setFormData({ ...formData, password: txt })}
              />

              <InputField
                label="Confirm password"
                placeholder="Confirm password"
                secureTextEntry
                showEye
                value={formData.confirmPassword}
                onChangeText={(txt) => setFormData({ ...formData, confirmPassword: txt })}
              />

              <TouchableOpacity style={styles.signupBtn} onPress={onSignup} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.signupText}>Create account</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <View style={styles.loginRow}>
                <Text style={styles.loginHint}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('WorkerLogin')}>
                  <Text style={styles.loginLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollInner: { paddingBottom: 40 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 10 : 20,
    marginLeft: -10,
  },
  header: {
    marginBottom: Dimensions.get('window').height < 700 ? 10 : 20,
  },
  headline: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: '#1A202C',
  },
  subheadline: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: '#718096',
    marginTop: 8,
    lineHeight: 20,
  },
  form: { marginTop: 8 },
  nameRow: { flexDirection: 'row', gap: 12 },
  inputWrapper: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#1A202C',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#1A202C',
  },
  signupBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...SHADOWS.medium,
  },
  signupText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  footer: { marginTop: 24 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginHint: { fontSize: 14, color: '#718096', fontFamily: FONTS.regular },
  loginLink: { fontSize: 14, color: COLORS.primary, fontFamily: FONTS.bold },
});
