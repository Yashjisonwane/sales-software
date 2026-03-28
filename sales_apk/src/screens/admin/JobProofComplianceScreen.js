import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import { submitCompliance } from '../../api/apiService';

const JobProofComplianceScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState([
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400',
    'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=400',
  ]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Proof & Compliance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>GPS-Stamped Photos</Text>
          <Text style={styles.sectionSub}>Capture location-verified photos as proof of work.</Text>
          <Text style={styles.infoNote}>Photos are automatically stamped with time and GPS location.</Text>

          <View style={styles.photoGrid}>
            {photos.map((photo, idx) => (
              <Image key={idx} source={{ uri: photo }} style={styles.proofPhoto} />
            ))}
            <TouchableOpacity style={styles.addPhotoPlaceholder}>
              <Ionicons name="camera-outline" size={32} color="#CBD5E1" />
            </TouchableOpacity>
          </View>

          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.retakeBtn}>
              <Text style={styles.retakeBtnText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadBtn}>
              <Ionicons name="camera" size={20} color={COLORS.white} />
              <Text style={styles.uploadBtnText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Time-On-Site Verification</Text>
          <Text style={styles.sectionSub}>Track when work started and finished at the job site.</Text>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Check-In Time</Text>
            <Text style={styles.timeValue}>8:30 AM</Text>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Check-Out Time</Text>
            <Text style={styles.timeValue}>2:15 PM</Text>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Total Time on Site</Text>
            <Text style={styles.timeValue}>5h 45m</Text>
          </View>
          <View style={[styles.timeRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.timeLabel}>Status</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Completion Checklist</Text>
          <Text style={styles.sectionSub}>Final checks before submitting for approval.</Text>
          {/* Checklist items could go here */}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={async () => {
            const res = await submitCompliance(route.params?.jobId);
            if(res?.success) {
               alert('Job Submitted for Approval!');
               navigation.reset({ index: 0, routes: [{ name: 'WorkerTabs' }] });
            } else {
               alert('Error submitting job proof: ' + (res?.message || 'Unknown error'));
            }
          }}
        >
          <Text style={styles.submitBtnText}>Submit for Approval</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveDraftBtn}>
          <Text style={styles.saveDraftText}>Save Draft</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  scrollContent: { padding: 16 },
  card: { backgroundColor: '#F8FAFC', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  sectionSub: { fontSize: 13, color: COLORS.textTertiary, marginTop: 4 },
  infoNote: { fontSize: 12, color: COLORS.textTertiary, marginTop: 8, marginBottom: 16 },

  photoGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  proofPhoto: { width: 100, height: 100, borderRadius: 12 },
  addPhotoPlaceholder: { width: 100, height: 100, borderRadius: 12, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderStyle: 'dashed' },

  photoActions: { flexDirection: 'row', gap: 12 },
  retakeBtn: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  retakeBtnText: { fontWeight: '600', color: COLORS.textPrimary },
  uploadBtn: { flex: 1, height: 48, backgroundColor: '#0062E1', borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  uploadBtnText: { color: COLORS.white, fontWeight: '700' },

  timeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  timeLabel: { fontSize: 14, color: COLORS.textSecondary },
  timeValue: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },

  verifiedBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  verifiedText: { fontSize: 10, fontWeight: '700', color: '#16A34A' },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },
  submitBtn: { backgroundColor: '#0062E1', height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  saveDraftBtn: { height: 56, borderRadius: 28, borderWidth: 1, borderColor: '#1E293B', alignItems: 'center', justifyContent: 'center' },
  saveDraftText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '600' },
});

export default JobProofComplianceScreen;
