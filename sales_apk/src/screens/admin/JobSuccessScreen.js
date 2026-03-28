import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const JobSuccessScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const isWorker = route.params?.role === 'worker';
  const homeRoute = isWorker ? 'WorkerTabs' : 'AdminTabs';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.navigate(homeRoute)}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.main}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={60} color="#fff" />
          </View>
          <Text style={styles.title}>Lead Assigned</Text>
          <Text style={styles.subtext}>
            The worker has received this job and will review it shortly.
          </Text>
        </View>
      </View>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate(homeRoute)}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 20 },
  closeBtn: { alignSelf: 'flex-end', marginTop: 60, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#0E56D0', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A202C', marginBottom: 12 },
  subtext: { fontSize: 16, color: '#718096', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  bottomContainer: { padding: 16 },
  homeBtn: { height: 56, backgroundColor: '#0E56D0', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default JobSuccessScreen;
