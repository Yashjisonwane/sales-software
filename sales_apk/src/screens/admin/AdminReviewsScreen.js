import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getWorkerReviews } from '../../api/apiService';

function initials(name) {
  if (!name || typeof name !== 'string') return '?';
  const p = name.trim().split(/\s+/);
  if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function AdminReviewsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [list, setList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const res = await getWorkerReviews();
    if (res.success) {
      setList(res.data || []);
      setAverageRating(typeof res.averageRating === 'number' ? res.averageRating : parseFloat(res.averageRating) || 0);
      setDistribution(Array.isArray(res.distribution) ? res.distribution : []);
    } else setList([]);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const colors = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All reviews</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        >
          <Text style={styles.hint}>Same data as the web: every customer review across your team.</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryLeft}>
              <Text style={styles.avgRating}>{averageRating.toFixed(1)}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name={s <= Math.round(averageRating) ? 'star' : 'star-outline'}
                    size={16}
                    color="#F59E0B"
                  />
                ))}
              </View>
              <Text style={styles.totalReviews}>{list.length} reviews</Text>
            </View>
            <View style={styles.summaryRight}>
              {[5, 4, 3, 2, 1].map((star) => {
                const row = distribution.find((d) => d.stars === star);
                const pct = row?.percentage ?? 0;
                const count = list.filter((r) => r.rating === star).length;
                return (
                  <View key={star} style={styles.barRow}>
                    <Text style={styles.barLabel}>{star}</Text>
                    <Ionicons name="star" size={10} color="#F59E0B" />
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.barCount}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <Text style={styles.sectionTitle}>Reviews</Text>
          {list.length === 0 ? (
            <Text style={styles.empty}>No reviews in the database yet.</Text>
          ) : (
            list.map((review, idx) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={[styles.reviewAvatar, { backgroundColor: colors[idx % colors.length] }]}>
                    <Text style={styles.reviewAvatarText}>{initials(review.author)}</Text>
                  </View>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{review.author}</Text>
                    <Text style={styles.reviewSub}>
                      {review.workerName || 'Worker'} · Job {review.jobNo}
                    </Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingBadgeText}>{review.rating}.0</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment || '—'}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16, lineHeight: 18 },
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
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  scrollContent: { padding: SIZES.screenPadding, paddingBottom: 100 },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusXl,
    padding: 20,
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  summaryLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
    paddingRight: 24,
    borderRightWidth: 1,
    borderRightColor: COLORS.borderLight,
  },
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
  empty: { fontSize: 14, color: COLORS.textSecondary },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewAvatarText: { fontSize: 14, fontWeight: '800', color: COLORS.white },
  reviewInfo: { flex: 1 },
  reviewName: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  reviewSub: { fontSize: 12, color: COLORS.textTertiary, marginTop: 2 },
  reviewDate: { fontSize: 11, color: COLORS.textTertiary, marginTop: 4 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingBadgeText: { fontSize: 12, fontWeight: '700', color: '#B45309' },
  reviewComment: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
});
