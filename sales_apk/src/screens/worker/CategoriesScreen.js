import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Plumbing', icon: 'water', color: '#3B82F6', bg: '#EFF6FF', count: '45 pros' },
  { id: '2', name: 'Electrical', icon: 'flash', color: '#F59E0B', bg: '#FFFBEB', count: '38 pros' },
  { id: '3', name: 'Cleaning', icon: 'star', color: '#10B981', bg: '#ECFDF5', count: '62 pros' },
  { id: '4', name: 'HVAC', icon: 'snow', color: '#06B6D4', bg: '#ECFEFF', count: '21 pros' },
  { id: '5', name: 'Roofing', icon: 'home', color: '#8B5CF6', bg: '#F5F3FF', count: '15 pros' },
  { id: '6', name: 'Painting', icon: 'color-palette', color: '#EC4899', bg: '#FDF2F8', count: '33 pros' },
  { id: '7', name: 'Handyman', icon: 'hammer', color: '#F97316', bg: '#FFF7ED', count: '52 pros' },
  { id: '8', name: 'Landscaping', icon: 'leaf', color: '#22C55E', bg: '#F0FDF4', count: '27 pros' },
  { id: '9', name: 'Appliance', icon: 'tv', color: '#6366F1', bg: '#EEF2FF', count: '19 pros' },
  { id: '10', name: 'Pest Control', icon: 'bug', color: '#DC2626', bg: '#FEF2F2', count: '14 pros' },
  { id: '11', name: 'Locksmith', icon: 'key', color: '#78716C', bg: '#F5F5F4', count: '11 pros' },
  { id: '12', name: 'Moving', icon: 'car', color: '#0EA5E9', bg: '#F0F9FF', count: '23 pros' },
];

export default function CategoriesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const cardWidth = (width - SIZES.screenPadding * 2 - 12) / 2;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Service Categories</Text>
        <Text style={styles.headerSubtitle}>Choose the service you need</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.grid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.card, { width: cardWidth }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Providers')}
            >
              <View style={[styles.iconBg, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon} size={28} color={cat.color} />
              </View>
              <Text style={styles.cardName}>{cat.name}</Text>
              <Text style={styles.cardCount}>{cat.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingBottom: 16,
    paddingHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    padding: SIZES.screenPadding,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLg,
    padding: 18,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  iconBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardCount: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
});
