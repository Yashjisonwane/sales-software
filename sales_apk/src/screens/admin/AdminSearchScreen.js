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

import { getAvailableLeads, getAllJobs, getProfessionals } from '../../api/apiService';

export default function AdminSearchScreen({ navigation }) {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState({ leads: [], jobs: [], workers: [] });
    const [loading, setLoading] = useState(false);

    const performSearch = async (query) => {
        if (!query || query.length < 2) {
            setResults({ leads: [], jobs: [], workers: [] });
            return;
        }
        setLoading(true);
        try {
            const [leadsRes, jobsRes, workersRes] = await Promise.all([
                getAvailableLeads(),
                getAllJobs(),
                getProfessionals()
            ]);

            const filterFn = (item, fields) => 
                fields.some(f => (item[f] || '').toLowerCase().includes(query.toLowerCase()));

            setResults({
                leads: leadsRes.success ? leadsRes.data.filter(l => filterFn(l, ['clientName', 'categoryName'])) : [],
                jobs: jobsRes.success ? jobsRes.data.filter(j => filterFn(j, ['customerName', 'categoryName', 'location'])) : [],
                workers: workersRes.success ? workersRes.data.filter(w => filterFn(w, ['name', 'profession'])) : []
            });
        } catch (e) {
            console.log('Search error:', e);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            performSearch(search);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const hasResults = results.leads.length > 0 || results.jobs.length > 0 || results.workers.length > 0;

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
                        placeholder="Search workers, jobs or leads"
                        placeholderTextColor="#718096"
                        value={search}
                        onChangeText={setSearch}
                        autoFocus
                    />
                    {loading ? <ActivityIndicator size="small" color="#0E56D0" /> : (
                        <TouchableOpacity>
                            <Ionicons name="mic" size={22} color="#4A5568" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {search.length < 2 ? (
                    <>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shortcutsRow}>
                            <ShortcutItem label="Office" sub="Main HQ" icon="business" color="#3B82F6" />
                            <ShortcutItem label="Active Jobs" sub="Check status" icon="briefcase" color="#10B981" />
                            <ShortcutItem label="Top Rated" sub="5 workers" icon="star" color="#F59E0B" />
                        </ScrollView>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Context</Text>
                        </View>
                        <Text style={{ marginHorizontal: 16, color: '#A0AEC0' }}>Start typing to search across your business database...</Text>
                    </>
                ) : (
                    <>
                        {results.workers.length > 0 && (
                            <View>
                                <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Workers</Text></View>
                                {results.workers.map(w => (
                                    <TouchableOpacity key={w.id} onPress={() => navigation.navigate('WorkerProfile', { worker: w })}>
                                        <RecentSearchItem title={w.name} sub={`${w.profession || 'Worker'} • ${w.isAvailable ? 'Available' : 'Busy'}`} icon="person-outline" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {results.jobs.length > 0 && (
                            <View>
                                <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Active Jobs</Text></View>
                                {results.jobs.map(j => (
                                    <TouchableOpacity key={j.id} onPress={() => navigation.navigate('AdminJobs', { job: j })}>
                                        <RecentSearchItem title={j.customerName} sub={j.location} icon="briefcase-outline" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {results.leads.length > 0 && (
                            <View>
                                <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>New Leads</Text></View>
                                {results.leads.map(l => (
                                    <TouchableOpacity key={l.id} onPress={() => navigation.navigate('LeadDetails', { job: l })}>
                                        <RecentSearchItem title={l.clientName} sub={l.categoryName} icon="flash-outline" isTealIcon={true} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {!hasResults && !loading && (
                            <View style={{ alignItems: 'center', marginTop: 40 }}>
                                <Ionicons name="search-outline" size={48} color="#CBD5E0" />
                                <Text style={{ marginTop: 16, color: '#718096' }}>No results found for "{search}"</Text>
                            </View>
                        )}
                    </>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={styles.keyboardHelper} />
        </SafeAreaView>
    );
}

import { ActivityIndicator } from 'react-native';

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
