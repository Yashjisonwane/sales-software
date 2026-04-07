import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';
import { getNotifications, markNotificationRead, clearNotifications } from '../../api/apiService';

function tabForType(type) {
  const t = (type || 'INFO').toUpperCase();
  if (t.includes('PAY') || t.includes('INVOICE') || t.includes('SUBSCRIPTION')) return 'Payments';
  if (t.includes('WORKER') || t.includes('USER') || t.includes('TEAM') || t.includes('INVITE')) return 'Team';
  if (t.includes('SYSTEM') || t.includes('AUTO')) return 'System';
  return 'Jobs';
}

function formatWhen(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

const AdminNotificationsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Jobs', 'Payments', 'Team', 'System'];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const res = await getNotifications();
    if (res.success && Array.isArray(res.data)) setRows(res.data);
    else setRows([]);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const mapped = rows.map((n) => ({
    ...n,
    tab: tabForType(n.type),
    time: formatWhen(n.createdAt),
  }));

  const filtered = mapped.filter((n) => activeTab === 'All' || n.tab === activeTab);

  const onOpen = async (n) => {
    if (!n.isRead) {
      await markNotificationRead(n.id);
      setRows((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)));
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Clear all?', 'Remove notifications you can see.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Clear',
                onPress: async () => {
                  const res = await clearNotifications();
                  if (res.success) setRows([]);
                  else Alert.alert('Error', res.message || 'Failed');
                },
              },
            ]);
          }}
        >
          <Text style={styles.clearTop}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
          {tabs.map((tab) => (
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

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        >
          {filtered.length === 0 ? (
            <Text style={styles.empty}>No notifications in this tab.</Text>
          ) : (
            filtered.map((notif) => (
              <TouchableOpacity key={notif.id} style={styles.notifCard} onPress={() => onOpen(notif)} activeOpacity={0.75}>
                <View style={styles.notifHeader}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
                <Text style={styles.notifDesc}>{notif.message}</Text>
                <View style={styles.notifFooter}>
                  <Text style={styles.typePill}>{notif.type || 'INFO'}</Text>
                  {!notif.isRead && <View style={styles.unreadDot} />}
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, flex: 1, textAlign: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  clearTop: { fontSize: 14, fontWeight: '600', color: '#EF4444', width: 48, textAlign: 'right' },

  tabsContainer: { paddingVertical: 12, backgroundColor: COLORS.white },
  tabsScrollContent: { paddingHorizontal: 16, gap: 8 },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  notifTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, flex: 1, marginRight: 8 },
  notifTime: { fontSize: 12, color: COLORS.textTertiary },
  notifDesc: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 },
  notifFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typePill: { fontSize: 11, fontWeight: '600', color: '#64748B', backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0062E1' },
});

export default AdminNotificationsScreen;
