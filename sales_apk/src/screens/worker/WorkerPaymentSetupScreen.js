import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    TextInput,
    Platform,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SHADOWS } from '../../constants/theme';

const PayoutOption = ({ label, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.payoutOption, selected && styles.payoutOptionActive]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Text style={[styles.payoutLabel, selected && styles.payoutLabelActive]}>{label}</Text>
        <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected && <View style={styles.radioDot} />}
        </View>
    </TouchableOpacity>
);

export default function WorkerPaymentSetupScreen({ navigation }) {
    const [frequency, setFrequency] = useState('Daily');
    const [lateFeeEnabled, setLateFeeEnabled] = useState(false);
    const [customTerms, setCustomTerms] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.topNav}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000000" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerIconContainer}>
                    <View style={styles.headerIconBg}>
                        <MaterialCommunityIcons name="credit-card-marker-outline" size={42} color="#0E56D0" />
                    </View>
                </View>

                <Text style={styles.headline}>Set Up Payments</Text>
                <Text style={styles.subheadline}>
                    Secure transactions, flexible payouts, and refund policies—all in one place.
                </Text>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionHeader}>How would you like to get paid</Text>
                    <Text style={styles.sectionSub}>Choose you Currency</Text>

                    <Text style={styles.inputLabel}>Currency</Text>
                    <View style={styles.dropdown}>
                        <Text style={styles.dropdownText}>$ Dollar</Text>
                        <Ionicons name="chevron-down" size={20} color="#000000" />
                    </View>

                    <Text style={styles.inputLabel}>Choose Your Payment Provider</Text>
                    <View style={styles.dropdown}>
                        <View style={styles.stripeLogo}>
                            <Text style={styles.stripeS}>S</Text>
                        </View>
                        <Text style={styles.dropdownText}>Stripe</Text>
                        <Ionicons name="chevron-down" size={20} color="#000000" />
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionHeader}>Choose Payout Frequency</Text>

                    <View style={styles.optionsList}>
                        <PayoutOption
                            label="Daily"
                            selected={frequency === 'Daily'}
                            onPress={() => setFrequency('Daily')}
                        />
                        <PayoutOption
                            label="Weekly"
                            selected={frequency === 'Weekly'}
                            onPress={() => setFrequency('Weekly')}
                        />
                        <PayoutOption
                            label="Monthly"
                            selected={frequency === 'Monthly'}
                            onPress={() => setFrequency('Monthly')}
                        />
                    </View>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionHeader}>Refund & Cancellation Policy</Text>
                    <View style={styles.policyList}>
                        <View style={styles.policyRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.policyText}>Full Refund (24+ hours before)</Text>
                        </View>
                        <View style={styles.policyRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.policyText}>Partial Refund (50% if canceled within 12 hours)</Text>
                        </View>
                        <View style={styles.policyRow}>
                            <View style={styles.bullet} />
                            <Text style={styles.policyText}>No Refund (If canceled within 6 hours)</Text>
                        </View>
                    </View>

                    <Text style={styles.inputLabel}>Enter Custom Refund Terms</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder=""
                        multiline
                        numberOfLines={4}
                        value={customTerms}
                        onChangeText={setCustomTerms}
                    />
                </View>

                <View style={styles.lateFeeRow}>
                    <Text style={styles.lateFeeText}>Late Cancellation Fee</Text>
                    <Switch
                        value={lateFeeEnabled}
                        onValueChange={setLateFeeEnabled}
                        trackColor={{ false: '#E2E8F0', true: '#0E56D0' }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                <TouchableOpacity
                    style={styles.continueBtn}
                    onPress={() => navigation.navigate('WorkerTabs')}
                >
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topNav: {
        paddingHorizontal: 8,
        paddingTop: Platform.OS === 'ios' ? 10 : 30,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        paddingLeft: 14,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    headerIconContainer: {
        marginTop: 20,
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    headerIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0F7FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headline: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 8,
    },
    subheadline: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 32,
        lineHeight: 22,
    },
    sectionCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    sectionSub: {
        fontSize: 13,
        color: '#94A3B8',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 10,
        marginTop: 4,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        height: 50,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    dropdownText: {
        flex: 1,
        fontSize: 14,
        color: '#475569',
    },
    stripeLogo: {
        width: 24,
        height: 24,
        backgroundColor: '#6366F1',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    stripeS: {
        color: '#FFFFFF',
        fontWeight: '900',
        fontSize: 14,
    },
    optionsList: {
        marginTop: 12,
    },
    payoutOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        height: 50,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    payoutOptionActive: {
        backgroundColor: '#FFFFFF',
    },
    payoutLabel: {
        flex: 1,
        fontSize: 15,
        color: '#475569',
    },
    payoutLabelActive: {
        color: '#111827',
        fontWeight: '600',
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: '#0E56D0',
    },
    radioDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0E56D0',
    },
    policyList: {
        marginBottom: 20,
    },
    policyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#64748B',
        marginRight: 10,
    },
    policyText: {
        fontSize: 13,
        color: '#64748B',
    },
    textArea: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        height: 100,
        textAlignVertical: 'top',
        fontSize: 14,
        color: '#1A202C',
    },
    lateFeeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginBottom: 32,
        marginTop: 10,
    },
    lateFeeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    continueBtn: {
        width: '100%',
        height: 56,
        backgroundColor: '#0E56D0',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
