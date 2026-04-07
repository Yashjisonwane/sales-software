import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SHADOWS, FONTS } from '../../constants/theme';
import {
  getJobsMap,
  getGuestNearby,
  getCategories,
  submitGuestRequest,
} from '../../api/apiService';

const { height } = Dimensions.get('window');

const DEFAULT_LAT = 22.7196;
const DEFAULT_LNG = 75.8577;

function pinStyleFromCoords(lat, lng, items) {
  const withCoords = (items || []).filter((i) => i.latitude != null && i.longitude != null);
  if (withCoords.length === 0) return { top: '42%', left: '46%' };
  const lats = withCoords.map((i) => i.latitude);
  const lngs = withCoords.map((i) => i.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const pad = 0.12;
  const t = maxLat === minLat ? 0.5 : (lat - minLat) / (maxLat - minLat);
  const l = maxLng === minLng ? 0.5 : (lng - minLng) / (maxLng - minLng);
  const topPct = (1 - t) * (1 - 2 * pad) * 100 + pad * 100;
  const leftPct = l * (1 - 2 * pad) * 100 + pad * 100;
  return { top: `${Math.min(88, Math.max(12, topPct))}%`, left: `${Math.min(88, Math.max(8, leftPct))}%` };
}

const LocationPin = ({ color }) => (
  <View style={pinStyles.pinWrap}>
    <View style={[pinStyles.pinCircle, { backgroundColor: color }]}>
      <View style={pinStyles.pinDot} />
    </View>
    <View style={[pinStyles.pinTail, { borderTopColor: color }]} />
  </View>
);

const CurrentLocationMarker = () => (
  <View style={pinStyles.currentWrap}>
    <View style={pinStyles.blueGlow} />
    <View style={pinStyles.blueCore} />
  </View>
);

export default function GuestMapHomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [mapUrl, setMapUrl] = useState(
    `https://maps.google.com/maps?q=${DEFAULT_LAT},${DEFAULT_LNG}&z=13&ie=UTF8&iwloc=&output=embed`
  );
  const [centerLat, setCenterLat] = useState(DEFAULT_LAT);
  const [centerLng, setCenterLng] = useState(DEFAULT_LNG);
  const [mapJobs, setMapJobs] = useState([]);
  const [nearbyWorkers, setNearbyWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestOpen, setRequestOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [locationText, setLocationText] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [preferredWorkerId, setPreferredWorkerId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [mapRes, catRes] = await Promise.all([getJobsMap(), getCategories()]);
      let firstWithCoords = null;
      if (mapRes.success && mapRes.data?.length) {
        setMapJobs(mapRes.data);
        firstWithCoords = mapRes.data.find((j) => j.latitude != null && j.longitude != null);
        if (firstWithCoords) {
          setCenterLat(firstWithCoords.latitude);
          setCenterLng(firstWithCoords.longitude);
          setMapUrl(
            `https://maps.google.com/maps?q=${firstWithCoords.latitude},${firstWithCoords.longitude}&z=13&ie=UTF8&iwloc=&output=embed`
          );
        }
      } else {
        setMapJobs([]);
      }
      if (catRes.success && Array.isArray(catRes.data)) setCategories(catRes.data);
      else setCategories([]);
      const lat = firstWithCoords?.latitude ?? DEFAULT_LAT;
      const lng = firstWithCoords?.longitude ?? DEFAULT_LNG;
      const near = await getGuestNearby(lat, lng, 40);
      if (near.success && near.data?.workers) setNearbyWorkers(near.data.workers);
      else setNearbyWorkers([]);
    } catch (e) {
      console.warn('[GuestMap]', e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, []);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mapJobs;
    return mapJobs.filter(
      (j) =>
        (j.jobNo || '').toLowerCase().includes(q) ||
        (j.location || '').toLowerCase().includes(q) ||
        (j.category || '').toLowerCase().includes(q)
    );
  }, [mapJobs, searchQuery]);

  const openRequestModal = (job) => {
    setSelectedJob(job || null);
    if (job?.category) setCategoryName(job.category);
    else if (!job) setCategoryName('');
    setPreferredWorkerId(job ? nearbyWorkers[0]?.id || null : null);
    setLocationText(job?.location || '');
    setRequestOpen(true);
  };

  const handleSubmitGuest = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Required', 'Please enter name and phone.');
      return;
    }
    setSubmitting(true);
    const res = await submitGuestRequest({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      categoryName: categoryName || undefined,
      location: locationText.trim() || 'Not specified',
      description: description.trim(),
      latitude: centerLat,
      longitude: centerLng,
      preferredWorkerId: preferredWorkerId || undefined,
    });
    setSubmitting(false);
    if (res.success) {
      Alert.alert(
        'Request sent',
        `Ref: ${res.displayId || '—'}\nAdmin will review your request. You can sign in later to track with your phone.`,
        [
          { text: 'OK', onPress: () => {
            setRequestOpen(false);
            setName(''); setPhone(''); setEmail(''); setDescription(''); setLocationText('');
          }},
        ]
      );
    } else {
      Alert.alert('Could not submit', res.message || 'Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.mapWrap}>
        <WebView
          source={{
            html: `<iframe src="${mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy"></iframe>`,
          }}
          style={styles.map}
          scrollEnabled={false}
        />

        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} accessibilityLabel="Back">
            <Ionicons name="chevron-back" size={24} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.title}>Explore</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInTop}>Sign in</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.searchRow, { top: insets.top + 52 }]}>
          <View style={styles.searchBar}>
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/512px-Google_Maps_icon_%282020%29.svg.png',
              }}
              style={styles.gIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search area or address"
              placeholderTextColor="#718096"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                if (searchQuery.trim()) {
                  setMapUrl(
                    `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery.trim())}&z=13&ie=UTF8&iwloc=&output=embed`
                  );
                }
              }}
              returnKeyType="search"
            />
          </View>
        </View>

        {!loading &&
          filteredJobs.map((job) => {
            if (job.latitude == null || job.longitude == null) return null;
            const pos = pinStyleFromCoords(job.latitude, job.longitude, filteredJobs);
            return (
              <TouchableOpacity
                key={job.id}
                style={[styles.absPin, pos]}
                onPress={() => openRequestModal(job)}
                activeOpacity={0.85}
              >
                <LocationPin color={job.status === 'IN_PROGRESS' ? '#0E56D0' : '#10B981'} />
              </TouchableOpacity>
            );
          })}

        <View style={[styles.currentLoc, { top: '46%', left: '48%' }]}>
          <CurrentLocationMarker />
        </View>

        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0E56D0" />
            <Text style={styles.loadingText}>Loading map…</Text>
          </View>
        )}
      </View>

      <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.hint}>
          Browse job locations on the map. Tap a pin or send a request — no account needed.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => openRequestModal(null)} activeOpacity={0.9}>
          <Ionicons name="add-circle-outline" size={22} color="#FFF" />
          <Text style={styles.primaryBtnText}>Request a service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryBtnText}>Have an account? Log in</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={requestOpen} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Service request</Text>
            <Text style={styles.sheetSub}>
              Sent to admin as a guest lead. Add details below.
            </Text>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {selectedJob && (
                <View style={styles.jobBanner}>
                  {selectedJob.coverPhotoUrl ? (
                    <Image source={{ uri: selectedJob.coverPhotoUrl }} style={styles.jobBannerImage} />
                  ) : null}
                  <Text style={styles.jobBannerLabel}>Near job</Text>
                  <Text style={styles.jobBannerText} numberOfLines={2}>
                    {selectedJob.jobNo} · {selectedJob.location}
                  </Text>
                </View>
              )}
              <Text style={styles.label}>Name *</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" />
              <Text style={styles.label}>Phone *</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Mobile"
                keyboardType="phone-pad"
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Optional"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.label}>Service area / address</Text>
              <TextInput
                style={styles.input}
                value={locationText}
                onChangeText={setLocationText}
                placeholder="Where do you need service?"
              />
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
                {categories.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.chip, categoryName === c.name && styles.chipOn]}
                    onPress={() => setCategoryName(c.name)}
                  >
                    <Text style={[styles.chipText, categoryName === c.name && styles.chipTextOn]}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.label}>Nearby professional (optional)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
                <TouchableOpacity
                  style={[styles.chip, !preferredWorkerId && styles.chipOn]}
                  onPress={() => setPreferredWorkerId(null)}
                >
                  <Text style={[styles.chipText, !preferredWorkerId && styles.chipTextOn]}>No preference</Text>
                </TouchableOpacity>
                {nearbyWorkers.map((w) => (
                  <TouchableOpacity
                    key={w.id}
                    style={[styles.chip, preferredWorkerId === w.id && styles.chipOn]}
                    onPress={() => setPreferredWorkerId(w.id)}
                  >
                    <Text style={[styles.chipText, preferredWorkerId === w.id && styles.chipTextOn]} numberOfLines={1}>
                      {w.name} ({w.distanceKm} km)
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="What do you need?"
                multiline
              />
            </ScrollView>
            <View style={styles.sheetActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setRequestOpen(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendBtn, submitting && { opacity: 0.7 }]}
                onPress={handleSubmitGuest}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.sendBtnText}>Submit to admin</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const pinStyles = StyleSheet.create({
  pinWrap: { alignItems: 'center', width: 30, height: 40 },
  pinCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 6,
  },
  pinDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -3,
  },
  currentWrap: { alignItems: 'center', justifyContent: 'center' },
  blueGlow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(66,133,244,0.25)',
  },
  blueCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: '#FFF',
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  mapWrap: { flex: 1, position: 'relative' },
  map: { flex: 1, backgroundColor: '#E8EEF4' },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 20,
  },
  iconBtn: { padding: 8, minWidth: 72 },
  title: { fontSize: 17, fontFamily: FONTS.bold, color: '#1A202C' },
  signInTop: { fontSize: 15, fontFamily: FONTS.bold, color: '#0E56D0' },
  searchRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 19,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 28,
    paddingHorizontal: 14,
    height: 48,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gIcon: { width: 22, height: 22, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#1A202C', fontFamily: FONTS.regular },
  absPin: { position: 'absolute', zIndex: 12 },
  currentLoc: { position: 'absolute', zIndex: 11 },
  loading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  loadingText: { marginTop: 8, color: '#64748B', fontFamily: FONTS.regular },
  bottomPanel: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...SHADOWS.medium,
  },
  hint: { fontSize: 13, color: '#64748B', marginBottom: 12, lineHeight: 18, fontFamily: FONTS.regular },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0E56D0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOWS.small,
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontFamily: FONTS.bold },
  secondaryBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 10 },
  secondaryBtnText: { fontSize: 14, fontFamily: FONTS.bold, color: '#0E56D0' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.88,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  sheetTitle: { fontSize: 20, fontFamily: FONTS.bold, color: '#1A202C' },
  sheetSub: { fontSize: 13, color: '#718096', marginBottom: 14, marginTop: 4, fontFamily: FONTS.regular },
  jobBannerImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#E2E8F0',
  },
  jobBanner: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  jobBannerLabel: { fontSize: 11, color: '#0369A1', fontFamily: FONTS.bold, marginBottom: 4 },
  jobBannerText: { fontSize: 14, color: '#1A202C', fontFamily: FONTS.regular },
  label: { fontSize: 12, color: '#64748B', marginBottom: 6, marginTop: 10, fontFamily: FONTS.bold },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A202C',
    fontFamily: FONTS.regular,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  chips: { marginBottom: 4, maxHeight: 44 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipOn: { backgroundColor: '#E0F2FE', borderColor: '#0E56D0' },
  chipText: { fontSize: 13, color: '#475569', fontFamily: FONTS.regular },
  chipTextOn: { color: '#0E56D0', fontFamily: FONTS.bold },
  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 15, fontFamily: FONTS.bold, color: '#475569' },
  sendBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0E56D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: { fontSize: 15, fontFamily: FONTS.bold, color: '#FFF' },
});
