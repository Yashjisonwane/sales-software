import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    Dimensions,
    Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateProfessional } from '../../api/apiService';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

const MetricCard = ({ label, value, change, color }) => (
    <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
        {change && (
            <Text style={[styles.metricChange, { color: change.includes('+') ? '#10B981' : '#EF4444' }]}>
                {change} <Text style={{ color: '#718096', fontWeight: '400' }}>this month</Text>
            </Text>
        )}
    </View>
);

export default function WorkerProfileScreen({ navigation, route }) {
    const insets = useSafeAreaInsets();
    const worker = route.params?.worker || { 
        name: route.params?.name || 'Worker Profile', 
        role: 'Subcontractor',
        profession: 'Professional',
        createdAt: new Date().toISOString()
    };

    const initials = worker.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'WP';

    const handleEditEarnings = () => {
        Alert.prompt(
            "Edit Earnings Split",
            "Enter Admin Commission (e.g., 15 for 15%). Worker share will be 85%.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Update", 
                    onPress: async (val) => {
                        const adminPart = parseInt(val);
                        if(isNaN(adminPart) || adminPart < 0 || adminPart > 100) {
                            Alert.alert("Error", "Please enter a valid number between 0 and 100.");
                            return;
                        }
                        const res = await updateProfessional(worker.id, { 
                            adminCommission: adminPart, 
                            workerCommission: 100 - adminPart 
                        });
                        if(res.success) {
                            Alert.alert("Success", "Earnings agreement updated successfully!");
                        } else {
                            Alert.alert("Error", "Failed to update agreement.");
                        }
                    }
                }
            ],
            "plain-text",
            (worker.adminCommission || 10).toString()
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#1A202C" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Worker Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Worker Main Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileMain}>
                        <View style={styles.avatarCircle}><Text style={styles.avatarText}>{initials}</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.workerName}>{worker.name}</Text>
                            <Text style={styles.workerRoleText}>{worker.role || 'Subcontractor'}</Text>
                            <View style={styles.badgesRow}>
                                <View style={styles.badgePurple}><Text style={styles.badgeTextPurple}>{worker.profession || worker.categoryName || 'Pro'}</Text></View>
                                <View style={styles.badgeGreen}><Text style={styles.badgeTextGreen}>{worker.isAvailable ? 'Active' : 'Busy'}</Text></View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoRowStrip}>
                        <View style={styles.infoItem}>
                            <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                            <View>
                                <Text style={styles.infoValueText}>{worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : 'Active Member'}</Text>
                                <Text style={styles.infoLabelText}>Joined</Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="location-outline" size={20} color="#3B82F6" />
                            <View>
                                <Text style={styles.infoValueText}>{worker.location || 'Service Area'}</Text>
                                <Text style={styles.infoLabelText}>Location</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.mapWrapper}>
                        <Image
                            source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${worker.lat || 30.27},${worker.lng || -97.74}&zoom=13&size=400x200&scale=2&maptype=roadmap` }}
                            style={styles.mapFrame}
                            resizeMode="cover"
                        />
                        <View style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -12, marginTop: -24 }}>
                            <Ionicons name="location" size={24} color="#EF4444" />
                        </View>
                    </View>
                </View>

                {/* Subscription Plan */}
                <Text style={styles.sectionTitleRefined}>Subscription Account</Text>
                <View style={styles.profileCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A202C' }}>{worker.plan?.name || 'Standard Pro'}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#8B5CF6' }}>${worker.plan?.price || '29'}/mo</Text>
                    </View>
                    <View style={styles.dividerLight} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <Ionicons name="shield-checkmark" size={18} color="#10B981" />
                        <Text style={{ fontSize: 13, color: '#64748B' }}>Account Expires: <Text style={{ fontWeight: '700', color: '#1A202C' }}>{worker.subscriptionExpiresAt ? new Date(worker.subscriptionExpiresAt).toLocaleDateString() : 'Jan 12, 2027'}</Text></Text>
                    </View>
                </View>

                {/* Performance Metrics */}
                <Text style={styles.sectionTitleRefined}>Performance Metrics</Text>
                <View style={styles.metricsGridRow}>
                    <MetricCard label="Jobs Completed" value={worker.completedJobsCount || '0'} change="+5%" />
                    <MetricCard label="Active Tasks" value={worker.activeJobsCount || '0'} change="0%" />
                    <MetricCard label="Response Rate" value="98%" />
                    <MetricCard label="Rating" value={worker.rating?.toString() || '0'} />
                </View>

                {/* Financial Summary */}
                <Text style={styles.sectionTitleRefined}>Financial Summary</Text>
                <View style={styles.financialWideCard}>
                    <View style={styles.financialTopSection}>
                        <Text style={styles.financialSmallLabel}>Total Earned (Lifetime)</Text>
                        <Text style={styles.financialBigValue}>${(worker.earnings || 0).toLocaleString()}</Text>
                        <Text style={styles.financialComparisonText}>
                           Est. Plateau: <Text style={styles.boldAmount}>$5,000</Text> | Platform Cut: <Text style={styles.boldAmount}>10%</Text>
                        </Text>
                    </View>
                    <View style={styles.dividerLight} />
                    <View style={styles.financialBottomRow}>
                        <View style={styles.financialMiniCol}>
                            <Text style={styles.financialSmallLabel}>Admin Share</Text>
                            <Text style={styles.financialMedValue}>${Math.floor((worker.earnings || 0) * 0.1)}</Text>
                        </View>
                        <View style={styles.financialMiniCol}>
                            <Text style={styles.financialSmallLabel}>Worker Net</Text>
                            <Text style={[styles.financialMedValue, { color: '#10B981' }]}>${Math.floor((worker.earnings || 0) * 0.9)}</Text>
                        </View>
                    </View>
                </View>

                {/* Contract Controls */}
                <Text style={styles.sectionTitleRefined}>Contract Controls</Text>
                <View style={styles.contractWideCard}>
                    <Text style={styles.contractSubTitle}>Current Earnings Agreement</Text>
                    <View style={styles.agreementPercentRow}>
                        <View style={styles.percentBox}>
                            <Text style={styles.percentTextBlue}>{worker.adminCommission || 10}%</Text>
                            <Text style={styles.percentLabelSmall}>Admin Share</Text>
                        </View>
                        <View style={styles.swapIconCircle}>
                            <MaterialCommunityIcons name="swap-horizontal" size={22} color="#64748B" />
                        </View>
                        <View style={styles.percentBox}>
                            <Text style={styles.percentTextGreen}>{worker.workerCommission || 90}%</Text>
                            <Text style={styles.percentLabelSmall}>Worker Share</Text>
                        </View>
                    </View>
                    
                    <View style={styles.dualProgressBar}>
                        <View style={[styles.progressPart, { width: `${worker.adminCommission || 10}%`, backgroundColor: '#0E56D0' }]} />
                        <View style={[styles.progressPart, { width: `${worker.workerCommission || 90}%`, backgroundColor: '#10B981' }]} />
                    </View>

                    <TouchableOpacity style={styles.editEarningsButton} onPress={handleEditEarnings}>
                        <Text style={styles.editEarningsButtonText}>Edit Earnings Percentage</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Sticky Actions Footer */}
            <View style={[styles.stickyFooterArea, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <TouchableOpacity style={styles.outlineActionBtn}>
                    <Text style={styles.outlineActionBtnText}>Suspend Account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.filledActionBtnBlue}
                    onPress={() => navigation.navigate('AdminChat', { name: worker.name, userId: worker.id })}
                >
                    <Text style={styles.filledActionBtnText}>Message Worker</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#FFF',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
    backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

    scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
    profileCard: {
        backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginBottom: 24,
        ...SHADOWS.small,
    },
    profileMain: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
    avatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#FFF', fontSize: 20, fontWeight: '800' },
    workerName: { fontSize: 22, fontWeight: '800', color: '#1A202C' },
    workerRoleText: { fontSize: 14, color: '#718096', marginTop: 2, marginBottom: 8 },
    badgesRow: { flexDirection: 'row', gap: 8 },
    badgePurple: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    badgeTextPurple: { color: '#8B5CF6', fontSize: 11, fontWeight: '700' },
    badgeGreen: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    badgeTextGreen: { color: '#10B981', fontSize: 11, fontWeight: '700' },

    infoRowStrip: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 20, gap: 20, marginBottom: 20 },
    infoItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
    infoValueText: { fontSize: 15, fontWeight: '800', color: '#1A202C' },
    infoLabelText: { fontSize: 12, color: '#718096', marginTop: 2 },

    mapWrapper: { height: 160, borderRadius: 20, overflow: 'hidden', position: 'relative' },
    mapFrame: { width: '100%', height: '100%' },
    mapPinOverlay: { position: 'absolute', top: '50%', left: '50%', marginTop: -15, marginLeft: -15 },
    markerCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(5, 150, 105, 0.2)', alignItems: 'center', justifyContent: 'center' },
    markerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#059669' },

    sectionTitleRefined: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 16, marginTop: 12 },
    metricsGridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    metricCard: {
        width: (width - 44) / 2, backgroundColor: '#FFF',
        borderRadius: 20, padding: 20, ...SHADOWS.small,
    },
    metricLabel: { fontSize: 13, color: '#718096', marginBottom: 10 },
    metricValue: { fontSize: 24, fontWeight: '800', color: '#1A202C', marginBottom: 6 },
    metricChange: { fontSize: 11, fontWeight: '700' },

    financialWideCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, ...SHADOWS.small, marginBottom: 24 },
    financialTopSection: { marginBottom: 20 },
    financialSmallLabel: { fontSize: 13, color: '#718096', marginBottom: 8 },
    financialBigValue: { fontSize: 32, fontWeight: '800', color: '#1A202C', marginBottom: 12 },
    financialComparisonText: { fontSize: 13, color: '#64748B' },
    boldAmount: { fontWeight: '800', color: '#1A202C' },
    dividerLight: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 },
    financialBottomRow: { flexDirection: 'row', gap: 24 },
    financialMiniCol: { flex: 1 },
    financialMedValue: { fontSize: 22, fontWeight: '800', color: '#1A202C' },

    contractWideCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, ...SHADOWS.small, marginBottom: 24 },
    contractSubTitle: { fontSize: 13, color: '#718096', marginBottom: 20 },
    agreementPercentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    percentBox: { alignItems: 'center' },
    percentTextBlue: { fontSize: 26, fontWeight: '800', color: '#0E56D0' },
    percentTextGreen: { fontSize: 26, fontWeight: '800', color: '#10B981' },
    percentLabelSmall: { fontSize: 11, color: '#718096', marginTop: 4, fontWeight: '600' },
    swapIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWeight: 1, borderColor: '#F1F5F9' },
    dualProgressBar: { height: 10, borderRadius: 5, backgroundColor: '#F1F5F9', flexDirection: 'row', overflow: 'hidden', marginBottom: 24 },
    progressPart: { height: '100%' },
    editEarningsButton: { height: 52, borderRadius: 26, backgroundColor: '#0E56D0', alignItems: 'center', justifyContent: 'center', ...SHADOWS.small },
    editEarningsButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

    stickyFooterArea: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#FFF', flexDirection: 'row', padding: 20, gap: 12,
        borderTopWidth: 1, borderTopColor: '#F1F5F9',
    },
    outlineActionBtn: { flex: 1, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
    outlineActionBtnText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
    filledActionBtnBlue: { flex: 1.5, height: 50, borderRadius: 25, backgroundColor: '#0E56D0', alignItems: 'center', justifyContent: 'center' },
    filledActionBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    
    galleryGridRow: { flexDirection: 'row', gap: 10, height: 240, marginBottom: 24 },
    galleryCol: { flex: 1 },
    galleryMainImg: { width: '100%', height: '100%', borderRadius: 20 },
    gallerySubImg: { width: '100%', height: 115, borderRadius: 20 },
});
