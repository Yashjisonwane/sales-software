import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Dimensions,
  Switch,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';
import BusinessModuleBanner from '../../components/business/BusinessModuleBanner';
import {
  getProfessionals,
  getSubscriptionUpgradeRequests,
  approveSubscriptionUpgrade,
  rejectSubscriptionUpgrade,
} from '../../api/apiService';

function initialsFromName(name) {
  if (!name || typeof name !== 'string') return '?';
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const { width } = Dimensions.get('window');

const TeamAccountsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [upgradeRequests, setUpgradeRequests] = useState([]);

  const tabs = ['Requests', 'Team Members', 'Roles & Permissions'];
  const roles = ['All', 'Admin', 'Manager', 'Technician', 'Sales'];

  // Permissions state
  const [permissions, setPermissions] = useState({
    Admin: { viewJobs: true, editJobs: true, assignJobs: true, viewPayments: true, requestIncrease: true, analytics: true },
    Manager: { viewJobs: true, editJobs: true, assignJobs: true, viewPayments: true, requestIncrease: false, analytics: false },
    FieldWorker: { viewJobs: true, editJobs: false, assignJobs: false, viewPayments: false, requestIncrease: true, analytics: false },
    SalesAgent: { viewJobs: true, editJobs: false, assignJobs: false, viewPayments: true, requestIncrease: true, analytics: false },
  });

  const togglePermission = (role, key) => {
    setPermissions(prev => ({
      ...prev,
      [role]: { ...prev[role], [key]: !prev[role][key] }
    }));
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const [proRes, upRes] = await Promise.all([getProfessionals(), getSubscriptionUpgradeRequests()]);
    if (proRes.success && Array.isArray(proRes.data)) setMembers(proRes.data);
    else setMembers([]);
    if (upRes.success && Array.isArray(upRes.data)) setUpgradeRequests(upRes.data);
    else setUpgradeRequests([]);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return members.filter((m) => {
      const name = (m.name || '').toLowerCase();
      const cat = (m.category || '').toLowerCase();
      const matchQ = !q || name.includes(q) || cat.includes(q);
      if (roleFilter === 'All') return matchQ;
      if (roleFilter === 'Admin') return matchQ && m.role === 'ADMIN';
      if (roleFilter === 'Technician') return matchQ && m.role === 'WORKER';
      if (roleFilter === 'Manager') return matchQ && m.role === 'WORKER';
      if (roleFilter === 'Sales') return matchQ && m.role === 'WORKER';
      return matchQ;
    });
  }, [members, searchQuery, roleFilter]);

  const onApproveUpgrade = async (id) => {
    const res = await approveSubscriptionUpgrade(id);
    if (res.success) {
      Alert.alert('Approved', res.message || 'Plan updated.');
      loadData();
    } else Alert.alert('Error', res.message || 'Could not approve');
  };

  const onRejectUpgrade = async (id) => {
    const res = await rejectSubscriptionUpgrade(id);
    if (res.success) {
      Alert.alert('Rejected', res.message || 'Request rejected.');
      loadData();
    } else Alert.alert('Error', res.message || 'Could not reject');
  };

  const UpgradeRequestCard = ({ item }) => {
    const u = item.user || {};
    const plan = item.plan || {};
    const status = (item.status || 'PENDING').toUpperCase();
    const pending = status === 'PENDING';
    return (
    <View style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initialsFromName(u.name)}</Text></View>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{u.name || 'User'}</Text>
          <Text style={styles.memberSub}>Subscription • {plan.name || 'Plan'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: pending ? '#FFF7ED' : '#ECFDF5' }]}>
          <Text style={[styles.statusBadgeText, { color: pending ? '#F59E0B' : '#10B981' }]}>{status}</Text>
        </View>
      </View>

      <View style={styles.effectiveBox}>
        <Text style={styles.effectiveText}>
          Requested {plan.price != null ? `$${Number(plan.price).toFixed(0)}/mo ` : ''}
          · {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
        </Text>
      </View>

      {pending ? (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => onRejectUpgrade(item.id)}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveBtn} onPress={() => onApproveUpgrade(item.id)}>
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.viewDetailsBtn} onPress={() => {}}>
          <Text style={styles.viewDetailsText}>Closed</Text>
        </TouchableOpacity>
      )}
    </View>
    );
  };

  const MemberItem = ({ name, role, status, lastActive, roleColor, initials }) => (
    <View style={styles.memberCard}>
      <View style={styles.avatarJM}><Text style={styles.avatarText}>{initials}</Text></View>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={styles.memberName}>{name}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + '15' }]}>
            <Text style={[styles.roleBadgeText, { color: roleColor }]}>{role}</Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: status === 'Active' ? '#ECFDF5' : '#F1F5F9' }]}>
            <Text style={[styles.roleBadgeText, { color: status === 'Active' ? '#10B981' : '#64748B' }]}>{status}</Text>
          </View>
        </View>
        <Text style={styles.lastActiveText}>Last Active: {lastActive}</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const PermissionRow = ({ label, value, onToggle }) => (
    <View style={styles.permissionRow}>
      <Text style={styles.permissionLabel}>{label}</Text>
      <Switch 
        value={value} 
        onValueChange={onToggle}
        trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
        thumbColor={Platform.OS === 'ios' ? undefined : '#fff'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Team Sub-Accounts</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <BusinessModuleBanner
          title="Live team data"
          subtitle="Team Members = workers from /users/workers. Requests = subscription upgrade requests from your database."
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
        {activeTab === 'Requests' && (
          <View style={styles.section}>
            <View style={styles.tabIntro}>
              <Text style={styles.tabIntroTitle}>Subscription upgrade requests</Text>
              <Text style={styles.tabIntroSub}>Approve or reject plan changes from professionals.</Text>
            </View>

            {loading ? (
              <ActivityIndicator style={{ marginTop: 24 }} color="#0062E1" />
            ) : upgradeRequests.length === 0 ? (
              <Text style={{ color: COLORS.textTertiary, marginTop: 8 }}>No upgrade requests in the database.</Text>
            ) : (
              <View style={styles.requestsList}>
                {upgradeRequests.map((item) => (
                  <UpgradeRequestCard key={item.id} item={item} />
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'Team Members' && (
          <View style={styles.section}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={22} color={COLORS.textTertiary} />
              <TextInput 
                placeholder="Search Team Member" 
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {roles.map(r => (
                <TouchableOpacity 
                  key={r} 
                  onPress={() => setRoleFilter(r)}
                  style={[styles.filterChip, roleFilter === r && styles.activeFilterChip]}
                >
                  <Text style={[styles.filterChipText, roleFilter === r && styles.activeFilterChipText]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {loading ? (
              <ActivityIndicator style={{ marginTop: 24 }} color="#0062E1" />
            ) : filteredMembers.length === 0 ? (
              <Text style={{ color: COLORS.textTertiary, marginTop: 12 }}>No workers found. Add professionals from admin / worker management.</Text>
            ) : (
              <View style={styles.membersList}>
                {filteredMembers.map((m) => (
                  <MemberItem
                    key={m.id}
                    name={m.name || 'Worker'}
                    role={m.category || 'Professional'}
                    status={m.isAvailable ? 'Active' : 'Inactive'}
                    lastActive={m.lastUpdate ? new Date(m.lastUpdate).toLocaleString() : '—'}
                    roleColor={m.isAvailable ? '#10B981' : '#94A3B8'}
                    initials={initialsFromName(m.name)}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'Roles & Permissions' && (
          <View style={styles.section}>
            <View style={styles.tabIntro}>
              <Text style={styles.tabIntroTitle}>Roles & Permissions</Text>
              <Text style={styles.tabIntroSub}>UI presets only — backend RBAC is not stored yet. Real roles use ADMIN vs WORKER in the API.</Text>
            </View>

            <View style={styles.rolePermissionCard}>
               <Text style={styles.roleTitle}>Admin</Text>
               <PermissionRow label="View Jobs" value={permissions.Admin.viewJobs} onToggle={() => togglePermission('Admin', 'viewJobs')} />
               <PermissionRow label="Edit Jobs" value={permissions.Admin.editJobs} onToggle={() => togglePermission('Admin', 'editJobs')} />
               <PermissionRow label="Assign Jobs" value={permissions.Admin.assignJobs} onToggle={() => togglePermission('Admin', 'assignJobs')} />
               <PermissionRow label="View Payments" value={permissions.Admin.viewPayments} onToggle={() => togglePermission('Admin', 'viewPayments')} />
               <PermissionRow label="Request Increase" value={permissions.Admin.requestIncrease} onToggle={() => togglePermission('Admin', 'requestIncrease')} />
               <PermissionRow label="Access Analytics" value={permissions.Admin.analytics} onToggle={() => togglePermission('Admin', 'analytics')} />
            </View>

            <View style={styles.rolePermissionCard}>
               <Text style={styles.roleTitle}>Manager</Text>
               <PermissionRow label="View Jobs" value={permissions.Manager.viewJobs} onToggle={() => togglePermission('Manager', 'viewJobs')} />
               <PermissionRow label="Edit Jobs" value={permissions.Manager.editJobs} onToggle={() => togglePermission('Manager', 'editJobs')} />
               <PermissionRow label="Assign Jobs" value={permissions.Manager.assignJobs} onToggle={() => togglePermission('Manager', 'assignJobs')} />
               <PermissionRow label="View Payments" value={permissions.Manager.viewPayments} onToggle={() => togglePermission('Manager', 'viewPayments')} />
            </View>

            <View style={styles.rolePermissionCard}>
               <Text style={styles.roleTitle}>Field Worker</Text>
               <PermissionRow label="View Jobs" value={permissions.FieldWorker.viewJobs} onToggle={() => togglePermission('FieldWorker', 'viewJobs')} />
               <PermissionRow label="Edit Jobs" value={permissions.FieldWorker.editJobs} onToggle={() => togglePermission('FieldWorker', 'editJobs')} />
               <PermissionRow label="Assign Jobs" value={permissions.FieldWorker.assignJobs} onToggle={() => togglePermission('FieldWorker', 'assignJobs')} />
               <PermissionRow label="View Payments" value={permissions.FieldWorker.viewPayments} onToggle={() => togglePermission('FieldWorker', 'viewPayments')} />
               <PermissionRow label="Request Increase" value={permissions.FieldWorker.requestIncrease} onToggle={() => togglePermission('FieldWorker', 'requestIncrease')} />
               <PermissionRow label="Access Analytics" value={permissions.FieldWorker.analytics} onToggle={() => togglePermission('FieldWorker', 'analytics')} />
            </View>

            <View style={styles.rolePermissionCard}>
               <Text style={styles.roleTitle}>Sales Agent</Text>
               <PermissionRow label="View Jobs" value={permissions.SalesAgent.viewJobs} onToggle={() => togglePermission('SalesAgent', 'viewJobs')} />
               <PermissionRow label="Edit Jobs" value={permissions.SalesAgent.editJobs} onToggle={() => togglePermission('SalesAgent', 'editJobs')} />
               <PermissionRow label="Assign Jobs" value={permissions.SalesAgent.assignJobs} onToggle={() => togglePermission('SalesAgent', 'assignJobs')} />
               <PermissionRow label="View Payments" value={permissions.SalesAgent.viewPayments} onToggle={() => togglePermission('SalesAgent', 'viewPayments')} />
               <PermissionRow label="Request Increase" value={permissions.SalesAgent.requestIncrease} onToggle={() => togglePermission('SalesAgent', 'requestIncrease')} />
               <PermissionRow label="Access Analytics" value={permissions.SalesAgent.analytics} onToggle={() => togglePermission('SalesAgent', 'analytics')} />
            </View>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {activeTab === 'Team Members' && (
        <View style={[styles.bottomButtonArea, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity 
            style={styles.addMemberBtn}
            onPress={() => navigation.navigate('AddMember')}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
            <Text style={styles.addMemberText}>Add New Member</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  
  tabsWrapper: { paddingVertical: 10 },
  tabsScroll: { paddingHorizontal: 16, gap: 10 },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: COLORS.white,
  },
  activeTabItem: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  activeTabText: { color: COLORS.white },

  contentScroll: { padding: 16 },
  tabIntro: { marginBottom: 20 },
  tabIntroTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  tabIntroSub: { fontSize: 14, color: COLORS.textTertiary, marginTop: 4 },

  requestsList: { gap: 16 },
  requestCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  avatarJM: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  memberInfo: { flex: 1, marginLeft: 12 },
  memberName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  memberSub: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },

  statsTable: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCol: { alignItems: 'center', flex: 1 },
  statVal: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  statLab: { fontSize: 11, color: COLORS.textTertiary, marginTop: 4 },
  
  effectiveBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 20 },
  effectiveText: { fontSize: 13, color: COLORS.textSecondary },

  actionRow: { flexDirection: 'row', gap: 12 },
  rejectBtn: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  rejectText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
  approveBtn: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center' },
  approveText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  viewDetailsBtn: { height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  viewDetailsText: { color: COLORS.textPrimary, fontWeight: '600' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.textPrimary },
  filterRow: { marginBottom: 20, flexDirection: 'row' },
  filterChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
  activeFilterChip: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  activeFilterChipText: { color: COLORS.white },

  membersList: { gap: 12 },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 4, marginBottom: 6 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  roleBadgeText: { fontSize: 11, fontWeight: '700' },
  lastActiveText: { fontSize: 12, color: COLORS.textTertiary },

  bottomButtonArea: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(255,255,255,0.9)' },
  addMemberBtn: {
    backgroundColor: '#0062E1',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOWS.medium,
  },
  addMemberText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },

  rolePermissionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 0,
  },
  roleTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 20 },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  permissionLabel: { fontSize: 15, color: COLORS.textSecondary },
});

export default TeamAccountsScreen;
