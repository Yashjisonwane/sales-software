import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS, FONTS } from '../../constants/theme';
import { createInvoice } from '../../api/apiService';

const { width } = Dimensions.get('window');

const CreateInvoiceScreen = ({ navigation, route }) => {
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [depositRequired, setDepositRequired] = useState(true);
  const [partialPayments, setPartialPayments] = useState(false);

  // Form States
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [jobAddress, setJobAddress] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('#INV-1026');

  const insets = useSafeAreaInsets();

  const InputField = ({ label, placeholder, icon, value, onChangeText, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
        {icon && <Ionicons name={icon} size={20} color="#A0AEC0" />}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Invoice</Text>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Customer & Job Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer & Job Details</Text>

          <InputField label="Customer Name" placeholder="Customer Name" value={customerName} onChangeText={setCustomerName} />
          <InputField label="Phone Number" placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
          <InputField label="Email" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Job / Project</Text>
            <TouchableOpacity style={styles.inputWrapper}>
              <Text style={styles.placeholderText}>Select Job / Project</Text>
              <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
            </TouchableOpacity>
          </View>

          <InputField label="Job Address" placeholder="Select Location" icon="location-outline" value={jobAddress} onChangeText={setJobAddress} />

          <InputField label="Invoice Number" placeholder="#INV-1026" value={invoiceNumber} onChangeText={setInvoiceNumber} />

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Invoice Date</Text>
              <TouchableOpacity style={styles.inputWrapper}>
                <Text style={styles.placeholderText}>DD-MM</Text>
                <Ionicons name="calendar-outline" size={18} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Invoice Due Date</Text>
              <TouchableOpacity style={styles.inputWrapper}>
                <Text style={styles.placeholderText}>DD-MM</Text>
                <Ionicons name="calendar-outline" size={18} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section 2: Invoice Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          <Text style={[styles.label, { marginBottom: 8 }]}>Item 1</Text>
          <View style={styles.itemCard}>
            <TextInput style={styles.itemInput} placeholder="Labor – Roof Installation" placeholderTextColor="#A0AEC0" />

            <Text style={[styles.label, { marginTop: 12, marginBottom: 8 }]}>Description (optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter description..."
              placeholderTextColor="#A0AEC0"
              multiline
              numberOfLines={4}
            />

            <View style={[styles.row, { marginTop: 16 }]}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Quantity</Text>
                <View style={styles.smallInput}><TextInput placeholder="00" placeholderTextColor="#A0AEC0" keyboardType="numeric" /></View>
              </View>
              <View style={{ flex: 1, marginHorizontal: 4 }}>
                <Text style={styles.label}>Rate ($)</Text>
                <View style={styles.smallInput}><TextInput placeholder="$0.00" placeholderTextColor="#A0AEC0" keyboardType="numeric" /></View>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Amount</Text>
                <View style={[styles.smallInput, { backgroundColor: '#F8FAFC' }]}><Text style={styles.amountValue}>$0.00</Text></View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.addLineItemBtn}>
            <Ionicons name="add" size={20} color={COLORS.textPrimary} />
            <Text style={styles.addLineItemText}>Add Line Item</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: Materials & Parts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Materials & Parts</Text>
          <View style={styles.materialRow}>
            <View>
              <Text style={styles.materialName}>Asphalt Shingles</Text>
              <Text style={styles.materialQty}>Qty: 20 × $35</Text>
            </View>
            <Text style={styles.materialPrice}>$700.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.materialRow}>
            <View>
              <Text style={styles.materialName}>Roofing Nails</Text>
              <Text style={styles.materialQty}>Qty: 5 × $12</Text>
            </View>
            <Text style={styles.materialPrice}>$60.00</Text>
          </View>
        </View>

        {/* Section 4: Taxes, Discount & Fees */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Taxes, Discount & Fees</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Discount</Text>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Discount" placeholderTextColor="#A0AEC0" keyboardType="numeric" />
              <Text style={styles.unitText}>%</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tax</Text>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} placeholder="Tax" placeholderTextColor="#A0AEC0" keyboardType="numeric" />
              <Text style={styles.unitText}>%</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Travel Fee</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} placeholder="$0.00" placeholderTextColor="#A0AEC0" keyboardType="numeric" />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.label}>Service Fee</Text>
              <View style={styles.inputWrapper}>
                <TextInput style={styles.input} placeholder="$0.00" placeholderTextColor="#A0AEC0" keyboardType="numeric" />
              </View>
            </View>
          </View>
        </View>

        {/* Section 5: Payment Details */}
        <View style={[styles.section, { paddingBottom: 40 }]}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, paymentMethod === 'Card' && styles.activeTab]}
              onPress={() => setPaymentMethod('Card')}
            >
              <Text style={[styles.tabText, paymentMethod === 'Card' && styles.activeTabText]}>Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, paymentMethod === 'Bank Transfer' && styles.activeTab]}
              onPress={() => setPaymentMethod('Bank Transfer')}
            >
              <Text style={[styles.tabText, paymentMethod === 'Bank Transfer' && styles.activeTabText]}>Bank Transfer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Deposit Required</Text>
            <Switch
              value={depositRequired}
              onValueChange={setDepositRequired}
              trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Partial Payments Allowed</Text>
            <Switch
              value={partialPayments}
              onValueChange={setPartialPayments}
              trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.sendBtn} onPress={async () => {
          const jobId = route.params?.jobId || 'mock-id'; 
          const res = await createInvoice(jobId, 1500);
          if (res?.success || jobId === 'mock-id') {
            alert('Invoice Sent Successfully!');
            navigation.navigate('WorkerTabs'); 
          } else {
             alert('Error generating invoice: ' + (res?.message || 'Unknown error'));
          }
        }}>
          <Ionicons name="send-outline" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
          <Text style={styles.sendBtnText}>Send Invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  menuBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },

  scrollContent: { padding: 16 },

  section: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 20 },

  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  placeholderText: { flex: 1, fontSize: 15, color: '#A0AEC0' },
  unitText: { fontSize: 15, color: COLORS.textTertiary, marginLeft: 8 },

  row: { flexDirection: 'row', alignItems: 'center' },

  itemCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
  },
  itemInput: {
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 12,
  },
  textArea: {
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  smallInput: {
    height: 44,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  amountValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600' },

  addLineItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 25,
    marginTop: 16,
  },
  addLineItemText: { marginLeft: 8, fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },

  materialRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  materialName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  materialQty: { fontSize: 13, color: COLORS.textTertiary, marginTop: 2 },
  materialPrice: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: '#F1F5F9' },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  activeTab: { backgroundColor: '#0062E1', ...SHADOWS.small },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textTertiary },
  activeTabText: { color: COLORS.white },

  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  switchLabel: { fontSize: 15, color: COLORS.textSecondary },

  footer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sendBtn: {
    backgroundColor: '#0062E1',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  sendBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});

export default CreateInvoiceScreen;
