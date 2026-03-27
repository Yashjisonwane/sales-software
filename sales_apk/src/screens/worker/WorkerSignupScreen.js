import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ScrollView,
    Image,
    Platform,
    KeyboardAvoidingView,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

const InputField = ({ label, placeholder, secureTextEntry, value, onChangeText, showEye }) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#A0AEC0"
                    secureTextEntry={isSecure}
                    value={value}
                    onChangeText={onChangeText}
                />
                {showEye && (
                    <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
                        <Ionicons name={isSecure ? "eye-off-outline" : "eye-outline"} size={20} color="#1A202C" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default function WorkerSignupScreen({ navigation }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { height } = Dimensions.get('window');
    const isSmallScreen = height < 700;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.content}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#1A202C" />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.headline}>Sign up</Text>
                        <Text style={styles.subheadline}>Sign up to get all home services</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.nameRow}>
                            <View style={{ flex: 1 }}>
                                <InputField
                                    label="First Name"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChangeText={(txt) => setFormData({ ...formData, firstName: txt })}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <InputField
                                    label="Last Name"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChangeText={(txt) => setFormData({ ...formData, lastName: txt })}
                                />
                            </View>
                        </View>

                        <InputField
                            label="Email"
                            placeholder="Enter Your Email"
                            value={formData.email}
                            onChangeText={(txt) => setFormData({ ...formData, email: txt })}
                        />

                        <InputField
                            label="Password"
                            placeholder="Password"
                            secureTextEntry
                            showEye
                            value={formData.password}
                            onChangeText={(txt) => setFormData({ ...formData, password: txt })}
                        />

                        <InputField
                            label="Confirm Password"
                            placeholder="Confirm Password"
                            secureTextEntry
                            showEye
                            value={formData.confirmPassword}
                            onChangeText={(txt) => setFormData({ ...formData, confirmPassword: txt })}
                        />

                        <TouchableOpacity
                            style={styles.signupBtn}
                            onPress={() => navigation.navigate('WorkerVerify')}
                        >
                            <Text style={styles.signupText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.divider} />
                        </View>

                        <TouchableOpacity style={styles.socialBtn}>
                            <Ionicons name="logo-google" size={20} color="#EA4335" />
                            <Text style={styles.socialBtnText}>Continue with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialBtn}>
                            <Ionicons name="logo-apple" size={20} color="#1A202C" />
                            <Text style={styles.socialBtnText}>Continue with Apple</Text>
                        </TouchableOpacity>

                        <View style={styles.loginRow}>
                            <Text style={styles.loginHint}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 10 : 20,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 10 : 40,
        marginLeft: -10,
    },
    header: {
        marginBottom: Dimensions.get('window').height < 700 ? 10 : 20,
    },
    headline: {
        fontSize: 32,
        fontFamily: FONTS.bold,
        color: '#1A202C',
    },
    subheadline: {
        fontSize: 16,
        fontFamily: FONTS.regular,
        color: '#718096',
        marginTop: 4,
    },
    form: {
        flex: 1.2,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        gap: 16,
    },
    inputWrapper: {
        marginBottom: Dimensions.get('window').height < 700 ? 10 : 15,
    },
    label: {
        fontSize: 14,
        fontFamily: FONTS.bold,
        color: '#2D3748',
        marginBottom: 4,
    },
    inputContainer: {
        height: Dimensions.get('window').height < 700 ? 48 : 54,
        backgroundColor: '#F7FAFC',
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: FONTS.regular,
        color: '#1A202C',
    },
    signupBtn: {
        height: Dimensions.get('window').height < 700 ? 48 : 56,
        backgroundColor: '#0E56D0',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        ...SHADOWS.medium,
    },
    signupText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    footer: {
        flex: 0.8,
        justifyContent: 'flex-end',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Dimensions.get('window').height < 700 ? 15 : 25,
        gap: 12,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        fontSize: 14,
        color: '#718096',
        fontFamily: FONTS.semiBold,
    },
    socialBtn: {
        height: Dimensions.get('window').height < 700 ? 48 : 56,
        backgroundColor: '#F7FAFC',
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 12,
    },
    socialBtnText: {
        fontSize: 15,
        color: '#1A202C',
        fontFamily: FONTS.semiBold,
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height < 700 ? 10 : 15,
        marginBottom: 10,
    },
    loginHint: {
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: '#4A5568',
    },
    loginLink: {
        fontSize: 14,
        color: '#0E56D0',
        fontFamily: FONTS.bold,
    },
});
