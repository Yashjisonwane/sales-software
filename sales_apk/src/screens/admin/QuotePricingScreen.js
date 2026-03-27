import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QuotePricingScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pricing</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stepper */}
        <View style={styles.stepper}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.activeStep]}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
            <Text style={styles.stepLabelActive}>Job Scope</Text>
          </View>
          <View style={[styles.stepLine, styles.activeLine]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.activeStep]}>
              <View style={styles.stepInner} />
            </View>
            <Text style={styles.stepLabelActive}>Pricing</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle} />
            <Text style={styles.stepLabel}>Review & Send</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Measurement input</Text>
          <Text style={styles.sectionSub}>The AI assistant is applying rules to generate the final price.</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Material Cost (Auto-lookup)</Text>
            <Text style={styles.priceValue}>$550.00</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Labor Cost (8.5 hrs @ $75/hr)</Text>
            <Text style={styles.priceValue}>$637.50</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Travel/ Distance Surcharge</Text>
            <Text style={styles.priceValue}>$45.00</Text>
          </View>
          <View style={[styles.priceRow, styles.subtotalRow]}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>$1,232.50</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profit Margin Rules</Text>
          <Text style={styles.sectionSub}>This margin represents the organization's net profit on this job.</Text>
          
          <View style={styles.marginRow}>
            <Text style={styles.marginLabel}>Desired margin (%)</Text>
            <Text style={styles.marginValue}>35%</Text>
          </View>
          <View style={[styles.priceRow, styles.finalRow]}>
            <Text style={styles.finalLabel}>Final Quote Price</Text>
            <Text style={styles.finalValue}>$1,896.15</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={styles.reviewBtn}
          onPress={() => navigation.navigate('QuoteReview', { ...route.params })}
        >
          <Text style={styles.reviewBtnText}>Review Contract</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  content: { padding: 16 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, paddingHorizontal: 10 },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#CBD5E0', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  activeStep: { borderColor: '#0E56D0', backgroundColor: '#0E56D0' },
  stepInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E2E8F0', marginHorizontal: 8, marginTop: -15 },
  activeLine: { backgroundColor: '#0E56D0' },
  stepLabel: { fontSize: 11, color: '#A0AEC0', marginTop: 8, fontWeight: '600' },
  stepLabelActive: { fontSize: 11, color: '#1A202C', marginTop: 8, fontWeight: '700' },

  section: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
  sectionSub: { fontSize: 13, color: '#718096', marginTop: 4, marginBottom: 20 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  priceLabel: { fontSize: 14, color: '#718096' },
  priceValue: { fontSize: 14, fontWeight: '700', color: '#1A202C' },
  
  subtotalRow: { borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: 10, paddingTop: 20 },
  subtotalLabel: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  subtotalValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },

  marginRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  marginLabel: { fontSize: 14, color: '#718096' },
  marginValue: { fontSize: 14, fontWeight: '700', color: '#1A202C' },

  finalRow: { marginTop: 10, paddingTop: 10 },
  finalLabel: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  finalValue: { fontSize: 18, fontWeight: '700', color: '#1A202C' },

  bottomContainer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  reviewBtn: { height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  reviewBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default QuotePricingScreen;
