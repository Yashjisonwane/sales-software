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
import { getCategories, getProfile, updateProfessional } from '../../../api/apiService';

const ICON_FOR = {
  Plumbing: 'water',
  Electrical: 'flash',
  Cleaning: 'spray',
  HVAC: 'air-conditioner',
  Painting: 'format-paint',
  Roofing: 'home-roof',
};

export default function ServicesOfferedScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [workerId, setWorkerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [catsRes, profRes] = await Promise.all([getCategories(), getProfile()]);
    if (catsRes.success && Array.isArray(catsRes.data)) {
      setCategories(catsRes.data);
    }
    if (profRes.success && profRes.data) {
      setWorkerId(profRes.data.id);
      const first = profRes.data.categories?.[0]?.category?.name;
      if (first) setSelectedName(first);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onSave = async () => {
    if (!workerId) {
      Alert.alert('Error', 'Could not load your account.');
      return;
    }
    if (!selectedName) {
      Alert.alert('Select a service', 'Pick one primary category (matches server).');
      return;
    }
    setSaving(true);
    const res = await updateProfessional(workerId, { category: selectedName });
    setSaving(false);
    if (res.success) {
      Alert.alert('Saved', 'Your service category is updated on the server.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } else {
      Alert.alert('Error', res.message || 'Save failed');
    }
  };

  const filtered = categories.filter((c) =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.hint}>
            One primary category is stored (same as admin worker edit). List comes from /leads/categories.
          </Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#A0AEC0" />
            <TextInput
              placeholder="Search services..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <Text style={styles.sectionTitle}>Select your category</Text>
          <View style={styles.servicesGrid}>
            {filtered.map((item) => {
              const isSelected = selectedName === item.name;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                  onPress={() => setSelectedName(item.name)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.serviceIconBg, { backgroundColor: (isSelected ? '#0E56D0' : '#64748B') + '18' }]}>
                    <Ionicons name="briefcase-outline" size={24} color={isSelected ? '#0E56D0' : '#64748B'} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                  </View>
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={onSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Save</Text>}
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
  hint: { fontSize: 12, color: '#718096', paddingHorizontal: 20, marginBottom: 12, lineHeight: 18 },
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
  headerTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  scrollContent: { padding: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, fontFamily: FONTS.regular, color: '#1A202C' },
  sectionTitle: { fontSize: 16, fontFamily: FONTS.bold, color: '#1A202C', marginBottom: 16 },
  servicesGrid: { gap: 12 },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  serviceCardSelected: { borderColor: '#0E56D0', backgroundColor: '#F0F7FF' },
  serviceIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontFamily: FONTS.bold, color: '#1A202C' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: '#0E56D0', borderColor: '#0E56D0' },
  saveBtn: {
    backgroundColor: '#0E56D0',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    ...SHADOWS.medium,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontFamily: FONTS.bold },
});
