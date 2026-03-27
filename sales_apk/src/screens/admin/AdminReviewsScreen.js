import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const REVIEWS = [
  { id: '1', name: 'Alex Johnson', rating: 5, comment: 'Excellent plumber! Fixed the leak quickly and professionally.', date: 'Mar 7, 2026', avatar: 'AJ', color: '#3B82F6' },
  { id: '2', name: 'Maria Garcia', rating: 5, comment: 'Very punctual and knowledgeable. Will hire again!', date: 'Mar 5, 2026', avatar: 'MG', color: '#EC4899' },
  { id: '3', name: 'James Lee', rating: 4, comment: 'Good work overall. A bit expensive but quality service.', date: 'Mar 3, 2026', avatar: 'JL', color: '#10B981' },
  { id: '4', name: 'Emily Davis', rating: 5, comment: 'Amazing! The new faucet looks great. Very clean work.', date: 'Feb 28, 2026', avatar: 'ED', color: '#F59E0B' },
  { id: '5', name: 'Robert Wilson', rating: 4, comment: 'Solid work. Fixed my water heater in under an hour.', date: 'Feb 25, 2026', avatar: 'RW', color: '#6366F1' },
];

export default function ProReviewsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const avgRating = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reviews</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Rating Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.avgRating}>{avgRating}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name={s <= Math.round(avgRating) ? 'star' : 'star-outline'} size={16} color="#F59E0B" />
              ))}
            </View>
            <Text style={styles.totalReviews}>{REVIEWS.length} reviews</Text>
          </View>
          <View style={styles.summaryRight}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = REVIEWS.filter(r => r.rating === star).length;
              const percent = (count / REVIEWS.length) * 100;
              return (
                <View key={star} style={styles.barRow}>
                  <Text style={styles.barLabel}>{star}</Text>
                  <Ionicons name="star" size={10} color="#F59E0B" />
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${percent}%` }]} />
                  </View>
                  <Text style={styles.barCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Reviews List */}
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        {REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <View style={[styles.reviewAvatar, { backgroundColor: review.color }]}>
                <Text style={styles.reviewAvatarText}>{review.avatar}</Text>
              </View>
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.ratingBadgeText}>{review.rating}.0</Text>
              </View>
            </View>
            <View style={styles.reviewStars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name={s <= review.rating ? 'star' : 'star-outline'} size={14} color="#F59E0B" />
              ))}
            </View>
            <Text style={styles.reviewComment}>{review.comment}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingBottom: 14, paddingHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  scrollContent: { padding: SIZES.screenPadding, paddingBottom: 100 },
  summaryCard: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: SIZES.radiusXl,
    padding: 20, marginBottom: 24, ...SHADOWS.medium,
  },
  summaryLeft: { alignItems: 'center', justifyContent: 'center', marginRight: 24, paddingRight: 24, borderRightWidth: 1, borderRightColor: COLORS.borderLight },
  avgRating: { fontSize: 42, fontWeight: '800', color: COLORS.textPrimary },
  starsRow: { flexDirection: 'row', gap: 2, marginVertical: 6 },
  totalReviews: { fontSize: 12, color: COLORS.textTertiary },
  summaryRight: { flex: 1, justifyContent: 'center', gap: 6 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  barLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, width: 12 },
  barBg: { flex: 1, height: 6, borderRadius: 3, backgroundColor: COLORS.surfaceAlt },
  barFill: { height: 6, borderRadius: 3, backgroundColor: '#F59E0B' },
  barCount: { fontSize: 11, color: COLORS.textTertiary, width: 16, textAlign: 'right' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  reviewCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radiusMd, padding: 16, marginBottom: 12, ...SHADOWS.small },
  reviewTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  reviewAvatarText: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  reviewInfo: { flex: 1 },
  reviewName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  reviewDate: { fontSize: 11, color: COLORS.textTertiary, marginTop: 2 },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  ratingBadgeText: { fontSize: 12, fontWeight: '700', color: '#D97706' },
  reviewStars: { flexDirection: 'row', gap: 2, marginBottom: 8 },
  reviewComment: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
});
