import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function RoleSelectScreen({ navigation }) {
  const [selected, setSelected] = useState('lead');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Welcome to</Text>
            <Image 
              source={require('../../../assets/hinesq.png')} 
              style={styles.headerLogo} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.subtitle}>Choose how you want to receive and manage work.</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Our platform connects homeowners with skilled professionals. You can receive work in two different ways. Select the option that fits your business.
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {/* Lead Access */}
          <TouchableOpacity
            style={[styles.optionCard, selected === 'lead' && styles.selectedCard]}
            onPress={() => setSelected('lead')}
          >
            <View style={styles.optionHeader}>
              <View style={[styles.radio, selected === 'lead' && styles.radioSelected]}>
                {selected === 'lead' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.optionHeaderText}>
                <Text style={styles.optionTitle}>Lead Access</Text>
              </View>
              <View style={styles.badgeLabel}>
                <Text style={styles.badgeText}>Pay per lead</Text>
              </View>
            </View>

            <Text style={styles.optionDesc}>Pay for homeowner leads and manage the job independently.</Text>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>Homeowner submits a request</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>Pay to unlock contact details</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>You manage pricing & payment</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>No job guarantee</Text>
              </View>
            </View>

            <View style={styles.bestFor}>
              <Text style={styles.bestForLabel}>Best for:</Text>
              <Text style={styles.bestForText}>Independent contractors who want full control.</Text>
            </View>
          </TouchableOpacity>

          {/* Subcontract */}
          <TouchableOpacity
            style={[styles.optionCard, selected === 'subcontract' && styles.selectedCard]}
            onPress={() => setSelected('subcontract')}
          >
            <View style={styles.optionHeader}>
              <View style={[styles.radio, selected === 'subcontract' && styles.radioSelected]}>
                {selected === 'subcontract' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.optionHeaderText}>
                <Text style={styles.optionTitle}>Subcontract Work</Text>
              </View>
              <View style={styles.badgeLabelGreen}>
                <Text style={styles.badgeTextGreen}>Guaranteed jobs</Text>
              </View>
            </View>

            <Text style={styles.optionDesc}>Get assigned confirmed jobs and get paid through the platform.</Text>

            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>Homeowner pays upfront</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>Jobs assigned to you</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>Platform handles billing</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.dot} />
                <Text style={styles.bulletText}>Guaranteed payout</Text>
              </View>
            </View>

            <View style={styles.bestFor}>
              <Text style={styles.bestForLabel}>Best for:</Text>
              <Text style={styles.bestForText}>Workers who want predictable, guaranteed work.</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('WorkerSignup')}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },
  header: { marginTop: 20, marginBottom: 20 },
  title: { fontSize: 24, fontFamily: FONTS.bold, color: '#1A202C' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  headerLogo: { width: 110, height: 28, marginLeft: 8 },
  subtitle: { fontSize: 16, fontFamily: FONTS.regular, color: '#4A5568', marginTop: 5 },
  infoBox: {
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoText: { fontSize: 13, fontFamily: FONTS.regular, color: '#4A5568', lineHeight: 20 },
  optionsContainer: { gap: 20 },
  optionCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  selectedCard: {
    borderColor: '#0E56D0',
    borderWidth: 2,
    backgroundColor: '#F0F7FF',
  },
  optionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: { borderColor: '#0E56D0' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#0E56D0' },
  optionHeaderText: { flex: 1 },
  optionTitle: { fontSize: 18, fontFamily: FONTS.bold, color: '#1A202C' },
  badgeLabel: { backgroundColor: '#F3E8FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontFamily: FONTS.bold, color: '#9333EA' },
  badgeLabelGreen: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeTextGreen: { fontSize: 10, fontFamily: FONTS.bold, color: '#10B981' },
  optionDesc: { fontSize: 14, fontFamily: FONTS.regular, color: '#718096', marginBottom: 15 },
  bulletList: { gap: 8, marginBottom: 20 },
  bulletItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0E56D0' },
  bulletText: { fontSize: 14, fontFamily: FONTS.medium, color: '#1A202C' },
  bestFor: { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 12 },
  bestForLabel: { fontSize: 12, fontFamily: FONTS.regular, color: '#A0AEC0', marginBottom: 2 },
  bestForText: { fontSize: 13, fontFamily: FONTS.medium, color: '#4A5568' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  continueBtn: {
    height: 56,
    backgroundColor: '#0E56D0',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium
  },
  continueText: { color: '#FFFFFF', fontSize: 16, fontFamily: FONTS.bold },
});
