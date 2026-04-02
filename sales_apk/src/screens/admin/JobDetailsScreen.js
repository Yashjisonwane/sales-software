import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Share,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import BottomSheet, { BottomSheetScrollView, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { SHADOWS, COLORS } from '../../constants/theme';
import { getJobHistory, uploadJobPhoto } from '../../api/apiService';

const { width, height } = Dimensions.get('window');

const JobDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const initialJob = route.params?.job || {};
  const [job, setJob] = useState(initialJob);
  const [activeTab, setActiveTab] = useState('Updates'); // Set to Updates as frequently requested
  const [history, setHistory] = useState([]);
  const [uploading, setUploading] = useState(false);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['45%', '92%'], []);

  // Use the same coordinate logic as the main screen
  const latitude = job.latitude ? parseFloat(job.latitude) : 21.3069;
  const longitude = job.longitude ? parseFloat(job.longitude) : -157.8583;

  const mapHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html,body,#map{margin:0;padding:0;height:100%;width:100%;background:#F8FAFC;}
          .leaflet-control-zoom,.leaflet-control-attribution{display:none!important;}
          .pulse-circle {
            width: 16px; height: 16px; background: #0E56D0; border-radius: 50%;
            border: 3px solid #fff; box-shadow: 0 0 12px rgba(14,86,208,0.6);
            animation: pulse-animation 2s infinite;
          }
          @keyframes pulse-animation {
            0% { transform: scale(0.9); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(0.9); opacity: 1; }
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map',{zoomControl:false,attributionControl:false}).setView([${latitude}, ${longitude}], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          var icon = L.divIcon({
            html: '<div class="pulse-circle"></div>',
            iconSize: [22, 22],
            className: ''
          });
          L.marker([${latitude}, ${longitude}], {icon: icon}).addTo(map);
        </script>
      </body>
    </html>
  `;

  React.useEffect(() => {
    fetchHistory();
  }, [job.id]);

  const fetchHistory = async () => {
    if (!job.id) return;
    const res = await getJobHistory(job.id);
    if (res.success) setHistory(res.data);
  };

  const handleCall = () => {
    const phone = job.customerPhone || '1234567890';
    Linking.openURL(`tel:${phone}`);
  };

  const handleDirections = () => {
    if (job.location) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location)}`);
    }
  };

  const handleShare = () => {
    Share.share({
      message: `Job ${job.jobNo || job.id} details for ${job.customerName}. At ${job.location}`,
    });
  };

  const handleAddPhoto = async () => {
    Alert.alert(
      "Add Photo",
      "Choose from gallery or take a new photo with camera.",
      [
        { text: "Camera", onPress: () => capturePhoto('camera') },
        { text: "Gallery", onPress: () => capturePhoto('gallery') },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const capturePhoto = async (type) => {
    try {
      let result;
      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission", "Camera access is required");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.7,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.7,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploading(true);
        const photoUri = result.assets[0].uri;
        const res = await uploadJobPhoto(job.id, photoUri);
        
        if (res.success) {
          const newPhotos = [...(job.photos || []), { id: Date.now().toString(), url: photoUri }];
          setJob({ ...job, photos: newPhotos });
          fetchHistory();
          Alert.alert("Success", "Photo added successfully");
        } else {
          Alert.alert("Error", res.message);
        }
      }
    } catch (e) {
      Alert.alert("Error", "Could not process photo");
    } finally {
      setUploading(false);
    }
  };

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={insets.bottom + 10}>
        <View style={styles.footerContainer}>
          <TouchableOpacity 
            style={styles.assignBtn}
            onPress={() => navigation.navigate('AssignJob', { job })}
          >
            <Text style={styles.btnText}>Assign</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quoteBtn}
            onPress={() => navigation.navigate('QuoteScope', { job })}
          >
            <Text style={styles.btnText}>Create Quote</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetFooter>
    ),
    [job, insets.bottom]
  );

  const tabs = ['Job Details', 'Description', 'Photos', 'Updates'];

  const renderJobDetails = () => (
    <View style={styles.detailsList}>
      <InfoRow label="Service Type" value={job.categoryName || 'General Service'} />
      <InfoRow label="Assigned To" value={job.workerName || 'Not Assigned'} />
      <InfoRow label="Scheduled Date" value={job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'TBD'} />
      <InfoRow label="Scheduled Time" value={job.scheduledTime || 'TBD'} />
      <InfoRow label="Location" value={job.location || 'Pending Address'} isLast />
    </View>
  );

  const renderDescription = () => (
    <View style={styles.tabContent}>
      <Text style={styles.descTitle}>Project Brief</Text>
      <Text style={styles.descText}>{job.description || 'No description provided by administrator.'}</Text>
    </View>
  );

  const renderPhotos = () => (
    <View style={styles.photoTabContainer}>
      <View style={styles.photoGrid}>
        <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto} disabled={uploading}>
          {uploading ? <ActivityIndicator color="#CBD5E0" /> : <Ionicons name="camera-outline" size={32} color="#CBD5E0" />}
          <Text style={{ color: '#A0AEC0', fontSize: 13, marginTop: 8 }}>Add Photo</Text>
        </TouchableOpacity>
        {job.photos && job.photos.map((p, idx) => (
          <View key={p.id || idx} style={styles.photoItem}>
            <Image source={{ uri: p.url }} style={styles.gridImg} />
          </View>
        ))}
      </View>
      <Text style={styles.photoFooterTxt}>* Site photos are verified by GPS and timestamped.</Text>
    </View>
  );

  const renderUpdates = () => (
    <View style={styles.historyList}>
      {history.length > 0 ? history.map((item, idx) => (
        <View key={item.id || idx} style={styles.updateItem}>
          <View style={[styles.updateIconBg, { backgroundColor: item.bg || '#F1F5F9' }]}>
            <Ionicons name={item.icon || 'star'} size={20} color={item.color || '#4A5568'} />
          </View>
          <View style={styles.updateInfo}>
            <Text style={styles.updateTitle}>{item.title}</Text>
            <Text style={styles.updateSub}>{item.sub}</Text>
            <Text style={styles.updateTime}>{new Date(item.time).toLocaleString()}</Text>
          </View>
        </View>
      )) : (
        <View style={styles.emptyHistory}>
           <Ionicons name="notifications-off-outline" size={32} color="#CBD5E0" />
           <Text style={styles.emptyHistoryText}>No activity logs yet</Text>
           <Text style={styles.emptyHistorySub}>Start by assigning a professional or creating a quote.</Text>
        </View>
      )}
    </View>
  );

  const InfoRow = ({ label, value, isLast }) => (
    <View style={[styles.detailItem, !isLast && { borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 16 }]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Map Background Layer */}
      <View style={StyleSheet.absoluteFill}>
        <WebView 
          source={{ html: mapHtml }} 
          style={styles.mapWebView}
          scrollEnabled={false}
        />
        <View style={styles.mapOverlay} />
      </View>

      {/* Header Container */}
      <View style={[styles.headerActions, { top: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-down" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.rightHeaderActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleBar}
        backgroundStyle={styles.sheetBackground}
        footerComponent={renderFooter}
      >
        <BottomSheetScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}
        >
          <View style={styles.mainInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.workerName}>{job.customerName || 'Active Job'}</Text>
              <View style={[styles.newBadge, { backgroundColor: '#F5F3FF' }]}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
              <Text style={styles.priceText}>$0 <Text style={styles.budgetText}>Budget</Text></Text>
            </View>
            <Text style={styles.address}>{job.location || 'Location Pending'}</Text>
            <Text style={styles.distTime}>4.5 mi • 12 m</Text>

            <View style={styles.actionHub}>
              <TouchableOpacity style={styles.directionsBtn} onPress={handleDirections}>
                <Ionicons name="navigate" size={20} color="#fff" />
                <Text style={styles.directionsText}>Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineActionBtn} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#0E56D0" />
                <Text style={styles.outlineActionText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineActionBtn}>
                <Ionicons name="bookmark" size={20} color="#0E56D0" />
                <Text style={styles.outlineActionText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineActionBtn} onPress={handleShare}>
                <Ionicons name="share-social" size={20} color="#0E56D0" />
                <Text style={styles.outlineActionText}>Share</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.recentSection}>
              <View style={styles.recentBadge}><Text style={styles.recentText}>Recent</Text></View>
              {job.photos && job.photos.length > 0 ? (
                <View style={styles.recentPhotoContainer}>
                   <Image source={{ uri: job.photos[0].url }} style={styles.recentPhoto} />
                </View>
              ) : (
                <View style={styles.placeholderSpace}>
                   <Ionicons name="images-outline" size={32} color="#CBD5E0" />
                   <Text style={{ color: '#CBD5E0', fontSize: 13, marginTop: 8 }}>No photos available</Text>
                </View>
              )}
            </View>

            <View style={styles.tabsRow}>
              {tabs.map(tab => (
                <TouchableOpacity 
                  key={tab} 
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeTab === 'Job Details' && renderJobDetails()}
            {activeTab === 'Description' && renderDescription()}
            {activeTab === 'Photos' && renderPhotos()}
            {activeTab === 'Updates' && renderUpdates()}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  mapWebView: { width: '100%', height: '100%' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.05)' },
  
  headerActions: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 10 },
  rightHeaderActions: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  
  sheetBackground: { backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, ...SHADOWS.small },
  handleBar: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginTop: 12 },

  scrollContent: { padding: 0 },
  mainInfo: { padding: 20 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  workerName: { fontSize: 24, fontWeight: '800', color: '#1A202C', flex: 1, textTransform: 'capitalize' },
  newBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginRight: 15 },
  newBadgeText: { color: '#8B5CF6', fontSize: 12, fontWeight: '700' },
  priceText: { fontSize: 20, fontWeight: '800', color: '#1A202C' },
  budgetText: { fontSize: 12, color: '#718096', fontWeight: '400' },
  address: { fontSize: 14, color: '#718096', marginBottom: 4 },
  distTime: { fontSize: 13, color: '#A0AEC0', marginBottom: 20 },

  actionHub: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  directionsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0062E1', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 25, flex: 1.5 },
  directionsText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  outlineActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 25, flex: 1, justifyContent: 'center' },
  outlineActionText: { color: '#0E56D0', fontWeight: '700', fontSize: 13 },

  recentSection: { marginBottom: 24 },
  recentBadge: { backgroundColor: '#4A5568', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, marginBottom: 12 },
  recentText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  placeholderSpace: { height: 140, backgroundColor: '#F7FAFC', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  recentPhotoContainer: { height: 140, borderRadius: 16, overflow: 'hidden' },
  recentPhoto: { width: '100%', height: '100%' },

  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 20 },
  tab: { paddingVertical: 12, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#00BFA5' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#718096' },
  activeTabText: { color: '#00BFA5' },

  detailsList: { gap: 16 },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 15, color: '#718096' },
  detailValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },

  tabContent: { paddingVertical: 10 },
  descTitle: { fontSize: 16, fontWeight: '700', color: '#1A202C', marginBottom: 8 },
  descText: { fontSize: 15, color: '#4A5568', lineHeight: 22 },

  photoTabContainer: { paddingVertical: 10 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoItem: { width: (width - 64) / 2, height: 120, borderRadius: 16, overflow: 'hidden' },
  addPhotoBtn: { width: (width - 64) / 2, height: 120, borderRadius: 16, borderStyle: 'dashed', borderWidth: 2, borderColor: '#CBD5E0', alignItems: 'center', justifyContent: 'center' },
  gridImg: { width: '100%', height: '100%' },
  photoFooterTxt: { fontSize: 11, color: '#A0AEC0', marginTop: 16, textAlign: 'center' },

  historyList: { gap: 0 },
  updateItem: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  updateIconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  updateInfo: { flex: 1 },
  updateTitle: { fontSize: 16, fontWeight: '700', color: '#1A202C', marginBottom: 2 },
  updateSub: { fontSize: 13, color: '#718096', marginBottom: 4 },
  updateTime: { fontSize: 12, color: '#A0AEC0', fontWeight: '600' },
  emptyHistory: { alignItems: 'center', paddingVertical: 40 },
  emptyHistoryText: { color: '#718096', fontSize: 16, fontWeight: '700', marginTop: 12 },
  emptyHistorySub: { color: '#CBD5E0', fontSize: 13, marginTop: 4, textAlign: 'center', paddingHorizontal: 40 },

  footerContainer: { 
    flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  assignBtn: { flex: 1, height: 56, backgroundColor: '#00BFA5', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  quoteBtn: { flex: 1, height: 56, backgroundColor: '#0062E1', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default JobDetailsScreen;
