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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES } from '../../constants/theme';

const RecentSearchItem = ({ title, sub, icon = 'time-outline', isTealIcon = false }) => (
    <TouchableOpacity style={styles.recentItem} activeOpacity={0.7}>
        <View style={[styles.recentIconBtn, isTealIcon && { backgroundColor: '#008080' }]}>
            <Ionicons name={icon} size={20} color={isTealIcon ? '#fff' : '#718096'} />
        </View>
        <View style={styles.recentTextContent}>
            <Text style={styles.recentTitle}>{title}</Text>
            {sub && <Text style={styles.recentSub}>{sub}</Text>}
        </View>
    </TouchableOpacity>
);

const ShortcutItem = ({ label, sub, icon, color, isCustomIcon = false }) => (
    <TouchableOpacity style={styles.shortcutBtn} activeOpacity={0.7}>
        <View style={[styles.shortcutIconBg, { backgroundColor: isCustomIcon ? '#008080' : `${color}15` }]}>
            <Ionicons name={icon} size={22} color={isCustomIcon ? '#FFF' : color} />
        </View>
        <View style={styles.shortcutTextContent}>
            <Text style={styles.shortcutLabel} numberOfLines={1}>{label}</Text>
            <Text style={styles.shortcutSub} numberOfLines={1}>{sub}</Text>
        </View>
    </TouchableOpacity>
);

export default function AdminSearchScreen({ navigation }) {
    const [search, setSearch] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <View style={styles.searchBarWrapper}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="#4A5568" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Search workers or jobs"
                        placeholderTextColor="#718096"
                        value={search}
                        onChangeText={setSearch}
                        autoFocus
                    />
                    <TouchableOpacity>
                        <Ionicons name="mic" size={22} color="#4A5568" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Shortcuts */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.shortcutsRow}
                >
                    <ShortcutItem
                        label="Office"
                        sub="Main HQ"
                        icon="business"
                        color="#3B82F6"
                    />
                    <ShortcutItem
                        label="Active Jobs"
                        sub="Check status"
                        icon="briefcase"
                        color="#10B981"
                    />
                    <ShortcutItem
                        label="Top Rated"
                        sub="5 workers"
                        icon="star"
                        color="#F59E0B"
                    />
                </ScrollView>

                {/* Recent Searches */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity>
                        <Ionicons name="information-circle-outline" size={20} color="#718096" />
                    </TouchableOpacity>
                </View>

                <RecentSearchItem
                    title="John Carter (Worker)"
                    sub="Plumber • 92% Completion"
                />
                <RecentSearchItem
                    title="Sarah Miller (Job #128)"
                    sub="123 E Market St Boulder"
                />
                <RecentSearchItem
                    title="Roof Repair Project"
                    sub="Due in 2 days"
                />
                <RecentSearchItem
                    title="Elite Plumbings"
                    sub="Top subcontractor"
                    icon="shield-checkmark-outline"
                    isTealIcon={true}
                />
                <RecentSearchItem
                    title="Pending Invoices"
                />
                <RecentSearchItem
                    title="Michael Thompson"
                />

                <View style={{ height: 100 }} />
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                style={styles.keyboardHelper}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
        paddingHorizontal: 16,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        height: 56,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...SHADOWS.small,
    },
    backBtn: {
        paddingRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: '#1A202C',
        fontWeight: '400',
    },
    scrollContent: {
        paddingTop: 5,
    },
    shortcutsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 15,
        marginBottom: 20,
        paddingBottom: 5,
    },
    shortcutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingRight: 15,
        gap: 12,
    },
    shortcutIconBg: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBEAFE',
    },
    shortcutTextContent: {
        maxWidth: 100,
    },
    shortcutLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1A202C',
    },
    shortcutSub: {
        fontSize: 12,
        color: '#718096',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 10,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A202C',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 15,
    },
    recentIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    recentTextContent: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingBottom: 15,
    },
    recentTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4A5568',
    },
    recentSub: {
        fontSize: 13,
        color: '#718096',
        marginTop: 2,
    },
    keyboardHelper: {
        backgroundColor: '#FFFFFF',
    }
});
