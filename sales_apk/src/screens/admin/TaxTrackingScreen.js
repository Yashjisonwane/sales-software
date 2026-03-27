import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, SIZES, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const TaxTrackingScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Workers');
  const [activeFilter, setActiveFilter] = useState('All');
  const insets = useSafeAreaInsets();
  const tabs = ['Workers', 'Documents', 'Payments'];

  const renderWorkers = () => (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {['All', 'W-2', '1099', 'Active', 'Inactive'].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
          >
            <Text style={[styles.filterChipText, activeFilter === filter && styles.activeFilterChipText]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {[
          { initials: 'JM', name: 'John Miller', role: 'Technician', type: 'W-2', status: 'Active' },
          { initials: 'MT', name: 'Mike Thompson', role: 'Contractor', type: '1099', status: 'Inactive' },
          { initials: 'JM', name: 'John Miller', role: 'Technician', type: 'W-2', status: 'Active' },
          { initials: 'JM', name: 'John Miller', role: 'Technician', type: 'W-2', status: 'Active' },
          { initials: 'SL', name: 'John Miller', role: 'Office Admin', type: 'W-2', status: 'Inactive' },
          { initials: 'AR', name: 'John Miller', role: 'Contractor', type: '1099', status: 'Active' },
          { initials: 'SL', name: 'John Miller', role: 'Office Admin', type: 'W-2', status: 'Inactive' },
          { initials: 'SL', name: 'John Miller', role: 'Office Admin', type: 'W-2', status: 'Inactive' },
        ].map((worker, idx) => (
          <View key={idx} style={styles.workerItem}>
            <View style={styles.avatar}>
               <Text style={styles.avatarText}>{worker.initials}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <Text style={styles.workerSub}>{worker.role} • {worker.type}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: worker.status === 'Active' ? '#ECFDF5' : '#F1F5F9' }]}>
              <Text style={[styles.statusText, { color: worker.status === 'Active' ? '#10B981' : '#64748B' }]}>{worker.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderDocuments = () => (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {['All', 'W-2', '1099'].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip, { width: (width - 60) / 3 }]}
          >
            <Text style={[styles.filterChipText, activeFilter === filter && styles.activeFilterChipText]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {[
          { name: 'John Miller', type: 'W-2 – 2025', date: 'Jan 10, 2026', status: 'Completed' },
          { name: 'Mike Thompson', type: '1099-NEC – 2025', date: 'Jan 8, 2026', status: 'Pending Signature' },
          { name: 'Mike Thompson', type: '1099-NEC – 2025', date: 'Jan 8, 2026', status: 'Pending Signature' },
          { name: 'Mike Thompson', type: '1099-NEC – 2025', date: 'Jan 8, 2026', status: 'Pending Signature' },
          { name: 'Mike Thompson', type: '1099-NEC – 2025', date: 'Jan 8, 2026', status: 'Pending Signature' },
        ].map((doc, idx) => (
          <View key={idx} style={styles.docCard}>
            <View style={styles.docHeader}>
              <View>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docType}>{doc.type}</Text>
                <Text style={styles.docDate}>Uploaded: {doc.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: doc.status === 'Completed' ? '#ECFDF5' : '#FFF7ED' }]}>
                <Text style={[styles.statusText, { color: doc.status === 'Completed' ? '#10B981' : '#F59E0B' }]}>{doc.status}</Text>
              </View>
            </View>
            <View style={styles.docActions}>
              <TouchableOpacity style={styles.downloadBtn}><Text style={styles.downloadBtnText}>Download</Text></TouchableOpacity>
              <TouchableOpacity style={styles.viewBtn}><Text style={styles.viewBtnText}>View</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderPayments = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Paid</Text>
          <Text style={styles.statValue}>$24,580</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statValue}>$3,200</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Overdue</Text>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>$850</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>All Payments</Text>

      {[
        { name: 'John Miller', job: 'Job #231', date: 'Jan 5, 2026', amount: '$480', status: 'Paid' },
        { name: 'John Miller', job: 'Job #231', date: 'Jan 5, 2026', amount: '$480', status: 'Overdue' },
        { name: 'John Miller', job: 'Job #231', date: 'Jan 5, 2026', amount: '$480', status: 'Pending' },
      ].map((pay, idx) => (
        <View key={idx} style={styles.paymentCard}>
          <View style={styles.docHeader}>
            <View>
              <Text style={styles.docName}>{pay.name}</Text>
              <Text style={styles.docType}>{pay.job} • {pay.date}</Text>
              <Text style={styles.paymentAmount}>{pay.amount}</Text>
            </View>
            <View style={[styles.statusBadge, {
              backgroundColor: pay.status === 'Paid' ? '#ECFDF5' : pay.status === 'Overdue' ? '#FEF2F2' : '#FFF7ED'
            }]}>
              <Text style={[styles.statusText, {
                color: pay.status === 'Paid' ? '#10B981' : pay.status === 'Overdue' ? '#EF4444' : '#F59E0B'
              }]}>{pay.status}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewJobBtn}><Text style={styles.viewJobText}>View Job</Text></TouchableOpacity>
        </View>
      ))}
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
        <TouchableOpacity style={styles.exportBtn}>
          <Ionicons name="download-outline" size={16} color={COLORS.white} />
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <View style={styles.tabWrapper}>
          {tabs.map(tab => (
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
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1E293B', paddingHorizontal: 12,
    paddingVertical: 8, borderRadius: 20, gap: 6
  },
  exportText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },

  tabContainer: { padding: 16, backgroundColor: COLORS.white },
  tabWrapper: {
    flexDirection: 'row', backgroundColor: '#F8FAFC',
    borderRadius: 25, padding: 4, borderWidth: 1, borderColor: '#F1F5F9'
  },
  tab: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 22 },
  activeTab: { backgroundColor: '#0062E1', ...SHADOWS.small },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  activeTabText: { color: COLORS.white },

  filterScroll: { paddingVertical: 12, backgroundColor: COLORS.white },
  filterChip: {
    paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 20, backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: '#E2E8F0', marginRight: 10,
    alignItems: 'center', justifyContent: 'center'
  },
  activeFilterChip: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  activeFilterChipText: { color: COLORS.white },

  scrollContent: { padding: 16, paddingBottom: 100 },

  workerItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
    padding: 16, borderRadius: 24, marginBottom: 12, 
    borderWidth: 1, borderColor: '#F1F5F9',
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
    borderColor: '#F1F5F9' 
  },
  docHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
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
  statLabel: { fontSize: 12, color: COLORS.textTertiary, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },

  paymentCard: { backgroundColor: '#F8FAFC', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  paymentAmount: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginTop: 10 },
  viewJobBtn: { backgroundColor: '#0062E1', height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  viewJobText: { color: COLORS.white, fontWeight: '700' },
});

export default TaxTrackingScreen;
