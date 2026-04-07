import React, { useEffect, useState, useMemo } from 'react';
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
import { COLORS, SHADOWS } from '../../constants/theme';
import { getEstimates } from '../../api/apiService';

const { width } = Dimensions.get('window');

const QuoteDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const p = route.params || {};
  const {
    id: paramDisplayId,
    customer: paramCustomer,
    type: paramType,
    date: paramDate,
    amount: paramAmount,
    status: paramStatus,
    role,
    quote: quoteParam,
    estimateId,
    job: jobParam,
  } = p;

  const defaults = {
    id: '#QT-2045',
    customer: 'Alistair Hughes',
    type: 'HVAC Installation',
    date: 'Jan 14, 2026',
    amount: '1,896.15',
    status: 'Approved',
    role: 'admin',
  };

  const [est, setEst] = useState(() => (quoteParam != null ? quoteParam : null));
  const [loading, setLoading] = useState(() => {
    if (quoteParam != null) return false;
    return Boolean(estimateId || quoteParam?.id);
  });

  useEffect(() => {
    const eid = estimateId || quoteParam?.id;
    if (quoteParam != null) {
      setEst(quoteParam);
      setLoading(false);
      return;
    }
    if (!eid) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await getEstimates();
      if (cancelled) return;
      setLoading(false);
      if (res.success && Array.isArray(res.data)) {
        const found = res.data.find((x) => x.id === eid);
        if (found) setEst(found);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [estimateId, quoteParam?.id, quoteParam]);

  const id =
    paramDisplayId ||
    (est?.id ? `#QT-${String(est.id).slice(-4).toUpperCase()}` : defaults.id);
  const customer = paramCustomer || est?.customerName || defaults.customer;
  const type = paramType || est?.categoryName || defaults.type;
  const date =
    paramDate ||
    (est?.createdAt ? new Date(est.createdAt).toLocaleDateString() : defaults.date);
  const amount =
    paramAmount != null
      ? String(paramAmount)
      : est?.amount != null
        ? Number(est.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : defaults.amount;
  const status =
    paramStatus ||
    (est ? (est.isApproved ? 'Approved' : 'Sent') : defaults.status);
  const roleVal = role || defaults.role;

  const isWorker = roleVal === 'worker';
  const homeRoute = isWorker ? 'WorkerTabs' : 'AdminTabs';
  const scopeText = est?.details?.trim() || null;

  const breakdown = useMemo(() => {
    const m = est?.materials;
    if (m && typeof m === 'object' && !Array.isArray(m) && m.version === 1) return m;
    return null;
  }, [est?.materials]);

  const goEditScope = () => {
    const job = jobParam;
    if (!job?.id) {
      Alert.alert('Cannot edit', 'Open this quote from a job to adjust line items and re-send.');
      return;
    }
    const m = breakdown;
    let itemsList;
    if (m?.lineItems?.length) {
      itemsList = m.lineItems.map((row, idx) => ({
        id: row.id || String(idx + 1),
        name: row.name || 'Item',
        qty: row.qty ?? 0,
        price: row.unitPrice ?? 0,
      }));
    }
    navigation.navigate('QuoteScope', {
      job,
      role: isWorker ? 'worker' : 'admin',
      initialScope: {
        itemsList,
        laborHours: m?.laborHours ?? est?.laborHours ?? 0,
        laborRate: m?.laborRate ?? 45,
        serviceType: type,
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quote details</Text>
        <View style={styles.menuBtn} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.quoteId}>{id}</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      status === 'Approved' ? '#ECFDF5' : status === 'Sent' ? '#EFF6FF' : '#FEF2F2',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color: status === 'Approved' ? '#10B981' : status === 'Sent' ? '#3B82F6' : '#EF4444',
                    },
                  ]}
                >
                  {status}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Customer</Text>
              <Text style={styles.infoValue}>{customer}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Service</Text>
              <Text style={styles.infoValue}>{type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created</Text>
              <Text style={styles.infoValue}>{date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total</Text>
              <Text style={styles.totalAmount}>${amount}</Text>
            </View>
          </View>

          {breakdown ? (
            <View style={styles.scopeSection}>
              <Text style={styles.sectionTitle}>Pricing breakdown</Text>
              <View style={styles.scopeContent}>
                {breakdown.lineItems?.map((row) => (
                  <View key={row.id || row.name} style={styles.breakRow}>
                    <Text style={styles.breakName} numberOfLines={2}>
                      {row.name} × {row.qty}
                    </Text>
                    <Text style={styles.breakAmt}>${Number(row.lineTotal).toFixed(2)}</Text>
                  </View>
                ))}
                <View style={styles.breakRow}>
                  <Text style={styles.breakName}>Labor ({breakdown.laborHours} h @ ${Number(breakdown.laborRate).toFixed(2)})</Text>
                  <Text style={styles.breakAmt}>${Number(breakdown.laborSubtotal).toFixed(2)}</Text>
                </View>
                <View style={styles.breakRow}>
                  <Text style={styles.breakName}>Travel / misc</Text>
                  <Text style={styles.breakAmt}>${Number(breakdown.travelCost).toFixed(2)}</Text>
                </View>
                <View style={[styles.breakRow, styles.breakTotal]}>
                  <Text style={styles.breakNameBold}>Subtotal</Text>
                  <Text style={styles.breakAmtBold}>${Number(breakdown.subtotal).toFixed(2)}</Text>
                </View>
                <Text style={styles.marginNote}>Margin {Number(breakdown.marginPercent)}% applied → final ${Number(breakdown.finalPrice).toFixed(2)}</Text>
              </View>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Send to client', 'Email/SMS sending can plug in here.')}>
              <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="send-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionLabel}>Send to client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={goEditScope}>
              <View style={[styles.actionIcon, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="create-outline" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.actionLabel}>Edit quote</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Delete', 'Not implemented — add API if you need delete.')}>
              <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </View>
              <Text style={styles.actionLabel}>Delete</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scopeSection}>
            <Text style={styles.sectionTitle}>Notes (stored on server)</Text>
            <View style={styles.scopeContent}>
              <Text style={styles.scopeText}>
                {scopeText || 'No extra notes on this estimate.'}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.convertBtn} onPress={() => navigation.navigate(homeRoute)}>
          <Text style={styles.convertBtnText}>{isWorker ? 'Back to dashboard' : 'Done'}</Text>
        </TouchableOpacity>
        {jobParam?.id ? (
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('JobDetails', { job: jobParam })}>
            <Text style={styles.secondaryBtnText}>Open job</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  menuBtn: { width: 40, height: 40 },

  scrollContent: { padding: 16, paddingBottom: 160 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quoteId: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoLabel: { fontSize: 14, color: COLORS.textTertiary },
  infoValue: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary, flex: 1, textAlign: 'right', marginLeft: 12 },
  totalAmount: { fontSize: 18, fontWeight: '700', color: '#0062E1' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },

  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionItem: {
    alignItems: 'center',
    width: (width - 64) / 3,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center' },

  scopeSection: { marginBottom: 20 },
  scopeContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.small,
  },
  scopeText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  breakName: { fontSize: 14, color: COLORS.textSecondary, flex: 1, paddingRight: 8 },
  breakAmt: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  breakTotal: { borderBottomWidth: 0, marginTop: 4 },
  breakNameBold: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  breakAmtBold: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  marginNote: { fontSize: 12, color: COLORS.textTertiary, marginTop: 10 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  convertBtn: {
    backgroundColor: '#0062E1',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  convertBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
});

export default QuoteDetailsScreen;
