import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../../constants/theme';

export default function CertificationsScreen({ navigation }) {
  const [certs, setCerts] = useState([
    { id: 1, name: 'Master Plumber License', isVerified: true, date: 'Expires 2025' },
    { id: 2, name: 'Liability Insurance', isVerified: false, date: 'Pending Verification' },
  ]);

  const handleUpload = () => {
    Alert.alert("Upload", "Please select a document from your gallery.");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Certifications</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.uploadBox} onPress={handleUpload}>
          <View style={styles.uploadIconBg}>
            <Ionicons name="cloud-upload" size={30} color="#8B5CF6" />
          </View>
          <Text style={styles.uploadTitle}>Upload New Document</Text>
          <Text style={styles.uploadDesc}>PDF, JPG or PNG (Max 5MB)</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Your Documents</Text>
        {certs.map((cert) => (
          <View key={cert.id} style={styles.certCard}>
            <View style={styles.certIconBg}>
              <Ionicons name="document-text" size={24} color={cert.isVerified ? COLORS.success : '#8B5CF6'} />
            </View>
            <View style={styles.certBody}>
              <Text style={styles.certName}>{cert.name}</Text>
              <Text style={styles.certDate}>{cert.date}</Text>
            </View>
            {cert.isVerified ? (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={() => Alert.alert("Wait", "Your document is being reviewed.")}>
                <Text style={styles.pendingText}>Under Review</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: COLORS.white,
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 20 },
  uploadBox: {
    backgroundColor: COLORS.white, borderRadius: 24, padding: 30, alignItems: 'center',
    borderWidth: 2, borderColor: '#8B5CF6', borderStyle: 'dashed', marginBottom: 30,
  },
  uploadIconBg: { width: 60, height: 60, borderRadius: 20, backgroundColor: '#F5F3FF', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  uploadTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  uploadDesc: { fontSize: 13, color: COLORS.textTertiary, marginTop: 5 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 15 },
  certCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    padding: 16, borderRadius: 16, marginBottom: 12, ...SHADOWS.small,
  },
  certIconBg: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  certBody: { flex: 1 },
  certName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  certDate: { fontSize: 12, color: COLORS.textTertiary, marginTop: 3 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  verifiedText: { fontSize: 11, fontWeight: '700', color: COLORS.success },
  pendingText: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
});
