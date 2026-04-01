import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  interpolate, 
  Extrapolate 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const JobDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['18%', '40%', '92%'], []);
  const [activeTab, setActiveTab] = useState('Job Details');
  const animatedIndex = useSharedValue(0);
  const job = route.params?.job || {};

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0.6, 1],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity, pointerEvents: animatedIndex.value > 0.8 ? 'none' : 'auto' };
  });

  const tabs = ['Job Details', 'Description', 'Photos', 'Updates'];

  const isStepCompleted = (step) => {
    if (step === 'Photos') return (job.photos?.length || 0) > 0;
    if (step === 'Inspection') return !!job.inspection;
    if (step === 'Estimate') return !!job.estimate;
    return false;
  };

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

      {/* Header Container (Floating on Map) */}
      <View style={[styles.headerActions, { top: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-down" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.rightHeaderActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="call-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </TouchableOpacity>
        </View>
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
          <View style={styles.mainInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.workerName}>{job.customerName || 'Active Job'}</Text>
              <View style={[styles.newBadge, { backgroundColor: job.status === 'COMPLETED' ? '#ECFDF5' : '#F5F3FF' }]}>
                <Text style={[styles.newBadgeText, { color: job.status === 'COMPLETED' ? '#10B981' : '#8B5CF6' }]}>{job.status}</Text>
              </View>
              <Text style={styles.priceText}>${job.estimate?.amount || '0'}</Text>
            </View>
            <Text style={styles.address}>{job.location || 'No location provided'}</Text>
            <Text style={styles.distTime}>{job.categoryName || 'Service Request'}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.blueActionBtn}>
                <Ionicons name="navigate" size={18} color="#fff" />
                <Text style={styles.blueActionText}>Open Map</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.lightActionBtn} onPress={() => navigation.navigate('AdminChat', { name: job.customerName })}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#0062E1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.lightActionBtn}>
                <Ionicons name="images-outline" size={18} color="#0062E1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.lightActionBtn}>
                <Ionicons name="document-text-outline" size={18} color="#0062E1" />
              </TouchableOpacity>
            </View>

            <View style={styles.imageGrid}>
              <View style={styles.largeImgContainer}>
                <Image source={{ uri: job.photos?.[0]?.url || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400' }} style={styles.gridImg} />
                <View style={styles.timeTag}><Text style={styles.timeTagText}>Before Photo</Text></View>
              </View>
              <View style={styles.smallImgsColumn}>
                <View style={styles.smallImgContainer}>
                  <Image source={{ uri: job.photos?.[1]?.url || 'https://images.unsplash.com/photo-1621905252507-b354bcadcabc?auto=format&fit=crop&q=80&w=200' }} style={styles.gridImg} />
                  <View style={styles.timeTag}><Text style={styles.timeTagText}>Site Scan</Text></View>
                </View>
                <View style={styles.smallImgContainer}>
                  <Image source={{ uri: job.photos?.[2]?.url || 'https://images.unsplash.com/photo-1517646280104-a63870634676?auto=format&fit=crop&q=80&w=200' }} style={styles.gridImg} />
                  <View style={styles.timeTag}><Text style={styles.timeTagText}>Inventory</Text></View>
                </View>
              </View>
            </View>

            <View style={styles.tabsRow}>
              {tabs.map(tab => (
                <TouchableOpacity 
                  key={tab} 
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.detailsList}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Job Ref ID</Text>
                <Text style={styles.detailValue}>{job.jobNo || job.id?.slice(0,8)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Professional</Text>
                <Text style={styles.detailValue}>{job.workerName || 'Awaiting'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Work Progress</Text>
                <Text style={[styles.detailValue, { color: isStepCompleted('Photos') ? '#10B981' : '#718096' }]}>
                  {isStepCompleted('Photos') ? 'Active Site' : 'No Photos Yet'}
                </Text>
              </View>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>

      {/* Bottom Buttons - Fixed at bottom of screen, over the sheet if expanded */}
      <Animated.View style={[styles.bottomButtons, { paddingBottom: insets.bottom + 20 }, buttonAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.assignBtn}
          onPress={() => navigation.navigate('AssignJob')}
        >
          <Text style={styles.btnText}>Assign</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quoteBtn}
          onPress={() => navigation.navigate('QuoteScope')}
        >
          <Text style={styles.btnText}>Create Quote</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mapBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  mapImage: { width: '100%', height: '100%', opacity: 0.6 },
  headerActions: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  rightHeaderActions: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...SHADOWS.small },
  
  sheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },

  scrollContent: { padding: 0 },
  mainInfo: { padding: 20 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  workerName: { fontSize: 24, fontWeight: '700', color: '#1A202C', flex: 1 },
  newBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginRight: 15 },
  newBadgeText: { color: '#8B5CF6', fontSize: 12, fontWeight: '700' },
  priceText: { fontSize: 22, fontWeight: '700', color: '#1A202C' },
  perHour: { fontSize: 12, color: '#718096', fontWeight: '400' },
  address: { fontSize: 14, color: '#718096', marginBottom: 6 },
  distTime: { fontSize: 14, color: '#718096', marginBottom: 20 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  blueActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0E56D0', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 25, flex: 1.2, marginRight: 8 },
  blueActionText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  lightActionBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 8 },

  imageGrid: { flexDirection: 'row', height: 400, gap: 10, marginBottom: 24 },
  largeImgContainer: { flex: 2, borderRadius: 20, overflow: 'hidden', position: 'relative' },
  smallImgsColumn: { flex: 1, gap: 10 },
  smallImgContainer: { flex: 1, borderRadius: 20, overflow: 'hidden', position: 'relative' },
  gridImg: { width: '100%', height: '100%' },
  timeTag: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  timeTagText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 20 },
  tab: { paddingVertical: 12, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#0E56D0' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#718096' },
  activeTabText: { color: '#0E56D0' },

  detailsList: { gap: 20 },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 15, color: '#718096' },
  detailValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },

  bottomButtons: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 20,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9',
    zIndex: 10
  },
  assignBtn: { flex: 1, height: 56, backgroundColor: '#10B981', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  quoteBtn: { flex: 1, height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default JobDetailsScreen;
