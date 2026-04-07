import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createEstimate } from '../../api/apiService';

function num(v, fallback = 0) {
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

const QuotePricingScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { job, scope, role = 'admin' } = route.params || {};
  const [loading, setLoading] = useState(false);

  const itemsList = scope?.itemsList || [];
  const laborHrs = num(scope?.laborHours, 0);
  const laborRateVal = num(scope?.laborRate, 45);

  const materialsSubtotal = useMemo(() => {
    return itemsList.reduce((sum, i) => sum + num(i.qty, 0) * num(i.price, 0), 0);
  }, [itemsList]);

  const laborSubtotal = useMemo(() => laborHrs * laborRateVal, [laborHrs, laborRateVal]);

  const [travelCost, setTravelCost] = useState(45);
  const [marginPct, setMarginPct] = useState(35);

  const travelNum = num(travelCost, 0);
  const marginNum = Math.min(90, Math.max(0, num(marginPct, 35)));
  const subtotal = materialsSubtotal + laborSubtotal + travelNum;
  const finalPrice = marginNum >= 100 ? subtotal : subtotal / (1 - marginNum / 100);

  const materialsPayload = useMemo(
    () => ({
      version: 1,
      lineItems: itemsList
        .filter((i) => num(i.qty, 0) > 0)
        .map((i) => ({
          id: i.id,
          name: i.name,
          qty: num(i.qty, 0),
          unitPrice: num(i.price, 0),
          lineTotal: num(i.qty, 0) * num(i.price, 0),
        })),
      laborRate: laborRateVal,
      laborHours: laborHrs,
      materialsSubtotal,
      laborSubtotal,
      travelCost: travelNum,
      marginPercent: marginNum,
      subtotal,
      finalPrice,
    }),
    [itemsList, laborRateVal, laborHrs, materialsSubtotal, laborSubtotal, travelNum, marginNum, subtotal, finalPrice]
  );

  const detailsText = useMemo(() => {
    const svc = scope?.serviceType || 'General';
    return [
      `Service: ${svc}`,
      `Materials (from scope): $${materialsSubtotal.toFixed(2)}`,
      `Labor: ${laborHrs} h × $${laborRateVal.toFixed(2)}/h = $${laborSubtotal.toFixed(2)}`,
      `Travel: $${travelNum.toFixed(2)}`,
      `Margin: ${marginNum}% → quoted total $${finalPrice.toFixed(2)}`,
    ].join('\n');
  }, [scope?.serviceType, materialsSubtotal, laborHrs, laborRateVal, laborSubtotal, travelNum, marginNum, finalPrice]);

  const handleCreateQuote = async () => {
    if (!job?.id) {
      Alert.alert('Job required', 'Missing job — open this flow from a job on the map or list.');
      return;
    }
    if (!job?.jobNo) {
      Alert.alert('Job required', 'Assign a worker first so this lead becomes a job, then create the quote.');
      return;
    }
    setLoading(true);
    const res = await createEstimate(job.id, finalPrice, detailsText, materialsPayload, laborHrs, scope?.inspectionResults?.measurements);
    setLoading(false);
    if (res.success && res.data) {
      const est = res.data;
      navigation.replace('QuoteDetails', {
        quote: {
          ...est,
          details: est.details || detailsText,
          amount: est.amount,
          laborHours: est.laborHours,
          materials: est.materials || materialsPayload,
          createdAt: est.createdAt,
        },
        job,
        customerName: job.customerName,
        categoryName: scope?.serviceType || job.categoryName,
        role,
      });
    } else {
      Alert.alert('Error', res.message || 'Failed to create quote');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pricing</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.stepper}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.activeStep]}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
            <Text style={styles.stepLabelActive}>Job Scope</Text>
          </View>
          <View style={[styles.stepLine, styles.activeLine]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.activeStep]}>
              <View style={styles.stepInner} />
            </View>
            <Text style={styles.stepLabelActive}>Pricing</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle} />
            <Text style={styles.stepLabel}>Review</Text>
          </View>
        </View>

        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={18} color="#1D4ED8" />
          <Text style={styles.hintText}>
            Totals use the line items, labor rate, and hours you set in the previous step — not fixed mock numbers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Materials (qty × your unit price)</Text>
            <Text style={styles.priceValue}>${materialsSubtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Labor ({laborHrs} h × ${laborRateVal.toFixed(2)}/hr)
            </Text>
            <Text style={styles.priceValue}>${laborSubtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Travel / misc</Text>
            <View style={styles.inlineInputWrap}>
              <Text style={styles.dollar}>$</Text>
              <TextInput
                style={styles.inlineInput}
                keyboardType="decimal-pad"
                value={String(travelCost)}
                onChangeText={(t) => setTravelCost(t === '' ? '' : t)}
              />
            </View>
          </View>
          <View style={[styles.priceRow, styles.subtotalRow]}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>${subtotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Margin & final quote</Text>
          <Text style={styles.sectionSub}>Adjust margin % — final price updates automatically.</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Margin (%)</Text>
            <View style={styles.inlineInputWrap}>
              <TextInput
                style={[styles.inlineInput, { width: 64 }]}
                keyboardType="decimal-pad"
                value={String(marginPct)}
                onChangeText={(t) => setMarginPct(t === '' ? '' : t)}
              />
              <Text style={styles.pct}>%</Text>
            </View>
          </View>
          <View style={[styles.priceRow, styles.finalRow]}>
            <Text style={styles.finalLabel}>Final quote (customer)</Text>
            <Text style={styles.finalValue}>${finalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.reviewBtn} onPress={handleCreateQuote} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.reviewBtnText}>Save quote to server</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  content: { padding: 16, paddingBottom: 120 },
  hint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  hintText: { flex: 1, fontSize: 12, color: '#1E3A8A', lineHeight: 17 },

  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 10 },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#CBD5E0', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  activeStep: { borderColor: '#0E56D0', backgroundColor: '#0E56D0' },
  stepInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E2E8F0', marginHorizontal: 8, marginTop: -15 },
  activeLine: { backgroundColor: '#0E56D0' },
  stepLabel: { fontSize: 11, color: '#A0AEC0', marginTop: 8, fontWeight: '600' },
  stepLabelActive: { fontSize: 11, color: '#1A202C', marginTop: 8, fontWeight: '700' },

  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
  sectionSub: { fontSize: 13, color: '#718096', marginTop: 4, marginBottom: 16 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  priceLabel: { fontSize: 14, color: '#718096', flex: 1, paddingRight: 8 },
  priceValue: { fontSize: 14, fontWeight: '700', color: '#1A202C' },

  inlineInputWrap: { flexDirection: 'row', alignItems: 'center' },
  dollar: { fontSize: 14, fontWeight: '600', color: '#718096', marginRight: 2 },
  inlineInput: {
    minWidth: 72,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#0E56D0',
    backgroundColor: '#F8FAFC',
  },
  pct: { fontSize: 14, fontWeight: '700', color: '#1A202C', marginLeft: 4 },

  subtotalRow: { borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: 10, paddingTop: 20 },
  subtotalLabel: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  subtotalValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },

  finalRow: { marginTop: 10, paddingTop: 10 },
  finalLabel: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  finalValue: { fontSize: 18, fontWeight: '700', color: '#0E56D0' },

  bottomContainer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  reviewBtn: { height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  reviewBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default QuotePricingScreen;
