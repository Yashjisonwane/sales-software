import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../../constants/theme';
import { TERMS_LAST_UPDATED, TERMS_SECTIONS, TERMS_APP_NAME } from '../../../constants/supportAndLegalContent';

const TermsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const Section = ({ title, content }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
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
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Ionicons name="document-text" size={40} color="#0E56D0" />
          <Text style={styles.infoTitle}>Last updated: {TERMS_LAST_UPDATED}</Text>
          <Text style={styles.infoSub}>
            Terms for {TERMS_APP_NAME}. Legal copy is centralized so updates stay simple as your business grows.
          </Text>
        </View>

        {TERMS_SECTIONS.map((s) => (
          <Section key={s.title} title={s.title} content={s.content} />
        ))}

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
  
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...SHADOWS.medium,
  },
  infoTitle: { fontSize: 16, fontWeight: '800', color: '#1A202C', marginTop: 16 },
  infoSub: { fontSize: 13, color: '#718096', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A202C', marginBottom: 10 },
  sectionContent: { fontSize: 14, color: '#4A5568', lineHeight: 22 },
});

export default TermsScreen;
