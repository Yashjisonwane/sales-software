import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../../../constants/theme';

const HelpSupportScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const SupportOption = ({ icon, title, desc, color }) => (
    <TouchableOpacity style={styles.optionCard} activeOpacity={0.7}>
      <View style={[styles.optionIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.optionInfo}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textTertiary} />
          <TextInput 
            placeholder="Search FAQs" 
            style={styles.searchInput}
            placeholderTextColor={COLORS.textTertiary}
          />
        </View>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <SupportOption 
          icon="chatbubble-ellipses-outline" 
          title="Live Chat" 
          desc="Chat with our support team" 
          color="#0062E1"
        />
        <SupportOption 
          icon="mail-outline" 
          title="Email Support" 
          desc="Get response within 24 hours" 
          color="#8B5CF6"
        />
        <SupportOption 
          icon="call-outline" 
          title="Phone Support" 
          desc="Available Monday - Friday" 
          color="#10B981"
        />

        <Text style={styles.sectionTitle}>FAQs</Text>
        <View style={styles.faqCard}>
          {['How to create a quote?', 'Managing team members', 'Subscription plans', 'Withdrawal process'].map((q, i) => (
            <View key={i}>
              <TouchableOpacity style={styles.faqItem}>
                <Text style={styles.faqText}>{q}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
              </TouchableOpacity>
              {i < 3 && <View style={styles.faqDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>
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
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, color: COLORS.textPrimary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  optionIcon: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  optionInfo: { flex: 1, marginLeft: 16 },
  optionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  optionDesc: { fontSize: 13, color: COLORS.textTertiary, marginTop: 2 },
  faqCard: { backgroundColor: '#F8FAFC', borderRadius: 20, padding: 8, marginBottom: 24, ...SHADOWS.small },
  faqItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  faqText: { fontSize: 14, fontWeight: '500', color: COLORS.textPrimary },
  faqDivider: { height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 12 },
});

export default HelpSupportScreen;
