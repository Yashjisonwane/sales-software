import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import storage from '../../api/storage';
import { getProfile } from '../../api/apiService';

const MODULES = [
  {
    id: 'analytics',
    title: 'Data Analytics Dashboard',
    desc: 'Revenue, close rate, team performance tracking.',
    icon: 'bar-chart-outline',
    screen: 'Explore'
  },
  {
    id: 'sub-accounts',
    title: 'Team Sub-Accounts',
    desc: 'Manage roles, permissions, and job visibility.',
    icon: 'people-outline',
    screen: 'TeamAccounts'
  },
  {
    id: 'tax',
    title: 'Tax Form Tracking',
    desc: 'Auto-generate 1099s and track payments.',
    icon: 'briefcase-outline',
    screen: 'TaxTracking'
  },
  {
    id: 'inventory',
    title: 'Inventory and Parts',
    desc: 'Manage parts, stock levels, and usage.',
    icon: 'construct-outline',
    screen: 'Inventory'
  },
  {
    id: 'campaigns',
    title: 'Email Campaigns & Follow-Ups',
    desc: 'Manage lead follow-ups, promotions, and client emails.',
    icon: 'mail-outline',
    screen: 'Campaigns'
  },
  {
    id: 'notifications',
    title: 'Notifications & Alerts',
    desc: 'Real-time updates for jobs, approvals, payments, and activity.',
    icon: 'notifications-outline',
    screen: 'AdminNotifications'
  }
];

export default function AdminProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfile();
      if (res.success) {
        setUser(res.data);
      }
    };
    fetchProfile();
  }, []);
  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive', 
        onPress: async () => {
          await storage.removeItem('userToken');
          await storage.removeItem('userData');
          navigation.dispatch(CommonActions.reset({ 
            index: 0, 
            routes: [{ name: 'Welcome' }] 
          }));
        } 
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.proBtn}>
          <LinearGradient colors={['#A855F7', '#8B5CF6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.proBtnGradient}>
            <Ionicons name="sparkles" size={14} color={COLORS.white} />
            <Text style={styles.proBtnText}>Get Pro</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.profileHeaderCard}>
          <View style={styles.profileRow}>
            <Image 
              source={{ uri: user?.avatar || 'https://i.pravatar.cc/100?u=admin' }} 
              style={styles.profileAvatar} 
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{user?.name || 'Admin User'}</Text>
              <Text style={styles.profileTeam}>{user?.email || 'System Admin'}</Text>
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>Manager Account</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.manageProfileBtn}
            onPress={() => navigation.navigate('SettingsProfile')}
          >
            <Text style={styles.manageProfileBtnText}>Manage Profile</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeading}>Automation Modules</Text>

        {MODULES.map(module => (
          <TouchableOpacity
            key={module.id}
            style={styles.moduleCard}
            onPress={() => navigation.navigate(module.screen, { title: module.title })}
          >
            <View style={styles.moduleIconContainer}>
              <Ionicons name={module.icon} size={24} color={COLORS.textPrimary} />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.moduleDesc}>{module.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingBottom: 16, paddingHorizontal: 16,
    backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  proBtn: { borderRadius: 20, overflow: 'hidden' },
  proBtnGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
  proBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },

  profileHeaderCard: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, marginBottom: 24, ...SHADOWS.small, borderWidth: 1, borderColor: '#F1F5F9' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  profileAvatar: { width: 60, height: 60, borderRadius: 30 },
  profileName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  profileTeam: { fontSize: 13, color: COLORS.textTertiary, marginTop: 2 },
  roleBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  roleBadgeText: { color: '#8B5CF6', fontSize: 11, fontWeight: '600' },
  manageProfileBtn: { backgroundColor: '#0062E1', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', ...SHADOWS.medium },
  manageProfileBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },

  sectionHeading: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  moduleCard: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', gap: 16, ...SHADOWS.small, borderWidth: 1, borderColor: '#F1F5F9',
  },
  moduleIconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  moduleInfo: { flex: 1 },
  moduleTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  moduleDesc: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },

  logoutBtn: { marginTop: 20, backgroundColor: '#FEF2F2', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#EF4444', fontWeight: '700' },
});
