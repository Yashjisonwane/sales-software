import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const SERVICES_LIST = [
  'Plumbing',
  'Electrical',
  'Cleaning',
  'HVAC',
  'Painting',
  'Roofing',
  'Handyman',
  'Landscaping',
];

export default function RequestServiceScreen({ navigation }) {
  const [selectedService, setSelectedService] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [showServicePicker, setShowServicePicker] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Service</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <LinearGradient
          colors={['#EEF2FF', '#E0E7FF']}
          style={styles.banner}
        >
          <Ionicons name="document-text" size={28} color={COLORS.primary} />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Fill in the details</Text>
            <Text style={styles.bannerDesc}>
              Provide accurate info to get the best service match
            </Text>
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.formSection}>
          {/* Service */}
          <Text style={styles.label}>Service Type *</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setShowServicePicker(!showServicePicker)}
          >
            <Ionicons name="construct-outline" size={18} color={COLORS.textTertiary} />
            <Text
              style={[
                styles.selectText,
                selectedService && styles.selectTextActive,
              ]}
            >
              {selectedService || 'Select a service'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>

          {showServicePicker && (
            <View style={styles.pickerDropdown}>
              {SERVICES_LIST.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.pickerItem,
                    selectedService === s && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setSelectedService(s);
                    setShowServicePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedService === s && styles.pickerItemTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                  {selectedService === s && (
                    <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the issue or service you need..."
              placeholderTextColor={COLORS.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Address */}
          <Text style={styles.label}>Address *</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="location-outline" size={18} color={COLORS.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              placeholderTextColor={COLORS.textTertiary}
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity
              style={styles.gpsBtn}
              onPress={() => Alert.alert("Location", "Fetching your current GPS location...")}
            >
              <Ionicons name="navigate" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Upload Photos */}
          <Text style={styles.label}>Upload Photos</Text>
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={() => Alert.alert("Upload", "Select photos from your gallery or take a new one.")}
          >
            <View style={styles.uploadIconBg}>
              <Ionicons name="cloud-upload" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.uploadTitle}>Tap to upload photos</Text>
            <Text style={styles.uploadDesc}>PNG, JPG up to 5MB each</Text>
          </TouchableOpacity>

          {/* Photo previews */}
          <View style={styles.photoRow}>
            <View style={styles.photoThumb}>
              <Ionicons name="image" size={20} color={COLORS.textTertiary} />
            </View>
            <View style={styles.photoThumb}>
              <Ionicons name="image" size={20} color={COLORS.textTertiary} />
            </View>
            <View style={[styles.photoThumb, styles.addPhotoThumb]}>
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </View>
          </View>

          {/* Preferred Date */}
          <Text style={styles.label}>Preferred Date *</Text>
          <TouchableOpacity style={styles.inputWrapper}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textTertiary} />
            <Text
              style={[
                styles.input,
                { color: date ? COLORS.textPrimary : COLORS.textTertiary },
              ]}
            >
              {date || 'Select preferred date'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>

          {/* Urgency */}
          <Text style={styles.label}>Urgency Level</Text>
          <View style={styles.urgencyRow}>
            {['Normal', 'Urgent', 'Emergency'].map((u, i) => (
              <TouchableOpacity
                key={u}
                style={[
                  styles.urgencyChip,
                  i === 0 && styles.urgencyActive,
                ]}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    i === 0 && styles.urgencyTextActive,
                  ]}
                >
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.submitContainer}
          onPress={() => {
            if (!selectedService || !description || !address) {
              Alert.alert("Error", "Please fill in all required fields.");
              return;
            }
            Alert.alert("Success", "Your service request has been submitted!");
            navigation.navigate('MyRequests');
          }}
        >
          <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.submitBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="send" size={18} color={COLORS.white} />
            <Text style={styles.submitText}>Submit Request</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SIZES.screenPadding,
    paddingBottom: 40,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: SIZES.radiusMd,
    marginBottom: 24,
    gap: 14,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  bannerDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  formSection: {},
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.inputRadius,
    paddingHorizontal: 16,
    marginBottom: 18,
    height: SIZES.inputHeight,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.inputRadius,
    paddingHorizontal: 16,
    marginBottom: 18,
    height: SIZES.inputHeight,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 10,
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textTertiary,
  },
  selectTextActive: {
    color: COLORS.textPrimary,
  },
  pickerDropdown: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    marginTop: -10,
    marginBottom: 18,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  pickerItemActive: {
    backgroundColor: '#EEF2FF',
  },
  pickerItemText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  pickerItemTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  textAreaWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.inputRadius,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 18,
    overflow: 'hidden',
  },
  textArea: {
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 16,
    minHeight: 100,
  },
  gpsBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadArea: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusMd,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    padding: 28,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  uploadDesc: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  photoThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addPhotoThumb: {
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  urgencyChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  urgencyActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  urgencyText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  urgencyTextActive: {
    color: COLORS.white,
  },
  submitContainer: {
    marginTop: 4,
  },
  submitBtn: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.buttonRadius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});
