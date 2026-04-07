import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';
import { submitCompliance } from '../../api/apiService';
import * as ImagePicker from 'expo-image-picker';

const JobProofComplianceScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [photos, setPhotos] = useState([]);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Site inspection completed', done: false },
    { id: 2, task: 'Safety hazards identified and mitigated', done: false },
    { id: 3, task: 'Materials verified with customer', done: false },
    { id: 4, task: 'Working area prepared', done: false },
    { id: 5, task: 'Job specific compliance followed', done: false },
  ]);

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const pickImage = async (useCamera = false) => {
    let result;
    if (useCamera) {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to take photos.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
      });
    }

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    Alert.alert('Checked In', `You checked in at ${now.toLocaleTimeString()}`);
  };

  const handleCheckOut = () => {
    if (!checkInTime) {
      Alert.alert('Error', 'Please check in first.');
      return;
    }
    const now = new Date();
    setCheckOutTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    Alert.alert('Checked Out', `You checked out at ${now.toLocaleTimeString()}`);
  };

  const isAllDone = checklist.every(i => i.done) && photos.length > 0 && checkInTime;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Compliance & Proof</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Verification & Time</Text>
          <Text style={styles.sectionSub}>Track your arrival and departure at the site.</Text>
          
          <View style={styles.timeControlRow}>
            {!checkInTime ? (
              <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleCheckIn}>
                <Ionicons name="location" size={20} color="#FFF" />
                <Text style={styles.actionBtnText}>Check In</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.timestampBox}>
                <Text style={styles.timestampLabel}>Checked In</Text>
                <Text style={styles.timestampValue}>{checkInTime}</Text>
              </View>
            )}

            {!checkOutTime ? (
              <TouchableOpacity
                style={[styles.actionBtnSecondary, !checkInTime && { opacity: 0.5 }]}
                onPress={handleCheckOut}
                disabled={!checkInTime}
              >
                <Ionicons name="exit-outline" size={20} color="#1E293B" />
                <Text style={styles.actionBtnTextDark}>Check Out</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.timestampBox}>
                <Text style={styles.timestampLabel}>Checked Out</Text>
                <Text style={styles.timestampValue}>{checkOutTime}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Photos of Professionalism</Text>
          <Text style={styles.sectionSub}>Capture progress photos or completion results.</Text>
          
          <View style={styles.photoGrid}>
            {photos.map((photo, idx) => (
              <View key={idx} style={styles.photoWrapper}>
                <Image source={{ uri: photo }} style={styles.proofPhoto} />
                <TouchableOpacity
                  style={styles.removePhoto}
                  onPress={() => setPhotos(photos.filter((_, i) => i !== idx))}
                >
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoPlaceholder} onPress={() => pickImage(true)}>
              <Ionicons name="camera-outline" size={32} color="#CBD5E1" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Completion Checklist</Text>
          <Text style={styles.sectionSub}>Mark each task as you complete it.</Text>
          
          <View style={styles.checklist}>
            {checklist.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.checkItem}
                onPress={() => toggleCheck(item.id)}
              >
                <Ionicons
                  name={item.done ? "checkbox" : "square-outline"}
                  size={24}
                  color={item.done ? "#0062E1" : "#CBD5E1"}
                />
                <Text style={[styles.checkText, item.done && styles.checkTextDone]}>
                  {item.task}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, !isAllDone && { backgroundColor: '#CBD5E1' }]}
          disabled={!isAllDone}
          onPress={async () => {
            const res = await submitCompliance(route.params?.jobId);
            if (res.success) {
              Alert.alert('Success', 'Compliance submitted successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('WorkerTabs') }
              ]);
            } else {
              Alert.alert('Error', res.message || 'Submission failed');
            }
          }}
        >
          <Text style={styles.submitBtnText}>Submit Project Proof</Text>
        </TouchableOpacity>
        <Text style={styles.footerHint}>
          {!checkInTime ? 'Check-in required' : photos.length === 0 ? 'Photo feedback required' : !checklist.every(i => i.done) ? 'Complete the checklist' : 'Ready to submit'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#FFF',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A202C' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  scrollContent: { padding: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 20, ...SHADOWS.small },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A202C' },
  sectionSub: { fontSize: 13, color: '#718096', marginTop: 4, marginBottom: 20 },

  timeControlRow: { flexDirection: 'row', gap: 12 },
  actionBtnPrimary: { flex: 1, backgroundColor: '#0062E1', height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionBtnSecondary: { flex: 1, backgroundColor: '#F8FAFC', height: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  actionBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  actionBtnTextDark: { color: '#1E293B', fontWeight: '700', fontSize: 15 },

  timestampBox: { flex: 1, backgroundColor: '#F0F9FF', padding: 12, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#0062E1' },
  timestampLabel: { fontSize: 11, color: '#0062E1', fontWeight: '700', textTransform: 'uppercase' },
  timestampValue: { fontSize: 18, color: '#1A202C', fontWeight: '800', marginTop: 2 },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoWrapper: { width: 100, height: 100, borderRadius: 12, overflow: 'hidden' },
  proofPhoto: { width: '100%', height: '100%' },
  removePhoto: { position: 'absolute', top: 4, right: 4 },
  addPhotoPlaceholder: { width: 100, height: 100, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed' },
  addPhotoText: { fontSize: 10, color: '#718096', marginTop: 4, fontWeight: '700' },

  checklist: { gap: 14 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkText: { fontSize: 15, color: '#4A5568', fontWeight: '500' },
  checkTextDone: { color: '#CBD5E1', textDecorationLine: 'line-through' },

  footer: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', alignItems: 'center' },
  submitBtn: { backgroundColor: '#0062E1', height: 60, borderRadius: 30, width: '100%', alignItems: 'center', justifyContent: 'center', marginBottom: 10, ...SHADOWS.medium },
  submitBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  footerHint: { fontSize: 12, color: '#718096', fontWeight: '600' },
});

export default JobProofComplianceScreen;

