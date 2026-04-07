import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginWorker, resetPassword } from '../../api/apiService';
import {
  getBiometricLoginScreenState,
  getBiometricActionLabels,
  promptDeviceAuthentication,
  getStoredCredentials,
  saveCredentialsAfterLogin,
  getBiometricPrefEnabled,
} from '../../api/biometricLogin';

function goHome(navigation, result) {
  const role = result.data.user.role;
  if (role === 'ADMIN') navigation.replace('AdminTabs');
  else navigation.replace('WorkerTabs');
}

export default function WorkerLoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('pro@market.com');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bioState, setBioState] = useState({ showSection: false, readyToSignIn: false });
  const [bioLabels, setBioLabels] = useState(() => ({
    button: Platform.OS === 'ios' ? 'Sign in with Face ID' : 'Sign in with fingerprint',
    hintLine:
      Platform.OS === 'ios'
        ? 'Fingerprint or Face ID is enabled. Sign in with your password once—then you can use Face ID here.'
        : 'Fingerprint sign-in is enabled. Sign in with your password once—then you can use your fingerprint here.',
    useFaceIcon: Platform.OS === 'ios',
  }));
  const [bioLoading, setBioLoading] = useState(false);
  const autoBioDone = useRef(false);

  const refreshBioState = useCallback(async () => {
    const [s, labels] = await Promise.all([
      getBiometricLoginScreenState(),
      getBiometricActionLabels(),
    ]);
    setBioState(s);
    setBioLabels(labels);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshBioState();
    }, [refreshBioState])
  );

  const [isResetting, setIsResetting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPasswordReset, setNewPasswordReset] = useState('');

  useEffect(() => {
    if (!bioState.readyToSignIn || autoBioDone.current) return;
    const t = setTimeout(async () => {
      autoBioDone.current = true;
      const ok = await promptDeviceAuthentication();
      if (!ok) return;
      const creds = await getStoredCredentials();
      if (!creds) return;
      setBioLoading(true);
      setError('');
      const result = await loginWorker(creds.email, creds.password);
      setBioLoading(false);
      if (result.success) goHome(navigation, result);
      else setError(result.message || 'Biometric login failed.');
    }, 450);
    return () => clearTimeout(t);
  }, [bioState.readyToSignIn, navigation]);

  const finishLogin = async (result, e, p) => {
    if (result.success) {
      if (e && p && (await getBiometricPrefEnabled())) {
        await saveCredentialsAfterLogin(e, p);
      }
      goHome(navigation, result);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    const result = await loginWorker(email, password);
    setIsLoading(false);

    if (result.success) {
      await finishLogin(result, email, password);
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const onBiometricPress = async () => {
    const ok = await promptDeviceAuthentication();
    if (!ok) return;
    const creds = await getStoredCredentials();
    if (!creds) {
      setError('Turn on Biometric in Security, then sign in with password once.');
      return;
    }
    setError('');
    setBioLoading(true);
    const result = await loginWorker(creds.email, creds.password);
    setBioLoading(false);
    if (result.success) await finishLogin(result, creds.email, creds.password);
    else setError(result.message || 'Biometric login failed.');
  };

  const handleReset = async () => {
    if (!forgotEmail || !newPasswordReset) return;
    setIsResetting(true);
    const res = await resetPassword(forgotEmail, newPasswordReset);
    setIsResetting(false);
    if (res.success) {
        alert(res.message || 'Password updated successful!');
        setShowForgotModal(false);
        setForgotEmail('');
        setNewPasswordReset('');
    } else {
        alert(res.message || 'Reset failed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <TouchableOpacity style={[styles.backBtn, { paddingTop: insets.top + 10 }]} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#1A202C" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Log in to Paired</Text>
          <Text style={styles.subtitle}>Enter your existing account details below</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Email"
                placeholderTextColor="#A0AEC0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0AEC0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#1A202C"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={styles.forgotBtn}
                onPress={() => setShowForgotModal(true)}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={{ color: 'red', fontSize: 13, textAlign: 'center' }}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.loginBtn, (isLoading || bioLoading) && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading || bioLoading}
          >
            <Text style={styles.loginBtnText}>{isLoading ? 'Logging In...' : 'Log In'}</Text>
          </TouchableOpacity>

          {/* ─── Biometric Card (Always Visible) ─── */}
          <View style={styles.biometricCard}>
            <View style={styles.biometricCardTop}>
              <View style={styles.biometricIconRing}>
                <View style={styles.biometricIconInner}>
                  <Ionicons
                    name={bioLabels.useFaceIcon ? 'scan' : 'finger-print'}
                    size={36}
                    color={bioState.readyToSignIn ? '#0062E1' : '#94A3B8'}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.biometricCardTitle}>
                  {bioState.readyToSignIn
                    ? bioLabels.button
                    : bioLabels.useFaceIcon ? 'Face ID Login' : 'Fingerprint Login'}
                </Text>
                <Text style={styles.biometricCardSub}>
                  {bioState.readyToSignIn
                    ? 'Tap to sign in instantly'
                    : bioState.showSection
                    ? 'Sign in with password once to activate'
                    : 'Enable in Account → Security'}
                </Text>
              </View>
              <View style={[
                styles.biometricBadge,
                { backgroundColor: bioState.readyToSignIn ? '#DCFCE7' : '#F1F5F9' }
              ]}>
                <Text style={[
                  styles.biometricBadgeText,
                  { color: bioState.readyToSignIn ? '#16A34A' : '#94A3B8' }
                ]}>
                  {bioState.readyToSignIn ? 'ON' : 'OFF'}
                </Text>
              </View>
            </View>

            {bioState.readyToSignIn ? (
              <TouchableOpacity
                style={[styles.biometricActionBtn, (bioLoading || isLoading) && { opacity: 0.6 }]}
                onPress={onBiometricPress}
                disabled={bioLoading || isLoading}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={bioLabels.useFaceIcon ? 'scan-outline' : 'finger-print-outline'}
                  size={20}
                  color="#fff"
                />
                <Text style={styles.biometricActionBtnText}>
                  {bioLoading ? 'Verifying…' : `Use ${bioLabels.useFaceIcon ? 'Face ID' : 'Fingerprint'}`}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.biometricSetupRow}>
                <Ionicons name="information-circle-outline" size={16} color="#94A3B8" />
                <Text style={styles.biometricSetupText}>
                  {bioState.showSection
                    ? 'Log in with password once to save credentials for biometric login.'
                    : 'Go to Account → Security to enable biometric login.'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialBtn}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <Ionicons name="logo-apple" size={20} color="#000000" style={styles.socialIcon} />
            <Text style={styles.socialBtnText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('WorkerSignup')}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal visible={showForgotModal} animationType="slide" transparent={true}>
        <View style={styles.modalBg}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <Text style={styles.modalSubtitle}>Enter email and new password</Text>
                
                <TextInput
                    style={styles.modalInput}
                    placeholder="Email"
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.modalInput}
                    placeholder="New Password"
                    value={newPasswordReset}
                    onChangeText={setNewPasswordReset}
                    secureTextEntry
                />
                
                <TouchableOpacity 
                    style={[styles.resetBtn, isResetting && { opacity: 0.7 }]} 
                    onPress={handleReset}
                    disabled={isResetting}
                >
                    <Text style={styles.resetBtnText}>{isResetting ? 'Updating...' : 'Update'}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.cancelBtn} 
                    onPress={() => setShowForgotModal(false)}
                >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  backBtn: { padding: 20, width: 60 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { marginTop: 20, marginBottom: 32 },
  title: { fontSize: 28, fontFamily: FONTS.bold, color: '#000000' },
  subtitle: { fontSize: 15, fontFamily: FONTS.regular, color: COLORS.textTertiary, marginTop: 8 },

  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontFamily: FONTS.semiBold, color: '#1A202C' },
  inputWrapper: {
    height: 56,
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  input: { flex: 1, fontSize: 15, fontFamily: FONTS.regular, color: '#1A202C' },
  eyeIcon: { padding: 4 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 4 },
  forgotText: { fontSize: 13, color: '#0062E1', fontFamily: FONTS.semiBold, textDecorationLine: 'underline' },

  loginBtn: {
    height: 56,
    backgroundColor: '#0062E1',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...SHADOWS.medium,
  },
  loginBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: FONTS.bold },

  biometricBtn: {
    marginTop: 14, height: 52, borderRadius: 26, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1.5, borderColor: '#BFDBFE', backgroundColor: '#EFF6FF',
  },
  biometricBtnText: { fontSize: 15, fontFamily: FONTS.semiBold, color: '#0062E1' },
  biometricHintBox: {
    marginTop: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 14, borderRadius: 14, borderWidth: 1,
    borderColor: '#E2E8F0', backgroundColor: '#F8FAFC',
  },
  biometricHintText: { flex: 1, fontSize: 13, fontFamily: FONTS.regular, color: '#64748B', lineHeight: 19 },

  // ─── Premium Biometric Card ───
  biometricCard: {
    marginTop: 16, borderRadius: 20, borderWidth: 1,
    borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', padding: 16, gap: 14,
  },
  biometricCardTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  biometricIconRing: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#EFF6FF',
    borderWidth: 1.5, borderColor: '#BFDBFE', alignItems: 'center', justifyContent: 'center',
  },
  biometricIconInner: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0062E1', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 6, elevation: 3,
  },
  biometricCardTitle: { fontSize: 15, fontFamily: FONTS.bold, color: '#1A202C', marginBottom: 3 },
  biometricCardSub: { fontSize: 12, fontFamily: FONTS.regular, color: '#64748B', lineHeight: 17 },
  biometricBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start' },
  biometricBadgeText: { fontSize: 11, fontFamily: FONTS.bold },
  biometricActionBtn: {
    height: 48, borderRadius: 24, backgroundColor: '#0062E1',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  biometricActionBtnText: { fontSize: 15, fontFamily: FONTS.semiBold, color: '#fff' },
  biometricSetupRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingTop: 4 },
  biometricSetupText: { flex: 1, fontSize: 12, fontFamily: FONTS.regular, color: '#94A3B8', lineHeight: 18 },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#EDF2F7' },
  dividerText: { marginHorizontal: 16, fontSize: 14, color: '#A0AEC0', fontFamily: FONTS.medium },

  socialContainer: { gap: 12 },
  socialBtn: {
    height: 56,
    backgroundColor: '#F7FAFC',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  socialIcon: { width: 20, height: 20 },
  socialBtnText: { fontSize: 15, fontFamily: FONTS.semiBold, color: '#1A202C' },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.textTertiary },
  signUpText: { fontSize: 14, color: '#0062E1', fontFamily: FONTS.bold },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#FFF', borderRadius: 20, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontFamily: FONTS.bold, color: '#1A202C', marginBottom: 5 },
  modalSubtitle: { fontSize: 14, fontFamily: FONTS.regular, color: '#718096', marginBottom: 20 },
  modalInput: { width: '100%', height: 50, backgroundColor: '#F7FAFC', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  resetBtn: { width: '100%', height: 50, backgroundColor: '#0062E1', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  resetBtnText: { color: '#FFF', fontSize: 16, fontFamily: FONTS.bold },
  cancelBtn: { width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
  cancelBtnText: { color: '#718096', fontSize: 14, fontFamily: FONTS.medium },
});
