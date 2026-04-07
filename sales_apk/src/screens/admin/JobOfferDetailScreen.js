import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Linking,
  Share,
  Alert,
  Dimensions,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const TABS = ['Job Details', 'Description', 'Photos', 'Updates'];
const { width: windowWidth } = Dimensions.get('window');

const CATEGORY_PHOTOS = {
    cleaning: [
      { id: 'c1', uri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80', isLocal: false },
      { id: 'c2', uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&w=500&q=80', isLocal: false },
    ],
    carpentry: [
      { id: 'cr1', uri: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=500&q=80', isLocal: false },
      { id: 'cr2', uri: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=500&q=80', isLocal: false },
    ],
    plumbing: [
      { id: 'p1', uri: 'https://images.unsplash.com/photo-1585703863435-05048259b662?auto=format&fit=crop&w=500&q=80', isLocal: false },
      { id: 'p2', uri: 'https://images.unsplash.com/photo-1607472586893-edb5caba0c71?auto=format&fit=crop&w=500&q=80', isLocal: false },
    ],
    electrical: [
      { id: 'e1', uri: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=500&q=80', isLocal: false },
      { id: 'e2', uri: 'https://images.unsplash.com/photo-1454433716411-d8ecda995bc0?auto=format&fit=crop&w=500&q=80', isLocal: false },
    ]
};

const getDefaultPhotos = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('clean')) return CATEGORY_PHOTOS.cleaning;
    if (cat.includes('carpenter') || cat.includes('wood')) return CATEGORY_PHOTOS.carpentry;
    if (cat.includes('plumb')) return CATEGORY_PHOTOS.plumbing;
    if (cat.includes('elect')) return CATEGORY_PHOTOS.electrical;
    
    // Default Fallback
    return [
      { id: 'f1', uri: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=500&q=80', isLocal: false },
      { id: 'f2', uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&w=500&q=80', isLocal: false },
    ];
};
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import { acceptLead } from '../../api/apiService';
import { getOfferPricingLines } from '../../utils/workerPricingDisplay';

const JobOfferDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Job Details');
  
  // States: pending, accepted_pricing, accepted, active
  const [jobState, setJobState] = useState(route.params?.state || 'accepted_pricing');

  useEffect(() => {
    if (route.params?.state) {
      setJobState(route.params.state);
    }
  }, [route.params?.state]);

  // Photos state
  const [jobPhotos, setJobPhotos] = useState(() => {
    const cat = route.params?.lead?.category?.name || route.params?.lead?.categoryName;
    return getDefaultPhotos(cat);
  });

  const handleAddPhoto = async (useCamera = false) => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync() 
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", `You need to allow ${useCamera ? 'camera' : 'gallery'} access to add photos.`);
      return;
    }

    const result = useCamera 
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 }) 
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
        });

    if (!result.canceled) {
      const newPhoto = { id: Date.now().toString(), uri: result.assets[0].uri, isLocal: true };
      setJobPhotos(prev => [newPhoto, ...prev]);
    }
  };

  const removePhoto = (id) => {
    setJobPhotos(prev => prev.filter(p => p.id !== id));
  };


  const leadLocation = route.params?.lead?.location || '';
  const leadPhone = route.params?.lead?.customer?.phone || route.params?.lead?.guestPhone || '';

  const handleDirections = () => {
    if (leadLocation) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(leadLocation)}`);
    } else {
      Alert.alert('Location', 'No address on file.');
    }
  };

  const handleCall = () => {
    const p = String(leadPhone).replace(/\s/g, '') || '1234567890';
    Linking.openURL(`tel:${p}`);
  };

  const handleShare = () => {
    Share.share({
      message: `Lead: ${route.params?.lead?.customer?.name || 'Customer'} — ${leadLocation}`,
    });
  };

  // Fix: define pricing from route params (lead or job)
  const pricing = getOfferPricingLines(route.params);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header Container */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-down" size={32} color="#1A202C" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconCircle} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#1A202C" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerIconCircle} 
              onPress={() => {
                Alert.alert(
                  "Job Options",
                  "Manage this job offer",
                  [
                    { text: "Report Issue", onPress: () => Alert.alert("Reported", "Our support team will review this job.") },
                    { text: "Job FAQ", onPress: () => Alert.alert("FAQ", "Check help center for worker policies.") },
                    { text: "Cancel", style: "cancel" }
                  ]
                );
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="#1A202C" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.basicInfo}>
          <View style={styles.namePriceRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.nameLine}>
                <Text style={styles.workerName}>{route.params?.lead?.customerName || route.params?.lead?.customer?.name || route.params?.lead?.guestName || 'Customer Name'}</Text>
                <View style={styles.leadBadge}><Text style={styles.leadBadgeText}>{route.params?.lead?.category?.name || route.params?.lead?.categoryName || 'SERVICE'}</Text></View>
              </View>
              <Text style={styles.address}>{route.params?.lead?.location || 'Location Address'}</Text>
              <View style={styles.distRow}>
                <Text style={styles.distText}>4.5 mi</Text>
                <View style={styles.distDot} />
                <Text style={styles.distText}>12 m</Text>
              </View>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.priceText}>{pricing.primary}</Text>
              {pricing.secondary ? <Text style={styles.perHour}>{pricing.secondary}</Text> : null}
            </View>
          </View>

          <View style={styles.actionHub}>
            <TouchableOpacity style={styles.directionsBtnFull} onPress={handleDirections} activeOpacity={0.9}>
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={styles.directionsBtnFullText}>Directions</Text>
            </TouchableOpacity>
            <View style={styles.actionRowTriplet}>
              <TouchableOpacity style={styles.compactAction} onPress={handleCall} activeOpacity={0.85}>
                <Ionicons name="call" size={22} color="#0062E1" />
                <Text style={styles.compactActionText} numberOfLines={1}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.compactAction}
                onPress={() => Alert.alert('Saved', 'Bookmarked for quick access.')}
                activeOpacity={0.85}
              >
                <Ionicons name="bookmark-outline" size={22} color="#0062E1" />
                <Text style={styles.compactActionText} numberOfLines={1}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.compactAction} onPress={handleShare} activeOpacity={0.85}>
                <Ionicons name="share-social-outline" size={22} color="#0062E1" />
                <Text style={styles.compactActionText} numberOfLines={1}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 150 }}
        stickyHeaderIndices={[0]}
      >
          <View style={{ backgroundColor: '#fff' }}>
            <View style={[styles.tabsContainer, { marginHorizontal: 20, marginBottom: 10 }]}>
              {TABS.map(tab => (
                <Pressable
                  key={tab}
                  onPress={() => {
                    console.log('Switching to:', tab);
                    setActiveTab(tab);
                  }}
                  style={({ pressed }) => [
                    styles.tabItem,
                    activeTab === tab && styles.activeTabItem,
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  <Text style={[styles.tabItemText, activeTab === tab && styles.activeTabItemText]}>{tab}</Text>
                </Pressable>
              ))}
            </View>
          </View>

        <View style={styles.mainContent}>
          {/* Image Grid - only show if on Job Details or Photos tab */}
          {(activeTab === 'Job Details' || activeTab === 'Photos') && jobPhotos.length > 0 && (
            <View style={styles.imageGrid}>
              <View style={styles.largeImgBox}>
                <Image source={typeof jobPhotos[0].uri === 'string' ? { uri: jobPhotos[0].uri } : jobPhotos[0].uri} style={styles.gridImg} />
                <View style={styles.dateTag}><Text style={styles.dateTagText}>Recent</Text></View>
              </View>
              <View style={styles.smallImgCol}>
                {jobPhotos.slice(1, 3).map((p, idx) => (
                  <View key={p.id} style={styles.smallImgBox}>
                    <Image source={typeof p.uri === 'string' ? { uri: p.uri } : p.uri} style={styles.gridImg} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tab Content */}
          {activeTab === 'Job Details' && (
            <View style={styles.list}>
              <View style={styles.listItem}>
                <Text style={styles.listLabel}>Quote</Text>
                <Text style={styles.listValue}>$1,850.00</Text>
              </View>
              <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ContractReview')}>
                <Text style={styles.listLabel}>Contract</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.listValue}>Signed, 2 Milestones</Text>
                  <Ionicons name="chevron-forward" size={16} color="#718096" />
                </View>
              </TouchableOpacity>
              <View style={styles.listItem}>
                <Text style={styles.listLabel}>Payment</Text>
                <Text style={styles.listValue}>Deposit Paid ($300)</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.listLabel}>Work Time</Text>
                <Text style={styles.listValue}>2 hrs 15 min</Text>
              </View>
            </View>
          )}

          {activeTab === 'Description' && (
            <View style={styles.tabContentBlock}>
              <Text style={styles.tabContentTitle}>Project Overview</Text>
              <Text style={styles.tabContentPara}>
                {route.params?.lead?.description || "Full wooden flooring installation for a 1200 sq ft modern apartment. Requires subfloor preparation, vapor barrier installation, and meticulous finishing around edges and corners. The client has selected premium oak hardwood planks."}
              </Text>
              <Text style={styles.tabContentSubTitle}>Special Instructions</Text>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.instructionText}>Subfloor must be completely level before starting.</Text>
              </View>
              <View style={styles.instructionItem}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.instructionText}>Acclimatize wood for at least 48 hours on site.</Text>
              </View>
            </View>
          )}

          {activeTab === 'Photos' && (
            <View style={styles.photoListGrid}>
               <TouchableOpacity 
                  style={[styles.photoItemWrapper, styles.addPhotoBox]}
                  onPress={() => {
                    Alert.alert(
                      "Add Photo",
                      "Choose an option",
                      [
                        { text: "Camera", onPress: () => handleAddPhoto(true) },
                        { text: "Gallery", onPress: () => handleAddPhoto(false) },
                        { text: "Cancel", style: "cancel" }
                      ]
                    );
                  }}
               >
                  <Ionicons name="camera-outline" size={32} color="#0062E1" />
                  <Text style={styles.addPhotoSub}>Add New</Text>
               </TouchableOpacity>

               {jobPhotos.map((item) => (
                 <View key={item.id} style={styles.photoItemWrapper}>
                    <Image source={typeof item.uri === 'string' ? { uri: item.uri } : item.uri} style={styles.photoItemImg} />
                    <TouchableOpacity 
                      style={styles.removePhotoBadge} 
                      onPress={() => {
                        Alert.alert(
                          "Delete Photo", 
                          "Are you sure you want to remove this photo?",
                          [
                            { text: "Cancel", style: "cancel" },
                            { text: "Remove", onPress: () => removePhoto(item.id), style: "destructive" }
                          ]
                        );
                      }}
                    >
                      <Ionicons name="close-circle" size={24} color="#F87171" />
                    </TouchableOpacity>
                 </View>
               ))}
            </View>
          )}

          {activeTab === 'Updates' && (
            <View style={styles.updatesTimeline}>
               <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineLine} />
                  <View style={styles.timelineContent}>
                     <Text style={styles.timelineTime}>Today, 10:30 AM</Text>
                     <Text style={styles.timelineTitle}>Job Started</Text>
                     <Text style={styles.timelineMsg}>Worker checked in at the job site.</Text>
                  </View>
               </View>
               <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineLine} />
                  <View style={styles.timelineContent}>
                     <Text style={styles.timelineTime}>Yesterday, 04:15 PM</Text>
                     <Text style={styles.timelineTitle}>Quote Approved</Text>
                     <Text style={styles.timelineMsg}>Customer approved the initial estimate of $1,850.00</Text>
                  </View>
               </View>
               <View style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: '#CBD5E1' }]} />
                  <View style={styles.timelineContent}>
                     <Text style={styles.timelineTime}>2 days ago</Text>
                     <Text style={styles.timelineTitle}>Lead Created</Text>
                     <Text style={styles.timelineMsg}>New lead received via the guest platform.</Text>
                  </View>
               </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        {jobState === 'accepted' ? (
          <TouchableOpacity 
            style={styles.fullWidthBtn}
            onPress={() => navigation.navigate('QuoteScope', { job: route.params?.lead || {}, role: 'worker' })}
          >
            <Text style={styles.btnText}>Create Quote for Job</Text>
          </TouchableOpacity>
        ) : jobState === 'active' ? (
          <TouchableOpacity 
            style={[styles.fullWidthBtn, { backgroundColor: '#10B981' }]}
            onPress={() => {
              const jid = route.params?.jobId || route.params?.lead?.job?.id;
              if (jid) navigation.navigate('JobProofCompliance', { jobId: jid });
              else Alert.alert('Open from job', 'Start work from Schedule after you have accepted the lead.');
            }}
          >
            <Text style={styles.btnText}>Start Work / Compliance</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.rejectBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.rejectBtnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.acceptBtn}
              onPress={async () => {
                const leadId = route.params?.lead?.id;
                if (leadId) {
                  const res = await acceptLead(leadId);
                  if (res.success && res.data) {
                    Alert.alert('Success', 'Lead accepted — job created. You can add a quote next.');
                    navigation.navigate('QuoteScope', { job: res.data, role: 'worker' });
                  } else {
                    Alert.alert('Error', res.message || 'Error accepting lead');
                  }
                } else {
                   Alert.alert('Missing lead', 'Open this screen from a lead in the list.');
                }
              }}
            >
              <Text style={styles.acceptBtnText}>Accept Lead</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { paddingHorizontal: 20, backgroundColor: '#fff', zIndex: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerRight: { flexDirection: 'row', gap: 12 },
  headerIconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  basicInfo: { paddingBottom: 16 },
  namePriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  workerName: { fontSize: 22, fontWeight: '800', color: '#1A202C' },
  leadBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  leadBadgeText: { color: '#8B5CF6', fontSize: 11, fontWeight: '700' },
  address: { fontSize: 13, color: '#718096', marginBottom: 4 },
  distRow: { flexDirection: 'row', alignItems: 'center' },
  distText: { fontSize: 12, color: '#718096' },
  distDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#718096', marginHorizontal: 8 },
  priceBox: { alignItems: 'flex-end' },
  priceText: { fontSize: 22, fontWeight: '800', color: '#1A202C' },
  perHour: { fontSize: 12, color: '#94A3B8', fontWeight: '400' },

  actionHub: { marginBottom: 4, gap: 12 },
  directionsBtnFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0062E1',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 28,
    width: '100%',
  },
  directionsBtnFullText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  actionRowTriplet: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },
  compactAction: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  compactActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0062E1',
    textAlign: 'center',
    width: '100%',
  },

  mainContent: { paddingHorizontal: 20 },
  imageGrid: { flexDirection: 'row', height: 420, gap: 12, marginBottom: 24 },
  largeImgBox: { flex: 2, borderRadius: 28, overflow: 'hidden' },
  smallImgCol: { flex: 1, gap: 12 },
  smallImgBox: { flex: 1, borderRadius: 24, overflow: 'hidden' },
  gridImg: { width: '100%', height: '100%' },
  dateTag: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  dateTagText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 20 },
  tabItem: { paddingVertical: 14, marginRight: 24, paddingHorizontal: 4 },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: '#008080' },
  tabItemText: { fontSize: 15, fontWeight: '700', color: '#718096' },
  activeTabItemText: { color: '#008080' },

  list: { gap: 4 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  listLabel: { fontSize: 15, color: '#718096', fontWeight: '500' },
  listValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },

  bottomBar: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  rejectBtn: { flex: 1, height: 56, backgroundColor: '#F87171', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  rejectBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  acceptBtn: { flex: 1, height: 56, backgroundColor: '#0062E1', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  acceptBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  fullWidthBtn: { width: '100%', height: 58, backgroundColor: '#0062E1', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  // New Tab Content Styles
  tabContentBlock: { marginTop: 10 },
  tabContentTitle: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 10 },
  tabContentPara: { fontSize: 15, color: '#4A5568', lineHeight: 22, marginBottom: 20 },
  tabContentSubTitle: { fontSize: 16, fontWeight: '700', color: '#1A202C', marginBottom: 12 },
  instructionItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  instructionText: { fontSize: 14, color: '#4A5568' },

  photoListGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 },
  photoItemWrapper: { width: (windowWidth - 52) / 2, height: 160, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  photoItemImg: { width: '100%', height: '100%' },

  addPhotoBox: { backgroundColor: '#F0F9FF', borderStyle: 'dashed', borderWidth: 2, borderColor: '#0062E1', alignItems: 'center', justifyContent: 'center', gap: 4 },
  addPhotoSub: { fontSize: 12, fontWeight: '700', color: '#0062E1' },
  removePhotoBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', borderRadius: 12, elevation: 2 },

  updatesTimeline: { marginTop: 10, paddingLeft: 8 },
  timelineItem: { flexDirection: 'row', gap: 16, paddingBottom: 24 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0062E1', marginTop: 4, zIndex: 2 },
  timelineLine: { position: 'absolute', left: 5, top: 16, bottom: 0, width: 2, backgroundColor: '#E2E8F0' },
  timelineContent: { flex: 1 },
  timelineTime: { fontSize: 12, color: '#718096', marginBottom: 4 },
  timelineTitle: { fontSize: 15, fontWeight: '700', color: '#1A202C', marginBottom: 2 },
  timelineMsg: { fontSize: 14, color: '#4A5568' },
});

export default JobOfferDetailScreen;
