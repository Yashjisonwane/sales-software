import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS } from '../../constants/theme';
import { getProfile } from '../../api/apiService';

const SETTINGS_OPTIONS = [
  {
    id: 'profile',
    title: 'Profile',
    icon: 'person-outline',
    screen: 'PersonalInfo',
  },
  {
    id: 'payments',
    title: 'Payment Methods',
    icon: 'card-outline', // Updated to match image style
    screen: 'PaymentMethods',
  },
  {
    id: 'preferences',
    title: 'App Preferences',
    icon: 'grid-outline', // Updated to match image style
    screen: 'AppPreferences',
  },
  {
    id: 'notifications',
    title: 'Notification Settings',
    icon: 'notifications-outline',
    screen: 'AdminNotifications',
  },
  {
    id: 'company',
    title: 'Company Info',
    icon: 'business-outline',
    screen: 'BusinessName',
  },
  {
    id: 'support',
    title: 'Help & Support',
    icon: 'headset-outline',
    screen: 'HelpSupport',
  },
];

const SettingsProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getProfile();
    if (res.success && res.data) setUser(res.data);
    else setUser(null);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings & Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : user ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryName}>{user.name}</Text>
            <Text style={styles.summaryEmail}>{user.email}</Text>
            <Text style={styles.summaryRole}>{user.role} · synced from server</Text>
          </View>
        ) : null}
        {SETTINGS_OPTIONS.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.optionCard}
            onPress={() => navigation.navigate(item.screen, { title: item.title })}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={22} color={COLORS.textPrimary} />
              </View>
              <Text style={styles.optionTitle}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  summaryCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  summaryName: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  summaryEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  summaryRole: { fontSize: 12, color: COLORS.textTertiary, marginTop: 6 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC', // Match image light gray background
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    // Subtile shadow to match image
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});

export default SettingsProfileScreen;
