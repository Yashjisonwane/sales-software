import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Professional Accepted',
    message: 'John Wilson accepted your plumbing service request #1221',
    time: '2 min ago',
    icon: 'checkmark-circle',
    color: COLORS.success,
    bg: COLORS.successBg,
    read: false,
  },
  {
    id: '2',
    title: 'New Message',
    message: 'You have a new message from Sarah Martinez',
    time: '15 min ago',
    icon: 'chatbubble',
    color: COLORS.primary,
    bg: '#EEF2FF',
    read: false,
  },
  {
    id: '3',
    title: 'Service Completed',
    message: 'Your cleaning service by Mike Chen has been completed',
    time: '1 hour ago',
    icon: 'ribbon',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    read: false,
  },
  {
    id: '4',
    title: 'Payment Received',
    message: 'Payment of $120 processed for HVAC repair',
    time: '3 hours ago',
    icon: 'card',
    color: COLORS.secondary,
    bg: '#F0F9FF',
    read: true,
  },
  {
    id: '5',
    title: 'Rate Your Experience',
    message: 'Please rate your recent painting service by David Kim',
    time: '5 hours ago',
    icon: 'star',
    color: COLORS.accent,
    bg: COLORS.warningBg,
    read: true,
  },
  {
    id: '6',
    title: 'Offer Available',
    message: '20% off on your next cleaning service! Use code CLEAN20',
    time: 'Yesterday',
    icon: 'gift',
    color: '#EC4899',
    bg: '#FDF2F8',
    read: true,
  },
  {
    id: '7',
    title: 'Provider Nearby',
    message: 'A top-rated electrician is available 0.5 km from you',
    time: 'Yesterday',
    icon: 'location',
    color: '#F97316',
    bg: '#FFF7ED',
    read: true,
  },
];

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>{unreadCount} unread</Text>
        </View>
        <TouchableOpacity style={styles.markAllBtn}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {/* Today section */}
        <Text style={styles.sectionLabel}>Today</Text>
        {NOTIFICATIONS.filter(n => !n.time.includes('Yesterday')).map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={[styles.notifCard, !notif.read && styles.unreadCard]}
            activeOpacity={0.7}
          >
            <View style={[styles.notifIcon, { backgroundColor: notif.bg }]}>
              <Ionicons name={notif.icon} size={20} color={notif.color} />
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifTitleRow}>
                <Text style={styles.notifTitle}>{notif.title}</Text>
                {!notif.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
              <Text style={styles.notifTime}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Yesterday section */}
        <Text style={styles.sectionLabel}>Yesterday</Text>
        {NOTIFICATIONS.filter(n => n.time.includes('Yesterday')).map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={styles.notifCard}
            activeOpacity={0.7}
          >
            <View style={[styles.notifIcon, { backgroundColor: notif.bg }]}>
              <Ionicons name={notif.icon} size={20} color={notif.color} />
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifTitle}>{notif.title}</Text>
              <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
              <Text style={styles.notifTime}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingBottom: 14,
    paddingHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  markAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  listContent: {
    padding: SIZES.screenPadding,
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 6,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    marginBottom: 10,
    ...SHADOWS.small,
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  notifMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
});
