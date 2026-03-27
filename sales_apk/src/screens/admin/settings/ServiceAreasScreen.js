import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { COLORS, SHADOWS } from '../../../constants/theme';

export default function ServiceAreasScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [radius, setRadius] = useState(15); // km

  const handleUpdate = () => {
    Alert.alert("Success", "Service area updated to " + radius + "km radius!");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Area</Text>
      </View>

      <View style={styles.mapContainer}>
        <WebView
          source={{ html: `<iframe src="https://maps.google.com/maps?q=${region.latitude},${region.longitude}&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>` }}
          style={styles.map}
        />

        {/* Floating Controls */}
        <View style={styles.controls}>
          <Text style={styles.controlTitle}>Service Radius: {radius} km</Text>
          <View style={styles.sliderRow}>
            <TouchableOpacity onPress={() => setRadius(Math.max(1, radius - 5))} style={styles.radiusBtn}>
              <Ionicons name="remove" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.radiusDisplay}>
              <Text style={styles.radiusText}>{radius}</Text>
              <Text style={styles.unitText}>km</Text>
            </View>
            <TouchableOpacity onPress={() => setRadius(Math.min(100, radius + 5))} style={styles.radiusBtn}>
              <Ionicons name="add" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>Drag the map to change your center location</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleUpdate}>
          <Text style={styles.saveBtnText}>Update Location & Radius</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: COLORS.white,
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
    zIndex: 10,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  mapContainer: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  controls: {
    position: 'absolute', bottom: 30, left: 20, right: 20,
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20, ...SHADOWS.large,
  },
  controlTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 15 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  radiusBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  radiusDisplay: { alignItems: 'center' },
  radiusText: { fontSize: 24, fontWeight: '800', color: '#8B5CF6' },
  unitText: { fontSize: 12, color: COLORS.textTertiary, fontWeight: '600' },
  helperText: { textAlign: 'center', fontSize: 12, color: COLORS.textTertiary, marginTop: 15 },
  footer: { padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  saveBtn: {
    backgroundColor: '#8B5CF6', height: 55, borderRadius: 16, alignItems: 'center',
    justifyContent: 'center', ...SHADOWS.medium,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
