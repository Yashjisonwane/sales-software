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

export default function WorkerAnalyticsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [cards, setCards] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const res = await getDashboardStats();
    if (res.success) {
      setCards(Array.isArray(res.data) ? res.data : []);
      setEarnings(res.earnings || null);
    } else {
      setCards([]);
      setEarnings(null);
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

  const tx = earnings?.transactions || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Performance</Text>
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
          <Text style={styles.hint}>Same API as admin dashboard — scoped to your account only.</Text>

          <Text style={styles.sectionTitle}>Job stats</Text>
          <View style={styles.statsGrid}>
            {cards.map((s) => (
              <View key={s.name} style={styles.statCard}>
                <Text style={styles.statName}>{s.name}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
              </View>
            ))}
          </View>

          {earnings ? (
            <>
              <Text style={styles.sectionTitle}>Earnings (paid invoices)</Text>
              <View style={styles.financeCard}>
                <View style={styles.financeRow}>
                  <Text style={styles.financeLabel}>Lifetime paid</Text>
                  <Text style={styles.financeVal}>{money(earnings.total)}</Text>
                </View>
                <View style={styles.financeRow}>
                  <Text style={styles.financeLabel}>This month</Text>
                  <Text style={styles.financeVal}>{money(earnings.thisMonth)}</Text>
                </View>
                <View style={styles.financeRow}>
                  <Text style={styles.financeLabel}>Completed jobs</Text>
                  <Text style={styles.financeVal}>{earnings.completedJobs ?? '—'}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Recent invoice lines</Text>
              {tx.length === 0 ? (
                <Text style={styles.empty}>No invoices yet.</Text>
              ) : (
                tx.slice(0, 15).map((t) => (
                  <View key={t.id} style={styles.txRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.txSvc}>{t.service}</Text>
                      <Text style={styles.txCust}>{t.customer}</Text>
                      <Text style={styles.txDate}>{t.date ? new Date(t.date).toLocaleDateString() : ''}</Text>
                    </View>
                    <Text style={styles.txAmt}>{money(t.amount)}</Text>
                    <View style={[styles.pill, t.status === 'PAID' ? styles.pillPaid : styles.pillUnpaid]}>
                      <Text style={styles.pillTxt}>{t.status}</Text>
                    </View>
                  </View>
                ))
              )}
            </>
          ) : null}
          <View style={{ height: 40 }} />
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
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
  },
  txSvc: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  txCust: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  txDate: { fontSize: 11, color: COLORS.textTertiary, marginTop: 2 },
  txAmt: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  pill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pillPaid: { backgroundColor: '#DCFCE7' },
  pillUnpaid: { backgroundColor: '#FEF3C7' },
  pillTxt: { fontSize: 10, fontWeight: '700', color: '#1A202C' },
  empty: { fontSize: 14, color: COLORS.textTertiary, fontStyle: 'italic' },
});
