import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';
import { registerWithInvite } from '../../api/apiService';
import storage from '../../api/storage';

export default function WorkerSignupScreen({ navigation }) {
    const [step, setStep] = useState('invite'); // 'invite' or 'profile'
    const [inviteCode, setInviteCode] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyInvite = () => {
        if (inviteCode.length !== 6) {
            Alert.alert('Invalid Code', 'Please enter a valid 6-digit invitation code.');
            return;
        }
        setStep('profile');
    };

    const handleSignup = async () => {
        if (!formData.name || !formData.phone || !formData.password) {
            Alert.alert('Missing Fields', 'Please fill in all profile details.');
            return;
        }

        setIsLoading(true);
        const res = await registerWithInvite({
            token: inviteCode,
            ...formData
        });
        setIsLoading(false);

        if (res.success) {
            await storage.setItem('userToken', res.data.token);
            await storage.setItem('userInfo', JSON.stringify(res.data.user));
            Alert.alert('Success', 'Welcome to the team! Your account is ready.', [
                { text: 'Start Working', onPress: () => navigation.replace('WorkerTabs') }
            ]);
        } else {
            Alert.alert('Registration Failed', res.message || 'Could not complete registration.');
        }
    };

    const renderInviteStep = () => (
        <View style={styles.form}>
            <View style={styles.header}>
                <Text style={styles.headline}>Access Invited</Text>
                <Text style={styles.subheadline}>Enter the 6-digit invitation code sent to you by the admin.</Text>
            </View>

            <View style={styles.inviteContainer}>
                <TextInput
                    style={styles.inviteInput}
                    placeholder="000000"
                    placeholderTextColor="#CBD5E0"
                    maxLength={6}
                    keyboardType="number-pad"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                />
            </View>

            <TouchableOpacity 
                style={[styles.primaryBtn, inviteCode.length !== 6 && styles.disabledBtn]} 
                onPress={handleVerifyInvite}
                disabled={inviteCode.length !== 6}
            >
                <Text style={styles.primaryBtnText}>Verify Invitation</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Need an invite? </Text>
                <TouchableOpacity onPress={() => Alert.alert('How to join', 'Please contact your supervisor or reach out to admin@salesapp.com to request access.')}>
                    <Text style={styles.footerLink}>Contact Admin</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderProfileStep = () => (
        <View style={styles.form}>
            <View style={styles.header}>
                <Text style={styles.headline}>Complete Profile</Text>
                <Text style={styles.subheadline}>You're almost there! Set up your credentials to get access.</Text>
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChangeText={(txt) => setFormData({ ...formData, name: txt })}
                />
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(txt) => setFormData({ ...formData, phone: txt })}
                />
            </View>

            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Create Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="At least 8 characters"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(txt) => setFormData({ ...formData, password: txt })}
                />
            </View>

            <TouchableOpacity 
                style={styles.primaryBtn} 
                onPress={handleSignup}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.primaryBtnText}>Create Account</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.textBtn} onPress={() => setStep('invite')}>
                <Text style={styles.textBtnText}>Change Invite Code</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#1A202C" />
                    </TouchableOpacity>

                    {step === 'invite' ? renderInviteStep() : renderProfileStep()}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scrollContent: { padding: 24, flexGrow: 1 },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F7FAFC', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    
    header: { marginBottom: 32 },
    headline: { fontSize: 28, fontWeight: '800', color: '#1A202C' },
    subheadline: { fontSize: 16, color: '#718096', marginTop: 8, lineHeight: 24 },

    form: { flex: 1 },
    inviteContainer: { marginBottom: 24 },
    inviteInput: { fontSize: 40, fontWeight: '800', color: '#0062E1', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 20, letterSpacing: 8 },

    inputWrapper: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '700', color: '#4A5568', marginBottom: 8 },
    input: { height: 50, backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 16, fontSize: 15, color: '#1A202C', borderWidth: 1, borderColor: '#E2E8F0' },

    primaryBtn: { height: 52, backgroundColor: '#0062E1', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 10, ...SHADOWS.medium },
    disabledBtn: { backgroundColor: '#E2E8F0' },
    primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

    textBtn: { padding: 16, alignItems: 'center' },
    textBtnText: { fontSize: 14, color: '#0062E1', fontWeight: '600' },

    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { color: '#718096' },
    footerLink: { color: '#0062E1', fontWeight: '700' },
});
