import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, FONTS } from '../../constants/theme';
import { WebView } from 'react-native-webview';
import { Keyboard, TextInput } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  interpolate, 
  Extrapolate 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const StatCard = ({ icon, label, value, change, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconContainer, { backgroundColor: color + '10' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={[styles.statChange, { color: change.includes('+') ? COLORS.success : COLORS.textPrimary }]}>{change}</Text>
  </View>
);

const ProgressBar = ({ label, value, progress, color }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={[styles.progressValue, { color }]}>{value}</Text>
    </View>
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  </View>
);

const RecentActivityItem = ({ icon, color, title, subtitle, time }) => (
  <View style={styles.activityRow}>
    <View style={[styles.activityIcon, { backgroundColor: color + '10' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.activityInfo}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activitySubtitle}>{subtitle}</Text>
      {time && <Text style={styles.activityTime}>{time}</Text>}
    </View>
  </View>
);

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['18%', '40%', '92%'], []);
  const [activeTab, setActiveTab] = React.useState('Overview');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [mapUrl, setMapUrl] = React.useState('https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29446.420299690402!2d75.85792000000001!3d22.6983936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1773493713074!5m2!1sen!2sin');
  const animatedIndex = useSharedValue(0);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [0.2, 0.4, 0.6], // When moving from 40% (index ~0.5) to 92% (index 1)
      [1, 1, 0],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      animatedIndex.value,
      [0.6, 1],
      [0, 100],
      Extrapolate.CLAMP
    );
    return { opacity, transform: [{ translateY }] };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [1.3, 1.8],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map Background Overlay - Standardized for APK */}
      <View style={styles.mapBackground}>
        <WebView
          source={{ html: '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29446.420299690402!2d75.85792000000001!3d22.6983936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1773493713074!5m2!1sen!2sin" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>' }}
          style={styles.mapWebView}
          scrollEnabled={false}
        />
      </View>

      {/* Google Style Floating Search Bar exactly as in Maps screens */}
      <Animated.View style={[styles.searchContainer, { top: insets.top + 10 }, headerAnimatedStyle]}>
          <View style={styles.searchBar}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/512px-Google_Maps_icon_%282020%29.svg.png' }}
              style={styles.googleIconMap}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for Home Leads"
              placeholderTextColor="#718096"
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
            <Ionicons name="mic" size={20} color="#4A5568" style={{ marginRight: 12 }} />
            <TouchableOpacity onPress={() => navigation.navigate('AdminProfile')}>
              <Image source={{ uri: 'https://i.pravatar.cc/100?u=admin' }} style={styles.avatar} />
            </TouchableOpacity>
          </View>

          {/* New Lower Option - Dropdown Style matching Google Search */}
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
              <TouchableOpacity style={styles.overlayCloseBtn} onPress={() => setIsSearchFocused(false)}>
                 <Text style={styles.overlayCloseText}>Close Suggestions</Text>
              </TouchableOpacity>
            </View>
          )}
      </Animated.View>

      {/* Draggable Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        animatedIndex={animatedIndex}
        handleIndicatorStyle={styles.handleBar}
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        >
          <View style={styles.statsGrid}>
            <StatCard
              icon="checkmark-circle-outline"
              label="Completed Jobs"
              value="1,284"
              change="+8.5%"
              color="#10B981"
            />
            <StatCard
              icon="cash-outline"
              label="Total Revenue"
              value="$149K"
              change="+12.3%"
              color="#10B981"
            />
          </View>

          <View style={styles.revenueCard}>
            <Text style={styles.cardTitle}>Revenue Breakdown</Text>
            <ProgressBar label="Platform Fees" value="$42.3K" progress={0.4} color="#8B5CF6" />
            <ProgressBar label="Subcontract Revenue" value="$106.2K" progress={0.8} color="#10B981" />
          </View>

          <View style={styles.topPerformersCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Top Performers</Text>
              <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.performerRow}>
              <View style={[styles.performerAvatar, { backgroundColor: '#3B82F6' }]}><Text style={styles.avatarText}>JM</Text></View>
              <View style={styles.performerInfo}>
                <Text style={styles.performerName}>Sarah Johnson</Text>
                <View style={styles.badgesRow}>
                  <View style={[styles.badge, { backgroundColor: '#F5F3FF' }]}><Text style={[styles.badgeText, { color: '#8B5CF6' }]}>Technician</Text></View>
                  <View style={[styles.badge, { backgroundColor: '#ECFDF5' }]}><Text style={[styles.badgeText, { color: '#10B981' }]}>Active</Text></View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.performerRow}>
              <View style={[styles.performerAvatar, { backgroundColor: '#3B82F6' }]}><Text style={styles.avatarText}>MK</Text></View>
              <View style={styles.performerInfo}>
                <Text style={styles.performerName}>Mike Kolsun</Text>
                <View style={styles.badgesRow}>
                  <View style={[styles.badge, { backgroundColor: '#F5F3FF' }]}><Text style={[styles.badgeText, { color: '#8B5CF6' }]}>Plumber</Text></View>
                  <View style={[styles.badge, { backgroundColor: '#ECFDF5' }]}><Text style={[styles.badgeText, { color: '#10B981' }]}>Active</Text></View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.performerRow}>
              <View style={[styles.performerAvatar, { backgroundColor: '#3B82F6' }]}><Text style={styles.avatarText}>DV</Text></View>
              <View style={styles.performerInfo}>
                <Text style={styles.performerName}>David Vas</Text>
                <View style={styles.badgesRow}>
                  <View style={[styles.badge, { backgroundColor: '#F5F3FF' }]}><Text style={[styles.badgeText, { color: '#8B5CF6' }]}>Electrician</Text></View>
                  <View style={[styles.badge, { backgroundColor: '#ECFDF5' }]}><Text style={[styles.badgeText, { color: '#10B981' }]}>Active</Text></View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.recentActivityCard}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <RecentActivityItem
              icon="settings-outline"
              color="#3B82F6"
              title="John Carter completed #1024"
              subtitle="Job ID #1024 • Today, 9:30 AM"
            />
            <RecentActivityItem
              icon="checkmark-circle-outline"
              color="#10B981"
              title="Sarah Wilson joined the platform"
              subtitle="10 mins ago"
            />
            <RecentActivityItem
              icon="cash-outline"
              color="#8B5CF6"
              title="Payment of $850 to Mike Davis"
              subtitle="2 hours ago"
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>

      {/* Fixed Manage Workers Button area - fades out as sheet expands */}
      <Animated.View style={[
        styles.bottomButtonArea, 
        { paddingBottom: insets.bottom + 20 },
        buttonAnimatedStyle
      ]}>
        <TouchableOpacity
          style={styles.manageBtn}
          onPress={() => navigation.navigate('TeamAccounts')}
        >
          <Text style={styles.manageBtnText}>Manage Workers</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mapBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  mapWebView: { width: '100%', height: '100%', opacity: 0.8 },
  
  searchContainer: { position: 'absolute', left: 20, right: 20, zIndex: 10 },
  searchBar: { height: 52, backgroundColor: '#FFFFFF', borderRadius: 26, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, ...SHADOWS.medium },
  googleIconMap: { width: 30, height: 30, resizeMode: 'contain', marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#1A202C' },
  avatar: { width: 34, height: 34, borderRadius: 17, marginLeft: 6 },

  // Search UI Overlay
  googleSearchHeader: { height: 110, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F3F4' },
  googleSearchInput: { flex: 1, fontSize: 18, color: '#3C4043', marginHorizontal: 15 },
  dividerLarge: { height: 8, backgroundColor: '#F8F9FA' },
  recentLabelRow: { padding: 16 },
  recentMainTitle: { fontSize: 16, fontWeight: '700', color: '#3C4043' },
  historyRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F3F4' },
  historyIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F3F4', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  historyName: { fontSize: 16, color: '#3C4043', fontWeight: '500' },
  historySub: { fontSize: 13, color: '#70757A', marginTop: 2 },
  
  suggestionsDropdown: {
    backgroundColor: '#FFFFFF', borderRadius: 16, marginTop: 8,
    paddingVertical: 10, ...SHADOWS.large, elevation: 12, borderWidth: 1, borderColor: '#F1F3F4'
  },
  dropdownRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F7FAFC' },
  overlayCloseBtn: { padding: 12, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F3F4' },
  overlayCloseText: { color: '#0062E1', fontWeight: '600' },
  
  floatingHeader: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#000' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...SHADOWS.small },

  sheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  handleBar: {
    width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginTop: 12,
  },

  scrollContent: { padding: 20 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: (width - 52) / 2, backgroundColor: COLORS.white,
    borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  statIconContainer: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.regular, marginBottom: 4 },
  statValue: { fontSize: 26, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginBottom: 4 },
  statChange: { fontSize: 11, fontFamily: FONTS.semiBold, color: COLORS.textTertiary },

  revenueCard: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20,
    marginTop: 16, borderWidth: 1, borderColor: '#F1F5F9', ...SHADOWS.small,
  },
  topPerformersCard: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20,
    marginTop: 16, borderWidth: 1, borderColor: '#F1F5F9', ...SHADOWS.small,
  },
  recentActivityCard: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20,
    marginTop: 16, borderWidth: 1, borderColor: '#F1F5F9', ...SHADOWS.small,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary, marginBottom: 16 },
  viewAllText: { fontSize: 13, fontFamily: FONTS.regular, color: COLORS.textTertiary },

  performerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 16 },
  performerAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.bold },
  performerInfo: { flex: 1, gap: 4 },
  performerName: { fontSize: 16, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  badgesRow: { flexDirection: 'row', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 10, fontFamily: FONTS.bold },

  progressContainer: { marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  progressValue: { fontSize: 13, fontFamily: FONTS.bold },
  progressBg: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },

  activityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  activityIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 14, fontFamily: FONTS.semiBold, color: COLORS.textPrimary },
  activitySubtitle: { fontSize: 12, fontFamily: FONTS.regular, color: COLORS.textTertiary, marginTop: 2 },
  activityTime: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.textTertiary, marginTop: 4 },

  bottomButtonArea: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'transparent', paddingHorizontal: 20, paddingBottom: 20,
    zIndex: 10
  },
  manageBtn: {
    backgroundColor: '#0E56D0', height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.medium,
  },
  manageBtnText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.bold },
});
