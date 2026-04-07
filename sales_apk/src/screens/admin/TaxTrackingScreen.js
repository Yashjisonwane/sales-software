import React, { useState, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../constants/theme';
import BusinessModuleBanner from '../../components/business/BusinessModuleBanner';
import { getAdminTaxPayroll } from '../../api/apiService';

const { width } = Dimensions.get('window');

const TaxTrackingScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Workers');
  const [workerFilter, setWorkerFilter] = useState('All');
  const [docFilter, setDocFilter] = useState('All');
  const insets = useSafeAreaInsets();
  const tabs = ['Workers', 'Documents', 'Payments'];

  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totals, setTotals] = useState({ paid: 0, pending: 0, overdue: 0 });
  const [docsNote, setDocsNote] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getAdminTaxPayroll();
    if (res.success && res.data) {
      setWorkers(res.data.workers || []);
      setDocuments(res.data.documents || []);
      setPayments(res.data.payments || []);
      setTotals(res.data.totals || { paid: 0, pending: 0, overdue: 0 });
      setDocsNote(res.data.documentsNote || '');
    } else {
      setWorkers([]);
      setDocuments([]);
      setPayments([]);
      Alert.alert('Could not load', res.message || 'Tax & payroll snapshot failed');
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filteredWorkers = workers.filter((w) => {
    if (workerFilter === 'All') return true;
    if (workerFilter === 'Active') return w.status === 'Active';
    if (workerFilter === 'Inactive') return w.status === 'Inactive';
    if (workerFilter === '1099') return w.classification?.includes('1099') || w.splitNote?.includes('%');
    if (workerFilter === 'W-2') return w.classification?.includes('W-2');
    return true;
  });

  const renderWorkers = () => (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {['All', 'W-2', '1099', 'Active', 'Inactive'].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setWorkerFilter(filter)}
            style={[styles.filterChip, workerFilter === filter && styles.activeFilterChip]}
          >
            <Text style={[styles.filterChipText, workerFilter === filter && styles.activeFilterChipText]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 32 }} color="#0062E1" />
        ) : filteredWorkers.length === 0 ? (
          <Text style={{ color: COLORS.textTertiary, marginTop: 16 }}>No workers in database.</Text>
        ) : (
          filteredWorkers.map((worker) => (
            <View key={worker.id} style={styles.workerItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{worker.initials}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.workerName}>{worker.name}</Text>
                <Text style={styles.workerSub} numberOfLines={2}>
                  {worker.splitNote || worker.classification}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: worker.status === 'Active' ? '#ECFDF5' : '#F1F5F9' }]}>
                <Text style={[styles.statusText, { color: worker.status === 'Active' ? '#10B981' : '#64748B' }]}>{worker.status}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderDocuments = () => (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {['All', 'W-2', '1099'].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setDocFilter(filter)}
            style={[styles.filterChip, docFilter === filter && styles.activeFilterChip, { minWidth: (width - 60) / 3 }]}
          >
            <Text style={[styles.filterChipText, docFilter === filter && styles.activeFilterChipText]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {docsNote ? (
          <View style={[styles.docCard, { marginBottom: 16 }]}>
            <Text style={styles.docName}>Tax documents</Text>
            <Text style={styles.docType}>{docsNote}</Text>
          </View>
        ) : null}
        {documents.length === 0 ? (
          <Text style={{ color: COLORS.textTertiary }}>No PDFs stored yet.</Text>
        ) : (
          documents.map((doc, idx) => (
            <View key={idx} style={styles.docCard}>
              <View style={styles.docHeader}>
                <View>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docType}>{doc.type}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderPayments = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Paid (invoices)</Text>
          <Text style={styles.statValue}>${Number(totals.paid || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Unpaid</Text>
          <Text style={styles.statValue}>${Number(totals.pending || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Overdue</Text>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>${Number(totals.overdue || 0).toLocaleString()}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Invoice lines</Text>
      {loading ? (
        <ActivityIndicator color="#0062E1" />
      ) : payments.length === 0 ? (
        <Text style={{ color: COLORS.textTertiary }}>No invoices yet.</Text>
      ) : (
        payments.map((pay) => (
          <View key={pay.id} style={styles.paymentCard}>
            <View style={styles.docHeader}>
              <View>
                <Text style={styles.docName}>{pay.workerName}</Text>
                <Text style={styles.docType}>
                  {pay.jobNo} • {pay.customerLabel} • {pay.dateLabel}
                </Text>
                <Text style={styles.paymentAmount}>${Number(pay.amount).toLocaleString()}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      pay.status === 'PAID' ? '#ECFDF5' : pay.status === 'UNPAID' ? '#FFF7ED' : '#F1F5F9',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: pay.status === 'PAID' ? '#10B981' : pay.status === 'UNPAID' ? '#F59E0B' : '#64748B' },
                  ]}
                >
                  {pay.status}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tax & Payroll</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Export', 'Connect accounting export in a future release.')}>
          <Ionicons name="download-outline" size={16} color={COLORS.white} />
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <BusinessModuleBanner
          title="Database-backed snapshot"
          subtitle="Workers and invoice amounts come from your API. W-2/1099 PDFs are not stored until you add file uploads."
        />
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabWrapper}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {activeTab === 'Workers' && renderWorkers()}
        {activeTab === 'Documents' && renderDocuments()}
        {activeTab === 'Payments' && renderPayments()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  exportText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },

  tabContainer: { padding: 16, backgroundColor: COLORS.white },
  tabWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 25,
    padding: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tab: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 22 },
  activeTab: { backgroundColor: '#0062E1', ...SHADOWS.small },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  activeTabText: { color: COLORS.white },

  filterScroll: { paddingVertical: 12, backgroundColor: COLORS.white },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterChip: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  activeFilterChipText: { color: COLORS.white },

  scrollContent: { padding: 16, paddingBottom: 100 },

  workerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  workerName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  workerSub: { fontSize: 13, color: COLORS.textTertiary, marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '700' },

  docCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  docHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  docName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  docType: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6 },
  docDate: { fontSize: 13, color: COLORS.textTertiary, marginTop: 6 },
  docActions: { flexDirection: 'row', gap: 12 },
  downloadBtn: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#1E293B', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white },
  downloadBtnText: { fontWeight: '700', color: COLORS.textPrimary, fontSize: 15 },
  viewBtn: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center' },
  viewBtnText: { fontWeight: '700', color: COLORS.white, fontSize: 15 },

  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  statLabel: { fontSize: 12, color: COLORS.textTertiary, marginBottom: 4, textAlign: 'center' },
  statValue: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },

  paymentCard: { backgroundColor: '#F8FAFC', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  paymentAmount: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginTop: 10 },
  viewJobBtn: { backgroundColor: '#0062E1', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  viewJobText: { color: COLORS.white, fontWeight: '700' },
});

export default TaxTrackingScreen;
