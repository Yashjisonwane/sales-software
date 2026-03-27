import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, SIZES } from '../../../constants/theme';

const { width } = Dimensions.get('window');

const TermsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const Section = ({ title, content }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Ionicons name="document-text" size={40} color="#0E56D0" />
          <Text style={styles.infoTitle}>Last Updated: Jan 2026</Text>
          <Text style={styles.infoSub}>Please read our terms and conditions carefully before using our platform.</Text>
        </View>

        <Section 
          title="1. Scope of Service" 
          content="HinesQ provides a platform connecting service providers with customers. You agree to provide services in a professional and timely manner, following all safety protocols."
        />

        <Section 
          title="2. Payment Terms" 
          content="Payments for completed services are processed via Stripe after the customer approves the work. A platform fee of 15% applies to all transactions."
        />

        <Section 
          title="3. User Conduct" 
          content="You must not use the platform for any illegal activities or harassment. All communications must remain professional and through the platform's chat system."
        />

        <Section 
          title="4. Termination" 
          content="We reserve the right to suspend or terminate accounts that violate our community standards or fail to meet service quality benchmarks."
        />

        <Section 
          title="5. Liability" 
          content="HinesQ is not liable for direct or indirect damages arising from services provided by independent contractors on the platform."
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  
  scrollContent: { padding: 20 },
  
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  infoTitle: { fontSize: 16, fontWeight: '800', color: '#1A202C', marginTop: 16 },
  infoSub: { fontSize: 13, color: '#718096', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A202C', marginBottom: 10 },
  sectionContent: { fontSize: 14, color: '#4A5568', lineHeight: 22 },
});

export default TermsScreen;
