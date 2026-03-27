import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const EARNINGS_DATA = [45, 62, 78, 55, 90, 68];
const MAX_EARNING = Math.max(...EARNINGS_DATA);

export default function EarningsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Total Earnings Card */}
        <LinearGradient colors={COLORS.gradientPro} style={styles.earningsCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.earningsDecor1} />
          <Text style={styles.earningsLabel}>Total Earnings</Text>
          <Text style={styles.earningsAmount}>$12,450</Text>
          <View style={styles.earningsMetaRow}>
            <View style={styles.earningsMeta}>
              <Ionicons name="trending-up" size={14} color={COLORS.successLight} />
              <Text style={styles.earningsMetaText}>+18% this month</Text>
            </View>
          </View>

          <View style={styles.earningsStatsRow}>
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatNum}>$3,450</Text>
              <Text style={styles.earningsStatLabel}>This Month</Text>
            </View>
            <View style={styles.earningsStatDivider} />
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatNum}>48</Text>
              <Text style={styles.earningsStatLabel}>Total Jobs</Text>
            </View>
            <View style={styles.earningsStatDivider} />
            <View style={styles.earningsStat}>
              <Text style={styles.earningsStatNum}>72%</Text>
              <Text style={styles.earningsStatLabel}>Conversion</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={styles.withdrawBtn}
          onPress={() => Alert.alert("Withdraw Funds", "Initiating transfer to your linked bank account...")}
        >
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.withdrawGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="wallet-outline" size={20} color={COLORS.white} />
            <Text style={styles.withdrawText}>Withdraw to Bank</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Period Filter */}
        <View style={styles.periodRow}>
          {['Weekly', 'Monthly', 'Yearly'].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodChip, selectedPeriod === p && styles.periodActive]}
              onPress={() => setSelectedPeriod(p)}
            >
              <Text style={[styles.periodText, selectedPeriod === p && styles.periodTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Earnings Overview</Text>
          <View style={styles.chart}>
            {EARNINGS_DATA.map((val, idx) => (
              <View key={idx} style={styles.chartCol}>
                <View style={styles.barContainer}>
                  <LinearGradient
                    colors={['#A78BFA', '#8B5CF6']}
                    style={[styles.bar, { height: `${(val / MAX_EARNING) * 100}%` }]}
                  />
                </View>
                <Text style={styles.chartLabel}>{MONTHS[idx]}</Text>
                <Text style={styles.chartValue}>${val * 10}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transSection}>
          <Text style={styles.transSectionTitle}>Recent Transactions</Text>
          {[
            { id: '1', service: 'Kitchen Plumbing', customer: 'Alex Johnson', amount: '$120', date: 'Mar 7', icon: 'water', color: '#3B82F6' },
            { id: '2', service: 'Pipe Repair', customer: 'Maria Garcia', amount: '$85', date: 'Mar 6', icon: 'build', color: '#10B981' },
            { id: '3', service: 'Drain Cleaning', customer: 'James Lee', amount: '$95', date: 'Mar 5', icon: 'water', color: '#3B82F6' },
            { id: '4', service: 'Faucet Install', customer: 'Emily Davis', amount: '$150', date: 'Mar 4', icon: 'construct', color: '#6366F1' },
          ].map((t) => (
            <View key={t.id} style={styles.transCard}>
              <View style={[styles.transIcon, { backgroundColor: `${t.color}15` }]}>
                <Ionicons name={t.icon} size={18} color={t.color} />
              </View>
              <View style={styles.transInfo}>
                <Text style={styles.transService}>{t.service}</Text>
                <Text style={styles.transCustomer}>{t.customer} • {t.date}</Text>
              </View>
              <Text style={styles.transAmount}>+{t.amount}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingBottom: 14, paddingHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  scrollContent: { padding: SIZES.screenPadding, paddingBottom: 100 },
  earningsCard: {
    borderRadius: SIZES.radiusXl, padding: 24, marginBottom: 20, overflow: 'hidden',
  },
  earningsDecor1: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -40, right: -30,
  },
  earningsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginBottom: 4 },
  earningsAmount: { fontSize: 36, fontWeight: '800', color: COLORS.white, marginBottom: 8 },
  earningsMetaRow: { marginBottom: 20 },
  earningsMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  earningsMetaText: { fontSize: 13, color: COLORS.successLight, fontWeight: '600' },
  earningsStatsRow: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: SIZES.radiusMd, padding: 14,
  },
  earningsStat: { flex: 1, alignItems: 'center' },
  earningsStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  earningsStatNum: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  earningsStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  withdrawBtn: {
    marginTop: -20, marginHorizontal: 30, marginBottom: 20, ...SHADOWS.medium,
  },
  withdrawGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 15, borderRadius: 16,
  },
  withdrawText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  periodRow: {
    flexDirection: 'row', gap: 8, marginBottom: 20,
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd,
    padding: 4, ...SHADOWS.small,
  },
  periodChip: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: SIZES.radiusSm },
  periodActive: { backgroundColor: '#8B5CF6' },
  periodText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  periodTextActive: { color: COLORS.white },
  chartCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusLg,
    padding: 18, marginBottom: 24, ...SHADOWS.small,
  },
  chartTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 20 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  chartCol: { flex: 1, alignItems: 'center' },
  barContainer: { width: 24, height: 120, justifyContent: 'flex-end', borderRadius: 6, overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 6 },
  chartLabel: { fontSize: 11, color: COLORS.textTertiary, marginTop: 6 },
  chartValue: { fontSize: 9, color: COLORS.textTertiary, fontWeight: '600' },
  transSection: {},
  transSectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  transCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd, padding: 14, marginBottom: 10, ...SHADOWS.small,
  },
  transIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  transInfo: { flex: 1 },
  transService: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  transCustomer: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  transAmount: { fontSize: 16, fontWeight: '800', color: COLORS.success },
});
