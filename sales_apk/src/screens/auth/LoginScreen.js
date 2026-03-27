import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, FONTS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <TouchableOpacity style={[styles.backBtn, { paddingTop: insets.top + 10 }]} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#1A202C" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Select your role to continue to your dashboard</Text>
        </View>

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleCard, { borderColor: '#8B5CF6' }]}
            onPress={() => navigation.navigate('ProLogin')}
          >
            <View style={[styles.iconBg, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="briefcase" size={40} color="#8B5CF6" />
            </View>
            <Text style={styles.roleName}>Admin</Text>
            <Text style={styles.roleDesc}>Manage jobs, leads, and workers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, { borderColor: '#0E56D0' }]}
            onPress={() => navigation.navigate('WorkerLogin')}
          >
            <View style={[styles.iconBg, { backgroundColor: '#F0F7FF' }]}>
              <Ionicons name="person" size={40} color="#0E56D0" />
            </View>
            <Text style={styles.roleName}>Worker</Text>
            <Text style={styles.roleDesc}>View assigned tasks and earnings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  backBtn: { padding: 20 },
  content: { flex: 1, paddingHorizontal: 25 },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontFamily: FONTS.bold, color: '#1A202C' },
  subtitle: { fontSize: 16, fontFamily: FONTS.regular, color: '#718096', marginTop: 10 },
  roleContainer: { gap: 20 },
  roleCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    ...SHADOWS.medium,
    alignItems: 'center',
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  roleName: { fontSize: 22, fontFamily: FONTS.bold, color: '#1A202C' },
  roleDesc: { fontSize: 14, fontFamily: FONTS.regular, color: '#718096', marginTop: 4, textAlign: 'center' },
});
