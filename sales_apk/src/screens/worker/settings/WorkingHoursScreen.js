import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SHADOWS, FONTS } from '../../../constants/theme';
import { getProfile, updateProfile } from '../../../api/apiService';

const DEFAULT_SCHEDULE = {
  Monday: { enabled: true, start: '09:00 AM', end: '05:00 PM' },
  Tuesday: { enabled: true, start: '09:00 AM', end: '05:00 PM' },
  Wednesday: { enabled: true, start: '09:00 AM', end: '05:00 PM' },
  Thursday: { enabled: true, start: '09:00 AM', end: '05:00 PM' },
  Friday: { enabled: true, start: '09:00 AM', end: '05:00 PM' },
  Saturday: { enabled: false, start: '10:00 AM', end: '02:00 PM' },
  Sunday: { enabled: false, start: '10:00 AM', end: '02:00 PM' },
};

function parseSchedule(raw) {
  if (!raw || typeof raw !== 'string') return null;
  try {
    const o = JSON.parse(raw);
    if (o && typeof o === 'object') {
      const keys = Object.keys(DEFAULT_SCHEDULE);
      const ok = keys.every((k) => o[k] && typeof o[k].enabled === 'boolean');
      if (ok) return o;
    }
  } catch (_) {}
  return null;
}

export default function WorkingHoursScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getProfile();
    if (res.success && res.data?.availability) {
      const parsed = parseSchedule(res.data.availability);
      if (parsed) setSchedule(parsed);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const toggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  const save = async () => {
    setSaving(true);
    const res = await updateProfile({ availability: JSON.stringify(schedule) });
    setSaving(false);
    if (res.success) {
      Alert.alert('Saved', 'Working hours stored on your profile.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } else {
      Alert.alert('Error', res.message || 'Could not save');
    }
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
          <View style={styles.timeBtn}>
            <Text style={styles.timeText}>{data.start}</Text>
          </View>
          <Text style={styles.toText}>to</Text>
          <View style={styles.timeBtn}>
            <Text style={styles.timeText}>{data.end}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.closedText}>Off</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Working Hours</Text>
        <TouchableOpacity style={styles.saveHeaderBtn} onPress={save} disabled={saving || loading}>
          <Text style={styles.saveHeaderText}>{saving ? '…' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.hint}>
            Saved as JSON on your profile field &quot;availability&quot; — visible to admin tools using the same API.
          </Text>

          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <Ionicons name="time" size={30} color="#0E56D0" />
            </View>
            <View style={styles.introInfo}>
              <Text style={styles.introTitle}>Weekly availability</Text>
              <Text style={styles.introSub}>Toggle days on/off. Time labels are display-only in this version.</Text>
            </View>
          </View>

          <View style={styles.scheduleCard}>
            {Object.entries(schedule).map(([day, data], index, arr) => (
              <View key={day}>
                <DayRow day={day} data={data} />
                {index < arr.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.footerSave} onPress={save} disabled={saving}>
            {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.footerSaveText}>Save schedule</Text>}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { fontSize: 12, color: '#718096', marginBottom: 12, lineHeight: 18, paddingHorizontal: 4 },
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
  headerTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary, flex: 1, textAlign: 'center' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  saveHeaderBtn: { paddingHorizontal: 12, minWidth: 48, alignItems: 'flex-end' },
  saveHeaderText: { fontSize: 16, fontFamily: FONTS.bold, color: '#0E56D0' },

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
  introIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  introInfo: { flex: 1 },
  introTitle: { fontSize: 17, fontFamily: FONTS.bold, color: '#1A202C' },
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
  dayName: { fontSize: 16, fontFamily: FONTS.bold, color: '#1A202C' },
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
  timeText: { fontSize: 14, fontFamily: FONTS.semiBold, color: '#4A5568' },
  toText: { fontSize: 12, color: '#A0AEC0', fontFamily: FONTS.medium },
  closedText: { fontSize: 14, color: '#A0AEC0', fontFamily: FONTS.semiBold, fontStyle: 'italic' },

  divider: { height: 1, backgroundColor: '#F1F5F9' },

  footerSave: {
    backgroundColor: '#0E56D0',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  footerSaveText: { color: '#FFF', fontSize: 16, fontFamily: FONTS.bold },
});
