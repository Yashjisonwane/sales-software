import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

import { submitInspection } from '../../api/apiService';

const PreInspectionScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { job, role = 'admin' } = route.params || {};
  
  // Selection states
  const [issueType, setIssueType] = useState('New Installation');
  const [urgency, setUrgency] = useState('Medium');
  const [damage, setDamage] = useState('None');
  const [loading, setLoading] = useState(false);

  const handleInspect = async () => {
    if (!job?.jobNo) {
      Alert.alert('Job required', 'Inspection is saved against a job. Assign a worker to the lead first.');
      return;
    }
    setLoading(true);
    const triageAnswers = { issueType, urgency, damage };
    const notes = `Triage: ${issueType}, Urgency: ${urgency}, Damage: ${damage}`;
    
    const res = await submitInspection(job.id, notes, triageAnswers);
    setLoading(false);

    if (res.success) {
      // Pass back results to QuoteScope
      navigation.navigate('QuoteScope', { 
        job,
        role,
        inspectionResults: {
           materials: [
             { name: 'HVAC Unit (3-Ton)', qty: 1 },
             { name: 'Duct Pipe', qty: 20 },
             { name: 'Wiring Kit', qty: 1 },
             { name: 'Mounting Brackets', qty: 2 }
           ],
           labor: 8.5,
           measurements: {
             wallWidth: '12.4 ft',
             ceilingHeight: '9.1 ft',
             ductLength: '18.6 ft'
           }
        }
      });
    } else {
      Alert.alert("Error", res.message || "Failed to save inspection");
    }
  };

  const CheckItem = ({ label, selected, onPress, color }) => (
    <TouchableOpacity style={styles.checkItem} onPress={onPress}>
      <View style={[styles.checkbox, selected && styles.checkboxActive]}>
        {selected && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
      </View>
      {color && <View style={[styles.colorDot, { backgroundColor: color }]} />}
      <Text style={[styles.checkLabel, selected && styles.checkLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pre-Inspection Tool</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Job Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Job Context</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer</Text>
            <Text style={styles.detailValue}>{job?.customerName || 'Alistair Hughes'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]}>{job?.location || '742 Pine Street, Austin, TX'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{job?.categoryName || 'HVAC Installation'}</Text>
          </View>
        </View>

        {/* AI Job Triage Card */}
        <View style={styles.purpleCard}>
          <View style={styles.aiHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>AI Job Triage</Text>
              <Text style={styles.aiSub}>Analyze job complexity for better estimates.</Text>
            </View>
            <MaterialCommunityIcons name="sparkles" size={22} color="#A855F7" />
          </View>

          <View style={styles.triageBox}>
            <Text style={styles.triageSectionTitle}>{role === 'worker' ? 'Technical Issue Type' : 'Issue Type'}</Text>
            <CheckItem label="New Installation" selected={issueType === 'New Installation'} onPress={() => setIssueType('New Installation')} />
            <CheckItem label="Repair" selected={issueType === 'Repair'} onPress={() => setIssueType('Repair')} />
            <CheckItem label="Replacement" selected={issueType === 'Replacement'} onPress={() => setIssueType('Replacement')} />
            {role === 'worker' && (
              <>
                <CheckItem label="Diagnostic Only" selected={issueType === 'Diagnostic'} onPress={() => setIssueType('Diagnostic')} />
                <CheckItem label="Warranty Claim" selected={issueType === 'Warranty'} onPress={() => setIssueType('Warranty')} />
              </>
            )}
          </View>

          <View style={styles.triageBox}>
            <Text style={styles.triageSectionTitle}>Urgency</Text>
            <CheckItem label="Low" selected={urgency === 'Low'} onPress={() => setUrgency('Low')} color="#22C55E" />
            <CheckItem label="Medium" selected={urgency === 'Medium'} onPress={() => setUrgency('Medium')} color="#EAB308" />
            <CheckItem label="Urgent" selected={urgency === 'Urgent'} onPress={() => setUrgency('Urgent')} color="#EF4444" />
          </View>

          {role === 'worker' && (
            <View style={styles.triageBox}>
              <Text style={styles.triageSectionTitle}>Job Difficulty (Technical)</Text>
              <CheckItem label="Standard" selected={damage === 'Standard'} onPress={() => setDamage('Standard')} />
              <CheckItem label="Complex (Custom tools needed)" selected={damage === 'Complex'} onPress={() => setDamage('Complex')} />
              <CheckItem label="Critical (Requires support)" selected={damage === 'Critical'} onPress={() => setDamage('Critical')} />
            </View>
          )}
        </View>

        {role === 'worker' && (
          <View style={styles.card}>
            <Text style={styles.cardHeaderTitle}>Site Access & Constraints</Text>
            <View style={styles.accessRow}>
              <TouchableOpacity style={[styles.accessTab, damage === 'restricted' && styles.accessTabActive]} onPress={() => setDamage('restricted')}>
                <Ionicons name="lock-closed" size={18} color={damage === 'restricted' ? '#fff' : '#718096'} />
                <Text style={[styles.accessText, damage === 'restricted' && styles.accessTextActive]}>Restricted</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.accessTab, damage === 'standard' && styles.accessTabActive]} onPress={() => setDamage('standard')}>
                <Ionicons name="key" size={18} color={damage === 'standard' ? '#fff' : '#718096'} />
                <Text style={[styles.accessText, damage === 'standard' && styles.accessTextActive]}>Standard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.accessTab, damage === 'easy' && styles.accessTabActive]} onPress={() => setDamage('easy')}>
                <Ionicons name="checkmark-circle" size={18} color={damage === 'easy' ? '#fff' : '#718096'} />
                <Text style={[styles.accessText, damage === 'easy' && styles.accessTextActive]}>Easy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Camera Measuring Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>{role === 'worker' ? 'Technical Measurements' : 'Camera Measuring'}</Text>
          <Text style={styles.cardSub}>
            {role === 'worker' 
              ? "Input precise measurements from the field for accurate material calculation." 
              : "Detect objects and spaces via camera."}
          </Text>
          
          <View style={styles.cameraBox}>
            <TouchableOpacity style={styles.openCameraBtn}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.openCameraBtnText}>{role === 'worker' ? 'Launch Scanning Tool' : 'Open AR Camera'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.measRow}>
             <Text style={styles.measLab}>{role === 'worker' ? 'Exact Wall Width' : 'Wall Width'}</Text>
             <Text style={styles.measVal}>12.4 ft</Text>
          </View>
          <View style={styles.measRow}>
             <Text style={styles.measLab}>{role === 'worker' ? 'Exact Ceiling Height' : 'Ceiling Height'}</Text>
             <Text style={styles.measVal}>9.1 ft</Text>
          </View>
          {role === 'worker' && (
            <View style={styles.measRow}>
               <Text style={styles.measLab}>Substrate Condition</Text>
               <Text style={styles.measVal}>Level (Ready)</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.inspectBtn, { marginTop: 10 }]}
          onPress={handleInspect}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.inspectBtnText}>Confirm Inspection</Text>}
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  editBtn: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },

  scrollContent: { padding: 16 },
  card: { backgroundColor: '#F8FAFC', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeaderTitle: { fontSize: 17, fontWeight: '700', color: '#1A202C', marginBottom: 16 },
  cardSub: { fontSize: 13, color: '#718096', marginBottom: 20, lineHeight: 18 },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailLabel: { fontSize: 14, color: '#718096' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1A202C' },

  purpleCard: { backgroundColor: '#FDFCFE', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F3E8FF' },
  aiHeader: { flexDirection: 'row', marginBottom: 20 },
  aiTitle: { fontSize: 18, fontWeight: '700', color: '#8B5CF6' },
  aiSub: { fontSize: 13, color: '#718096', marginTop: 4, lineHeight: 18 },

  triageBox: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, ...SHADOWS.small },
  triageSectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A202C', marginBottom: 12 },

  checkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxActive: { backgroundColor: '#0062E1', borderColor: '#0062E1' },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  checkLabel: { fontSize: 15, color: '#4A5568' },
  checkLabelActive: { color: '#000', fontWeight: '600' },

  cameraBox: { height: 180, backgroundColor: '#111827', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  openCameraBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0E56D0', paddingHorizontal: 20, height: 48, borderRadius: 24, gap: 10 },
  openCameraBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  measurementTitle: { fontSize: 15, fontWeight: '700', color: '#1A202C', marginBottom: 16 },
  measRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  measLab: { fontSize: 14, color: '#718096' },
  measVal: { fontSize: 14, fontWeight: '700', color: '#1A202C' },

  addMeasBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 24, gap: 8, backgroundColor: '#fff' },
  addMeasText: { fontSize: 14, fontWeight: '600', color: '#1A202C' },

  estimateSubSection: { marginBottom: 24 },
  estimateLabel: { fontSize: 15, fontWeight: '700', color: '#1A202C', marginBottom: 12 },
  estItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  estName: { fontSize: 14, color: '#4A5568' },
  estQty: { fontSize: 14, color: '#4A5568', fontWeight: '500' },
  estValDark: { fontSize: 14, fontWeight: '600', color: '#1A202C' },

  inspectBtn: { width: '100%', height: 52, backgroundColor: '#0E56D0', borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  inspectBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  confidenceSection: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  confidenceTitle: { fontSize: 14, fontWeight: '700', color: '#1A202C', marginBottom: 12 },
  confidenceMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  accuracyLabel: { fontSize: 13, color: '#718096' },
  accuracyValue: { fontSize: 13, fontWeight: '700', color: '#0062E1' },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#0062E1' },

  continueBtn: { width: '100%', height: 56, backgroundColor: '#0E56D0', borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Worker Access Styles
  accessRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  accessTab: { flex: 1, height: 48, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  accessTabActive: { backgroundColor: '#0E56D0', borderColor: '#0E56D0' },
  accessText: { fontSize: 13, color: '#718096', fontWeight: '600' },
  accessTextActive: { color: '#fff' },
});

export default PreInspectionScreen;
