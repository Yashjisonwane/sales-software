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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../constants/theme';
import { getDashboardStats } from '../../api/apiService';

function money(n) {
  const x = Number(n) || 0;
  return `$${x.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function DataAnalyticsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const res = await getDashboardStats();
    if (res.success && res.data) setPayload(res.data);
    else setPayload(null);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const mainStats = payload?.mainStats || [];
  const financials = payload?.financials;
  const performers = payload?.performers || [];
  const activities = payload?.activities || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0062E1" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        >
          <Text style={styles.hint}>Live totals from your database (same source as admin dashboard API).</Text>

          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {mainStats.map((s) => (
              <View key={s.name} style={styles.statCard}>
                <Text style={styles.statName}>{s.name}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>

          {financials ? (
            <>
              <Text style={styles.sectionTitle}>Revenue (paid invoices)</Text>
              <View style={styles.financeCard}>
                <View style={styles.financeRow}>
                  <Text style={styles.financeLabel}>Total collected</Text>
                  <Text style={styles.financeVal}>{money(financials.totalRevenue)}</Text>
                </View>
                <View style={styles.financeRow}>
                  <Text style={styles.financeLabel}>Est. platform share (15%)</Text>
                  <Text style={styles.financeVal}>{money(financials.platformFees)}</Text>
                </View>
                <View style={styles.financeRow}>
                  <Text style={styles.financeLabel}>Est. pro share (85%)</Text>
                  <Text style={styles.financeVal}>{money(financials.workerRevenue)}</Text>
                </View>
              </View>
            </>
          ) : null}

          <Text style={styles.sectionTitle}>Top performers (completed jobs)</Text>
          {performers.length === 0 ? (
            <Text style={styles.empty}>No completed jobs yet.</Text>
          ) : (
            performers.map((p) => (
              <View key={p.id} style={styles.perfRow}>
                <View style={styles.perfAvatar}>
                  <Text style={styles.perfAvText}>{(p.name || '?').slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.perfName}>{p.name}</Text>
                  <Text style={styles.perfSub}>{p.jobs} completed</Text>
                </View>
              </View>
            ))
          )}

          <Text style={styles.sectionTitle}>Recent activity</Text>
          {activities.length === 0 ? (
            <Text style={styles.empty}>No recent activity rows.</Text>
          ) : (
            activities.map((a) => (
              <View key={a.id} style={styles.actRow}>
                <Ionicons name={a.icon || 'pulse-outline'} size={20} color={a.color || '#64748B'} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.actTitle}>{a.title}</Text>
                  <Text style={styles.actTime}>{a.time ? new Date(a.time).toLocaleString() : ''}</Text>
                </View>
              </View>
            ))
          )}
          <View style={{ height: 48 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 16 },
  hint: { fontSize: 13, color: COLORS.textTertiary, marginBottom: 16, lineHeight: 18 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12, marginTop: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  statName: { fontSize: 11, fontWeight: '700', color: COLORS.textTertiary },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginTop: 6 },
  financeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  financeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  financeLabel: { fontSize: 14, color: COLORS.textSecondary },
  financeVal: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  perfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  perfAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  perfAvText: { fontWeight: '800', color: '#4338CA' },
  perfName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  perfSub: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  actRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  actTime: { fontSize: 11, color: COLORS.textTertiary, marginTop: 2 },
  empty: { fontSize: 14, color: COLORS.textTertiary, fontStyle: 'italic' },
});
