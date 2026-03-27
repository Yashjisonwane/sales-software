import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/theme';

const MessageBubble = ({ text, time, isSender, image, voice }) => (
    <View style={[styles.bubbleWrapper, isSender ? styles.senderWrapper : styles.receiverWrapper]}>
        <View style={[styles.bubble, isSender ? styles.senderBubble : styles.receiverBubble]}>
            {text && <Text style={[styles.messageText, { color: isSender ? COLORS.white : COLORS.textPrimary }]}>{text}</Text>}
            {image && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.messageImage} />
                    <View style={styles.imageOverlay}><Text style={styles.imageOverlayText}>floor-progress.jpg</Text></View>
                </View>
            )}
            {voice && (
                <View style={styles.voiceContainer}>
                    <TouchableOpacity style={styles.playBtn}><Ionicons name="play" size={20} color={isSender ? COLORS.white : '#0062E1'} /></TouchableOpacity>
                    <View style={styles.waveContainer}>
                        {[...Array(20)].map((_, i) => (
                            <View key={i} style={[styles.waveBar, { height: 10 + Math.random() * 20, backgroundColor: isSender ? COLORS.white : '#E2E8F0' }]} />
                        ))}
                    </View>
                    <Text style={[styles.voiceDuration, { color: isSender ? COLORS.white : COLORS.textTertiary }]}>{voice}</Text>
                </View>
            )}
        </View>
        <View style={[styles.bubbleInfo, isSender && { alignSelf: 'flex-end' }]}>
            <Text style={styles.timeText}>{time}</Text>
            {isSender && <Ionicons name="checkmark-done" size={16} color="#3B82F6" style={{ marginLeft: 4 }} />}
        </View>
    </View>
);

export default function ChatScreen({ route, navigation }) {
    const { name = 'Sarah Johnson' } = route.params || {};
    const [message, setMessage] = useState('');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileInfo}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>SJ</Text></View>
                    <View>
                        <Text style={styles.senderName}>{name}</Text>
                        <Text style={styles.senderSub}>Kitchen Renovation</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}><Ionicons name="call-outline" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}><Ionicons name="information-circle-outline" size={24} color={COLORS.textPrimary} /></TouchableOpacity>
            </View>

            <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                <MessageBubble text="Hi, what time will the team arrive today?" time="9:15 AM" isSender={false} />
                <MessageBubble text="Hello Sarah! The team will arrive at 10:30 AM." time="9:18 AM" isSender={true} />
                <MessageBubble text="Great, thank you 👍" time="9:15 AM" isSender={false} />
                <MessageBubble voice="0:10" time="9:18 AM" isSender={true} />
                <MessageBubble image="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80" time="9:18 AM" isSender={true} />
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputBar}>
                    <TouchableOpacity style={styles.inputAction}><Ionicons name="add" size={24} color={COLORS.textTertiary} /></TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Type a message..."
                            style={styles.textInput}
                            value={message}
                            onChangeText={setMessage}
                        />
                        <TouchableOpacity style={styles.inputAction}><Ionicons name="mic-outline" size={24} color={COLORS.textTertiary} /></TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.sendBtn}>
                        <Ionicons name="send" size={20} color={message ? '#0062E1' : COLORS.textTertiary} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    header: {
        paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16,
        backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    },
    backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    profileInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, marginLeft: 8 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
    senderName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
    senderSub: { fontSize: 12, color: COLORS.textTertiary },
    actionBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

    chatList: { flex: 1 },
    bubbleWrapper: { marginBottom: 16, maxWidth: '80%' },
    senderWrapper: { alignSelf: 'flex-end' },
    receiverWrapper: { alignSelf: 'flex-start' },
    bubble: { padding: 12, borderRadius: 16 },
    senderBubble: { backgroundColor: '#0062E1', borderBottomRightRadius: 4 },
    receiverBubble: { backgroundColor: '#F1F5F9', borderBottomLeftRadius: 4 },
    messageText: { fontSize: 15, lineHeight: 20 },
    bubbleInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    timeText: { fontSize: 10, color: COLORS.textTertiary },

    imageContainer: { borderRadius: 12, overflow: 'hidden' },
    messageImage: { width: 240, height: 160 },
    imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(0,98,225,0.8)' },
    imageOverlayText: { color: COLORS.white, fontSize: 10 },

    voiceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 150 },
    playBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
    waveContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2 },
    waveBar: { width: 2, borderRadius: 1 },
    voiceDuration: { fontSize: 12 },

    inputBar: {
        padding: 12, paddingBottom: 30, flexDirection: 'row', alignItems: 'center', gap: 8,
        borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: COLORS.white,
    },
    inputAction: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    inputContainer: { flex: 1, height: 44, backgroundColor: '#F8FAFC', borderRadius: 22, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1, borderColor: '#E2E8F0' },
    textInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
    sendBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
