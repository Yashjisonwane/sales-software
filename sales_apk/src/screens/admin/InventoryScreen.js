import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const InventoryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'In Stock', 'Low Stock', 'Assigned to Jobs'];

  const inventoryItems = [
    { id: '1', name: 'Copper Pipe ¾', category: 'Plumbing', remaining: '24 units', status: 'In Stock' },
    { id: '2', name: 'Cement Bags', category: 'Building', remaining: '08 units', status: 'Low Stock' },
    { id: '3', name: 'LED Strip Lights', category: 'Electrical', remaining: '24 units', status: 'Out of Stock' },
    { id: '4', name: 'PVC Pipe – 2 inch', category: 'Plumbing', remaining: '101 units', status: 'In Stock' },
    { id: '5', name: 'Electrical Wire – 100m', category: 'Electrical', remaining: '12 units', status: 'In Stock' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Stock': return { bg: '#DCFCE7', text: '#16A34A' };
      case 'Low Stock': return { bg: '#FEF3C7', text: '#D97706' };
      case 'Out of Stock': return { bg: '#FEF2F2', text: '#EF4444' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory & Parts</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add-circle-outline" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#64748B" />
          <TextInput
            placeholder="Search here"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <Ionicons name="mic-outline" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
            >
              <Text style={[styles.filterChipText, activeFilter === filter && styles.activeFilterChipText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Inventory Summary</Text>
          <Text style={styles.summarySub}>Monitor stock and low-inventory items.</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconBg, { backgroundColor: '#F0F7FF' }]}>
                <Ionicons name="build-outline" size={20} color="#0062E1" />
              </View>
              <Text style={styles.statValue}>342</Text>
              <Text style={styles.statLabel}>Total Parts</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconBg, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="logo-usd" size={20} color="#16A34A" />
              </View>
              <Text style={styles.statValue}>$42,800</Text>
              <Text style={styles.statLabel}>Total Value</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconBg, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="warning-outline" size={20} color="#D97706" />
              </View>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>Low Stock</Text>
            </View>
          </View>
        </View>

        {/* Parts List */}
        <Text style={styles.sectionTitle}>All Parts</Text>
        {inventoryItems.map(item => {
          const statusStyle = getStatusStyle(item.status);
          return (
            <TouchableOpacity key={item.id} style={styles.partItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.partName}>{item.name}</Text>
                <Text style={styles.partCategory}>{item.category}</Text>
                <Text style={styles.partUnits}>{item.remaining} remaining</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  addBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },

  scrollContent: { padding: 16 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    height: 54,
    borderRadius: 27,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.textPrimary },

  filterScroll: { marginBottom: 20 },
  filterChip: {
    paddingHorizontal: 18,
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
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  summaryTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  summarySub: { fontSize: 13, color: COLORS.textTertiary, marginTop: 4, marginBottom: 20 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    ...SHADOWS.small
  },
  statIconBg: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 10, color: COLORS.textTertiary, marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  partItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  partName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  partCategory: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  partUnits: { fontSize: 12, color: COLORS.textTertiary, marginTop: 4 },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700' },
});

export default InventoryScreen;
