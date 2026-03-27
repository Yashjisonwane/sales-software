import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const JobOfferDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Job Details');
  
  // States: pending, accepted_pricing, accepted, active
  const [jobState, setJobState] = useState(route.params?.state || 'accepted_pricing');

  useEffect(() => {
    if (route.params?.state) {
      setJobState(route.params.state);
    }
  }, [route.params?.state]);

  const tabs = ['Job Details', 'Description', 'Photos', 'Updates'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header Container */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-down" size={32} color="#1A202C" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconCircle}>
              <Ionicons name="share-outline" size={24} color="#1A202C" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconCircle}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#1A202C" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.basicInfo}>
          <View style={styles.namePriceRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.nameLine}>
                <Text style={styles.workerName}>Alistair Hughes</Text>
                <View style={styles.leadBadge}><Text style={styles.leadBadgeText}>Lead</Text></View>
              </View>
              <Text style={styles.address}>123 E Market St Boulder, CO 80304,USA</Text>
              <View style={styles.distRow}>
                <Text style={styles.distText}>4.5 mi</Text>
                <View style={styles.distDot} />
                <Text style={styles.distText}>12 m</Text>
              </View>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.priceText}>$43 <Text style={styles.perHour}>per hour</Text></Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.blueMainBtn}>
              <View style={styles.directionsIconContainer}>
                <Ionicons name="navigate" size={12} color="#FFF" />
              </View>
              <Text style={styles.blueMainBtnText}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lightRectBtn}>
              <Ionicons name="call" size={20} color="#0062E1" />
              <Text style={styles.lightRectBtnText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lightRectBtn}>
              <Ionicons name="bookmark" size={20} color="#0062E1" />
              <Text style={styles.lightRectBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.lightRectBtnSmall}>
              <Ionicons name="share-outline" size={20} color="#0062E1" />
              <Text style={styles.lightRectBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={styles.mainContent}>
          {/* Image Grid */}
          <View style={styles.imageGrid}>
            <View style={styles.largeImgBox}>
              <Image source={require('../../assets/images/wood_flooring_job.png')} style={styles.gridImg} />
              <View style={styles.dateTag}><Text style={styles.dateTagText}>2 days ago</Text></View>
            </View>
            <View style={styles.smallImgCol}>
              <View style={styles.smallImgBox}>
                <Image source={require('../../assets/images/modern_kitchen_flooring.png')} style={styles.gridImg} />
                <View style={styles.dateTag}><Text style={styles.dateTagText}>2 days ago</Text></View>
              </View>
              <View style={styles.smallImgBox}>
                <Image source={require('../../assets/images/flooring_worker_action.png')} style={styles.gridImg} />
                <View style={styles.dateTag}><Text style={styles.dateTagText}>2 days ago</Text></View>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map(tab => (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
              >
                <Text style={[styles.tabItemText, activeTab === tab && styles.activeTabItemText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Details List */}
          <View style={styles.list}>
            <View style={styles.listItem}>
              <Text style={styles.listLabel}>Quote</Text>
              <Text style={styles.listValue}>$1,850.00</Text>
            </View>
            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ContractReview')}>
              <Text style={styles.listLabel}>Contract</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.listValue}>Signed, 2 Milestones</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.listItem}>
              <Text style={styles.listLabel}>Payment</Text>
              <Text style={styles.listValue}>Deposit Paid ($300)</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.listLabel}>Work Time</Text>
              <Text style={styles.listValue}>2 hrs 15 min</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        {route.params?.state === 'accepted' ? (
          <TouchableOpacity 
            style={styles.fullWidthBtn}
            onPress={() => navigation.navigate('QuoteScope', { role: 'worker' })}
          >
            <Text style={styles.btnText}>Create Quote</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.rejectBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.acceptBtn}
              onPress={() => navigation.navigate('Pricing')}
            >
              <Text style={styles.acceptBtnText}>Accept Lead</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { paddingHorizontal: 20, backgroundColor: '#fff', zIndex: 10 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerRight: { flexDirection: 'row', gap: 12 },
  headerIconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  basicInfo: { paddingBottom: 16 },
  namePriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  workerName: { fontSize: 22, fontWeight: '800', color: '#1A202C' },
  leadBadge: { backgroundColor: '#F5F3FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  leadBadgeText: { color: '#8B5CF6', fontSize: 11, fontWeight: '700' },
  address: { fontSize: 13, color: '#718096', marginBottom: 4 },
  distRow: { flexDirection: 'row', alignItems: 'center' },
  distText: { fontSize: 12, color: '#718096' },
  distDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#718096', marginHorizontal: 8 },
  priceBox: { alignItems: 'flex-end' },
  priceText: { fontSize: 22, fontWeight: '800', color: '#1A202C' },
  perHour: { fontSize: 12, color: '#94A3B8', fontWeight: '400' },

  actionRow: { flexDirection: 'row', gap: 10 },
  blueMainBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#0062E1', borderRadius: 24, flex: 1.2, height: 48 },
  blueMainBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  directionsIconContainer: { width: 22, height: 22, backgroundColor: '#0062E1', borderRadius: 6, borderWidth: 1.5, borderColor: '#FFF', transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center' },
  
  lightRectBtn: { flex: 0.8, height: 48, borderRadius: 16, backgroundColor: '#F0F9FF', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  lightRectBtnSmall: { flex: 0.8, height: 48, borderRadius: 16, backgroundColor: '#F0F9FF', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  lightRectBtnText: { fontSize: 12, fontWeight: '700', color: '#0062E1' },

  mainContent: { paddingHorizontal: 20 },
  imageGrid: { flexDirection: 'row', height: 420, gap: 12, marginBottom: 24 },
  largeImgBox: { flex: 2, borderRadius: 28, overflow: 'hidden' },
  smallImgCol: { flex: 1, gap: 12 },
  smallImgBox: { flex: 1, borderRadius: 24, overflow: 'hidden' },
  gridImg: { width: '100%', height: '100%' },
  dateTag: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  dateTagText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  tabsContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 20 },
  tabItem: { paddingVertical: 14, marginRight: 24, paddingHorizontal: 4 },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: '#008080' },
  tabItemText: { fontSize: 15, fontWeight: '700', color: '#718096' },
  activeTabItemText: { color: '#008080' },

  list: { gap: 4 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  listLabel: { fontSize: 15, color: '#718096', fontWeight: '500' },
  listValue: { fontSize: 15, fontWeight: '700', color: '#1A202C' },

  bottomBar: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  rejectBtn: { flex: 1, height: 56, backgroundColor: '#F87171', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  rejectBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  acceptBtn: { flex: 1, height: 56, backgroundColor: '#0062E1', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  acceptBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  fullWidthBtn: { width: '100%', height: 58, backgroundColor: '#0062E1', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default JobOfferDetailScreen;
