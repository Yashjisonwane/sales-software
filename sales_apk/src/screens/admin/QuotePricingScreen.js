import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createEstimate } from '../../api/apiService';

const QuotePricingScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { job, scope } = route.params || {};
  const [loading, setLoading] = React.useState(false);

  // Constants for pricing calculation
  const materialCost = scope?.materialsCount ? scope.materialsCount * 110 : 550; // Mock calculation
  const laborCost = scope?.laborHours ? scope.laborHours * 75 : 637.5;
  const travelCost = 45;
  const subtotal = materialCost + laborCost + travelCost;
  const margin = 0.35; // 35%
  const finalPrice = subtotal / (1 - margin);

  const handleCreateQuote = async () => {
    setLoading(true);
    const details = `Service: ${scope.serviceType}. Quote generated via APK.`;
    
    const res = await createEstimate(
      job.id, 
      finalPrice, 
      details, 
      scope.inspectionResults?.materials, 
      scope.laborHours, 
      scope.inspectionResults?.measurements
    );
    
    setLoading(false);
    if (res.success) {
      Alert.alert("Success", "Quote created and sent to customer");
      navigation.navigate('JobDetails', { job: { ...job, status: 'ESTIMATED' } });
    } else {
      Alert.alert("Error", res.message || "Failed to create quote");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pricing Calculation</Text>
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
          <Text style={styles.sectionTitle}>Calculated Costs</Text>
          <Text style={styles.sectionSub}>AI suggested pricing based on inspection data.</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Material Cost</Text>
            <Text style={styles.priceValue}>${materialCost.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Labor Cost ({scope?.laborHours || 0} hrs)</Text>
            <Text style={styles.priceValue}>${laborCost.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Travel Surcharge</Text>
            <Text style={styles.priceValue}>${travelCost.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, styles.subtotalRow]}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>${subtotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Final Adjustments</Text>
          <Text style={styles.sectionSub}>Standard 35% organizational margin applied.</Text>
          
          <View style={styles.marginRow}>
            <Text style={styles.marginLabel}>Desired margin (%)</Text>
            <Text style={styles.marginValue}>35%</Text>
          </View>
          <View style={[styles.priceRow, styles.finalRow]}>
            <Text style={styles.finalLabel}>Final Quote Price</Text>
            <Text style={styles.finalValue}>${finalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={styles.reviewBtn}
          onPress={handleCreateQuote}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.reviewBtnText}>Finalize & Send Quote</Text>}
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
