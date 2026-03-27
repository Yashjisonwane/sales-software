import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
  Image,
  Alert,
  Modal,
  Pressable,
  Keyboard,
  FlatList as RNFlatList,
} from 'react-native';
import { WebView } from 'react-native-webview';

const getImgSource = (img) => {
  if (!img) return require('../../assets/images/wood_flooring_job.png');
  return typeof img === 'number' ? img : { uri: img };
};
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { ScrollView as GestureHandlerScrollView, FlatList as GestureHandlerFlatList } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, FONTS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, interpolate, Extrapolate } from 'react-native-reanimated';
const { width, height } = Dimensions.get('window');

const PINS = [
  { id: 1024, type: 'lead', color: '#8250DF', top: '30%', left: '25%', name: 'Sarah Mitchell', amount: '$850', status: 'New' },
  { id: 1025, type: 'subcontract', color: '#004D40', top: '45%', left: '60%', name: 'Michael Chen', amount: '$1,200', status: 'Quoted' },
  { id: 1026, type: 'lead', color: '#8250DF', top: '55%', left: '35%', name: 'John Miller', amount: '$650', status: 'In Progress' },
  { id: 1027, type: 'delayed', color: '#E53935', top: '35%', left: '70%', name: 'Emma Davis', amount: '$2,100', status: 'Delayed' },
  { id: 1028, type: 'lead', color: '#8250DF', top: '20%', left: '45%', name: 'Robert Wilson', amount: '$900', status: 'New' },
  { id: 1029, type: 'subcontract', color: '#004D40', top: '65%', left: '30%', name: 'Lisa Ray', amount: '$1,500', status: 'Active' },
  { id: 1030, type: 'delayed', color: '#E53935', top: '15%', left: '75%', name: 'David Jones', amount: '$3,400', status: 'Delayed' },
  { id: 1031, type: 'subcontract', color: '#004D40', top: '40%', left: '33%', name: 'Kevin Hart', amount: '$1,100', status: 'Pending' },
  { id: 1032, type: 'lead', color: '#8250DF', top: '10%', left: '42%', name: 'Alice Wong', amount: '$2,500', status: 'New' },
  { id: 1033, type: 'subcontract', color: '#004D40', top: '75%', left: '60%', name: 'Marcus Aurelius', amount: '$800', status: 'Active' },
];

const AGENDA_DATA = [
  { id: '1', name: 'Sarah Miller', type: 'Pre-Inspection', time: '09:00 AM', location: '123 E Market St Boulder, CO 80304,USA', status: 'active' },
  { id: '2', name: 'The Johnson Family', type: 'HVAC Repair', time: '11:30 AM', location: '123 E Market St Boulder, CO 80304,USA', status: 'pending' },
  { id: '3', name: 'John Smith', type: 'Quote Follow-Up', time: '02:30 PM', location: '123 E Market St Boulder, CO 80304,USA', status: 'pending' },
  { id: '4', name: 'Acme Corp', type: 'Contract Signing', time: '04:30 AM', location: '123 E Market St Boulder, CO 80304,USA', status: 'pending' },
];

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#dadada" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#c9c9c9" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  }
];

const StatCard = ({ icon, label, value, change, color }) => {
  const isJobsCard = label === 'Jobs In Progress' && change.includes('|');
  const isRevenue = label === 'Total Revenue';

  return (
    <View style={styles.statCardRefined}>
      <View style={[styles.statIconContainerRefined, { backgroundColor: color + '12' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.statLabelRefined}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2 }}>
        {isRevenue && <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A202C', marginBottom: 4, marginRight: 2 }}>$</Text>}
        <Text style={styles.statValueRefined}>{isRevenue ? value.replace('$', '') : value}</Text>
      </View>
      {isJobsCard ? (
        <Text style={styles.statChangeRefined}>
          <Text style={{ color: '#0E56D0', fontWeight: '800' }}>Lead: {change.split('|')[0].replace('Lead:', '').trim()}</Text>
          <Text style={{ color: '#CBD5E0' }}> | </Text>
          <Text style={{ color: '#8B5CF6', fontWeight: '800' }}>Sub: {change.split('|')[1].replace('Sub:', '').trim()}</Text>
        </Text>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name={change.includes('+') ? 'trending-up' : 'trending-down'}
            size={12}
            color={change.includes('+') ? '#10B981' : '#718096'}
          />
          <Text style={[styles.statChangeRefined, { color: change.includes('+') ? '#10B981' : '#718096', marginLeft: 4 }]}>
            {change}
          </Text>
        </View>
      )}
    </View>
  );
};

const ProgressBar = ({ label, value, progress, color, labelColor }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressHeader}>
      <Text style={[styles.progressLabel, { color: labelColor || COLORS.textSecondary }]}>{label}</Text>
      <Text style={[styles.progressValue, { color }]}>{value}</Text>
    </View>
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  </View>
);

const PerformerItem = ({ name, role, status, initials, color }) => (
  <View style={styles.performerItem}>
    <View style={[styles.performerAvatar, { backgroundColor: color }]}>
      <Text style={styles.performerInitials}>{initials}</Text>
    </View>
    <View style={styles.performerInfo}>
      <Text style={styles.performerName}>{name}</Text>
      <View style={styles.performerBadges}>
        <View style={styles.roleBadge}><Text style={styles.roleBadgeText}>{role}</Text></View>
        <View style={styles.activeStatusBadge}><Text style={styles.activeStatusBadgeText}>{status}</Text></View>
      </View>
    </View>
  </View>
);

const ActivityItem = ({ icon, label, sub, time, iconColor, iconBg }) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityIconContainer, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityLabel}>{label}</Text>
      <Text style={styles.activitySub}>{sub}</Text>
      {time && <Text style={styles.activityTime}>{time}</Text>}
    </View>
  </View>
);

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

const JobCard = ({ name, id, tag, time, images, navigation, onPress }) => (
  <View style={styles.jobCard}>
    <GestureHandlerScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.jobImages}
      contentContainerStyle={{ gap: 10, paddingRight: 20, paddingLeft: 16 }}
      snapToInterval={150} // 140 (img width) + 10 (gap)
      decelerationRate="fast"
      snapToAlignment="start"
      disallowInterruption={true}
    >
      {images.map((img, i) => (
        <TouchableOpacity 
          key={i} 
          onPress={onPress}
          activeOpacity={0.9}
        >
          <Image source={getImgSource(img)} style={styles.jobImage} />
        </TouchableOpacity>
      ))}
    </GestureHandlerScrollView>
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.jobInfo}>
      <View style={styles.jobInfoHeader}>
        <View style={styles.jobNameRow}>
          <Text style={styles.jobName}>{name}</Text>
          <View style={[styles.jobStatusBadge, { backgroundColor: tag === 'New' ? '#F5F3FF' : '#EFF6FF' }]}>
            <Text style={[styles.jobStatusText, { color: tag === 'New' ? '#8B5CF6' : '#3B82F6' }]}>{tag}</Text>
          </View>
        </View>
        <Text style={styles.jobId}>{id}</Text>
      </View>
      <Text style={styles.jobSubText}>123 E Market St Boulder, CO 80304,USA</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <Text style={styles.jobDistTime}>4.5 mi</Text>
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#64748B' }} />
        <Text style={styles.jobDistTime}>12 m</Text>
      </View>
      <Text style={styles.jobTime}><Text style={{ color: '#0E56D0' }}>Roof Repair</Text> • {time}</Text>

      <View style={styles.jobActions}>
        <ActionButton icon="navigate" label="Directions" />
        <ActionButton icon="call" label="Call" />
        <ActionButton icon="bookmark" label="Save" />
        <ActionButton icon="share-outline" label="Share" />
      </View>
    </TouchableOpacity>
  </View>
);

const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <Ionicons name={icon} size={18} color="#0062E1" />
    <Text style={styles.actionBtnText}>{label}</Text>
  </TouchableOpacity>
);

const AgendaItem = ({ item, index, isLast, navigation }) => (
  <View style={styles.agendaItemRow}>
    <View style={styles.agendaTimelineCol}>
      <View style={[styles.agendaDotPoint, item.status === 'active' && styles.activeDotPoint]}>
        {item.status === 'active' ? (
          <View style={styles.activeDotInnerPoint} />
        ) : (
          <View style={styles.inactiveDotPoint} />
        )}
      </View>
      {!isLast && <View style={styles.agendaTimelineLine} />}
    </View>
    <View style={styles.agendaContentCol}>
      <View style={styles.agendaCardDetailed}>
        {item.status === 'active' && <View style={styles.activeTopBarIndicator} />}
        <Text style={styles.agendaNameText}>{item.name}</Text>
        <Text style={styles.agendaTypeText}>{item.type}</Text>
        <View style={styles.agendaInfoLine}>
          <Ionicons name="time-outline" size={18} color="#4A5568" />
          <Text style={styles.agendaInfoValue}>{item.time}</Text>
        </View>
        <View style={{ height: 6 }} />
        <View style={[styles.agendaInfoLine, { marginBottom: 20 }]}>
          <Ionicons name="location-outline" size={18} color="#4A5568" />
          <Text style={styles.agendaInfoValue} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.agendaActionButtons}>
          <TouchableOpacity style={styles.agendaBtnSecondaryClean} onPress={() => navigation.navigate('Reschedule')}>
            <Text style={styles.agendaBtnSecondaryText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.agendaBtnPrimaryClean}
            onPress={() => navigation.navigate('LeadDetails')}
          >
            <Text style={styles.agendaBtnPrimaryText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const InvoiceCard = ({ id, customer, type, amount, status, navigation }) => (
  <View style={styles.billingCard}>
    <View style={styles.billingCardHeader}>
      <Text style={styles.billingId}>{id}</Text>
      <View style={[styles.statusBadge, { backgroundColor: status === 'Paid' ? '#ECFDF5' : '#FEF2F2' }]}>
        <Text style={[styles.statusBadgeText, { color: status === 'Paid' ? '#10B981' : '#EF4444' }]}>{status}</Text>
      </View>
    </View>
    <View style={styles.billingRow}>
      <Text style={styles.billingLabel}>Customer Name</Text>
      <Text style={styles.billingValue}>{customer}</Text>
    </View>
    <View style={styles.billingRow}>
      <Text style={styles.billingLabel}>Job Type</Text>
      <Text style={styles.billingValue}>{type}</Text>
    </View>
    <View style={styles.billingRow}>
      <Text style={styles.billingLabel}>Amount</Text>
      <Text style={[styles.billingValue, { fontWeight: '700' }]}>${amount}</Text>
    </View>
    <TouchableOpacity style={styles.viewDetailsLink} onPress={() => navigation?.navigate('ComingSoon', { title: 'Invoice Details' })}>
      <Text style={styles.viewDetailsText}>View Details</Text>
    </TouchableOpacity>
  </View>
);

const QuoteCard = ({ id, customer, type, date, amount, status, navigation }) => (
  <View style={styles.quoteCard}>
    <View style={styles.billingCardHeader}>
      <Text style={styles.billingId}>{id}</Text>
      <View style={[styles.statusBadge, { backgroundColor: status === 'Approved' ? '#ECFDF5' : status === 'Sent' ? '#EFF6FF' : '#FEF2F2' }]}>
        <Text style={[styles.statusBadgeText, { color: status === 'Approved' ? '#10B981' : status === 'Sent' ? '#3B82F6' : '#EF4444' }]}>{status}</Text>
      </View>
    </View>
    <View style={styles.billingRow}>
      <Text style={styles.billingLabel}>Customer Name</Text>
      <Text style={styles.billingValue} numberOfLines={1}>{customer}</Text>
    </View>
    <View style={styles.billingRow}>
      <Text style={styles.billingLabel}>Service Type</Text>
      <Text style={styles.billingValue} numberOfLines={1}>{type}</Text>
    </View>
    <View style={styles.billingRow}>
      <Text style={styles.billingLabel}>Created Date</Text>
      <Text style={styles.billingValue}>{date}</Text>
    </View>
    <View style={styles.billingRow}>
      <Text style={styles.billingLabel}>Amount</Text>
      <Text style={[styles.billingValue, { fontWeight: '700' }]}>${amount}</Text>
    </View>
    <TouchableOpacity
      style={styles.viewDetailsLink}
      onPress={() => navigation?.navigate('QuoteDetails', { id, customer, type, date, amount, status })}
    >
      <Text style={styles.viewDetailsText}>View Details</Text>
    </TouchableOpacity>
  </View>
);

const InfoRow = ({ label, value, isLast }) => (
  <View style={[styles.infoRowRefined, isLast && { borderBottomWidth: 0 }]}>
    <Text style={styles.infoLabelRefined}>{label}</Text>
    <Text style={styles.infoValueRefined}>{value}</Text>
  </View>
);

const generateMapHTML = (pins) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
  html,body,#map{margin:0;padding:0;height:100%;width:100%;}
  .leaflet-control-zoom,.leaflet-control-attribution{display:none!important;}
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map',{zoomControl:false,attributionControl:false}).setView([21.3069,-157.8583],15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);

  var pins = ${JSON.stringify(pins)};
  pins.forEach(function(pin){
    var dot = '<div style="width:30px;height:30px;border-radius:50%;background:'+pin.color+';border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg></div><div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid '+pin.color+';margin:auto;margin-top:-2px;"></div>';
    var icon = L.divIcon({html:dot,className:'',iconSize:[30,40],iconAnchor:[15,40]});
    L.marker([pin.latitude,pin.longitude],{icon:icon}).addTo(map).on('click',function(){window.ReactNativeWebView.postMessage(JSON.stringify({type:'pinPress',pin:pin}));});
  });

  // Blue current location dot
  var locIcon = L.divIcon({html:'<div style="width:20px;height:20px;background:#4285F4;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 5px rgba(66,133,244,0.25);"></div>',className:'',iconSize:[20,20],iconAnchor:[10,10]});
  L.marker([21.3069,-157.8583],{icon:locIcon,zIndexOffset:2000}).addTo(map);
<\/script>
</body>
</html>
`;

export default function ExploreScreen({ navigation, route }) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isCreateQuoteOpen, setIsCreateQuoteOpen] = useState(false);
  const [quoteStep, setQuoteStep] = useState(0);
  const [showQuoteSuccess, setShowQuoteSuccess] = useState(false);
  const [overlayTab, setOverlayTab] = useState('Job Details');
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeFilter, setTimeFilter] = useState('All');
  const [invoiceFilter, setInvoiceFilter] = useState('All');
  const [quoteFilter, setQuoteFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  // Clean 'Silver' style Map URL matching the screenshot
  const [mapUrl, setMapUrl] = useState('https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29446.420299690402!2d75.85792000000001!3d22.6983936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1773493713074!5m2!1sen!2sin&hl=en&style=feature:all|element:labels|visibility:on&style=feature:landscape|element:geometry|color:0xf5f5f5&style=feature:water|element:geometry|color:0xc9c9c9');

  const tabs = ['Overview', 'Jobs', 'Schedule', 'Invoice', 'Quote'];
  const timeFilters = ['All', 'Weekly', 'Monthly', 'Yearly'];



  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['18%', '40%', '92%'], []);
  const insets = useSafeAreaInsets();

  const animatedIndex = useSharedValue(0);

  React.useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params?.activeTab]);

  const mapAnimatedStyle = useAnimatedStyle(() => {
    // Fade out later, starting when sheet is past the middle snap point (40%)
    const opacity = interpolate(
      animatedIndex.value,
      [1.3, 1.8], 
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
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
  const legendAnimatedStyle = useAnimatedStyle(() => {
    // 0 = 18%, 1 = 40%, 2 = 92% snap points
    const bottom = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [height * 0.18 + 10, height * 0.40 + 10, height * 0.92 + 10]
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
    // Buttons stay higher than legend (160 offset for safety)
    const bottom = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [height * 0.18 + 65, height * 0.40 + 65, height * 0.92 + 65]
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" transparent backgroundColor="transparent" translucent />
      <View style={styles.mapContainer}>
        {/* Google Map iframe */}
        <WebView
          source={{ html: `<iframe src="${mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` }}
          style={styles.mapPlaceholder}
          scalesPageToFit={true}
          scrollEnabled={false}
        />

        {/* All Map Pins - fade out when sheet scrolls up */}
        <Animated.View style={[StyleSheet.absoluteFill, pinsAnimatedStyle]} pointerEvents="box-none">
          {/* Job Location Pins */}
          {!selectedJob && !selectedPin && PINS.map(pin => (
            <TouchableOpacity
              key={pin.id}
              style={[styles.pin, { top: pin.top, left: pin.left }]}
              onPress={() => setSelectedPin(pin)}
            >
              <LocationPin color={pin.color} />
            </TouchableOpacity>
          ))}

          {/* Current Location Marker with Directional Beam */}
          <View style={[styles.currentLocMarkerContainer, { position: 'absolute', top: '48%', left: '48%', zIndex: 15 }]}>
            <CurrentLocationMarker />
          </View>
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFill, mapAnimatedStyle]} pointerEvents="box-none">
          {/* Search Bar matching screenshot */}
          {!selectedJob && !selectedPin && (
            <View style={[styles.searchContainer, { top: insets.top + 10 }]}>
              <View style={styles.searchBar}>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/512px-Google_Maps_icon_%282020%29.svg.png' }}
                  style={styles.googleIconMap}
                />
                <TextInput
                  style={[styles.searchInput, { color: '#1A202C' }]}
                  placeholder="Search for Home Leads"
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
                  <Image source={{ uri: 'https://i.pravatar.cc/100?u=admin' }} style={styles.profileAvatar} />
                </TouchableOpacity>
              </View>

              {/* Pixel-Perfect Google Search Dropdown (Lower Option) */}
              {isSearchFocused && (
                <View style={[styles.suggestionsOverlayFloating]}>
                  <ScrollView style={{ maxHeight: 400 }}>
                    {/* Recent History List */}
                    {[
                      { name: 'Indore Marriott Hotel', addr: 'H-2 Scheme No 54, Meghdhoot Garden...', icon: 'location-sharp' },
                      { name: 'marriott hotels & resorts', addr: '', icon: 'time-outline' },
                      { name: 'Bhopal Memorial Hospital', addr: 'Bhopal Bypass Road, BMHRC Campu...', icon: 'time-outline' },
                      { name: 'Savo Technologies', addr: '139 PU4, Behind C21 Mall, Vijay Nagar...', icon: 'time-outline' },
                    ].map((item, idx) => (
                      <TouchableOpacity 
                        key={idx} 
                        style={styles.historyRow}
                        onPress={() => {
                          setSearchQuery(item.name);
                          setMapUrl(`https://maps.google.com/maps?q=${encodeURIComponent(item.name)}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
                          setIsSearchFocused(false);
                          Keyboard.dismiss();
                        }}
                      >
                        <View style={styles.historyIconBox}>
                          <Ionicons name={item.icon} size={20} color="#5F6368" />
                        </View>
                        <View style={styles.historyTextContent}>
                           <Text style={styles.historyPlaceName} numberOfLines={1}>{item.name}</Text>
                           {item.addr ? <Text style={styles.historyPlaceAddr} numberOfLines={1}>{item.addr}</Text> : null}
                        </View>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.closeDropdownBtn} onPress={() => setIsSearchFocused(false)}>
                       <Text style={styles.closeDropdownText}>Close Suggestions</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              )}


              {/* Weather Widget */}
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
          )}



          {/* Map Interaction Buttons Right */}
          {!selectedJob && (
            <Animated.View style={[styles.mapButtonsRight, buttonsAnimatedStyle]}>
              <TouchableOpacity style={styles.navCircleBtn}>
                <Ionicons name="navigate" size={28} color="#0062E1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.dirSquareBtn}>
                <MaterialCommunityIcons name="directions" size={30} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Legend Chips precisely matching screenshot - now follows the sheet handle */}
          {!selectedJob && (
            <Animated.View style={[styles.legendContainer, legendAnimatedStyle]}>
              <View style={styles.legendWrapper}>
                <View style={[styles.legendChip, { backgroundColor: '#8B5CF6' }]}><Text style={styles.legendText}>Lead Jobs</Text></View>
                <View style={[styles.legendChip, { backgroundColor: '#10B981' }]}><Text style={styles.legendText}>Subcontract</Text></View>
                <View style={[styles.legendChip, { backgroundColor: '#EF4444' }]}><Text style={styles.legendText}>Delayed</Text></View>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </View>

      {/* Selected Job Modal - Lead/Job Detail (Alistair Hughes UI) */}
      <Modal
        visible={!!selectedJob}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedJob(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentRefined}>
            <View style={styles.sheetHandleContainer}>
              <View style={styles.sheetHandleBar} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedJob(null)} style={styles.headerActionIcon}>
                  <Ionicons name="chevron-down" size={24} color="#1A202C" />
                </TouchableOpacity>
                <View style={styles.modalHeaderActions}>
                  <TouchableOpacity style={styles.headerActionIcon}>
                    <Ionicons name="share-social-outline" size={22} color="#1A202C" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerActionIcon}>
                    <Ionicons name="ellipsis-horizontal" size={22} color="#1A202C" />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                <View style={styles.jobHeadline}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.jobTitleName}>{selectedJob?.name || 'Alistair Hughes'}</Text>
                      <View style={styles.newBadgeRefined}>
                        <Text style={styles.newBadgeTextRefined}>New</Text>
                      </View>
                    </View>
                    <Text style={styles.jobAddressRefined}>123 E Market St Boulder, CO 80304,USA</Text>
                    <Text style={styles.jobDistTime}>4.5 mi  •  12 m</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.jobRateValue}>$43 <Text style={styles.jobRateSub}>per hour</Text></Text>
                  </View>
                </View>

                <View style={styles.shortcutActionsRow}>
                  <TouchableOpacity style={styles.shortcutBtnFilled}>
                    <Ionicons name="navigate" size={20} color="#FFF" />
                    <Text style={[styles.shortcutBtnText, { color: '#FFF' }]}>Directions</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shortcutBtnOutline}>
                    <Ionicons name="call" size={20} color="#0062E1" />
                    <Text style={styles.shortcutBtnText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shortcutBtnOutline}>
                    <Ionicons name="bookmark" size={20} color="#0062E1" />
                    <Text style={styles.shortcutBtnText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shortcutBtnOutline}>
                    <Ionicons name="share-outline" size={20} color="#0062E1" />
                    <Text style={styles.shortcutBtnText}>Share</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.imageGridRefined}>
                  <View style={styles.largeImageWrapper}>
                    <Image source={getImgSource(selectedJob?.images?.[0])} style={styles.largeImageDetail} />
                    <View style={styles.imgTimeBadge}><Text style={styles.imgTimeText}>2 days ago</Text></View>
                  </View>
                  <View style={styles.smallImagesColumn}>
                    <View style={{ gap: 10 }}>
                      <View style={styles.smallImageWrapper}>
                        <Image source={getImgSource(selectedJob?.images?.[1] || require('../../assets/images/modern_kitchen_flooring.png'))} style={styles.smallImageDetail} />
                        <View style={styles.imgTimeBadge}><Text style={styles.imgTimeText}>2 days ago</Text></View>
                      </View>
                      <View style={styles.smallImageWrapper}>
                        <Image source={getImgSource(selectedJob?.images?.[2] || require('../../assets/images/construction_site_overview.png'))} style={styles.smallImageDetail} />
                        <View style={styles.imgTimeBadge}><Text style={styles.imgTimeText}>2 days ago</Text></View>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.overlayTabsRow}>
                  {['Job Details', 'Description', 'Photos', 'Updates'].map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.overlayTabBtn, overlayTab === t && styles.overlayTabBtnActive]}
                      onPress={() => setOverlayTab(t)}
                    >
                      <Text style={[styles.overlayTabTextRefined, overlayTab === t && styles.overlayTabTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.detailsContentBody}>
                  <InfoRow label="Service Type" value="Roof Repair" />
                  <InfoRow label="Preferred Schedule" value="ASAP - Within 48 hours" />
                  <InfoRow label="Budget Range" value="$2,000 - $3,500" />
                  <InfoRow label="Urgency Level" value="High Priority" />
                  <View style={{ marginTop: 24, marginBottom: 16 }}>
                    <Text style={[styles.breakdownCardTitle, { marginBottom: 12 }]}>Site Details</Text>
                  </View>
                  <InfoRow label="Area Zone" value="Backyard / West Side" />
                  <View style={{ marginTop: 16 }}>
                    <Text style={styles.infoLabelRefined}>Progress Photo</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                      <Image source={require('../../assets/images/construction_site_overview.png')} style={{ width: 100, height: 100, borderRadius: 12 }} />
                      <View style={{ width: 100, height: 100, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E0' }}>
                        <Ionicons name="add" size={24} color="#94A3B8" />
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ height: 100 }} />
              </ScrollView>

              <View style={[styles.modalFooterRefined, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                  style={[styles.modalFooterBtnRefined, { backgroundColor: '#10B981' }]}
                  onPress={() => { setSelectedJob(null); navigation.navigate('AssignJob', { job: selectedJob }); }}
                >
                  <Text style={styles.modalFooterBtnTextRefined}>Assign</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalFooterBtnRefined, { backgroundColor: '#0062E1' }]}
                  onPress={() => {
                    setSelectedJob(null);
                    setIsCreateQuoteOpen(true);
                    setQuoteStep(0);
                  }}
                >
                  <Text style={styles.modalFooterBtnTextRefined}>Create Quote</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Selected Pin Modal - Manage Worker / Location UI (John Carter UI) */}
      <Modal
        visible={!!selectedPin}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedPin(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentRefined}>
            <View style={styles.sheetHandleContainer}>
              <View style={styles.sheetHandleBar} />
            </View>
            <View style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
              <View style={[styles.modalHeader, { backgroundColor: '#FFF' }]}>
                <TouchableOpacity onPress={() => setSelectedPin(null)} style={styles.headerActionIcon}>
                  <Ionicons name="close" size={24} color="#1A202C" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A202C' }}>Location Details</Text>
                <View style={{ width: 44 }} />
              </View>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                <View style={styles.pinSectionCardWhite}>
                  <View style={styles.pinDetailHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pinNameText}>{selectedPin?.name}</Text>
                      <Text style={styles.pinIdText}>Job ID #1024</Text>
                      <View style={styles.pinBadgeRow}>
                        <View style={[styles.miniBadge, { backgroundColor: '#F5F3FF', borderRadius: 20 }]}>
                          <Text style={[styles.miniBadgeText, { color: '#8B5CF6' }]}>Lead Job</Text>
                        </View>
                        <View style={[styles.miniBadge, { backgroundColor: '#EFF6FF', borderRadius: 20 }]}>
                          <Text style={[styles.miniBadgeText, { color: '#3B82F6' }]}>In Progress</Text>
                        </View>
                      </View>
                      <View style={styles.pinInfoSectionCompact}>
                        <View style={styles.pinInfoItem}>
                          <Ionicons name="time-outline" size={16} color="#718096" />
                          <Text style={styles.pinInfoValueCompact}>09:00 AM</Text>
                        </View>
                        <View style={styles.pinInfoItem}>
                          <Ionicons name="location-outline" size={16} color="#718096" />
                          <Text style={styles.pinInfoValueCompact}>123 E Market St Boulder, CO 80304</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.pinAmountTextGreen}>${selectedPin?.amount?.replace('$', '')}</Text>
                  </View>
                  <Text style={styles.pinSectionLabelSmall}>Job Photos</Text>
                  <View style={styles.pinPhotoRow}>
                    <Image source={require('../../assets/images/flooring_worker_action.png')} style={styles.pinSquareImageDetail} />
                    <Image source={require('../../assets/images/modern_kitchen_flooring.png')} style={styles.pinSquareImageDetail} />
                  </View>
                </View>

                <View style={styles.pinSectionCardWhite}>
                  <Text style={styles.pinSectionLabelCard}>Assigned Worker</Text>
                  <View style={styles.workerSubCardClean}>
                    <View style={styles.workerMainInfoRow}>
                      <View style={styles.workerAvatarCircleBlue}><Text style={styles.workerAvatarTextWhite}>JC</Text></View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.workerNameBold}>John Carter</Text>
                        <View style={styles.workerTagRow}>
                          <View style={styles.tinyBadgePurple}><Text style={styles.tinyBadgeTextPurple}>Plumber</Text></View>
                          <View style={styles.tinyBadgeGreen}><Text style={styles.tinyBadgeTextGreen}>Active</Text></View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.workerStatsContainerGrey}>
                      <View style={styles.statBoxItem}><Text style={styles.statBoxValue}>3</Text><Text style={styles.statBoxLabel}>Active Jobs</Text></View>
                      <View style={styles.statBoxItem}><Text style={styles.statBoxValue}>32</Text><Text style={styles.statBoxLabel}>Jobs Completed</Text></View>
                      <View style={styles.statBoxItem}><Text style={styles.statBoxValueGreen}>92%</Text><Text style={styles.statBoxLabel}>Completion</Text></View>
                    </View>
                    <TouchableOpacity
                      style={styles.viewProfileBtnOutline}
                      onPress={() => { setSelectedPin(null); navigation.navigate('WorkerProfile', { workerId: 'JC101', name: 'John Carter' }); }}
                    >
                      <Text style={styles.viewProfileBtnText}>View Worker Profile</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ height: 100 }} />
              </ScrollView>
              <View style={[styles.locationFooterActions, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity style={styles.locationFooterBtnOutline} onPress={() => { setSelectedPin(null); navigation.navigate('LeadDetails', { job: selectedPin }); }}>
                  <Text style={styles.locationFooterBtnOutlineText}>View Job</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.locationFooterBtnOutline} onPress={() => { setSelectedPin(null); navigation.navigate('AssignJob', { job: selectedPin }); }}>
                  <Text style={styles.locationFooterBtnOutlineText}>Reassign Work</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.locationFooterBtnFilled} onPress={() => { setSelectedPin(null); setIsCreateQuoteOpen(true); setQuoteStep(0); }}>
                  <Text style={styles.locationFooterBtnFilledText}>Create Quote</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Sheet Dashboard */}
      {!selectedJob && (
        <BottomSheet
          style={{ zIndex: 100, elevation: 10 }}
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          animatedIndex={animatedIndex}
          enablePanDownToClose={false}
          handleIndicatorStyle={styles.sheetHandle}
          backgroundStyle={styles.sheetBackground}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
        >
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <GestureHandlerScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.tabsInner}
              disallowInterruption={true}
            >
              {tabs.map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </GestureHandlerScrollView>
          </View>



          <BottomSheetScrollView contentContainerStyle={[styles.sheetContent, { paddingBottom: 200 }]}>
            {activeTab === 'Overview' && (
              <View style={styles.overviewContainer}>
                <GestureHandlerScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.timeFiltersContainerOverview}
                  contentContainerStyle={{ gap: 8, paddingLeft: 4 }}
                  disallowInterruption={true}
                >
                  {['All', 'Weekly', 'Monthly', 'Yearly'].map(f => (
                    <TouchableOpacity
                      key={f}
                      onPress={() => setTimeFilter(f)}
                      style={[styles.timeFilterChipOverview, timeFilter === f && styles.activeTimeFilterChipOverview]}
                    >
                      <Text style={[styles.timeFilterChipTextOverview, timeFilter === f && styles.activeTimeFilterChipTextOverview]}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </GestureHandlerScrollView>
                <View style={styles.dashboardMainCard}>
                  <Text style={styles.dashboardTitle}>Admin Dashboard</Text>
                  <Text style={styles.dashboardSub}>Platform Overview & Metrics</Text>

                  <View style={styles.statsGridRefined}>
                    <StatCard icon="people-outline" label="Active Workers" value="342" change="+12% this month" color="#3B82F6" />
                    <StatCard icon="briefcase-outline" label="Jobs In Progress" value="128" change="Lead: 72 | Sub: 56" color="#8B5CF6" />
                    <StatCard icon="checkmark-circle-outline" label="Completed Jobs" value="1,284" change="+8.5%" color="#10B981" />
                    <StatCard icon="cash-outline" label="Total Revenue" value="$149K" change="+12.3%" color="#0062E1" />
                  </View>
                </View>

                <View style={styles.revenueBreakdownSection}>
                  <Text style={styles.breakdownCardTitle}>Revenue Breakdown</Text>
                  <ProgressBar label="Platform Fees" value="$42.3K" progress={0.4} color="#8B5CF6" labelColor="#718096" />
                  <ProgressBar label="Subcontract Revenue" value="$106.2K" progress={0.35} color="#10B981" labelColor="#718096" />
                </View>

                <View style={styles.performersSection}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.breakdownCardTitle}>Top Performers</Text>
                    <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
                  </View>
                  <PerformerItem name="Sarah Johnson" role="Technician" status="Active" initials="SJ" color="#3B82F6" />
                  <View style={styles.itemDivider} />
                  <PerformerItem name="Mike Kolsun" role="Plumber" status="Active" initials="MK" color="#3B82F6" />
                  <View style={styles.itemDivider} />
                  <PerformerItem name="David Vas" role="Electrician" status="Active" initials="DV" color="#3B82F6" />
                </View>

                <View style={styles.activitySection}>
                  <Text style={styles.breakdownCardTitle}>Recent Activity</Text>
                  <ActivityItem icon="build-outline" label="John Carter completed #1024" sub="Job ID #1024  •  Today, 9:30 AM" iconColor="#1D4ED8" iconBg="#EFF6FF" />
                  <ActivityItem icon="checkmark-outline" label="Sarah Wilson joined the platform" sub="10 mins ago" iconColor="#059669" iconBg="#ECFDF5" />
                  <ActivityItem icon="cash-outline" label="Payment of $850 to Mike Davis" sub="2 hours ago" iconColor="#7C3AED" iconBg="#F5F3FF" />
                </View>





                <TouchableOpacity style={styles.manageWorkersStickyBtn} onPress={() => navigation.navigate('WorkerManagement')}>
                  <Text style={styles.manageWorkersStickyBtnText}>Manage Workers</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'Jobs' && (
              <View style={styles.jobsContainer}>
                <View style={styles.jobsSearchWrapper}>
                  <Ionicons name="search" size={20} color="#64748B" />
                  <BottomSheetTextInput
                    style={styles.jobsSearchPlaceholder} 
                    placeholder="Search here"
                    placeholderTextColor="#718096"
                  />
                  <Ionicons name="mic" size={20} color="#64748B" />
                </View>

                <GestureHandlerScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.jobsFilterRow}
                  contentContainerStyle={{ gap: 8, paddingLeft: 4 }}
                  disallowInterruption={true}
                >
                  {['All', 'New', 'Assigned', 'Quoted', 'In Progress'].map(s => (
                    <TouchableOpacity key={s} style={[styles.jobFilterChip, s === 'All' && styles.jobFilterChipActive]}>
                      <Text style={[styles.jobFilterText, s === 'All' && styles.jobFilterTextActive]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </GestureHandlerScrollView>

                <View style={[styles.jobListVertical, { paddingBottom: 100 }]}>
                  {PINS.map(pin => {
                    // Give ALL job cards 15 photos for a rich experience
                    const photoList = [
                      require('../../assets/images/wood_flooring_job.png'),
                      require('../../assets/images/modern_kitchen_flooring.png'),
                      require('../../assets/images/flooring_worker_action.png'),
                      require('../../assets/images/construction_site_overview.png'),
                      require('../../assets/images/modern_kitchen_flooring.png'),
                      require('../../assets/images/wood_flooring_job.png'),
                      require('../../assets/images/construction_site_overview.png'),
                      require('../../assets/images/flooring_worker_action.png'),
                      require('../../assets/images/wood_flooring_job.png'),
                      require('../../assets/images/modern_kitchen_flooring.png'),
                      require('../../assets/images/flooring_worker_action.png'),
                      require('../../assets/images/construction_site_overview.png'),
                      require('../../assets/images/modern_kitchen_flooring.png'),
                      require('../../assets/images/wood_flooring_job.png'),
                      require('../../assets/images/construction_site_overview.png')
                    ];

                    return (
                      <JobCard
                        key={pin.id}
                        navigation={navigation}
                        name={pin.name}
                        id={`#J-${pin.id}`}
                        tag={pin.status}
                        time="Submitted: 2 hours ago"
                        images={photoList}
                        onPress={() => setSelectedJob({
                          ...pin,
                          images: photoList
                        })}
                      />
                    );
                  })}
                </View>
              </View>
            )}

            {activeTab === 'Schedule' && (
              <View style={styles.scheduleContainer}>
                <Text style={styles.sectionTitle}>Today's Agenda</Text>
                <View style={{ marginTop: 24 }}>
                  {AGENDA_DATA.map((item, index) => (
                    <AgendaItem
                      key={item.id}
                      item={item}
                      index={index}
                      isLast={index === AGENDA_DATA.length - 1}
                      navigation={navigation}
                    />
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'Invoice' && (
              <View style={styles.billingContainer}>
                <TouchableOpacity
                  style={styles.inlineSearch}
                  onPress={() => navigation.navigate('AdminSearch')}
                >
                  <Ionicons name="search" size={20} color={COLORS.textTertiary} />
                  <Text style={[styles.inlineSearchInput, { color: COLORS.textTertiary, marginLeft: 8 }]}>Search here</Text>
                  <Ionicons name="mic-outline" size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>

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

                <View style={styles.billingSummaryCard}>
                  <View style={styles.summaryHeader}>
                    <View>
                      <Text style={styles.summaryTitle}>Billing Summary</Text>
                      <Text style={styles.summarySub}>Invoices and payments in one place.</Text>
                    </View>
                    <TouchableOpacity style={styles.monthPicker}>
                      <Text style={styles.monthPickerText}>January</Text>
                      <Ionicons name="chevron-down" size={14} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Billed</Text>
                    <Text style={styles.summaryValue}>$148,500</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Pending</Text>
                    <Text style={styles.summaryValue}>$12,450</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Paid Invoices</Text>
                    <Text style={styles.summaryValue}>186</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Overdue</Text>
                    <Text style={[styles.summaryValue, { color: '#EF4444' }]}>8</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.primaryActionBtn}
                    onPress={() => navigation.navigate('CreateInvoice')}
                  >
                    <Ionicons name="add" size={24} color={COLORS.white} />
                    <Text style={styles.primaryActionBtnText}>New Invoice</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitleSmall}>Invoices</Text>
                <InvoiceCard navigation={navigation} id="#INV-1024" customer="Maggie Bradley" type="Roof Repair" amount="1,500.00" status="Paid" />
                <InvoiceCard navigation={navigation} id="#INV-1025" customer="John Doe" type="Pipe Repair" amount="450.00" status="Overdue" />
              </View>
            )}

            {activeTab === 'Quote' && (
              <View style={styles.billingContainer}>
                <TouchableOpacity
                  style={styles.inlineSearch}
                  onPress={() => navigation.navigate('AdminSearch')}
                >
                  <Ionicons name="search" size={20} color={COLORS.textTertiary} />
                  <Text style={[styles.inlineSearchInput, { color: COLORS.textTertiary, marginLeft: 8 }]}>Search here</Text>
                  <Ionicons name="mic-outline" size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>

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
                <QuoteCard navigation={navigation} id="#QT-2045" customer="Alistair Hughes" type="HVAC Installation" date="Jan 14, 2026" amount="1,896.15" status="Approved" />
                <QuoteCard navigation={navigation} id="#QT-2046" customer="Alistair Hughes" type="HVAC Installation" date="Jan 14, 2026" amount="1,896.15" status="Sent" />
                <QuoteCard navigation={navigation} id="#QT-2048" customer="Alistair Hughes" type="HVAC Installation" date="Jan 14, 2026" amount="1,896.15" status="Rejected" />
              </View>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      )}

      {/* FIXED BUTTON FOR QUOTE TAB - Outside BottomSheet to ensure visibility */}
      {activeTab === 'Quote' && !selectedJob && (
        <View style={styles.fixedFloatingButtonArea}>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() => {
              setIsCreateQuoteOpen(true);
              setQuoteStep(0);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={COLORS.white} />
            <Text style={styles.primaryActionBtnText}>Create New Quote</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Create Quote Modal - Bottom Sheet Style overlaying Map */}
      <Modal
        visible={isCreateQuoteOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCreateQuoteOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContentRefined, { height: height * 0.85 }]}>
            <View style={styles.sheetHandleContainer}>
              <View style={styles.sheetHandleBar} />
            </View>

            <View style={styles.quoteModalHeader}>
              <TouchableOpacity onPress={() => quoteStep > 0 ? setQuoteStep(quoteStep - 1) : setIsCreateQuoteOpen(false)}>
                <Ionicons name="chevron-back" size={28} color="#1A202C" />
              </TouchableOpacity>
              <Text style={styles.quoteModalTitle}>
                {quoteStep === 0 ? 'Job Scope' : quoteStep === 1 ? 'Pricing' : 'Review & Send'}
              </Text>
              <View style={{ width: 28 }} />
            </View>

            <View style={styles.quoteStepIndicator}>
              <View style={styles.quoteStepsRow}>
                {[
                  { label: 'Scope', step: 0 },
                  { label: 'Pricing', step: 1 },
                  { label: 'Review', step: 2 }
                ].map((s, idx) => (
                  <View key={s.label} style={styles.quoteStepItem}>
                    <View style={[styles.quoteStepDot, idx <= quoteStep ? styles.activeQuoteDot : styles.inactiveQuoteDot]}>
                      {idx < quoteStep ? (
                        <View style={styles.quoteDotCompleted} />
                      ) : (
                        <View style={[styles.quoteDotInner, idx === quoteStep && styles.activeQuoteDotInner]} />
                      )}
                    </View>
                    <Text style={[styles.quoteStepLabel, idx === quoteStep && styles.activeQuoteStepLabel]}>{s.label}</Text>
                    {idx < 2 && <View style={[styles.quoteStepLine, idx < quoteStep && styles.activeQuoteStepLine, { left: 45, width: width * 0.15 }]} />}
                  </View>
                ))}
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.quoteModalScroll}>
              {quoteStep === 0 && (
                <View style={styles.quoteStepPadding}>
                  <View style={styles.quoteSectionCard}>
                    <Text style={styles.quoteCardTitle}>Select Service Type</Text>
                    <TouchableOpacity style={styles.quoteDropdown}>
                      <Text style={styles.quoteDropdownText}>HVAC Installation</Text>
                      <Ionicons name="chevron-down" size={20} color="#1A202C" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.quoteSectionCard}>
                    <Text style={styles.quoteCardTitle}>Measurement input</Text>
                    <Text style={styles.quoteCardSub}>Use the tool ro auto-fill measurements,</Text>
                    <TouchableOpacity style={styles.quoteActionBtnOutline}>
                      <Text style={styles.quoteActionBtnText}>Start Pre-Inspection Tool</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.quoteSectionCard}>
                    <Text style={styles.quoteCardTitle}>Add Materials & Labor</Text>
                    <View style={styles.quoteInfoRow}><Text style={styles.quoteInfoLabel}>Total Materials Added:</Text><Text style={styles.quoteInfoValue}>5 Items</Text></View>
                    <View style={styles.quoteInfoRow}><Text style={styles.quoteInfoLabel}>Estimated Labor Hours:</Text><Text style={styles.quoteInfoValue}>8.5 hrs</Text></View>
                    <TouchableOpacity style={styles.quoteActionBtnOutline}>
                      <Text style={styles.quoteActionBtnText}>Edit Item List</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {quoteStep === 1 && (
                <View style={styles.quoteStepPadding}>
                  <View style={styles.quoteSectionCard}>
                    <Text style={styles.quoteCardTitle}>Measurement input</Text>
                    <Text style={styles.quoteCardSub}>The AI assistant is applying rules to generate the final price.</Text>
                    <View style={styles.quoteInfoRow}><Text style={styles.quoteInfoLabel}>Material Cost (Auto-lookup)</Text><Text style={styles.quoteInfoValue}>$550.00</Text></View>
                    <View style={styles.quoteInfoRow}><Text style={styles.quoteInfoLabel}>Labor Cost (8.5 hrs @ $75/hr)</Text><Text style={styles.quoteInfoValue}>$637.50</Text></View>
                    <View style={styles.quoteInfoRow}><Text style={styles.quoteInfoLabel}>Travel/ Distance Surcharge</Text><Text style={styles.quoteInfoValue}>$45.00</Text></View>
                    <View style={styles.quoteTotalRow}><Text style={styles.quoteTotalLabel}>Subtotal</Text><Text style={styles.quoteTotalValue}>$1,232.50</Text></View>
                  </View>
                  <View style={styles.quoteSectionCard}>
                    <Text style={styles.quoteCardTitle}>Profit Margin Rules</Text>
                    <View style={styles.quoteInfoRow}><Text style={styles.quoteInfoLabel}>Desired margin (%)</Text><Text style={styles.quoteInfoValue}>35%</Text></View>
                    <View style={styles.quoteFinalRow}><Text style={styles.quoteFinalLabel}>Final Quote Price</Text><Text style={styles.quoteFinalValue}>$1,896.15</Text></View>
                  </View>
                </View>
              )}

              {quoteStep === 2 && (
                <View style={styles.quoteStepPadding}>
                  <View style={styles.quoteSectionCard}>
                    <Text style={styles.quoteCardTitle}>E-Contract Setup</Text>
                    <Text style={styles.quoteCardSub}>Review terms and set up the payment split.</Text>
                    <View style={styles.quoteFinalRow}><Text style={styles.quoteFinalLabel}>Final Price</Text><Text style={styles.quoteFinalValue}>$1,896.15</Text></View>
                  </View>
                  <View style={styles.quoteSectionCard}>
                    <Text style={styles.quoteCardTitle}>Payment Schedule</Text>
                    <View style={styles.quoteInfoRow}><Text style={styles.quoteInfoLabel}>Deposit Due (15%)</Text><Text style={styles.quoteInfoValue}>$284.42</Text></View>
                    <View style={styles.quoteInfoRow}><Text style={styles.quoteInfoLabel}>Milestone 1 (50%)</Text><Text style={styles.quoteInfoValue}>$948.08</Text></View>
                    <View style={styles.quoteInfoRow}><Text style={styles.quoteInfoLabel}>Final Payment (35%)</Text><Text style={styles.quoteInfoValue}>$663.65</Text></View>
                  </View>
                  <View style={styles.quoteSectionCard}>
                    <Text style={styles.quoteCardTitle}>Signature Confirmation</Text>
                    <Text style={styles.quoteCardSub}>Type or draw your signature to confirm and authorize</Text>
                    <TextInput style={styles.quoteSignatureInput} placeholder="Type your signature" placeholderTextColor="#94A3B8" />
                  </View>
                </View>
              )}
              <View style={{ height: 120 }} />
            </ScrollView>

            <View style={[styles.quoteModalFooter, { paddingBottom: insets.bottom + 20 }]}>
              <TouchableOpacity
                style={styles.quotePrimaryBtn}
                onPress={() => quoteStep < 2 ? setQuoteStep(quoteStep + 1) : (setIsCreateQuoteOpen(false), setShowQuoteSuccess(true))}
              >
                <Text style={styles.quotePrimaryBtnText}>
                  {quoteStep === 0 ? 'Continue to Pricing' : quoteStep === 1 ? 'Review Contract' : 'Send Quote'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Popup */}
      <Modal visible={showQuoteSuccess} transparent animationType="fade">
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successBadgeCircle}>
              <Ionicons name="checkmark" size={50} color="#FFF" />
            </View>
            <Text style={styles.successTitleText}>Quote Sent!</Text>
            <Text style={styles.successSubText}>Your quote has been sent successfully.</Text>
            <TouchableOpacity style={styles.successDoneBtn} onPress={() => setShowQuoteSuccess(false)}>
              <Text style={styles.successDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  mapContainer: { flex: 1, position: 'relative', backgroundColor: '#E8F0FE' },
  mapPlaceholder: { width: '100%', height: '100%' },
  searchContainer: {
    position: 'absolute', left: 16, right: 16, zIndex: 10,
  },
  searchBar: {
    backgroundColor: COLORS.white, borderRadius: 26, height: 52,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, ...SHADOWS.medium,
  },
  googleIconMap: { width: 30, height: 30, resizeMode: 'contain', marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#1A202C' },
  profileAvatar: { width: 34, height: 34, borderRadius: 17, marginLeft: 6 },
  jobImage: { width: 140, height: 110, borderRadius: 16 },

  // Google Clone Styles
  googleSearchHeader: {
    height: 110, backgroundColor: '#FFF', flexDirection: 'row', 
    alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, 
    borderBottomColor: '#F1F3F4',
  },
  googleSearchInput: { flex: 1, fontSize: 18, color: '#3C4043', marginHorizontal: 15 },
  
  quickAccessRow: { flexDirection: 'row', padding: 16, gap: 12 },
  quickActionBox: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', 
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, gap: 10,
    borderWidth: 1, borderColor: '#E8EAED',
  },
  quickIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8F0FE', alignItems: 'center', justifyContent: 'center' },
  quickTitle: { fontSize: 14, fontWeight: '600', color: '#3C4043' },
  quickSub: { fontSize: 12, color: '#70757A' },

  dividerLarge: { height: 8, backgroundColor: '#F8F9FA', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F1F3F4' },
  
  recentHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
  recentMainTitle: { fontSize: 16, fontWeight: '700', color: '#3C4043' },

  historyItem: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F3F4' },
  historyIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F3F4', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  historyTextContent: { flex: 1 },
  historyPlaceName: { fontSize: 16, color: '#3C4043', fontWeight: '500' },
  historyPlaceAddr: { fontSize: 13, color: '#70757A', marginTop: 2 },
  
  suggestionsOverlayFloating: {
    backgroundColor: '#FFFFFF', borderRadius: 20, marginTop: 10,
    ...SHADOWS.large, elevation: 15, borderWidth: 1, borderColor: '#F1F3F4',
    paddingVertical: 10
  },
  historyRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F7FAFC' },
  closeDropdownBtn: { padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F3F4' },
  closeDropdownText: { color: '#1A73E8', fontWeight: '700' },
  historyStatus: { fontSize: 13, marginTop: 2, fontWeight: '500' },

  moreRecentBtn: { padding: 20, alignItems: 'center' },
  moreRecentText: { color: '#1967D2', fontSize: 15, fontWeight: '600' },

  suggestionsOverlay: {
    backgroundColor: '#FFF', borderRadius: 18, marginTop: 8,
    paddingVertical: 10, ...SHADOWS.medium, elevation: 10,
  },
  suggestionRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F7FAFC',
  },
  suggestionText: { marginLeft: 12, fontSize: 14, color: '#1A202C', fontFamily: FONTS.regular },

  weatherWidgetMap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 24, ...SHADOWS.medium,
  },
  weatherTempMap: { fontSize: 13, fontWeight: '700', color: '#1A202C' },
  weatherLocMap: { fontSize: 10, color: '#718096' },





  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { width: '100%' },

  sheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2 },

  tabsContainer: { marginTop: 4, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FFF' },
  tabsInner: { paddingHorizontal: 20, paddingBottom: 0 },
  tabItem: { paddingVertical: 14, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTabItem: { borderBottomColor: '#0062E1' },
  tabText: { fontSize: 14, fontFamily: FONTS.semiBold, color: '#64748B' },
  activeTabText: { color: '#0062E1', fontWeight: '700' },

  timeFiltersContainer: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 16, gap: 10 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  activeFilterChip: { backgroundColor: '#1A202C', borderColor: '#1A202C' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  activeFilterChipText: { color: '#fff' },

  overviewContainerNoTitle: { paddingTop: 0, paddingHorizontal: 16 },
  sheetContent: { flex: 1, padding: 0 },
  timeFiltersContainerOverview: { flexDirection: 'row', marginBottom: 20 },
  timeFilterChipOverview: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 25, backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E2E8F0', marginRight: 10 },
  activeTimeFilterChipOverview: { backgroundColor: '#1F2937', borderColor: '#1F2937' },
  timeFilterChipTextOverview: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  activeTimeFilterChipTextOverview: { color: COLORS.white },
  dashboardMainCard: { backgroundColor: '#F8F9FB', borderRadius: 24, padding: 16, marginBottom: 20 },
  dashboardTitle: { fontSize: 20, fontWeight: '700', color: '#1A202C', marginBottom: 4 },
  dashboardSub: { fontSize: 13, color: '#718096', marginBottom: 20 },
  statsGridRefined: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  statCardRefined: {
    width: (width - 32 - 32 - 10) / 2, // width - (overview padding) - (dashboard card padding) - gap
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    ...SHADOWS.small,
  },
  statIconContainerRefined: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  statLabelRefined: { fontSize: 11, fontWeight: '600', color: '#718096', marginBottom: 4 },
  statValueRefined: { fontSize: 24, fontWeight: '800', color: '#1A202C', marginBottom: 4 },
  statChangeRefined: { fontSize: 10, fontWeight: '700' },

  revenueBreakdownSection: { backgroundColor: '#F8F9FB', borderRadius: 24, padding: 20, marginBottom: 20 },
  performersSection: { backgroundColor: '#F8F9FB', borderRadius: 24, padding: 20, marginBottom: 20 },
  activitySection: { paddingHorizontal: 4, marginBottom: 40 },
  breakdownCardTitle: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 16 },
  viewAllText: { fontSize: 12, color: '#718096', fontWeight: '500' },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },

  performerItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  performerAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  performerInitials: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  performerInfo: { flex: 1 },
  performerName: { fontSize: 16, fontWeight: '800', color: '#1A202C', marginBottom: 4 },
  performerBadges: { flexDirection: 'row', gap: 6 },
  roleBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  roleBadgeText: { color: '#8B5CF6', fontSize: 10, fontWeight: '700' },
  activeStatusBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  activeStatusBadgeText: { color: '#10B981', fontSize: 10, fontWeight: '700' },
  itemDivider: { height: 1, backgroundColor: '#F1F5F9', width: '100%' },

  activityItem: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  activityIconContainer: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  activityContent: { flex: 1 },
  activityLabel: { fontSize: 14, fontWeight: '700', color: '#1A202C', marginBottom: 2 },
  activitySub: { fontSize: 12, color: '#718096' },

  manageWorkersStickyBtn: { backgroundColor: '#0E56D0', height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 40, ...SHADOWS.medium },
  manageWorkersStickyBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  homeLeadsSettingSection: { marginBottom: 24 },
  settingCardInnerPadded: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, ...SHADOWS.small, borderWidth: 1, borderColor: '#F1F5F9' },
  settingRowSimple: { flexDirection: 'row', alignItems: 'center' },
  settingIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  settingLabelHigh: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  settingValueSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  settingEditBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  settingEditText: { color: '#0E56D0', fontSize: 14, fontWeight: '700' },
  settingDividerSimple: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16, marginLeft: 56 },

  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  sectionSub: { fontSize: 14, color: COLORS.textTertiary, marginBottom: 20 },

  revenueCard: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
    marginTop: 16, borderWidth: 1, borderColor: '#F1F5F9', ...SHADOWS.small,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  progressContainer: { marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 12, color: COLORS.textSecondary },
  progressValue: { fontSize: 12, fontWeight: '700' },
  progressBg: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },

  manageBtn: {
    backgroundColor: '#0062E1', height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center', marginTop: 24,
    ...SHADOWS.medium,
  },
  manageBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },

  jobsContainer: { paddingHorizontal: 16 },
  inlineSearch: {
    height: 50, backgroundColor: COLORS.white, borderRadius: 25,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
    ...SHADOWS.small,
  },
  inlineSearchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary, marginLeft: 8 },
  statusChipsRow: { marginBottom: 16 },
  statusChip: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E2E8F0',
    marginRight: 8,
  },
  activeStatusChip: { backgroundColor: '#F1F5F9', borderColor: '#1E293B' },
  statusChipText: { fontSize: 13, color: COLORS.textSecondary },
  activeStatusChipText: { color: '#000', fontWeight: '700' },

  jobCard: {
    backgroundColor: COLORS.white, borderRadius: 24, marginBottom: 20,
    overflow: 'hidden', ...SHADOWS.small, borderWidth: 1, borderColor: '#F1F5F9',
  },
  jobImages: { height: 110, marginTop: 16 },
  jobImage: { width: 130, height: 130, marginLeft: 16, borderRadius: 12 },
  jobInfo: { padding: 16 },
  jobInfoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  jobNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  jobName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  jobStatusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  jobStatusText: { fontSize: 11, fontWeight: '700' },
  jobId: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  jobSubText: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  jobTime: { fontSize: 13, color: '#64748B' },
  jobActions: {
    flexDirection: 'row', gap: 8, marginTop: 20,
  },
  actionBtn: {
    flex: 1, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: '#0062E1' },

  jobsSearchWrapper: {
    height: 56, backgroundColor: '#fff', borderRadius: 28, borderWidth: 1, borderColor: '#E2E8F0',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 20,
    ...SHADOWS.small,
  },
  jobsSearchPlaceholder: { flex: 1, fontSize: 18, color: '#718096', marginLeft: 12 },
  jobsFilterRow: { marginBottom: 24 },
  jobFilterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 10 },
  jobFilterChipActive: { backgroundColor: '#1F2937', borderColor: '#1F2937' },
  jobFilterText: { fontSize: 14, fontWeight: '700', color: '#4B5563' },
  jobFilterTextActive: { color: '#fff' },

  scheduleContainer: { paddingBottom: 40, paddingHorizontal: 16 },
  agendaItemRow: { flexDirection: 'row', minHeight: 160 },
  agendaTimelineCol: { width: 34, alignItems: 'center', paddingTop: 6 },
  agendaDotPoint: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E2E8F0', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  activeDotPoint: { borderColor: '#0062E1' },
  activeDotInnerPoint: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0062E1' },
  inactiveDotPoint: { backgroundColor: '#fff' },
  agendaTimelineLine: { width: 2, flex: 1, backgroundColor: '#F1F5F9', marginTop: -2, marginBottom: -2 },
  agendaContentCol: { flex: 1, paddingBottom: 24, paddingLeft: 8 },
  agendaCardDetailed: { backgroundColor: '#F8F9FB', borderRadius: 24, padding: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F1F5F9' },
  activeTopBarIndicator: { position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: '#DBEAFE' },
  agendaNameText: { fontSize: 20, fontWeight: '800', color: '#1A202C' },
  agendaTypeText: { fontSize: 13, color: '#718096', marginBottom: 18 },
  agendaInfoLine: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  agendaInfoValue: { fontSize: 13, color: '#4A5568', fontWeight: '500' },
  agendaActionButtons: { flexDirection: 'row', gap: 12, marginTop: 12 },
  agendaBtnSecondaryClean: { flex: 1, height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  agendaBtnPrimaryClean: { flex: 1, height: 52, borderRadius: 26, backgroundColor: '#0E56D0', alignItems: 'center', justifyContent: 'center', ...SHADOWS.small },
  agendaBtnSecondaryText: { fontSize: 14, fontWeight: '700', color: '#1A202C' },
  agendaBtnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  billingContainer: { paddingHorizontal: 16 },
  billingSummaryCard: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20,
    marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9', ...SHADOWS.small,
  },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  summarySub: { fontSize: 13, color: COLORS.textTertiary, marginTop: 4 },
  monthPicker: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', gap: 6,
  },
  monthPickerText: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
  summaryValue: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  divider: { height: 1, backgroundColor: '#F1F5F9', width: '100%' },
  primaryActionBtn: {
    backgroundColor: '#0062E1', height: 52, borderRadius: 26,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 8,
    ...SHADOWS.medium,
  },
  primaryActionBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  fixedFloatingButtonArea: {
    position: 'absolute',
    bottom: 85,
    left: 20,
    right: 20,
    zIndex: 200,
    elevation: 20,
    backgroundColor: 'transparent',
  },

  sectionTitleSmall: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  billingCard: {
    backgroundColor: '#F8FAFC', borderRadius: 20, padding: 16, marginBottom: 12,
  },
  quoteCard: {
    backgroundColor: '#F8FAFC', borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  billingCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  billingId: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  billingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  billingLabel: { fontSize: 14, color: COLORS.textTertiary, flex: 1.2 },
  billingValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600', flex: 1, textAlign: 'right' },
  viewDetailsLink: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  viewDetailsText: { fontSize: 14, color: '#8B5CF6', fontWeight: '700', textDecorationLine: 'underline' },

  activeStatusChipDark: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
  activeStatusChipTextWhite: { color: COLORS.white, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContentRefined: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, height: height * 0.9, width: width },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 12 },
  modalHeaderActions: { flexDirection: 'row', gap: 16 },
  headerActionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  modalScroll: { flex: 1 },
  jobHeadline: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 24 },
  jobTitleName: { fontSize: 24, fontWeight: '700', color: '#1A202C' },
  newBadgeRefined: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  newBadgeTextRefined: { color: '#8B5CF6', fontSize: 13, fontWeight: '700' },
  jobAddressRefined: { fontSize: 13, color: '#64748B', marginTop: 4 },
  jobDistTime: { fontSize: 13, color: '#64748B', marginTop: 2 },
  jobRateValue: { fontSize: 24, fontWeight: '700', color: '#1A202C' },
  jobRateSub: { fontSize: 12, color: '#64748B' },

  shortcutActionsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 24 },
  shortcutBtnFilled: { flex: 1.2, height: 48, borderRadius: 24, backgroundColor: '#0062E1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  shortcutBtnOutline: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#EFF6FF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  shortcutBtnText: { fontSize: 13, fontWeight: '700', color: '#0062E1' },

  imageGridRefined: { flexDirection: 'row', height: 280, paddingHorizontal: 20, gap: 10, marginBottom: 24 },
  largeImageWrapper: { flex: 1.5, borderRadius: 20, overflow: 'hidden', position: 'relative' },
  largeImageDetail: { width: '100%', height: '100%' },
  smallImagesColumn: { flex: 1, gap: 10 },
  smallImageWrapper: { flex: 1, borderRadius: 20, overflow: 'hidden', position: 'relative' },
  smallImageDetail: { width: '100%', height: '100%' },
  imgTimeBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  imgTimeText: { color: '#FFF', fontSize: 11, fontWeight: '600' },

  overlayTabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingHorizontal: 20, marginBottom: 24 },
  overlayTabBtn: { paddingVertical: 12, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  overlayTabBtnActive: { borderBottomColor: '#00B8B8' },
  overlayTabTextRefined: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  overlayTabTextActive: { color: '#00B8B8' },

  detailsContentBody: { paddingHorizontal: 20, marginBottom: 40 },
  infoRowRefined: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  infoLabelRefined: { fontSize: 15, color: '#64748B' },
  infoValueRefined: { fontSize: 15, fontWeight: '700', color: '#1A202C' },

  modalFooterRefined: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  assignBtnModal: { flex: 1, height: 56, borderRadius: 28, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  assignBtnTextModal: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  quoteBtnModal: { flex: 1, height: 56, borderRadius: 28, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center' },
  quoteBtnTextModal: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  bottomNavContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', zIndex: 1000 },
  navItem: { alignItems: 'center' },
  activePill: { backgroundColor: '#E0F2F1', paddingHorizontal: 22, paddingVertical: 6, borderRadius: 20, marginBottom: 4 },
  activeText: { color: '#0E56D0', fontSize: 11, fontWeight: '700' },
  dot: { position: 'absolute', top: -1, right: -1, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 1.5, borderColor: '#FFF' },
  navTxt: { color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 4 },

  // Pin Detail Styles
  pinDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, paddingBottom: 16 },
  pinNameText: { fontSize: 24, fontWeight: '800', color: '#1A202C' },
  pinIdText: { fontSize: 13, color: '#718096', marginTop: 4 },
  pinBadgeRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  miniBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  miniBadgeText: { fontSize: 11, fontWeight: '700' },
  pinAmountText: { fontSize: 24, fontWeight: '800', color: '#10B981' },

  pinInfoSection: { paddingHorizontal: 24, paddingBottom: 24, gap: 12 },
  pinInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pinInfoValue: { fontSize: 15, color: '#1A202C', fontWeight: '500' },

  pinSectionCard: { marginHorizontal: 16, backgroundColor: '#F8FAFC', borderRadius: 24, padding: 20, marginBottom: 16, ...SHADOWS.small },
  pinSectionLabel: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 16 },
  pinPhotoRow: { flexDirection: 'row', gap: 12 },
  pinSquareImage: { width: (width - 80) / 2, height: (width - 80) / 2, borderRadius: 20 },

  workerSubCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, ...SHADOWS.small },
  workerMainInfo: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  workerAvatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  workerAvatarText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  workerNameRefined: { fontSize: 18, fontWeight: '800', color: '#1A202C' },
  tinyBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: '#F5F3FF' },
  tinyBadgeText: { fontSize: 11, fontWeight: '700', color: '#8B5CF6' },

  workerStatsRowMini: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginVertical: 20 },
  statMiniItem: { flex: 1, alignItems: 'center' },
  statMiniValue: { fontSize: 18, fontWeight: '800', color: '#1A202C' },
  statMiniLabel: { fontSize: 10, color: '#64748B', marginTop: 4, textAlign: 'center' },

  viewWorkerProfileBtn: { height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#4A5568', alignItems: 'center', justifyContent: 'center' },
  viewWorkerProfileBtnText: { fontSize: 14, fontWeight: '700', color: '#1A202C' },

  pinFooterActions: { flexDirection: 'row', padding: 16, gap: 10, paddingBottom: 34 },
  pinFooterBtn: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#4A5568', alignItems: 'center', justifyContent: 'center' },
  pinFooterBtnText: { fontSize: 13, fontWeight: '700', color: '#1A202C' },

  modalFooterBtnRefined: { flex: 1, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  modalFooterBtnTextRefined: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  locationFooterActions: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16 },
  locationFooterBtnOutline: { flex: 1, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#1A202C', alignItems: 'center', justifyContent: 'center' },
  locationFooterBtnOutlineText: { fontSize: 13, fontWeight: '700', color: '#1A202C' },
  locationFooterBtnFilled: { flex: 1.5, height: 44, borderRadius: 22, backgroundColor: '#0E56D0', alignItems: 'center', justifyContent: 'center' },
  locationFooterBtnFilledText: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  // Updated Same to Same Styles
  sheetHandleContainer: { width: '100%', alignItems: 'center', paddingTop: 10, paddingBottom: 10, backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetHandleBar: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2 },

  pinSectionCardWhite: { backgroundColor: '#FFF', borderRadius: 24, marginHorizontal: 16, marginTop: 16, padding: 24, ...SHADOWS.small },
  pinDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  pinNameText: { fontSize: 22, fontWeight: '800', color: '#1A202C' },
  pinIdText: { fontSize: 13, color: '#718096', marginTop: 2 },
  pinBadgeRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 16 },
  miniBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15 },
  miniBadgeText: { fontSize: 11, fontWeight: '700' },
  pinAmountTextGreen: { fontSize: 24, fontWeight: '800', color: '#10B981' },

  pinInfoSectionCompact: { gap: 8 },
  pinInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pinInfoValueCompact: { fontSize: 11, color: '#4A5568', fontWeight: '500' },

  pinSectionLabelSmall: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginTop: 20, marginBottom: 16 },
  pinSquareImageDetail: { width: (width - 100) / 2, height: (width - 100) / 2, borderRadius: 18 },

  pinSectionLabelCard: { fontSize: 18, fontWeight: '800', color: '#1A202C', marginBottom: 16 },
  workerSubCardClean: { backgroundColor: '#FFF' },
  workerMainInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  workerAvatarCircleBlue: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
  workerAvatarTextWhite: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  workerNameBold: { fontSize: 18, fontWeight: '800', color: '#1A202C' },
  workerTagRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  tinyBadgePurple: { backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  tinyBadgeTextPurple: { color: '#8B5CF6', fontSize: 11, fontWeight: '700' },
  tinyBadgeGreen: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  tinyBadgeTextGreen: { color: '#10B981', fontSize: 11, fontWeight: '700' },

  workerStatsContainerGrey: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 20, padding: 16, marginBottom: 20 },
  statBoxItem: { flex: 1, alignItems: 'center' },
  statBoxValue: { fontSize: 18, fontWeight: '800', color: '#1A202C' },
  statBoxValueGreen: { fontSize: 18, fontWeight: '800', color: '#10B981' },
  statBoxLabel: { fontSize: 10, color: '#718096', marginTop: 4, textAlign: 'center' },

  viewProfileBtnOutline: { height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#1A202C', alignItems: 'center', justifyContent: 'center' },
  viewProfileBtnText: { fontSize: 14, fontWeight: '700', color: '#1A202C' },

  pinFooterActionsRow: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  footerBtnOutlineRefined: { flex: 1, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#1A202C', alignItems: 'center', justifyContent: 'center' },
  footerBtnTextRefined: { fontSize: 13, fontWeight: '700', color: '#1A202C' },
  footerBtnFilledBlue: { flex: 1.5, height: 50, borderRadius: 25, backgroundColor: '#0E56D0', alignItems: 'center', justifyContent: 'center' },
  footerBtnTextWhite: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  // Same-To-Same Google Maps Native Style Pins
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
  profileAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  weatherWidgetMap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  weatherTempMap: { fontSize: 14, fontWeight: '700', color: '#1A202C' },
  weatherLocMap: { fontSize: 10, color: '#718096' },
  mapButtonsRight: { position: 'absolute', right: 20, zIndex: 110, gap: 15, alignItems: 'center' },
  navCircleBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
  dirSquareBtn: { width: 56, height: 52, borderRadius: 16, backgroundColor: '#007A8A', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
  legendContainer: { position: 'absolute', left: 0, right: 0, zIndex: 100 },
  legendWrapper: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10, gap: 8 },
  legendChipSheet: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, ...SHADOWS.small },
  legendChip: { flex: 1, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
  legendText: { color: '#FFF', fontSize: 14, fontWeight: '700' },

  // Quote Modal Styles
  quoteModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  quoteModalTitle: { fontSize: 20, fontWeight: '800', color: '#1A202C' },
  quoteStepIndicator: { paddingHorizontal: 40, paddingBottom: 20 },
  quoteStepsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quoteStepItem: { alignItems: 'center', width: 60, position: 'relative' },
  quoteStepDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, backgroundColor: '#FFF', marginBottom: 6, zIndex: 5 },
  inactiveQuoteDot: { borderColor: '#E2E8F0' },
  activeQuoteDot: { borderColor: '#0062E1' },
  quoteDotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E2E8F0' },
  activeQuoteDotInner: { backgroundColor: '#0062E1' },
  quoteDotCompleted: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0062E1' },
  quoteStepLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  activeQuoteStepLabel: { color: '#1A202C' },
  quoteStepLine: { position: 'absolute', top: 6, left: 45, width: 45, height: 2, backgroundColor: '#F1F5F9' },
  activeQuoteStepLine: { backgroundColor: '#0062E1' },

  quoteModalScroll: { flex: 1 },
  quoteStepPadding: { paddingHorizontal: 16 },
  quoteSectionCard: { backgroundColor: '#F8F9FB', borderRadius: 20, padding: 20, marginBottom: 16 },
  quoteCardTitle: { fontSize: 16, fontWeight: '800', color: '#1A202C', marginBottom: 12 },
  quoteCardSub: { fontSize: 12, color: '#718096', marginBottom: 12 },
  quoteDropdown: { height: 50, borderRadius: 25, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  quoteDropdownText: { fontSize: 14, color: '#1A202C' },
  quoteActionBtnOutline: { height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#1A202C', alignItems: 'center', justifyContent: 'center' },
  quoteActionBtnText: { fontSize: 14, fontWeight: '700', color: '#1A202C' },
  quoteInfoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  quoteInfoLabel: { fontSize: 14, color: '#64748B' },
  quoteInfoValue: { fontSize: 14, fontWeight: '700', color: '#1A202C' },
  quoteTotalRow: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  quoteTotalLabel: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  quoteTotalValue: { fontSize: 15, fontWeight: '800', color: '#1A202C' },
  quoteFinalRow: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  quoteFinalLabel: { fontSize: 16, fontWeight: '800', color: '#1A202C' },
  quoteFinalValue: { fontSize: 18, fontWeight: '800', color: '#0062E1' },
  quoteSignatureInput: { height: 50, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F1F5F9', paddingHorizontal: 16, fontSize: 14, color: '#1A202C' },

  quoteModalFooter: { paddingHorizontal: 16, paddingTop: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  quotePrimaryBtn: { height: 52, borderRadius: 26, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center' },
  quotePrimaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  successModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  successModalContent: { width: width * 0.8, backgroundColor: '#FFF', borderRadius: 32, padding: 32, alignItems: 'center' },
  successBadgeCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitleText: { fontSize: 22, fontWeight: '800', color: '#1A202C', marginBottom: 8 },
  successSubText: { fontSize: 14, color: '#718096', textAlign: 'center', marginBottom: 24 },
  successDoneBtn: { width: '100%', height: 50, borderRadius: 25, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center' },
  successDoneBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
