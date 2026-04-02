import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { WebView } from 'react-native-webview';
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Keyboard } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  interpolate, 
  Extrapolate 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const CARD_MARGIN = 16;
const SCROLL_PADDING = 16;
const IMAGE_GAP = 10;
// Formula: (Total Width - Card Margins - Scroll View Paddings - Gap between 2 images) / 2
const IMAGE_WIDTH = (width - (CARD_MARGIN * 2) - (SCROLL_PADDING * 2) - IMAGE_GAP) / 2;
const SNAP_INTERVAL = IMAGE_WIDTH + IMAGE_GAP;

const getImgSource = (img) => {
  if (!img) return require('../../assets/images/wood_flooring_job.png');
  if (typeof img === 'number') return img;
  if (typeof img === 'string') {
    if (img.startsWith('http') || img.startsWith('file') || img.startsWith('content')) {
      return { uri: img };
    }
    // Fallback for relative paths if server base is known
    return { uri: img }; 
  }
  if (img.uri) return img;
  return require('../../assets/images/wood_flooring_job.png');
};

const getCategoryImages = (category) => {
  const cat = (category || '').toLowerCase();
  
  // High-quality professional mapping
  if (cat.includes('floor')) return [
    require('../../assets/images/wood_flooring_job.png'), 
    require('../../assets/images/modern_kitchen_flooring.png')
  ];
  if (cat.includes('garden') || cat.includes('landscap')) return [
    { uri: 'https://images.unsplash.com/photo-1558905619-1af480bdd634?auto=format&fit=crop&q=80&w=500' }, 
    require('../../assets/images/construction_site_overview.png')
  ];
  if (cat.includes('paint')) return [
    { uri: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=500' }, 
    { uri: 'https://images.unsplash.com/photo-1595844730298-b960ff98fee0?auto=format&fit=crop&q=80&w=500' }
  ];
  if (cat.includes('carpenter') || cat.includes('wood')) return [
    require('../../assets/images/wood_flooring_job.png'),
    { uri: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=500' }
  ];
  if (cat.includes('plumb')) return [
    { uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=500' },
    { uri: 'https://images.unsplash.com/photo-1621905252507-b354bcadcabc?auto=format&fit=crop&q=80&w=500' }
  ];
  if (cat.includes('electric')) return [
    { uri: 'https://images.unsplash.com/photo-1621905181192-299e4d2b1bf6?auto=format&fit=crop&q=80&w=500' },
    { uri: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=500' }
  ];
  if (cat.includes('roof')) return [
    { uri: 'https://images.unsplash.com/photo-1632759162402-9993358825d1?auto=format&fit=crop&q=80&w=500' },
    require('../../assets/images/construction_site_overview.png')
  ];
  
  // Universal Fallback array to ensure no blanks
  return [
    require('../../assets/images/wood_flooring_job.png'),
    require('../../assets/images/construction_site_overview.png')
  ];
};

const JobCard = ({ name, id, tag, time, images, address, jobType, onPress }) => (
  <View style={styles.jobCard}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.jobImages}
      contentContainerStyle={styles.jobImagesContent}
      snapToInterval={SNAP_INTERVAL}
      decelerationRate="fast"
    >
      {(images && images.length > 0 ? images : getCategoryImages(jobType)).map((img, i) => (
        <Image 
          key={i} 
          source={getImgSource(img.url || img)} 
          style={[styles.jobImage, { width: IMAGE_WIDTH }]} 
          defaultSource={require('../../assets/images/wood_flooring_job.png')}
        />
      ))}
    </ScrollView>

    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.jobInfo}>
      <View style={styles.jobInfoHeader}>
        <View>
          <Text style={styles.jobName}>{name}</Text>
          <Text style={styles.jobId}>{id}</Text>
        </View>
        <View style={[styles.tagBadge, { backgroundColor: tag === 'Quoted' ? '#ECFDF5' : '#F0F9FF' }]}>
          <Text style={[styles.tagText, { color: tag === 'Quoted' ? '#10B981' : '#0EA5E9' }]}>{tag}</Text>
        </View>
      </View>

      <Text style={styles.jobSubText}>{address}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.jobType}>{jobType}</Text>
        <Text style={styles.jobTime}>{time}</Text>
      </View>

      <View style={styles.jobActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <View style={styles.actionIconBg}>
            <Ionicons name="navigate-outline" size={18} color="#0E56D0" />
            <Text style={[styles.actionBtnText, { color: '#0E56D0' }]}>Directions</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <View style={styles.actionIconBg}>
            <Ionicons name="call-outline" size={18} color="#0E56D0" />
            <Text style={[styles.actionBtnText, { color: '#0E56D0' }]}>Call</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <View style={styles.actionIconBg}>
            <Ionicons name="chatbubble-outline" size={18} color="#0E56D0" />
            <Text style={[styles.actionBtnText, { color: '#0E56D0' }]}>Chat</Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </View>
);


export default function JobsListScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const worker = route.params?.worker;
  const bottomSheetRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['18%', '40%', '92%'], []);
  const [activeTab, setActiveTab] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [allJobs, setAllJobs] = React.useState([]);
  const [mapUrl, setMapUrl] = React.useState('https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29446.420299690402!2d75.85792000000001!3d22.6983936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1773493713074!5m2!1sen!2sin');
  const animatedIndex = useSharedValue(0);

  const legendAnimatedStyle = useAnimatedStyle(() => {
    const bottom = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [height * 0.18 + 10, height * 0.40 + 10, height * 0.92 + 10]
    );
    const opacity = interpolate(
      animatedIndex.value,
      [1.4, 1.8],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { bottom, opacity };
  });

  React.useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const { getAllJobs } = require('../../api/apiService');
        const res = await getAllJobs();
        if (res.success) {
          // If a worker was passed, filter for that worker. Else show all.
          let filtered = res.data;
          if (worker) {
            filtered = res.data.filter(j => j.workerId === worker.id);
          }
          setAllJobs(filtered);
        }
      } catch (err) {
        console.log('Error fetching jobs:', err);
      }
    };
    fetchAllJobs();
  }, [worker]);

  const filteredJobs = allJobs.filter(j => {
    const matchesSearch = j.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         j.location?.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'All') return matchesSearch;
    // Map UI tabs to backend status
    const statusMap = { 'New': 'ACCEPTED', 'Assigned': 'ACCEPTED', 'Quoted': 'QUOTED', 'In Progress': 'IN_PROGRESS' };
    return matchesSearch && j.status === statusMap[activeTab];
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map Background Overlay */}
      <View style={styles.mapBackground}>
        <WebView
          source={{ html: `<iframe src="${mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>` }}
          style={styles.mapWebView}
          scrollEnabled={false}
        />
        {/* Floating Legend for Map background */}
        <Animated.View style={[styles.legendContainer, legendAnimatedStyle]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
            <View style={[styles.legendChip, { backgroundColor: '#8B5CF6' }]}><Text style={styles.legendText}>Lead Jobs</Text></View>
            <View style={[styles.legendChip, { backgroundColor: '#10B981' }]}><Text style={styles.legendText}>Subcontract</Text></View>
            <View style={[styles.legendChip, { backgroundColor: '#EF4444' }]}><Text style={styles.legendText}>Delay</Text></View>
          </ScrollView>
        </Animated.View>
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
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        >
          {/* Tabs Section */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.tabsWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                {['All', 'New', 'Assigned', 'Quoted', 'In Progress'].map(tab => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                  >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Search Section */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#1A202C" />
              <TextInput
                style={[styles.searchInput, { color: '#1A202C', marginLeft: 10 }]}
                placeholder="Search location here"
                placeholderTextColor="#A0AEC0"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => {
                  if (searchQuery.trim()) {
                    setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
                    setIsSearchFocused(false);
                    Keyboard.dismiss();
                  }
                }}
              />
              <Ionicons name="mic" size={20} color="#1A202C" />
            </View>

            {/* Suggestions Dropdown (Lower Option) */}
            {isSearchFocused && (
              <View style={styles.suggestionsDropdown}>
                <View style={styles.recentLabelRow}><Text style={styles.recentMainTitle}>Recent</Text></View>
                {[
                  { name: 'Indore Marriott Hotel', icon: 'location-sharp', addr: 'H-2 Scheme No 54...' },
                  { name: 'Railway Station', icon: 'time-outline', addr: 'Bajariya, Bhopal...' }
                ].map((item, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.dropdownRow}
                    onPress={() => {
                      setSearchQuery(item.name);
                      setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(item.name)}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
                      setIsSearchFocused(false);
                      Keyboard.dismiss();
                    }}
                  >
                    <View style={styles.historyIconBox}><Ionicons name={item.icon} size={20} color="#5F6368" /></View>
                    <View><Text style={styles.historyName}>{item.name}</Text><Text style={styles.historySub}>{item.addr}</Text></View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.closeDropdownBtn} onPress={() => setIsSearchFocused(false)}>
                   <Text style={styles.closeDropdownText}>Close Suggestions</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {filteredJobs.map((job, index) => (
            <JobCard
              key={job.id}
              name={job.customerName || 'Customer'}
              id={`#J-${job.id.slice(-4).toUpperCase()}`}
              tag={job.status}
              time={`Scheduled: ${new Date(job.scheduledDate).toLocaleDateString()}`}
              address={job.location}
              jobType={job.categoryName}
              images={getCategoryImages(job.categoryName)}
              onPress={() => navigation.navigate('JobDetails', { job })}
            />
          ))}
        </BottomSheetScrollView>
      </BottomSheet>

      {/* Google Style Search Overlay for consistency */}
      {isSearchFocused && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFF', zIndex: 2000 }]}>
           <View style={[styles.googleHeaderClone, { paddingTop: insets.top + 10 }]}>
              <TouchableOpacity onPress={() => setIsSearchFocused(false)}>
                <Ionicons name="arrow-back" size={24} color="#5F6368" />
              </TouchableOpacity>
              <TextInput
                style={styles.googleInputClone}
                placeholder="Search here"
                autoFocus={true}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => {
                  setIsSearchFocused(false);
                  if (searchQuery.trim()) {
                    setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
                  }
                }}
              />
              <Ionicons name="mic" size={24} color="#EA4335" />
           </View>
           <ScrollView>
             <View style={styles.googleHistoryDivider} />
             <View style={styles.recentLabelContainer}><Text style={styles.recentLabelTitle}>Recent</Text></View>
             {[
               { name: 'Indore Marriott Hotel', addr: 'H-2 Scheme No 54, Meghdhoot Garden...', icon: 'location-sharp' },
               { name: 'marriott hotels & resorts', addr: '', icon: 'time-outline' },
               { name: 'Bhopal Memorial Hospital', addr: 'Bhopal Bypass Road, BMHRC Campu...', icon: 'time-outline' },
             ].map((item, idx) => (
                <TouchableOpacity 
                   key={idx} 
                   style={styles.googleHistoryRow}
                   onPress={() => {
                      setSearchQuery(item.name);
                      setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(item.name)}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
                      setIsSearchFocused(false);
                      Keyboard.dismiss();
                   }}
                >
                  <View style={styles.historyIconCircle}><Ionicons name={item.icon} size={20} color="#5F6368" /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyNameText}>{item.name}</Text>
                    {item.addr ? <Text style={styles.historyAddrText}>{item.addr}</Text> : null}
                  </View>
                </TouchableOpacity>
             ))}
           </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mapBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  mapWebView: { width: '100%', height: '100%', opacity: 0.8 },
  
  legendContainer: { position: 'absolute', left: 0, right: 0, zIndex: 100 },
  legendChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, ...SHADOWS.small },
  legendText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  
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
    marginBottom: 8,
  },
  
  // Google Clone Styles for Consistency
  googleHeaderClone: { height: 110, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F3F4' },
  googleSearchInput: { flex: 1, fontSize: 18, color: '#3C4043', marginHorizontal: 15 },
  dividerLarge: { height: 8, backgroundColor: '#F8F9FA' },
  recentLabelRow: { padding: 16 },
  recentMainTitle: { fontSize: 16, fontWeight: '700', color: '#3C4043' },
  historyIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F3F4', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  historyName: { fontSize: 16, color: '#3C4043', fontWeight: '500' },
  historySub: { fontSize: 13, color: '#70757A', marginTop: 2 },
  
  suggestionsDropdown: {
    backgroundColor: '#FFFFFF', borderRadius: 16, marginTop: 8,
    paddingVertical: 10, ...SHADOWS.large, elevation: 15, borderWidth: 1, borderColor: '#F1F3F4'
  },
  dropdownRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F7FAFC' },
  closeDropdownBtn: { padding: 14, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F3F4' },
  closeDropdownText: { color: '#0062E1', fontWeight: '600' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    backgroundColor: '#fff',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  tabsWrapper: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tabsContainer: { gap: 24, paddingRight: 20 },
  tab: { paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#0E56D0' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#718096' },
  activeTabText: { color: '#0E56D0' },

  scrollContent: { paddingBottom: 20 },
  searchSection: { padding: 16, backgroundColor: '#fff' },
  searchBar: {
    height: 56, backgroundColor: '#fff', borderRadius: 28,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
    ...SHADOWS.small,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#1A202C', marginLeft: 12 },
  statusChipsRow: { marginBottom: 4 },
  statusChip: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    marginRight: 10,
  },
  activeStatusChip: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
  statusChipText: { fontSize: 14, color: '#718096', fontWeight: '500' },
  activeStatusChipText: { color: '#fff', fontWeight: '700' },

  jobCard: {
    backgroundColor: '#fff', borderRadius: 24, marginHorizontal: 16, marginBottom: 16,
    ...SHADOWS.medium, borderWidth: 1, borderColor: '#F1F5F9', overflow: 'hidden'
  },
  jobImages: { height: 160 },
  jobImagesContent: { padding: 12, gap: 10 },
  jobImage: { height: '100%', borderRadius: 16, backgroundColor: '#F8FAFC' },
  jobInfo: { padding: 16, paddingTop: 0 },
  jobInfoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  jobName: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
  jobId: { fontSize: 12, color: '#718096', marginTop: 2 },
  tagBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '700' },
  jobSubText: { fontSize: 13, color: '#718096', marginBottom: 12 },
  jobType: { fontSize: 14, fontWeight: '700', color: '#0E56D0' },
  jobTime: { fontSize: 12, color: '#718096' },
  jobActions: { flexDirection: 'row', gap: 8, marginTop: 16, pt: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  actionBtn: { flex: 1 },
  actionIconBg: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 44, backgroundColor: '#F0F7FF', borderRadius: 12 },
  actionBtnText: { fontSize: 11, fontWeight: '700' },
});
