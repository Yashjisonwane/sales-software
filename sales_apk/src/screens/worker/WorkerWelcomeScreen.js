import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function WorkerWelcomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <View style={styles.content}>
                <Image 
                    source={require('../../../assets/Logo.png')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.getStartedBtn}
                    onPress={() => navigation.navigate('WorkerWorkType')}
                >
                    <Text style={styles.getStartedText}>Join as Professional</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => navigation.navigate('WorkerLogin')}
                >
                    <Text style={styles.loginText}>Log In</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.7,
        height: 200,
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 50,
        gap: 16,
    },
    getStartedBtn: {
        height: 56,
        backgroundColor: '#0062E1',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.medium,
    },
    getStartedText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    loginBtn: {
        height: 56,
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    loginText: {
        color: '#1E293B',
        fontSize: 16,
        fontFamily: FONTS.semiBold,
    },
});
