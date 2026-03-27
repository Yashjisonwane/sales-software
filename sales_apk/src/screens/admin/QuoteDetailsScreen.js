import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, SIZES, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const QuoteDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { id, customer, type, date, amount, status, role } = route.params || {
    id: '#QT-2045',
    customer: 'Alistair Hughes',
    type: 'HVAC Installation',
    date: 'Jan 14, 2026',
    amount: '1,896.15',
    status: 'Approved',
    role: 'admin'
  };

  const isWorker = role === 'worker';
  const homeRoute = isWorker ? 'WorkerTabs' : 'AdminTabs';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quote Details</Text>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Quote Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.quoteId}>{id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: status === 'Approved' ? '#ECFDF5' : status === 'Sent' ? '#EFF6FF' : '#FEF2F2' }]}>
              <Text style={[styles.statusBadgeText, { color: status === 'Approved' ? '#10B981' : status === 'Sent' ? '#3B82F6' : '#EF4444' }]}>{status}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer Name</Text>
            <Text style={styles.infoValue}>{customer}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service Type</Text>
            <Text style={styles.infoValue}>{type}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created Date</Text>
            <Text style={styles.infoValue}>{date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>${amount}</Text>
          </View>
        </View>

        {/* Action Options */}
        <Text style={styles.sectionTitle}>Available Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="send-outline" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionLabel}>Send to Client</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="create-outline" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.actionLabel}>Edit Quote</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="trash-outline" size={24} color="#EF4444" />
            </View>
            <Text style={styles.actionLabel}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Placeholder for Scope/Description */}
        <View style={styles.scopeSection}>
          <Text style={styles.sectionTitle}>Scope of Work</Text>
          <View style={styles.scopeContent}>
            <Text style={styles.scopeText}>
              • Professional HVAC system installation{"\n"}
              • Removal of old equipment{"\n"}
              • Testing and commissioning of the new unit{"\n"}
              • 1-year labor warranty included
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Primary Action Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity 
          style={styles.convertBtn}
          onPress={() => navigation.navigate(homeRoute)}
        >
          <Text style={styles.convertBtnText}>{isWorker ? 'Back to Dashboard' : 'Convert to Job'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
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
  menuBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  
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
  infoValue: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
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
  convertBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});

export default QuoteDetailsScreen;
