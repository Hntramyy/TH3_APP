import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import Separator from '../components/Separator';
import { useChat } from '../context/ChatContext';
import { CURRENT_USER_ID } from '../data/mockData';
import type { MainTabScreenProps } from '../navigation/types';
import { colors, fontSize, spacing } from '../theme';
import type { Contact, Message } from '../types';
import { formatListTime, matchesQuery } from '../utils/format';

interface ConversationRow {
  id: string;
  contact: Contact;
  lastMessage: Message;
  unreadCount: number;
}

export default function HomeScreen({ navigation }: MainTabScreenProps<'Home'>) {
  const { conversations, getContact, settings } = useChat();
  const [query, setQuery] = useState('');

  const rows = useMemo<ConversationRow[]>(() => {
    const list: ConversationRow[] = [];
    for (const c of conversations) {
      const contact = getContact(c.contactId);
      const lastMessage = c.messages[c.messages.length - 1];
      // Ẩn cuộc trò chuyện rỗng (vừa mở từ danh bạ nhưng chưa nhắn).
      if (!contact || !lastMessage) {
        continue;
      }
      if (
        !matchesQuery(contact.name, query) &&
        !matchesQuery(lastMessage.text, query)
      ) {
        continue;
      }
      list.push({ id: c.id, contact, lastMessage, unreadCount: c.unreadCount });
    }
    return list.sort(
      (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt,
    );
  }, [conversations, getContact, query]);

  const renderItem = ({ item }: { item: ConversationRow }) => {
    const unread = item.unreadCount > 0;
    const fromMe = item.lastMessage.senderId === CURRENT_USER_ID;
    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
      >
        <Avatar
          uri={item.contact.avatar}
          name={item.contact.name}
          online={settings.showOnlineStatus ? item.contact.online : undefined}
        />
        <View style={styles.body}>
          <View style={styles.line}>
            <Text
              style={[styles.name, unread && styles.bold]}
              numberOfLines={1}
            >
              {item.contact.name}
            </Text>
            <Text style={[styles.time, unread && styles.timeUnread]}>
              {formatListTime(item.lastMessage.createdAt)}
            </Text>
          </View>
          <View style={styles.line}>
            <Text
              style={[styles.preview, unread && styles.previewUnread]}
              numberOfLines={1}
            >
              {fromMe ? 'Bạn: ' : ''}
              {item.lastMessage.text}
            </Text>
            <Badge count={item.unreadCount} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Tìm kiếm cuộc trò chuyện"
      />
      <FlatList
        data={rows}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={rows.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          query ? (
            <EmptyState
              icon="search-outline"
              title="Không tìm thấy cuộc trò chuyện"
              subtitle={`Không có kết quả cho "${query}"`}
            />
          ) : (
            <EmptyState
              icon="chatbubbles-outline"
              title="Chưa có cuộc trò chuyện"
              subtitle="Vào Danh bạ để bắt đầu nhắn tin"
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  body: {
    flex: 1,
    marginLeft: spacing.md,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: fontSize.md + 1,
    fontWeight: '500',
    color: colors.text,
    marginRight: spacing.sm,
  },
  bold: {
    fontWeight: '700',
  },
  time: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  timeUnread: {
    color: colors.primary,
    fontWeight: '600',
  },
  preview: {
    flex: 1,
    marginTop: 3,
    marginRight: spacing.sm,
    fontSize: fontSize.sm + 1,
    color: colors.textSecondary,
  },
  previewUnread: {
    color: colors.text,
    fontWeight: '600',
  },
});
