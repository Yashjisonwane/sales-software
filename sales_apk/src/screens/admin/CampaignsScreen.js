import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';
import BusinessModuleBanner from '../../components/business/BusinessModuleBanner';
import { getAdminMarketingFeed } from '../../api/apiService';

const { width } = Dimensions.get('window');

const CampaignsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Campaigns');
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [feedNote, setFeedNote] = useState('');

  const tabs = ['Campaigns', 'Templates', 'Follow-Ups'];

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getAdminMarketingFeed();
    if (res.success && res.data) {
      setActivities(res.data.activities || []);
      setFeedNote(res.data.note || '');
    } else setActivities([]);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const upgradeActivities = activities.filter((a) => a.kind === 'upgrade');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Email & Follow-Ups</Text>
        <TouchableOpacity style={styles.plusBtn} onPress={() => Alert.alert('Campaigns', 'Email campaigns need an ESP integration. Use Activity tab for live DB events.')}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabWrapper}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <BusinessModuleBanner
          title="Sample campaigns & templates"
          subtitle="Email stats below are illustrative. They can sync from your marketing or CRM tools when those are connected."
        />
        {activeTab === 'Campaigns' && (
          <View>
            <Text style={styles.sectionTitle}>Recent Campaigns</Text>
            <CampaignCard 
              title="Winter Service Special" 
              status="Active" 
              sent="1,240" 
              opened="42" 
              clicked="12" 
              date="Mar 10, 2026" 
            />
            <CampaignCard 
              title="New Feature Announcement" 
              status="Completed" 
              sent="3,500" 
              opened="38" 
              clicked="8" 
              date="Feb 28, 2026" 
            />
            <CampaignCard 
              title="Feedback Request - North Region" 
              status="Completed" 
              sent="850" 
              opened="55" 
              clicked="24" 
              date="Feb 15, 2026" 
            />
          </View>
        )}

        {activeTab === 'Templates' && (
          <View>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={COLORS.textTertiary} />
              <TextInput placeholder="Search templates..." style={styles.searchInput} />
            </View>
            <Text style={styles.sectionTitle}>Your Templates</Text>
            <TemplateItem title="Service Follow-up" type="Standard" lastActive="2 days ago" />
            <TemplateItem title="Quote Reminder" type="Automated" lastActive="Today" />
            <TemplateItem title="Seasonal Promo" type="Marketing" lastActive="1 week ago" />
            <TemplateItem title="Welcome Series" type="Onboarding" lastActive="Yesterday" />
            <TemplateItem title="Re-engagement" type="Marketing" lastActive="2 weeks ago" />
          </View>
        )}

        {activeTab === 'Follow-Ups' && (
          <View>
            <Text style={styles.sectionTitle}>Active Follow-Up Rules</Text>
            <FollowUpItem client="John Smith" service="AC Installation" trigger="Job Completion" days="3" />
            <FollowUpItem client="Emma Wilson" service="Leak Repair" trigger="Quote Sent" days="1" />
            <FollowUpItem client="Mike Ross" service="Pipe Replacement" trigger="Job Completion" days="7" />
            <FollowUpItem client="Sarah Connor" service="General Maintenance" trigger="No Activity" days="30" />
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => Alert.alert('New campaign', 'Connect an email provider on the backend to create campaigns from the app.')}
      >
        <Ionicons name="mail-outline" size={24} color={COLORS.white} />
        <Text style={styles.fabText}>New Campaign</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  plusBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center' },

  tabContainer: { padding: 16, backgroundColor: COLORS.white },
  tabWrapper: {
    flexDirection: 'row', backgroundColor: '#F8FAFC',
    borderRadius: 25, padding: 4, borderWidth: 1, borderColor: '#F1F5F9'
  },
  tab: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 22 },
  activeTab: { backgroundColor: '#0062E1', ...SHADOWS.small },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  activeTabText: { color: COLORS.white },

  scrollContent: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },

  campaignCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  titleSection: { flex: 1 },
  campaignTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  campaignDate: { fontSize: 12, color: COLORS.textTertiary, marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, height: 24 },
  statusText: { fontSize: 10, fontWeight: '700' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E2E8F0', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  statItem: { alignItems: 'center', flex: 1 },
  statVal: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  statLab: { fontSize: 11, color: COLORS.textTertiary, marginTop: 4 },

  viewReportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8 },
  viewReportText: { fontSize: 14, fontWeight: '600', color: '#0062E1' },

  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 16, paddingHorizontal: 16, height: 50, marginBottom: 24 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, color: COLORS.textPrimary },

  templateItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  templateIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  templateInfo: { flex: 1, marginLeft: 12 },
  templateTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  templateSub: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },

  followUpCard: { backgroundColor: '#F8FAFC', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  followUpHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  clientAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  followUpInfo: { flex: 1, marginLeft: 12 },
  clientName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  serviceText: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  triggerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
  triggerText: { fontSize: 12, fontWeight: '600', color: '#D97706' },

  fab: { position: 'absolute', right: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 20, height: 56, borderRadius: 28, ...SHADOWS.medium },
  fabText: { color: COLORS.white, fontSize: 15, fontWeight: '700', marginLeft: 10 },
});

export default CampaignsScreen;
