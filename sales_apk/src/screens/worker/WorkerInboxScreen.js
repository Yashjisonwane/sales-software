import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Image,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SHADOWS, COLORS } from '../../constants/theme';
import { getWorkerChats } from '../../api/apiService';
import { useFocusEffect } from '@react-navigation/native';

export default function WorkerInboxScreen({ navigation }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const filters = ['All', 'Messages', 'Team Chats', 'Updates'];

    const fetchChats = async () => {
        setLoading(true);
        const res = await getWorkerChats();
        if (res.success) {
            setChats(res.data || []);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchChats();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        const res = await getWorkerChats();
        if (res.success) setChats(res.data || []);
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94A3B8" />
                    <TextInput placeholder="Search Conversations" style={styles.searchInput} placeholderTextColor="#94A3B8" />
                </View>
            </View>

            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
                    {filters.map(filter => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setActiveFilter(filter)}
                            style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
                        >
                            <Text style={[styles.filterChipText, activeFilter === filter && styles.activeFilterText]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView 
                style={styles.messagesList} 
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.listCard}>
                    {loading && chats.length === 0 ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#3B82F6" />
                            <Text style={{ marginTop: 10, color: '#64748B' }}>Loading messages...</Text>
                        </View>
                    ) : chats.length === 0 ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Ionicons name="chatbubbles-outline" size={50} color="#CBD5E1" />
                            <Text style={{ marginTop: 10, color: '#64748B', fontWeight: '700' }}>No messages yet</Text>
                            <Text style={{ color: '#94A3B8', fontSize: 12 }}>New job chats will appear here.</Text>
                        </View>
                    ) : (
                        chats.map((chat, index) => (
                            <TouchableOpacity 
                                key={chat.id} 
                                style={styles.messageItem} 
                                onPress={() => navigation.navigate('Chat', { 
                                    chatId: chat.id, 
                                    customerName: chat.customerName,
                                    jobNo: chat.leadId,
                                    serviceType: chat.service
                                })} 
                                activeOpacity={0.7}
                            >
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{chat.customerName?.charAt(0) || 'C'}</Text>
                                </View>
                                <View style={styles.messageTextContent}>
                                    <View style={styles.messageHeaderRow}>
                                        <Text style={styles.senderName}>{chat.customerName}</Text>
                                        <Text style={styles.timeText}>
                                            {chat.time ? new Date(chat.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                        </Text>
                                    </View>
                                    <View style={styles.messageFooterRow}>
                                        <Text style={styles.lastMessage} numberOfLines={2}>
                                            {chat.lastMessage || 'No messages yet'}
                                        </Text>
                                    </View>
                                </View>
                                {index < chats.length - 1 && <View style={styles.itemDivider} />}
                            </TouchableOpacity>
                        ))
                    )}
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#FFFFFF' },
    searchContainer: { 
        height: 50, backgroundColor: '#FFFFFF', borderRadius: 25, 
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, 
        borderWidth: 1, borderColor: '#E2E8F0' 
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#1A202C' },
    filtersContainer: { paddingBottom: 16, backgroundColor: '#FFFFFF' },
    filtersContent: { paddingHorizontal: 16, gap: 10 },
    filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9' },
    activeFilterChip: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
    filterChipText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
    activeFilterText: { color: '#FFFFFF' },
    messagesList: { flex: 1, paddingHorizontal: 12 },
    listCard: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    messageItem: { flexDirection: 'row', paddingVertical: 18, alignItems: 'flex-start' },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
    messageTextContent: { flex: 1, marginLeft: 14 },
    messageHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    senderName: { fontSize: 16, fontWeight: '800', color: '#1A202C' },
    timeText: { fontSize: 11, color: '#94A3B8' },
    messageFooterRow: { flexDirection: 'row' },
    lastMessage: { fontSize: 13, color: '#4A5568', lineHeight: 18, flex: 1 },
    subMessageText: { fontSize: 12, color: '#94A3B8' },
    itemDivider: { position: 'absolute', bottom: 0, left: 58, right: 0, height: 1, backgroundColor: '#F1F5F9' },
});
