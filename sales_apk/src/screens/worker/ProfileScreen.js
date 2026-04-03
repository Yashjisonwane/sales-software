import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
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



export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await storage.getItem('userToken');
      if (!token) {
        setIsGuest(true);
        return;
      }
      const res = await getProfile();
      if (res.success) {
        setUser(res.data);
      } else {
        // Fallback to local storage if API fails
        const local = await storage.getItem('userData');
        if (local) setUser(JSON.parse(local));
        else setIsGuest(true);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await storage.removeItem('userToken');
          await storage.removeItem('userData');
          await storage.removeItem('userRole');
          setUser(null);
          setIsGuest(true);
        }
      },
    ]);
  };

  // Guest View
  if (isGuest) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account</Text>
        </View>
        <View style={styles.guestContainer}>
          <View style={styles.guestIconCircle}>
            <Ionicons name="person-outline" size={48} color="#0E56D0" />
          </View>
          <Text style={styles.guestTitle}>You're browsing as a Guest</Text>
          <Text style={styles.guestSubtitle}>Sign in to manage your jobs, track earnings, and access all features.</Text>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => navigation.navigate('WorkerLogin')}
          >
            <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
            <Text style={styles.signInBtnText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signUpBtn}
            onPress={() => navigation.navigate('WorkerSignup')}
          >
            <Text style={styles.signUpBtnText}>Create an Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={24} color="#1A202C" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=worker' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="create-outline" size={20} color="#0E56D0" />
          </TouchableOpacity>
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
  // ── Guest Mode Styles ──────────────────────
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  guestIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 10,
  },
  guestSubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0E56D0',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 28,
    marginBottom: 14,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  signUpBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#0E56D0',
    alignItems: 'center',
  },
  signUpBtnText: {
    color: '#0E56D0',
    fontSize: 15,
    fontWeight: '700',
  },
});
