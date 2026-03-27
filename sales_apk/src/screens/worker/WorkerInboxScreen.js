import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SHADOWS } from '../../constants/theme';

const MessageItem = ({ initial, name, lastMessage, time, unread, onPress }) => (
    <TouchableOpacity style={styles.messageItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.messageContent}>
            <View style={styles.messageHeader}>
                <Text style={styles.senderName}>{name}</Text>
                <Text style={styles.timeText}>{time}</Text>
            </View>
            <View style={styles.messageFooter}>
                <Text style={[styles.lastMessage, unread && styles.unreadText]} numberOfLines={1}>
                    {lastMessage}
                </Text>
                {unread && <View style={styles.unreadDot} />}
            </View>
        </View>
    </TouchableOpacity>
);

export default function WorkerInboxScreen({ navigation }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'Messages', 'Team Chats', 'Updates'];

    const messages = [
        { initial: 'JM', name: 'Sarah Johnson', lastMessage: 'Hi, what time will the team arrive today?', time: '09:15 AM' },
        { initial: 'JM', name: 'Team Alpha', lastMessage: 'Invoice #INV-1025 is overdue by 3 days.', subMessage: 'Customer payment is still pending. Follow up recommended.', time: '08:13 AM' },
        { initial: 'JM', name: 'Sarah Noah', lastMessage: 'Invoice #INV-1025 is overdue by 3 days.', subMessage: 'Customer payment is still pending. Follow up recommended.', time: '08:13 AM' },
        { initial: 'JM', name: 'Mike Thompson', lastMessage: 'Invoice #INV-1025 is overdue by 3 days.', subMessage: 'Customer payment is still pending. Follow up recommended.', time: '08:13 AM' },
        { initial: 'JM', name: 'John Miller', lastMessage: 'Invoice #INV-1025 is overdue by 3 days.', subMessage: 'Customer payment is still pending. Follow up recommended.', time: '08:13 AM' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94A3B8" />
                    <TextInput placeholder="Search Team Member" style={styles.searchInput} placeholderTextColor="#94A3B8" />
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

            <ScrollView style={styles.messagesList} showsVerticalScrollIndicator={false}>
                <View style={styles.listCard}>
                    {messages.map((msg, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.messageItem} 
                            onPress={() => navigation.navigate('WorkerChat', { name: msg.name })} 
                            activeOpacity={0.7}
                        >
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{msg.initial}</Text>
                            </View>
                            <View style={styles.messageTextContent}>
                                <View style={styles.messageHeaderRow}>
                                    <Text style={styles.senderName}>{msg.name}</Text>
                                    <Text style={styles.timeText}>{msg.time}</Text>
                                </View>
                                <View style={styles.messageFooterRow}>
                                    <Text style={styles.lastMessage} numberOfLines={3}>
                                        {msg.lastMessage}
                                        {msg.subMessage && (
                                            <Text style={styles.subMessageText}>{` \n${msg.subMessage}`}</Text>
                                        )}
                                    </Text>
                                </View>
                            </View>
                            {index < messages.length - 1 && <View style={styles.itemDivider} />}
                        </TouchableOpacity>
                    ))}
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
