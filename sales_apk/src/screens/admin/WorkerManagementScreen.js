import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const WorkerManagementScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const workers = [
    {
      id: 1,
      name: 'John Carter',
      initials: 'JC',
      role: 'Subcontractor',
      type: 'Plumber',
      status: 'Active',
      stats: {
        active: 3,
        completed: 32,
        completion: '92%',
        earnings: '$12,500'
      }
    },
    {
      id: 2,
      name: 'Sarah Willson',
      initials: 'SW',
      role: 'Lead',
      type: 'Plumber',
      status: 'Active',
      stats: {
        active: 3,
        completed: 32,
        completion: '92%',
        earnings: '$12,500'
      }
    }
  ];

  const ActionButton = ({ icon, label, color, onPress }) => (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={[styles.actionBtnText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );

  const WorkerCard = ({ worker }) => (
    <View style={styles.workerCard}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{worker.initials}</Text></View>
        <View style={styles.workerInfo}>
          <Text style={styles.workerName}>{worker.name}</Text>
          <Text style={styles.workerRole}>{worker.role}</Text>
          <View style={styles.tagRow}>
            <View style={[styles.tag, { backgroundColor: '#F5F3FF' }]}><Text style={[styles.tagText, { color: '#8B5CF6' }]}>{worker.type}</Text></View>
            <View style={[styles.tag, { backgroundColor: '#ECFDF5' }]}><Text style={[styles.tagText, { color: '#10B981' }]}>{worker.status}</Text></View>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{worker.stats.active}</Text>
          <Text style={styles.statLabel}>Active Jobs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{worker.stats.completed}</Text>
          <Text style={styles.statLabel}>Jobs Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#10B981' }]}>{worker.stats.completion}</Text>
          <Text style={styles.statLabel}>Completion</Text>
        </View>
      </View>

      <View style={styles.earningsRow}>
        <Text style={styles.earningsLabel}>Total Earnings: <Text style={styles.earningsValue}>{worker.stats.earnings}</Text></Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={styles.profileBtn}
          onPress={() => navigation.navigate('WorkerProfile', { worker })}
        >
          <Text style={styles.profileBtnText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.jobsBtn}
          onPress={() => navigation.navigate('AdminJobs', { worker })}
        >
          <Text style={styles.jobsBtnText}>View Jobs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Map Background Mock */}
      <View style={styles.mapBackground}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=400' }} 
          style={styles.mapImage}
        />
      </View>

      {/* Main Content Card */}
      <View style={[styles.mainCard, { marginTop: insets.top + 20 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Worker Management</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.introSection}>
            <Text style={styles.introTitle}>Workers Overview</Text>
            <Text style={styles.introSub}>View activity, performance metrics, and job status across your workforce.</Text>
          </View>

          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={22} color="#1A202C" />
              <TextInput
                placeholder="Search here"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholderTextColor="#A0AEC0"
              />
            </View>
          </View>

          {workers.map(worker => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mapBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 200 },
  mapImage: { width: '100%', height: '100%', opacity: 0.6 },
  
  mainCard: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40,
    overflow: 'hidden'
  },
  
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  scrollContent: { padding: 20 },
  
  introSection: { marginBottom: 20 },
  introTitle: { fontSize: 22, fontWeight: '700', color: '#1A202C' },
  introSub: { fontSize: 14, color: '#718096', marginTop: 4, lineHeight: 20 },

  searchSection: { marginBottom: 24 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.small,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#1A202C' },

  workerCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.white, fontSize: 22, fontWeight: '700' },
  workerInfo: { flex: 1, marginLeft: 16 },
  workerName: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
  workerRole: { fontSize: 13, color: '#718096', marginTop: 2 },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '700' },

  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
  statLabel: { fontSize: 11, color: '#718096', marginTop: 4 },

  earningsRow: { 
    paddingVertical: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9',
    marginBottom: 20 
  },
  earningsLabel: { fontSize: 14, color: '#718096' },
  earningsValue: { fontWeight: '700', color: '#1A202C' },

  actionsRow: { flexDirection: 'row', gap: 12 },
  profileBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  profileBtnText: { fontSize: 15, fontWeight: '600', color: '#1A202C' },
  jobsBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0E56D0',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small
  },
  jobsBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});

export default WorkerManagementScreen;
