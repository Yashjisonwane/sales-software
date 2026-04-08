import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';
import { Alert } from 'react-native';
import { updateInvoiceStatus } from '../../api/apiService';

function statusLabel(raw) {
  const s = (raw || '').toUpperCase();
  if (s === 'PAID') return 'Paid';
  return 'Unpaid';
}

export default function InvoiceDetailsScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const inv = route.params?.invoice;

  if (!inv?.id) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 24, paddingHorizontal: 24 }]}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.missText}>No invoice data.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayId = `#INV-${String(inv.id).slice(-4).toUpperCase()}`;
  const label = statusLabel(inv.status);
  const isPaid = String(inv.status || '').toUpperCase() === 'PAID';
  const amountStr =
    inv.amount != null ? Number(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
  const totalStr =
    inv.totalAmount != null && inv.totalAmount > 0
      ? Number(inv.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : null;
  const created = inv.createdAt ? new Date(inv.createdAt).toLocaleString() : '—';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Details</Text>
        <View style={styles.menuBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.quoteId}>{displayId}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: label === 'Paid' ? '#ECFDF5' : '#FEF2F2' },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: label === 'Paid' ? '#10B981' : '#EF4444' },
                ]}
              >
                {label}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer</Text>
            <Text style={styles.infoValue}>{inv.customerName || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Job type</Text>
            <Text style={styles.infoValue}>{inv.categoryName || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Milestone</Text>
            <Text style={styles.infoValue}>{inv.milestone || 'SINGLE'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>{created}</Text>
          </View>
          {totalStr && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Job total</Text>
              <Text style={styles.infoValue}>${totalStr}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Invoice amount</Text>
            <Text style={styles.totalAmount}>${amountStr}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        {!isPaid ? (
          <TouchableOpacity
            style={styles.convertBtn}
            onPress={async () => {
              const res = await updateInvoiceStatus(inv.id, 'PAID');
              if (res.success) {
                Alert.alert('Success', 'Invoice marked as paid.', [
                  { text: 'OK', onPress: () => navigation.goBack() },
                ]);
              } else {
                Alert.alert('Error', res.message || 'Could not update invoice status');
              }
            }}
          >
            <Text style={styles.convertBtnText}>Mark as Paid</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.convertBtn} onPress={() => navigation.navigate('AdminTabs')}>
            <Text style={styles.convertBtnText}>Back to Explore</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  missText: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 16 },
  backLink: { alignSelf: 'flex-start' },
  backLinkText: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  headerTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  menuBtn: { width: 40, height: 40 },
  scrollContent: { padding: 16, paddingBottom: 100 },
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
  quoteId: { fontSize: 20, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusBadgeText: { fontSize: 12, fontFamily: FONTS.semiBold },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  infoLabel: { fontSize: 14, color: COLORS.textTertiary },
  infoValue: { fontSize: 15, fontFamily: FONTS.semiBold, color: COLORS.textPrimary, flex: 1, textAlign: 'right' },
  totalAmount: { fontSize: 18, fontFamily: FONTS.bold, color: '#0062E1' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  convertBtn: {
    backgroundColor: '#0062E1',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  convertBtnText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.bold },
});
