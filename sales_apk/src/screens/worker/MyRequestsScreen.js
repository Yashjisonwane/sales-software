import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = ['Active', 'Pending', 'Completed'];

const REQUESTS = [
  {
    id: '#1221',
    service: 'Plumbing',
    provider: 'John Wilson',
    status: 'Active',
    date: 'Mar 7, 2026',
    time: '10:00 AM',
    icon: 'water',
    color: '#3B82F6',
    bg: '#EFF6FF',
    address: '123 Main St, NY',
  },
  {
    id: '#1220',
    service: 'Electrical',
    provider: 'Sarah Martinez',
    status: 'Pending',
    date: 'Mar 6, 2026',
    time: '2:30 PM',
    icon: 'flash',
    color: '#F59E0B',
    bg: '#FFFBEB',
    address: '456 Oak Ave, NY',
  },
  {
    id: '#1218',
    service: 'House Cleaning',
    provider: 'Mike Chen',
    status: 'Completed',
    date: 'Mar 5, 2026',
    time: '9:00 AM',
    icon: 'sparkles',
    color: '#10B981',
    bg: '#ECFDF5',
    address: '789 Pine Rd, NY',
  },
  {
    id: '#1215',
    service: 'HVAC Repair',
    provider: 'Lisa Brown',
    status: 'Completed',
    date: 'Mar 3, 2026',
    time: '11:30 AM',
    icon: 'snow',
    color: '#06B6D4',
    bg: '#ECFEFF',
    address: '321 Elm St, NY',
  },
  {
    id: '#1214',
    service: 'Painting',
    provider: 'David Kim',
    status: 'Active',
    date: 'Mar 2, 2026',
    time: '1:00 PM',
    icon: 'color-palette',
    color: '#EC4899',
    bg: '#FDF2F8',
    address: '654 Maple Dr, NY',
  },
  {
    id: '#1210',
    service: 'Plumbing',
    provider: 'John Wilson',
    status: 'Pending',
    date: 'Feb 28, 2026',
    time: '3:00 PM',
    icon: 'water',
    color: '#3B82F6',
    bg: '#EFF6FF',
    address: '987 Cedar Ln, NY',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return { bg: '#ECFDF5', text: '#10B981' };
    case 'Pending': return { bg: '#FFFBEB', text: '#F59E0B' };
    case 'Completed': return { bg: '#EEF2FF', text: '#6366F1' };
    default: return { bg: '#F1F5F9', text: '#64748B' };
  }
};

export default function MyRequestsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Active');

  const filteredRequests = REQUESTS.filter((r) => r.status === activeTab);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <Text style={styles.headerSubtitle}>{REQUESTS.length} total jobs</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const count = REQUESTS.filter((r) => r.status === tab).length;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
              <View style={[styles.tabBadge, activeTab === tab && styles.tabBadgeActive]}>
                <Text style={[styles.tabBadgeText, activeTab === tab && styles.tabBadgeTextActive]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Requests List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={60} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} jobs</Text>
            <Text style={styles.emptyDesc}>Your {activeTab.toLowerCase()} jobs will show up here</Text>
          </View>
        ) : (
          filteredRequests.map((req) => {
            const statusColor = getStatusColor(req.status);
            return (
              <TouchableOpacity key={req.id} style={styles.requestCard} activeOpacity={0.7}>
                <View style={styles.cardTop}>
                  <View style={[styles.iconBg, { backgroundColor: req.bg }]}>
                    <Ionicons name={req.icon} size={22} color={req.color} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardId}>{req.id}</Text>
                    <Text style={styles.cardService}>{req.service}</Text>
                    <Text style={styles.cardProvider}>Client: {req.provider}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                    <Text style={[styles.statusText, { color: statusColor.text }]}>
                      {req.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color={COLORS.textTertiary} />
                    <Text style={styles.metaText}>{req.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={COLORS.textTertiary} />
                    <Text style={styles.metaText}>{req.time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color={COLORS.textTertiary} />
                    <Text style={styles.metaText} numberOfLines={1}>{req.address}</Text>
                  </View>
                </View>

                {req.status === 'Active' && (
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.chatBtn}
                      onPress={() => navigation.navigate('WorkerTabs', { screen: 'Inbox' })}
                    >
                      <Ionicons name="chatbubble" size={14} color={COLORS.primary} />
                      <Text style={styles.chatBtnText}>Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.callBtn}>
                      <Ionicons name="call" size={14} color={COLORS.success} />
                      <Text style={styles.callBtnText}>Call</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {req.status === 'Completed' && (
                  <TouchableOpacity
                    style={styles.reviewBtn}
                    onPress={() => navigation.navigate('Reviews')}
                  >
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.reviewBtnText}>Leave Review</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingBottom: 16,
    paddingHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.white,
    paddingBottom: 14,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    gap: 6,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabBadgeTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: SIZES.screenPadding,
    paddingBottom: 100,
  },
  requestCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardId: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  cardService: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardProvider: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
  },
  chatBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.success,
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FFFBEB',
    marginTop: 14,
  },
  reviewBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D97706',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginTop: 6,
  },
});
