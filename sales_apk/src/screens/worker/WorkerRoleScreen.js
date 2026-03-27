import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, SimpleLineIcons, Entypo } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

const RoleOption = ({ title, subtitle, icon, iconType, selected, onPress }) => {
    const renderIcon = () => {
        if (iconType === 'MaterialCommunityIcons') {
            return <MaterialCommunityIcons name={icon} size={24} color="#0E56D0" />;
        } else if (iconType === 'FontAwesome5') {
            return <FontAwesome5 name={icon} size={20} color="#0E56D0" />;
        } else if (iconType === 'SimpleLineIcons') {
            return <SimpleLineIcons name={icon} size={22} color="#0E56D0" />;
        } else if (iconType === 'Entypo') {
            return <Entypo name={icon} size={24} color="#0E56D0" />;
        }
        return <Ionicons name={icon} size={24} color="#0E56D0" />;
    };

    return (
        <TouchableOpacity
            style={[styles.roleCard, selected && styles.selectedRoleCard]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.roleIconBg}>
                {renderIcon()}
            </View>
            <View style={styles.roleTextContainer}>
                <Text style={styles.roleTitle}>{title}</Text>
                <Text style={styles.roleSubtitle}>{subtitle}</Text>
            </View>
            <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <View style={styles.radioDot} />}
            </View>
        </TouchableOpacity>
    );
};

export default function WorkerRoleScreen({ navigation }) {
    const [selectedRole, setSelectedRole] = useState('Technician');

    const roles = [
        {
            id: 'Technician',
            title: 'Technician',
            subtitle: 'Electrical, AC appliance repairs',
            icon: 'wrench',
            iconType: 'SimpleLineIcons'
        },
        {
            id: 'Cleaner',
            title: 'Cleaner',
            subtitle: 'Home and office cleaning services',
            icon: 'sparkles-outline',
            iconType: 'Ionicons'
        },
        {
            id: 'Plumber',
            title: 'Plumber',
            subtitle: 'Pipe fixing, leaks, water issues',
            icon: 'water',
            iconType: 'Entypo'
        },
        {
            id: 'Painter',
            title: 'Painter',
            subtitle: 'Interior and exterior painting jobs',
            icon: 'paint-roller',
            iconType: 'FontAwesome5'
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.topNav}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000000" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.headerIconContainer}>
                    <View style={styles.headerIconBg}>
                        <Ionicons name="person-outline" size={42} color="#0E56D0" />
                    </View>
                </View>

                <Text style={styles.headline}>Select your role</Text>
                <Text style={styles.subheadline}>Choose the type of work you provide</Text>

                <View style={styles.rolesList}>
                    {roles.map((item) => (
                        <RoleOption
                            key={item.id}
                            title={item.title}
                            subtitle={item.subtitle}
                            icon={item.icon}
                            iconType={item.iconType}
                            selected={selectedRole === item.id}
                            onPress={() => setSelectedRole(item.id)}
                        />
                    ))}
                </View>

                <View style={styles.flexSpacer} />

                <TouchableOpacity
                    style={styles.continueBtn}
                    onPress={() => navigation.navigate('WorkerProfileSetup')}
                >
                    <Text style={styles.continueText}>Continue</Text>
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'flex-start',
    },
    headerIconContainer: {
        marginTop: 30,
        marginBottom: 24,
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
    rolesList: {
        width: '100%',
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    selectedRoleCard: {
        borderColor: '#0E56D0',
        backgroundColor: '#FFFFFF',
    },
    roleIconBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    roleTextContainer: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 16,
        fontFamily: FONTS.bold,
        color: '#111827',
        marginBottom: 2,
    },
    roleSubtitle: {
        fontSize: 13,
        fontFamily: FONTS.regular,
        color: '#6B7280',
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
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
    flexSpacer: {
        flex: 1,
    },
    continueBtn: {
        width: '100%',
        height: 56,
        backgroundColor: '#0E56D0',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
});
