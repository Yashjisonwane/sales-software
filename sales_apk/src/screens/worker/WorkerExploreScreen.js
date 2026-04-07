import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Dimensions,
    Image,
    ScrollView,
    Modal,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { ScrollView as GestureHandlerScrollView } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES, FONTS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, interpolate, Extrapolate } from 'react-native-reanimated';
import { getAvailableLeads, acceptLead, getWorkerJobs } from '../../api/apiService';
import { pickLatLng, buildLeafletPinsMapHtml } from '../../utils/leafletMapHtml';
import { getLeadPricingLines, getJobPricingLines } from '../../utils/workerPricingDisplay';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const getImgSource = (img) => {
    if (!img) return require('../../assets/images/wood_flooring_job.png');
    return typeof img === 'number' ? img : { uri: img };
};

const TABS = ['Overview', 'Jobs', 'Schedule', 'Invoice', 'Quote'];

// Removed PINS_WORKER, JOBS_DATA, INVOICES_DATA, QUOTES_DATA, AGENDA_DATA mock data

const LocationPin = ({ color }) => (
    <View style={styles.locationPinWrapper}>
        <View style={[styles.locationPinMainCircle, { backgroundColor: color }]}>
            <View style={styles.locationPinInnerWhiteDot} />
        </View>
        <View style={[styles.locationPinSharpTail, { borderTopColor: color }]} />
    </View>
);

const CurrentLocationMarker = () => (
    <View style={styles.currentLocMarker}>
        <View style={styles.locDirectionBeam} />
        <View style={styles.blueOuterGlow} />
        <View style={styles.blueCoreInner}>
            <View style={styles.whiteBorderRing} />
        </View>
    </View>
);

const StatCard = ({ icon, label, value, change, color }) => (
    <View style={styles.statBox}>
        <View style={[styles.statIconCircle, { backgroundColor: color + '10' }]}>
            <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={styles.statLabelSmall}>{label}</Text>
        <Text style={styles.statValueBig}>{value}</Text>
        <Text style={styles.statTrendGreen}>{change}</Text>
    </View>
);

const ProgressBar = ({ label, value, progress, color }) => (
    <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>{label}</Text>
            <Text style={[styles.progressValue, { color }]}>{value}</Text>
        </View>
        <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
        </View>
    </View>
);

export default function WorkerExploreScreen({ navigation, route }) {
    const [activeTab, setActiveTab] = useState('Overview');
    const [selectedPin, setSelectedPin] = useState(null);
    const [quoteFilter, setQuoteFilter] = useState('All');
    const [invoiceFilter, setInvoiceFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [invoicePickerOpen, setInvoicePickerOpen] = useState(false);
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['18%', '40%', '92%'], []);
    const insets = useSafeAreaInsets();
    const animatedIndex = useSharedValue(0);

    const mapAnimatedStyle = useAnimatedStyle(() => {
        // Fade out later, starting when sheet moves past middle point (40%)
        const opacity = interpolate(
            animatedIndex.value,
            [1.3, 1.8],
            [1, 0],
            Extrapolate.CLAMP
        );
        return { opacity };
    });

    const legendAnimatedStyle = useAnimatedStyle(() => {
        // animatedIndex represents the snap points: 0=18%, 1=40%, 2=92%
        const bottom = interpolate(
            animatedIndex.value,
            [0, 1, 2],
            [windowHeight * 0.18 + 10, windowHeight * 0.40 + 10, windowHeight * 0.92 + 10]
        );
        const opacity = interpolate(
            animatedIndex.value,
            [1.4, 1.8],
            [1, 0],
            Extrapolate.CLAMP
        );
        return {
            bottom,
            opacity
        };
    });

    const buttonsAnimatedStyle = useAnimatedStyle(() => {
        // Buttons stay just above legend (65px offset)
        const bottom = interpolate(
            animatedIndex.value,
            [0, 1, 2],
            [windowHeight * 0.18 + 65, windowHeight * 0.40 + 65, windowHeight * 0.92 + 65]
        );
        const opacity = interpolate(
            animatedIndex.value,
            [1.4, 1.8],
            [1, 0],
            Extrapolate.CLAMP
        );
        return {
            bottom,
            opacity
        };
    });

    useEffect(() => {
        if (route.params?.activeTab) {
            setActiveTab(route.params.activeTab);
        }
    }, [route.params?.activeTab]);

    const [leads, setLeads] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLeads = async () => {
        setIsLoading(true);
        const res = await getAvailableLeads();
        if (res.success) {
            setLeads(res.data || []);
        }
        setIsLoading(false);
    };

    const fetchJobs = async () => {
        const res = await getWorkerJobs();
        if (res.success) {
            setJobs(res.data || []);
        }
    };

    useEffect(() => {
        fetchLeads();
        fetchJobs();
    }, []);

    useEffect(() => {
        if (activeTab === 'Schedule' || activeTab === 'Invoice' || activeTab === 'Quote') {
            fetchJobs();
        }
    }, [activeTab]);

    const leafletPins = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        const match = (t) => !q || String(t || '').toLowerCase().includes(q);
        const out = [];
        leads
            .filter((l) => match(l.customerName || l.clientName || '') || match(l.location || l.address || ''))
            .forEach((l) => {
                const c = pickLatLng(l);
                if (!c) return;
                out.push({ ...c, color: '#F59E0B', id: l.id, recordType: 'lead' });
            });
        jobs
            .filter((j) => match(j.customerName || '') || match(j.location || ''))
            .forEach((j) => {
                const c = pickLatLng(j);
                if (!c) return;
                out.push({ ...c, color: '#8B5CF6', id: j.id, recordType: 'job' });
            });
        return out;
    }, [leads, jobs, searchQuery]);

    const leafletMapHtml = useMemo(() => buildLeafletPinsMapHtml(leafletPins), [leafletPins]);
    const leafletMapKey = useMemo(
        () => leafletPins.map((p) => `${p.id}:${p.latitude.toFixed(5)}:${p.longitude.toFixed(5)}`).join('|'),
        [leafletPins]
    );

    const jobsReadyToInvoice = useMemo(
        () => jobs.filter((j) => j.estimate != null && j.estimate.amount != null && Number(j.estimate.amount) > 0),
        [jobs]
    );

    const invoiceStats = useMemo(() => {
        const withInv = jobs.filter((j) => j.invoice);
        const totalBilled = withInv.reduce((s, j) => s + Number(j.invoice?.amount || 0), 0);
        const paid = withInv.filter((j) => j.invoice?.status === 'PAID').length;
        const pendingAmt = withInv
            .filter((j) => j.invoice?.status !== 'PAID')
            .reduce((s, j) => s + Number(j.invoice?.amount || 0), 0);
        return {
            totalBilled,
            pendingAmt,
            paidCount: paid,
            overdueCount: withInv.filter((j) => j.invoice?.status === 'UNPAID').length,
        };
    }, [jobs]);

    const handleMapMessage = useCallback(
        (event) => {
            try {
                const msg = JSON.parse(event.nativeEvent.data);
                if (msg.type !== 'pinPress' || !msg.pin?.id) return;
                const { id, recordType } = msg.pin;
                if (recordType === 'lead') {
                    const lead = leads.find((l) => String(l.id) === String(id));
                    if (lead) navigation.navigate('JobOfferDetail', { lead, state: 'pending' });
                } else {
                    const job = jobs.find((j) => String(j.id) === String(id));
                    if (job) navigation.navigate('JobDetails', { job });
                }
            } catch (_) {}
        },
        [leads, jobs, navigation]
    );

    const handleAcceptLead = async (leadId) => {
        const res = await acceptLead(leadId);
        if (res.success) {
            alert('Lead Accepted! A new job has been created for you.');
            fetchLeads();
            fetchJobs();
        } else {
            alert(res.message || 'Failed to accept lead');
        }
    };

    const renderOverview = () => (
        <View style={styles.tabScrollContent}>
            <View style={styles.overviewMainCard}>
                <Text style={styles.overviewTitle}>Welcome Back!</Text>
                <Text style={styles.overviewSub}>Manage your workflow and track performance.</Text>
                
                <View style={styles.statsGrid}>
                    <StatCard 
                        icon="briefcase" 
                        label="Active Jobs" 
                        value={jobs.length.toString()} 
                        change="Ready to work" 
                        color="#3B82F6" 
                    />
                    <StatCard 
                        icon="people" 
                        label="New Leads" 
                        value={leads.length.toString()} 
                        change="Action required" 
                        color="#F59E0B" 
                    />
                    <StatCard 
                        icon="trending-up" 
                        label="Revenue" 
                        value="$4,850" 
                        change="+12% this week" 
                        color="#10B981" 
                    />
                    <StatCard 
                        icon="star" 
                        label="Rating" 
                        value="4.8" 
                        change="Excellent" 
                        color="#8B5CF6" 
                    />
                </View>
            </View>

            <Text style={styles.sectionTitle}>Daily Progress</Text>
            <ProgressBar label="Weekly Earnings Goal" value="$4,850 / $6,000" progress={0.8} color="#3B82F6" />
            <ProgressBar label="Job Completion Rate" value="92%" progress={0.92} color="#10B981" />
            
            <View style={{ height: 20 }} />
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <View style={styles.updatesList}>
                {leads.slice(0, 2).map((lead, idx) => (
                    <View key={idx} style={styles.updateItem}>
                        <View style={[styles.updateIcon, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="flash" size={20} color="#D97706" />
                        </View>
                        <View style={styles.updateContent}>
                            <Text style={styles.updateText}>New Lead: {lead.customer?.name || 'Customer'}</Text>
                            <Text style={styles.updateMeta}>Just now • {lead.location}</Text>
                        </View>
                    </View>
                ))}
                {jobs.slice(0, 1).map((job, idx) => (
                    <View key={idx} style={styles.updateItem}>
                        <View style={[styles.updateIcon, { backgroundColor: '#DBEAFE' }]}>
                            <Ionicons name="calendar" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.updateContent}>
                            <Text style={styles.updateText}>Upcoming Job today</Text>
                            <Text style={styles.updateMeta}>Scheduled for 09:00 AM</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderJobPinModal = () => {
        const pinPricing = getLeadPricingLines(selectedPin);
        return (
        <Modal
            transparent
            visible={!!selectedPin}
            animationType="fade"
            onRequestClose={() => setSelectedPin(null)}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setSelectedPin(null)}
            >
                <View style={styles.pinCard}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                            const pin = selectedPin;
                            setSelectedPin(null);
                            if (pin) navigation.navigate('JobOfferDetail', { lead: pin, state: 'pending' });
                        }}
                        style={styles.cardImagesRow}
                    >
                        <Image source={getImgSource(require('../../assets/images/wood_flooring_job.png'))} style={styles.cardThumb} />
                        <Image source={getImgSource(require('../../assets/images/modern_kitchen_flooring.png'))} style={styles.cardThumb} />
                        <Image source={getImgSource(require('../../assets/images/construction_site_overview.png'))} style={[styles.cardThumb, { marginRight: 0 }]} />
                    </TouchableOpacity>

                    <View style={styles.cardContent}>
                        <View style={styles.cardHeaderRow}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.cardNameLine}>
                                    <Text style={styles.cardName}>{selectedPin?.customer?.name || 'Customer'}</Text>
                                    <View style={styles.upcomingBadge}><Text style={styles.upcomingText}>Lead</Text></View>
                                </View>
                                <Text style={styles.cardAddr}>{selectedPin?.location || 'Location'}</Text>
                            </View>
                            <View style={styles.cardPriceBox}>
                                <Text style={styles.cardPriceText}>{pinPricing.primary}</Text>
                                {pinPricing.secondary ? <Text style={styles.cardPerHr}>{pinPricing.secondary}</Text> : null}
                            </View>
                        </View>

                        <View style={styles.cardActions}>
                            <TouchableOpacity 
                                style={[styles.loginBtn, { height: 40, marginTop: 10, backgroundColor: '#10B981' }]}
                                onPress={() => handleAcceptLead(selectedPin.id)}
                            >
                                <Text style={styles.loginBtnText}>Accept Lead</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
        );
    };

    const renderJobs = () => (
        <View style={styles.tabScrollContent}>
            <View style={styles.detailedSearchRow}>
                <View style={styles.detailedSearchBox}>
                    <Text style={styles.detailedSearchText}>Available Leads</Text>
                    <Ionicons name="search" size={20} color="#718096" />
                </View>
            </View>

            {isLoading ? (
                <Text style={{ textAlign: 'center', padding: 20 }}>Loading leads...</Text>
            ) : leads.length === 0 ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <Ionicons name="document-text-outline" size={60} color="#CBD5E0" />
                    <Text style={{ color: '#718096', marginTop: 10 }}>No leads available right now.</Text>
                </View>
            ) : (
                <View style={{ gap: 20 }}>
                    {leads.map(lead => {
                        const leadRates = getLeadPricingLines(lead);
                        return (
                        <TouchableOpacity
                            key={lead.id}
                            style={styles.detailedVerticalCard}
                            onPress={() => navigation.navigate('JobOfferDetail', { lead, state: 'pending' })}
                            activeOpacity={0.9}
                        >
                            <Image 
                                source={require('../../assets/images/wood_flooring_job.png')} 
                                style={[styles.horizJobImg, { height: 160 }]} 
                            />
                            <View style={styles.detailedCardInfo}>
                                <View style={styles.detailedHeader}>
                                    <View>
                                        <Text style={styles.jobName}>{lead.customerName || lead.customer?.name || 'Customer'}</Text>
                                        <Text style={styles.jobAddr}>{lead.location}</Text>
                                    </View>
                                    <View style={styles.subcontractBadge}>
                                        <Text style={styles.subcontractText}>{lead.category?.name || 'LEAD'}</Text>
                                    </View>
                                </View>
                                <View style={styles.cardFooter}>
                                    <View>
                                        <Text style={styles.jobPrice}>{leadRates.primary}</Text>
                                        {leadRates.secondary ? (
                                            <Text style={styles.jobPriceSub}>{leadRates.secondary}</Text>
                                        ) : null}
                                    </View>
                                    <TouchableOpacity 
                                        style={[styles.actionBtn, { maxWidth: 120 }]}
                                        onPress={() => handleAcceptLead(lead.id)}
                                    >
                                        <Text style={styles.actionText}>Accept Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );

    const renderInvoice = () => (
        <View style={styles.tabScrollContent}>
            {/* Inline Search */}
            <View style={styles.inlineSearch}>
                <Ionicons name="search" size={20} color="#CBD5E0" />
                <BottomSheetTextInput 
                    placeholder="Search jobs or area" 
                    style={styles.inlineSearchInput} 
                    placeholderTextColor="#A0AEC0" 
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={() => Keyboard.dismiss()}
                />
                <Ionicons name="mic-outline" size={20} color="#CBD5E0" />
            </View>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusChipsRow}>
                {['All', 'Draft', 'Sent', 'Paid', 'Pending'].map(s => (
                    <TouchableOpacity
                        key={s}
                        onPress={() => setInvoiceFilter(s)}
                        style={[styles.statusChip, invoiceFilter === s && styles.activeStatusChipDark]}
                    >
                        <Text style={[styles.statusChipText, invoiceFilter === s && styles.activeStatusChipTextWhite]}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Billing Summary Card */}
            <View style={styles.billingSummaryCard}>
                <View style={styles.summaryHeaderRow}>
                    <View>
                        <Text style={styles.summaryTitle}>Billing Summary</Text>
                        <Text style={styles.summarySub}>Invoices and payments in one place.</Text>
                    </View>
                    <TouchableOpacity style={styles.monthPicker}>
                        <Text style={styles.monthText}>January</Text>
                        <Ionicons name="chevron-down" size={16} color="#4A5568" />
                    </TouchableOpacity>
                </View>

                <View style={styles.summaryTable}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Billed</Text>
                        <Text style={styles.summaryValue}>${invoiceStats.totalBilled.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Pending</Text>
                        <Text style={styles.summaryValue}>${invoiceStats.pendingAmt.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Paid Invoices</Text>
                        <Text style={styles.summaryValue}>{invoiceStats.paidCount}</Text>
                    </View>
                    <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.summaryLabel}>Unpaid</Text>
                        <Text style={[styles.summaryValue, { color: '#EF4444' }]}>{invoiceStats.overdueCount}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.newInvoiceBtn}
                    onPress={() => {
                        if (jobs.length === 0) {
                            Alert.alert('No jobs yet', 'Accept a lead or wait for an assigned job before invoicing.');
                            return;
                        }
                        if (jobsReadyToInvoice.length === 0) {
                            Alert.alert(
                                'Quote required first',
                                'Save a quote (amount) on a job before you can bill the customer. Open the job from Schedule or Jobs and complete the quote flow.'
                            );
                            return;
                        }
                        if (jobsReadyToInvoice.length === 1) {
                            navigation.navigate('CreateInvoice', { job: jobsReadyToInvoice[0] });
                            return;
                        }
                        setInvoicePickerOpen(true);
                    }}
                >
                    <Ionicons name="add" size={22} color="#fff" />
                    <Text style={styles.newInvoiceBtnText}>New invoice</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitleSmall}>Invoices</Text>

            {jobs.filter(job => job.invoice).map(job => (
                <View key={job.invoice.id} style={styles.quoteCardDetailed}>
                    <View style={styles.cardHeaderDetailed}>
                        <Text style={styles.billingId}>#{job.invoice.id.substring(0, 8)}</Text>
                        <View style={[styles.statusBadgeDetailed, {
                            backgroundColor: job.invoice.status === 'PAID' ? '#DCFCE7' : '#FEF2F2'
                        }]}>
                            <Text style={[styles.statusBadgeTextDetailed, {
                                color: job.invoice.status === 'PAID' ? '#16A34A' : '#EF4444'
                            }]}>{job.invoice.status}</Text>
                        </View>
                    </View>

                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Customer Name</Text>
                        <Text style={styles.billingValue}>{job.customerName || job.customer?.name}</Text>
                    </View>
                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Job Type</Text>
                        <Text style={styles.billingValue}>{job.categoryName}</Text>
                    </View>
                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Amount</Text>
                        <Text style={[styles.billingValue, { fontWeight: '700' }]}>${job.invoice.amount}</Text>
                    </View>

                    <TouchableOpacity style={styles.viewDetailsLink}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );

    const renderQuote = () => (
        <View style={styles.tabScrollContent}>
            {/* Inline Search */}
            <View style={styles.inlineSearch}>
                <Ionicons name="search-outline" size={24} color="#1A202C" />
                <BottomSheetTextInput placeholder="Search here" placeholderTextColor="#A0AEC0" style={styles.inlineSearchInput} />
                <Ionicons name="mic-outline" size={24} color="#718096" />
            </View>

            {/* Status Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusChipsRow}>
                {['All', 'Draft', 'Sent', 'Approved', 'Rejected'].map(s => (
                    <TouchableOpacity
                        key={s}
                        onPress={() => setQuoteFilter(s)}
                        style={[styles.statusChip, quoteFilter === s && styles.activeStatusChipDark]}
                    >
                        <Text style={[styles.statusChipText, quoteFilter === s && styles.activeStatusChipTextWhite]}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.sectionTitleSmall}>All Quotes</Text>

            {jobs.filter(job => job.estimate).map(job => (
                <View key={job.estimate.id} style={styles.quoteCardDetailed}>
                    <View style={styles.cardHeaderDetailed}>
                        <Text style={styles.billingId}>#{job.estimate.id.substring(0, 8)}</Text>
                        <View style={[styles.statusBadgeDetailed, {
                            backgroundColor: job.estimate.isApproved ? '#DCFCE7' : '#DBEAFE'
                        }]}>
                            <Text style={[styles.statusBadgeTextDetailed, {
                                color: job.estimate.isApproved ? '#22C55E' : '#0062E1'
                            }]}>{job.estimate.isApproved ? 'Approved' : 'Pending'}</Text>
                        </View>
                    </View>

                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Customer Name</Text>
                        <Text style={styles.billingValue}>{job.customerName || job.customer?.name}</Text>
                    </View>
                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Service Type</Text>
                        <Text style={styles.billingValue}>{job.categoryName}</Text>
                    </View>
                    <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>Amount</Text>
                        <Text style={[styles.billingValue, { fontWeight: '700' }]}>${job.estimate.amount}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.viewDetailsLinkLeft}
                        onPress={() => navigation.navigate('QuoteDetails', { quoteId: job.estimate.id, role: 'worker' })}
                    >
                        <Text style={styles.viewDetailsTextPurple}>View Details</Text>
                    </TouchableOpacity>
                </View>
            ))}

            <TouchableOpacity
                style={styles.createBtnFloatingPill}
                onPress={() => {
                    const list = jobs.filter((j) => j.jobNo);
                    if (list.length === 0) {
                        Alert.alert('No jobs', 'Accept a lead or get assigned a job before creating a quote.');
                        return;
                    }
                    navigation.navigate('QuoteScope', { job: list[0], role: 'worker' });
                }}
            >
                <Ionicons name="add" size={24} color="#fff" />
                <Text style={styles.createBtnTextPill}>Create New Quote</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSchedule = () => (
        <View style={styles.tabScrollContent}>
            <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
            {jobs.length === 0 ? (
                <View style={[styles.emptyState, { marginTop: 40 }]}>
                    <Ionicons name="calendar-outline" size={60} color="#CBD5E0" />
                    <Text style={styles.emptyText}>You don't have any jobs scheduled yet.</Text>
                    <TouchableOpacity style={styles.browseLeadsBtn} onPress={() => setActiveTab('Jobs')}>
                         <Text style={styles.browseLeadsText}>Browse Available Leads</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ marginTop: 20 }}>
                    {jobs.map((job, index) => {
                        const jobRates = getJobPricingLines(job);
                        return (
                        <View key={job.id} style={styles.agendaItem}>
                            <View style={styles.agendaTimeline}>
                                <View style={styles.agendaDot}>
                                    <View style={styles.activeDotInner} />
                                </View>
                                {index !== jobs.length - 1 && <View style={styles.agendaLine} />}
                            </View>
                            <View style={styles.agendaContent}>
                                <View style={styles.agendaCard}>
                                    <View style={[styles.activeTopBar, { backgroundColor: '#0062E1' }]} />
                                    <View style={styles.agendaHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.agendaName}>{job.customerName || job.customer?.name || job.lead?.customer?.name || 'Client'}</Text>
                                            <Text style={styles.agendaType}>{job.categoryName || job.lead?.category?.name || 'Service'}</Text>
                                        </View>
                                        <View style={styles.agendaStatusBadge}>
                                            <Text style={styles.agendaStatusText}>Today</Text>
                                        </View>
                                    </View>

                                    <View style={styles.agendaPricingRow}>
                                        <Text style={styles.agendaPricingPrimary}>{jobRates.primary}</Text>
                                        {jobRates.secondary ? (
                                            <Text style={styles.agendaPricingSecondary}>{jobRates.secondary}</Text>
                                        ) : null}
                                    </View>

                                    <View style={styles.agendaInfoRow}>
                                        <Ionicons name="time-outline" size={16} color="#718096" />
                                        <Text style={styles.agendaInfoText}>
                                            {job.scheduledTime || job.lead?.preferredDate || 'Time TBD'}
                                        </Text>
                                    </View>
                                    <View style={styles.agendaInfoRow}>
                                        <Ionicons name="location-outline" size={16} color="#718096" />
                                        <Text style={styles.agendaInfoText} numberOfLines={1}>{job.location || job.lead?.location || 'No address set'}</Text>
                                    </View>

                                    <View style={styles.agendaActions}>
                                        <TouchableOpacity 
                                           style={styles.agendaBtnSecondary}
                                           onPress={() =>
                                             navigation.navigate('JobOfferDetail', {
                                               lead: job.lead || {
                                                 id: job.leadId,
                                                 customerName: job.customerName,
                                                 customer: job.customer,
                                                 location: job.location,
                                                 categoryName: job.categoryName,
                                                 category: { name: job.categoryName },
                                                 guestPhone: job.guestPhone,
                                                 servicePlan: job.lead?.servicePlan,
                                               },
                                               job,
                                               state: 'accepted',
                                               jobId: job.id,
                                             })
                                           }
                                        >
                                            <Text style={styles.agendaBtnTextSecondary}>View Details</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                           style={styles.agendaBtnPrimary}
                                           onPress={() => navigation.navigate('JobProofCompliance', { jobId: job.id })}
                                        >
                                            <Ionicons name="play" size={16} color="#FFF" />
                                            <Text style={styles.agendaBtnTextPrimary}>Start Work</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        );
                    })}
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" />

            {/* Real Map Content Area */}
            <View style={styles.mapContainer}>
                {!selectedPin ? (
                    <WebView
                        key={leafletMapKey}
                        source={{ html: leafletMapHtml }}
                        style={styles.mapImg}
                        originWhitelist={['*']}
                        onMessage={handleMapMessage}
                        javaScriptEnabled
                        domStorageEnabled
                        scalesPageToFit
                        scrollEnabled={false}
                    />
                ) : (
                    <WebView
                        source={{ html: buildLeafletPinsMapHtml([]) }}
                        style={styles.mapImg}
                        originWhitelist={['*']}
                        javaScriptEnabled
                        domStorageEnabled
                        scrollEnabled={false}
                    />
                )}

                <Animated.View style={[StyleSheet.absoluteFill, mapAnimatedStyle]} pointerEvents="box-none">

                    {/* Float Header / Search */}
                    <View style={[styles.searchContainer, { top: insets.top + 10 }]}>
                        <View style={styles.searchBar}>
                            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/512px-Google_Maps_icon_%282020%29.svg.png' }} style={styles.googleIconMap} />
                            <TextInput
                                style={[styles.searchInput, { color: '#1A202C' }]}
                                placeholder="Search here"
                                placeholderTextColor="#718096"
                                value={searchQuery}
                                onFocus={() => setIsSearchFocused(true)}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={() => {
                                    setIsSearchFocused(false);
                                    if (searchQuery.trim()) {
                                        setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
                                    }
                                }}
                                returnKeyType="search"
                            />
                            <Ionicons name="mic" size={20} color="#4A5568" style={{ marginRight: 12 }} />
                            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                                <Image source={{ uri: 'https://i.pravatar.cc/100?u=worker' }} style={styles.avatar} />
                            </TouchableOpacity>
                        </View>

                        {/* Dropdown Suggestions (Lower Option) */}
                        {isSearchFocused && (
                            <View style={styles.googleDropdownFloating}>
                                <ScrollView style={{ maxHeight: 380 }}>
                                    {[
                                      { name: 'Indore Marriott Hotel', addr: 'H-2 Scheme No 54, Meghdhoot Garden...', icon: 'location-sharp' },
                                      { name: 'marriott hotels & resorts', addr: '', icon: 'time-outline' },
                                      { name: 'Savo Technologies', addr: '139 PU4, Behind C21 Mall, Vijay Nagar...', icon: 'time-outline' },
                                    ].map((item, idx) => (
                                        <TouchableOpacity 
                                            key={idx} 
                                            style={styles.googleHistoryRow}
                                            onPress={() => {
                                                setSearchQuery(item.name);
                                                setIsSearchFocused(false);
                                                Keyboard.dismiss();
                                            }}
                                        >
                                            <View style={styles.googleIconBox}><Ionicons name={item.icon} size={20} color="#5F6368" /></View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.googlePlaceName}>{item.name}</Text>
                                                {item.addr && <Text style={styles.googlePlaceAddr}>{item.addr}</Text>}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                    <TouchableOpacity style={styles.closeDropdownLink} onPress={() => setIsSearchFocused(false)}>
                                        <Text style={styles.closeDropdownText}>Close Suggestions</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        )}
                        <View style={{ alignItems: 'flex-end', marginTop: 12, marginRight: 4 }}>
                            <View style={styles.weatherWidgetMap}>
                                <Ionicons name="cloudy" size={24} color="#F59E0B" />
                                <View style={{ marginLeft: 8 }}>
                                    <Text style={styles.weatherTempMap}>30°C</Text>
                                    <Text style={styles.weatherLocMap}>CA, USA</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Map Interaction Buttons Right - Premium Admin Style */}
                    {!selectedPin && (
                        <Animated.View style={[styles.mapButtonsRight, buttonsAnimatedStyle]}>
                            <TouchableOpacity style={styles.navCircleBtn}>
                                <Ionicons name="navigate" size={28} color="#0062E1" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dirSquareBtn}>
                                <MaterialCommunityIcons name="directions" size={30} color="#FFFFFF" />
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* Status filter chips on map overlap - now follows the sheet handle */}
                    <Animated.View style={[styles.mapOverlay, legendAnimatedStyle]}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
                            <TouchableOpacity style={[styles.legendChip, { backgroundColor: '#F59E0B' }]}><Text style={styles.legendText}>In Progress</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.legendChip, { backgroundColor: '#8B5CF6' }]}><Text style={styles.legendText}>Upcoming</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.legendChip, { backgroundColor: '#10B981' }]}><Text style={styles.legendText}>Completed</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.legendChip, { backgroundColor: '#EF4444' }]}><Text style={styles.legendText}>Cancelled</Text></TouchableOpacity>
                        </ScrollView>
                    </Animated.View>

                    {renderJobPinModal()}
                </Animated.View>
            </View>

            {/* Draggable Bottom Sheet */}
            <BottomSheet
                ref={bottomSheetRef}
                index={1}
                snapPoints={snapPoints}
                animatedIndex={animatedIndex}
                handleIndicatorStyle={styles.sheetHandle}
                backgroundStyle={styles.sheetBackground}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                android_keyboardInputMode="adjustResize"
            >
                {/* Tabs Wrapper inside Sheet */}
                <View style={styles.tabsWrapper}>
                    <GestureHandlerScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsScrollContainer}
                        bounces={true}
                        overScrollMode="always"
                    >
                        {TABS.map(tab => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
                            >
                                <Text style={[styles.tabBtnText, activeTab === tab && styles.activeTabBtnText]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </GestureHandlerScrollView>
                </View>

                {/* Scrollable Content inside Sheet */}
                <BottomSheetScrollView contentContainerStyle={[styles.sheetContent, { paddingBottom: insets.bottom + 100 }]}>
                    {activeTab === 'Overview' && renderOverview()}
                    {activeTab === 'Jobs' && renderJobs()}
                    {activeTab === 'Invoice' && renderInvoice()}
                    {activeTab === 'Quote' && renderQuote()}
                    {activeTab === 'Schedule' && renderSchedule()}
                </BottomSheetScrollView>
            </BottomSheet>

            <Modal transparent visible={invoicePickerOpen} animationType="fade" onRequestClose={() => setInvoicePickerOpen(false)}>
                <TouchableOpacity style={styles.invoiceModalOverlay} activeOpacity={1} onPress={() => setInvoicePickerOpen(false)}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.invoiceModalCard}>
                        <Text style={styles.invoiceModalTitle}>Bill which job?</Text>
                        <Text style={styles.invoiceModalSub}>Only jobs with a saved quote are listed.</Text>
                        <ScrollView style={styles.invoiceModalList} keyboardShouldPersistTaps="handled">
                            {jobsReadyToInvoice.map((j) => (
                                <TouchableOpacity
                                    key={j.id}
                                    style={styles.invoiceModalRow}
                                    onPress={() => {
                                        setInvoicePickerOpen(false);
                                        navigation.navigate('CreateInvoice', { job: j });
                                    }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.invoiceModalRowTitle}>{j.customerName || j.customer?.name || 'Customer'}</Text>
                                        <Text style={styles.invoiceModalRowSub} numberOfLines={2}>
                                            {j.categoryName || j.category?.name || 'Service'} · Job #{j.jobNo ?? j.displayId ?? '—'}
                                        </Text>
                                    </View>
                                    <Text style={styles.invoiceModalRowAmt}>
                                        ${Number(j.estimate?.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.invoiceModalCancel} onPress={() => setInvoicePickerOpen(false)}>
                            <Text style={styles.invoiceModalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    mapContainer: { flex: 1, position: 'relative', backgroundColor: '#E8F0FE' },
    mapImg: { width: '100%', height: '100%' },

    // Google Maps Style Pins Same-to-Same
    locationPinWrapper: { alignItems: 'center', width: 30, height: 40 },
    locationPinMainCircle: {
        width: 28, height: 28, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#FFF',
        elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4, shadowRadius: 5,
    },
    locationPinInnerWhiteDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF' },
    locationPinSharpTail: {
        width: 0, height: 0,
        backgroundColor: 'transparent',
        borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 12,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        marginTop: -4,
        elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35, shadowRadius: 3,
    },

    // Current Location with Beam
    currentLocMarkerContainer: { alignItems: 'center', justifyContent: 'center' },
    currentLocMarker: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
    locDirectionBeam: {
        position: 'absolute',
        width: 0, height: 0,
        borderLeftWidth: 35, borderRightWidth: 35, borderBottomWidth: 70,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderBottomColor: 'rgba(66, 133, 244, 0.15)',
        transform: [{ rotate: '0deg' }, { translateY: -35 }], // Pointing up
        opacity: 0.5,
    },
    blueOuterGlow: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(66, 133, 244, 0.2)' },
    blueCoreInner: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#4285F4', alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.35, shadowRadius: 3 },
    whiteBorderRing: { width: 20, height: 20, borderRadius: 10, borderWidth: 2.5, borderColor: '#FFF', position: 'absolute' },

    searchContainer: { position: 'absolute', left: 16, right: 16, zIndex: 10 },
    searchBar: { height: 52, backgroundColor: '#FFFFFF', borderRadius: 26, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, ...SHADOWS.medium },
    googleIconMap: { width: 30, height: 30, resizeMode: 'contain', marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, color: '#1A202C' },
    avatar: { width: 34, height: 34, borderRadius: 17, marginLeft: 6 },
    
    // Google UI Clone Styles
    googleHeader: {
        height: 110, backgroundColor: '#FFFFFF', flexDirection: 'row', 
        alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, 
        borderBottomColor: '#F1F3F4'
    },
    googleSearchInput: { flex: 1, fontSize: 18, color: '#3C4043', marginHorizontal: 16 },
    
    quickActionRow: { flexDirection: 'row', padding: 16, gap: 10 },
    quickBox: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', 
        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, gap: 10,
        borderWidth: 1, borderColor: '#DADCE0'
    },
    qIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8F0FE', alignItems: 'center', justifyContent: 'center' },
    qTitle: { fontSize: 14, fontWeight: '600', color: '#3C4043' },
    qSub: { fontSize: 12, color: '#70757A' },

    googleDivider: { height: 8, backgroundColor: '#F8F9FA', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F1F3F4' },
    recentLabelRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
    recentMainLabel: { fontSize: 16, fontWeight: '700', color: '#3C4043' },

    googleHistoryRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F3F4', alignItems: 'center' },
    googleIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F3F4', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    googlePlaceName: { fontSize: 16, color: '#3C4043', fontWeight: '500' },
    googlePlaceAddr: { fontSize: 13, color: '#70757A', marginTop: 2 },
    
    googleDropdownFloating: {
      backgroundColor: '#FFFFFF', borderRadius: 20, marginTop: 10,
      ...SHADOWS.large, elevation: 15, borderWidth: 1, borderColor: '#F1F3F4',
      paddingVertical: 10
    },
    closeDropdownLink: { padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F3F4' },
    closeDropdownText: { color: '#1A73E8', fontWeight: '700' },
    googleStatus: { fontSize: 13, marginTop: 2, fontWeight: '500' },

    moreHistoryLink: { padding: 20, alignItems: 'center' },
    moreHistoryText: { color: '#1967D2', fontSize: 15, fontWeight: '600' },
    googleSearchWrapperWorker: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        borderRadius: 24, paddingHorizontal: 12, height: 50, ...SHADOWS.medium,
    },
    searchInputCustomWorker: {
        height: 40, color: '#1A202C', fontSize: 13, fontWeight: '600',
    },
    googleIconMapSmall: { width: 24, height: 24, marginRight: 8 },
    avatarMini: { width: 32, height: 32, borderRadius: 16 },
    weatherWidgetMap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 24, ...SHADOWS.medium },
    weatherTempMap: { fontSize: 13, fontWeight: '700', color: '#1A202C' },
    weatherLocMap: { fontSize: 10, color: '#718096' },

    mapButtonsRight: { position: 'absolute', right: 20, zIndex: 110, gap: 15, alignItems: 'center' },
    navCircleBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
    dirSquareBtn: { width: 56, height: 52, borderRadius: 14, backgroundColor: '#007A8A', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },

    mapOverlay: { position: 'absolute', left: 0, right: 0, zIndex: 100 },
    pin: { position: 'absolute' },
    legendChipSheet: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, ...SHADOWS.small },
    legendChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, ...SHADOWS.medium },
    legendText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
    currentLocMarker: { alignItems: 'center', justifyContent: 'center' },
    blueCore: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#2563EB', borderWidth: 2, borderColor: '#FFF' },
    pulseDisk: { position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(37, 99, 235, 0.2)' },

    sheetBackground: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
    },
    sheetHandle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2 },

    tabsWrapper: { marginTop: 4, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    tabsScrollContainer: { paddingHorizontal: 16, paddingRight: 60, gap: 12 },
    tabBtn: { paddingHorizontal: 4, paddingVertical: 14, marginHorizontal: 8 },
    activeTabBtn: { borderBottomWidth: 3, borderBottomColor: '#0062E1' },
    tabBtnText: { fontSize: 14, fontWeight: '500', color: '#718096' },
    activeTabBtnText: { color: '#0062E1', fontWeight: '700' },

    sheetContent: { padding: 20 },
    tabScrollContent: { paddingBottom: 20 },

    detailedJobCard: { backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 16, ...SHADOWS.small, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
    galleryImg: { width: '100%', height: 120 },
    detailedInfo: { padding: 15 },
    detailedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    jobName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
    jobAddr: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
    jobPrice: { fontSize: 16, fontWeight: '800', color: '#0062E1' },
    jobPriceSub: { fontSize: 11, color: '#64748B', marginTop: 2, maxWidth: 160 },
    priceUnit: { fontSize: 11, fontWeight: '400', color: COLORS.textTertiary },
    actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
    actionBtn: { flex: 1, height: 36, backgroundColor: '#EFF6FF', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    actionText: { fontSize: 12, fontWeight: '600', color: '#0062E1' },

    dataCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    cardId: { fontSize: 12, fontWeight: '700', color: COLORS.textTertiary },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
    statusText: { fontSize: 10, fontWeight: '700' },
    cardCustomer: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
    cardAmount: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginTop: 5 },
    placeholder: { textAlign: 'center', marginTop: 40, color: COLORS.textTertiary },

    // Map Pin Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    pinCard: { width: windowWidth * 0.94, backgroundColor: '#FFFFFF', borderRadius: 28, overflow: 'hidden', ...SHADOWS.large },
    cardImagesRow: { flexDirection: 'row', padding: 12, gap: 10 },
    cardThumb: { flex: 1, height: 110, borderRadius: 16 },
    cardContent: { paddingHorizontal: 16, paddingBottom: 20 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    cardNameLine: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    cardName: { fontSize: 20, fontWeight: '800', color: '#1A202C' },
    upcomingBadge: { backgroundColor: '#F0EFFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    upcomingText: { color: '#8B5CF6', fontSize: 11, fontWeight: '700' },
    cardAddr: { fontSize: 13, color: '#718096', marginTop: 6, lineHeight: 18 },
    cardDistRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    cardDistText: { fontSize: 12, color: '#718096' },
    cardDistDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#718096', marginHorizontal: 8 },
    cardPriceBox: { alignItems: 'flex-end' },
    cardPriceText: { fontSize: 20, fontWeight: '800', color: '#1A202C' },
    cardPerHr: { fontSize: 12, color: '#94A3B8', fontWeight: '400' },
    cardActions: { flexDirection: 'row', gap: 6, marginTop: 16 },
    blueActionBtnLight: { flex: 1, height: 44, backgroundColor: '#F0F7FF', borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 4 },
    blueActionTextLight: { fontSize: 10, fontWeight: '700', color: '#0062E1' },
    shareBtnSmall: { flex: 1, height: 44, backgroundColor: '#F0F7FF', borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 4 },
    directionsIconContainer: { width: 18, height: 18, backgroundColor: '#0062E1', borderRadius: 5, transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center' },

    // Overview Styles
    filterRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
    filterChipActive: { backgroundColor: '#1A202C', borderColor: '#1A202C' },
    filterText: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
    filterTextActive: { color: '#fff' },

    overviewMainCard: { backgroundColor: '#F8FAFC', borderRadius: 24, padding: 20, marginBottom: 24 },
    overviewTitle: { fontSize: 20, fontWeight: '700', color: '#1A202C', marginBottom: 4 },
    overviewSub: { fontSize: 12, color: '#718096', marginBottom: 20 },

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    statBox: {
        width: (windowWidth - 92) / 2,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...SHADOWS.small
    },
    statIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    statLabelSmall: { fontSize: 11, color: '#718096', marginBottom: 4 },
    statValueBig: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 4 },
    statTrendGreen: { fontSize: 11, color: '#16A34A', fontWeight: '700' },
    statTrendLabel: { color: '#718096', fontWeight: '400' },

    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A202C', marginBottom: 16 },
    updatesList: { gap: 16 },
    updateItem: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    updateIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    updateContent: { flex: 1 },
    updateText: { fontSize: 14, fontWeight: '600', color: '#1A202C' },
    updateMeta: { fontSize: 11, color: '#718096', marginTop: 2 },

    // Jobs Tab Styles (Horizontal)
    jobSectionHeader: { fontSize: 18, fontWeight: '700', color: '#1A202C', marginBottom: 16, marginTop: 10 },
    horizontalJobCard: { width: windowWidth * 0.8, backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', ...SHADOWS.small, borderWidth: 1, borderColor: '#F1F5F9' },
    horizJobImg: { width: '100%', height: 180 },
    horizJobBottom: { padding: 12, backgroundColor: '#FAEDB4' }, // Matched soft amber/yellow background

    horizInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    horizNameLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    horizJobName: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
    miniBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    miniBadgeText: { fontSize: 10, fontWeight: '700' },
    horizJobPrice: { fontSize: 16, fontWeight: '800', color: '#1A202C' },
    horizPerHr: { fontSize: 10, color: '#718096', fontWeight: '400' },
    horizJobAddr: { fontSize: 11, color: '#718096', marginBottom: 4 },
    horizJobDist: { fontSize: 11, color: '#718096' },
    seeMoreBtn: {
        height: 48, backgroundColor: '#EDF2F7', borderRadius: 24,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginTop: 20, gap: 8
    },
    seeMoreText: { fontSize: 14, fontWeight: '600', color: '#4A5568' },

    // Detailed Jobs Styles
    detailedSearchRow: { flexDirection: 'row', gap: 12, marginBottom: 20, alignItems: 'center' },
    detailedSearchBox: { flex: 1, height: 50, backgroundColor: '#fff', borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, ...SHADOWS.medium, borderWidth: 1, borderColor: '#F1F5F9' },
    detailedSearchText: { fontSize: 16, fontWeight: '600', color: '#1A202C' },
    weatherWidgetDetailed: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8, ...SHADOWS.small },
    weatherTempDetailed: { fontSize: 14, fontWeight: '700' },
    weatherLocDetailed: { fontSize: 10, color: '#718096' },

    detailedVerticalCard: { backgroundColor: '#fff', borderRadius: 28, marginBottom: 24, overflow: 'hidden', ...SHADOWS.small, borderWidth: 1, borderColor: '#F1F5F9', paddingVertical: 16 },
    cardCarousel: { marginBottom: 16, paddingLeft: 16 },
    carouselImg: { width: 140, height: 110, borderRadius: 16 },
    detailedCardInfo: { paddingHorizontal: 16 },

    detailedHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24, paddingHorizontal: 4 },
    backButtonMini: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
    jobSectionHeaderMain: { fontSize: 24, fontWeight: '800', color: '#1A202C' },

    subcontractBadge: { backgroundColor: '#F0F9FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    subcontractText: { color: '#0EA5E9', fontSize: 11, fontWeight: '700' },

    // Shared Card Styles
    cardType: { fontSize: 13, color: '#718096', marginTop: 2 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    cardDate: { fontSize: 12, color: '#A0AEC0' },

    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 14, color: '#A0AEC0', marginTop: 12 },

    createBtnFloating: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        backgroundColor: '#0E56D0',
        borderRadius: 28,
        marginTop: 20,
        gap: 8,
        ...SHADOWS.medium
    },
    createBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    // Quote Tab Advanced Styles (Admin-Matched)
    inlineSearch: { height: 50, backgroundColor: '#fff', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0', ...SHADOWS.small },
    inlineSearchInput: { flex: 1, fontSize: 14, color: '#1A202C', marginLeft: 8 },
    statusChipsRow: { marginBottom: 16 },
    statusChip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
    activeStatusChipDark: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
    statusChipText: { fontSize: 13, color: '#718096' },
    activeStatusChipTextWhite: { color: '#fff', fontWeight: '700' },

    sectionTitleSmall: { fontSize: 16, fontWeight: '700', color: '#1A202C', marginBottom: 16 },
    quoteCardDetailed: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9', ...SHADOWS.small },
    cardHeaderDetailed: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    billingId: { fontSize: 14, fontWeight: '700', color: '#718096' },
    statusBadgeDetailed: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusBadgeTextDetailed: { fontSize: 10, fontWeight: '700' },

    billingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    billingLabel: { fontSize: 13, color: '#718096' },
    billingValue: { fontSize: 13, fontWeight: '600', color: '#1A202C' },

    viewDetailsLinkLeft: { borderTopWidth: 1, borderTopColor: '#F1F5F9', marginTop: 12, paddingTop: 12, alignItems: 'flex-start' },
    viewDetailsTextPurple: { fontSize: 13, fontWeight: '700', color: '#9333EA', textDecorationLine: 'underline' },

    createBtnFloatingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        backgroundColor: '#0E56D0',
        borderRadius: 28,
        marginTop: 20,
        gap: 10,
        ...SHADOWS.medium
    },
    createBtnTextPill: { color: '#fff', fontSize: 16, fontWeight: '800' },

    // Schedule / Agenda Styles
    agendaItem: { flexDirection: 'row', minHeight: 140 },
    agendaTimeline: { width: 34, alignItems: 'center', paddingTop: 4 },
    agendaDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    activeDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0062E1' },
    agendaLine: { width: 2, flex: 1, backgroundColor: '#F1F5F9', marginTop: -2, marginBottom: -2 },
    agendaContent: { flex: 1, paddingBottom: 24, paddingLeft: 4 },
    agendaCard: { backgroundColor: '#F8F9FB', borderRadius: 24, padding: 20, overflow: 'hidden' },
    activeTopBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: '#DBEAFE' },
    agendaName: { fontSize: 18, fontWeight: '800', color: '#1A202C' },
    agendaType: { fontSize: 12, color: '#718096', marginBottom: 16 },
    agendaPricingRow: { marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    agendaPricingPrimary: { fontSize: 17, fontWeight: '800', color: '#0062E1' },
    agendaPricingSecondary: { fontSize: 12, color: '#64748B', marginTop: 2 },
    agendaInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    agendaInfoText: { fontSize: 13, color: '#4A5568', fontWeight: '500' },
    agendaActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
    agendaBtnSecondary: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#718096', alignItems: 'center', justifyContent: 'center' },
    agendaBtnPrimary: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#0E56D0', alignItems: 'center', justifyContent: 'center' },
    agendaBtnTextSecondary: { fontSize: 14, fontWeight: '700', color: '#4A5568' },
    agendaBtnTextPrimary: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFF',
    },
    browseLeadsBtn: {
        marginTop: 20,
        backgroundColor: '#0062E1',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    browseLeadsText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 15,
    },
    agendaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    agendaStatusBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    agendaStatusText: {
        color: '#1E40AF',
        fontSize: 12,
        fontWeight: '700',
    },

    // Invoice Specific Styles
    billingSummaryCard: { backgroundColor: '#F8FAFC', borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#EDF2F7' },
    summaryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    summaryTitle: { fontSize: 18, fontWeight: '700', color: '#1A202C' },
    summarySub: { fontSize: 12, color: '#718096', marginTop: 2 },
    monthPicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', gap: 6 },
    monthText: { fontSize: 13, color: '#4A5568', fontWeight: '500' },
    summaryTable: { backgroundColor: '#fff', borderRadius: 16, padding: 4, marginBottom: 20 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F7FAFC' },
    summaryLabel: { fontSize: 14, color: '#4A5568' },
    summaryValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
    newInvoiceBtn: { backgroundColor: '#0062E1', height: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    newInvoiceBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

    invoiceModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15,23,42,0.45)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    invoiceModalCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 18,
        maxHeight: windowHeight * 0.62,
    },
    invoiceModalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
    invoiceModalSub: { fontSize: 13, color: '#64748B', marginTop: 6, marginBottom: 14 },
    invoiceModalList: { maxHeight: windowHeight * 0.42 },
    invoiceModalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        gap: 10,
    },
    invoiceModalRowTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
    invoiceModalRowSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
    invoiceModalRowAmt: { fontSize: 15, fontWeight: '800', color: '#0062E1' },
    invoiceModalCancel: { marginTop: 14, alignItems: 'center', paddingVertical: 10 },
    invoiceModalCancelText: { fontSize: 15, fontWeight: '600', color: '#64748B' },

    // Custom Bottom Nav
    bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    navItem: { alignItems: 'center' },
    activePill: { backgroundColor: '#DBEAFE', paddingHorizontal: 22, paddingVertical: 6, borderRadius: 20, marginBottom: 4 },
    activeText: { color: '#0E56D0', fontSize: 11, fontWeight: '700' },
    dot: { position: 'absolute', top: -1, right: -1, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 1.5, borderColor: '#FFF' },
    statCard: {
        width: (windowWidth - 48 - 12) / 2, // Adjusted for grid
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...SHADOWS.small
    },
    statIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    statLabel: { fontSize: 11, color: '#718096', marginBottom: 4 },
    statValue: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 4 },
    statChange: { fontSize: 11, fontWeight: '700' },
    progressContainer: { marginTop: 10, marginBottom: 20 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    progressLabel: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
    progressValue: { fontSize: 13, fontWeight: '700' },
    progressBg: { height: 8, backgroundColor: '#EDF2F7', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4 },
});