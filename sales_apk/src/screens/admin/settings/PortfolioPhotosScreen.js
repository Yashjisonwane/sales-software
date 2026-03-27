import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../../constants/theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2;

export default function PortfolioPhotosScreen({ navigation }) {
  const [photos, setPhotos] = useState([1, 2, 3, 4]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Portfolio Photos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => Alert.alert("Upload Photo", "Choose a photo from your gallery to add to your portfolio.")}
          >
            <Ionicons name="camera" size={30} color="#8B5CF6" />
            <Text style={styles.addBtnText}>Add Photo</Text>
          </TouchableOpacity>

          {photos.map((id) => (
            <View key={id} style={styles.photoCard}>
              <View style={styles.placeholderImg}>
                <Ionicons name="image" size={40} color={COLORS.textTertiary} />
                <Text style={styles.placeholderText}>Work Photo {id}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => Alert.alert("Delete Photo", "Are you sure you want to remove this photo from your portfolio?")}
              >
                <Ionicons name="trash" size={16} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>


        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <Text style={styles.infoBoxText}>Portfolio photos help customers trust your quality of work. Upload clear photos of your previous jobs.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, backgroundColor: COLORS.white,
    flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  addBtn: {
    width: ITEM_WIDTH, height: ITEM_WIDTH, borderRadius: 20, backgroundColor: COLORS.white,
    borderWidth: 2, borderColor: '#8B5CF6', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#8B5CF6' },
  photoCard: {
    width: ITEM_WIDTH, height: ITEM_WIDTH, borderRadius: 20,
    backgroundColor: COLORS.white, overflow: 'hidden', ...SHADOWS.small,
  },
  placeholderImg: { flex: 1, backgroundColor: COLORS.surfaceAlt, alignItems: 'center', justifyContent: 'center', gap: 6 },
  placeholderText: { fontSize: 11, color: COLORS.textTertiary, fontWeight: '500' },
  deleteBtn: { position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  infoBox: { flexDirection: 'row', backgroundColor: '#EFF6FF', borderRadius: 16, padding: 16, marginTop: 30, gap: 12, alignItems: 'center' },
  infoBoxText: { flex: 1, fontSize: 12, color: '#3B82F6', lineHeight: 18, fontWeight: '500' },
});
