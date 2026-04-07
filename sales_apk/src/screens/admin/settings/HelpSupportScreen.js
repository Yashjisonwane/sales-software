import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../../constants/theme';
import { HELP_CONTACT_OPTIONS, HELP_FAQ_ITEMS } from '../../../constants/supportAndLegalContent';

const HelpSupportScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [faqQuery, setFaqQuery] = useState('');

  const filteredFaqs = useMemo(() => {
    const q = faqQuery.trim().toLowerCase();
    if (!q) return HELP_FAQ_ITEMS;
    return HELP_FAQ_ITEMS.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [faqQuery]);

  const openUrl = (url) => {
    if (!url) {
      Alert.alert('In-app', 'Use job chat for job-specific questions, or email/phone below.');
      return;
    }
    Linking.openURL(url).catch(() => Alert.alert('Could not open link', 'Try email or phone instead.'));
  };

  const SupportOption = ({ icon, title, desc, color, url }) => (
    <TouchableOpacity style={styles.optionCard} activeOpacity={0.7} onPress={() => openUrl(url)}>
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

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.noteCard}>
          <Ionicons name="book-outline" size={18} color="#1E40AF" />
          <Text style={styles.noteText}>
            FAQs and contact options are maintained in a single place in the app project, so wording stays consistent and easy to update for your brand.
          </Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textTertiary} />
          <TextInput
            placeholder="Search FAQs"
            style={styles.searchInput}
            placeholderTextColor={COLORS.textTertiary}
            value={faqQuery}
            onChangeText={setFaqQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>Contact</Text>
        {HELP_CONTACT_OPTIONS.map((opt) => (
          <SupportOption key={opt.title} {...opt} />
        ))}

        <Text style={styles.sectionTitle}>FAQs</Text>
        <View style={styles.faqCard}>
          {filteredFaqs.length === 0 ? (
            <Text style={styles.faqEmpty}>No matches — try another keyword.</Text>
          ) : (
            filteredFaqs.map((item, i) => (
              <View key={item.q}>
                <TouchableOpacity
                  style={styles.faqItem}
                  onPress={() => Alert.alert(item.q, item.a)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqText}>{item.q}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                </TouchableOpacity>
                {i < filteredFaqs.length - 1 && <View style={styles.faqDivider} />}
              </View>
            ))
          )}
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
  scrollContent: { padding: 20, paddingBottom: 40 },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  noteText: { flex: 1, fontSize: 12, color: '#1E3A8A', lineHeight: 17 },
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
  faqText: { fontSize: 14, fontWeight: '500', color: COLORS.textPrimary, flex: 1, paddingRight: 8 },
  faqDivider: { height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 12 },
  faqEmpty: { padding: 20, fontSize: 14, color: COLORS.textTertiary, textAlign: 'center' },
});

export default HelpSupportScreen;
