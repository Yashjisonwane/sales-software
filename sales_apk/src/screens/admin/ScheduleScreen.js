import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AgendaItem = ({ name, type, time, color, status }) => (
    <View style={styles.agendaItem}>
        <View style={styles.agendaTimeline}>
            <View style={[styles.agendaDot, { borderColor: color, backgroundColor: status === 'active' ? color : COLORS.white }]} />
            <View style={styles.agendaLine} />
        </View>
        <View style={styles.agendaContent}>
            <View style={[styles.agendaCard, status === 'active' && styles.activeAgendaCard]}>
                <Text style={styles.agendaName}>{name}</Text>
                <Text style={styles.agendaType}>{type}</Text>
                <View style={styles.agendaInfo}>
                    <Ionicons name="time-outline" size={16} color={COLORS.textTertiary} />
                    <Text style={styles.agendaInfoText}>{time}</Text>
                </View>
                <View style={styles.agendaInfo}>
                    <Ionicons name="location-outline" size={16} color={COLORS.textTertiary} />
                    <Text style={styles.agendaInfoText}>123 E Market St Boulder, CO 80304, USA</Text>
                </View>
                <View style={styles.agendaButtons}>
                    <TouchableOpacity style={styles.rescheduleBtn}>
                        <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.detailsBtn}>
                        <Text style={styles.detailsBtnText}>Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
);

export default function ScheduleScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Schedule</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Today's Agenda</Text>

                <View style={{ marginTop: 20 }}>
                    <AgendaItem name="Sarah Miller" type="Pre-Inspection" time="09:00 AM" color="#0062E1" status="active" />
                    <AgendaItem name="The Johnson Family" type="HVAC Repair" time="11:30 AM" color="#E2E8F0" status="pending" />
                    <AgendaItem name="John Smith" type="Quote Follow-Up" time="02:30 PM" color="#E2E8F0" status="pending" />
                    <AgendaItem name="Acme Corp" type="Contract Signing" time="04:30 PM" color="#E2E8F0" status="pending" />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        paddingBottom: 16, paddingHorizontal: 16,
        backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

    scrollContent: { padding: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },

    agendaItem: { flexDirection: 'row' },
    agendaTimeline: { alignItems: 'center', width: 24, marginRight: 12 },
    agendaDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 4, zIndex: 1, marginTop: 4 },
    agendaLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginTop: -4 },
    agendaContent: { flex: 1, paddingBottom: 24 },
    agendaCard: {
        backgroundColor: COLORS.white, borderRadius: 20, padding: 20,
        borderWidth: 1, borderColor: '#F1F5F9', ...SHADOWS.small,
    },
    activeAgendaCard: { backgroundColor: '#EEF2FF', borderColor: '#0062E1' },
    agendaName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
    agendaType: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 },
    agendaInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    agendaInfoText: { fontSize: 14, color: COLORS.textSecondary },
    agendaButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
    rescheduleBtn: {
        flex: 1, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#1E293B',
        alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white,
    },
    rescheduleBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
    detailsBtn: {
        flex: 1, height: 44, borderRadius: 22, backgroundColor: '#0062E1',
        alignItems: 'center', justifyContent: 'center',
    },
    detailsBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.white },
});
