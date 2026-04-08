import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { SHADOWS } from '../../constants/theme';
import MenuItem from '../../components/MenuItem';
import { getProfile } from '../../api/apiService';
import { useState, useEffect } from 'react';
import storage from '../../api/storage';
import { clearBiometricSessionOnLogout } from '../../api/biometricLogin';



export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await getProfile();
      if (res.success) {
        setUser(res.data);
      } else {
        // Fallback to local storage if API fails
        const local = await storage.getItem('userData');
        if (local) setUser(JSON.parse(local));
      }
    };
    fetchUserData();
  }, []);

  const initials =
    user?.name
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || '?';

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await storage.removeItem('userToken');
          await storage.removeItem('userData');
          await clearBiometricSessionOnLogout();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            })
          );
        }
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Security')}>
          <Ionicons name="settings-outline" size={24} color="#1A202C" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Loading...'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'worker@paired.com'}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="create-outline" size={20} color="#0E56D0" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work insights</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="bar-chart-outline"
              label="Performance"
              sub="Jobs & earnings from your account"
              color="#0062E1"
              onPress={() => navigation.navigate('WorkerAnalytics')}
            />
            <MenuItem
              icon="wallet-outline"
              label="Payouts & profile"
              sub="Invoices, commission split, documents"
              color="#10B981"
              onPress={() => navigation.navigate('WorkerPayouts')}
            />
            <MenuItem
              icon="cube-outline"
              label="Quoted materials"
              sub="Line items from your job estimates"
              color="#8B5CF6"
              isLast
              onPress={() => navigation.navigate('WorkerMaterials')}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="person-outline"
              label="Personal Information"
              sub="Name, Email, Phone Number"
              color="#0E56D0"
              onPress={() => navigation.navigate('PersonalInfoWorker')}
            />
            <MenuItem
              icon="wallet-outline"
              label="Payout Methods"
              sub="Stripe, Bank Account"
              color="#10B981"
              onPress={() => navigation.navigate('PaymentMethods')}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              label="Login & Security"
              sub="Password, Biometrics"
              color="#F59E0B"
              isLast
              onPress={() => navigation.navigate('Security')}
            />
          </View>
        </View>

        {/* Professional Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="cash-outline"
              label="Earnings"
              sub="Payouts, invoices & commission"
              color="#10B981"
              onPress={() => navigation.navigate('WorkerPayouts')}
            />
            <MenuItem
              icon="star-outline"
              label="Reviews"
              sub="What customers said (web)"
              color="#F59E0B"
              onPress={() => navigation.navigate('Reviews')}
            />
            <MenuItem
              icon="notifications-outline"
              label="Notifications"
              sub="Jobs, leads, payments"
              color="#6366F1"
              onPress={() => navigation.navigate('Notifications')}
            />
            <MenuItem
              icon="briefcase-outline"
              label="Service Details"
              sub="Skills, Categories"
              color="#6366F1"
              onPress={() => navigation.navigate('ServicesOfferedWorker')}
            />
            <MenuItem
              icon="map-outline"
              label="Service Areas"
              sub="Locations you cover"
              color="#EC4899"
              onPress={() => navigation.navigate('ServiceAreasWorker')}
            />
            <MenuItem
              icon="time-outline"
              label="Working Hours"
              sub="Your weekly schedule"
              color="#8B5CF6"
              isLast
              onPress={() => navigation.navigate('WorkingHoursWorker')}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="help-circle-outline"
              label="Help Center"
              color="#718096"
              onPress={() => navigation.navigate('HelpSupport')}
            />
            <MenuItem
              icon="document-text-outline"
              label="Terms & Conditions"
              color="#718096"
              isLast
              onPress={() => navigation.navigate('Terms')}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.24 (Worker)</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E56D0',
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
    ...SHADOWS.medium,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A202C',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
    marginTop: 8,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#CBD5E0',
    fontWeight: '600',
  },
});
