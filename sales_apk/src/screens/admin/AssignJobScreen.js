import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { getProfessionals, assignLeadToWorker } from '../../api/apiService';
import { Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AssignJobScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const job = route.params?.job;
  const [method, setMethod] = useState('manual');
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchWorkers = async () => {
      const res = await getProfessionals();
      if (res.success) setWorkers(res.data);
    };
    fetchWorkers();
  }, []);

  const handleAssign = async () => {
    if (!job) return;
    if (method === 'manual' && !selectedWorker) {
      Alert.alert('Selection Error', 'Please select a worker first.');
      return;
    }

    setLoading(true);
    const workerId = method === 'auto' ? null : selectedWorker.id;
    const res = await assignLeadToWorker(job.id, workerId);
    setLoading(false);

    if (res.success) {
      navigation.navigate('JobSuccess');
    } else {
      Alert.alert('Assignment Error', res.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign Job</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assignment Method</Text>
          <Text style={styles.sectionSub}>Choose how you want to assign this job to a worker.</Text>

          <TouchableOpacity 
            style={[styles.optionCard, method === 'auto' && styles.activeOption]} 
            onPress={() => setMethod('auto')}
          >
            <Ionicons 
              name={method === 'auto' ? "radio-button-on" : "radio-button-off"} 
              size={24} 
              color={method === 'auto' ? "#0E56D0" : "#CBD5E0"} 
            />
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Automatic Assign</Text>
              <Text style={styles.optionDesc}>
                The system will assign this job to the best available worker based on location, availability, and skill match.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionCard, method === 'manual' && styles.activeOption]} 
            onPress={() => setMethod('manual')}
          >
            <Ionicons 
              name={method === 'manual' ? "radio-button-on" : "radio-button-off"} 
              size={24} 
              color={method === 'manual' ? "#0E56D0" : "#CBD5E0"} 
            />
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Manual Assign</Text>
              <Text style={styles.optionDesc}>Select a specific worker from the list.</Text>
            </View>
          </TouchableOpacity>

          {method === 'manual' && workers.map(w => (
            <TouchableOpacity 
              key={w.id} 
              style={[styles.workerRow, selectedWorker?.id === w.id && styles.activeWorkerRow]} 
              onPress={() => setSelectedWorker(w)}
            >
              <View style={styles.workerAvatarPlaceholder}>
                <Text style={styles.workerInitials}>{w.name?.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.workerName}>{w.name}</Text>
                <Text style={styles.workerStatus}>{w.isAvailable ? 'Available' : 'Busy'}</Text>
              </View>
              {selectedWorker?.id === w.id && <Ionicons name="checkmark-circle" size={20} color="#0E56D0" />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.timerSection}>
          <View style={styles.timerHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.timerTitle}>Enable Job Expiration Timer</Text>
              <Text style={styles.timerDesc}>Job expires if worker doesn't respond in time</Text>
            </View>
            <Switch 
              value={isTimerEnabled} 
              onValueChange={setIsTimerEnabled}
              trackColor={{ false: '#E2E8F0', true: '#0E56D0' }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={[styles.assignBtn, loading && { opacity: 0.7 }]}
          onPress={handleAssign}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.assignBtnText}>Assign Job</Text>}
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
  section: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1A202C' },
  sectionSub: { fontSize: 14, color: '#718096', marginTop: 4, marginBottom: 20 },

  optionCard: { 
    flexDirection: 'row', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#F1F5F9',
    marginBottom: 12,
  },
  activeOption: { borderColor: '#0E56D0', backgroundColor: '#F8FAFF' },
  optionInfo: { flex: 1, marginLeft: 12 },
  optionTitle: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
  optionDesc: { fontSize: 13, color: '#718096', marginTop: 4, lineHeight: 18 },

  timerSection: { 
    backgroundColor: '#F1F5F9', 
    borderRadius: 16, 
    padding: 20 
  },
  timerHeader: { flexDirection: 'row', alignItems: 'center' },
  timerTitle: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
  timerDesc: { fontSize: 13, color: '#718096', marginTop: 2 },

  bottomContainer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  assignBtn: { height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  assignBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  workerRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, backgroundColor: '#F8FAFC', marginBottom: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  activeWorkerRow: { borderColor: '#0E56D0', backgroundColor: '#EFF6FF' },
  workerAvatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  workerInitials: { fontSize: 16, fontWeight: '700', color: '#475569' },
  workerName: { fontSize: 14, fontWeight: '600', color: '#1A202C' },
  workerStatus: { fontSize: 12, color: '#718096', marginTop: 2 },
});

export default AssignJobScreen;
