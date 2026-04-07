import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';
import { getLeadById } from '../../api/apiService';
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  interpolate, 
  Extrapolate 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const MetricBox = ({ label, value, color = COLORS.textPrimary }) => (
  <View style={styles.metricBox}>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

function leadApiToView(lead) {
  if (!lead) return null;
  const pref = lead.preferredWorker;
  return {
    id: lead.job?.id || lead.id,
    customerName: lead.customerName || lead.clientName || 'Unknown',
    clientName: lead.customerName || lead.clientName,
    amount: lead.job ? undefined : null,
    categoryName: lead.categoryName || 'Service',
    status: lead.status || 'New',
    scheduledTime: lead.preferredDate
      ? new Date(lead.preferredDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
      : 'Not set',
    location: lead.location || 'No address',
    address: lead.location,
    worker: pref
      ? { name: pref.name, profession: 'Preferred pro' }
      : null,
    jobNo: lead.job?.jobNo,
    leadNo: lead.displayId || lead.leadNo,
  };
}

export default function LeadDetailsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const rawJob = route.params?.job;
  const leadIdParam = route.params?.leadId;

  const initialView = useMemo(() => {
    if (!rawJob) return null;
    const merged = {
      ...rawJob,
      customerName: rawJob.customerName || rawJob.clientName || 'Unknown',
    };
    return merged;
  }, [rawJob]);

  const [jobView, setJobView] = useState(initialView);

  useEffect(() => {
    setJobView(initialView);
  }, [initialView]);

  useEffect(() => {
    const id = leadIdParam || (rawJob?.id && !rawJob?.jobNo ? rawJob.id : null);
    if (!id) return;
    let cancelled = false;
    (async () => {
      const res = await getLeadById(id);
      if (cancelled || !res.success || !res.data) return;
      const v = leadApiToView(res.data);
      if (v) setJobView((prev) => ({ ...prev, ...v }));
    })();
    return () => {
      cancelled = true;
    };
  }, [leadIdParam, rawJob?.id, rawJob?.leadNo, rawJob?.jobNo]);

  const bottomSheetRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['18%', '40%', '92%'], []);
  const animatedIndex = useSharedValue(0);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0.6, 1],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity, pointerEvents: animatedIndex.value > 0.8 ? 'none' : 'auto' };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map Background Overlay */}
      <View style={styles.mapBackground}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=400' }}
          style={styles.mapImage}
        />
      </View>

      {/* Header (Back btn) */}
      <View style={[styles.headerActions, { top: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lead Details</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Draggable Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        animatedIndex={animatedIndex}
        handleIndicatorStyle={styles.handleBar}
        backgroundStyle={styles.sheetBackground}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        >
          {/* Main Info Card Content */}
          <View style={styles.mainCardContent}>
            <View style={styles.mainHeader}>
              <View>
                <Text style={styles.customerName}>{jobView?.customerName || jobView?.clientName || 'Unknown Job'}</Text>
                <Text style={styles.jobId}>
                  {(jobView?.jobNo && `Job #${jobView.jobNo}`) ||
                    (jobView?.leadNo && `Lead #${jobView.leadNo}`) ||
                    (jobView?.id && `ID #${String(jobView.id).slice(-4).toUpperCase()}`) ||
                    'Details'}
                </Text>
              </View>
              <Text style={styles.priceText}>
                {(() => {
                  const a = jobView?.estimate?.amount ?? jobView?.invoice?.amount ?? jobView?.amount;
                  return a != null && a !== ''
                    ? `$${Number(a).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : '—';
                })()}
              </Text>
            </View>

            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: '#F5F3FF' }]}>
                <Text style={[styles.badgeText, { color: '#8B5CF6' }]}>{jobView?.categoryName || 'Service'}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.badgeText, { color: '#0062E1' }]}>{jobView?.status || 'New'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color={COLORS.textTertiary} />
              <Text style={styles.infoText}>{jobView?.scheduledTime || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={COLORS.textTertiary} />
              <Text style={styles.infoText}>{jobView?.location || jobView?.address || 'No address'}</Text>
            </View>

            <Text style={styles.sectionTitle}>Job Photos</Text>
            <View style={styles.photosRow}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=200' }}
                style={styles.jobPhoto}
              />
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1621905252507-b354bcadcabc?auto=format&fit=crop&q=80&w=200' }}
                style={styles.jobPhoto}
              />
            </View>

            {/* Assigned Worker Section */}
            {jobView?.worker && (
              <>
                <Text style={styles.sectionTitle}>Assigned Worker</Text>
                <View style={styles.workerCard}>
                  <View style={styles.workerHeader}>
                    <View style={styles.workerAvatar}>
                      <Text style={styles.avatarText}>{jobView.worker?.name?.charAt(0) || 'W'}</Text>
                    </View>
                    <View style={styles.workerInfo}>
                      <Text style={styles.workerName}>{jobView.worker?.name}</Text>
                      <View style={styles.badgeRow}>
                        <View style={[styles.badge, { backgroundColor: '#F5F3FF' }]}>
                          <Text style={[styles.badgeText, { color: '#8B5CF6' }]}>{jobView.worker?.profession || 'Pro'}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: '#ECFDF5' }]}>
                          <Text style={[styles.badgeText, { color: '#10B981' }]}>Active</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>

      {/* Bottom Actions Fixed - Fades on expand */}
      <Animated.View style={[styles.bottomActions, { paddingBottom: insets.bottom + 20 }, buttonAnimatedStyle]}>
        <TouchableOpacity style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>View Job</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryAction}>
          <Text style={styles.secondaryActionText}>Reassign</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryAction}>
          <Text style={styles.primaryActionText}>Message</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mapBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  mapImage: { width: '100%', height: '100%', opacity: 0.6 },
  headerActions: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...SHADOWS.small },
  
  sheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  handleBar: {
    width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginTop: 12,
  },

  scrollContent: { padding: 0 },
  mainCardContent: { padding: 20 },
  mainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  customerName: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  jobId: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.textTertiary, marginTop: 2 },
  priceText: { fontSize: 22, fontFamily: FONTS.bold, color: '#10B981' },

  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontFamily: FONTS.semiBold },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  infoText: { fontSize: 14, fontFamily: FONTS.regular, color: COLORS.textSecondary },

  sectionTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginTop: 10, marginBottom: 12 },
  photosRow: { flexDirection: 'row', gap: 12 },
  jobPhoto: { width: (width - 56) / 2, height: 120, borderRadius: 12 },

  workerCard: {
    backgroundColor: '#F8FAFC', borderRadius: 24, padding: 20,
    marginTop: 8,
  },
  workerHeader: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  workerAvatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#0062E1',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontFamily: FONTS.bold, color: COLORS.white },
  workerInfo: { flex: 1, justifyContent: 'center' },
  workerName: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginBottom: 4 },

  metricsRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16,
    paddingVertical: 16,
  },
  metricBox: { flex: 1, alignItems: 'center' },
  metricValue: { fontSize: 18, fontFamily: FONTS.bold, marginBottom: 4 },
  metricLabel: { fontSize: 10, fontFamily: FONTS.regular, color: COLORS.textTertiary, textAlign: 'center' },
  metricDivider: { width: 1, height: '60%', backgroundColor: '#E2E8F0', alignSelf: 'center' },

  bottomActions: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, paddingHorizontal: 20, paddingVertical: 20,
    flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9',
    zIndex: 10
  },
  secondaryAction: {
    flex: 1, height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#1E293B',
    alignItems: 'center', justifyContent: 'center',
  },
  secondaryActionText: { fontSize: 13, fontFamily: FONTS.semiBold, color: COLORS.textPrimary },
  primaryAction: {
    flex: 1.2, height: 52, borderRadius: 26, backgroundColor: '#0062E1',
    alignItems: 'center', justifyContent: 'center',
  },
  primaryActionText: { fontSize: 13, fontFamily: FONTS.semiBold, color: COLORS.white },
});
