import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

const WorkTypeOption = ({ title, tag, tagColor, tagBg, desc, points, selected, onPress, footer }) => (
    <TouchableOpacity
        style={[styles.optionCard, selected && styles.selectedCard]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={styles.optionHeader}>
            <View style={[styles.radioButton, selected && styles.radioActive]}>
                {selected && <View style={styles.radioInner} />}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.titleRow}>
                    <Text style={styles.optionTitle}>{title}</Text>
                    <View style={[styles.tag, { backgroundColor: tagBg }]}>
                        <Text style={[styles.tagText, { color: tagColor }]}>{tag}</Text>
                    </View>
                </View>
            </View>
        </View>

        <Text style={styles.optionDesc}>{desc}</Text>

        <View style={styles.pointsList}>
            {points.map((point, index) => (
                <View key={index} style={styles.pointRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.pointText}>{point}</Text>
                </View>
            ))}
        </View>

        <View style={styles.optionFooter}>
            <Text style={styles.footerLabel}>Best for:</Text>
            <Text style={styles.footerText}>{footer}</Text>
        </View>
    </TouchableOpacity>
);

export default function WorkerWorkTypeScreen({ navigation }) {
    const [selectedType, setSelectedType] = useState('lead');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.headlineRow}>
                    <Text style={styles.headline}>Welcome to</Text>
                    <Image 
                        source={require('../../../assets/hinesq.png')} 
                        style={styles.headerLogo} 
                        resizeMode="contain" 
                    />
                </View>
                <Text style={styles.subheadline}>Choose how you want to receive and manage work.</Text>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Our platform connects homeowners with skilled professionals. You can receive work in two different ways. Select the option that fits your business.
                    </Text>
                </View>

                <WorkTypeOption
                    title="Lead Access"
                    tag="Pay per lead"
                    tagBg="#F0E9FF"
                    tagColor="#7C3AED"
                    desc="Pay for homeowner leads and manage the job independently."
                    points={[
                        "Homeowner submits a request",
                        "Pay to unlock contact details",
                        "You manage pricing & payment",
                        "No job guarantee"
                    ]}
                    footer="Independent contractors who want full control."
                    selected={selectedType === 'lead'}
                    onPress={() => setSelectedType('lead')}
                />

                <WorkTypeOption
                    title="Subcontract Work"
                    tag="Guaranteed jobs"
                    tagBg="#E1FAF2"
                    tagColor="#05B881"
                    desc="Get assigned confirmed jobs and get paid through the platform."
                    points={[
                        "Homeowner pays upfront",
                        "Jobs assigned to you",
                        "Platform handles billing",
                        "Guaranteed payout"
                    ]}
                    footer="Workers who want predictable, guaranteed work."
                    selected={selectedType === 'subcontract'}
                    onPress={() => setSelectedType('subcontract')}
                />
            </ScrollView>

            <View style={styles.footerBtnContainer}>
                <TouchableOpacity
                    style={styles.continueBtn}
                    onPress={() => navigation.navigate('WorkerSignup')}
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
    scrollContent: {
        padding: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    headline: {
        fontSize: 28,
        fontFamily: FONTS.bold,
        color: '#000000',
    },
    headlineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerLogo: {
        width: 130,
        height: 32,
        marginLeft: 8,
        marginTop: 2,
    },
    subheadline: {
        fontSize: 18,
        fontFamily: FONTS.regular,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 24,
    },
    infoBox: {
        backgroundColor: '#F9FAFB',
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
    },
    infoText: {
        fontSize: 16,
        fontFamily: FONTS.regular,
        color: '#4B5563',
        lineHeight: 24,
    },
    optionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
    },
    selectedCard: {
        borderColor: '#0E56D0',
        backgroundColor: '#FFFFFF',
    },
    optionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    radioActive: {
        borderColor: '#0E56D0',
        borderWidth: 1.5,
    },
    radioInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#0E56D0',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionTitle: {
        fontSize: 20,
        fontFamily: FONTS.bold,
        color: '#111827',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: '#7C3AED',
    },
    optionDesc: {
        fontSize: 15,
        fontFamily: FONTS.regular,
        color: '#6B7280',
        marginBottom: 20,
        lineHeight: 22,
    },
    pointsList: {
        marginBottom: 24,
    },
    pointRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3B82F6',
        marginRight: 12,
    },
    pointText: {
        fontSize: 15,
        fontFamily: FONTS.medium,
        color: '#374151',
    },
    optionFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 20,
        marginTop: 4,
    },
    footerLabel: {
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    footerText: {
        fontSize: 15,
        fontFamily: FONTS.medium,
        color: '#1F2937',
        lineHeight: 20,
    },
    footerBtnContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 15,
        backgroundColor: '#FFFFFF',
    },
    continueBtn: {
        height: 60,
        backgroundColor: '#0E56D0',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: FONTS.bold,
    },
});
