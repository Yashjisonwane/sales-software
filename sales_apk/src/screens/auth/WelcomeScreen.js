import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <View style={styles.content}>
        <Image
          source={require('../../../assets/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.getStartedBtn}
          onPress={() => navigation.navigate('RoleSelect')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        {/* Guest Access */}
        <TouchableOpacity
          style={styles.guestBtn}
          onPress={() => navigation.navigate('WorkerTabs')}
        >
          <Ionicons name="eye-outline" size={16} color="#718096" />
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: width * 0.7,
    height: 200,
  },
  buttonContainer: {
    gap: 15,
  },
  getStartedBtn: {
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0E56D0',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  loginBtn: {
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1A202C',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginText: {
    color: '#1A202C',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  guestText: {
    color: '#718096',
    fontSize: 14,
    fontFamily: FONTS.medium,
    textDecorationLine: 'underline',
  },
});
