import React, { useState, useRef, useEffect } from 'react';
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
import { COLORS, SIZES, SHADOWS, FONTS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getJobChatMessages, sendJobChatMessage } from '../../api/apiService';
import storage from '../../api/storage';

export default function ChatScreen({ navigation, route }) {
  const { chatId, customerName, jobNo, serviceType } = route.params || {};
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [myId, setMyId] = useState(null);
  const flatListRef = useRef();

  useEffect(() => {
    const init = async () => {
      const userStr = await storage.getItem('userData');
      if (userStr) {
        const user = JSON.parse(userStr);
        setMyId(user.id);
      }
      fetchMessages();
    };
    init();

    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  const fetchMessages = async () => {
    if (!chatId) return;
    const res = await getJobChatMessages(chatId);
    if (res.success) {
      setMessages(res.data || []);
    }
    setIsLoading(false);
  };

  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || message;
    if (!textToSend.trim() || !chatId) return;

    setMessage('');
    setIsSending(true);
    
    // Optimistic UI update
    const tempMsg = {
      id: Date.now().toString(),
      text: textToSend,
      sender_id: myId,
      created_at: new Date().toISOString(),
      users: { name: 'Me' } // Temporary
    };
    setMessages(prev => [...prev, tempMsg]);

    const res = await sendJobChatMessage(chatId, textToSend);
    if (!res.success) {
      Alert.alert('Error', res.message || 'Failed to send message');
      // Could remove tempMsg here if failed
    } else if (res.jobStatusUpdated) {
      // If status changed, maybe fetch again or show alert
      Alert.alert('Status Updated', `Job status updated based on your message.`);
    }
    
    setIsSending(false);
    fetchMessages(); // Refresh for real data
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id === myId;
    const isStatusUpdate = item.text.startsWith('[Update:');
    
    return (
      <View style={[styles.messageRow, isMe && styles.messageRowUser]}>
        {!isMe && (
          <View style={styles.proAvatarSmall}>
            <Text style={styles.proAvatarSmallText}>{customerName?.charAt(0) || 'C'}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.userBubble : styles.proBubble,
            isStatusUpdate && styles.statusBubble
          ]}
        >
          <Text style={[styles.messageText, isMe && styles.userText, isStatusUpdate && styles.statusTextBold]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isMe && styles.userTimeText]}>
            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{customerName || 'Customer'}</Text>
          <Text style={styles.headerJob}>{serviceType || 'Job'} • {jobNo || 'Active'}</Text>
        </View>
        <TouchableOpacity style={styles.headerAction} onPress={fetchMessages}>
          <Ionicons name="refresh-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {/* Quick Action Status Buttons */}
      <View style={styles.quickActionContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionScroll}>
          <TouchableOpacity style={styles.statusBtn} onPress={() => handleSend("I'm on the way!")}>
            <Text style={styles.statusBtnText}>🚗 On the Way</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statusBtn} onPress={() => handleSend("I have started work.")}>
            <Text style={styles.statusBtnText}>🛠️ Start Work</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statusBtn, { backgroundColor: '#DCFCE7' }]} onPress={() => handleSend("The job is completed.")}>
            <Text style={[styles.statusBtnText, { color: '#16A34A' }]}>✅ Completed</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Input Area */}
      <View style={[styles.inputWrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachmentBtn}>
            <Ionicons name="add" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !message.trim() && { backgroundColor: '#E2E8F0' }]} 
            onPress={() => handleSend()}
            disabled={!message.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="send" size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, marginLeft: 8 },
  headerName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  headerJob: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  headerAction: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  messagesList: { padding: 16, paddingBottom: 24 },
  messageRow: { flexDirection: 'row', marginBottom: 16, maxWidth: '80%' },
  messageRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  
  proAvatarSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  proAvatarSmallText: { fontSize: 12, fontWeight: '700', color: '#3B82F6' },

  messageBubble: { padding: 12, borderRadius: 18, backgroundColor: COLORS.white, ...SHADOWS.small },
  userBubble: { backgroundColor: '#0062E1', borderBottomRightRadius: 4 },
  proBubble: { backgroundColor: COLORS.white, borderBottomLeftRadius: 4 },
  statusBubble: { backgroundColor: '#FEF3C7', borderStyle: 'dashed', borderWidth: 1, borderColor: '#F59E0B' },

  messageText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 20 },
  userText: { color: COLORS.white },
  statusTextBold: { fontWeight: '700', color: '#92400E' },

  timeText: { fontSize: 10, color: COLORS.textTertiary, marginTop: 4, alignSelf: 'flex-end' },
  userTimeText: { color: 'rgba(255,255,255,0.7)' },

  quickActionContainer: { backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingVertical: 8 },
  quickActionScroll: { paddingHorizontal: 12, gap: 8 },
  statusBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  statusBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },

  inputWrapper: { backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingHorizontal: 16, paddingTop: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 24, paddingHorizontal: 8, paddingVertical: 4 },
  attachmentBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, color: COLORS.textPrimary, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0062E1', alignItems: 'center', justifyContent: 'center', marginLeft: 4 },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: COLORS.textSecondary, fontSize: 14 },
});
