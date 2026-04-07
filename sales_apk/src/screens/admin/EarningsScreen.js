import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDashboardStats } from '../../api/apiService';
import storage from '../../api/storage';

function money(n) {
  const x = Number(n) || 0;
  return x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatTxDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

/** Last 6 calendar months $ totals from invoice rows (client-side, same DB as web). */
function monthlyBarsFromTransactions(transactions) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleString(undefined, { month: 'short' }), total: 0 });
  }
  (transactions || []).forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const m = months.find((x) => x.key === key);
    if (m) m.total += Number(t.amount) || 0;
  });
  const maxVal = Math.max(...months.map((m) => m.total), 1);
  return months.map((m) => ({ ...m, h: (m.total / maxVal) * 100 }));
}

export default function EarningsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workerEarnings, setWorkerEarnings] = useState(null);
  const [adminFinancials, setAdminFinancials] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await storage.getItem('userData');
        if (raw) setRole(JSON.parse(raw)?.role || null);
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    if (!role) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await getDashboardStats();
      if (cancelled) return;
      if (res.success) {
        if (role === 'ADMIN' && res.data?.financials) {
          setAdminFinancials(res.data.financials);
        }
        if (role === 'WORKER' && res.earnings) {
          setWorkerEarnings(res.earnings);
        }
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [role]);

  const workerBars = useMemo(
    () => monthlyBarsFromTransactions(workerEarnings?.transactions),
    [workerEarnings]
  );

  const isAdmin = role === 'ADMIN';
  const totalDisplay = isAdmin
    ? adminFinancials?.totalRevenue
    : workerEarnings?.total;
  const monthDisplay = isAdmin ? null : workerEarnings?.thisMonth;
  const completedDisplay = !isAdmin ? workerEarnings?.completedJobs : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isAdmin ? 'Revenue' : 'Earnings'}</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.syncHint}>
            {isAdmin
              ? 'Totals use paid invoices in the database — same source as the web admin.'
              : 'Your paid job invoices only — aligned with admin reporting.'}
          </Text>

          <LinearGradient colors={COLORS.gradientPro} style={styles.earningsCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.earningsDecor1} />
            <Text style={styles.earningsLabel}>{isAdmin ? 'Total revenue (paid)' : 'Lifetime paid to you'}</Text>
            <Text style={styles.earningsAmount}>${money(totalDisplay)}</Text>

            <View style={styles.earningsStatsRow}>
              {!isAdmin && (
                <>
                  <View style={styles.earningsStat}>
                    <Text style={styles.earningsStatNum}>${money(monthDisplay)}</Text>
                    <Text style={styles.earningsStatLabel}>This month</Text>
                  </View>
                  <View style={styles.earningsStatDivider} />
                  <View style={styles.earningsStat}>
                    <Text style={styles.earningsStatNum}>{completedDisplay ?? '—'}</Text>
                    <Text style={styles.earningsStatLabel}>Completed jobs</Text>
                  </View>
                </>
              )}
              {isAdmin && (
                <>
                  <View style={styles.earningsStat}>
                    <Text style={styles.earningsStatNum}>${money(adminFinancials?.workerRevenue)}</Text>
                    <Text style={styles.earningsStatLabel}>Worker share (est.)</Text>
                  </View>
                  <View style={styles.earningsStatDivider} />
                  <View style={styles.earningsStat}>
                    <Text style={styles.earningsStatNum}>${money(adminFinancials?.platformFees)}</Text>
                    <Text style={styles.earningsStatLabel}>Platform (est.)</Text>
                  </View>
                </>
              )}
            </View>
          </LinearGradient>

          {!isAdmin && (
            <TouchableOpacity
              style={styles.withdrawBtn}
              onPress={() => Alert.alert('Payouts', 'Connect bank / Stripe in a future update. Balances here reflect paid invoices in the system.')}
            >
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.withdrawGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="wallet-outline" size={20} color={COLORS.white} />
                <Text style={styles.withdrawText}>Payout info</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {!isAdmin && (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Last 6 months (paid)</Text>
              <View style={styles.chart}>
                {workerBars.map((m) => (
                  <View key={m.key} style={styles.chartCol}>
                    <View style={styles.barContainer}>
                      <LinearGradient
                        colors={['#A78BFA', '#8B5CF6']}
                        style={[styles.bar, { height: `${Math.max(m.h, 4)}%` }]}
                      />
                    </View>
                    <Text style={styles.chartLabel}>{m.label}</Text>
                    <Text style={styles.chartValue}>${money(m.total)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.transSection}>
            <Text style={styles.transSectionTitle}>{isAdmin ? 'Note' : 'Recent invoices'}</Text>
            {isAdmin ? (
              <Text style={styles.adminNote}>
                Open Explore → Invoice tab for per-invoice detail. This screen shows rolled-up paid totals.
              </Text>
            ) : (workerEarnings?.transactions || []).length === 0 ? (
              <Text style={styles.adminNote}>No invoice rows yet. When customers pay on the web, entries appear here.</Text>
            ) : (
              (workerEarnings?.transactions || []).map((t) => (
                <View key={t.id} style={styles.transCard}>
                  <View style={[styles.transIcon, { backgroundColor: '#3B82F615' }]}>
                    <Ionicons name="receipt-outline" size={18} color="#3B82F6" />
                  </View>
                  <View style={styles.transInfo}>
                    <Text style={styles.transService}>{t.service}</Text>
                    <Text style={styles.transCustomer}>
                      {t.customer} • {formatTxDate(t.date)} • {t.status}
                    </Text>
                  </View>
                  <Text style={styles.transAmount}>+${money(t.amount)}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  syncHint: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16, lineHeight: 18 },
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
    marginRight: 14,
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  scrollContent: { padding: SIZES.screenPadding, paddingBottom: 100 },
  earningsCard: {
    borderRadius: SIZES.radiusXl,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  earningsDecor1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -40,
    right: -30,
  },
  earningsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginBottom: 4 },
  earningsAmount: { fontSize: 36, fontWeight: '800', color: COLORS.white, marginBottom: 16 },
  earningsStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: SIZES.radiusMd,
    padding: 14,
  },
  earningsStat: { flex: 1, alignItems: 'center' },
  earningsStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  earningsStatNum: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  earningsStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2, textAlign: 'center' },
  withdrawBtn: {
    marginTop: -12,
    marginHorizontal: 30,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  withdrawGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
  },
  withdrawText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 18,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  chartTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 20 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  chartCol: { flex: 1, alignItems: 'center' },
  barContainer: { width: 24, height: 120, justifyContent: 'flex-end', borderRadius: 6, overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 6, minHeight: 4 },
  chartLabel: { fontSize: 11, color: COLORS.textTertiary, marginTop: 6 },
  chartValue: { fontSize: 9, color: COLORS.textTertiary, fontWeight: '600' },
  transSection: {},
  transSectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  adminNote: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  transCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 14,
    marginBottom: 10,
    ...SHADOWS.small,
  },
  transIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  transInfo: { flex: 1 },
  transService: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  transCustomer: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  transAmount: { fontSize: 15, fontWeight: '800', color: COLORS.success },
});
