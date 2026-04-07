import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getNotifications, markNotificationRead, clearNotifications } from '../../api/apiService';

function metaForType(type) {
  const t = (type || 'INFO').toUpperCase();
  if (t.includes('LEAD')) return { icon: 'flash-outline', color: '#F59E0B', bg: '#FFFBEB' };
  if (t.includes('JOB')) return { icon: 'briefcase-outline', color: '#3B82F6', bg: '#EFF6FF' };
  if (t.includes('PAY') || t.includes('INVOICE')) return { icon: 'card-outline', color: '#10B981', bg: '#ECFDF5' };
  if (t.includes('CHAT') || t.includes('MSG')) return { icon: 'chatbubble-outline', color: '#6366F1', bg: '#EEF2FF' };
  return { icon: 'notifications-outline', color: COLORS.primary, bg: '#EEF2FF' };
}

function formatWhen(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function NotificationsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await getNotifications();
    if (res.success && Array.isArray(res.data)) {
      setRows(res.data);
    } else {
      setRows([]);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const unreadCount = rows.filter((r) => !r.isRead).length;

  const onPressRow = async (n) => {
    if (!n.isRead) {
      await markNotificationRead(n.id);
      setRows((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
    }
  };

  const markAllRead = async () => {
    const unread = rows.filter((r) => !r.isRead);
    if (unread.length === 0) return;
    setBusy(true);
    await Promise.all(unread.map((r) => markNotificationRead(r.id)));
    setRows((prev) => prev.map((x) => ({ ...x, isRead: true })));
    setBusy(false);
  };

  const clearAll = () => {
    Alert.alert('Clear notifications', 'Remove all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          const res = await clearNotifications();
          if (res.success) setRows([]);
          else Alert.alert('Error', res.message || 'Could not clear');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>{unreadCount} unread</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead} disabled={busy}>
            <Text style={styles.markAllText}>{busy ? '…' : 'Read all'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        >
          {rows.length === 0 ? (
            <Text style={styles.empty}>No notifications yet. Web and admin events appear here.</Text>
          ) : (
            rows.map((n) => {
              const m = metaForType(n.type);
              return (
                <TouchableOpacity
                  key={n.id}
                  style={[styles.notifCard, !n.isRead && styles.unreadCard]}
                  activeOpacity={0.7}
                  onPress={() => onPressRow(n)}
                >
                  <View style={[styles.notifIcon, { backgroundColor: m.bg }]}>
                    <Ionicons name={m.icon} size={20} color={m.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <View style={styles.notifTitleRow}>
                      <Text style={styles.notifTitle}>{n.title}</Text>
                      {!n.isRead && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notifMessage} numberOfLines={4}>
                      {n.message}
                    </Text>
                    <Text style={styles.notifTime}>{formatWhen(n.createdAt)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 40, paddingHorizontal: 24 },
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
  headerTextBlock: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  headerActions: { alignItems: 'flex-end', gap: 6 },
  markAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  markAllText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  clearBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  clearText: { fontSize: 11, fontWeight: '600', color: '#EF4444' },
  listContent: { padding: SIZES.screenPadding, paddingBottom: 100 },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    marginBottom: 10,
    ...SHADOWS.small,
  },
  unreadCard: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifContent: { flex: 1 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
  unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  notifMessage: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11, color: COLORS.textTertiary, fontWeight: '500' },
});
