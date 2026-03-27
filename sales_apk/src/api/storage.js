let AsyncStorage;
const isWeb = typeof localStorage !== 'undefined';

if (!isWeb) {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
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
      return true;
    }
    await AsyncStorage.setItem(key, value);
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
      return true;
    }
    await AsyncStorage.removeItem(key);
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
