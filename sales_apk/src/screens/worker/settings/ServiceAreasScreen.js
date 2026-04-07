import React, { useState, useCallback } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SHADOWS, FONTS } from '../../../constants/theme';
import { getProfile, updateProfile, refreshLocalUserSnapshot } from '../../../api/apiService';

export default function ServiceAreasScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getProfile();
    if (res.success && res.data) {
      setCity(res.data.city || '');
      setState(res.data.state || '');
      setPincode(res.data.pincode || '');
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onSave = async () => {
    setSaving(true);
    const res = await updateProfile({
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      pincode: pincode.trim() || undefined,
    });
    setSaving(false);
    if (res.success) {
      await refreshLocalUserSnapshot();
      Alert.alert('Saved', 'Service area saved on the server.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } else {
      Alert.alert('Error', res.message || 'Could not save');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Areas</Text>
        <TouchableOpacity style={styles.saveHeaderBtn} onPress={onSave} disabled={saving}>
          <Text style={styles.saveHeaderText}>{saving ? '…' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <Ionicons name="map" size={30} color="#0E56D0" />
            </View>
            <View style={styles.introText}>
              <Text style={styles.introTitle}>Primary service location</Text>
              <Text style={styles.introSub}>
                Stored on your user profile (city / state / PIN). Same data admins see for your account.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>City</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" placeholderTextColor="#A0AEC0" />
            <Text style={styles.label}>State / region</Text>
            <TextInput style={styles.input} value={state} onChangeText={setState} placeholder="State" placeholderTextColor="#A0AEC0" />
            <Text style={styles.label}>Postal code</Text>
            <TextInput
              style={styles.input}
              value={pincode}
              onChangeText={setPincode}
              placeholder="PIN / ZIP"
              placeholderTextColor="#A0AEC0"
              keyboardType="default"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={onSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save area</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary, flex: 1, textAlign: 'center' },
  saveHeaderBtn: { paddingHorizontal: 12, minWidth: 48, alignItems: 'flex-end' },
  saveHeaderText: { fontSize: 16, fontFamily: FONTS.bold, color: '#0E56D0' },
  scrollContent: { padding: 20 },
  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  introText: { flex: 1 },
  introTitle: { fontSize: 17, fontFamily: FONTS.bold, color: '#1A202C' },
  introSub: { fontSize: 12, color: '#718096', marginTop: 4, lineHeight: 18 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    ...SHADOWS.small,
  },
  label: { fontSize: 13, fontFamily: FONTS.semiBold, color: '#4A5568', marginBottom: 8, marginTop: 10 },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: '#1A202C',
  },
  saveBtn: {
    backgroundColor: '#0E56D0',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    ...SHADOWS.medium,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: FONTS.bold },
});
