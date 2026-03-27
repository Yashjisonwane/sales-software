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

    const renderStep0 = () => (
        <View style={styles.stepContent}>
            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Select Service Type</Text>
                <TouchableOpacity style={styles.dropdown}>
                    <Text style={styles.dropdownText}>HVAC Installation</Text>
                    <Ionicons name="chevron-down" size={20} color="#1A202C" />
                </TouchableOpacity>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Measurement input</Text>
                <Text style={styles.cardSub}>Use the tool ro auto-fill measurements,</Text>
                <TouchableOpacity style={styles.secondaryActionBtn}>
                    <Text style={styles.secondaryActionBtnText}>Start Pre-Inspection Tool</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Add Materials & Labor</Text>
                <View style={styles.listItem}>
                    <Text style={styles.listLabel}>Total Materials Added:</Text>
                    <Text style={styles.listValue}>5 Items</Text>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.listLabel}>Estimated Labor Hours:</Text>
                    <Text style={styles.listValue}>8.5 hrs</Text>
                </View>
                <TouchableOpacity style={styles.secondaryActionBtn}>
                    <Text style={styles.secondaryActionBtnText}>Edit Item List</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep1 = () => (
        <View style={styles.stepContent}>
            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Measurement input</Text>
                <Text style={styles.cardSub}>The AI assistant is applying rules to generate the final price.</Text>

                <View style={styles.costItem}>
                    <Text style={styles.costLabel}>Material Cost (Auto-lookup)</Text>
                    <Text style={styles.costValue}>$550.00</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.costItem}>
                    <Text style={styles.costLabel}>Labor Cost (8.5 hrs @ $75/hr)</Text>
                    <Text style={styles.costValue}>$637.50</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.costItem}>
                    <Text style={styles.costLabel}>Travel/ Distance Surcharge</Text>
                    <Text style={styles.costValue}>$45.00</Text>
                </View>
                <View style={[styles.costItem, styles.subtotalRow]}>
                    <Text style={styles.subtotalLabel}>Subtotal</Text>
                    <Text style={styles.subtotalValue}>$1,232.50</Text>
                </View>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Profit Margin Rules</Text>
                <Text style={styles.cardSub}>This margin represents the organization's net profit on this job.</Text>

                <View style={styles.costItem}>
                    <Text style={styles.costLabel}>Desired margin (%)</Text>
                    <Text style={styles.costValue}>35%</Text>
                </View>
                <View style={[styles.costItem, styles.finalPriceRow]}>
                    <Text style={styles.finalPriceLabel}>Final Quote Price</Text>
                    <Text style={styles.finalPriceValue}>$1,896.15</Text>
                </View>
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContent}>
            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>E-Contract Setup</Text>
                <Text style={styles.cardSub}>Review terms and set up the payment split.</Text>
                <View style={styles.costItem}>
                    <Text style={styles.finalPriceLabel}>Final Price</Text>
                    <Text style={styles.finalPriceValue}>$1,896.15</Text>
                </View>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Payment Schedule</Text>
                <View style={styles.costItem}>
                    <Text style={styles.costLabel}>Deposit Due (15%)</Text>
                    <Text style={styles.costValue}>$284.42</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.costItem}>
                    <Text style={styles.costLabel}>Milestone 1 (50%)</Text>
                    <Text style={styles.costValue}>$948.08</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.costItem}>
                    <Text style={styles.costLabel}>Final Payment (35%)</Text>
                    <Text style={styles.costValue}>$663.65</Text>
                </View>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Contract Preview</Text>
                <Text style={styles.cardSub}>(Mock Legal Text) All work is subject to standard terms and conditions. The customer agrees to the payment schedule outlined above. Signature...</Text>
                <TouchableOpacity>
                    <Text style={styles.viewPdfLink}>View Full PDF</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.cardTitle}>Signature Confirmation</Text>
                <Text style={styles.cardSub}>Type or draw your signature to confirm and authorize</Text>
                {/* Signature input would go here */}
            </View>
        </View>
    );

    const renderSuccessModal = () => (
        <Modal visible={showSuccess} transparent animationType="fade">
            <View style={styles.modalBg}>
                <View style={styles.modalPopup}>
                    <TouchableOpacity style={styles.closeModal} onPress={() => setShowSuccess(false)}>
                        <Ionicons name="close" size={24} color="#1A202C" />
                    </TouchableOpacity>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.successContent}>
                            <View style={styles.successIconBg}>
                                <Ionicons name="checkmark" size={60} color={COLORS.white} />
                            </View>
                            <Text style={styles.successTitle}>Quote Sent Successfully!</Text>
                            <Text style={styles.successSub}>Your quote has been sent to the customer for review and signature.</Text>
                            <View style={styles.summaryBox}>
                                <Text style={styles.summaryBoxTitle}>Quote Summary</Text>
                                <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Customer Name</Text><Text style={styles.summaryValue}>Alistair Hughes</Text></View>
                                <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Service Type</Text><Text style={styles.summaryValue}>HVAC Installation</Text></View>
                                <View style={styles.summaryItem}><Text style={styles.summaryLabel}>Total Amount</Text><Text style={styles.summaryValue}>$1,896.15</Text></View>
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.backHomeBtn}
                        onPress={() => {
                            setShowSuccess(false);
                            navigation.reset({ index: 0, routes: [{ name: 'AdminTabs' }] });
                        }}
                    >
                        <Text style={styles.backHomeBtnText}>Back to Home</Text>
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
                <Text style={styles.headerTitle}>{step === 0 ? 'Job Scope' : step === 1 ? 'Pricing' : 'Review & Send'}</Text>
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
                    style={styles.primaryBtn}
                    onPress={() => step < 2 ? setStep(step + 1) : setShowSuccess(true)}
                >
                    <Text style={styles.primaryBtnText}>
                        {step === 0 ? 'Continue to Pricing' : step === 1 ? 'Review Contract' : 'Send Quote'}
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
});
