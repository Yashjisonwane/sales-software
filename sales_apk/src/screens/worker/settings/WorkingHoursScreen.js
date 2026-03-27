import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, SIZES, FONTS } from '../../../constants/theme';

const { width } = Dimensions.get('window');

const WorkingHoursScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [schedule, setSchedule] = useState({
    Monday: { enabled: true, start: '09:00 AM', end: '05:00 PM' },
    Tuesday: { enabled: true, start: '09:00 AM', end: '05:00 PM' },
    Wednesday: { enabled: true, start: '09:00 AM', end: '05:00 PM' },
    Thursday: { enabled: true, start: '09:00 AM', end: '05:00 PM' },
    Friday: { enabled: true, start: '09:00 AM', end: '05:00 PM' },
    Saturday: { enabled: false, start: '10:00 AM', end: '02:00 PM' },
    Sunday: { enabled: false, start: '10:00 AM', end: '02:00 PM' },
  });

  const toggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const DayRow = ({ day, data }) => (
    <View style={styles.dayRow}>
      <View style={styles.dayHeader}>
        <Switch
          value={data.enabled}
          onValueChange={() => toggleDay(day)}
          trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
          thumbColor={COLORS.white}
        />
        <Text style={[styles.dayName, !data.enabled && styles.disabledText]}>{day}</Text>
      </View>

      {data.enabled ? (
        <View style={styles.timeWrapper}>
          <TouchableOpacity style={styles.timeBtn}>
            <Text style={styles.timeText}>{data.start}</Text>
          </TouchableOpacity>
          <Text style={styles.toText}>to</Text>
          <TouchableOpacity style={styles.timeBtn}>
            <Text style={styles.timeText}>{data.end}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.closedText}>Off Work</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Working Hours</Text>
        <TouchableOpacity style={styles.saveHeaderBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveHeaderText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons name="time" size={30} color="#0E56D0" />
          </View>
          <View style={styles.introInfo}>
            <Text style={styles.introTitle}>Set Availability</Text>
            <Text style={styles.introSub}>Configure your weekly work schedule to receive service requests.</Text>
          </View>
        </View>

        <View style={styles.scheduleCard}>
          {Object.entries(schedule).map(([day, data], index) => (
            <View key={day}>
              <DayRow day={day} data={data} />
              {index < Object.entries(schedule).length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#718096" />
          <Text style={styles.infoText}>
            Customers can only book jobs within these time windows. You can update this at any time.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  saveHeaderBtn: { paddingHorizontal: 16, height: 40, alignItems: 'center', justifyContent: 'center' },
  saveHeaderText: { fontSize: 16, fontWeight: '700', color: '#0E56D0' },

  scrollContent: { padding: 20 },

  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.small,
  },
  introIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  introInfo: { flex: 1 },
  introTitle: { fontSize: 17, fontWeight: '800', color: '#1A202C' },
  introSub: { fontSize: 12, color: '#718096', marginTop: 3, lineHeight: 18 },

  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  dayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dayName: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
  disabledText: { color: '#CBD5E0' },

  timeWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeBtn: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeText: { fontSize: 14, fontWeight: '600', color: '#4A5568' },
  toText: { fontSize: 12, color: '#A0AEC0', fontWeight: '500' },
  closedText: { fontSize: 14, color: '#A0AEC0', fontWeight: '600', fontStyle: 'italic' },

  divider: { height: 1, backgroundColor: '#F1F5F9' },

  infoBox: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  infoText: { flex: 1, marginLeft: 12, fontSize: 13, color: '#718096', lineHeight: 20 },
});

export default WorkingHoursScreen;
