import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getJobChatMessages, sendJobChatMessage } from '../../api/apiService';
import storage from '../../api/storage';

function formatTime(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function ChatScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const chatId = route.params?.chatId;
  const title = route.params?.title || route.params?.name || 'Chat';
  const subtitle = route.params?.subtitle || route.params?.service || '';
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [myUserId, setMyUserId] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const raw = await storage.getItem('userData');
        if (raw) {
          const u = JSON.parse(raw);
          setMyUserId(u?.id || null);
        }
      } catch (_) {}
      setUserReady(true);
    })();
  }, []);

  const loadMessages = useCallback(async () => {
    if (!chatId || !userReady) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await getJobChatMessages(chatId);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Chat', res.message || 'Could not load messages');
      return;
    }
    const list = (res.data || []).map((m) => ({
      id: m.id,
      text: m.text || '',
      time: formatTime(m.created_at),
      isMine: Boolean(m.sender_id && myUserId && m.sender_id === myUserId && !m.isGuest),
      isGuest: Boolean(m.isGuest),
      senderLabel: m.users?.name || (m.isGuest ? 'Customer' : 'Staff'),
    }));
    setRows(list);
  }, [chatId, myUserId, userReady]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!chatId) return undefined;
    const timer = setInterval(() => {
      loadMessages();
    }, 3000);
    return () => clearInterval(timer);
  }, [chatId, loadMessages]);

  const onSend = async () => {
    const t = message.trim();
    if (!t || !chatId) return;
    const optimisticId = `local-${Date.now()}`;
    setRows((prev) => [
      ...prev,
      { id: optimisticId, text: t, time: formatTime(new Date().toISOString()), isMine: true, isGuest: false, senderLabel: 'You' },
    ]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
    setSending(true);
    const res = await sendJobChatMessage(chatId, t);
    setSending(false);
    if (!res.success) {
      setRows((prev) => prev.filter((m) => m.id !== optimisticId));
      Alert.alert('Send failed', res.message || 'Try again');
      return;
    }
    setMessage('');
    await loadMessages();
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.isMine;
    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && (
          <View style={styles.proAvatarSmall}>
            <Text style={styles.proAvatarSmallText}>
              {(item.senderLabel || 'C').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.proBubble]}>
          {!isUser && (
            <Text style={styles.senderNameSmall}>{item.senderLabel}</Text>
          )}
          <Text style={[styles.messageText, isUser && styles.userText]}>{item.text}</Text>
          <Text style={[styles.timeText, isUser && styles.userTimeText]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  if (!chatId) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingHorizontal: 24 }]}>
        <Text style={styles.errText}>No chat selected. Open from Messages.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerProAvatar}>
          <Text style={styles.headerProAvatarText}>{title.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{title}</Text>
          <View style={styles.onlineRow}>
            <Text style={styles.onlineText} numberOfLines={1}>
              {subtitle || 'Job chat'}
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={rows}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.messagesList, { paddingBottom: 12 + tabBarHeight }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={{ paddingVertical: 24 }}>
              <Text style={{ color: COLORS.textSecondary, textAlign: 'center', fontSize: 14 }}>
                No messages yet. Start the conversation below.
              </Text>
            </View>
          }
        />
      )}

      <View style={[styles.inputBar, { paddingBottom: tabBarHeight + Math.max(insets.bottom, 10) }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textTertiary}
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>
        <TouchableOpacity style={styles.sendBtn} onPress={onSend} disabled={sending}>
          {sending ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Ionicons name="send" size={18} color={COLORS.white} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errText: { fontSize: 15, color: COLORS.textSecondary, marginBottom: 16 },
  header: {
    paddingBottom: 14,
    paddingHorizontal: SIZES.screenPadding,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerProAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerProAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineText: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  messagesList: {
    padding: SIZES.screenPadding,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowUser: {
    flexDirection: 'row-reverse',
  },
  proAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proAvatarSmallText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  proBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    ...SHADOWS.small,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  senderNameSmall: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textTertiary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  userText: {
    color: COLORS.white,
  },
  timeText: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 4,
    textAlign: 'right',
  },
  userTimeText: {
    color: 'rgba(255,255,255,0.6)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    maxHeight: 80,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
