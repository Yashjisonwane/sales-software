import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

const AddMemberScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // Form States
  const [memberType, setMemberType] = useState('');
  const [profession, setProfession] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const InputField = ({ label, placeholder, value, onChangeText, icon, keyboardType = 'default', isDropdown = false }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.inputWrapper}
        disabled={!isDropdown && !icon}
        activeOpacity={0.7}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={!isDropdown}
        />
        {isDropdown ? (
          <Ionicons name="chevron-down" size={20} color="#000" />
        ) : icon ? (
          <Ionicons name={icon} size={20} color="#000" />
        ) : null}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Member</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        <View style={styles.formCard}>
          <InputField 
            label="Member Type" 
            placeholder="Member Type" 
            value={memberType} 
            onChangeText={setMemberType} 
            isDropdown={true} 
          />
          
          <InputField 
            label="Profession" 
            placeholder="Member's Profession" 
            value={profession} 
            onChangeText={setProfession} 
            isDropdown={true} 
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <InputField 
                label="First Name" 
                placeholder="First Name" 
                value={firstName} 
                onChangeText={setFirstName} 
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <InputField 
                label="Last Name" 
                placeholder="Last Name" 
                value={lastName} 
                onChangeText={setLastName} 
              />
            </View>
          </View>

          <InputField 
            label="Email" 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
          />
          
          <InputField 
            label="Phone Number" 
            placeholder="Phone Number" 
            value={phone} 
            onChangeText={setPhone} 
            keyboardType="phone-pad" 
          />
          
          <InputField 
            label="Working Area" 
            placeholder="Select Location" 
            value={location} 
            onChangeText={setLocation} 
            icon="location" 
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.inviteBtn}
          onPress={() => {
            alert('Invitation Sent!');
            navigation.goBack();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.inviteBtnText}>Invite</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#000',
    textAlign: 'center' 
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center' 
  },
  scrollContent: { 
    padding: 20 
  },
  formCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    paddingTop: 24,
  },
  inputContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#1E293B', 
    marginBottom: 10,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    height: 54,
    paddingHorizontal: 20,
    ...SHADOWS.small,
    shadowOpacity: 0.05,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  input: { 
    flex: 1, 
    fontSize: 15, 
    color: '#000',
    fontWeight: '500',
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  inviteBtn: {
    backgroundColor: '#0E56D0',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  inviteBtnText: { 
    color: COLORS.white, 
    fontSize: 16, 
    fontWeight: '700' 
  },
});

export default AddMemberScreen;
