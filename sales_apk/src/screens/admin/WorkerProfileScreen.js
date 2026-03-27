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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function WorkerProfileScreen({ navigation }) {
    const insets = useSafeAreaInsets();

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
                        <View style={styles.avatarCircle}><Text style={styles.avatarText}>JC</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.workerName}>John Carter</Text>
                            <Text style={styles.workerRoleText}>Subcontractor</Text>
                            <View style={styles.badgesRow}>
                                <View style={styles.badgePurple}><Text style={styles.badgeTextPurple}>Plumber</Text></View>
                                <View style={styles.badgeGreen}><Text style={styles.badgeTextGreen}>Active</Text></View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoRowStrip}>
                        <View style={styles.infoItem}>
                            <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                            <View>
                                <Text style={styles.infoValueText}>15 Jan, 2025</Text>
                                <Text style={styles.infoLabelText}>Joined</Text>
                            </View>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="location-outline" size={20} color="#3B82F6" />
                            <View>
                                <Text style={styles.infoValueText}>Austin, TX</Text>
                                <Text style={styles.infoLabelText}>Service Area</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.mapWrapper}>
                        <Image
                            source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=30.273874,-97.745772&zoom=13&size=400x200&scale=2&maptype=roadmap&style=feature:all|element:geometry|color:0xf5f5f5&style=feature:road|element:geometry|color:0xffffff&style=feature:poi.park|element:geometry|color:0xe5e5e5&style=feature:water|element:geometry|color:0xc9c9c9' }}
                            style={styles.mapFrame}
                            resizeMode="cover"
                        />
                        <View style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -12, marginTop: -24 }}>
                            <Ionicons name="location" size={24} color="#EF4444" />
                        </View>
                    </View>
                </View>

                {/* Performance Metrics */}
                <Text style={styles.sectionTitleRefined}>Performance Metrics</Text>
                <View style={styles.metricsGridRow}>
                    <MetricCard label="Jobs Completed" value="147" change="+12%" />
                    <MetricCard label="Jobs Cancelled" value="128" change="-2%" />
                    <MetricCard label="Avg Completion Time" value="4.2 days" />
                    <MetricCard label="Disputes Raised" value="2" />
                </View>

                {/* Financial Summary */}
                <Text style={styles.sectionTitleRefined}>Financial Summary</Text>
                <View style={styles.financialWideCard}>
                    <View style={styles.financialTopSection}>
                        <Text style={styles.financialSmallLabel}>Total Earned (Lifetime)</Text>
                        <Text style={styles.financialBigValue}>$42,500</Text>
                        <Text style={styles.financialComparisonText}>
                           This Month: <Text style={styles.boldAmount}>$3270</Text> | Last Month: <Text style={styles.boldAmount}>$2430</Text>
                        </Text>
                    </View>
                    <View style={styles.dividerLight} />
                    <View style={styles.financialBottomRow}>
                        <View style={styles.financialMiniCol}>
                            <Text style={styles.financialSmallLabel}>Platform Fees</Text>
                            <Text style={styles.financialMedValue}>$10,625</Text>
                        </View>
                        <View style={styles.financialMiniCol}>
                            <Text style={styles.financialSmallLabel}>Pending Payouts</Text>
                            <Text style={[styles.financialMedValue, { color: '#EF4444' }]}>$1,850</Text>
                        </View>
                    </View>
                </View>

                {/* Contract Controls */}
                <Text style={styles.sectionTitleRefined}>Contract Controls</Text>
                <View style={styles.contractWideCard}>
                    <Text style={styles.contractSubTitle}>Current Earnings Agreement</Text>
                    <View style={styles.agreementPercentRow}>
                        <View style={styles.percentBox}>
                            <Text style={styles.percentTextBlue}>20%</Text>
                            <Text style={styles.percentLabelSmall}>Admin Share</Text>
                        </View>
                        <View style={styles.swapIconCircle}>
                            <MaterialCommunityIcons name="swap-horizontal" size={22} color="#64748B" />
                        </View>
                        <View style={styles.percentBox}>
                            <Text style={styles.percentTextGreen}>80%</Text>
                            <Text style={styles.percentLabelSmall}>Worker Share</Text>
                        </View>
                    </View>
                    
                    <View style={styles.dualProgressBar}>
                        <View style={[styles.progressPart, { width: '20%', backgroundColor: '#0E56D0' }]} />
                        <View style={[styles.progressPart, { width: '80%', backgroundColor: '#10B981' }]} />
                    </View>

                    <TouchableOpacity style={styles.editEarningsButton}>
                        <Text style={styles.editEarningsButtonText}>Edit Earnings Percentage</Text>
                    </TouchableOpacity>
                </View>

                {/* Work Gallery Section */}
                <Text style={styles.sectionTitleRefined}>Work Gallery</Text>
                <View style={styles.galleryGridRow}>
                    <View style={styles.galleryCol}>
                        <Image source={require('../../assets/images/wood_flooring_job.png')} style={styles.galleryMainImg} />
                    </View>
                    <View style={styles.galleryCol}>
                        <Image source={require('../../assets/images/modern_kitchen_flooring.png')} style={styles.gallerySubImg} />
                        <Image source={require('../../assets/images/construction_site_overview.png')} style={[styles.gallerySubImg, { marginTop: 10 }]} />
                    </View>
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
                    onPress={() => navigation.navigate('AdminChat', { name: 'John Carter' })}
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
