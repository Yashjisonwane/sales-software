import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import storage from './storage';

/** Worker-only: admin Pro login does not read/write these (avoids overwriting worker fingerprint). */
const PREF_KEY_WORKER = 'biometric_worker_enabled_v1';
const LEGACY_PREF = 'biometricLoginEnabled';
const SECURE_EMAIL = 'biometric_worker_email_v1';
const SECURE_PASSWORD = 'biometric_worker_password_v1';
const LEGACY_EMAIL = 'biometric_login_email_v1';
const LEGACY_PASSWORD = 'biometric_login_password_v1';

async function migrateLegacyPrefOnce() {
  const next = await storage.getItem(PREF_KEY_WORKER);
  if (next != null) return;
  const old = await storage.getItem(LEGACY_PREF);
  if (old != null) await storage.setItem(PREF_KEY_WORKER, old);
}

export async function getBiometricPrefEnabled() {
  await migrateLegacyPrefOnce();
  const v = await storage.getItem(PREF_KEY_WORKER);
  return v === 'true' || v === '1';
}

export async function setBiometricPrefEnabled(enabled) {
  await storage.setItem(PREF_KEY_WORKER, enabled ? 'true' : 'false');
  await storage.removeItem(LEGACY_PREF);
  if (!enabled) {
    await clearStoredCredentials();
  }
}

export async function clearStoredCredentials() {
  try {
    await SecureStore.deleteItemAsync(SECURE_EMAIL);
    await SecureStore.deleteItemAsync(SECURE_PASSWORD);
    await SecureStore.deleteItemAsync(LEGACY_EMAIL);
    await SecureStore.deleteItemAsync(LEGACY_PASSWORD);
  } catch (_) {
    /* web or missing native module */
  }
}

/**
 * Call when user logs out. If biometric login stays enabled, keep encrypted credentials so
 * fingerprint / Face ID still works on the login screen. If biometric is off, clear them.
 */
export async function clearBiometricSessionOnLogout() {
  const bioOn = await getBiometricPrefEnabled();
  if (!bioOn) {
    await clearStoredCredentials();
  }
}

/**
 * Call after a successful password login when user has enabled biometric in settings.
 */
export async function saveCredentialsAfterLogin(email, password) {
  const on = await getBiometricPrefEnabled();
  if (!on || !email || !password) return;
  if (Platform.OS === 'web') return;
  try {
    await SecureStore.setItemAsync(SECURE_EMAIL, email.trim(), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
    await SecureStore.setItemAsync(SECURE_PASSWORD, password, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  } catch (e) {
    console.warn('[biometricLogin] save credentials failed', e?.message);
  }
}

export async function getStoredCredentials() {
  if (Platform.OS === 'web') return null;
  try {
    let email = await SecureStore.getItemAsync(SECURE_EMAIL);
    let password = await SecureStore.getItemAsync(SECURE_PASSWORD);
    if (!email || !password) {
      email = await SecureStore.getItemAsync(LEGACY_EMAIL);
      password = await SecureStore.getItemAsync(LEGACY_PASSWORD);
      if (email && password) {
        await SecureStore.setItemAsync(SECURE_EMAIL, email.trim(), {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
        await SecureStore.setItemAsync(SECURE_PASSWORD, password, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
        await SecureStore.deleteItemAsync(LEGACY_EMAIL);
        await SecureStore.deleteItemAsync(LEGACY_PASSWORD);
      }
    }
    if (email && password) return { email, password };
  } catch (_) {}
  return null;
}

export async function canUseBiometricLogin() {
  if (Platform.OS === 'web') return false;
  try {
    const pref = await getBiometricPrefEnabled();
    if (!pref) return false;
    const creds = await getStoredCredentials();
    if (!creds) return false;
    const hasHw = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHw && enrolled;
  } catch (_) {
    return false;
  }
}

/**
 * When biometric is enabled in settings, show the login UI (hint or button).
 * readyToSignIn: saved credentials exist — user can use Face ID / fingerprint.
 */
export async function getBiometricLoginScreenState() {
  if (Platform.OS === 'web') {
    return { showSection: false, readyToSignIn: false };
  }
  try {
    const pref = await getBiometricPrefEnabled();
    if (!pref) return { showSection: false, readyToSignIn: false };
    const hasHw = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHw || !enrolled) {
      return { showSection: false, readyToSignIn: false };
    }
    const creds = await getStoredCredentials();
    return {
      showSection: true,
      readyToSignIn: !!creds,
    };
  } catch (_) {
    return { showSection: false, readyToSignIn: false };
  }
}

/** Labels for login button + hints based on device biometrics (fingerprint vs Face ID). */
export async function getBiometricActionLabels() {
  const fallback = () => ({
    button: 'Sign in with fingerprint',
    hintLine:
      'Fingerprint sign-in is enabled. Sign in with your password once, then use fingerprint here.',
    settingsTitle: 'Fingerprint login',
    settingsSubtitle: 'Fingerprint on this device',
    promptMessage: 'Confirm with fingerprint',
    useFaceIcon: false,
  });

  if (Platform.OS === 'web') {
    return {
      button: 'Biometric sign-in',
      hintLine: 'Sign in with your password once to enable biometric sign-in.',
      settingsTitle: 'Biometric login',
      settingsSubtitle: 'Face ID or fingerprint on the login screen',
      promptMessage: 'Sign in',
      useFaceIcon: false,
    };
  }
  try {
    await LocalAuthentication.supportedAuthenticationTypesAsync();
  } catch (_) {
    /* fall through */
  }
  return fallback();
}

export async function promptDeviceAuthentication() {
  let promptMessage = 'Sign in';
  try {
    if (Platform.OS !== 'web') {
      const labels = await getBiometricActionLabels();
      promptMessage = labels.promptMessage;
    }
  } catch (_) {
    /* keep default */
  }
  try {
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });
    return res.success === true;
  } catch (_) {
    return false;
  }
}
