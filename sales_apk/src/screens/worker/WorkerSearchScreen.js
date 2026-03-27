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

export default function WorkerSearchScreen({ navigation }) {
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
                        placeholder="Search here"
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
                        label="Home"
                        sub="C/del Comt..."
                        icon="home"
                        color="#3B82F6"
                    />
                    <ShortcutItem
                        label="Work"
                        sub="Set Location"
                        icon="briefcase"
                        color="#3B82F6"
                    />
                    <ShortcutItem
                        label="Thessaloni"
                        sub="8 places"
                        icon="list"
                        color="#008080"
                        isCustomIcon={true}
                    />
                </ScrollView>

                {/* Recent Searches */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent</Text>
                    <TouchableOpacity>
                        <Ionicons name="information-circle-outline" size={20} color="#718096" />
                    </TouchableOpacity>
                </View>

                <RecentSearchItem
                    title="Alistair Hughes"
                    sub="Torsgatan 4, 33001 Greece"
                />
                <RecentSearchItem
                    title="Sarah Miller"
                />
                <RecentSearchItem
                    title="The Johnson's Family"
                />
                <RecentSearchItem
                    title="Gyros House"
                    sub="Saved in Thessaloniki"
                    icon="list-outline"
                    isTealIcon={true}
                />
                <RecentSearchItem
                    title="Grocery Store"
                />
                <RecentSearchItem
                    title="Coffee Shop"
                />

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Keyboard Helper (Simplified mockup of the keyboard shown in screenshot) */}
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
