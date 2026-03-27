import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const PreInspectionScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  // Selection states
  const [issueType, setIssueType] = useState('New Installation');
  const [urgency, setUrgency] = useState('Medium');
  const [damage, setDamage] = useState('None');

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
        <Text style={styles.headerTitle}>Pre-Inspection & Measuring</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Job Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Job Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer Name</Text>
            <Text style={styles.detailValue}>Alistair Hughes</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Job Address</Text>
            <Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]}>742 Pine Street, Austin, TX</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service Type</Text>
            <Text style={styles.detailValue}>HVAC Installation</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Property Type</Text>
            <Text style={styles.detailValue}>Residential</Text>
          </View>
        </View>

        {/* AI Job Triage Card */}
        <View style={styles.purpleCard}>
          <View style={styles.aiHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiTitle}>AI Job Triage</Text>
              <Text style={styles.aiSub}>Answer a few questions to help AI understand the job complexity.</Text>
            </View>
            <MaterialCommunityIcons name="sparkles" size={22} color="#A855F7" />
          </View>

          <View style={styles.triageBox}>
            <Text style={styles.triageSectionTitle}>Issue Type</Text>
            <CheckItem label="New Installation" selected={issueType === 'New Installation'} onPress={() => setIssueType('New Installation')} />
            <CheckItem label="Repair" selected={issueType === 'Repair'} onPress={() => setIssueType('Repair')} />
            <CheckItem label="Replacement" selected={issueType === 'Replacement'} onPress={() => setIssueType('Replacement')} />
            <CheckItem label="Inspection Only" selected={issueType === 'Inspection Only'} onPress={() => setIssueType('Inspection Only')} />
          </View>

          <View style={styles.triageBox}>
            <Text style={styles.triageSectionTitle}>Urgency</Text>
            <CheckItem label="Low" selected={urgency === 'Low'} onPress={() => setUrgency('Low')} color="#22C55E" />
            <CheckItem label="Medium" selected={urgency === 'Medium'} onPress={() => setUrgency('Medium')} color="#EAB308" />
            <CheckItem label="Urgent" selected={urgency === 'Urgent'} onPress={() => setUrgency('Urgent')} color="#EF4444" />
          </View>

          <View style={styles.triageBox}>
            <Text style={styles.triageSectionTitle}>Existing Damage</Text>
            <CheckItem label="None" selected={damage === 'None'} onPress={() => setDamage('None')} />
            <CheckItem label="Minor" selected={damage === 'Minor'} onPress={() => setDamage('Minor')} />
            <CheckItem label="Major" selected={damage === 'Major'} onPress={() => setDamage('Major')} />
          </View>
        </View>

        {/* Camera Measuring Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Camera Measuring</Text>
          <Text style={styles.cardSub}>Use your camera to measure spaces and detect objects automatically.</Text>
          
          <View style={styles.cameraBox}>
            <TouchableOpacity style={styles.openCameraBtn}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.openCameraBtnText}>Open Camera</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.measurementTitle}>Measurement Results</Text>
          <View style={styles.measRow}>
             <Text style={styles.measLab}>Wall Width</Text>
             <Text style={styles.measVal}>12.4 ft</Text>
          </View>
          <View style={styles.measRow}>
             <Text style={styles.measLab}>Ceiling Height</Text>
             <Text style={styles.measVal}>9.1 ft</Text>
          </View>
          <View style={styles.measRow}>
             <Text style={styles.measLab}>Duct Length</Text>
             <Text style={styles.measVal}>18.6 ft</Text>
          </View>
          <View style={styles.measRow}>
             <Text style={styles.measLab}>Unit Placement Area</Text>
             <Text style={styles.measVal}>6.2 × 4.8 ft</Text>
          </View>

          <TouchableOpacity style={styles.addMeasBtn}>
             <Ionicons name="add" size={20} color="#000" />
             <Text style={styles.addMeasText}>Add Another Measurement</Text>
          </TouchableOpacity>
        </View>

        {/* Materials & Labor Estimate */}
        <View style={styles.card}>
           <Text style={styles.cardHeaderTitle}>Materials & Labor Estimate</Text>
           
           <View style={styles.estimateSubSection}>
              <Text style={styles.estimateLabel}>Materials (Auto-Suggested)</Text>
              <View style={styles.estItem}><Text style={styles.estName}>HVAC Unit (3-Ton)</Text><Text style={styles.estQty}>Qty 1</Text></View>
              <View style={styles.estItem}><Text style={styles.estName}>Duct Pipe</Text><Text style={styles.estQty}>Qty 20</Text></View>
              <View style={styles.estItem}><Text style={styles.estName}>Wiring Kit</Text><Text style={styles.estQty}>Qty 1</Text></View>
              <View style={styles.estItem}><Text style={styles.estName}>Mounting Brackets</Text><Text style={styles.estQty}>Qty 2</Text></View>
           </View>

           <View style={styles.estimateSubSection}>
              <Text style={styles.estimateLabel}>Labor Estimate</Text>
              <View style={styles.estItem}><Text style={styles.estName}>Estimated Hours</Text><Text style={styles.estValDark}>8.5 hrs</Text></View>
              <View style={styles.estItem}><Text style={styles.estName}>Crew Size</Text><Text style={styles.estValDark}>2 workers</Text></View>
              <View style={styles.estItem}><Text style={styles.estName}>Skill Level</Text><Text style={styles.estValDark}>Senior Technician</Text></View>
           </View>

           <TouchableOpacity style={styles.inspectBtn}>
              <Text style={styles.inspectBtnText}>Inspect</Text>
           </TouchableOpacity>

           <View style={styles.confidenceSection}>
              <Text style={styles.confidenceTitle}>AI Confidence & Review</Text>
              <View style={styles.confidenceMeta}>
                 <Text style={styles.accuracyLabel}>Accuracy</Text>
                 <Text style={styles.accuracyValue}>92%</Text>
              </View>
              <View style={styles.progressBarBg}>
                 <View style={[styles.progressBarFill, { width: '92%' }]} />
              </View>
           </View>
        </View>

        <TouchableOpacity 
          style={styles.continueBtn}
          onPress={() => navigation.navigate('JobOfferDetail', { state: 'active' })}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
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
});

export default PreInspectionScreen;
