import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const ContractReviewScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Map Peek at top */}
      <View style={styles.mapPeek}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=400' }} 
          style={styles.mapImage}
        />
      </View>

      <View style={[styles.mainCard, { marginTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Contract Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>E-Contract Setup</Text>
            <Text style={styles.cardSub}>Review terms and set up the payment split.</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Final Price</Text>
              <Text style={styles.priceValue}>$1,896.15</Text>
            </View>

            <Text style={styles.scheduleTitle}>Payment Schedule</Text>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Deposit Due (15%)</Text>
              <Text style={styles.scheduleValue}>$284.42</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Milestone 1 (50%)</Text>
              <Text style={styles.scheduleValue}>$948.08</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Final Payment (35%)</Text>
              <Text style={styles.scheduleValue}>$663.65</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contract Preview</Text>
            <Text style={styles.legalText}>
              (Mock Legal Text) All work is subject to standard terms and conditions. The customer agrees to the payment schedule outlined above. Signature...
            </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>View Full PDF</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.acceptRow}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.acceptText}>By continuing, you accept our Terms & Conditions and Privacy Policy.</Text>
          </TouchableOpacity>
          
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Footer Actions */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity style={styles.declineBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={20} color="#fff" />
            <Text style={styles.footerBtnText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.acceptBtn, !agreed && { opacity: 0.6 }]} 
            onPress={() => {
              if(!agreed) return;
              navigation.navigate('JobOfferDetail', { state: 'active' });
            }}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.footerBtnText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mapPeek: { position: 'absolute', top: 0, left: 0, right: 0, height: 150 },
  mapImage: { width: '100%', height: '100%', opacity: 0.6 },
  
  mainCard: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40,
    overflow: 'hidden'
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  scrollContent: { padding: 16 },
  card: { backgroundColor: '#F8F9FA', borderRadius: 24, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#1A202C' },
  cardSub: { fontSize: 13, color: '#718096', marginTop: 4, marginBottom: 20 },

  priceRow: { backgroundColor: '#fff', borderRadius: 12, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  priceLabel: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  priceValue: { fontSize: 18, fontWeight: '800', color: '#1A202C' },

  scheduleTitle: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 16 },
  scheduleItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EDF2F7', backgroundColor: '#fff', paddingHorizontal: 16, marginHorizontal: -4 },
  scheduleLabel: { fontSize: 14, color: '#718096', fontWeight: '500' },
  scheduleValue: { fontSize: 14, fontWeight: '700', color: '#1A202C' },

  legalText: { fontSize: 14, color: '#4A5568', lineHeight: 22, marginBottom: 12 },
  linkText: { fontSize: 14, fontWeight: '700', color: '#8B5CF6', textDecorationLine: 'none' },

  acceptRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 8, marginTop: 15 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 0 },
  checkboxActive: { backgroundColor: '#0062E1', borderColor: '#0062E1' },
  acceptText: { flex: 1, fontSize: 14, color: '#4A5568', lineHeight: 20, fontWeight: '500' },

  footer: { flexDirection: 'row', padding: 20, gap: 15, backgroundColor: '#EDF2F7', borderTopWidth: 0 },
  declineBtn: { flex: 1, height: 58, backgroundColor: '#EF4444', borderRadius: 29, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  acceptBtn: { flex: 1.2, height: 58, backgroundColor: '#10B981', borderRadius: 29, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  footerBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});

export default ContractReviewScreen;
