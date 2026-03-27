import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$9.99',
    period: '/month',
    features: ['10 leads/month', 'Basic profile', 'Email support', 'Standard visibility'],
    color: '#3B82F6',
    gradient: ['#3B82F6', '#2563EB'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$24.99',
    period: '/month',
    features: ['50 leads/month', 'Priority leads', 'Chat support', 'Featured profile', 'Analytics dashboard'],
    color: '#8B5CF6',
    gradient: COLORS.gradientPro,
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$49.99',
    period: '/month',
    features: ['Unlimited leads', 'Top priority', '24/7 support', 'Verified badge', 'Advanced analytics', 'Custom profile'],
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
    popular: false,
  },
];

export default function SubscriptionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Choose Your Plan</Text>
        <Text style={styles.pageSubtitle}>Unlock more leads and grow your business</Text>

        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardSelected,
              selectedPlan === plan.id && { borderColor: plan.color },
            ]}
            activeOpacity={0.8}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <LinearGradient colors={plan.gradient} style={styles.popularGradient}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </LinearGradient>
              </View>
            )}

            <View style={styles.planHeader}>
              <View style={[styles.planIconBg, { backgroundColor: `${plan.color}15` }]}>
                <Ionicons
                  name={plan.id === 'starter' ? 'rocket-outline' : plan.id === 'pro' ? 'diamond-outline' : 'trophy-outline'}
                  size={24}
                  color={plan.color}
                />
              </View>
              <View style={styles.planNameBlock}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
                </View>
              </View>
              <View style={[
                styles.radio,
                selectedPlan === plan.id && { borderColor: plan.color },
              ]}>
                {selectedPlan === plan.id && (
                  <View style={[styles.radioInner, { backgroundColor: plan.color }]} />
                )}
              </View>
            </View>

            <View style={styles.featuresContainer}>
              {plan.features.map((f, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={16} color={plan.color} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        {/* Subscribe Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.subsContainer}
          onPress={() => Alert.alert(
            "Subscription Success",
            `You have successfully subscribed to the ${PLANS.find(p => p.id === selectedPlan).name} plan!`,
            [{ text: "Great!", onPress: () => navigation.goBack() }]
          )}
        >
          <LinearGradient
            colors={PLANS.find(p => p.id === selectedPlan).gradient}
            style={styles.subsBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.subsBtnText}>
              Subscribe to {PLANS.find(p => p.id === selectedPlan).name}
            </Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.cancelText}>Cancel anytime. No hidden fees.</Text>
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
  scrollContent: { padding: SIZES.screenPadding, paddingBottom: 40 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center', marginTop: 8 },
  pageSubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24, marginTop: 6 },
  planCard: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radiusXl, padding: 20,
    marginBottom: 16, borderWidth: 2, borderColor: 'transparent', ...SHADOWS.small,
  },
  planCardSelected: { ...SHADOWS.medium },
  popularBadge: { position: 'absolute', top: -1, right: 20, overflow: 'hidden', borderRadius: 12 },
  popularGradient: { paddingHorizontal: 14, paddingVertical: 5, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  popularText: { fontSize: 10, fontWeight: '700', color: COLORS.white },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  planIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  planNameBlock: { flex: 1 },
  planName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  planPrice: { fontSize: 24, fontWeight: '800' },
  planPeriod: { fontSize: 13, color: COLORS.textTertiary, marginLeft: 2 },
  radio: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  featuresContainer: { gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, color: COLORS.textSecondary },
  subsContainer: { marginTop: 8, borderRadius: SIZES.buttonRadius, overflow: 'hidden' },
  subsBtn: {
    height: SIZES.buttonHeight, borderRadius: SIZES.buttonRadius,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  subsBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  cancelText: { fontSize: 12, color: COLORS.textTertiary, textAlign: 'center', marginTop: 14 },
});
