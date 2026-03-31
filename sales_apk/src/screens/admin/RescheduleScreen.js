import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SHADOWS, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

import { rescheduleJob } from '../../api/apiService';
import { ActivityIndicator } from 'react-native';

const RescheduleScreen = ({ navigation, route }) => {
  const job = route.params?.job;
  const [selectedDate, setSelectedDate] = useState(16);
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleReschedule = async () => {
    if (!job?.id) return;
    
    setLoading(true);
    const dateStr = `2025-01-${selectedDate < 10 ? '0' + selectedDate : selectedDate}`;
    const res = await rescheduleJob(job.id, dateStr, selectedTime);
    setLoading(false);

    if (res.success) {
      Alert.alert('Success', 'Job successfully rescheduled!');
      navigation.goBack();
    } else {
      Alert.alert('Error', res.message || 'Reschedule failed');
    }
  };

  const timeSlots = [
    '09:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM'
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = [
    null, null, null, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reschedule</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Job Info */}
        <View style={styles.jobInfoCard}>
          <Text style={styles.customerName}>{job?.customerName || 'Active Job'}</Text>
          <Text style={styles.jobType}>{job?.categoryName || 'Service'}</Text>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#4A5568" />
            <Text style={styles.infoText}>{job?.scheduledTime || 'Not set'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#4A5568" />
            <Text style={styles.infoText}>{job?.location || 'No address'}</Text>
          </View>

          <View style={styles.currentDateBox}>
            <Text style={styles.currentDateText}>Re-assigning for Job #{job?.id?.slice(-4).toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select New Date & Time</Text>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity><Ionicons name="chevron-back" size={20} color="#1A202C" /></TouchableOpacity>
            <Text style={styles.monthText}>January 2025</Text>
            <TouchableOpacity><Ionicons name="chevron-forward" size={20} color="#1A202C" /></TouchableOpacity>
          </View>

          <View style={styles.daysGrid}>
            {days.map(day => (
              <Text key={day} style={styles.dayHeaderText}>{day}</Text>
            ))}
          </View>

          <View style={styles.datesGrid}>
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                disabled={!date}
                style={[
                  styles.dateCell,
                  selectedDate === date && styles.selectedDateCell,
                  !date && styles.emptyDateCell
                ]}
                onPress={() => setSelectedDate(date)}
              >
                {date && (
                  <Text style={[styles.dateText, selectedDate === date && styles.selectedDateText]}>
                    {date}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Slots */}
        <Text style={styles.subSectionTitle}>Select Time Slot</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map(time => (
            <TouchableOpacity
              key={time}
              style={[styles.timeChip, selectedTime === time && styles.selectedTimeChip]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeChipText, selectedTime === time && styles.selectedTimeChipText]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={[styles.rescheduleBtn, loading && { opacity: 0.7 }]}
          onPress={handleReschedule}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.rescheduleBtnText}>Update Schedule</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A202C' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  scrollContent: { padding: 20, paddingBottom: 150 },

  jobInfoCard: { marginBottom: 32 },
  customerName: { fontSize: 24, fontWeight: '800', color: '#1A202C', marginBottom: 4 },
  jobType: { fontSize: 13, color: '#718096', marginBottom: 20, fontWeight: '500' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  infoText: { fontSize: 14, color: '#4A5568', fontWeight: '500' },

  currentDateBox: {
    backgroundColor: '#F8F9FB',
    padding: 18,
    borderRadius: 16,
    marginTop: 10,
  },
  currentDateText: { fontSize: 16, color: '#4A5568', fontWeight: '500' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 18 },

  calendarCard: {
    backgroundColor: '#F8F9FB',
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthText: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayHeaderText: {
    width: (width - 80) / 7,
    textAlign: 'center',
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dateCell: {
    width: (width - 80) / 7,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  emptyDateCell: { backgroundColor: 'transparent' },
  dateText: { fontSize: 14, color: '#1A202C', fontWeight: '600' },
  selectedDateCell: {
    backgroundColor: '#DBEAFE',
  },
  selectedDateText: { color: '#0062E1', fontWeight: '800' },

  subSectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 16 },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  timeChip: {
    width: (width - 64) / 3,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 0,
    ...SHADOWS.small,
  },
  selectedTimeChip: {
    backgroundColor: '#DBEAFE',
  },
  timeChipText: { fontSize: 13, color: '#4A5568', fontWeight: '600' },
  selectedTimeChipText: { color: '#0062E1', fontWeight: '800' },

  specificTimeText: { fontSize: 16, fontWeight: '800', color: '#1A202C' },
  timeInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 56,
    marginTop: 12,
    ...SHADOWS.small,
  },
  timeInputText: { fontSize: 16, color: '#94A3B8', fontWeight: '500' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  rescheduleBtn: {
    backgroundColor: '#0E56D0',
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  rescheduleBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});

export default RescheduleScreen;
