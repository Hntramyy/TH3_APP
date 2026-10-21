import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar';
import Separator from '../components/Separator';
import { useChat } from '../context/ChatContext';
import type { MainTabScreenProps } from '../navigation/types';
import { colors, fontSize, radius, spacing } from '../theme';
import type { Contact } from '../types';
import { formatRelative, matchesQuery } from '../utils/format';

type Filter = 'all' | 'online';

export default function ContactsScreen({
  navigation,
}: MainTabScreenProps<'Contacts'>) {
  const { contacts, openConversationWith, settings } = useChat();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const onlineCount = useMemo(
    () => contacts.filter(c => c.online).length,
    [contacts],
  );

  const data = useMemo(
    () =>
      contacts
        .filter(c => (filter === 'online' ? c.online : true))
        .filter(c => matchesQuery(c.name, query))
        .sort((a, b) => a.name.localeCompare(b.name, 'vi')),
    [contacts, filter, query],
  );

  const openChat = (contact: Contact) => {
    const conversationId = openConversationWith(contact.id);
    navigation.navigate('Chat', { conversationId });
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => openChat(item)}
    >
      <Avatar
        uri={item.avatar}
        name={item.name}
        size={48}
        online={settings.showOnlineStatus ? item.online : undefined}
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.status, item.online && styles.statusOnline]}>
          {item.online
            ? 'Đang hoạt động'
            : `Hoạt động ${formatRelative(item.lastSeen).toLowerCase()}`}
        </Text>
      </View>
      <Icon name="chatbubble-outline" size={20} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Tìm kiếm danh bạ"
      />

      <View style={styles.filters}>
        {(
          [
            ['all', `Tất cả (${contacts.length})`],
            ['online', `Đang hoạt động (${onlineCount})`],
          ] as const
        ).map(([key, label]) => {
          const active = filter === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setFilter(key)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="Không tìm thấy người dùng"
            subtitle={query ? `Không có kết quả cho "${query}"` : undefined}
          />
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
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.white,
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
  name: {
    fontSize: fontSize.md + 1,
    fontWeight: '600',
    color: colors.text,
  },
  status: {
    marginTop: 2,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  statusOnline: {
    color: colors.online,
    fontWeight: '500',
  },
});
