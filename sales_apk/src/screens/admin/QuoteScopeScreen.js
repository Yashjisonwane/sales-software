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

const QuoteScopeScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { job } = route.params || {};
  
  const [serviceType, setServiceType] = React.useState(job?.categoryName || 'General Service');
  const [materialsCount, setMaterialsCount] = React.useState(0);
  const [laborHours, setLaborHours] = React.useState(0);

  // Reaction to inspection tool results if any (passed back via params)
  React.useEffect(() => {
    if (route.params?.inspectionResults) {
      const { materials, labor } = route.params.inspectionResults;
      if (materials) setMaterialsCount(materials.length);
      if (labor) setLaborHours(labor);
    }
  }, [route.params?.inspectionResults]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Scope</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stepper */}
        <View style={styles.stepper}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.activeStep]}>
              <View style={styles.stepInner} />
            </View>
            <Text style={styles.stepLabelActive}>Job Scope</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle} />
            <Text style={styles.stepLabel}>Pricing</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle} />
            <Text style={styles.stepLabel}>Review & Send</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service Type</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => {}}>
            <Text style={styles.dropdownText}>{serviceType}</Text>
            <Ionicons name="chevron-down" size={20} color="#1A202C" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Measurement input</Text>
          <Text style={styles.sectionSub}>Use the tool to auto-fill measurements and suggested materials.</Text>
          <TouchableOpacity 
            style={styles.outlineBtn}
            onPress={() => navigation.navigate('PreInspection', { job })}
          >
            <Text style={styles.outlineBtnText}>Start Pre-Inspection Tool</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Materials & Labor</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Total Materials Added:</Text>
            <Text style={styles.itemValue}>{materialsCount} Items</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Estimated Labor Hours:</Text>
            <Text style={styles.itemValue}>{laborHours} hrs</Text>
          </View>
          <TouchableOpacity style={styles.outlineBtn}>
            <Text style={styles.outlineBtnText}>Edit Item List</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={styles.continueBtn}
          onPress={() => navigation.navigate('QuotePricing', { 
            job, 
            scope: { serviceType, materialsCount, laborHours, inspectionResults: route.params?.inspectionResults } 
          })}
        >
          <Text style={styles.continueBtnText}>Continue to Pricing</Text>
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
  activeStep: { borderColor: '#0E56D0' },
  stepInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0E56D0' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E2E8F0', marginHorizontal: 8, marginTop: -15 },
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
  sectionSub: { fontSize: 13, color: '#718096', marginTop: 4, marginBottom: 16 },

  dropdown: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    height: 54, 
    borderRadius: 27, 
    backgroundColor: '#F8FAFC', 
    paddingHorizontal: 20, 
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  dropdownText: { fontSize: 15, color: '#1A202C' },

  outlineBtn: { 
    height: 50, 
    borderRadius: 25, 
    borderWidth: 1, 
    borderColor: '#1A202C', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 12
  },
  outlineBtnText: { fontSize: 15, fontWeight: '600', color: '#1A202C' },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  itemLabel: { fontSize: 14, color: '#718096' },
  itemValue: { fontSize: 14, fontWeight: '700', color: '#1A202C' },

  bottomContainer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  continueBtn: { height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default QuoteScopeScreen;
