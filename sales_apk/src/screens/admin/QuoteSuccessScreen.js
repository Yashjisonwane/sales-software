import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QuoteSuccessScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const isWorker = route.params?.role === 'worker';
  const homeRoute = isWorker ? 'WorkerTabs' : 'AdminTabs';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.navigate(homeRoute)}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={60} color="#fff" />
            </View>
            <Text style={styles.title}>Quote Sent Successfully!</Text>
            <Text style={styles.subtext}>
              Your quote has been sent to the customer for review and signature.
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Quote Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Customer Name</Text>
              <Text style={styles.summaryValue}>Alistair Hughes</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Job Address</Text>
              <Text style={styles.summaryValue}>456 Highland Drive, Boulder, CO 80301</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Type</Text>
              <Text style={styles.summaryValue}>HVAC Installation</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Created Date</Text>
              <Text style={styles.summaryValue}>Jan 10, 2026</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Pricing Breakdown</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Materials</Text>
              <Text style={styles.summaryValue}>$550.00</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate(homeRoute)}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  closeBtn: { alignSelf: 'flex-end', marginTop: 60, marginRight: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },

  headerSection: { alignItems: 'center', marginBottom: 30 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0E56D0', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A202C', marginBottom: 12, textAlign: 'center' },
  subtext: { fontSize: 15, color: '#718096', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },

  summaryCard: { 
    backgroundColor: '#F8FAFC', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#1A202C', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  summaryLabel: { fontSize: 13, color: '#718096', flex: 1 },
  summaryValue: { fontSize: 13, fontWeight: '600', color: '#1A202C', flex: 1, textAlign: 'right' },

  bottomContainer: { padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  homeBtn: { height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default QuoteSuccessScreen;
