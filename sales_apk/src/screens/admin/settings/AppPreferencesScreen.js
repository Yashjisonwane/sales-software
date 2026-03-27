import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../../../constants/theme';

const AppPreferencesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(true);
  const [language, setLanguage] = useState('English');

  const PreferenceItem = ({ icon, title, value, type, onValueChange }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color={COLORS.textPrimary} />
        </View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#CBD5E1', true: '#0062E1' }}
          thumbColor={COLORS.white}
        />
      ) : (
        <TouchableOpacity style={styles.valueContainer} activeOpacity={0.7}>
          <Text style={styles.itemValue}>{value}</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Preferences</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.card}>
          <PreferenceItem 
            icon="language-outline" 
            title="Language" 
            value={language} 
            type="select" 
          />
          <View style={styles.divider} />
          <PreferenceItem 
            icon="moon-outline" 
            title="Dark Mode" 
            value={darkMode} 
            type="switch" 
            onValueChange={setDarkMode}
          />
        </View>

        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <PreferenceItem 
            icon="finger-print-outline" 
            title="Biometric Login" 
            value={biometrics} 
            type="switch" 
            onValueChange={setBiometrics}
          />
        </View>

        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <PreferenceItem 
            icon="text-outline" 
            title="Font Size" 
            value="Default" 
            type="select" 
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textTertiary, textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  card: { backgroundColor: '#F8FAFC', borderRadius: 20, padding: 8, marginBottom: 24, ...SHADOWS.small },
  itemContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.small },
  itemTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  valueContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  itemValue: { fontSize: 14, color: COLORS.textTertiary, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 12 },
});

export default AppPreferencesScreen;
