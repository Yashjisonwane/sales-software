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
  const [loading, setLoading] = useState(false);
  const job = route.params?.job || {};

  // Form States
  const [amount, setAmount] = useState('1500');
  const [milestone, setMilestone] = useState('SINGLE');

  const insets = useSafeAreaInsets();

  const handleSendInvoice = async () => {
    setLoading(true);
    const res = await createInvoice(job.id, amount, { milestone, totalAmount: amount });
    setLoading(false);
    if (res.success) {
      alert('Invoice Sent Successfully!');
      navigation.popToTop();
    } else {
      alert('Error: ' + (res.message || 'Unknown error'));
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Invoice</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Details</Text>
          <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Customer</Text><Text style={styles.summaryValue}>{job.customerName || 'N/A'}</Text></View>
          <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Location</Text><Text style={styles.summaryValue}>{job.location || 'N/A'}</Text></View>
          <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Category</Text><Text style={styles.summaryValue}>{job.categoryName || 'N/A'}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing Amount</Text>
          <View style={styles.inputWrapper}>
             <Text style={{ fontSize: 18, marginRight: 8, color: '#718096' }}>$</Text>
             <TextInput 
                 style={{ flex: 1, fontSize: 20, fontWeight: '700' }} 
                 value={amount} 
                 onChangeText={setAmount} 
                 keyboardType="numeric"
             />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestone Type</Text>
          <View style={styles.tabContainer}>
            {['SINGLE', 'DEPOSIT_15', 'PROGRESS_50', 'FINAL_35'].map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.tab, milestone === m && styles.activeTab]}
                onPress={() => setMilestone(m)}
              >
                <Text style={[styles.tabText, milestone === m && styles.activeTabText, { fontSize: 10 }]}>{m.replace('_', ' ')}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.sendBtn, loading && { opacity: 0.7 }]} 
          disabled={loading}
          onPress={handleSendInvoice}
        >
          <Ionicons name="send-outline" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
          <Text style={styles.sendBtnText}>{loading ? 'Generating...' : 'Sync & Send Invoice'}</Text>
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
