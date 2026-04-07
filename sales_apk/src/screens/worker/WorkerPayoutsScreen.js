import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../constants/theme';
import { getWorkerPayoutsSnapshot } from '../../api/apiService';

export default function WorkerPayoutsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('Payments');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [totals, setTotals] = useState({ paid: 0, pending: 0 });
  const [docsNote, setDocsNote] = useState('');

  const load = useCallback(async () => {
    const res = await getWorkerPayoutsSnapshot();
    if (res.success && res.data) {
      setProfile(res.data.profile || null);
      setPayments(res.data.payments || []);
      setTotals(res.data.totals || { paid: 0, pending: 0 });
      setDocsNote(res.data.documentsNote || '');
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  const tabs = ['Payments', 'Profile', 'Documents'];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payouts</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabWrap}>
        {tabs.map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabOn]} onPress={() => setTab(t)}>
            <Text style={[styles.tabTxt, tab === t && styles.tabTxtOn]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#0062E1" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        >
          {tab === 'Payments' && (
            <>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLab}>Paid</Text>
                  <Text style={styles.statVal}>${Number(totals.paid).toLocaleString()}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLab}>Unpaid</Text>
                  <Text style={styles.statVal}>${Number(totals.pending).toLocaleString()}</Text>
                </View>
              </View>
              {payments.length === 0 ? (
                <Text style={styles.muted}>No invoices on your jobs yet.</Text>
              ) : (
                payments.map((p) => (
                  <View key={p.id} style={styles.card}>
                    <Text style={styles.jobNo}>Job {p.jobNo}</Text>
                    <Text style={styles.sub}>{p.customerLabel}</Text>
                    <Text style={styles.amt}>${Number(p.amount).toLocaleString()}</Text>
                    <Text style={styles.date}>{p.dateLabel}</Text>
                    <View style={[styles.badge, p.status === 'PAID' ? styles.badgeOk : styles.badgeWait]}>
                      <Text style={styles.badgeTxt}>{p.status}</Text>
                    </View>
                  </View>
                ))
              )}
            </>
          )}

          {tab === 'Profile' && profile && (
            <View style={styles.card}>
              <Text style={styles.jobNo}>{profile.name}</Text>
              <Text style={styles.sub}>{profile.email}</Text>
              <Text style={[styles.muted, { marginTop: 12 }]}>{profile.splitNote}</Text>
              <View style={[styles.badge, profile.status === 'Active' ? styles.badgeOk : styles.badgeWait, { marginTop: 12, alignSelf: 'flex-start' }]}>
                <Text style={styles.badgeTxt}>{profile.status}</Text>
              </View>
            </View>
          )}

          {tab === 'Documents' && (
            <View style={styles.card}>
              <Text style={styles.muted}>{docsNote}</Text>
            </View>
          )}
          <View style={{ height: 48 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
  tabWrap: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabOn: { backgroundColor: '#0062E1' },
  tabTxt: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTxtOn: { color: '#fff' },
  centered: { flex: 1, justifyContent: 'center' },
  scroll: { padding: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  statLab: { fontSize: 12, color: '#64748B' },
  statVal: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  jobNo: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
  sub: { fontSize: 13, color: '#64748B', marginTop: 4 },
  amt: { fontSize: 18, fontWeight: '800', marginTop: 8 },
  date: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
  badge: { alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeOk: { backgroundColor: '#DCFCE7' },
  badgeWait: { backgroundColor: '#FEF3C7' },
  badgeTxt: { fontSize: 11, fontWeight: '700' },
  muted: { fontSize: 14, color: '#64748B', lineHeight: 20 },
});
