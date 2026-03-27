import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

export default function WorkerVerifyScreen({ navigation }) {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputs = useRef([]);

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value.length !== 0 && index < 3) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color="#1A202C" />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconBg}>
                        <Ionicons name="lock-closed-outline" size={32} color="#0E56D0" />
                    </View>
                </View>

                <Text style={styles.headline}>Almost there!</Text>
                <Text style={styles.subheadline}>
                    Check your email inbox on your phone and tap the verification link to verify your account.
                </Text>

                <View style={styles.otpRow}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputs.current[index] = ref)}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(txt) => handleOtpChange(txt, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            placeholder=""
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.resendBtn}>
                    <Text style={styles.resendText}>
                        <Text style={styles.underline}>Resend Code</Text> in 00:28
                    </Text>
                </TouchableOpacity>

                <View style={styles.flexSpacer} />

                <TouchableOpacity
                    style={styles.verifyBtn}
                    onPress={() => navigation.navigate('WorkerRole')}
                >
                    <Text style={styles.verifyText}>Verify</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 10 : 40,
        marginLeft: 14,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'flex-start',
    },
    iconContainer: {
        marginTop: 40,
        marginBottom: 24,
    },
    iconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0F7FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headline: {
        fontSize: 28,
        fontFamily: FONTS.bold,
        color: '#000000',
        textAlign: 'left',
        marginBottom: 8,
    },
    subheadline: {
        fontSize: 16,
        fontFamily: FONTS.regular,
        color: '#64748B',
        textAlign: 'left',
        lineHeight: 22,
        marginBottom: 32,
    },
    otpRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    otpInput: {
        width: 56,
        height: 60,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        fontSize: 24,
        fontFamily: FONTS.semiBold,
        color: '#1A202C',
        textAlign: 'center',
    },
    resendBtn: {
        marginTop: 8,
    },
    resendText: {
        fontSize: 14,
        color: '#1A202C',
        fontFamily: FONTS.regular,
    },
    underline: {
        textDecorationLine: 'underline',
        color: '#94A3B8',
    },
    flexSpacer: {
        flex: 1,
    },
    verifyBtn: {
        width: '100%',
        height: 56,
        backgroundColor: '#0E56D0',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    verifyText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
});
