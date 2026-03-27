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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, SIZES, FONTS } from '../../../constants/theme';

const { width } = Dimensions.get('window');

const SERVICES = [
  { id: '1', name: 'Furniture Assembly', info: 'Expert assembly of all types of furniture.', icon: 'sofa', color: '#0E56D0' },
  { id: '2', name: 'TV Mounting', info: 'Safe and secure wall mounting for TVs.', icon: 'television', color: '#8B5CF6' },
  { id: '3', name: 'Smart Home Setup', info: 'Install and configure smart devices.', icon: 'home-automation', color: '#10B981' },
  { id: '4', name: 'Plumbing Repair', info: 'Fixing leaks, toilets, and faucets.', icon: 'pipe', color: '#EC4899' },
  { id: '5', name: 'Electrical Work', icon: 'lightning-bolt', color: '#F59E0B' },
  { id: '6', name: 'Room Painting', icon: 'format-paint', color: '#06B6D4' },
];

const ServicesOfferedScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedServices, setSelectedServices] = useState(['1', '2']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const ServiceCard = ({ item }) => {
    const isSelected = selectedServices.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
        onPress={() => toggleService(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.serviceIconBg, { backgroundColor: item.color + '15' }]}>
          <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
          {item.info && <Text style={styles.serviceDesc}>{item.info}</Text>}
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#A0AEC0" />
          <TextInput
            placeholder="Search services..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>My Selected Services</Text>
        <View style={styles.servicesGrid}>
          {SERVICES.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
            <ServiceCard key={item.id} item={item} />
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.saveBtnText}>Save Skills</Text>
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#1A202C' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A202C', marginBottom: 16, marginLeft: 4 },

  servicesGrid: { gap: 12 },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  serviceCardSelected: { borderColor: '#0E56D0', backgroundColor: '#F0F7FF' },
  serviceIconBg: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
  serviceDesc: { fontSize: 12, color: '#718096', marginTop: 3 },

  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: '#0E56D0', borderColor: '#0E56D0' },

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

export default ServicesOfferedScreen;
