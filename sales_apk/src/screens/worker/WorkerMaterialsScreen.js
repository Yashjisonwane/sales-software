import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/theme';
import BusinessModuleBanner from '../../components/business/BusinessModuleBanner';
import { getWorkerMaterialsSnapshot } from '../../api/apiService';

export default function WorkerMaterialsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'In Stock', 'Low Stock', 'My quotes'];
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getWorkerMaterialsSnapshot();
    if (res.success && res.data) {
      setItems(res.data.items || []);
      setNote(res.data.note || '');
    } else setItems([]);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return items.filter((item) => {
      const matchQ = !q || item.name.toLowerCase().includes(q) || (item.category || '').toLowerCase().includes(q);
      if (!matchQ) return false;
      if (activeFilter === 'All') return true;
      if (activeFilter === 'In Stock') return item.status === 'In Stock';
      if (activeFilter === 'Low Stock') return item.status === 'Low Stock';
      if (activeFilter === 'My quotes') return (item.quoteRefs || 0) > 0;
      return true;
    });
  }, [items, searchText, activeFilter]);

  const lowCount = items.filter((i) => i.status === 'Low Stock').length;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Stock':
        return { bg: '#DCFCE7', text: '#16A34A' };
      case 'Low Stock':
        return { bg: '#FEF3C7', text: '#D97706' };
      default:
        return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quoted materials</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <BusinessModuleBanner title="Your jobs only" subtitle={note} />

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#64748B" />
          <TextInput
            placeholder="Search materials"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.filterChip, activeFilter === f && styles.activeFilterChip]}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.activeFilterChipText]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{items.length}</Text>
              <Text style={styles.statLabel}>Line items</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{items.reduce((s, i) => s + (i.quoteRefs || 0), 0)}</Text>
              <Text style={styles.statLabel}>Quote refs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{lowCount}</Text>
              <Text style={styles.statLabel}>Low qty</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Materials</Text>
        {loading ? (
          <ActivityIndicator color="#0062E1" style={{ marginTop: 24 }} />
        ) : filtered.length === 0 ? (
          <Text style={{ color: COLORS.textTertiary }}>No line items in your saved quotes yet.</Text>
        ) : (
          filtered.map((item) => {
            const st = getStatusStyle(item.status);
            return (
              <View key={item.id} style={styles.partItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.partName}>{item.name}</Text>
                  <Text style={styles.partCategory}>{item.category}</Text>
                  <Text style={styles.partUnits}>
                    {item.remaining}
                    {item.quoteRefs ? ` · ${item.quoteRefs} quotes` : ''}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.text }]}>{item.status}</Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  scroll: { padding: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.textPrimary },
  filterScroll: { marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    backgroundColor: COLORS.white,
  },
  activeFilterChip: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  activeFilterChipText: { color: COLORS.white },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, color: COLORS.textTertiary, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  partItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  partName: { fontSize: 15, fontWeight: '700' },
  partCategory: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  partUnits: { fontSize: 12, color: COLORS.textTertiary, marginTop: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700' },
});
