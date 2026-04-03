import React, { useState, useRef, useMemo, useEffect } from 'react';
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
} from 'react-native';
import { WebView } from 'react-native-webview';
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { ScrollView as GestureHandlerScrollView } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES, FONTS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, interpolate, Extrapolate } from 'react-native-reanimated';
import { getAvailableLeads, acceptLead, getWorkerJobs, getJobsForMap } from '../../api/apiService';
import storage from '../../api/storage';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const getImgSource = (img) => {
    if (!img) return require('../../assets/images/wood_flooring_job.png');
    return typeof img === 'number' ? img : { uri: img };
};

const TABS = ['Summary', 'Jobs'];

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
    const [activeTab, setActiveTab] = useState('Summary');
    const [selectedPin, setSelectedPin] = useState(null);
    const [quoteFilter, setQuoteFilter] = useState('All');
    const [invoiceFilter, setInvoiceFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState('');
    const webViewRef = useRef(null);
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

    const pinsAnimatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            animatedIndex.value,
            [0, 0.3],
            [1, 0],
            Extrapolate.CLAMP
        );
        return { opacity };
    });

    useEffect(() => {
        if (route.params?.activeTab) {
            setActiveTab(route.params.activeTab || 'Summary');
        }
    }, [route.params?.activeTab]);

    const [leads, setLeads] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [mapJobs, setMapJobs] = useState([]);
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

    const fetchMapData = async () => {
        const res = await getJobsForMap();
        if (res.success) {
            setMapJobs(res.data || []);
        }
    };

    useEffect(() => {
        fetchLeads();
        fetchJobs();
        fetchMapData();
    }, []);

    useEffect(() => {
        if (activeTab === 'Schedule') {
            fetchJobs();
        }
    }, [activeTab]);

    const handleAcceptLead = async (leadId) => {
        // Check if guest — redirect to login
        const token = await storage.getItem('userToken');
        if (!token) {
            alert('Please log in to accept leads and start working.');
            navigation.navigate('WorkerLogin');
            return;
        }
        const res = await acceptLead(leadId);
        if (res.success) {
            alert('Lead Accepted! A new job has been created for you.');
            fetchLeads();
        } else {
            alert(res.message || 'Failed to accept lead');
        }
    };

    // Build Leaflet HTML with real leads & jobs markers
    const buildLeafletHTML = (leadsData, jobsMapData) => {
        const leadMarkers = leadsData.map((lead, i) => {
            // Using actual coords if available, otherwise fallback to spread Indore city coords
            const lat = lead.latitude || (22.6 + (i * 0.04) % 0.5);
            const lng = lead.longitude || (75.8 + (i * 0.05) % 0.5);
            const title = lead.customer?.name || 'Lead';
            const loc = lead.location || '';
            const cat = lead.category?.name || 'Service';
            return `L.circleMarker([${lat}, ${lng}], {
                radius: 14, color: '#fff', weight: 2,
                fillColor: '#F59E0B', fillOpacity: 1
            }).addTo(map).bindPopup('<b>${title}</b><br>${cat}<br><small>${loc}</small>')
            .on('click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({type:'lead',id:'${lead.id}',name:'${title}',loc:'${loc}',cat:'${cat}'}));
            });`;
        }).join('\n');

        const jobMarkers = jobsMapData.map((job, i) => {
            // Using actual coords if available, otherwise fallback
            const lat = job.latitude || (22.7 + (i * 0.03) % 0.4);
            const lng = job.longitude || (75.9 + (i * 0.04) % 0.4);
            const title = job.customerName || 'Job';
            const loc = job.location || '';
            const statusLabel = job.status || '';
            return `L.circleMarker([${lat}, ${lng}], {
                radius: 12, color: '#fff', weight: 2,
                fillColor: '#8B5CF6', fillOpacity: 1
            }).addTo(map).bindPopup('<b>${title}</b><br>Status: ${statusLabel}<br><small>${loc}</small>')
            .on('click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({type:'job',id:'${job.id}',name:'${title}',loc:'${loc}'}));
            });`;
        }).join('\n');

        return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #map { width: 100%; height: 100%; }
  .leaflet-control-zoom { display: none; }
  .leaflet-popup-content-wrapper { border-radius: 12px; font-family: sans-serif; font-size: 13px; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([22.7196, 75.8577], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  ${leadMarkers}
  ${jobMarkers}

  // Current location pulse marker
  var currentLoc = L.circleMarker([22.7196, 75.8577], {
    radius: 10, color: '#0062E1', weight: 3,
    fillColor: '#4299E1', fillOpacity: 0.9
  }).addTo(map).bindPopup('You are here');
<\/script>
</body>
</html>`;
    };

    // Handle messages from WebView (pin taps)
    const handleMapMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'lead') {
                navigation.navigate('Chat', {
                    name: data.name,
                    id: data.id,
                    location: data.loc
                });
            } else if (data.type === 'job') {
                navigation.navigate('Chat', { 
                    name: data.name,
                    jobId: data.id, 
                    location: data.loc 
                });
            }
        } catch (e) { /* ignore parse errors */ }
    };

    // Inject updated markers into Leaflet map when data changes
    const injectMapMarkers = () => {
        if (!webViewRef.current) return;
        const js = `
            document.querySelectorAll('.leaflet-interactive').forEach(el => {
                if (!el.classList.contains('current-loc')) el.remove();
            });
        `;
        webViewRef.current.injectJavaScript(js);
    };

    const renderSummary = () => (
        <View style={styles.tabScrollContent}>
            <View style={styles.overviewMainCard}>
                <Text style={styles.overviewTitle}>Welcome Back!</Text>
                <Text style={styles.overviewSub}>Manage your jobs via chat.</Text>
                
                <View style={styles.statsGrid}>
                    <StatCard 
                        icon="briefcase" 
                        label="Active Jobs" 
                        value="12" 
                        change="+2 this week" 
                        color="#3B82F6" 
                    />
                    <StatCard 
                        icon="people" 
                        label="New Leads" 
                        value={leads.length.toString()} 
                        change="Live update" 
                        color="#F59E0B" 
                    />
                    <StatCard 
                        icon="trending-up" 
                        label="Revenue" 
                        value="$4.2k" 
                        change="+15% surge" 
                        color="#10B981" 
                    />
                    <StatCard 
                        icon="star" 
                        label="Rating" 
                        value="4.9" 
                        change="Top Rated" 
                        color="#8B5CF6" 
                    />
                </View>
            </View>

            <Text style={styles.sectionTitle}>Performance Goals</Text>
            <ProgressBar label="Weekly Target" value="$5,000 / $7,500" progress={0.65} color="#3B82F6" />
            <ProgressBar label="Jobs Completed" value="18 / 25" progress={0.72} color="#10B981" />
            
            <View style={{ height: 20 }} />
            <Text style={styles.sectionTitle}>Recent Updates</Text>
            <View style={styles.updatesList}>
                <View style={styles.updateItem}>
                    <View style={[styles.updateIcon, { backgroundColor: '#DBEAFE' }]}>
                        <Ionicons name="notifications" size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.updateContent}>
                        <Text style={styles.updateText}>New Lead assigned in Boulder</Text>
                        <Text style={styles.updateMeta}>2 mins ago • High Priority</Text>
                    </View>
                </View>
                <View style={styles.updateItem}>
                    <View style={[styles.updateIcon, { backgroundColor: '#DCFCE7' }]}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    </View>
                    <View style={styles.updateContent}>
                        <Text style={styles.updateText}>Job #1024 marked as Completed</Text>
                        <Text style={styles.updateMeta}>1 hour ago • $1,200.00</Text>
                    </View>
                </View>
            </View>
        </View>
    );

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
                    {leads.map((lead) => (
                        <TouchableOpacity
                            key={lead.id}
                            style={styles.detailedVerticalCard}
                            onPress={() => navigation.navigate('Chat', { name: lead.customer?.name, id: lead.id, location: lead.location })}
                            activeOpacity={0.9}
                        >
                            <Image 
                                source={require('../../assets/images/wood_flooring_job.png')} 
                                style={[styles.horizJobImg, { height: 160 }]} 
                            />
                            <View style={styles.detailedCardInfo}>
                                <View style={styles.detailedHeader}>
                                    <View>
                                        <Text style={styles.jobName}>{lead.customer?.name || 'Customer'}</Text>
                                        <Text style={styles.jobAddr}>{lead.location}</Text>
                                    </View>
                                    <View style={styles.subcontractBadge}>
                                        <Text style={styles.subcontractText}>{lead.category?.name || 'LEAD'}</Text>
                                    </View>
                                </View>
                                <View style={styles.cardFooter}>
                                    <Text style={styles.jobPrice}>$43 <Text style={styles.priceUnit}>/hr</Text></Text>
                                    <TouchableOpacity 
                                        style={[styles.actionBtn, { maxWidth: 120 }]}
                                        onPress={() => navigation.navigate('Chat', { name: lead.customer?.name, id: lead.id, location: lead.location })}
                                    >
                                        <Text style={styles.actionText}>Chat Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    const renderSchedule = () => (
        <View style={styles.tabScrollContent}>
            <Text style={styles.sectionTitle}>My Schedule</Text>
            {jobs.length === 0 ? (
                <View style={[styles.emptyState, { marginTop: 40 }]}>
                    <Ionicons name="calendar-outline" size={60} color="#CBD5E0" />
                    <Text style={styles.emptyText}>No scheduled jobs yet.</Text>
                </View>
            ) : (
                <View style={{ marginTop: 20 }}>
                    {jobs.map((job, index) => (
                        <View key={job.id} style={styles.agendaItem}>
                            <View style={styles.agendaTimeline}>
                                <View style={styles.agendaDot}>
                                    <View style={styles.activeDotInner} />
                                </View>
                                {index !== jobs.length - 1 && <View style={styles.agendaLine} />}
                            </View>
                            <View style={styles.agendaContent}>
                                <View style={styles.agendaCard}>
                                    <View style={styles.activeTopBar} />
                                    <Text style={styles.agendaName}>{job.customerName || 'Customer'}</Text>
                                    <Text style={styles.agendaType}>{job.categoryName || 'Service'}</Text>
                                    <View style={styles.agendaInfoRow}>
                                        <Ionicons name="time-outline" size={14} color="#718096" />
                                        <Text style={styles.agendaInfoText}>Today, 09:00 AM</Text>
                                    </View>
                                    <View style={styles.agendaInfoRow}>
                                        <Ionicons name="location-outline" size={14} color="#718096" />
                                        <Text style={styles.agendaInfoText} numberOfLines={1}>{job.location || 'Address not set'}</Text>
                                    </View>
                                    <View style={styles.agendaActions}>
                                        <TouchableOpacity 
                                            style={[styles.agendaBtnSecondary, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}
                                            onPress={() => navigation.navigate('Chat', { 
                                                jobId: job.id, 
                                                name: job.customerName,
                                                location: job.location
                                            })}
                                        >
                                            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#0369A1" />
                                            <Text style={[styles.agendaBtnTextSecondary, { color: '#0369A1' }]}>Chat</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" />

            {/* Leaflet / OpenStreetMap */}
            <View style={styles.mapContainer}>
                <WebView
                    ref={webViewRef}
                    source={{ html: buildLeafletHTML(leads, mapJobs) }}
                    style={styles.mapImg}
                    originWhitelist={['*']}
                    onMessage={handleMapMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />

                <Animated.View style={[StyleSheet.absoluteFill, mapAnimatedStyle]} pointerEvents="box-none">

                    {/* Float Header / Search + Add Job */}
                    <View style={[styles.searchContainer, { top: insets.top + 10 }]}>
                        <View style={styles.searchBar}>
                            <Ionicons name="search" size={18} color="#718096" style={{ marginLeft: 12 }} />
                            <TextInput
                                style={[styles.searchInput, { color: '#1A202C' }]}
                                placeholder="Search location..."
                                placeholderTextColor="#718096"
                                value={searchQuery}
                                onFocus={() => setIsSearchFocused(true)}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={() => {
                                    setIsSearchFocused(false);
                                    if (webViewRef.current && searchQuery.trim()) {
                                        webViewRef.current.injectJavaScript(`
                                            fetch('https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}')
                                            .then(r => r.json()).then(d => {
                                                if (d[0]) map.setView([d[0].lat, d[0].lon], 14);
                                            });
                                        `);
                                    }
                                }}
                                returnKeyType="search"
                            />
                            <TouchableOpacity
                                style={styles.addJobMapBtn}
                                onPress={() => navigation.navigate('RequestService')}
                            >
                                <Ionicons name="add" size={18} color="#fff" />
                                <Text style={styles.addJobMapText}>Add Job</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Map Interaction Buttons Right */}
                    <Animated.View style={[styles.mapButtonsRight, buttonsAnimatedStyle]}>
                        <TouchableOpacity
                            style={styles.navCircleBtn}
                            onPress={() => {
                                if (webViewRef.current) {
                                    webViewRef.current.injectJavaScript(`map.setView([22.7196, 75.8577], 13); true;`);
                                }
                            }}
                        >
                            <Ionicons name="navigate" size={28} color="#0062E1" />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Legend chips above bottom sheet */}
                    <Animated.View style={[styles.mapOverlay, legendAnimatedStyle]}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
                            <TouchableOpacity style={[styles.legendChip, { backgroundColor: '#F59E0B' }]}><Text style={styles.legendText}>🟡 Leads</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.legendChip, { backgroundColor: '#8B5CF6' }]}><Text style={styles.legendText}>🟣 My Jobs</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.legendChip, { backgroundColor: '#0062E1' }]}><Text style={styles.legendText}>🔵 You</Text></TouchableOpacity>
                        </ScrollView>
                    </Animated.View>
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

                {/* Consolidated Summary & Jobs */}
                <BottomSheetScrollView contentContainerStyle={[styles.sheetContent, { paddingBottom: insets.bottom + 100 }]}>
                    {renderSummary()}
                    {renderJobs()}
                </BottomSheetScrollView>
            </BottomSheet>
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
    agendaInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    agendaInfoText: { fontSize: 13, color: '#4A5568', fontWeight: '500' },
    agendaActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
    agendaBtnSecondary: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#718096', alignItems: 'center', justifyContent: 'center' },
    agendaBtnPrimary: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#0E56D0', alignItems: 'center', justifyContent: 'center' },
    agendaBtnTextSecondary: { fontSize: 14, fontWeight: '700', color: '#4A5568' },
    agendaBtnTextPrimary: { fontSize: 14, fontWeight: '700', color: '#fff' },

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
    addJobMapBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#0062E1',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
    },
    addJobMapText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: FONTS.bold,
    },
});