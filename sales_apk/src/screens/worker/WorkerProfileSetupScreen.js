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
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SHADOWS, FONTS } from '../../constants/theme';

const InputField = ({ label, placeholder, value, onChangeText, fieldIcon, isDropdown = false, isHalf = false }) => (
    <View style={[styles.inputWrapper, isHalf && { flex: 1 }]}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#A0AEC0"
                value={value}
                onChangeText={onChangeText}
                editable={!isDropdown}
            />
            {fieldIcon && (
                <Ionicons name={fieldIcon} size={20} color="#1A202C" style={styles.fieldIcon} />
            )}
            {isDropdown && (
                <Ionicons name="chevron-down" size={20} color="#000000" style={styles.dropdownIcon} />
            )}
        </View>
    </View>
);

export default function WorkerProfileSetupScreen({ navigation }) {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        profession: '',
        area: '',
    });

    const { height } = Dimensions.get('window');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.topNav}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000000" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.headerIconContainer}>
                        <View style={styles.headerIconBg}>
                            <Ionicons name="person-circle-outline" size={48} color="#0E56D0" />
                        </View>
                    </View>

                    <Text style={styles.headline}>Set Up Your Profile</Text>
                    <Text style={styles.subheadline}>This information needs to be accurate.</Text>

                    <View style={styles.formContainer}>
                        <View style={styles.row}>
                            <InputField
                                label="First Name"
                                placeholder="First Name"
                                isHalf
                                value={profile.firstName}
                                onChangeText={(txt) => setProfile({ ...profile, firstName: txt })}
                            />
                            <View style={{ width: 16 }} />
                            <InputField
                                label="Last Name"
                                placeholder="Last Name"
                                isHalf
                                value={profile.lastName}
                                onChangeText={(txt) => setProfile({ ...profile, lastName: txt })}
                            />
                        </View>

                        <InputField
                            label="Email"
                            placeholder="Enter Your Email"
                            value={profile.email}
                            onChangeText={(txt) => setProfile({ ...profile, email: txt })}
                        />

                        <InputField
                            label="Phone Number"
                            placeholder="Phone Number"
                            value={profile.phone}
                            onChangeText={(txt) => setProfile({ ...profile, phone: txt })}
                        />

                        <TouchableOpacity activeOpacity={0.7} onPress={() => { }}>
                            <InputField
                                label="Role"
                                placeholder="Select Your Role"
                                isDropdown
                                value={profile.role}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.7} onPress={() => { }}>
                            <InputField
                                label="Profession"
                                placeholder="Select Your Profession"
                                isDropdown
                                value={profile.profession}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.7} onPress={() => { }}>
                            <InputField
                                label="Working Area"
                                placeholder="Select Location"
                                fieldIcon="location-outline"
                                value={profile.area}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.continueBtn}
                        onPress={() => navigation.navigate('WorkerPaymentSetup')}
                    >
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingTop: Platform.OS === 'ios' ? 10 : 40,
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
        fontFamily: FONTS.bold,
        color: '#000000',
        marginBottom: 8,
    },
    subheadline: {
        fontSize: 16,
        fontFamily: FONTS.regular,
        color: '#64748B',
        marginBottom: 32,
    },
    formContainer: {
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 15,
        fontFamily: FONTS.semiBold,
        color: '#1A202C',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        height: 52,
        paddingHorizontal: 20,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: FONTS.regular,
        color: '#1A202C',
    },
    fieldIcon: {
        marginLeft: 10,
    },
    dropdownIcon: {
        marginLeft: 10,
    },
    continueBtn: {
        width: '100%',
        height: 56,
        backgroundColor: '#0E56D0',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
});
