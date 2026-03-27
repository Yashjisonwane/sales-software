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
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MessageItem = ({ initial, name, lastMessage, subMessage, time, onPress }) => (
    <TouchableOpacity style={styles.messageItem} onPress={onPress}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View>
        <View style={styles.messageOuterContent}>
            <View style={styles.messageHeader}>
                <Text style={styles.senderName}>{name}</Text>
                <Text style={styles.timeText}>{time}</Text>
            </View>
            <View style={styles.messageFooter}>
                <Text style={styles.lastMessage} numberOfLines={3}>
                    {lastMessage}
                    {subMessage && (
                        <Text style={styles.subMessageText}>{` \n${subMessage}`}</Text>
                    )}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

export default function InboxScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'Messages', 'Team Chats', 'Updates'];

    const messages = [
        { initial: 'JM', name: 'Sarah Johnson', lastMessage: 'Hi, what time will the team arrive today?', time: '09:15 AM' },
        { initial: 'JM', name: 'Team Alpha', lastMessage: 'Invoice #INV-1025 is overdue by 3 days.', subMessage: 'Customer payment is still pending. Follow up recommended.', time: '08:13 AM' },
        { initial: 'JM', name: 'Sarah Noah', lastMessage: 'Invoice #INV-1025 is overdue by 3 days.', subMessage: 'Customer payment is still pending. Follow up recommended.', time: '08:13 AM' },
        { initial: 'JM', name: 'Mike Thompson', lastMessage: 'Invoice #INV-1025 is overdue by 3 days.', subMessage: 'Customer payment is still pending. Follow up recommended.', time: '08:13 AM' },
        { initial: 'JM', name: 'John Miller', lastMessage: 'Invoice #INV-1025 is overdue by 3 days.', subMessage: 'Customer payment is still pending. Follow up recommended.', time: '08:13 AM' },
        { initial: 'JM', name: 'Emma Davis', lastMessage: 'Invoice #INV-1025 is overdue by 3 days.', subMessage: 'Customer payment is still pending. Follow up recommended.', time: '08:13 AM' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.textTertiary} />
                    <TextInput placeholder="Search..." style={styles.searchInput} />
                </View>
                <TouchableOpacity style={styles.teamBtn}>
                    <Ionicons name="people" size={20} color={COLORS.white} />
                    <Text style={styles.teamBtnText}>Team</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
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
                        <React.Fragment key={index}>
                            <MessageItem
                                {...msg}
                                onPress={() => navigation.navigate('AdminChat', { name: msg.name })}
                            />
                            {index < messages.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        paddingBottom: 16, paddingHorizontal: 16,
        backgroundColor: COLORS.white, flexDirection: 'row', gap: 12, alignItems: 'center',
    },
    searchContainer: {
        flex: 1, height: 50, backgroundColor: COLORS.white, borderRadius: 25,
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
        borderWidth: 1, borderColor: '#E2E8F0', ...SHADOWS.small,
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: COLORS.textPrimary },
    teamBtn: {
        height: 50, backgroundColor: '#1E293B', borderRadius: 25,
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8,
    },
    teamBtnText: { color: COLORS.white, fontWeight: '600' },

    filtersContainer: { paddingVertical: 16, backgroundColor: COLORS.white },
    filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#F1F5F9' },
    activeFilterChip: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
    filterChipText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
    activeFilterText: { color: COLORS.white },

    messagesList: { flex: 1, paddingHorizontal: 16 },
    listCard: { backgroundColor: COLORS.white, borderRadius: 16, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    messageItem: { flexDirection: 'row', paddingVertical: 18, gap: 14, alignItems: 'flex-start' },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
    messageOuterContent: { flex: 1 },
    messageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    senderName: { fontSize: 16, fontWeight: '800', color: '#1A202C' },
    timeText: { fontSize: 11, color: '#94A3B8' },
    messageFooter: { flexDirection: 'row' },
    lastMessage: { fontSize: 13, color: '#4A5568', lineHeight: 18 },
    subMessageText: { color: '#94A3B8', fontSize: 12 },
    divider: { height: 1, backgroundColor: '#F1F5F9' },
});
