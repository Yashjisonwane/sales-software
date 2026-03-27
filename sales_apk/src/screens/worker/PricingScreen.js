import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const PricingScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('Pro');

  const features = [
    {
      icon: 'briefcase-outline',
      title: 'Priority job access',
      subtitle: 'Be among the first workers to receive new jobs requests.',
    },
    {
      icon: 'flash-outline',
      title: 'Faster Payouts',
      subtitle: 'Get your earnings processed sooner without delays.',
    },
    {
      icon: 'eye-outline',
      title: 'Higher customer visibility',
      subtitle: 'Your profile appears higher in customer searches.',
    },
    {
      icon: 'trending-up-outline',
      title: 'More job opportunities',
      subtitle: 'Unlock access to a wider range of services requests.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pricing</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoSlot}>
          <Image 
            source={require('../../assets/images/image copy.png')} 
            style={styles.logoImg} 
            resizeMode="contain"
          />
        </View>

        <View style={styles.featuresCard}>
          <Text style={styles.cardHeading}>What You Get!</Text>
          <View style={styles.whiteBox}>
            {features.map((f, i) => (
              <View key={i} style={[styles.featureItem, i === features.length - 1 && { marginBottom: 0 }]}>
                <View style={styles.featureIconBox}>
                  <Ionicons name={f.icon} size={20} color="#0062E1" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureSub}>{f.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.plansRow}>
          <TouchableOpacity 
            style={[styles.planCard, selectedPlan === 'Pro' && styles.selectedPlanPro]} 
            onPress={() => setSelectedPlan('Pro')}
          >
            <View style={[styles.planBadge, { backgroundColor: '#0062E1' }]}>
              <Text style={styles.planBadgeText}>Best Value</Text>
            </View>
            <Text style={styles.planName}>Pro Worker</Text>
            <Text style={styles.planDesc}>Best for regular workers</Text>
            <Text style={styles.planPrice}>$999<Text style={styles.planFreq}> / month</Text></Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.planCard, selectedPlan === 'Elite' && styles.selectedPlanElite]} 
            onPress={() => setSelectedPlan('Elite')}
          >
            <View style={[styles.planBadge, { backgroundColor: '#718096' }]}>
              <Text style={styles.planBadgeText}>Popular</Text>
            </View>
            <Text style={styles.planName}>Elite</Text>
            <Text style={styles.planDesc}>For top professionals</Text>
            <Text style={styles.planPrice}>$2499<Text style={styles.planFreq}> / month</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueBtn} 
          onPress={() => navigation.navigate('JobOfferDetail', { state: 'accepted' })}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    height: 56,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A202C' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  logoSlot: { height: 220, alignItems: 'center', justifyContent: 'center', marginVertical: 0 },
  logoImg: { width: width * 0.8, height: 180 },

  featuresCard: { 
    backgroundColor: '#F8FAFC', 
    borderRadius: 24, 
    padding: 16, 
    marginBottom: 24,
  },
  whiteBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  cardHeading: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 16, marginLeft: 4 },
  featureItem: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  featureIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F9FF', alignItems: 'center', justifyContent: 'center' },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  featureSub: { fontSize: 12, color: '#718096', marginTop: 2, lineHeight: 18, fontWeight: '500' },

  plansRow: { flexDirection: 'row', gap: 12 },
  planCard: { 
    flex: 1, 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    backgroundColor: '#F8FAFC',
    paddingTop: 32,
  },
  selectedPlanPro: { borderColor: '#0062E1', backgroundColor: '#F8FAFC' },
  selectedPlanElite: { borderColor: '#718096', backgroundColor: '#F8FAFC' },
  planBadge: { position: 'absolute', top: -10, left: 16, right: 16, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  planBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  planName: { fontSize: 16, fontWeight: '800', color: '#1A202C' },
  planDesc: { fontSize: 11, color: '#718096', marginTop: 4, fontWeight: '500' },
  planPrice: { fontSize: 18, fontWeight: '800', color: '#0062E1', marginTop: 12 },
  planFreq: { fontSize: 12, fontWeight: '500', color: '#718096' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10, backgroundColor: '#fff' },
  continueBtn: { height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default PricingScreen;
