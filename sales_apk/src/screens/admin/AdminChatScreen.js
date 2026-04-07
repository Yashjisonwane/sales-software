import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, StatusBar, KeyboardAvoidingView, Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDirectMessages, sendDirectMessage } from '../../api/apiService';

export default function AdminChatScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { name, userId } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef();

  const loadChat = async () => {
    const res = await getDirectMessages(userId);
    if(res.success) {
      setMessages(res.data.messages || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadChat();
  }, [userId]);

  const handleSend = async () => {
    if (!userId || !inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText('');

    const res = await sendDirectMessage(userId, textToSend);
    if(res.success) {
       // Append locally or re-fetch
       setMessages(prev => [...prev, res.data]);
       setTimeout(() => flatListRef.current?.scrollToEnd(), 200);
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId !== userId; // if senderId is NOT the worker, then it's the admin
    return (
      <View style={[styles.messageRow, isMe && styles.messageRowPro]}>
        {!isMe && (
          <View style={styles.custAvatar}>
            <Text style={styles.custAvatarText}>{name?.charAt(0) || 'W'}</Text>
          </View>
        )}
        <View style={[styles.bubble, isMe ? styles.proBubble : styles.custBubble]}>
          <Text style={[styles.msgText, isMe && styles.proMsgText]}>{item.text}</Text>
          <Text style={[styles.timeText, isMe && styles.proTimeText]}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
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
          <Text style={styles.headerAvatarText}>{name?.charAt(0) || 'W'}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name || 'Worker'}</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Direct · message history</Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color="#8B5CF6" /></View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      )}

      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textTertiary}
            value={inputText}
            onChangeText={setInputText}
          />
        </View>
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
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
    paddingVertical: 10, backgroundColor: COLORS.white,
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
