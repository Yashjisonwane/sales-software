import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MESSAGES = [
  { id: '1', text: 'Hi! I saw your plumbing service request.', sender: 'pro', time: '10:30 AM' },
  { id: '2', text: 'Yes, I have a leaking pipe in the kitchen.', sender: 'user', time: '10:31 AM' },
  { id: '3', text: 'Can you send me a photo of the issue?', sender: 'pro', time: '10:32 AM' },
  { id: '4', text: '📷 Photo sent', sender: 'user', time: '10:33 AM', type: 'image' },
  { id: '5', text: 'I see the problem. I can fix it today. Are you available at 2 PM?', sender: 'pro', time: '10:35 AM' },
  { id: '6', text: 'That works perfectly! Please come at 2 PM.', sender: 'user', time: '10:36 AM' },
  { id: '7', text: '📍 Location shared', sender: 'user', time: '10:37 AM', type: 'location' },
  { id: '8', text: 'Got it! See you at 2 PM then. I\'ll bring the necessary tools.', sender: 'pro', time: '10:38 AM' },
  { id: '9', text: 'Great, thank you! 🙏', sender: 'user', time: '10:39 AM' },
];

export default function ChatScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const flatListRef = useRef();

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {!isUser && (
          <View style={styles.proAvatarSmall}>
            <Text style={styles.proAvatarSmallText}>JW</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.proBubble,
          ]}
        >
          {item.type === 'image' && (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={32} color={isUser ? 'rgba(255,255,255,0.6)' : COLORS.textTertiary} />
            </View>
          )}
          {item.type === 'location' && (
            <View style={[styles.imagePlaceholder, { backgroundColor: isUser ? 'rgba(255,255,255,0.15)' : '#E0F2FE' }]}>
              <Ionicons name="location" size={24} color={isUser ? COLORS.white : COLORS.secondary} />
              <Text style={[styles.locText, isUser && { color: COLORS.white }]}>View on Map</Text>
            </View>
          )}
          <Text style={[styles.messageText, isUser && styles.userText]}>
            {item.text}
          </Text>
          <Text style={[styles.timeText, isUser && styles.userTimeText]}>
            {item.time}
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

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerProAvatar}>
          <Text style={styles.headerProAvatarText}>JW</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>John Wilson</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={MESSAGES}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="add-circle" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.textTertiary}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity>
            <Ionicons name="happy-outline" size={22} color={COLORS.textTertiary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="send" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionBtn}>
          <Ionicons name="camera" size={16} color={COLORS.primary} />
          <Text style={styles.quickActionText}>Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionBtn}>
          <Ionicons name="location" size={16} color={COLORS.success} />
          <Text style={styles.quickActionText}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionBtn}>
          <Ionicons name="image" size={16} color={COLORS.accent} />
          <Text style={styles.quickActionText}>Gallery</Text>
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
    gap: 4,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  onlineText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '500',
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
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
  imagePlaceholder: {
    width: 160,
    height: 100,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  locText: {
    fontSize: 11,
    color: COLORS.secondary,
    fontWeight: '600',
    marginTop: 4,
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
  attachBtn: {
    paddingBottom: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.screenPadding,
    paddingBottom: 20,
    paddingTop: 6,
    backgroundColor: COLORS.white,
    gap: 10,
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceAlt,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
});
