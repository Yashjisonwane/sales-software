import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const AdminNotificationsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Jobs', 'Payments', 'Team', 'System'];

  const notifications = [
    {
      id: '1',
      title: 'New Subcontract Job Assigned',
      desc: "You've been assigned a new subcontract job.",
      time: '5 min ago',
      type: 'Jobs',
      unread: true,
      action: 'View Job',
      target: 'JobOfferDetail'
    },
    {
      id: '2',
      title: 'Quote Approved — Start Work',
      desc: 'Your quote has been approved by the customer. You can now schedule and begin work.',
      time: '1 hour ago',
      type: 'Jobs',
      unread: true,
      action: 'View Job',
      target: 'JobOfferDetail'
    },
    {
      id: '3',
      title: 'Payment Received',
      desc: '$1,200 received from Sarah Johnson',
      time: '1 hour ago',
      type: 'Payments',
      unread: true,
      action: 'View Invoice',
    },
    {
      id: '4',
      title: 'Worker Checked In',
      desc: 'Mike checked in at 9:02 AM (GPS verified)',
      time: 'Today',
      type: 'Team',
      unread: false,
      action: 'View Location',
    },
    {
      id: '5',
      title: 'Automation Triggered',
      desc: 'Invoice sent automatically after job completion',
      time: 'Yesterday',
      type: 'System',
      unread: false,
      action: 'View Rule',
    }
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {notifications
          .filter(n => activeTab === 'All' || n.type === activeTab)
          .map(notif => (
            <View key={notif.id} style={styles.notifCard}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifTitle}>{notif.title}</Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
              <Text style={styles.notifDesc}>{notif.desc}</Text>
              <View style={styles.notifFooter}>
                <TouchableOpacity onPress={() => notif.target && navigation.navigate(notif.target)}>
                  <Text style={styles.actionText}>{notif.action}</Text>
                </TouchableOpacity>
                {notif.unread && <View style={styles.unreadDot} />}
              </View>
            </View>
          ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  tabsContainer: { paddingVertical: 12, backgroundColor: COLORS.white },
  tabsScrollContent: { paddingHorizontal: 16, gap: 8 },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  activeTab: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  activeTabText: { color: COLORS.white },

  scrollContent: { padding: 16 },
  notifCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  notifTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
  notifTime: { fontSize: 12, color: COLORS.textTertiary },
  notifDesc: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 },
  notifFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '600', color: '#8B5CF6', textDecorationLine: 'underline' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0062E1' },
});

export default AdminNotificationsScreen;
