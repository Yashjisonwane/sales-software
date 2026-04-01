import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Dimensions,
    Modal,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, FONTS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createEstimate } from '../../api/apiService';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

const StepIndicator = ({ currentStep }) => {
    const steps = ['Job Scope', 'Pricing', 'Review & Send'];
    return (
        <View style={styles.stepIndicatorContainer}>
            <View style={styles.stepsRow}>
                {steps.map((step, index) => (
                    <View key={step} style={styles.stepItem}>
                        <View style={styles.dotLabelContainer}>
                            <View style={[
                                styles.stepDot,
                                index <= currentStep ? styles.stepDotActive : styles.stepDotInactive
                            ]}>
                                {index < currentStep ? (
                                    <View style={styles.stepDotInnerActive} />
                                ) : (
                                    <View style={[styles.stepDotInner, index === currentStep && styles.stepDotInnerActive]} />
                                )}
                            </View>
                            <Text style={[
                                styles.stepText,
                                index === currentStep ? styles.stepTextActive : styles.stepTextInactive
                            ]}>{step}</Text>
                        </View>
                        {index < steps.length - 1 && (
                            <View style={[styles.stepLine, index < currentStep && styles.stepLineActive]} />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

export default function CreateQuoteScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('1896.15');
    const [description, setDescription] = useState('HVAC Installation - Standard setup');
    const job = route.params?.job || {};

    const handleSendQuote = async () => {
        setLoading(true);
        const res = await createEstimate(job.id, amount, description);
        setLoading(false);
        if (res.success) {
            setShowSuccess(true);
        } else {
            alert(res.message || 'Error creating quote');
        }
    };

    const renderStep0 = () => (
        <View style={styles.stepContent}>
            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Job Scope: {job.customerName || 'New Client'}</Text>
                <Text style={styles.cardSub}>{job.categoryName || 'Service Req'} • {job.location || 'Site Location'}</Text>
                <View style={styles.divider} />
                <View style={{ marginTop: 15 }}>
                    <Text style={styles.label}>Detailed Description</Text>
                    <TextInput 
                        style={styles.textAreaRefined}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        placeholder="Describe materials, labor, and timeline..."
                    />
                </View>
            </View>
        </View>
    );

    const renderStep1 = () => (
        <View style={styles.stepContent}>
            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Final Pricing</Text>
                <View style={styles.inputContainerQuote}>
                    <Text style={styles.label}>Quote Amount ($)</Text>
                    <TextInput 
                        style={styles.pricingInput}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContent}>
            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Review & Send</Text>
                <View style={styles.summaryBox}>
                    <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Customer</Text><Text style={styles.summaryValue}>{job.customerName}</Text></View>
                    <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Total Budget</Text><Text style={[styles.summaryValue, { color: '#0062E1' }]}>${amount}</Text></View>
                    <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Category</Text><Text style={styles.summaryValue}>{job.categoryName}</Text></View>
                </View>
            </View>
        </View>
    );

    const renderSuccessModal = () => (
        <Modal visible={showSuccess} transparent animationType="fade">
            <View style={styles.modalBg}>
                <View style={styles.modalPopup}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.successContent}>
                            <View style={styles.successIconBg}>
                                <Ionicons name="checkmark" size={60} color={COLORS.white} />
                            </View>
                            <Text style={styles.successTitle}>Quote Sent!</Text>
                            <Text style={styles.successSub}>Your quote has been successfully synchronized and sent to the client.</Text>
                            <View style={styles.summaryBox}>
                                <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Job Ref</Text><Text style={styles.summaryValue}>#JB-{job.id?.slice(-4).toUpperCase()}</Text></View>
                                <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Total Amount</Text><Text style={styles.summaryValue}>${amount}</Text></View>
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.backHomeBtn}
                        onPress={() => {
                            setShowSuccess(false);
                            navigation.popToTop();
                        }}
                    >
                        <Text style={styles.backHomeBtnText}>Back to Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#1A202C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{step === 0 ? 'Scope' : step === 1 ? 'Pricing' : 'Confirm'}</Text>
                <View style={{ width: 44 }} />
            </View>

            <StepIndicator currentStep={step} />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {step === 0 && renderStep0()}
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                    disabled={loading}
                    onPress={() => step < 2 ? setStep(step + 1) : handleSendQuote()}
                >
                    <Text style={styles.primaryBtnText}>
                        {loading ? 'Processing...' : step === 0 ? 'Continue to Pricing' : step === 1 ? 'Review Final' : 'Sync & Send Quote'}
                    </Text>
                </TouchableOpacity>
            </View>

            {renderSuccessModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
    
    stepIndicatorContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
    stepsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    stepItem: { flexDirection: 'row', alignItems: 'center' },
    dotLabelContainer: { alignItems: 'center', width: 80 },
    stepDot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 4, borderWidth: 2, backgroundColor: '#FFF' },
    stepDotInactive: { borderColor: '#E2E8F0' },
    stepDotActive: { borderColor: '#0062E1' },
    stepDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E2E8F0' },
    stepDotInnerActive: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0062E1' },
    stepText: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
    stepTextInactive: { color: '#94A3B8' },
    stepTextActive: { color: '#1A202C' },
    stepLine: { width: 40, height: 2, backgroundColor: '#F1F5F9', marginBottom: 20 },
    stepLineActive: { backgroundColor: '#0062E1' },

    scrollView: { flex: 1 },
    stepContent: { paddingHorizontal: 20 },
    formCard: { backgroundColor: '#F8F9FB', borderRadius: 24, padding: 24, marginBottom: 16 },
    cardTitle: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 16 },
    cardSub: { fontSize: 13, color: '#718096', marginBottom: 16, lineHeight: 18 },
    
    dropdown: { height: 56, borderRadius: 28, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
    dropdownText: { fontSize: 15, color: '#1A202C', fontWeight: '500' },
    
    secondaryActionBtn: { height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#1A202C', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
    secondaryActionBtnText: { fontSize: 14, fontWeight: '700', color: '#1A202C' },
    
    listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
    listLabel: { fontSize: 15, color: '#64748B' },
    listValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },

    costItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
    costLabel: { fontSize: 15, color: '#64748B' },
    costValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
    divider: { height: 1, backgroundColor: '#E2E8F0', width: '100%' },
    
    subtotalRow: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 16 },
    subtotalLabel: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
    subtotalValue: { fontSize: 16, fontWeight: '800', color: '#1A202C' },
    
    finalPriceRow: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 16 },
    finalPriceLabel: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
    finalPriceValue: { fontSize: 20, fontWeight: '800', color: '#1A202C' },

    viewPdfLink: { fontSize: 14, fontWeight: '700', color: '#8B5CF6', textDecorationLine: 'underline' },

    footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    primaryBtn: { height: 56, borderRadius: 28, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center' },
    primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalPopup: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '90%', padding: 24 },
    closeModal: { alignSelf: 'flex-end', padding: 8 },
    successContent: { alignItems: 'center' },
    successIconBg: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center', marginVertical: 30 },
    successTitle: { fontSize: 24, fontWeight: '800', color: '#1A202C', textAlign: 'center' },
    successSub: { fontSize: 15, color: '#718096', textAlign: 'center', marginTop: 12, paddingHorizontal: 20 },
    summaryBox: { backgroundColor: '#F8F9FB', borderRadius: 20, padding: 20, width: '100%', marginTop: 30 },
    summaryBoxTitle: { fontSize: 16, fontWeight: '700', color: '#1A202C', marginBottom: 16 },
    summaryItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    summaryLabel: { fontSize: 14, color: '#718096' },
    summaryValue: { fontSize: 14, fontWeight: '700', color: '#1A202C' },
    backHomeBtn: { height: 60, borderRadius: 30, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center', marginTop: 30 },
    backHomeBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    textAreaRefined: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, height: 120, textAlignVertical: 'top', marginTop: 8, borderWidth: 1, borderColor: '#EDF2F7', color: '#2D3748' },
    pricingInput: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, height: 56, marginTop: 8, borderWidth: 1, borderColor: '#EDF2F7', color: '#2D3748', fontSize: 18, fontWeight: '700' },
    label: { fontSize: 14, fontWeight: '600', color: '#4A5568', marginBottom: 4 },
    inputContainerQuote: { marginTop: 10 },
});
