let AsyncStorage;
const isWeb = typeof localStorage !== 'undefined';
let memoryStorage = {}; // FINAL FALLBACK: For In-Memory storage if both others fail

if (!isWeb) {
  try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  } catch (e) {
    console.warn('Native AsyncStorage not found, using memory fallback');
  }
}

/**
 * Universal Storage Utility
 * 1. Tries LocalStorage (Web)
 * 2. Tries AsyncStorage (Native Mobile)
 * 3. Tries MemoryStorage (Fallback)
 */

export const getItem = async (key) => {
  try {
    if (isWeb) return localStorage.getItem(key);
    if (AsyncStorage) return await AsyncStorage.getItem(key);
    return memoryStorage[key] || null;
  } catch (error) {
    return memoryStorage[key] || null;
  }
};

export const setItem = async (key, value) => {
  try {
    memoryStorage[key] = value; // Always save in memory as mirror
    if (isWeb) {
      localStorage.setItem(key, value);
    } else if (AsyncStorage) {
      await AsyncStorage.setItem(key, value);
    }
    return true;
  } catch (error) {
    memoryStorage[key] = value; 
    return true;
  }
};

export const removeItem = async (key) => {
  try {
    delete memoryStorage[key];
    if (isWeb) {
      localStorage.removeItem(key);
    } else if (AsyncStorage) {
      await AsyncStorage.removeItem(key);
    }
    return true;
  } catch (error) {
    delete memoryStorage[key];
    return true;
  }
};

export default {
  getItem,
  setItem,
  removeItem
};
