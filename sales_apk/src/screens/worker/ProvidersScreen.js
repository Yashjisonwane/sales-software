import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS = ['All', 'Top Rated', 'Nearest', 'Available'];

const PROVIDERS = [
  {
    id: '1', name: 'John Wilson', service: 'Plumbing Expert', rating: 4.7,
    reviews: 128, distance: '2.1 km', price: '$40/hr', available: true,
    avatar: 'JW', avatarColor: '#3B82F6', experience: '8 years', jobs: 340,
  },
  {
    id: '2', name: 'Sarah Martinez', service: 'Electrician', rating: 4.9,
    reviews: 95, distance: '1.5 km', price: '$55/hr', available: true,
    avatar: 'SM', avatarColor: '#F59E0B', experience: '12 years', jobs: 512,
  },
  {
    id: '3', name: 'Mike Chen', service: 'House Cleaning', rating: 4.6,
    reviews: 210, distance: '3.2 km', price: '$35/hr', available: false,
    avatar: 'MC', avatarColor: '#10B981', experience: '5 years', jobs: 289,
  },
  {
    id: '4', name: 'Lisa Brown', service: 'HVAC Specialist', rating: 4.8,
    reviews: 67, distance: '4.0 km', price: '$60/hr', available: true,
    avatar: 'LB', avatarColor: '#06B6D4', experience: '10 years', jobs: 198,
  },
  {
    id: '5', name: 'David Kim', service: 'Painter', rating: 4.5,
    reviews: 156, distance: '1.8 km', price: '$45/hr', available: true,
    avatar: 'DK', avatarColor: '#EC4899', experience: '6 years', jobs: 267,
  },
  {
    id: '6', name: 'Emma Roberts', service: 'Handyman', rating: 4.4,
    reviews: 89, distance: '5.1 km', price: '$38/hr', available: true,
    avatar: 'ER', avatarColor: '#F97316', experience: '4 years', jobs: 145,
  },
];

export default function ProvidersScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Providers</Text>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => Alert.alert("Sort", "Sort by price, rating or distance...")}
        >
          <Ionicons name="funnel" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              selectedFilter === f && styles.filterActive,
              { flex: 1 }
            ]}
            onPress={() => setSelectedFilter(f)}
          >
            <Text
              style={[styles.filterText, selectedFilter === f && styles.filterTextActive]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results count */}
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          <Text style={styles.resultCount}>{PROVIDERS.length}</Text> professionals found
        </Text>
      </View>

      {/* Providers List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {PROVIDERS.map((pro) => (
          <TouchableOpacity
            key={pro.id}
            style={styles.proCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('RequestService')}
          >
            <View style={styles.cardTop}>
              <View style={[styles.proAvatar, { backgroundColor: pro.avatarColor }]}>
                <Text style={styles.proAvatarText}>{pro.avatar}</Text>
              </View>
              <View style={styles.proInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.proName}>{pro.name}</Text>
                  {pro.available ? (
                    <View style={styles.statusDot}>
                      <View style={styles.greenDot} />
                    </View>
                  ) : (
                    <View style={[styles.statusDot, { backgroundColor: '#FEF2F2' }]}>
                      <View style={[styles.greenDot, { backgroundColor: '#EF4444' }]} />
                    </View>
                  )}
                </View>
                <Text style={styles.proService}>{pro.service}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{pro.rating}</Text>
                  <Text style={styles.reviewCount}>({pro.reviews} reviews)</Text>
                </View>
              </View>
            </View>

            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color={COLORS.textTertiary} />
                <Text style={styles.metaText}>{pro.distance}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="briefcase-outline" size={14} color={COLORS.textTertiary} />
                <Text style={styles.metaText}>{pro.experience}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="checkmark-done" size={14} color={COLORS.textTertiary} />
                <Text style={styles.metaText}>{pro.jobs} jobs</Text>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <Text style={styles.priceText}>{pro.price}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('RequestService')}
              >
                <LinearGradient
                  colors={COLORS.gradientPrimary}
                  style={styles.requestBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.requestBtnText}>Request Service</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingBottom: 14,
    paddingHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sortBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  filterChip: {
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  resultRow: {
    paddingHorizontal: SIZES.screenPadding,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
  resultCount: {
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: 100,
  },
  proCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginBottom: 14,
    ...SHADOWS.small,
  },
  cardTop: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  proAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  proAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  proInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  proName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  proService: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  requestBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: SIZES.radiusSm,
  },
  requestBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
});
