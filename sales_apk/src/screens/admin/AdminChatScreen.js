import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MESSAGES = [
  { id: '1', text: 'Hello! I need help with my kitchen sink.', sender: 'customer', time: '10:30 AM' },
  { id: '2', text: 'Hi! I can help with that. Can you describe the issue?', sender: 'pro', time: '10:31 AM' },
  { id: '3', text: 'The pipe is leaking and there is water on the floor.', sender: 'customer', time: '10:32 AM' },
  { id: '4', text: '📷 Photo received', sender: 'customer', time: '10:33 AM', type: 'image' },
  { id: '5', text: 'I see. I can fix that today. I\'ll come at 2 PM.', sender: 'pro', time: '10:35 AM' },
  { id: '6', text: 'Perfect! Here\'s my address.', sender: 'customer', time: '10:36 AM' },
  { id: '7', text: '📍 Location received', sender: 'customer', time: '10:37 AM', type: 'location' },
  { id: '8', text: 'Got it! I\'ll bring the necessary parts. See you at 2 PM!', sender: 'pro', time: '10:38 AM' },
];

export default function ProChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const flatListRef = useRef();

  const renderMessage = ({ item }) => {
    const isPro = item.sender === 'pro';
    return (
      <View style={[styles.messageRow, isPro && styles.messageRowPro]}>
        {!isPro && (
          <View style={styles.custAvatar}>
            <Text style={styles.custAvatarText}>AJ</Text>
          </View>
        )}
        <View style={[styles.bubble, isPro ? styles.proBubble : styles.custBubble]}>
          {item.type === 'image' && (
            <View style={[styles.mediaPlaceholder, isPro && { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Ionicons name="image" size={28} color={isPro ? 'rgba(255,255,255,0.6)' : COLORS.textTertiary} />
            </View>
          )}
          {item.type === 'location' && (
            <View style={[styles.mediaPlaceholder, { backgroundColor: isPro ? 'rgba(255,255,255,0.15)' : '#E0F2FE' }]}>
              <Ionicons name="location" size={22} color={isPro ? COLORS.white : COLORS.secondary} />
            </View>
          )}
          <Text style={[styles.msgText, isPro && styles.proMsgText]}>{item.text}</Text>
          <Text style={[styles.timeText, isPro && styles.proTimeText]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>AJ</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Alex Johnson</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call" size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={MESSAGES}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.msgList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputBar}>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={26} color="#8B5CF6" />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textTertiary}
            value={message}
            onChangeText={setMessage}
          />
        </View>
        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="send" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingBottom: 14, paddingHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, ...SHADOWS.small,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  headerAvatar: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#3B82F6',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  headerAvatarText: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  onlineText: { fontSize: 11, color: COLORS.success, fontWeight: '500' },
  headerAction: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#F5F3FF',
    alignItems: 'center', justifyContent: 'center',
  },
  msgList: { padding: SIZES.screenPadding, paddingBottom: 8 },
  messageRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end', gap: 8 },
  messageRowPro: { flexDirection: 'row-reverse' },
  custAvatar: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: '#3B82F6',
    alignItems: 'center', justifyContent: 'center',
  },
  custAvatarText: { fontSize: 10, fontWeight: '700', color: COLORS.white },
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 16 },
  custBubble: { backgroundColor: COLORS.white, borderBottomLeftRadius: 4, ...SHADOWS.small },
  proBubble: { backgroundColor: '#8B5CF6', borderBottomRightRadius: 4 },
  msgText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 20 },
  proMsgText: { color: COLORS.white },
  timeText: { fontSize: 10, color: COLORS.textTertiary, marginTop: 4, textAlign: 'right' },
  proTimeText: { color: 'rgba(255,255,255,0.6)' },
  mediaPlaceholder: {
    width: 150, height: 90, borderRadius: 10, backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.screenPadding,
    paddingVertical: 10, paddingBottom: 24, backgroundColor: COLORS.white,
    borderTopWidth: 1, borderTopColor: COLORS.borderLight, gap: 8,
  },
  inputWrapper: {
    flex: 1, backgroundColor: COLORS.surfaceAlt, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 10, minHeight: 40,
  },
  input: { fontSize: 14, color: COLORS.textPrimary },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#8B5CF6',
    alignItems: 'center', justifyContent: 'center',
  },
});
