import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Keyboard, Image, StyleSheet as RNStyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS, FONTS } from '../../constants/theme';
import { getAvailableLeads, getWorkerJobs, getDashboardStats, getCategories } from '../../api/apiService';

const { width } = Dimensions.get('window');

const CATEGORY_STYLE_MAP = {
  'Plumbing': { icon: 'water', color: '#3B82F6', bg: '#EFF6FF' },
  'Electrical': { icon: 'flash', color: '#F59E0B', bg: '#FFFBEB' },
  'Cleaning': { icon: 'sparkles', color: '#10B981', bg: '#ECFDF5' },
  'HVAC': { icon: 'snow', color: '#06B6D4', bg: '#ECFEFF' },
  'Painting': { icon: 'color-palette', color: '#EC4899', bg: '#FDF2F8' },
  'Roofing': { icon: 'home', color: '#8B5CF6', bg: '#F5F3FF' },
};

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mapUrl, setMapUrl] = useState('https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29446.420299690402!2d75.85792000000001!3d22.6983936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1773493713074!5m2!1sen!2sin');
  
  const [services, setServices] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [leadsRes, jobsRes, statsRes, catsRes] = await Promise.all([
        getAvailableLeads(),
        getWorkerJobs(),
        getDashboardStats(),
        getCategories()
      ]);

      if (catsRes.success) {
        const enrichedCats = catsRes.data.map(cat => ({
          ...cat,
          ...(CATEGORY_STYLE_MAP[cat.name] || { icon: 'settings', color: '#718096', bg: '#EDF2F7' })
        }));
        setServices(enrichedCats);
      }

      if (jobsRes.success) {
        setActiveJobs(jobsRes.data || []);
      }

      if (statsRes.success) {
        setStats(Array.isArray(statsRes.data) ? statsRes.data : []);
      }
    } catch (error) {
      console.error('Home Fetch Error:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Categories')}
    >
      <View style={[styles.serviceIconBg, { backgroundColor: item.bg }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProCard = (job) => (
    <TouchableOpacity
      key={job.id}
      style={styles.proCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('MyRequests')}
    >
      <View style={[styles.proAvatar, { backgroundColor: COLORS.primary }]}>
        <Text style={styles.proAvatarText}>{job.customer?.name?.charAt(0) || 'C'}</Text>
      </View>
      <View style={styles.proInfo}>
        <View style={styles.proNameRow}>
          <Text style={styles.proName}>{job.customer?.name || 'Valued Customer'}</Text>
          <View style={[styles.availBadge, { backgroundColor: '#DBEAFE' }]}>
            <Text style={[styles.availText, { color: '#1E40AF' }]}>{job.status}</Text>
          </View>
        </View>
        <Text style={styles.proService}>{job.categoryName}</Text>
        <View style={styles.proMeta}>
          <Ionicons name="location" size={12} color={COLORS.textTertiary} />
          <Text style={styles.metaText} numberOfLines={1}>{job.location}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.proArrow}>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {/* Standardized Map Background */}
      <View style={styles.mapBgFull}>
        <WebView
          source={{ html: `<iframe src="${mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>` }}
          style={{ width: '100%', height: '100%', opacity: 0.8 }}
          scrollEnabled={false}
        />
      </View>

      {/* Floating Google Search Bar */}
      <View style={[styles.floatingSearch, { top: insets.top + 10 }]}>
         <View style={styles.googleSearchBar}>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/512px-Google_Maps_icon_%282020%29.svg.png' }}
              style={styles.googleIconHeader}
            />
            <TextInput
              style={styles.googleInputHeader}
              placeholder="Search services..."
              placeholderTextColor="#718096"
              value={search}
              onFocus={() => setIsSearchFocused(true)}
              onChangeText={setSearch}
              onSubmitEditing={() => {
                if (search.trim()) {
                   setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(search)}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
                   setIsSearchFocused(false);
                }
              }}
            />
            <Ionicons name="mic" size={20} color="#4A5568" style={{ marginRight: 12 }} />
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
               <Image source={{ uri: 'https://i.pravatar.cc/100?u=worker' }} style={styles.headerAvatar} />
            </TouchableOpacity>
         </View>

         {/* Dropdown Suggestions (Lower Option) */}
         {isSearchFocused && (
           <View style={styles.dropdownSuggestionsFloating}>
              <ScrollView style={{ maxHeight: 380 }}>
                {[
                  { name: 'Indore Marriott Hotel', addr: 'H-2 Scheme No 54, Meghdhoot Garden...', icon: 'location-sharp' },
                  { name: 'Savo Technologies', addr: '139 PU4, Behind C21 Mall, Vijay Nagar...', icon: 'time-outline' },
                ].map((item, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.historyRow}
                    onPress={() => {
                      setSearch(item.name);
                      setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(item.name)}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
                      setIsSearchFocused(false);
                      Keyboard.dismiss();
                    }}
                  >
                    <View style={styles.historyIconBox}><Ionicons name={item.icon} size={20} color="#5F6368" /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyName}>{item.name}</Text>
                      {item.addr && <Text style={styles.historySub}>{item.addr}</Text>}
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.closeDropdownBtn} onPress={() => setIsSearchFocused(false)}>
                   <Text style={styles.closeDropdownText}>Close Suggestions</Text>
                </TouchableOpacity>
              </ScrollView>
           </View>
         )}
      </View>

      <ScrollView 
          showsVerticalScrollIndicator={false} 
          bounces={true} 
          style={{ marginTop: 120 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
        >

        {/* Quick Stats */}
         <View style={styles.quickStats}>
          {stats.length > 0 ? (
            stats.slice(0, 3).map((stat, idx) => (
              <View key={idx} style={styles.statCard}>
                <LinearGradient
                  colors={
                    idx === 0 ? ['#EEF2FF', '#E0E7FF'] : 
                    idx === 1 ? ['#ECFDF5', '#D1FAE5'] : 
                    ['#FFFBEB', '#FEF3C7']
                  }
                  style={styles.statGradient}
                >
                  <Ionicons 
                    name={idx === 0 ? "briefcase" : idx === 1 ? "cash" : "calendar"} 
                    size={20} 
                    color={idx === 0 ? COLORS.primary : idx === 1 ? COLORS.success : COLORS.accent} 
                  />
                  <Text style={styles.statNumber}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.name}</Text>
                </LinearGradient>
              </View>
            ))
          ) : (
            <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
              <Text style={{ color: COLORS.textTertiary }}>Loading Stats...</Text>
            </View>
          )}
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Jobs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={services}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.serviceList}
            ListEmptyComponent={() => (
              <Text style={{ color: COLORS.textTertiary, padding: 10 }}>No categories available</Text>
            )}
          />
        </View>

        {/* Nearby Jobs on Map */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Jobs on Map</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See Map</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapPreview}>
            <WebView
              source={{ uri: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18858.58028280843!2d75.8879882627347!3d22.71751419965117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd3c22660a99%3A0x3a328696ff2ff06b!2sSPAN%20Architects!5e1!3m2!1sen!2sin!4v1773477204629!5m2!1sen!2sin' }}
              style={{ height: 200, borderRadius: SIZES.radiusLg }}
            />
            <View style={styles.mapOverlay}>
              <Text style={styles.mapText}>8 new jobs in your area</Text>
              <TouchableOpacity
                style={styles.mapBtn}
                onPress={() => navigation.navigate('WorkerExplore')}
              >
                <Text style={styles.mapBtnText}>View Jobs</Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Proposals / My Jobs */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Active Jobs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyRequests')}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {activeJobs.length > 0 ? (
            activeJobs.map(renderProCard)
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
               <Text style={{ color: COLORS.textTertiary }}>No active jobs assigned to you yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mapBgFull: { ...StyleSheet.absoluteFillObject, height: 260, zIndex: -1 },
  
  floatingSearch: { position: 'absolute', left: 20, right: 20, zIndex: 10 },
  googleSearchBar: { height: 52, backgroundColor: '#FFF', borderRadius: 26, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, ...SHADOWS.medium },
  googleIconHeader: { width: 30, height: 30, resizeMode: 'contain', marginRight: 10 },
  googleInputHeader: { flex: 1, fontSize: 16, color: '#1A202C' },
  headerAvatar: { width: 34, height: 34, borderRadius: 17, marginLeft: 6 },

  // Search UI Overlay Styles
  googleSearchHeader: { height: 110, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F3F4' },
  googleSearchInput: { flex: 1, fontSize: 18, color: '#3C4043', marginHorizontal: 15 },
  dividerLarge: { height: 8, backgroundColor: '#F8F9FA' },
  recentLabelRow: { padding: 16 },
  recentMainTitle: { fontSize: 16, fontWeight: '700', color: '#3C4043' },
  historyRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F3F4' },
  historyIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F3F4', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  historyName: { fontSize: 16, color: '#3C4043', fontWeight: '500' },
  historySub: { fontSize: 13, color: '#70757A', marginTop: 2 },
  
  dropdownSuggestionsFloating: {
    backgroundColor: '#FFFFFF', borderRadius: 20, marginTop: 10,
    ...SHADOWS.large, elevation: 15, borderWidth: 1, borderColor: '#F1F3F4',
    paddingVertical: 10
  },
  closeDropdownBtn: { padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F3F4' },
  closeDropdownText: { color: '#1A73E8', fontWeight: '700' },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.8)',
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 16,
    height: 50,
    ...SHADOWS.medium,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.screenPadding,
    gap: 10,
    marginTop: -15,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  statGradient: {
    padding: 14,
    alignItems: 'center',
    borderRadius: SIZES.radiusMd,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  section: {
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenPadding,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },
  serviceList: {
    paddingHorizontal: SIZES.screenPadding,
    gap: 12,
  },
  serviceCard: {
    width: 90,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    ...SHADOWS.small,
  },
  serviceIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  mapPreview: {
    marginHorizontal: SIZES.screenPadding,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  mapGradient: {
    padding: 28,
    alignItems: 'center',
    borderRadius: SIZES.radiusLg,
  },
  mapText: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  mapBtnText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  proCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.screenPadding,
    marginBottom: 10,
    padding: 14,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.small,
  },
  proAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  proAvatarText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  proInfo: {
    flex: 1,
  },
  proNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  proName: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  availBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  availText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    color: COLORS.success,
  },
  proService: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  proMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  reviewCount: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: COLORS.textTertiary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textTertiary,
  },
  metaText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textTertiary,
  },
  priceText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  proArrow: {
    padding: 4,
  },
});
