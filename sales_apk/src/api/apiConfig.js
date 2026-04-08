// Centralized API Configuration for APK Professionals
import Constants from 'expo-constants';

/** If Expo does not expose debuggerHost, set this to your PC IPv4 (ipconfig). Android emulator: try 10.0.2.2 */
const FALLBACK_LAN_HOST = '192.168.1.27';

const BACKEND_PORT = 4000;

function hostFromDevUri(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    if (value.includes('://')) {
      return new URL(value).hostname || null;
    }
    return value.split(':')[0] || null;
  } catch {
    return value.split(':')[0] || null;
  }
}

function resolveDevHost() {
  const raw =
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    Constants.expoConfig?.hostUri;
  const host = hostFromDevUri(raw);
  if (host && host !== 'localhost' && host !== '127.0.0.1') return host;
  return FALLBACK_LAN_HOST;
}

// Local backend (commented as requested):
// export const API_BASE_URL = __DEV__
//   ? `http://${resolveDevHost()}:${BACKEND_PORT}/api/v1`
//   : `http://${FALLBACK_LAN_HOST}:${BACKEND_PORT}/api/v1`;

// Live Railway backend:
export const API_BASE_URL = 'https://sales-software-production.up.railway.app/api/v1';

if (__DEV__) {
  // Metro console — verify phone hits the same machine as `npm run dev` backend
  console.log('[apiConfig] Backend:', API_BASE_URL);
}

export const ENDPOINTS = {
    PROFILE: '/users/profile',
    LEADS: '/leads',
    MY_ASSIGNMENTS: '/jobs',
    UPDATE_JOB: '/jobs',
    TRACKING: '/users/location',
    AUTH: '/auth/login'
};

export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
