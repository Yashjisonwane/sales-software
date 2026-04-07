import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QuoteScopeScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { job, role = 'admin' } = route.params || {};
  
  const [serviceType, setServiceType] = React.useState(job?.categoryName || job?.category?.name || 'General Service');
  const [materialsCount, setMaterialsCount] = React.useState(0);
  const [laborHours, setLaborHours] = React.useState(0);
  const [laborRate, setLaborRate] = React.useState(45); // Default $45/hr
  const [showItemModal, setShowItemModal] = React.useState(false);
  const [itemsList, setItemsList] = React.useState([
    { id: '1', name: 'Standard Material Pack', qty: 0, price: 50 },
    { id: '2', name: 'Premium Adhesive', qty: 0, price: 25 },
    { id: '3', name: 'Protective Sheets', qty: 0, price: 15 },
  ]);

  // Reaction to inspection tool results if any (passed back via params)
  React.useEffect(() => {
    if (route.params?.inspectionResults) {
      const { materials, labor } = route.params.inspectionResults;
      if (materials) {
        setMaterialsCount(materials.length);
      }
      if (labor != null) setLaborHours(Number(labor) || 0);
    }
  }, [route.params?.inspectionResults]);

  // Re-open from Quote details → Edit quote (restore line items & labor)
  React.useEffect(() => {
    const init = route.params?.initialScope;
    if (!init) return;
    if (Array.isArray(init.itemsList) && init.itemsList.length > 0) {
      setItemsList(init.itemsList);
      setMaterialsCount(init.itemsList.filter((i) => (Number(i.qty) || 0) > 0).length);
    }
    if (init.laborHours != null && init.laborHours !== '') setLaborHours(Number(init.laborHours) || 0);
    if (init.laborRate != null && init.laborRate !== '') setLaborRate(Number(init.laborRate) || 45);
    if (init.serviceType) setServiceType(init.serviceType);
  }, [route.params?.initialScope]);

  const updateItemQty = (id, delta) => {
    setItemsList(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const updateItemPrice = (id, price) => {
    setItemsList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, price: Number(price) || 0 };
      }
      return item;
    }));
  };

  const syncStats = () => {
    const count = itemsList.filter(i => i.qty > 0).length;
    setMaterialsCount(count);
    setShowItemModal(false);
  };

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
          <TouchableOpacity 
            style={[styles.dropdown, (job?.categoryName || job?.category?.name) && { backgroundColor: '#F1F5F9', borderColor: '#CBD5E0' }]} 
            onPress={() => {
              if (job?.categoryName || job?.category?.name) {
                Alert.alert("Service Fixed", "The service type is fixed based on the job category.");
                return;
              }
              // Logic to select other services could go here
            }}
          >
            <Text style={styles.dropdownText}>{serviceType}</Text>
            {!(job?.categoryName || job?.category?.name) && <Ionicons name="chevron-down" size={20} color="#1A202C" />}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Measurement input</Text>
          <Text style={styles.sectionSub}>Use the tool to auto-fill measurements and suggested materials.</Text>
          <TouchableOpacity 
            style={styles.outlineBtn}
            onPress={() => {
              if (!job?.jobNo) {
                Alert.alert(
                  'Job required',
                  'Assign a worker to this lead first so a job exists. Then you can run pre-inspection.',
                );
                return;
              }
              navigation.navigate('PreInspection', { job, role });
            }}
          >
            <Text style={styles.outlineBtnText}>Start Pre-Inspection Tool</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{role === 'worker' ? 'Task & Material Estimation' : 'Add Materials & Labor'}</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>{role === 'worker' ? 'Technical Materials:' : 'Total Materials Added:'}</Text>
            <Text style={styles.itemValue}>{materialsCount} Items</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>{role === 'worker' ? 'Estimated Field Hours:' : 'Estimated Labor Hours:'}</Text>
            <Text style={styles.itemValue}>{laborHours} hrs</Text>
          </View>
          <TouchableOpacity 
            style={styles.outlineBtn}
            onPress={() => setShowItemModal(true)}
          >
            <Text style={styles.outlineBtnText}>{role === 'worker' ? 'Adjust Item List' : 'Edit Item List'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Item Management Modal */}
      <Modal
        visible={showItemModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowItemModal(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{role === 'worker' ? 'Field Material List' : 'Inventory & Labor'}</Text>
              <TouchableOpacity onPress={() => setShowItemModal(false)}>
                <Ionicons name="close" size={24} color="#1A202C" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              <Text style={styles.modalSubTitle}>Suggested Materials</Text>
              {itemsList.map(item => (
                <View key={item.id} style={styles.modalItemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalItemName}>{item.name}</Text>
                    <View style={styles.costInputRow}>
                      <Text style={styles.dollarSign}>$</Text>
                      <TextInput 
                        style={styles.costInputSmall}
                        keyboardType="numeric"
                        value={String(item.price)}
                        onChangeText={(val) => updateItemPrice(item.id, val)}
                        placeholder="0"
                      />
                    </View>
                  </View>
                  <View style={styles.qtyContainer}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateItemQty(item.id, -1)}>
                      <Ionicons name="remove" size={16} color="#0E56D0" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateItemQty(item.id, 1)}>
                      <Ionicons name="add" size={16} color="#0E56D0" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <Text style={[styles.modalSubTitle, { marginTop: 20 }]}>Labor & Rates</Text>
              <View style={styles.modalItemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalItemName}>Labor Activity</Text>
                  <View style={styles.costInputRow}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput 
                      style={styles.costInputSmall}
                      keyboardType="numeric"
                      value={String(laborRate)}
                      onChangeText={(val) => setLaborRate(Number(val) || 0)}
                    />
                    <Text style={{ fontSize: 12, color: '#718096', marginLeft: 4 }}>per hr</Text>
                  </View>
                </View>
                <View style={styles.qtyContainer}>
                  <TextInput 
                    style={styles.hourInput}
                    keyboardType="numeric"
                    value={String(laborHours)}
                    onChangeText={(val) => setLaborHours(Number(val) || 0)}
                    placeholder="0"
                  />
                  <Text style={{ fontSize: 13, color: '#718096', fontWeight: '600' }}>hrs</Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={syncStats}>
              <Text style={styles.saveBtnText}>Save Configuration</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Bar - Restored navigation */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={styles.continueBtn}
          onPress={() => {
            if (!job?.id) {
              Alert.alert('Job required', 'Please select a valid job to create a quote.');
              return;
            }
            navigation.navigate('QuotePricing', {
              job,
              role,
              scope: {
                serviceType,
                materialsCount,
                laborHours,
                laborRate,
                itemsList,
                inspectionResults: route.params?.inspectionResults,
              },
            });
          }}
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

  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  bottomContainer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  continueBtn: { height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },

  // Modal Styles
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, minHeight: 500 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1A202C' },
  modalSubTitle: { fontSize: 14, fontWeight: '700', color: '#718096', textTransform: 'uppercase', marginBottom: 12 },
  modalItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalItemName: { fontSize: 16, color: '#1A202C', fontWeight: '600' },
  costInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dollarSign: { fontSize: 13, color: '#718096', marginRight: 2 },
  costInputSmall: { fontSize: 14, fontWeight: '700', color: '#0E56D0', padding: 0, minWidth: 40 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0F9FF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E0F2FE' },
  qtyText: { fontSize: 16, fontWeight: '700', color: '#1A202C', minWidth: 20, textAlign: 'center' },
  hourInput: { width: 60, height: 40, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#0E56D0' },
  saveBtn: { height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default QuoteScopeScreen;
