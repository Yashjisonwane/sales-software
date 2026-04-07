import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';
import { createInvoice } from '../../api/apiService';
import storage from '../../api/storage';

const MILESTONES = [
  { key: 'SINGLE', short: 'Full', title: 'Full payment', desc: 'Bill the whole job in one invoice.' },
  { key: 'DEPOSIT_15', short: '15%', title: 'Deposit (15%)', desc: 'First payment — 15% of the job total below.' },
  { key: 'PROGRESS_50', short: '50%', title: 'Progress (50%)', desc: 'Mid-job payment — 50% of the job total.' },
  { key: 'FINAL_35', short: '35%', title: 'Final (35%)', desc: 'Closing payment — 35% of the job total.' },
];

function formatAddress(job) {
  const parts = [
    job.address,
    job.city,
    job.state,
    job.pincode ? `ZIP ${job.pincode}` : null,
  ].filter(Boolean);
  if (parts.length) return parts.join(', ');
  const loc = job.location;
  if (loc && typeof loc === 'string' && loc.trim()) return loc.trim();
  return null;
}

function money(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—';
  return `$${x.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const CreateInvoiceScreen = ({ navigation, route }) => {
  const job = route.params?.job || {};
  const estimateAmt = job.estimate?.amount;
  const quoteTotalNum = Number(estimateAmt);
  const hasQuote = Number.isFinite(quoteTotalNum) && quoteTotalNum > 0;

  const defaultProjectTotal = hasQuote ? String(quoteTotalNum) : '';
  const [projectTotal, setProjectTotal] = useState(defaultProjectTotal);

  const [milestone, setMilestone] = useState('SINGLE');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await storage.getItem('userData');
        if (raw && !cancelled) {
          const u = JSON.parse(raw);
          setIsAdmin(u?.role === 'ADMIN');
        }
      } catch (_) {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const workerNeedsQuote = !isAdmin;

  const milestoneMeta = useMemo(() => MILESTONES.find((m) => m.key === milestone) || MILESTONES[0], [milestone]);

  const totalNum = parseFloat(String(projectTotal).replace(/,/g, '')) || 0;

  const computedBillAmount = useMemo(() => {
    if (milestone === 'DEPOSIT_15') return totalNum * 0.15;
    if (milestone === 'PROGRESS_50') return totalNum * 0.5;
    if (milestone === 'FINAL_35') return totalNum * 0.35;
    return totalNum;
  }, [milestone, totalNum]);

  const handleSendInvoice = async () => {
    if (!job?.id) {
      Alert.alert('Job required', 'Open this screen from a job (Explore → Invoice → pick a job, or your job list).');
      return;
    }
    if (workerNeedsQuote && !hasQuote) {
      Alert.alert(
        'Quote needed first',
        'This job does not have a saved quote yet. Complete the quote on this job, then create the invoice.'
      );
      return;
    }
    if (totalNum <= 0) {
      Alert.alert('Check amounts', 'Enter a valid job total (usually the same as your quote).');
      return;
    }

    setLoading(true);
    const bodyAmount = milestone === 'SINGLE' ? totalNum : 0;
    const res = await createInvoice(job.id, bodyAmount, {
      milestone,
      totalAmount: totalNum,
    });
    setLoading(false);
    if (res.success) {
      Alert.alert(
        'Invoice created',
        `Customer will see ${money(computedBillAmount)} for this step (${milestoneMeta.title}).`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Could not create invoice', res.message || 'Try again.');
    }
  };

  const addr = formatAddress(job);
  const jobLabel = job.jobNo != null ? `Job #${job.jobNo}` : job.displayId || 'Job';
  const quoteLineItems = Array.isArray(job.estimate?.materials?.lineItems) ? job.estimate.materials.lineItems : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New invoice</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={22} color="#0369A1" />
          <Text style={styles.infoBannerText}>
            You are charging the customer for this job. We save this as an invoice (unpaid until they pay).
            {milestone !== 'SINGLE'
              ? ' Split payments use the job total below; this step bills only the selected percentage.'
              : ''}
          </Text>
        </View>

        {isAdmin && !hasQuote && (
          <View style={[styles.infoBanner, styles.warnBanner]}>
            <Ionicons name="warning-outline" size={22} color="#B45309" />
            <Text style={[styles.infoBannerText, styles.warnBannerText]}>
              No saved quote on this job. Enter the contract total yourself. Workers need a quote before they can invoice.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job</Text>
          <Text style={styles.jobLineStrong}>{jobLabel}</Text>
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Customer</Text>
            <Text style={styles.detailValue}>{job.customerName || job.customer?.name || '—'}</Text>
          </View>
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{job.categoryName || job.category?.name || '—'}</Text>
          </View>
          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{addr || '—'}</Text>
          </View>
          {hasQuote && (
            <View style={styles.quotePill}>
              <Text style={styles.quotePillLabel}>Saved quote total</Text>
              <Text style={styles.quotePillValue}>{money(quoteTotalNum)}</Text>
            </View>
          )}
          {quoteLineItems.length > 0 && (
            <View style={styles.breakdownBox}>
              <Text style={styles.breakdownTitle}>From saved quote (materials)</Text>
              {quoteLineItems.slice(0, 6).map((row, idx) => (
                <View key={row.id || idx} style={styles.breakdownRow}>
                  <Text style={styles.breakdownName} numberOfLines={2}>
                    {row.name || 'Item'} × {row.qty ?? '—'}
                  </Text>
                  <Text style={styles.breakdownAmt}>{money(row.lineTotal)}</Text>
                </View>
              ))}
              {quoteLineItems.length > 6 && (
                <Text style={styles.breakdownMore}>+ {quoteLineItems.length - 6} more lines in quote</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job total (contract amount)</Text>
          <Text style={styles.sectionHint}>
            {hasQuote
              ? 'Pre-filled from your quote. Edit only if the agreed total changed. Milestones use this number to compute each bill.'
              : isAdmin
                ? 'Enter the full job value you are billing against. Required for deposit / progress / final splits.'
                : 'Save a quote on this job first — the total will appear here automatically.'}
          </Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.dollar}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={projectTotal}
              onChangeText={setProjectTotal}
              keyboardType="decimal-pad"
              placeholder={hasQuote ? String(quoteTotalNum) : '0.00'}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>This invoice (after milestone)</Text>
            <Text style={styles.previewValue}>{money(computedBillAmount)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment type</Text>
          <Text style={styles.sectionHint}>Pick one. Percent options are for multi-step billing on the same job total.</Text>
          <View style={styles.milestoneList}>
            {MILESTONES.map((m) => {
              const on = milestone === m.key;
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.milestoneCard, on && styles.milestoneCardOn]}
                  onPress={() => setMilestone(m.key)}
                  activeOpacity={0.85}
                >
                  <View style={styles.milestoneCardTop}>
                    <Text style={[styles.milestoneTitle, on && styles.milestoneTitleOn]}>{m.title}</Text>
                    {on && <Ionicons name="checkmark-circle" size={22} color="#0062E1" />}
                  </View>
                  <Text style={styles.milestoneDesc}>{m.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Text style={styles.footerHint}>
          Creates invoice {money(computedBillAmount)} · {milestoneMeta.title}
        </Text>
        <TouchableOpacity
          style={[styles.sendBtn, loading && { opacity: 0.7 }]}
          disabled={loading}
          onPress={handleSendInvoice}
        >
          <Ionicons name="document-text-outline" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
          <Text style={styles.sendBtnText}>{loading ? 'Saving…' : 'Create invoice'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  scrollContent: { padding: 16 },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#E0F2FE',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  infoBannerText: { flex: 1, fontSize: 13, color: '#0C4A6E', lineHeight: 19 },
  warnBanner: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
    marginBottom: 16,
  },
  warnBannerText: { color: '#92400E' },

  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.small,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 6 },
  sectionHint: { fontSize: 12, color: COLORS.textTertiary, marginBottom: 12, lineHeight: 17 },

  jobLineStrong: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  detailBlock: { marginBottom: 10 },
  detailLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: 0.6 },
  detailValue: { fontSize: 15, color: COLORS.textPrimary, marginTop: 4, lineHeight: 22 },

  quotePill: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  quotePillLabel: { fontSize: 13, fontWeight: '600', color: '#166534' },
  quotePillValue: { fontSize: 16, fontWeight: '800', color: '#166534' },

  breakdownBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  breakdownTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textTertiary, marginBottom: 8, textTransform: 'uppercase' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 },
  breakdownName: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  breakdownAmt: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  breakdownMore: { fontSize: 12, color: COLORS.textTertiary, marginTop: 4, fontStyle: 'italic' },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dollar: { fontSize: 18, fontWeight: '700', color: '#64748B', marginRight: 6 },
  amountInput: { flex: 1, fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, paddingVertical: 10 },

  previewRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  previewLabel: { fontSize: 13, color: COLORS.textSecondary, flex: 1, marginRight: 12 },
  previewValue: { fontSize: 20, fontWeight: '800', color: '#0062E1' },

  milestoneList: { gap: 10 },
  milestoneCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
  },
  milestoneCardOn: {
    borderColor: '#0062E1',
    backgroundColor: '#EFF6FF',
  },
  milestoneCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  milestoneTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  milestoneTitleOn: { color: '#0062E1' },
  milestoneDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },

  footer: {
    padding: 16,
    paddingTop: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerHint: { fontSize: 12, color: COLORS.textTertiary, textAlign: 'center', marginBottom: 10 },
  sendBtn: {
    backgroundColor: '#0062E1',
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  sendBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});

export default CreateInvoiceScreen;
