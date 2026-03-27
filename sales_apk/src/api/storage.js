let AsyncStorage;
const isWeb = typeof localStorage !== 'undefined';

if (!isWeb) {
  try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  } catch (e) {
    console.warn('AsyncStorage focus failed, falling back to mock');
    AsyncStorage = { getItem: async () => null, setItem: async () => null, removeItem: async () => null };
  }
}

/**
 * Universal Storage Utility
 * Handles both Native (Mobile) and Web environments gracefully.
 */

export const getItem = async (key) => {
  try {
    if (isWeb) {
      return localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn(`Storage Error (getItem): ${key}`, error);
    return null;
  }
};

export const setItem = async (key, value) => {
  try {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
    return true;
  } catch (error) {
    console.warn(`Storage Error (setItem): ${key}`, error);
    return false;
  }
};

export const removeItem = async (key) => {
  try {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
    return true;
  } catch (error) {
    console.warn(`Storage Error (removeItem): ${key}`, error);
    return false;
  }
};

export default {
  getItem,
  setItem,
  removeItem
};
