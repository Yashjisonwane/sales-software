import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  fetchPaymentMethods,
  removePaymentMethod,
  savePaymentMethod,
  FUTURE_ROUTES,
} from '../../../api/futureBusinessApi';

export default function PaymentMethodsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [methods, setMethods] = useState([]);
  const [stubNote, setStubNote] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchPaymentMethods();
    setMethods(Array.isArray(res.data) ? res.data : []);
    setStubNote(res.source === 'stub' ? res.message || '' : '');
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onAdd = async () => {
    const res = await savePaymentMethod({});
    if (!res.success) {
      Alert.alert(
        'Add payment method',
        res.message ||
          (__DEV__
            ? 'Implement savePaymentMethod() in futureBusinessApi.js when billing is ready.'
            : 'Adding cards will be available when your administrator enables billing.')
      );
    }
  };

  const onRemove = (id) => {
    Alert.alert('Remove card', 'Remove this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const res = await removePaymentMethod(id);
          if (!res.success) {
            Alert.alert(
              'Not available yet',
              res.message ||
                (__DEV__ ? 'Wire removePaymentMethod() in futureBusinessApi when the API is ready.' : 'This action is not available yet.')
            );
          }
          load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment methods</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hintCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#1D4ED8" />
          <Text style={styles.hintText}>
            Saved cards and wallets will show here after billing is connected for your business. Your profile, jobs, and invoices already sync with the server.
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerBlock}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : methods.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="card-outline" size={48} color={COLORS.textTertiary} />
            <Text style={styles.emptyTitle}>No payment methods on file</Text>
            <Text style={styles.emptySub}>
              {stubNote ||
                'Nothing stored yet. When payment collection is turned on for your account, your default and backup methods will list here securely.'}
            </Text>
            {__DEV__ ? <Text style={styles.routeHint}>Dev: wire {FUTURE_ROUTES.paymentMethods} in futureBusinessApi.js</Text> : null}
          </View>
        ) : (
          methods.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.typeRow}>
                  <Ionicons name="card" size={24} color={COLORS.primary} />
                  <Text style={styles.typeText}>{item.type || 'Card'}</Text>
                </View>
                <TouchableOpacity onPress={() => onRemove(item.id)}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardNumber}>{item.number || '••••'}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.expiryLabel}>Expiry</Text>
                <Text style={styles.expiryValue}>{item.expiry || '—'}</Text>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.85}>
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          <Text style={styles.addBtnText}>Add payment method</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 20, paddingBottom: 40 },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 10,
  },
  hintText: { flex: 1, fontSize: 13, color: '#1E3A8A', lineHeight: 19 },
  centerBlock: { paddingVertical: 40, alignItems: 'center' },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginTop: 14 },
  emptySub: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  routeHint: { fontSize: 11, color: COLORS.textTertiary, marginTop: 12 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  typeText: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  cardNumber: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: 2, marginBottom: 20 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  expiryLabel: { fontSize: 12, color: COLORS.textTertiary, fontWeight: '600' },
  expiryValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.white,
    height: 56,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginTop: 8,
  },
  addBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
});
