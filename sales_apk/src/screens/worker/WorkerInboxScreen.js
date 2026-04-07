import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { getJobChats } from '../../api/apiService';

function formatListTime(iso) {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
}

function initials(name) {
    if (!name || typeof name !== 'string') return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

export default function WorkerInboxScreen({ navigation }) {
    const tabBarHeight = useBottomTabBarHeight();
    const [search, setSearch] = useState('');
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        const res = await getJobChats();
        if (res.success && Array.isArray(res.data)) {
            setThreads(res.data);
        } else {
            setThreads([]);
        }
        setLoading(false);
        setRefreshing(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            load();
        }, [load])
    );

    const onRefresh = () => {
        setRefreshing(true);
        load();
    };

    const q = search.trim().toLowerCase();
    const filtered = threads.filter((t) => {
        if (!q) return true;
        const hay = `${t.customerName || ''} ${t.lastMessage || ''} ${t.service || ''} ${t.leadId || ''}`.toLowerCase();
        return hay.includes(q);
    });

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.titleBlock}>
                <Text style={styles.screenTitle}>Messages</Text>
                <Text style={styles.screenSub}>
                    Job chats in one list. Open a thread for full history. Bottom tabs stay visible so you can switch quickly.
                </Text>
            </View>

            <View style={styles.searchWrap}>
                <Ionicons name="search-outline" size={20} color="#94A3B8" />
                <TextInput
                    placeholder="Search by customer or job"
                    style={styles.searchInput}
                    placeholderTextColor="#94A3B8"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#0062E1" />
                </View>
            ) : (
                <ScrollView
                    style={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
                >
                    {filtered.length === 0 ? (
                        <Text style={styles.emptyText}>
                            No conversations yet. Threads appear when customers message on jobs assigned to you.
                        </Text>
                    ) : (
                        filtered.map((msg, index) => (
                            <TouchableOpacity
                                key={msg.id}
                                style={[styles.row, index > 0 && styles.rowBorder]}
                                onPress={() =>
                                    navigation.navigate('JobChat', {
                                        chatId: msg.id,
                                        title: msg.customerName || 'Customer',
                                        subtitle: [msg.service, msg.leadId && msg.leadId !== 'N/A' ? `#${msg.leadId}` : null]
                                            .filter(Boolean)
                                            .join(' · '),
                                    })
                                }
                                activeOpacity={0.7}
                            >
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{initials(msg.customerName)}</Text>
                                </View>
                                <View style={styles.rowBody}>
                                    <View style={styles.rowTop}>
                                        <Text style={styles.name} numberOfLines={1}>
                                            {msg.customerName || 'Customer'}
                                        </Text>
                                        <Text style={styles.time}>{formatListTime(msg.time)}</Text>
                                    </View>
                                    <Text style={styles.preview} numberOfLines={2}>
                                        {msg.lastMessage || 'No messages yet'}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    titleBlock: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
    screenTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
    screenSub: { fontSize: 13, color: '#64748B', marginTop: 6, lineHeight: 18 },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
        height: 46,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#0F172A' },
    messagesList: { flex: 1, paddingHorizontal: 16 },
    emptyText: { padding: 28, fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        borderRadius: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    rowBorder: {},
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0062E1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
    rowBody: { flex: 1, marginLeft: 12, marginRight: 8 },
    rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    name: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1, marginRight: 8 },
    time: { fontSize: 11, color: '#94A3B8' },
    preview: { fontSize: 13, color: '#64748B', lineHeight: 18 },
});
