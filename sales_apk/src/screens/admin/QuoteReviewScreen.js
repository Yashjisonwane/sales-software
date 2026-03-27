import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QuoteReviewScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review & Send</Text>
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
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
            <Text style={styles.stepLabelActive}>Pricing</Text>
          </View>
          <View style={[styles.stepLine, styles.activeLine]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.activeStep]}>
              <View style={styles.stepInner} />
            </View>
            <Text style={styles.stepLabelActive}>Review & Send</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>E-Contract Setup</Text>
          <Text style={styles.sectionSub}>Review terms and set up the payment split.</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Final Price</Text>
            <Text style={styles.priceValue}>$1,896.15</Text>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Payment Schedule</Text>
          
          <View style={styles.scheduleRow}>
            <Text style={styles.scheduleLabel}>Deposit Due (15%)</Text>
            <Text style={styles.scheduleValue}>$284.42</Text>
          </View>
          <View style={styles.scheduleRow}>
            <Text style={styles.scheduleLabel}>Milestone 1 (50%)</Text>
            <Text style={styles.scheduleValue}>$948.08</Text>
          </View>
          <View style={styles.scheduleRow}>
            <Text style={styles.scheduleLabel}>Final Payment (35%)</Text>
            <Text style={styles.scheduleValue}>$663.65</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contract Preview</Text>
          <Text style={styles.contractText}>
            (Mock Legal Text) All work is subject to standard terms and conditions. The customer agrees to the payment schedule outlined above. Signature...
          </Text>
          <TouchableOpacity>
            <Text style={styles.pdfLink}>View Full PDF</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signature Confirmation</Text>
          <Text style={styles.sectionSub}>Type or draw your signature to confirm and authorize</Text>
          <View style={styles.signatureBox}>
            <Text style={styles.placeholder}>Signature Area</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={styles.sendBtn}
          onPress={() => navigation.navigate('QuoteSuccess', { ...route.params })}
        >
          <Text style={styles.sendBtnText}>Send Quote</Text>
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

  priceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16, 
    backgroundColor: '#F8FAFC', 
    borderRadius: 12,
    marginTop: 10
  },
  priceLabel: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  priceValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },

  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  scheduleLabel: { fontSize: 14, color: '#718096' },
  scheduleValue: { fontSize: 14, fontWeight: '700', color: '#1A202C' },

  contractText: { fontSize: 13, color: '#718096', lineHeight: 20, marginVertical: 10 },
  pdfLink: { color: '#0E56D0', fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' },

  signatureBox: { height: 100, backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginTop: 10, borderStyle: 'dashed' },
  placeholder: { color: '#A0AEC0', fontSize: 14 },

  bottomContainer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  sendBtn: { height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default QuoteReviewScreen;
