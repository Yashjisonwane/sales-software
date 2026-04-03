import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

export default function ReviewsScreen({ navigation }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const existingReviews = [
    {
      id: '1', name: 'John Wilson', service: 'Plumbing',
      rating: 5, comment: 'Excellent work! Fixed the leak in 30 minutes. Very professional.',
      date: 'Mar 5, 2026', avatar: 'JW', color: '#3B82F6',
    },
    {
      id: '2', name: 'Sarah Martinez', service: 'Electrical',
      rating: 4, comment: 'Good service. Replaced all faulty switches efficiently.',
      date: 'Mar 1, 2026', avatar: 'SM', color: '#F59E0B',
    },
    {
      id: '3', name: 'Mike Chen', service: 'Cleaning',
      rating: 5, comment: 'My house has never been this clean! Will definitely book again.',
      date: 'Feb 25, 2026', avatar: 'MC', color: '#10B981',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Write Review Card */}
        <View style={styles.writeCard}>
          <Text style={styles.writeTitle}>Rate Your Experience</Text>
          <Text style={styles.writeSubtitle}>How was your recent service?</Text>

          {/* Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color={star <= rating ? '#F59E0B' : COLORS.border}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingLabel}>
            {rating === 0 ? 'Tap to rate' : rating === 5 ? 'Excellent! ⭐' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
          </Text>

          {/* Comment */}
          <View style={styles.commentWrapper}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write your review here..."
              placeholderTextColor={COLORS.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={COLORS.gradientPrimary}
              style={styles.submitBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="send" size={16} color={COLORS.white} />
              <Text style={styles.submitText}>Submit Review</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Past Reviews */}
        <Text style={styles.sectionTitle}>Your Past Reviews</Text>
        {existingReviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewTopRow}>
              <View style={[styles.reviewAvatar, { backgroundColor: review.color }]}>
                <Text style={styles.reviewAvatarText}>{review.avatar}</Text>
              </View>
              <View style={styles.reviewInfo}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <Text style={styles.reviewService}>{review.service}</Text>
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <View style={styles.reviewStars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons
                  key={s}
                  name={s <= review.rating ? 'star' : 'star-outline'}
                  size={14}
                  color="#F59E0B"
                />
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
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
    textAlign: 'center',
  },
  scrollContent: {
    padding: SIZES.screenPadding,
    paddingBottom: 100,
  },
  writeCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusXl,
    padding: 24,
    marginBottom: 28,
    ...SHADOWS.medium,
  },
  writeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  writeSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  commentWrapper: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 18,
  },
  commentInput: {
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 14,
    minHeight: 100,
  },
  submitBtn: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  reviewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  reviewAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewService: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reviewDate: {
    fontSize: 11,
    color: COLORS.textTertiary,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
