import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, SIZES, FONTS } from '../../../constants/theme';

const { width } = Dimensions.get('window');

const ServiceAreasScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [areas, setAreas] = useState([
    { id: '1', city: 'Boulder', state: 'CO', active: true },
    { id: '2', city: 'Denver', state: 'CO', active: true },
    { id: '3', city: 'Longmont', state: 'CO', active: false },
    { id: '4', city: 'Aurora', state: 'CO', active: false },
  ]);

  const toggleArea = (id) => {
    setAreas(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const AreaRow = ({ item }) => (
    <TouchableOpacity 
      style={[styles.areaItem, item.active && styles.areaItemActive]} 
      onPress={() => toggleArea(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.areaIconBg, { backgroundColor: item.active ? '#0E56D0' : '#F1F5F9' }]}>
        <Ionicons name="location-outline" size={20} color={item.active ? '#fff' : '#4A5568'} />
      </View>
      <View style={styles.areaInfo}>
        <Text style={[styles.areaCity, item.active && styles.areaCityActive]}>{item.city}</Text>
        <Text style={styles.areaState}>{item.state}</Text>
      </View>
      <View style={[styles.checkbox, item.active && styles.checkboxActive]}>
        {item.active && <Ionicons name="checkmark" size={14} color="#fff" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Areas</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons name="map" size={30} color="#0E56D0" />
          </View>
          <View style={styles.introText}>
            <Text style={styles.introTitle}>Define Your Range</Text>
            <Text style={styles.introSub}>Choose the cities and areas where you are willing to accept jobs.</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#CBD5E0" />
          <TextInput placeholder="Search New City" style={styles.searchInput} />
          <TouchableOpacity style={styles.addCityBtn}>
            <Ionicons name="add" size={20} color="#0E56D0" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Available Locations</Text>
        <View style={styles.areasGrid}>
          {areas.map(item => <AreaRow key={item.id} item={item} />)}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>Update Locations</Text>
        </TouchableOpacity>
        
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
  introText: { flex: 1 },
  introTitle: { fontSize: 17, fontWeight: '800', color: '#1A202C' },
  introSub: { fontSize: 13, color: '#718096', marginTop: 4, lineHeight: 18 },
  
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#1A202C' },
  addCityBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A202C', marginBottom: 16, marginLeft: 4 },
  
  areasGrid: { gap: 12 },
  areaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  areaItemActive: { borderColor: '#0E56D0', backgroundColor: '#F0F7FF' },
  areaIconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  areaInfo: { flex: 1 },
  areaCity: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
  areaCityActive: { color: '#0E56D0' },
  areaState: { fontSize: 12, color: '#A0AEC0', marginTop: 2 },
  
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#0E56D0', borderColor: '#0E56D0' },
  
  saveBtn: {
    backgroundColor: '#0E56D0',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    ...SHADOWS.medium,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default ServiceAreasScreen;
