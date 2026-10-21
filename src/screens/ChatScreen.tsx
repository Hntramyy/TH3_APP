import { useHeaderHeight } from '@react-navigation/elements';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
import { useChat } from '../context/ChatContext';
import { CURRENT_USER_ID } from '../data/mockData';
import type { RootStackScreenProps } from '../navigation/types';
import { colors, fontSize, radius, spacing } from '../theme';
import type { Message } from '../types';
import { formatClock, formatRelative } from '../utils/format';

export default function ChatScreen({
  navigation,
  route,
}: RootStackScreenProps<'Chat'>) {
  const { conversationId } = route.params;
  const {
    getConversation,
    getContact,
    sendMessage,
    markConversationRead,
    settings,
  } = useChat();
  const conversation = getConversation(conversationId);
  const contact = conversation ? getContact(conversation.contactId) : undefined;

  const [text, setText] = useState('');
  const isFocused = useIsFocused();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    if (!contact) {
      return;
    }
    const showStatus = settings.showOnlineStatus;
    navigation.setOptions({
      headerBackTitle: '',
      headerTitle: () => (
        <View style={styles.header}>
          <Avatar
            uri={contact.avatar}
            name={contact.name}
            size={36}
            online={showStatus ? contact.online : undefined}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerName} numberOfLines={1}>
              {contact.name}
            </Text>
            {showStatus && (
              <Text style={styles.headerStatus}>
                {contact.online
                  ? 'Đang hoạt động'
                  : `Hoạt động ${formatRelative(
                      contact.lastSeen,
                    ).toLowerCase()}`}
              </Text>
            )}
          </View>
        </View>
      ),
    });
  }, [navigation, contact, settings.showOnlineStatus]);

  // Đang xem cuộc trò chuyện → mọi tin nhắn (kể cả tin mới đến) đều coi là đã đọc.
  const unreadCount = conversation?.unreadCount ?? 0;
  useEffect(() => {
    if (isFocused && unreadCount > 0) {
      markConversationRead(conversationId);
    }
  }, [isFocused, unreadCount, conversationId, markConversationRead]);

  // FlatList inverted: tin mới nhất nằm ở cuối màn hình.
  const messages = useMemo(
    () => (conversation ? [...conversation.messages].reverse() : []),
    [conversation],
  );

  if (!conversation || !contact) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Không tìm thấy cuộc trò chuyện"
      />
    );
  }

  const handleSend = () => {
    if (!text.trim()) {
      return;
    }
    sendMessage(conversationId, text);
    setText('');
  };

  const renderItem = ({ item }: { item: Message }) => {
    const mine = item.senderId === CURRENT_USER_ID;
    return (
      <View style={[styles.messageRow, mine && styles.messageRowMine]}>
        <View
          style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}
        >
          <Text style={[styles.messageText, mine && styles.messageTextMine]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, mine && styles.messageTimeMine]}>
            {formatClock(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const canSend = text.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        inverted={messages.length > 0}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            icon="hand-left-outline"
            title={`Bắt đầu trò chuyện với ${contact.name}`}
            subtitle="Hãy gửi lời chào đầu tiên!"
          />
        }
      />

      <View
        style={[
          styles.inputBar,
          { paddingBottom: Math.max(insets.bottom, spacing.sm) },
        ]}
      >
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          accessibilityLabel="Gửi tin nhắn"
        >
          <Icon
            name="send"
            size={18}
            color={colors.white}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: spacing.sm + 2,
    maxWidth: 220,
  },
  headerName: {
    fontSize: fontSize.md + 1,
    fontWeight: '700',
    color: colors.text,
  },
  headerStatus: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 6,
    borderRadius: radius.lg,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 21,
  },
  messageTextMine: {
    color: colors.white,
  },
  messageTime: {
    marginTop: 2,
    alignSelf: 'flex-end',
    fontSize: 11,
    color: colors.textMuted,
  },
  messageTimeMine: {
    color: 'rgba(255,255,255,0.75)',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    paddingHorizontal: spacing.lg,
    paddingTop: 11,
    paddingBottom: 11,
    borderRadius: 21,
    backgroundColor: colors.background,
    fontSize: fontSize.md,
    color: colors.text,
  },
  sendButton: {
    width: 42,
    height: 42,
    marginLeft: spacing.sm,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
  sendIcon: {
    marginLeft: 2,
  },
});
