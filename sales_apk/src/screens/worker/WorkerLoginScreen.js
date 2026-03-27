import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WorkerLoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.replace('WorkerTabs')}
          >
            <Text style={styles.loginBtnText}>Log In</Text>
          </TouchableOpacity>
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
});
